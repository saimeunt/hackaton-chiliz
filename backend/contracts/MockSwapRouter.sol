// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "./IFanToken.sol";
import "./ISwapRouter.sol";

contract MockSwapRouter is ISwapRouter {
    // Mock exchange rate: 1:1 for simplicity
    // In a real implementation, this would query actual DEX prices

    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable override returns (uint256 amountOut) {
        // Transfer tokens from caller to this contract
        IFanToken(params.tokenIn).transferFrom(
            msg.sender,
            address(this),
            params.amountIn
        );

        // Calculate output amount (1:1 exchange rate for mock)
        amountOut = params.amountIn;

        // Transfer output tokens to recipient
        IFanToken(params.tokenOut).transfer(params.recipient, amountOut);

        return amountOut;
    }
}
