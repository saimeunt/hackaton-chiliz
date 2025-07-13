'use client';

import { useAccount, useReadContract } from 'wagmi';
import { bettingPoolFactoryContract } from '@/contracts/betting-pool-factory.contract';

export function useAdmin() {
  const { address, isConnected } = useAccount();

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    ...bettingPoolFactoryContract,
    functionName: 'owner',
    query: {
      enabled: isConnected && !!address,
    },
  });

  return {
    isAdmin: address === owner,
    isConnected,
    address,
    owner,
    isLoading: isLoadingOwner,
  };
}
