// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IBettingPoolFactory} from "./IBettingPoolFactory.sol";

contract MockPOAP is ERC1155, Ownable {
    mapping(uint256 => string) public matchNames;
    mapping(address => mapping(uint256 => bool)) public hasAttended;
    address public bettingPoolFactory;

    constructor() ERC1155("") Ownable(msg.sender) {}

    /**
     * @dev Create a new match POAP
     * @param matchId Unique ID for the match
     * @param matchName Name of the match
     */
    function createMatch(
        uint256 matchId,
        string memory matchName
    ) external onlyOwner {
        matchNames[matchId] = matchName;
    }

    /**
     * @dev Award POAP to user for attending a match
     * @param user Address of the user
     * @param matchId ID of the match
     */
    function awardPoap(address user, uint256 matchId) external onlyOwner {
        require(bytes(matchNames[matchId]).length > 0, "Match does not exist");

        // Only award POAP and call verifyPOAPAttendance if user hasn't attended yet
        if (!hasAttended[user][matchId]) {
            hasAttended[user][matchId] = true;
            _mint(user, matchId, 1, "");

            // Only call verifyPOAPAttendance if bettingPoolFactory is set
            if (bettingPoolFactory != address(0)) {
                IBettingPoolFactory(bettingPoolFactory).verifyPOAPAttendance(
                    user,
                    matchId
                );
            }
        }
    }

    /**
     * @dev Check if user attended a specific match
     * @param user Address of the user
     * @param matchId ID of the match
     * @return True if user attended the match
     */
    function hasUserAttended(
        address user,
        uint256 matchId
    ) external view returns (bool) {
        return hasAttended[user][matchId];
    }

    /**
     * @dev Get match name by ID
     * @param matchId ID of the match
     * @return Name of the match
     */
    function getMatchName(
        uint256 matchId
    ) external view returns (string memory) {
        return matchNames[matchId];
    }

    /**
     * @dev Set the betting pool factory address
     * @param factory Address of the betting pool factory
     */
    function setBettingPoolFactory(address factory) external onlyOwner {
        require(factory != address(0), "Factory cannot be zero address");
        bettingPoolFactory = factory;
    }

    /**
     * @dev Override balanceOf to return 1 if user attended, 0 otherwise
     */
    function balanceOf(
        address account,
        uint256 id
    ) public view override returns (uint256) {
        return hasAttended[account][id] ? 1 : 0;
    }
}
