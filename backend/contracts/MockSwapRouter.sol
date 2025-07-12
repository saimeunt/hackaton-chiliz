// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IFanToken.sol";
import "./ISwapRouter.sol";
import "./MockFanToken.sol";

contract MockSwapRouter is ISwapRouter {
    // Mock exchange rate: 1:1 for simplicity
    // In a real implementation, this would query actual DEX prices

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
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}
