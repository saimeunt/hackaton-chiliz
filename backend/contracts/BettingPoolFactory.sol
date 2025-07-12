// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BettingPool} from "./BettingPool.sol";
import {IFanToken} from "./IFanToken.sol";

contract BettingPoolFactory {
    // Events
    event PoolCreated(
        address indexed poolAddress,
        address indexed team1Token,
        address indexed team2Token,
        uint256 matchStartTime,
        uint256 matchDuration
    );
    event MatchStarted(address indexed poolAddress);
    event MatchEnded(
        address indexed poolAddress,
        address indexed winningTeamToken
    );
    event POAPVerified(address indexed user, uint256 indexed matchId);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // State variables
    address public immutable swapRouter;
    address public immutable poapContract;
    address public owner;

    BettingPool[] public pools;
    mapping(address => bool) public isPool;
    mapping(uint256 => address) public matchIdToPool; // POAP match ID to pool address

    // Reentrancy protection
    bool private _locked;

    // Modifiers
    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(address _swapRouter, address _poapContract) {
        require(_swapRouter != address(0), "SwapRouter cannot be zero address");
        require(
            _poapContract != address(0),
            "POAP contract cannot be zero address"
        );

        swapRouter = _swapRouter;
        poapContract = _poapContract;
        owner = msg.sender;
    }

    /**
     * @dev Create a new betting pool for a match
     * @param team1Token Token of the first team
     * @param team2Token Token of the second team
     * @param matchStartTime Start time of the match
     * @param matchDuration Duration of the match in seconds
     * @param matchId POAP match ID for attendance verification
     * @return poolAddress Address of the created pool
     */
    function createPool(
        address team1Token,
        address team2Token,
        uint256 matchStartTime,
        uint256 matchDuration,
        uint256 matchId
    ) external onlyOwner returns (address poolAddress) {
        require(team1Token != team2Token, "Teams must be different");
        // Using block.timestamp for future time validation is acceptable
        // as it provides sufficient granularity for match scheduling
        require(
            matchStartTime > block.timestamp,
            "Match start time must be in the future"
        );
        require(matchDuration > 0, "Match duration must be positive");
        require(
            matchIdToPool[matchId] == address(0),
            "Match ID already exists"
        );

        // Create new pool
        BettingPool pool = new BettingPool(
            address(this),
            swapRouter,
            poapContract,
            team1Token,
            team2Token,
            matchStartTime,
            matchDuration
        );

        poolAddress = address(pool);
        pools.push(pool);
        isPool[poolAddress] = true;
        matchIdToPool[matchId] = poolAddress;

        emit PoolCreated(
            poolAddress,
            team1Token,
            team2Token,
            matchStartTime,
            matchDuration
        );
    }

    /**
     * @dev Start a match
     * @param poolAddress Address of the pool to start
     */
    function startMatch(address poolAddress) external nonReentrant onlyOwner {
        require(isPool[poolAddress], "Invalid pool address");
        BettingPool(poolAddress).startMatch();
        emit MatchStarted(poolAddress);
    }

    /**
     * @dev End a match and set the winner
     * @param poolAddress Address of the pool
     * @param winningTeamToken Token of the winning team
     */
    function endMatch(
        address poolAddress,
        address winningTeamToken
    ) external nonReentrant onlyOwner {
        require(isPool[poolAddress], "Invalid pool address");
        BettingPool(poolAddress).endMatch(winningTeamToken);
        emit MatchEnded(poolAddress, winningTeamToken);
    }

    /**
     * @dev Verify POAP attendance and update user match count
     * @param user Address of the user
     * @param matchId POAP match ID
     */
    function verifyPOAPAttendance(
        address user,
        uint256 matchId
    ) external nonReentrant onlyOwner {
        address poolAddress = matchIdToPool[matchId];
        require(poolAddress != address(0), "Invalid match ID");

        BettingPool(poolAddress).updateUserMatchCount(user, matchId);
        emit POAPVerified(user, matchId);
    }

    /**
     * @dev Claim winnings for a user
     * @param poolAddress Address of the pool
     * @param user Address of the user
     */
    function claimWinnings(
        address poolAddress,
        address user
    ) external nonReentrant {
        require(isPool[poolAddress], "Invalid pool address");
        BettingPool(poolAddress).claimWinnings(user);
    }

    /**
     * @dev Admin claim for unclaimed tokens after 1 year
     * @param poolAddress Address of the pool
     */
    function adminClaim(address poolAddress) external nonReentrant onlyOwner {
        require(isPool[poolAddress], "Invalid pool address");
        BettingPool(poolAddress).adminClaim();
    }

    /**
     * @dev Global claim for remaining tokens after 2 years
     * @param poolAddress Address of the pool
     */
    function globalClaim(address poolAddress) external nonReentrant onlyOwner {
        require(isPool[poolAddress], "Invalid pool address");
        BettingPool(poolAddress).globalClaim();
    }

    /**
     * @dev Transfer ownership
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /**
     * @dev Emergency function to recover tokens stuck in factory
     * @param token Address of the token to recover
     * @param amount Amount to recover
     */
    function emergencyRecover(
        address token,
        uint256 amount
    ) external nonReentrant onlyOwner {
        bool success = IFanToken(token).transfer(owner, amount);
        require(success, "Transfer failed");
    }

    // View functions
    function getPools() external view returns (address[] memory) {
        uint256 poolsLength = pools.length;
        address[] memory poolAddresses = new address[](poolsLength);
        for (uint256 i = 0; i < poolsLength; i++) {
            poolAddresses[i] = address(pools[i]);
        }
        return poolAddresses;
    }

    function getPoolCount() external view returns (uint256) {
        return pools.length;
    }

    function getPoolByMatchId(uint256 matchId) external view returns (address) {
        return matchIdToPool[matchId];
    }

    function getPoolInfo(
        address poolAddress
    )
        external
        view
        returns (
            address team1Token,
            address team2Token,
            uint256 matchStartTime,
            uint256 matchEndTime,
            BettingPool.MatchStatus status,
            address winningTeamToken
        )
    {
        require(isPool[poolAddress], "Invalid pool address");
        BettingPool pool = BettingPool(poolAddress);

        return (
            pool.team1Token(),
            pool.team2Token(),
            pool.matchStartTime(),
            pool.matchEndTime(),
            pool.matchStatus(),
            pool.winningTeamToken()
        );
    }
}
