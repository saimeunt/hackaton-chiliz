import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

import BettingPoolModule from './BettingPoolModule';

const ADDR_0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Deployer
const ADDR_1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Team 1 Owner
const ADDR_2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'; // Team 2 Owner
const ADDR_3 = '0x90F79bf6EB2c4f870365E785982E1f101E93b906'; // Team 3 Owner
const ADDR_4 = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'; // Team 4 Owner

const bettingPoolFactoryAddress = '0x8E45C0936fa1a65bDaD3222bEFeC6a03C83372cE';

// Helper function to get random number between min and max
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random match data
function generateRandomMatch(index: number) {
  const teamNames = [
    'PSG',
    'Real Madrid',
    'Barcelona',
    'Manchester United',
    'Liverpool',
    'Bayern Munich',
    'Juventus',
    'AC Milan',
    'Inter Milan',
    'Arsenal',
    'Chelsea',
    'Manchester City',
    'Atletico Madrid',
    'Borussia Dortmund',
    'Porto',
    'Benfica',
    'Ajax',
    'PSV',
    'Feyenoord',
    'Celtic',
  ];

  const team1Index = index % teamNames.length;
  const team2Index = (index + 1) % teamNames.length;

  return {
    team1Name: teamNames[team1Index],
    team2Name: teamNames[team2Index],
    matchStartTime:
      Math.floor(Date.now() / 1000) + getRandomNumber(3600, 86400 * 7), // 1 hour to 7 days from now
    matchDuration: getRandomNumber(5400, 7200), // 1.5 to 2 hours
    matchId: index + 1,
  };
}

const BettingPoolSeedModule = buildModule('BettingPoolSeedModule', (module) => {
  const { wPSGToken, wACMToken, mockPOAP } =
    module.useModule(BettingPoolModule);

  const bettingPoolFactory = module.contractAt(
    'BettingPoolFactory',
    bettingPoolFactoryAddress,
  );
  // --- MATCHES RANDOMIZATION ---
  const NB_MATCHES = 20;
  const teamTokens = [wPSGToken, wACMToken];

  for (let i = 0; i < NB_MATCHES; i++) {
    const ID = String(i).padStart(3, '0');

    // Generate random match data
    const matchData = generateRandomMatch(i);

    // Select random team tokens (different teams)
    const team1TokenIndex = i % teamTokens.length;
    const team2TokenIndex = (i + 1) % teamTokens.length;

    // === Create match POAP
    const callCreatePOAP = module.call(
      mockPOAP,
      'createMatch',
      [
        BigInt(matchData.matchId),
        `${matchData.team1Name} vs ${matchData.team2Name}`,
      ],
      {
        from: bettingPoolFactoryAddress,
        after: [mockPOAP],
        id: `create_poap_${ID}`,
      },
    );

    // === Create betting pool
    const callCreatePool = module.call(
      bettingPoolFactory,
      'createPool',
      [
        teamTokens[team1TokenIndex],
        teamTokens[team2TokenIndex],
        BigInt(matchData.matchStartTime),
        BigInt(matchData.matchDuration),
        BigInt(matchData.matchId),
      ],
      {
        after: [callCreatePOAP, bettingPoolFactory],
        id: `create_pool_${ID}`,
      },
    );

    // === Randomly start some matches (70% chance)
    // Note: We'll create pools but won't start/end them automatically
    // as we need the actual pool addresses which are created dynamically
    // These operations should be done manually after deployment or through
    // a separate script that can read the pool addresses from events

    // === Randomly award POAPs to some users (40% chance)
    const shouldAwardPOAP = getRandomNumber(0, 99) < 40;
    if (shouldAwardPOAP) {
      // Award POAP to random users
      const users = [ADDR_0, ADDR_1, ADDR_2, ADDR_3, ADDR_4];
      const randomUser = users[getRandomNumber(0, users.length - 1)];

      module.call(
        mockPOAP,
        'awardPoap',
        [randomUser, BigInt(matchData.matchId)],
        {
          after: [callCreatePOAP],
          id: `award_poap_${ID}`,
        },
      );
    }
  }

  return {};
});

export default BettingPoolSeedModule;
