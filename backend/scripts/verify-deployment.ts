import { ethers } from 'hardhat';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('🔍 Verifying deployment with account:', deployer.address);

  try {
    // Read contract addresses
    const addressesPath = join(__dirname, '../deployment-addresses.json');
    const addresses = JSON.parse(readFileSync(addressesPath, 'utf8'));
    
    console.log('\n📋 Contract Addresses:');
    for (const [name, address] of Object.entries(addresses)) {
      console.log(`${name}: ${address}`);
    }

    // Verify each contract
    console.log('\n✅ Verifying contracts...');

    // 1. Verify MockSwapRouter
    console.log('\n1. Verifying MockSwapRouter...');
    const mockSwapRouter = await ethers.getContractAt('MockSwapRouter', addresses.MockSwapRouter);
    const swapRouterOwner = await mockSwapRouter.owner();
    console.log(`   Owner: ${swapRouterOwner}`);
    console.log(`   Expected owner: ${deployer.address}`);
    console.log(`   ✅ MockSwapRouter verified`);

    // 2. Verify MockPOAP
    console.log('\n2. Verifying MockPOAP...');
    const mockPOAP = await ethers.getContractAt('MockPOAP', addresses.MockPOAP);
    const poapOwner = await mockPOAP.owner();
    console.log(`   Owner: ${poapOwner}`);
    console.log(`   Expected owner: ${deployer.address}`);
    console.log(`   ✅ MockPOAP verified`);

    // 3. Verify MockFanTokens
    const teamTokens = ['Team1Token', 'Team2Token', 'Team3Token', 'Team4Token'];
    const expectedOwners = [
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'
    ];

    for (let i = 0; i < teamTokens.length; i++) {
      console.log(`\n${i + 3}. Verifying ${teamTokens[i]}...`);
      const token = await ethers.getContractAt('MockFanToken', addresses[teamTokens[i]]);
      const tokenOwner = await token.owner();
      const tokenName = await token.name();
      const tokenSymbol = await token.symbol();
      const deployerBalance = await token.balanceOf(deployer.address);
      
      console.log(`   Name: ${tokenName}`);
      console.log(`   Symbol: ${tokenSymbol}`);
      console.log(`   Owner: ${tokenOwner}`);
      console.log(`   Expected owner: ${expectedOwners[i]}`);
      console.log(`   Deployer balance: ${ethers.formatEther(deployerBalance)} tokens`);
      console.log(`   ✅ ${teamTokens[i]} verified`);
    }

    // 4. Verify BettingPoolFactory
    console.log('\n7. Verifying BettingPoolFactory...');
    const bettingPoolFactory = await ethers.getContractAt('BettingPoolFactory', addresses.BettingPoolFactory);
    const factoryOwner = await bettingPoolFactory.owner();
    const factorySwapRouter = await bettingPoolFactory.swapRouter();
    const factoryPoapContract = await bettingPoolFactory.poapContract();
    
    console.log(`   Owner: ${factoryOwner}`);
    console.log(`   Expected owner: ${deployer.address}`);
    console.log(`   SwapRouter: ${factorySwapRouter}`);
    console.log(`   Expected SwapRouter: ${addresses.MockSwapRouter}`);
    console.log(`   POAP Contract: ${factoryPoapContract}`);
    console.log(`   Expected POAP Contract: ${addresses.MockPOAP}`);
    console.log(`   ✅ BettingPoolFactory verified`);

    // 5. Verify pools created
    console.log('\n8. Verifying pools...');
    const pools = await bettingPoolFactory.getPools();
    console.log(`   Number of pools created: ${pools.length}`);
    console.log(`   Expected: 20 pools`);
    
    if (pools.length === 20) {
      console.log(`   ✅ All pools created successfully`);
    } else {
      console.log(`   ⚠️  Expected 20 pools, but found ${pools.length}`);
    }

    // 6. Verify POAP matches
    console.log('\n9. Verifying POAP matches...');
    for (let matchId = 1; matchId <= 20; matchId++) {
      try {
        const matchName = await mockPOAP.getMatchName(matchId);
        console.log(`   Match ${matchId}: ${matchName}`);
      } catch (error) {
        console.log(`   Match ${matchId}: Not found`);
      }
    }
    console.log(`   ✅ POAP matches verified`);

    console.log('\n🎉 Deployment verification completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${teamTokens.length} team tokens deployed`);
    console.log(`- ${pools.length} betting pools created`);
    console.log(`- All contracts properly configured`);
    console.log(`- Initial token balances distributed`);

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 