import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'solidity-docgen';

const {
  ETHERSCAN_API_KEY = '',
  PRIVATE_KEY = '',
} = process.env;

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
    chiliz: {
      url: 'https://rpc.ankr.com/chiliz',
      chainId: 88888,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    spicyTestnet: {
      url: 'https://spicy-rpc.chiliz.com',
      chainId: 88882,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    }
  },
  solidity: '0.8.25',
};

export default config;
