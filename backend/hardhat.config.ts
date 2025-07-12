import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'solidity-docgen';

const { ETHERSCAN_API_KEY = '', PRIVATE_KEY = '' } = process.env;

const config: HardhatUserConfig = {
  docgen: { outputDir: 'doc' },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
  },
  networks: {
    hardhat: {
      accounts: {
        passphrase: PRIVATE_KEY,
      },
      chainId: 31337,
    },
    // anvil --fork-url https://rpc.ankr.com/chiliz --auto-impersonate
    anvil: {
      url: 'http://localhost:8545',
      chainId: 88888,
      accounts: 'remote',
    },
    chiliz: {
      url: 'https://rpc.ankr.com/chiliz',
      chainId: 88888,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    spicyTestnet: {
      url: 'https://spicy-rpc.chiliz.com',
      chainId: 88882,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  solidity: {
    version: '0.8.25',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
};

export default config;
