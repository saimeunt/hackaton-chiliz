// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IBettingPoolFactory
 * @dev Interface for BettingPoolFactory contract
 */
interface IBettingPoolFactory {
    /**
     * @dev Calculate multiplier based on POAP attendance
     * @param user Address of the user
     * @return Multiplier value (0.8 to 1.5)
     */
    function calculateMultiplier(address user) external view returns (uint256);
    function owner() external view returns (address);
}
