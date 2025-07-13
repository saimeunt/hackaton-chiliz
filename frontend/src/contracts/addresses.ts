// Configuration of deployed contract addresses
// These addresses must be updated after each deployment

export const CONTRACT_ADDRESSES = {
  // Address of the deployed BettingPoolFactory contract
  BETTING_POOL_FACTORY:
    '0x9767B4764925eE756F25981a2b791f53A0269751' as `0x${string}`,

  // Address of the deployed POAP contract
  POAP: '0x8c54225CA76Cbfcb56cA547098264D339b9444B4' as `0x${string}`,

  // Address of the Uniswap V2 router (for swaps)
  UNISWAP_V2_ROUTER:
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' as `0x${string}`,
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  // Test network (Anvil)
  anvil: {
    chainId: 31337,
    name: 'Anvil',
    rpcUrl: 'http://localhost:8545',
    contracts: CONTRACT_ADDRESSES,
  },

  // Chiliz network
  chiliz: {
    chainId: 88888,
    name: 'Chiliz',
    rpcUrl: 'https://rpc.chiliz.com',
    contracts: CONTRACT_ADDRESSES,
  },

  // Chiliz testnet
  chilizTestnet: {
    chainId: 88882,
    name: 'Chiliz Testnet',
    rpcUrl: 'https://rpc-testnet.chiliz.com',
    contracts: CONTRACT_ADDRESSES,
  },
} as const;

// Utility function to get a contract address
export function getContractAddress(
  contractName: keyof typeof CONTRACT_ADDRESSES,
): `0x${string}` {
  return CONTRACT_ADDRESSES[contractName];
}

// Utility function to check if an address is valid
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
