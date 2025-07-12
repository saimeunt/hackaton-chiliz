// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {BettingPoolFactory} from "../../contracts/BettingPoolFactory.sol";
import {PoolManager} from "../../contracts/PoolManager.sol";
import {BettingPool} from "../../contracts/BettingPool.sol";
import {MockPOAP} from "../../contracts/MockPOAP.sol";

contract BettingPoolFactoryTest is Test {
    BettingPoolFactory factory;
    MockPOAP poapContract;
    address owner = address(this);
    address swapRouter = address(0x123);
    address team1Token = address(0x111);
    address team2Token = address(0x222);
    address user = address(0x999);

    function setUp() public {
        poapContract = new MockPOAP();
        factory = new BettingPoolFactory(swapRouter, address(poapContract));
        poapContract.setBettingPoolFactory(address(factory));
    }

    function testOwnerSetCorrectly() public view {
        assertEq(factory.owner(), owner);
        assertEq(factory.swapRouter(), swapRouter);
        assertEq(factory.poapContract(), address(poapContract));
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

    function testVerifyPOAPAttendance() public {
        uint256 matchStart = block.timestamp + 10000;
        factory.createPool(team1Token, team2Token, matchStart, 3600, 123);

        // Create the match in the POAP contract and award POAP to the user
        poapContract.createMatch(123, "Test Match");

        // Verify POAP attendance - this should be called by the POAP contract
        vm.expectEmit(true, true, false, true);
        emit PoolManager.POAPVerified(user, 123);
        vm.expectEmit(true, true, false, true);
        emit BettingPoolFactory.UserMatchCountUpdated(user, 1, 123);
        poapContract.awardPoap(user, 123);
    }

    function testRevertVerifyPOAPAttendanceIfNotPOAP() public {
        uint256 matchStart = block.timestamp + 10000;
        factory.createPool(team1Token, team2Token, matchStart, 3600, 124);

        vm.prank(user);
        vm.expectRevert("Only POAP can call this");
        factory.verifyPOAPAttendance(user, 124);
    }

    function testRevertVerifyPOAPAttendanceInvalidMatchId() public {
        vm.prank(address(poapContract));
        vm.expectRevert("Invalid match ID");
        factory.verifyPOAPAttendance(user, 9999);
    }

    function testCalculateMultiplier() public {
        uint256 multiplier = factory.calculateMultiplier(user);
        assertEq(multiplier, 100);
        for (uint256 i = 1; i <= 5; i++) {
            poapContract.createMatch(
                i,
                string(abi.encodePacked("Match ", vm.toString(i)))
            );
            uint256 matchStart = block.timestamp + 10000;
            factory.createPool(team1Token, team2Token, matchStart, 3600, i);
            poapContract.awardPoap(user, i);
        }
        multiplier = factory.calculateMultiplier(user);
        assertEq(multiplier, 100);
        assertEq(factory.userMatchCount(user), 5);
    }

    function testCalculateMultiplierIntermediate() public {
        for (uint256 i = 1; i <= 3; i++) {
            poapContract.createMatch(
                i,
                string(abi.encodePacked("Match ", vm.toString(i)))
            );
            uint256 matchStart = block.timestamp + 10000;
            factory.createPool(team1Token, team2Token, matchStart, 3600, i);
            poapContract.awardPoap(user, i);
        }
        uint256 multiplier = factory.calculateMultiplier(user);
        assertEq(multiplier, 100);
        assertEq(factory.userMatchCount(user), 3);
    }

    // For startMatch, endMatch, claimWinnings, adminClaim, globalClaim tests,
    // we would need to deploy a real BettingPool and mock the calls, or use a mock contract.
    // These tests need to be completed according to BettingPool logic.

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
            ,
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
