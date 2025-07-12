// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {PoolManager} from "../../contracts/PoolManager.sol";
import {BettingPool} from "../../contracts/BettingPool.sol";
import {MockPOAP} from "../../contracts/MockPOAP.sol";
import {MockSwapRouter} from "../../contracts/MockSwapRouter.sol";

contract TestablePoolManager is PoolManager {
    constructor(
        address swapRouter,
        address poapContract
    ) PoolManager(swapRouter, poapContract) {}
    function createPoolTestable(
        address team1Token,
        address team2Token,
        uint256 matchStartTime,
        uint256 matchDuration,
        string memory matchName
    ) public returns (address) {
        return
            _createPool(
                team1Token,
                team2Token,
                matchStartTime,
                matchDuration,
                matchName
            );
    }
    function endMatchTestable(
        address poolAddress,
        address winningTeamToken
    ) public {
        _endMatch(poolAddress, winningTeamToken);
    }
}

contract PoolManagerTest is Test {
    TestablePoolManager public poolManager;
    MockPOAP public poapContract;
    MockSwapRouter public swapRouter;

    address public owner = address(this);
    address public team1Token = address(0x111);
    address public team2Token = address(0x222);
    address public user = address(0x999);

    function setUp() public {
        poapContract = new MockPOAP();
        swapRouter = new MockSwapRouter();
        poolManager = new TestablePoolManager(
            address(swapRouter),
            address(poapContract)
        );
    }

    function testConstructor() public view {
        assertEq(poolManager.swapRouter(), address(swapRouter));
        assertEq(poolManager.poapContract(), address(poapContract));
    }

    function testCreatePool() public {
        uint256 matchStart = block.timestamp + 10000;
        string memory matchName = "Test Match";

        address poolAddr = poolManager.createPoolTestable(
            team1Token,
            team2Token,
            matchStart,
            3600,
            matchName
        );

        assertTrue(poolManager.isPool(poolAddr));
        assertEq(poolManager.getPoolCount(), 1);

        address[] memory pools = poolManager.getPools();
        assertEq(pools.length, 1);
        assertEq(pools[0], poolAddr);
    }

    function testCreatePoolWithMatchId() public {
        uint256 matchStart = block.timestamp + 10000;
        string memory matchName = "Test Match";

        address poolAddr = poolManager.createPoolTestable(
            team1Token,
            team2Token,
            matchStart,
            3600,
            matchName
        );

        // Check that the pool is mapped to matchId 0 (first pool)
        assertEq(poolManager.getPoolByMatchId(0), poolAddr);
    }

    function testGetPoolInfo() public {
        uint256 matchStart = block.timestamp + 10000;
        string memory matchName = "Test Match";

        address poolAddr = poolManager.createPoolTestable(
            team1Token,
            team2Token,
            matchStart,
            3600,
            matchName
        );

        (
            address t1,
            address t2,
            uint256 startTime,
            uint256 endTime,
            BettingPool.MatchStatus status,
            address winner
        ) = poolManager.getPoolInfo(poolAddr);

        assertEq(t1, team1Token);
        assertEq(t2, team2Token);
        assertEq(startTime, matchStart);
        assertEq(endTime, matchStart + 3600);
        assertEq(uint256(status), uint256(BettingPool.MatchStatus.UPCOMING));
        assertEq(winner, address(0));
    }

    function testGetPoolInfoAfterTimeAdvance() public {
        uint256 matchStart = block.timestamp + 10000;
        string memory matchName = "Test Match";

        address poolAddr = poolManager.createPoolTestable(
            team1Token,
            team2Token,
            matchStart,
            3600,
            matchName
        );

        // Advance time to after match start
        vm.warp(matchStart + 1000);

        (, , , , BettingPool.MatchStatus status, ) = poolManager.getPoolInfo(
            poolAddr
        );

        // Status should be IN_PROGRESS now
        assertEq(uint256(status), uint256(BettingPool.MatchStatus.IN_PROGRESS));
    }

    function testGetPoolInfoAfterMatchEnd() public {
        uint256 matchStart = block.timestamp + 10000;
        string memory matchName = "Test Match";

        address poolAddr = poolManager.createPoolTestable(
            team1Token,
            team2Token,
            matchStart,
            3600,
            matchName
        );

        // Advance time to after match end
        vm.warp(matchStart + 3600 + 1000);

        (, , , , BettingPool.MatchStatus status, ) = poolManager.getPoolInfo(
            poolAddr
        );

        // Status should still be IN_PROGRESS (not FINISHED until endMatch is called)
        assertEq(uint256(status), uint256(BettingPool.MatchStatus.IN_PROGRESS));
    }

    function testEndMatch() public {
        uint256 matchStart = block.timestamp + 10000;
        string memory matchName = "Test Match";

        address poolAddr = poolManager.createPoolTestable(
            team1Token,
            team2Token,
            matchStart,
            3600,
            matchName
        );

        // Advance time to after match end
        vm.warp(matchStart + 3600 + 1000);

        // End the match
        poolManager.endMatchTestable(poolAddr, team1Token);

        (, , , , BettingPool.MatchStatus status, address winner) = poolManager
            .getPoolInfo(poolAddr);

        // Status should be FINISHED now
        assertEq(uint256(status), uint256(BettingPool.MatchStatus.FINISHED));
        assertEq(winner, team1Token);
    }

    function testVerifyPOAPAttendance() public {
        uint256 matchStart = block.timestamp + 10000;
        string memory matchName = "Test Match";

        address poolAddr = poolManager.createPoolTestable(
            team1Token,
            team2Token,
            matchStart,
            3600,
            matchName
        );

        // Verify POAP attendance for match 0
        vm.expectEmit(true, true, false, true);
        emit PoolManager.POAPVerified(user, 0);
        poolManager._verifyPOAPAttendance(user, 0);
    }

    function testRevertVerifyPOAPAttendanceInvalidMatchId() public {
        vm.expectRevert("Invalid match ID");
        poolManager._verifyPOAPAttendance(user, 999);
    }

    function testRevertCreatePoolSameTeams() public {
        vm.expectRevert("Teams must be different");
        poolManager.createPoolTestable(
            team1Token,
            team1Token,
            block.timestamp + 1000,
            3600,
            "Test Match"
        );
    }

    function testRevertCreatePoolPastStartTime() public {
        vm.expectRevert("Match start time must be in the future");
        poolManager.createPoolTestable(
            team1Token,
            team2Token,
            block.timestamp - 1000, // Past time
            3600,
            "Test Match"
        );
    }

    function testRevertCreatePoolZeroDuration() public {
        vm.expectRevert("Match duration must be positive");
        poolManager.createPoolTestable(
            team1Token,
            team2Token,
            block.timestamp + 1000,
            0, // Zero duration
            "Test Match"
        );
    }

    function testRevertGetPoolInfoInvalidPool() public {
        vm.expectRevert("Invalid pool address");
        poolManager.getPoolInfo(address(0xdead));
    }

    function testMultiplePools() public {
        uint256 matchStart1 = block.timestamp + 10000;
        uint256 matchStart2 = block.timestamp + 20000;

        address poolAddr1 = poolManager.createPoolTestable(
            team1Token,
            team2Token,
            matchStart1,
            3600,
            "Match 1"
        );

        address poolAddr2 = poolManager.createPoolTestable(
            team2Token,
            team1Token,
            matchStart2,
            3600,
            "Match 2"
        );

        assertEq(poolManager.getPoolCount(), 2);
        assertEq(poolManager.getPoolByMatchId(0), poolAddr1);
        assertEq(poolManager.getPoolByMatchId(1), poolAddr2);

        address[] memory pools = poolManager.getPools();
        assertEq(pools.length, 2);
        assertEq(pools[0], poolAddr1);
        assertEq(pools[1], poolAddr2);
    }

    function testMatchStatusTransitions() public {
        uint256 matchStart = block.timestamp + 10000;
        string memory matchName = "Test Match";

        address poolAddr = poolManager.createPoolTestable(
            team1Token,
            team2Token,
            matchStart,
            3600,
            matchName
        );

        // Initially UPCOMING
        (, , , , BettingPool.MatchStatus status, ) = poolManager.getPoolInfo(
            poolAddr
        );
        assertEq(uint256(status), uint256(BettingPool.MatchStatus.UPCOMING));

        // After match start - IN_PROGRESS
        vm.warp(matchStart + 1000);
        (, , , , status, ) = poolManager.getPoolInfo(poolAddr);
        assertEq(uint256(status), uint256(BettingPool.MatchStatus.IN_PROGRESS));

        // After match end but before endMatch - still IN_PROGRESS
        vm.warp(matchStart + 3600 + 1000);
        (, , , , status, ) = poolManager.getPoolInfo(poolAddr);
        assertEq(uint256(status), uint256(BettingPool.MatchStatus.IN_PROGRESS));

        // After endMatch - FINISHED
        poolManager.endMatchTestable(poolAddr, team1Token);
        (, , , , status, ) = poolManager.getPoolInfo(poolAddr);
        assertEq(uint256(status), uint256(BettingPool.MatchStatus.FINISHED));
    }
}
