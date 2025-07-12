import { ethers } from 'hardhat';

async function main() {
  console.log('🚀 Configuring sports betting system...');

  // Check that Hardhat is configured
  const [deployer] = await ethers.getSigners();
  console.log('📋 Deployment account:', deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');

  console.log('\n✅ Configuration completed!');
  console.log('\n📖 Next steps:');
  console.log(
    '1. Install Foundry: curl -L https://foundry.paradigm.xyz | bash',
  );
  console.log('2. Run tests: forge test');
  console.log('3. Compile contracts: forge build');
  console.log('\n🔧 Or use Hardhat:');
  console.log('1. Start local node: pnpm start:node');
  console.log('2. Run tests: pnpm test:hardhat');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
