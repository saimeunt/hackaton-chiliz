// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Test.sol";
import {BettingPoolFactory} from "../../contracts/BettingPoolFactory.sol";
import {BettingPool} from "../../contracts/BettingPool.sol";

contract BettingPoolFactoryTest is Test {
    BettingPoolFactory factory;
    address owner = address(this);
    address swapRouter = address(0x123);
    address poapContract = address(0x456);
    address team1Token = address(0x111);
    address team2Token = address(0x222);
    address user = address(0x999);

    function setUp() public {
        factory = new BettingPoolFactory(swapRouter, poapContract);
    }

    function testOwnerSetCorrectly() public {
        assertEq(factory.owner(), owner);
        assertEq(factory.swapRouter(), swapRouter);
        assertEq(factory.poapContract(), poapContract);
    }

    function testCreatePool() public {
        uint256 matchStart = block.timestamp + 10000; // Use larger timestamp
        address poolAddr = factory.createPool(
            team1Token,
            team2Token,
            matchStart,
            3600,
            1
        );
        assertTrue(factory.isPool(poolAddr));
        assertEq(factory.matchIdToPool(1), poolAddr);
    }

    function testRevertCreatePoolIfNotOwner() public {
        vm.prank(user);
        vm.expectRevert("Only owner can call this");
        factory.createPool(
            team1Token,
            team2Token,
            block.timestamp + 1000,
            3600,
            2
        );
    }

    function testRevertCreatePoolIfTeamsSame() public {
        vm.expectRevert("Teams must be different");
        factory.createPool(
            team1Token,
            team1Token,
            block.timestamp + 1000,
            3600,
            3
        );
    }

    function testRevertCreatePoolIfMatchIdExists() public {
        uint256 matchStart = block.timestamp + 10000; // Use larger timestamp
        factory.createPool(team1Token, team2Token, matchStart, 3600, 4);
        vm.expectRevert("Match ID already exists");
        factory.createPool(team1Token, team2Token, matchStart + 1000, 3600, 4);
    }

    function testTransferOwnership() public {
        factory.transferOwnership(user);
        assertEq(factory.owner(), user);
    }

    function testRevertTransferOwnershipZero() public {
        vm.expectRevert("Invalid new owner");
        factory.transferOwnership(address(0));
    }

    function testRevertTransferOwnershipIfNotOwner() public {
        factory.transferOwnership(user);
        vm.prank(owner);
        vm.expectRevert("Only owner can call this");
        factory.transferOwnership(owner);
    }

    // Pour les tests startMatch, endMatch, verifyPOAPAttendance, claimWinnings, adminClaim, globalClaim,
    // il faudrait déployer un vrai BettingPool et mocker les appels, ou utiliser un mock contract.
    // Ces tests sont à compléter selon la logique de BettingPool.

    function testGetPoolsAndInfo() public {
        uint256 matchStart = block.timestamp + 10000; // Use larger timestamp
        address poolAddr = factory.createPool(
            team1Token,
            team2Token,
            matchStart,
            3600,
            5
        );
        address[] memory pools = factory.getPools();
        assertEq(pools.length, 1);
        (
            address t1,
            address t2,
            uint256 s,
            uint256 e,
            BettingPool.MatchStatus status,
            address winner
        ) = factory.getPoolInfo(poolAddr);
        assertEq(t1, team1Token);
        assertEq(t2, team2Token);
        assertEq(s, matchStart);
        assertEq(uint256(status), uint256(BettingPool.MatchStatus.UPCOMING));
        assertEq(winner, address(0));
    }

    function testRevertGetPoolInfoIfNotPool() public {
        vm.expectRevert("Invalid pool address");
        factory.getPoolInfo(address(0xdead));
    }
}
