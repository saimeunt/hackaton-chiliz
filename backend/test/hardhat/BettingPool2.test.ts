import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BettingPool, ERC20 } from '@/typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

import routerAbi from './uniswap-v2-router-v2';

const WCHZ = '0x677F7e16C7Dd57be1D4C8aD1244883214953DC47';
const WPSG = '0x476eF844B3E8318b3bc887a7db07a1A0FEde5557';
const WACM = '0x859DB9e2569bb87990482fC53E2F902E52585Ecb';
const USER = '0x4d7865cC31411AB4E411D90557eD8Ae501f6d7Aa';
const ROUTER = '0x1918EbB39492C8b98865c5E53219c3f1AE79e76F';

describe('BettingPool tests', () => {
  let bettingPoolContract: BettingPool;
  let team1Token: ERC20;
  let team2Token: ERC20;
  let owner: HardhatEthersSigner,
    addr1: HardhatEthersSigner,
    addr2: HardhatEthersSigner,
    addr3: HardhatEthersSigner;

  async function deployContractFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    //
    const wCHZ = await ethers.getContractAt('ERC20', WCHZ);
    console.log(wCHZ.target);
    console.log('WCHZ BAL', await wCHZ.balanceOf(USER));
    //
    const wPSG = await ethers.getContractAt('ERC20', WPSG);
    console.log(wPSG.target);
    console.log('WPSG BAL', await wPSG.balanceOf(USER));
    //
    const wACM = await ethers.getContractAt('ERC20', WACM);
    console.log(wACM.target);
    console.log('WACM BAL', await wACM.balanceOf(USER));
    //
    const router = await new ethers.Contract(ROUTER, routerAbi, owner.provider);
    console.log('router.WETH()', await router.WETH());
    //
    const user = await ethers.getSigner(USER);
    //
    await wPSG.connect(user).transfer(owner.address, 100n);
    console.log('WPSG BAL', await wPSG.balanceOf(USER));
    console.log('WPSG BAL', await wPSG.balanceOf(owner.address));
    //
    //await router.swapExactTokensForTokens(0, 0, [], '0x', 0);
    //
    const poapContract = await ethers.deployContract('MockPOAP', []);
    const bettingPoolFactoryContract = await ethers.deployContract(
      'BettingPoolFactory',
      [ROUTER, poapContract],
    );
    const block = await ethers.provider.getBlock('latest');
    if (!block) {
      throw new Error('Block is null');
    }
    const bettingPoolContract = await ethers.deployContract('BettingPool', [
      bettingPoolFactoryContract,
      ROUTER,
      poapContract,
      wPSG,
      wACM,
      block.timestamp + 7200,
      7200,
    ]);
    return {
      bettingPoolContract,
      team1Token: wPSG,
      team2Token: wACM,
      owner,
      addr1,
      addr2,
      addr3,
    };
  }

  beforeEach(async () => {
    const fixture = await loadFixture(deployContractFixture);
    bettingPoolContract = fixture.bettingPoolContract;
    team1Token = fixture.team1Token;
    team2Token = fixture.team2Token;
    owner = fixture.owner;
    addr1 = fixture.addr1;
    addr2 = fixture.addr2;
    addr3 = fixture.addr3;
  });

  // calculate multiplier
  /*
  AdminContract.pomaTokenIds(fanTokenAddress) => list of POMA involving a team
  => iterate on the list and aggregate POMA balances (ERC1155)
  */

  describe('constructor', () => {
    it('should deploy the contract', async () => {
      expect(await bettingPoolContract.team1Token()).to.equal(team1Token);
      expect(await bettingPoolContract.team2Token()).to.equal(team2Token);
    });
  });
});
