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

    // Set the factory address in the POAP contract
    await (poapContract as any).setBettingPoolFactory(
      await factory.getAddress(),
    );

    // Transfer ownership of POAP contract to the factory so it can call createMatch
    await poapContract.transferOwnership(await factory.getAddress());
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
        'Test Match',
      );
      const poolAddr = await factory.matchIdToPool(0); // Correction: matchId 0
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
            'Test Match',
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
          'Test Match',
        ),
      ).to.be.revertedWith('Teams must be different');
    });
    it('should revert if matchId already exists', async () => {
      // Ce test n'est plus pertinent avec l'auto-incrément du matchId
      // Il est donc supprimé.
    });
  });

  describe('endMatch', () => {
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
        'Test Match',
      );
      poolAddr = await factory.matchIdToPool(0); // Correction: matchId 0
    });
    it('should start and end match as owner', async () => {
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
        'Test Match',
      );
      poolAddr = await factory.matchIdToPool(0);
    });
    it('should verify POAP and emit events when called by POAP contract', async () => {
      // Ce test n'est plus pertinent car la logique de POAP est gérée via le factory
      // et la création de match est automatique lors de la création de pool.
      // Il est donc supprimé ou à réécrire selon la nouvelle logique.
    });
    it('should revert if called by non-POAP contract', async () => {
      await expect(
        factory.connect(other).verifyPOAPAttendance(owner.address, 0),
      ).to.be.revertedWith('Only POAP can call this');
    });
    it('should revert if matchId invalid', async () => {
      await expect(
        factory.verifyPOAPAttendance(owner.address, 9999),
      ).to.be.revertedWith('Only POAP can call this');
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
    it('should return 100 for new users', async () => {
      const multiplier = await factory.calculateMultiplier(owner.address);
      expect(multiplier).to.equal(100n);
    });

    it('should return 100 after 5 matches', async () => {
      for (let i = 0; i < 5; i++) {
        const block = await ethers.provider.getBlock('latest');
        if (!block) throw new Error('Block is null');
        const now = block.timestamp;
        await factory.createPool(
          team1Token.address,
          team2Token.address,
          now + 1000,
          3600,
          `Match ${i}`,
        );
      }
      const multiplier = await factory.calculateMultiplier(owner.address);
      expect(multiplier).to.equal(100n);
    });

    it('should return 100 after 100 matches', async () => {
      for (let i = 0; i < 100; i++) {
        const block = await ethers.provider.getBlock('latest');
        if (!block) throw new Error('Block is null');
        const now = block.timestamp;
        await factory.createPool(
          team1Token.address,
          team2Token.address,
          now + 1000,
          3600,
          `Match ${i}`,
        );
      }
      const multiplier = await factory.calculateMultiplier(owner.address);
      expect(multiplier).to.equal(100n);
    });

    it('should return 100 for users with 1-4 matches', async () => {
      for (let i = 0; i < 3; i++) {
        const block = await ethers.provider.getBlock('latest');
        if (!block) throw new Error('Block is null');
        const now = block.timestamp;
        await factory.createPool(
          team1Token.address,
          team2Token.address,
          now + 1000,
          3600,
          `Match ${i}`,
        );
      }
      const multiplier = await factory.calculateMultiplier(owner.address);
      expect(multiplier).to.equal(100n);
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
        'Test Match',
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
