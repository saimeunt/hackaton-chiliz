import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface DeploymentArtifact {
  contracts: {
    [contractName: string]: {
      address: string;
      transactionHash: string;
    };
  };
}

async function main() {
  try {
    // Read the latest deployment artifact
    const artifactsPath = join(
      __dirname,
      '../ignition/deployments/chain-1337/artifacts',
    );
    const files = readFileSync(artifactsPath, 'utf8')
      .split('\n')
      .filter((f) => f.endsWith('.json'));

    if (files.length === 0) {
      console.error('No deployment artifacts found');
      return;
    }

    // Get the latest deployment file
    const latestFile = files[files.length - 1];
    const deploymentPath = join(artifactsPath, latestFile);

    console.log(`Reading deployment from: ${deploymentPath}`);

    const deploymentData: DeploymentArtifact = JSON.parse(
      readFileSync(deploymentPath, 'utf8'),
    );

    // Extract contract addresses
    const addresses: { [key: string]: string } = {};

    for (const [contractName, contractData] of Object.entries(
      deploymentData.contracts,
    )) {
      addresses[contractName] = contractData.address;
      console.log(`${contractName}: ${contractData.address}`);
    }

    // Write addresses to a file for easy access
    const addressesPath = join(__dirname, '../deployment-addresses.json');
    writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

    console.log(`\nContract addresses saved to: ${addressesPath}`);
    console.log(
      '\nYou can now use these addresses in your post-deployment script',
    );
  } catch (error) {
    console.error('Error extracting addresses:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
