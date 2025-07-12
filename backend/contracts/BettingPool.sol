// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IFanToken.sol";
import "./ISwapRouter.sol";
import "./IPOAP.sol";

contract BettingPool {
    // Events
    event BetPlaced(
        address indexed user,
        address indexed teamToken,
        uint256 amount,
        uint256 multiplier
    );
    event MatchStarted(uint256 startTime);
    event MatchEnded(address indexed winningTeamToken);
    event Claimed(address indexed user, uint256 amount);
    event AdminClaimed(uint256 amount);
    event GlobalClaimed(uint256 amount);
    event WithdrawalsBlocked(uint256 blockTime);

    // Enums
    enum MatchStatus {
        UPCOMING,
        IN_PROGRESS,
        STOPPED,
        FINISHED
    }

    // Structs
    struct Bet {
        uint256 amount;
        uint256 multiplier;
        bool claimed;
    }

    struct TeamPool {
        address token;
        uint256 totalAmount;
        mapping(address => Bet) bets;
        address[] bettors;
    }

    // State variables
    address public immutable factory;
    address public immutable swapRouter;
    address public immutable poapContract;
    uint256 public immutable matchStartTime;
    uint256 public immutable matchEndTime;
    uint256 public immutable withdrawalBlockTime; // 1 hour before match
    uint256 public constant MIN_BET_AMOUNT = 10 * 10 ** 18; // 10 tokens minimum
    uint256 public constant CLAIM_ADMIN_DELAY = 365 days;
    uint256 public constant CLAIM_GLOBAL_DELAY = 730 days; // 2 years

    MatchStatus public matchStatus;
    address public immutable team1Token;
    address public immutable team2Token;
    address public winningTeamToken;

    TeamPool public team1Pool;
    TeamPool public team2Pool;

    mapping(address => uint256) public userMatchCount; // Track user's match attendance
    mapping(address => bool) public hasClaimed;

    // Modifiers
    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call this");
        _;
    }

    modifier onlyBeforeMatch() {
        require(block.timestamp < matchStartTime, "Match already started");
        _;
    }

    modifier onlyAfterMatch() {
        require(block.timestamp >= matchEndTime, "Match not finished");
        _;
    }

    modifier onlyBeforeWithdrawalBlock() {
        require(block.timestamp < withdrawalBlockTime, "Withdrawals blocked");
        _;
    }

    modifier onlyAfterWithdrawalBlock() {
        require(
            block.timestamp >= withdrawalBlockTime,
            "Withdrawals not yet blocked"
        );
        _;
    }

    constructor(
        address _factory,
        address _swapRouter,
        address _poapContract,
        address _team1Token,
        address _team2Token,
        uint256 _matchStartTime,
        uint256 _matchDuration
    ) {
        require(_factory != address(0), "Factory cannot be zero address");
        require(_swapRouter != address(0), "SwapRouter cannot be zero address");
        require(
            _poapContract != address(0),
            "POAP contract cannot be zero address"
        );
        require(
            _team1Token != address(0),
            "Team1 token cannot be zero address"
        );
        require(
            _team2Token != address(0),
            "Team2 token cannot be zero address"
        );

        factory = _factory;
        swapRouter = _swapRouter;
        poapContract = _poapContract;
        team1Token = _team1Token;
        team2Token = _team2Token;
        matchStartTime = _matchStartTime;
        matchEndTime = _matchStartTime + _matchDuration;
        withdrawalBlockTime = _matchStartTime - 1 hours;

        team1Pool.token = _team1Token;
        team2Pool.token = _team2Token;

        matchStatus = MatchStatus.UPCOMING;
    }

    /**
     * @dev Place a bet on a team
     * @param teamToken The token of the team to bet on
     * @param amount Amount of tokens to bet
     */
    function placeBet(
        address teamToken,
        uint256 amount
    ) external onlyBeforeWithdrawalBlock {
        require(
            teamToken == team1Token || teamToken == team2Token,
            "Invalid team token"
        );
        require(amount >= MIN_BET_AMOUNT, "Bet amount too low");
        require(matchStatus == MatchStatus.UPCOMING, "Match already started");

        // Transfer tokens from user to contract
        bool success = IFanToken(teamToken).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "Transfer failed");

        // Calculate multiplier based on POAP attendance
        uint256 multiplier = calculateMultiplier(msg.sender);

        // Add bet to appropriate pool
        if (teamToken == team1Token) {
            _addBetToPool(team1Pool, msg.sender, amount, multiplier);
        } else {
            _addBetToPool(team2Pool, msg.sender, amount, multiplier);
        }

        emit BetPlaced(msg.sender, teamToken, amount, multiplier);
    }

    /**
     * @dev Start the match (can only be called by factory)
     */
    function startMatch() external onlyFactory onlyBeforeMatch {
        require(matchStatus == MatchStatus.UPCOMING, "Match already started");
        matchStatus = MatchStatus.IN_PROGRESS;
        emit MatchStarted(block.timestamp);
    }

    /**
     * @dev End the match and set the winner
     * @param _winningTeamToken The token of the winning team
     */
    function endMatch(
        address _winningTeamToken
    ) external onlyFactory onlyAfterMatch {
        require(
            matchStatus == MatchStatus.IN_PROGRESS,
            "Match not in progress"
        );
        require(
            _winningTeamToken == team1Token || _winningTeamToken == team2Token,
            "Invalid winning team"
        );

        winningTeamToken = _winningTeamToken;
        matchStatus = MatchStatus.FINISHED;

        emit MatchEnded(_winningTeamToken);
    }

    /**
     * @dev Claim winnings for a user
     * @param user Address of the user claiming
     */
    function claimWinnings(address user) external {
        require(matchStatus == MatchStatus.FINISHED, "Match not finished");
        require(!hasClaimed[user], "Already claimed");
        require(winningTeamToken != address(0), "Winner not set");

        hasClaimed[user] = true;

        uint256 totalWinnings = 0;

        // Check team1 pool
        if (team1Pool.token == winningTeamToken) {
            totalWinnings += _calculateWinnings(team1Pool, user);
        } else {
            // Swap losing team tokens for winning team tokens
            totalWinnings += _swapAndCalculateWinnings(team1Pool, user);
        }

        // Check team2 pool
        if (team2Pool.token == winningTeamToken) {
            totalWinnings += _calculateWinnings(team2Pool, user);
        } else {
            // Swap losing team tokens for winning team tokens
            totalWinnings += _swapAndCalculateWinnings(team2Pool, user);
        }

        if (totalWinnings > 0) {
            bool success = IFanToken(winningTeamToken).transfer(
                user,
                totalWinnings
            );
            require(success, "Transfer failed");
            emit Claimed(user, totalWinnings);
        }
    }

    /**
     * @dev Admin claim for unclaimed tokens after 1 year
     */
    function adminClaim() external onlyFactory {
        require(
            block.timestamp >= matchEndTime + CLAIM_ADMIN_DELAY,
            "Too early for admin claim"
        );
        require(matchStatus == MatchStatus.FINISHED, "Match not finished");

        uint256 totalUnclaimed = 0;

        // Calculate unclaimed amounts
        totalUnclaimed += _calculateUnclaimedAmount(team1Pool);
        totalUnclaimed += _calculateUnclaimedAmount(team2Pool);

        if (totalUnclaimed > 0) {
            bool success = IFanToken(winningTeamToken).transfer(
                factory,
                totalUnclaimed
            );
            require(success, "Transfer failed");
            emit AdminClaimed(totalUnclaimed);
        }
    }

    /**
     * @dev Global claim for remaining tokens after 2 years
     */
    function globalClaim() external onlyFactory {
        require(
            block.timestamp >= matchEndTime + CLAIM_GLOBAL_DELAY,
            "Too early for global claim"
        );
        require(matchStatus == MatchStatus.FINISHED, "Match not finished");

        uint256 totalRemaining = 0;

        // Transfer all remaining tokens
        totalRemaining += IFanToken(team1Token).balanceOf(address(this));
        totalRemaining += IFanToken(team2Token).balanceOf(address(this));

        if (totalRemaining > 0) {
            // Transfer to factory
            if (IFanToken(team1Token).balanceOf(address(this)) > 0) {
                bool success1 = IFanToken(team1Token).transfer(
                    factory,
                    IFanToken(team1Token).balanceOf(address(this))
                );
                require(success1, "Transfer failed");
            }
            if (IFanToken(team2Token).balanceOf(address(this)) > 0) {
                bool success2 = IFanToken(team2Token).transfer(
                    factory,
                    IFanToken(team2Token).balanceOf(address(this))
                );
                require(success2, "Transfer failed");
            }
            emit GlobalClaimed(totalRemaining);
        }
    }

    /**
     * @dev Calculate multiplier based on POAP attendance
     * @param user Address of the user
     * @return Multiplier value (0.8 to 1.5)
     */
    function calculateMultiplier(address user) public view returns (uint256) {
        uint256 matchCount = userMatchCount[user];

        if (matchCount == 0) return 80; // 0.8 * 100
        if (matchCount >= 100) return 150; // 1.5 * 100
        if (matchCount >= 5) return 100; // 1.0 * 100

        // Logarithmic curve from 0.8 to 1.0 over 5 matches
        // Formula: 0.8 + (0.2 * log(matchCount + 1) / log(6))
        uint256 multiplier = 80 + ((20 * _log(matchCount + 1)) / _log(6));
        return multiplier;
    }

    /**
     * @dev Update user match count (called by factory when POAP is verified)
     * @param user Address of the user
     * @param matchId POAP match ID
     */
    function updateUserMatchCount(
        address user,
        uint256 matchId
    ) external onlyFactory {
        // Verify POAP ownership
        uint256 balance = IPOAP(poapContract).balanceOf(user, matchId);
        require(balance > 0, "No POAP for this match");
        userMatchCount[user]++;
    }

    // Internal functions
    function _addBetToPool(
        TeamPool storage pool,
        address user,
        uint256 amount,
        uint256 multiplier
    ) internal {
        if (pool.bets[user].amount == 0) {
            pool.bettors.push(user);
        }

        pool.bets[user].amount += amount;
        pool.bets[user].multiplier = multiplier;
        pool.totalAmount += amount;
    }

    function _calculateWinnings(
        TeamPool storage pool,
        address user
    ) internal view returns (uint256) {
        Bet storage bet = pool.bets[user];
        if (bet.amount == 0 || bet.claimed) return 0;

        // Calculate proportional winnings
        uint256 totalPoolAmount = team1Pool.totalAmount + team2Pool.totalAmount;
        // Avoid division before multiplication by using higher precision
        uint256 winnings = (bet.amount * bet.multiplier * totalPoolAmount) /
            (100 * pool.totalAmount);

        return winnings;
    }

    function _swapAndCalculateWinnings(
        TeamPool storage pool,
        address user
    ) internal returns (uint256) {
        Bet storage bet = pool.bets[user];
        if (bet.amount == 0 || bet.claimed) return 0;

        // Approve swap router
        bool success = IFanToken(pool.token).approve(swapRouter, bet.amount);
        require(success, "Approve failed");

        // Perform swap
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: pool.token,
                tokenOut: winningTeamToken,
                fee: 3000, // 0.3% fee
                recipient: address(this),
                deadline: block.timestamp + 300, // 5 minutes
                amountIn: bet.amount,
                amountOutMinimum: 0, // No slippage protection for simplicity
                sqrtPriceLimitX96: 0
            });

        uint256 swappedAmount = ISwapRouter(swapRouter).exactInputSingle(
            params
        );

        // Calculate winnings based on swapped amount
        uint256 totalPoolAmount = team1Pool.totalAmount + team2Pool.totalAmount;
        // Avoid division before multiplication by using higher precision
        uint256 winnings = (swappedAmount * bet.multiplier * totalPoolAmount) /
            (100 * pool.totalAmount);

        bet.claimed = true;
        return winnings;
    }

    function _calculateUnclaimedAmount(
        TeamPool storage pool
    ) internal view returns (uint256) {
        uint256 unclaimed = 0;
        for (uint256 i = 0; i < pool.bettors.length; i++) {
            address bettor = pool.bettors[i];
            if (!hasClaimed[bettor] && pool.bets[bettor].amount > 0) {
                unclaimed += _calculateWinnings(pool, bettor);
            }
        }
        return unclaimed;
    }

    function _log(uint256 x) internal pure returns (uint256) {
        // Simple logarithm approximation for small numbers
        if (x <= 1) return 0;
        if (x <= 2) return 69; // log(2) * 100
        if (x <= 3) return 110; // log(3) * 100
        if (x <= 4) return 139; // log(4) * 100
        if (x <= 5) return 161; // log(5) * 100
        if (x <= 6) return 179; // log(6) * 100
        return 179; // Default to log(6)
    }

    // View functions
    function getBet(
        address user,
        address teamToken
    ) external view returns (uint256 amount, uint256 multiplier, bool claimed) {
        TeamPool storage pool = teamToken == team1Token ? team1Pool : team2Pool;
        Bet storage bet = pool.bets[user];
        return (bet.amount, bet.multiplier, bet.claimed);
    }

    function getPoolInfo(
        address teamToken
    ) external view returns (uint256 totalAmount, uint256 bettorCount) {
        TeamPool storage pool = teamToken == team1Token ? team1Pool : team2Pool;
        return (pool.totalAmount, pool.bettors.length);
    }

    function getBettors(
        address teamToken
    ) external view returns (address[] memory) {
        TeamPool storage pool = teamToken == team1Token ? team1Pool : team2Pool;
        return pool.bettors;
    }
}
