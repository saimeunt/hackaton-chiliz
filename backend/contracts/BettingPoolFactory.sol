// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PoolManager} from "./PoolManager.sol";
import {IFanToken} from "./IFanToken.sol";
import {IPOAP} from "./IPOAP.sol";
import {IBettingPoolFactory} from "./IBettingPoolFactory.sol";

/**
 * @title BettingPoolFactory
 * @dev Factory contract for creating and managing betting pools
 * Inherits from PoolManager to use the core pool management functionality
 */
contract BettingPoolFactory is PoolManager, IBettingPoolFactory {
    // Events
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event UserMatchCountUpdated(address indexed user, uint256 newCount);

    // State variables
    address public owner;

    // Track user's match attendance across all pools
    mapping(address => uint256) public userMatchCount;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(
        address _swapRouter,
        address _poapContract
    ) PoolManager(_swapRouter, _poapContract) {
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
        return
            _createPool(
                team1Token,
                team2Token,
                matchStartTime,
                matchDuration,
                matchId
            );
    }

    /**
     * @dev Start a match
     * @param poolAddress Address of the pool to start
     */
    function startMatch(address poolAddress) external nonReentrant onlyOwner {
        _startMatch(poolAddress);
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
        _endMatch(poolAddress, winningTeamToken);
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
        _verifyPOAPAttendance(user, matchId);
        _updateUserMatchCount(user, matchId);
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
        _claimWinnings(poolAddress, user);
    }

    /**
     * @dev Admin claim for unclaimed tokens after 1 year
     * @param poolAddress Address of the pool
     */
    function adminClaim(address poolAddress) external nonReentrant onlyOwner {
        _adminClaim(poolAddress);
    }

    /**
     * @dev Global claim for remaining tokens after 2 years
     * @param poolAddress Address of the pool
     */
    function globalClaim(address poolAddress) external nonReentrant onlyOwner {
        _globalClaim(poolAddress);
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
     * @dev Update user match count (called internally when POAP is verified)
     * @param user Address of the user
     * @param matchId POAP match ID
     */
    function _updateUserMatchCount(address user, uint256 matchId) internal {
        // Verify POAP ownership
        uint256 balance = IPOAP(poapContract).balanceOf(user, matchId);
        require(balance > 0, "No POAP for this match");

        userMatchCount[user]++;
        emit UserMatchCountUpdated(user, userMatchCount[user]);
    }

    /**
     * @dev Simple logarithm approximation for small numbers
     * @param x Input value
     * @return Logarithm value * 100
     */
    function _log(uint256 x) internal pure returns (uint256) {
        if (x <= 1) return 0;
        if (x <= 2) return 69; // log(2) * 100
        if (x <= 3) return 110; // log(3) * 100
        if (x <= 4) return 139; // log(4) * 100
        if (x <= 5) return 161; // log(5) * 100
        if (x <= 6) return 179; // log(6) * 100
        return 179; // Default to log(6)
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
}
