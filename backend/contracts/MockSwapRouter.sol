// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "./IFanToken.sol";
import "./ISwapRouter.sol";
import "./MockFanToken.sol";

contract MockSwapRouter is ISwapRouter {
    // Mock exchange rate: 1:1 for simplicity
    // In a real implementation, this would query actual DEX prices

    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable override returns (uint256 amountOut) {
        // Pour les tests, on ne fait pas de transferFrom mais on mint le tokenOut au destinataire
        // (nécessite que MockFanToken ait une fonction mint accessible)
        amountOut = params.amountIn;
        MockFanToken(address(params.tokenOut)).mint(
            params.recipient,
            amountOut
        );
        return amountOut;
    }
}
