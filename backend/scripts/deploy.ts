import { ethers } from 'hardhat';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  try {
    // Deploy using Ignition
    console.log('Deploying contracts with Ignition...');
    const { stdout, stderr } = await execAsync('npx hardhat ignition deploy ignition/modules/BettingPoolModule.ts');
    
    if (stderr) {
      console.error('Ignition deployment stderr:', stderr);
    }
    
    console.log('Ignition deployment output:', stdout);

    // Extract contract addresses from the deployment output
    // This is a simplified approach - in a real scenario, you'd parse the deployment artifacts
    console.log('Extracting contract addresses...');
    
    // For now, we'll set environment variables manually or read from deployment artifacts
    // In a real implementation, you'd parse the Ignition deployment output to get addresses
    
    console.log('Deployment completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Update the contract addresses in the post-deployment script');
    console.log('2. Run: npx hardhat run scripts/post-deployment.ts --network <network>');
    console.log('');
    console.log('Contract addresses will be available in the Ignition deployment artifacts');
    
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 