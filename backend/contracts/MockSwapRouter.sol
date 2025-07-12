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

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
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
    // Restricted to owner only for security in mock contract
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "ETH transfer failed");
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
