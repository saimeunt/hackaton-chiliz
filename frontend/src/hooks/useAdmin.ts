'use client';

import { useAccount, useReadContract } from 'wagmi';
import { ballotContract } from '@/contracts/ballot.contract';

export function useAdmin() {
  const { address, isConnected } = useAccount();

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    ...ballotContract,
    functionName: 'chairperson',
    query: {
      enabled: isConnected && !!address,
    },
  });

  return {
    // TODO REMOVE THIS !!!
    // isAdmin: !!isAdmin,
    isAdmin: true,
    isConnected,
    address,
    owner,
    isLoading: isLoadingOwner,
  };
}
