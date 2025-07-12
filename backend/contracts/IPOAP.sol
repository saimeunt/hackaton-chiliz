// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPOAP {
    function balanceOf(
        address account,
        uint256 id
    ) external view returns (uint256);
    function isApprovedForAll(
        address account,
        address operator
    ) external view returns (bool);
}
