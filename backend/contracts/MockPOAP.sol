// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockPOAP is ERC1155, Ownable {
    mapping(uint256 => string) public matchNames;
    mapping(address => mapping(uint256 => bool)) public hasAttended;

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
    function awardPOAP(address user, uint256 matchId) external onlyOwner {
        require(bytes(matchNames[matchId]).length > 0, "Match does not exist");
        require(
            !hasAttended[user][matchId],
            "User already attended this match"
        );

        hasAttended[user][matchId] = true;
        _mint(user, matchId, 1, "");
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
     * @dev Override balanceOf to return 1 if user attended, 0 otherwise
     */
    function balanceOf(
        address account,
        uint256 id
    ) public view override returns (uint256) {
        return hasAttended[account][id] ? 1 : 0;
    }
}
