import { ethers } from 'hardhat';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    '🚀 Starting complete deployment process with account:',
    deployer.address,
  );
  console.log(
    'Account balance:',
    ethers.formatEther(await deployer.provider.getBalance(deployer.address)),
    'ETH',
  );

  try {
    // Step 1: Deploy contracts using Ignition
    console.log('\n📦 Step 1: Deploying contracts with Ignition...');
    const { stdout: ignitionOutput, stderr: ignitionError } = await execAsync(
      'npx hardhat ignition deploy ignition/modules/BettingPoolModule.ts',
    );

    if (ignitionError) {
      console.error('Ignition deployment stderr:', ignitionError);
    }

    console.log('Ignition deployment completed successfully!');
    console.log(ignitionOutput);

    // Step 2: Extract contract addresses
    console.log('\n📍 Step 2: Extracting contract addresses...');
    const { stdout: extractOutput, stderr: extractError } = await execAsync(
      'npx hardhat run scripts/extract-addresses.ts',
    );

    if (extractError) {
      console.error('Address extraction stderr:', extractError);
    }

    console.log('Address extraction completed!');
    console.log(extractOutput);

    // Step 3: Run post-deployment operations
    console.log('\n⚡ Step 3: Running post-deployment operations...');
    const { stdout: postDeployOutput, stderr: postDeployError } =
      await execAsync('npx hardhat run scripts/post-deployment.ts');

    if (postDeployError) {
      console.error('Post-deployment stderr:', postDeployError);
    }

    console.log('Post-deployment operations completed!');
    console.log(postDeployOutput);

    console.log('\n✅ Complete deployment process finished successfully!');
    console.log('\n📋 Summary:');
    console.log('- All contracts deployed via Ignition');
    console.log('- Contract addresses extracted and saved');
    console.log('- Post-deployment operations completed');
    console.log('- Random matches created and configured');
    console.log('- POAPs awarded to random users');
  } catch (error) {
    console.error('❌ Deployment process failed:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
