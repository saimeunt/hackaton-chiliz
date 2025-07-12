import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

// Addresses for deployment
const ADDR_0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Deployer
const ADDR_1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Team 1 Owner
const ADDR_2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'; // Team 2 Owner
const ADDR_3 = '0x90F79bf6EB2c4f870365E785982E1f101E93b906'; // Team 3 Owner
const ADDR_4 = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'; // Team 4 Owner

// Helper function to get random number between min and max
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random match data
function generateRandomMatch(index: number) {
  const teamNames = [
    'PSG', 'Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool',
    'Bayern Munich', 'Juventus', 'AC Milan', 'Inter Milan', 'Arsenal',
    'Chelsea', 'Manchester City', 'Atletico Madrid', 'Borussia Dortmund',
    'Porto', 'Benfica', 'Ajax', 'PSV', 'Feyenoord', 'Celtic'
  ];
  
  const team1Index = index % teamNames.length;
  const team2Index = (index + 1) % teamNames.length;
  
  return {
    team1Name: teamNames[team1Index],
    team2Name: teamNames[team2Index],
    matchStartTime: Math.floor(Date.now() / 1000) + getRandomNumber(3600, 86400 * 7), // 1 hour to 7 days from now
    matchDuration: getRandomNumber(5400, 7200), // 1.5 to 2 hours
    matchId: index + 1
  };
}

const BettingPoolModule = buildModule('BettingPoolModule', (module) => {
  // 1. Deploy MockSwapRouter (no constructor parameters)
  const mockSwapRouter = module.contract('MockSwapRouter', []);

  // 2. Deploy MockPOAP (no constructor parameters)
  const mockPOAP = module.contract('MockPOAP', []);

  // 3. Deploy MockFanToken for Team 1
  const team1Token = module.contract('MockFanToken', [
    'Team 1 Fan Token',
    'T1FT',
    18,
    ADDR_1
  ]);

  // 4. Deploy MockFanToken for Team 2
  const team2Token = module.contract('MockFanToken', [
    'Team 2 Fan Token',
    'T2FT',
    18,
    ADDR_2
  ]);

  // 5. Deploy MockFanToken for Team 3
  const team3Token = module.contract('MockFanToken', [
    'Team 3 Fan Token',
    'T3FT',
    18,
    ADDR_3
  ]);

  // 6. Deploy MockFanToken for Team 4
  const team4Token = module.contract('MockFanToken', [
    'Team 4 Fan Token',
    'T4FT',
    18,
    ADDR_4
  ]);

  // 7. Deploy BettingPoolFactory (requires swapRouter and poapContract)
  const bettingPoolFactory = module.contract('BettingPoolFactory', [
    mockSwapRouter,
    mockPOAP
  ], {
    after: [mockSwapRouter, mockPOAP]
  });

  // --- MATCHES RANDOMIZATION ---
  const NB_MATCHES = 20;
  const teamTokens = [team1Token, team2Token, team3Token, team4Token];
  
  for (let i = 0; i < NB_MATCHES; i++) {
    const ID = String(i).padStart(3, '0');
    
    // Generate random match data
    const matchData = generateRandomMatch(i);
    
    // Select random team tokens (different teams)
    const team1TokenIndex = i % teamTokens.length;
    const team2TokenIndex = (i + 1) % teamTokens.length;
    
    // === Create match POAP
    const callCreatePOAP = module.call(mockPOAP, 'createMatch', [
      BigInt(matchData.matchId),
      `${matchData.team1Name} vs ${matchData.team2Name}`
    ], {
      after: [mockPOAP],
      id: `create_poap_${ID}`
    });

    // === Create betting pool
    const callCreatePool = module.call(bettingPoolFactory, 'createPool', [
      teamTokens[team1TokenIndex],
      teamTokens[team2TokenIndex],
      BigInt(matchData.matchStartTime),
      BigInt(matchData.matchDuration),
      BigInt(matchData.matchId)
    ], {
      after: [callCreatePOAP, bettingPoolFactory],
      id: `create_pool_${ID}`
    });

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
      
      module.call(mockPOAP, 'awardPoap', [
        randomUser,
        BigInt(matchData.matchId)
      ], {
        after: [callCreatePOAP],
        id: `award_poap_${ID}`
      });
    }
  }

  // Mint some initial tokens to users for testing
  const initialMintAmount = BigInt(1000 * 10 ** 18); // 1000 tokens
  
  // Mint tokens to deployer
  module.call(team1Token, 'mint', [ADDR_0, initialMintAmount], {
    after: [team1Token],
    id: 'mint_team1_deployer'
  });
  
  module.call(team2Token, 'mint', [ADDR_0, initialMintAmount], {
    after: [team2Token],
    id: 'mint_team2_deployer'
  });
  
  module.call(team3Token, 'mint', [ADDR_0, initialMintAmount], {
    after: [team3Token],
    id: 'mint_team3_deployer'
  });
  
  module.call(team4Token, 'mint', [ADDR_0, initialMintAmount], {
    after: [team4Token],
    id: 'mint_team4_deployer'
  });

  return { 
    mockSwapRouter, 
    mockPOAP, 
    team1Token, 
    team2Token, 
    team3Token, 
    team4Token, 
    bettingPoolFactory 
  };
});

export default BettingPoolModule;
