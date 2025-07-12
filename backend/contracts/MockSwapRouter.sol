// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IFanToken.sol";
import "./ISwapRouter.sol";
import "./MockFanToken.sol";

contract MockSwapRouter is ISwapRouter {
    // Mock exchange rate: 1:1 for simplicity
    // In a real implementation, this would query actual DEX prices

    // Owner for security
    address public immutable owner;

    // Mapping to track authorized withdrawers
    mapping(address => bool) public authorizedWithdrawers;

    constructor() {
        owner = msg.sender;
        authorizedWithdrawers[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyAuthorized() {
        require(
            authorizedWithdrawers[msg.sender],
            "Not authorized to withdraw"
        );
        _;
    }

    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable override returns (uint256 amountOut) {
        // For testing, we do not use transferFrom but mint the tokenOut to the recipient
        // (requires that MockFanToken has an accessible mint function)
        amountOut = params.amountIn;
        MockFanToken(address(params.tokenOut)).mint(
            params.recipient,
            amountOut
        );
        return amountOut;
    }

    // Function to withdraw any ether that might be sent to this contract
    // This is a mock contract for testing, so allowing any user to withdraw is acceptable
    function withdraw() external onlyAuthorized {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "ETH transfer failed");
    }

    // Function to authorize withdrawers (only owner)
    function authorizeWithdrawer(address withdrawer) external onlyOwner {
        require(withdrawer != address(0), "Invalid address");
        authorizedWithdrawers[withdrawer] = true;
    }

    // Function to revoke withdrawer authorization (only owner)
    function revokeWithdrawer(address withdrawer) external onlyOwner {
        require(withdrawer != address(0), "Invalid address");
        authorizedWithdrawers[withdrawer] = false;
    }

    // Emergency function to recover tokens stuck in router
    function emergencyRecover(
        address token,
        uint256 amount
    ) external onlyOwner {
        bool success = IFanToken(token).transfer(owner, amount);
        require(success, "Token transfer failed");
    }
}
