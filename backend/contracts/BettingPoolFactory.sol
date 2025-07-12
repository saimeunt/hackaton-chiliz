// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PoolManager} from "./PoolManager.sol";
import {IFanToken} from "./IFanToken.sol";
import {IPOAP} from "./IPOAP.sol";
import {IBettingPoolFactory} from "./IBettingPoolFactory.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

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
    event UserMatchCountUpdated(
        address indexed user,
        uint256 newCount,
        uint256 matchId
    );

    // State variables
    address public owner;

    // Track user's match attendance across all pools
    mapping(address => uint256) public userMatchCount;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyPoap() {
        require(msg.sender == poapContract, "Only POAP can call this");
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
    ) external nonReentrant onlyPoap {
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
     * @return Multiplier value starting at 100%
     */
    function calculateMultiplier(address user) public view returns (uint256) {
        uint256 matchCount = userMatchCount[user];
        uint256 multiplier = 100 + Math.log10(matchCount + 1) / 5;
        return multiplier;
    }

    /**
     * @dev Update user match count (called internally when POAP is verified)
     * @param user Address of the user
     * @param matchId POAP match ID
     */
    function _updateUserMatchCount(address user, uint256 matchId) internal {
        userMatchCount[user]++;
        emit UserMatchCountUpdated(user, userMatchCount[user], matchId);
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
