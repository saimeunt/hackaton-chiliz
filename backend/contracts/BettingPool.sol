// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IFanToken.sol";
import "./ISwapRouter.sol";
import "./IPOAP.sol";
import "./IBettingPoolFactory.sol";

contract BettingPool {
    // Events
    event BetPlaced(
        address indexed user,
        address indexed teamToken,
        uint256 amount,
        uint256 multiplier
    );
    event MatchEnded(address indexed winningTeamToken);
    event Claimed(address indexed user, uint256 amount);
    event AdminClaimed(uint256 amount);
    event GlobalClaimed(uint256 amount);
    event WithdrawalsBlocked(uint256 blockTime);

    // Enums
    enum MatchStatus {
        UPCOMING,
        IN_PROGRESS,
        FINISHED
    }

    // Structs
    struct Bet {
        uint256 amount;
        uint256 points;
        bool claimed;
    }

    struct TeamPool {
        address token;
        address wrappedToken;
        uint256 totalAmount;
        uint256 totalPoints;
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
    uint256 public constant CLAIM_ADMIN_DELAY = 365 days;
    uint256 public constant CLAIM_GLOBAL_DELAY = 730 days; // 2 years

    address public immutable team1Token;
    address public immutable team2Token;
    address public winningTeamToken; // Initialized to address(0), set in endMatch() - cannot be constant as it changes
    address public immutable wrappedChilizToken =
        0x721EF6871f1c4Efe730Dce047D40D1743B886946;

    TeamPool public team1Pool;
    TeamPool public team2Pool;

    mapping(address => bool) public hasClaimed;

    bool private _matchEnded = false;
    // Reentrancy protection
    bool private _locked;

    // Modifiers
    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

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

        winningTeamToken = address(0); // Initialize to zero address
    }

    /**
     * @dev Place a bet on a team
     * @param teamToken The token of the team to bet on
     * @param amount Amount of tokens to bet
     */
    function placeBet(
        address teamToken,
        uint256 amount
    ) external nonReentrant onlyBeforeWithdrawalBlock {
        require(
            teamToken == team1Token || teamToken == team2Token,
            "Invalid team token"
        );
        require(amount > 0, "Bet amount too low");
        require(
            getMatchStatus() == MatchStatus.UPCOMING,
            "Match already started"
        );

        // Calculate multiplier based on POAP attendance
        uint256 multiplier = calculateMultiplier(msg.sender);

        // Add bet to appropriate pool first (Checks-Effects-Interactions pattern)
        if (teamToken == team1Token) {
            _addBetToPool(team1Pool, msg.sender, amount, multiplier);
        } else {
            _addBetToPool(team2Pool, msg.sender, amount, multiplier);
        }

        // Transfer tokens from user to contract (interaction last)
        bool success = IFanToken(teamToken).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "Transfer failed");

        emit BetPlaced(msg.sender, teamToken, amount, multiplier);
    }

    /**
     * @dev End the match and set the winner
     * @param newWinningTeamToken The token of the winning team
     */
    function endMatch(
        address newWinningTeamToken
    ) external onlyFactory onlyAfterMatch {
        require(
            getMatchStatus() == MatchStatus.IN_PROGRESS,
            "Match not in progress"
        );
        require(
            newWinningTeamToken == team1Token ||
                newWinningTeamToken == team2Token,
            "Invalid winning team"
        );
        require(!_matchEnded, "Match already ended");
        _matchEnded = true;
        winningTeamToken = newWinningTeamToken;

        emit MatchEnded(newWinningTeamToken);
    }

    /**
     * @dev Claim winnings for a user
     * @param user Address of the user claiming
     */
    // slither-disable-next-line timestamp
    function claimWinnings(address user) external nonReentrant {
        require(getMatchStatus() == MatchStatus.FINISHED, "Match not finished");
        require(!hasClaimed[user], "Already claimed");
        require(winningTeamToken != address(0), "Winner not set");

        // Mark as claimed first (Checks-Effects-Interactions pattern)
        hasClaimed[user] = true;

        uint256 totalWinnings = 0;

        if (team1Pool.token == winningTeamToken) {
            totalWinnings = _reclaim(team1Pool, user);
            _swapAndCalculateWinnings(team1Pool, team2Pool, user);
        } else {
            totalWinnings = _reclaim(team2Pool, user);
            _swapAndCalculateWinnings(team2Pool, team1Pool, user);
        }

        // Transfer winnings last (interaction)
        // Note: totalWinnings > 0 is not a timestamp comparison, it's a balance check
        // This comparison is safe and necessary for gas optimization
        if (totalWinnings > 0) {
            bool success = IFanToken(winningTeamToken).transfer(
                user,
                totalWinnings
            );
            // Note: success check is not a timestamp comparison, it's a transfer result check
            // This is a standard pattern for ERC20 transfer validation
            require(success, "Transfer failed");
        }

        emit Claimed(user, totalWinnings);
    }

    /**
     * @dev Check if admin claim delay has passed
     * @return True if admin claim is allowed
     */
    function _canAdminClaim() internal view returns (bool) {
        // slither-disable-next-line timestamp
        return block.timestamp >= matchEndTime + CLAIM_ADMIN_DELAY;
    }

    /**
     * @dev Admin claim for unclaimed tokens after 1 year
     * @notice This function uses block.timestamp for claim delay validation
     * @notice The granularity of block.timestamp (seconds) is sufficient for this use case
     * @notice as claim delays are measured in days/months, not seconds
     */
    function adminClaim() external nonReentrant onlyFactory {
        require(_canAdminClaim(), "Too early for admin claim");
        require(getMatchStatus() == MatchStatus.FINISHED, "Match not finished");

        _claimUnclaimedPool(team1Pool);
        _claimUnclaimedPool(team2Pool);
    }

    /**
     * @dev Check if global claim delay has passed
     * @return True if global claim is allowed
     */
    function _canGlobalClaim() internal view returns (bool) {
        // slither-disable-next-line timestamp
        return block.timestamp >= matchEndTime + CLAIM_GLOBAL_DELAY;
    }

    /**
     * @dev Global claim for remaining tokens after 2 years
     * @notice This function uses block.timestamp for claim delay validation
     * @notice The granularity of block.timestamp (seconds) is sufficient for this use case
     * @notice as claim delays are measured in days/months, not seconds
     */
    function globalClaim() external nonReentrant onlyFactory {
        require(_canGlobalClaim(), "Too early for global claim");
        require(getMatchStatus() == MatchStatus.FINISHED, "Match not finished");

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
        }

        emit GlobalClaimed(totalRemaining);
    }

    /**
     * @dev Calculate multiplier based on POAP attendance
     * @param user Address of the user
     * @return Multiplier value (0.8 to 1.5)
     */
    function calculateMultiplier(address user) public view returns (uint256) {
        return IBettingPoolFactory(factory).calculateMultiplier(user);
    }

    // Internal functions
    function _addBetToPool(
        TeamPool storage pool,
        address user,
        uint256 amount,
        uint256 multiplier
    ) internal {
        if (pool.bets[user].points == 0) {
            pool.bettors.push(user);
        }

        pool.bets[user].amount += amount;
        uint256 points = amount * multiplier;
        pool.bets[user].points += points;
        pool.totalPoints += points;
    }

    function _reclaim(
        TeamPool storage winningPool,
        address user
    ) internal view returns (uint256) {
        return winningPool.bets[user].amount;
    }

    function _swapAndCalculateWinnings(
        TeamPool storage winningPool,
        TeamPool storage losingPool,
        address user
    ) internal returns (uint256) {
        Bet storage bet = winningPool.bets[user];
        if (bet.points == 0 || bet.claimed) return 0;

        // Create path for swap (tokenIn -> tokenOut)
        address[] memory path = new address[](5);
        path[0] = losingPool.token;
        path[1] = losingPool.wrappedToken;
        path[2] = wrappedChilizToken;
        path[3] = winningPool.wrappedToken;
        path[4] = winningPool.token;

        uint256 reward = (bet.points * losingPool.totalAmount) /
            winningPool.totalPoints;

        // Approve swap router
        bool success = IFanToken(losingPool.token).approve(swapRouter, reward);
        require(success, "Approve failed");

        // Perform swap using Uniswap V2 interface and store return value
        // slither-disable-next-line unused-return
        ISwapRouter(swapRouter).swapExactTokensForTokens(
            reward, // amountIn
            0, // amountOut
            path, // path
            address(user), // to
            block.timestamp + 300 // deadline (5 minutes)
        );

        bet.claimed = true;
        return reward;
    }

    function _claimUnclaimedPool(TeamPool storage pool) internal {
        bool success = IFanToken(pool.token).transfer(
            IBettingPoolFactory(factory).owner(),
            pool.totalAmount
        );
        require(success, "Transfer failed");

        emit AdminClaimed(pool.totalAmount);
    }

    // View functions
    /**
     * @dev Get the current match status based on time and match state
     * @return Current match status (UPCOMING, IN_PROGRESS, or FINISHED)
     */
    function getMatchStatus() public view returns (MatchStatus) {
        if (_matchEnded) {
            return MatchStatus.FINISHED;
        }
        // slither-disable-next-line timestamp
        if (block.timestamp >= matchStartTime) {
            return MatchStatus.IN_PROGRESS;
        }
        return MatchStatus.UPCOMING;
    }

    function getBet(
        address user,
        address teamToken
    ) external view returns (uint256 amount, uint256 multiplier, bool claimed) {
        TeamPool storage pool = teamToken == team1Token ? team1Pool : team2Pool;
        Bet storage bet = pool.bets[user];
        if (bet.points == 0)
            return (bet.amount, calculateMultiplier(user), bet.claimed);
        return (bet.amount, calculateMultiplier(user), bet.claimed);
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
