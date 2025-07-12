import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BettingPoolFactory, BettingPool, MockPOAP } from '@/typechain-types';

describe('BettingPoolFactory', function () {
  let factory: BettingPoolFactory;
  let owner: any, other: any;
  let swapRouter: any, poapContract: MockPOAP, team1Token: any, team2Token: any;

  beforeEach(async () => {
    [owner, other, swapRouter, , team1Token, team2Token] =
      await ethers.getSigners();

    // Deploy a real MockPOAP contract instead of using a signer
    poapContract = await (await ethers.getContractFactory('MockPOAP')).deploy();
    await poapContract.waitForDeployment();

    factory = await (
      await ethers.getContractFactory('BettingPoolFactory')
    ).deploy(swapRouter.address, await poapContract.getAddress());
    await factory.waitForDeployment();
  });

  it('should deploy with correct params', async () => {
    expect(await factory.owner()).to.equal(owner.address);
    expect(await factory.swapRouter()).to.equal(swapRouter.address);
    expect(await factory.poapContract()).to.equal(
      await poapContract.getAddress(),
    );
  });

  describe('createPool', () => {
    it('should create a pool and emit event', async () => {
      const block = await ethers.provider.getBlock('latest');
      if (!block) throw new Error('Block is null');
      const now = block.timestamp;

      await factory.createPool(
        team1Token.address,
        team2Token.address,
        now + 1000,
        3600,
        42,
      );
      const poolAddr = await factory.matchIdToPool(42);
      expect(poolAddr).to.not.equal(ethers.ZeroAddress);
      expect(await factory.isPool(poolAddr)).to.be.true;
    });
    it('should revert if not owner', async () => {
      await expect(
        factory
          .connect(other)
          .createPool(
            team1Token.address,
            team2Token.address,
            Date.now() + 1000,
            3600,
            43,
          ),
      ).to.be.revertedWith('Only owner can call this');
    });
    it('should revert if teams are the same', async () => {
      await expect(
        factory.createPool(
          team1Token.address,
          team1Token.address,
          Date.now() + 1000,
          3600,
          44,
        ),
      ).to.be.revertedWith('Teams must be different');
    });
    it('should revert if matchId already exists', async () => {
      const block = await ethers.provider.getBlock('latest');
      if (!block) throw new Error('Block is null');
      const now = block.timestamp;

      await factory.createPool(
        team1Token.address,
        team2Token.address,
        now + 1000,
        3600,
        45,
      );
      await expect(
        factory.createPool(
          team1Token.address,
          team2Token.address,
          now + 2000,
          3600,
          45,
        ),
      ).to.be.revertedWith('Match ID already exists');
    });
  });

  describe('startMatch/endMatch', () => {
    let poolAddr: string;
    beforeEach(async () => {
      const block = await ethers.provider.getBlock('latest');
      if (!block) throw new Error('Block is null');
      const now = block.timestamp;

      await factory.createPool(
        team1Token.address,
        team2Token.address,
        now + 1000,
        3600,
        99,
      );
      poolAddr = await factory.matchIdToPool(99);
    });
    it('should start and end match as owner', async () => {
      await expect(factory.startMatch(poolAddr)).to.emit(
        factory,
        'MatchStarted',
      );
      // Advance time after matchEndTime
      const pool = await ethers.getContractAt('BettingPool', poolAddr);
      const matchEndTime = await pool.matchEndTime();
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        Number(matchEndTime) + 1,
      ]);
      await ethers.provider.send('evm_mine', []);
      await expect(factory.endMatch(poolAddr, team1Token.address)).to.emit(
        factory,
        'MatchEnded',
      );
    });
    it('should revert if not owner', async () => {
      await expect(
        factory.connect(other).startMatch(poolAddr),
      ).to.be.revertedWith('Only owner can call this');
      await expect(
        factory.connect(other).endMatch(poolAddr, team1Token.address),
      ).to.be.revertedWith('Only owner can call this');
    });
  });

  describe('verifyPOAPAttendance', () => {
    let poolAddr: string;
    beforeEach(async () => {
      const block = await ethers.provider.getBlock('latest');
      if (!block) throw new Error('Block is null');
      const now = block.timestamp;

      await factory.createPool(
        team1Token.address,
        team2Token.address,
        now + 1000,
        3600,
        123,
      );
      poolAddr = await factory.matchIdToPool(123);

      // Create the match in the POAP contract and award POAP to the owner
      await poapContract.createMatch(123, 'Test Match');
      await poapContract.awardPoap(owner.address, 123);
    });
    it('should verify POAP and emit event', async () => {
      await expect(factory.verifyPOAPAttendance(owner.address, 123))
        .to.emit(factory, 'POAPVerified')
        .withArgs(owner.address, 123);
    });
    it('should revert if not owner', async () => {
      await expect(
        factory.connect(other).verifyPOAPAttendance(owner.address, 123),
      ).to.be.revertedWith('Only owner can call this');
    });
    it('should revert if matchId invalid', async () => {
      await expect(
        factory.verifyPOAPAttendance(owner.address, 9999),
      ).to.be.revertedWith('Invalid match ID');
    });
  });

  describe('ownership', () => {
    it('should transfer ownership', async () => {
      await factory.transferOwnership(other.address);
      expect(await factory.owner()).to.equal(other.address);
    });
    it('should revert transfer to zero', async () => {
      await expect(
        factory.transferOwnership(ethers.ZeroAddress),
      ).to.be.revertedWith('Invalid new owner');
    });
    it('should revert if not owner', async () => {
      await expect(
        factory.connect(other).transferOwnership(owner.address),
      ).to.be.revertedWith('Only owner can call this');
    });
  });

  describe('emergencyRecover', () => {
    it('should revert if not owner', async () => {
      await expect(
        factory.connect(other).emergencyRecover(team1Token.address, 100),
      ).to.be.revertedWith('Only owner can call this');
    });
    // Pour un vrai test, il faudrait un mock ERC20
  });

  describe('calculateMultiplier', () => {
    it('should return 0.8x multiplier for new users', async () => {
      const multiplier = await factory.calculateMultiplier(owner.address);
      expect(multiplier).to.equal(80n); // 0.8 * 100
    });

    it('should return 1.0x multiplier after 5 matches', async () => {
      // Award POAPs for 5 matches to simulate 5 match attendances
      for (let i = 1; i <= 5; i++) {
        await poapContract.createMatch(i, `Match ${i}`);
        await poapContract.awardPoap(owner.address, i);

        // Create a pool for this matchId
        const block = await ethers.provider.getBlock('latest');
        if (!block) throw new Error('Block is null');
        const now = block.timestamp;

        await factory.createPool(
          team1Token.address,
          team2Token.address,
          now + 1000,
          3600,
          i,
        );

        await factory.verifyPOAPAttendance(owner.address, i);
      }

      const multiplier = await factory.calculateMultiplier(owner.address);
      expect(multiplier).to.equal(100n); // 1.0 * 100
    });

    it('should return 1.5x multiplier after 100 matches', async () => {
      // Award POAPs for 100 matches to simulate 100 match attendances
      for (let i = 1; i <= 100; i++) {
        await poapContract.createMatch(i, `Match ${i}`);
        await poapContract.awardPoap(owner.address, i);

        // Create a pool for this matchId
        const block = await ethers.provider.getBlock('latest');
        if (!block) throw new Error('Block is null');
        const now = block.timestamp;

        await factory.createPool(
          team1Token.address,
          team2Token.address,
          now + 1000,
          3600,
          i,
        );

        await factory.verifyPOAPAttendance(owner.address, i);
      }

      const multiplier = await factory.calculateMultiplier(owner.address);
      expect(multiplier).to.equal(150n); // 1.5 * 100
    });

    it('should return intermediate multiplier for users with 1-4 matches', async () => {
      // Award POAPs for 3 matches to simulate 3 match attendances
      for (let i = 1; i <= 3; i++) {
        await poapContract.createMatch(i, `Match ${i}`);
        await poapContract.awardPoap(owner.address, i);

        // Create a pool for this matchId
        const block = await ethers.provider.getBlock('latest');
        if (!block) throw new Error('Block is null');
        const now = block.timestamp;

        await factory.createPool(
          team1Token.address,
          team2Token.address,
          now + 1000,
          3600,
          i,
        );

        await factory.verifyPOAPAttendance(owner.address, i);
      }

      const multiplier = await factory.calculateMultiplier(owner.address);
      // Should be between 0.8 and 1.0 (80 and 100)
      expect(multiplier).to.be.greaterThan(80n);
      expect(multiplier).to.be.lessThan(100n);
    });
  });

  describe('views', () => {
    it('should return pools and info', async () => {
      const block = await ethers.provider.getBlock('latest');
      if (!block) throw new Error('Block is null');
      const now = block.timestamp;

      await factory.createPool(
        team1Token.address,
        team2Token.address,
        now + 1000,
        3600,
        77,
      );
      const pools = await factory.getPools();
      expect(pools.length).to.equal(1);
      const info = await factory.getPoolInfo(pools[0]);
      expect(info.team1Token).to.equal(team1Token.address);
      expect(info.team2Token).to.equal(team2Token.address);
    });
    it('should revert getPoolInfo if not a pool', async () => {
      await expect(factory.getPoolInfo(owner.address)).to.be.revertedWith(
        'Invalid pool address',
      );
    });
  });
});
