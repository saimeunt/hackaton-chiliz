import { createStorage } from 'wagmi';
import { http } from 'viem';
import { anvil, chiliz } from 'viem/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({}),
  ssr: true,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  networks: [chiliz],
  transports: {
    [chiliz.id]: http(
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_RPC_URL
        : anvil.rpcUrls.default.http[0],
    ),
  },
});

export const config = wagmiAdapter.wagmiConfig;
