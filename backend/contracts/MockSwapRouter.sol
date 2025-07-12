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

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external override returns (uint256[] memory amounts) {
        // slither-disable-next-line timestamp
        require(block.timestamp <= deadline, "SwapRouter: EXPIRED");
        require(path.length >= 2, "SwapRouter: INVALID_PATH");
        require(to != address(0), "SwapRouter: INVALID_TO");

        // For testing, we do not use transferFrom but mint the tokenOut to the recipient
        // (requires that MockFanToken has an accessible mint function)
        uint256 amountOut = amountIn; // 1:1 exchange rate for mock
        require(
            amountOut >= amountOutMin,
            "SwapRouter: INSUFFICIENT_OUTPUT_AMOUNT"
        );

        // Mint the output token to the recipient
        MockFanToken(path[1]).mint(to, amountOut);

        // Return amounts array
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        amounts[1] = amountOut;

        return amounts;
    }

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external override returns (uint256[] memory amounts) {
        // slither-disable-next-line timestamp
        require(block.timestamp <= deadline, "SwapRouter: EXPIRED");
        require(path.length >= 2, "SwapRouter: INVALID_PATH");
        require(to != address(0), "SwapRouter: INVALID_TO");

        // For mock, we use 1:1 exchange rate
        uint256 amountIn = amountOut; // 1:1 exchange rate for mock
        require(amountIn <= amountInMax, "SwapRouter: EXCESSIVE_INPUT_AMOUNT");

        // Mint the output token to the recipient
        MockFanToken(path[1]).mint(to, amountOut);

        // Return amounts array
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        amounts[1] = amountOut;

        return amounts;
    }

    function getAmountsOut(
        uint256 amountIn,
        address[] calldata path
    ) external pure override returns (uint256[] memory amounts) {
        require(path.length >= 2, "SwapRouter: INVALID_PATH");

        // Mock 1:1 exchange rate
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        amounts[1] = amountIn; // 1:1 exchange rate

        return amounts;
    }

    function getAmountsIn(
        uint256 amountOut,
        address[] calldata path
    ) external pure override returns (uint256[] memory amounts) {
        require(path.length >= 2, "SwapRouter: INVALID_PATH");

        // Mock 1:1 exchange rate
        amounts = new uint256[](path.length);
        amounts[0] = amountOut; // 1:1 exchange rate
        amounts[1] = amountOut;

        return amounts;
    }

    // Function to withdraw any ether that might be sent to this contract
    // Restricted to owner only for security in mock contract
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        // Use transfer instead of low-level call for better security
        payable(owner).transfer(balance);
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
