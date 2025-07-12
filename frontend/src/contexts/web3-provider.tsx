'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { createAppKit } from '@reown/appkit/react';
import React from 'react';
import { chiliz } from 'wagmi/chains';
import { config, wagmiAdapter } from '@/lib/wagmi';

const queryClient = new QueryClient();

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  networks: [chiliz],
  metadata: {
    name: 'clash-of-fanz',
    description: 'Clash of Fanz',
    url: 'https://clash-of-fanz.vercel.app', // origin must match your domain & subdomain
    icons: ['https://clash-of-fanz.vercel.app/logo.png'],
  },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  ],
  themeVariables: {
    '--w3m-accent': 'oklch(0.558 0.288 302.321)',
  },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
