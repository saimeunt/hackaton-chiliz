import { ethers } from 'hardhat';
import { readFileSync } from 'fs';
import { join } from 'path';

// Helper function to get random number between min and max
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Running post-deployment script with account:', deployer.address);

  // Read contract addresses from deployment artifacts
  const addressesPath = join(__dirname, '../deployment-addresses.json');
  let addresses: { [key: string]: string } = {};

  try {
    addresses = JSON.parse(readFileSync(addressesPath, 'utf8'));
    console.log('Loaded contract addresses from deployment artifacts');
  } catch (error) {
    console.error(
      'Failed to load deployment addresses, using environment variables as fallback',
    );
    addresses = {
      BettingPoolFactory:
        process.env.BETTING_POOL_FACTORY_ADDRESS ||
        '0x0000000000000000000000000000000000000000',
      MockPOAP:
        process.env.MOCK_POAP_ADDRESS ||
        '0x0000000000000000000000000000000000000000',
    };
  }

  const bettingPoolFactory = await ethers.getContractAt(
    'BettingPoolFactory',
    addresses.BettingPoolFactory,
  );
  const mockPOAP = await ethers.getContractAt('MockPOAP', addresses.MockPOAP);

  console.log(
    'BettingPoolFactory deployed at:',
    await bettingPoolFactory.getAddress(),
  );
  console.log('MockPOAP deployed at:', await mockPOAP.getAddress());

  // Get all pools created during deployment
  const pools = await bettingPoolFactory.getPools();
  console.log(`Found ${pools.length} pools created during deployment`);

  // Process each pool for post-deployment operations
  for (let i = 0; i < pools.length; i++) {
    const poolAddress = pools[i];
    console.log(`Processing pool ${i + 1}: ${poolAddress}`);

    // Get pool details
    const pool = await ethers.getContractAt('BettingPool', poolAddress);
    const matchStartTime = await pool.matchStartTime();
    const currentTime = Math.floor(Date.now() / 1000);

    // Randomly start some matches (70% chance)
    const shouldStartMatch = getRandomNumber(0, 99) < 70;
    if (shouldStartMatch && currentTime >= Number(matchStartTime)) {
      try {
        console.log(`Starting match for pool ${i + 1}`);
        const tx = await bettingPoolFactory.startMatch(poolAddress);
        await tx.wait();
        console.log(`Match started for pool ${i + 1}`);
      } catch (error) {
        console.log(`Failed to start match for pool ${i + 1}:`, error);
      }
    }

    // Randomly end some matches (30% of started matches)
    if (shouldStartMatch) {
      const shouldEndMatch = getRandomNumber(0, 99) < 30;
      if (shouldEndMatch) {
        try {
          const team1Token = await pool.team1Token();
          const team2Token = await pool.team2Token();

          // Randomly select winner (50/50 chance)
          const winningTeamToken =
            getRandomNumber(0, 1) === 0 ? team1Token : team2Token;

          console.log(
            `Ending match for pool ${i + 1} with winner: ${winningTeamToken}`,
          );
          const tx = await bettingPoolFactory.endMatch(
            poolAddress,
            winningTeamToken,
          );
          await tx.wait();
          console.log(`Match ended for pool ${i + 1}`);
        } catch (error) {
          console.log(`Failed to end match for pool ${i + 1}:`, error);
        }
      }
    }
  }

  // Award POAPs to random users for some matches
  const users = [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  ];

  // Award POAPs for matches 1-20 (40% chance each)
  for (let matchId = 1; matchId <= 20; matchId++) {
    const shouldAwardPOAP = getRandomNumber(0, 99) < 40;
    if (shouldAwardPOAP) {
      const randomUser = users[getRandomNumber(0, users.length - 1)];
      try {
        console.log(`Awarding POAP for match ${matchId} to ${randomUser}`);
        const tx = await mockPOAP.awardPoap(randomUser, matchId);
        await tx.wait();
        console.log(`POAP awarded for match ${matchId}`);
      } catch (error) {
        console.log(`Failed to award POAP for match ${matchId}:`, error);
      }
    }
  }

  console.log('Post-deployment script completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
