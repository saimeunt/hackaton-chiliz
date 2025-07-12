// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BettingPool} from "./BettingPool.sol";
import {IFanToken} from "./IFanToken.sol";
import {IPOAP} from "./IPOAP.sol";

/**
 * @title PoolManager
 * @dev Base contract for managing betting pools
 * Contains the core pool management logic that can be inherited by other contracts
 */
contract PoolManager {
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

    // State variables
    address public immutable swapRouter;
    address public immutable poapContract;

    BettingPool[] public pools;
    mapping(address => bool) public isPool;
    mapping(uint256 => address) public matchIdToPool; // POAP match ID to pool address

    uint256 public matchCount;
    // Reentrancy protection
    bool private _locked;

    // Modifiers
    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    modifier onlyValidPool(address poolAddress) {
        require(isPool[poolAddress], "Invalid pool address");
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
    }

    /**
     * @dev Check if match start time is in the future
     * @param matchStartTime Start time of the match
     * @return True if match start time is valid
     */
    function _isValidMatchStartTime(
        uint256 matchStartTime
    ) internal view returns (bool) {
        // slither-disable-next-line timestamp
        return matchStartTime > block.timestamp;
    }

    /**
     * @dev Create a new betting pool for a match
     * @param team1Token Token of the first team
     * @param team2Token Token of the second team
     * @param matchStartTime Start time of the match
     * @param matchDuration Duration of the match in seconds
     * @return poolAddress Address of the created pool
     */
    function _createPool(
        address team1Token,
        address team2Token,
        uint256 matchStartTime,
        uint256 matchDuration,
        string memory matchName
    ) internal nonReentrant returns (address poolAddress) {
        require(team1Token != team2Token, "Teams must be different");
        require(
            _isValidMatchStartTime(matchStartTime),
            "Match start time must be in the future"
        );
        require(matchDuration > 0, "Match duration must be positive");
        require(
            matchIdToPool[matchCount] == address(0),
            "Match ID already exists"
        );

        // Store current matchCount before external call
        uint256 currentMatchCount = matchCount;

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
        matchIdToPool[currentMatchCount] = poolAddress;

        // External call after state changes
        IPOAP(poapContract).createMatch(currentMatchCount, matchName);

        emit PoolCreated(
            poolAddress,
            team1Token,
            team2Token,
            matchStartTime,
            matchDuration
        );

        // Update matchCount after external call
        matchCount = currentMatchCount + 1;
        return poolAddress;
    }

    /**
     * @dev End a match and set the winner
     * @param poolAddress Address of the pool
     * @param winningTeamToken Token of the winning team
     */
    function _endMatch(
        address poolAddress,
        address winningTeamToken
    ) internal onlyValidPool(poolAddress) {
        emit MatchEnded(poolAddress, winningTeamToken);
        BettingPool(poolAddress).endMatch(winningTeamToken);
    }

    /**
     * @dev Verify POAP attendance
     * @param user Address of the user
     * @param matchId POAP match ID
     */
    function _verifyPOAPAttendance(address user, uint256 matchId) internal {
        address poolAddress = matchIdToPool[matchId];
        require(poolAddress != address(0), "Invalid match ID");

        emit POAPVerified(user, matchId);
    }

    /**
     * @dev Claim winnings for a user
     * @param poolAddress Address of the pool
     * @param user Address of the user
     */
    function _claimWinnings(
        address poolAddress,
        address user
    ) internal onlyValidPool(poolAddress) {
        BettingPool(poolAddress).claimWinnings(user);
    }

    /**
     * @dev Admin claim for unclaimed tokens after 1 year
     * @param poolAddress Address of the pool
     */
    function _adminClaim(
        address poolAddress
    ) internal onlyValidPool(poolAddress) {
        BettingPool(poolAddress).adminClaim();
    }

    /**
     * @dev Global claim for remaining tokens after 2 years
     * @param poolAddress Address of the pool
     */
    function _globalClaim(
        address poolAddress
    ) internal onlyValidPool(poolAddress) {
        BettingPool(poolAddress).globalClaim();
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
            pool.getMatchStatus(),
            pool.winningTeamToken()
        );
    }
}
