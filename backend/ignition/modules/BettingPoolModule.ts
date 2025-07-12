import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

// Addresses for deployment
const ADDR_0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Deployer
const ADDR_1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Team 1 Owner
const ADDR_2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'; // Team 2 Owner
const ADDR_3 = '0x90F79bf6EB2c4f870365E785982E1f101E93b906'; // Team 3 Owner
const ADDR_4 = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'; // Team 4 Owner

const PSG_WHALE = '0x6F4557853Cab0F6fFB69d5e66696275c3e41a33D';
const WPSG_WHALE = '0xC3aC90d4ef94f44FC1C59caF7E8aEc9feC7f4eB2';
const ACM_WHALE = '0x6F4557853Cab0F6fFB69d5e66696275c3e41a33D';
const WACM_WHALE = '0x2e1751e3dB8eD811423396bBD2f56041b4Be669a';

const BettingPoolModule = buildModule('BettingPoolModule', (module) => {
  // 1. Deploy MockSwapRouter (no constructor parameters)
  const routerAddress = module.getParameter('routerAddress');
  const mockSwapRouter = module.contractAt('MockSwapRouter', routerAddress);

  // 2. Deploy MockPOAP (no constructor parameters)
  const mockPOAP = module.contract('MockPOAP', []);

  const psgAddress = module.getParameter('psgAddress');
  const psgToken = module.contractAt('MockFanToken', psgAddress, {
    id: 'PSG',
  });

  const wPSGAddress = module.getParameter('wPSGAddress');
  // 3. Deploy MockFanToken for Team 1
  const wPSGToken = module.contractAt('MockFanToken', wPSGAddress, {
    id: 'WPSG',
  });

  const acmAddress = module.getParameter('acmAddress');
  const acmToken = module.contractAt('MockFanToken', acmAddress, {
    id: 'ACM',
  });

  const wACMAddress = module.getParameter('wACMAddress');
  // 4. Deploy MockFanToken for Team 2
  const wACMToken = module.contractAt('MockFanToken', wACMAddress, {
    id: 'WACM',
  });

  // 5. Deploy MockFanToken for Team 3
  // const team3Token = module.contract(
  //   'MockFanToken',
  //   ['Team 3 Fan Token', 'T3FT', 18, ADDR_3],
  //   { id: 'MockFanToken3' },
  // );

  // 6. Deploy MockFanToken for Team 4
  // const team4Token = module.contract(
  //   'MockFanToken',
  //   ['Team 4 Fan Token', 'T4FT', 18, ADDR_4],
  //   { id: 'MockFanToken4' },
  // );

  // 7. Deploy BettingPoolFactory (requires swapRouter and poapContract)
  const bettingPoolFactory = module.contract(
    'BettingPoolFactory',
    [mockSwapRouter, mockPOAP],
    {
      after: [mockSwapRouter, mockPOAP],
    },
  );

  const callTransferOwnership = module.call(
    mockPOAP,
    'transferOwnership',
    [bettingPoolFactory],
    {
      after: [bettingPoolFactory],
    },
  );

  // Mint some initial tokens to users for testing
  const initialMintAmount = BigInt(1000 * 10 ** 18); // 1000 tokens

  module.call(psgToken, 'transfer', [ADDR_0, 1000], {
    from: PSG_WHALE,
    after: [psgToken],
    id: 'transfer_psg_deployer',
  });

  module.call(wPSGToken, 'transfer', [ADDR_0, initialMintAmount], {
    from: WPSG_WHALE,
    after: [wPSGToken],
    id: 'transfer_wpsg_deployer',
  });

  module.call(acmToken, 'transfer', [ADDR_0, 1000], {
    from: ACM_WHALE,
    after: [acmToken],
    id: 'transfer_acm_deployer',
  });

  module.call(wACMToken, 'transfer', [ADDR_0, initialMintAmount], {
    from: WACM_WHALE,
    after: [wACMToken],
    id: 'transfer_wacm_deployer',
  });

  // Mint tokens to deployer
  // module.call(team1Token, 'mint', [ADDR_0, initialMintAmount], {
  //   after: [team1Token],
  //   id: 'mint_team1_deployer',
  // });

  // module.call(team2Token, 'mint', [ADDR_0, initialMintAmount], {
  //   after: [team2Token],
  //   id: 'mint_team2_deployer',
  // });

  // module.call(team3Token, 'mint', [ADDR_0, initialMintAmount], {
  //   after: [team3Token],
  //   id: 'mint_team3_deployer',
  // });

  // module.call(team4Token, 'mint', [ADDR_0, initialMintAmount], {
  //   after: [team4Token],
  //   id: 'mint_team4_deployer',
  // });

  return {
    mockSwapRouter,
    mockPOAP,
    wPSGToken,
    wACMToken,
    //team3Token,
    //team4Token,
    bettingPoolFactory,
  };
});

export default BettingPoolModule;
