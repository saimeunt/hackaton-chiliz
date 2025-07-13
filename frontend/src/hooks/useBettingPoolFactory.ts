'use client';

import { useReadContract } from 'wagmi';
import { Address } from 'viem';
import { bettingPoolFactoryContract } from '@/contracts/betting-pool-factory.contract';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';

export interface PoolCreatedEvent {
  poolAddress: Address;
  team1Token: Address;
  team2Token: Address;
  matchStartTime: bigint;
  matchDuration: bigint;
}

export function useBettingPoolFactory() {
  // Get all pools from factory
  const {
    data: allPools,
    isLoading,
    error,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.BETTING_POOL_FACTORY as Address,
    abi: bettingPoolFactoryContract.abi,
    functionName: 'getPools',
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  return {
    pools: allPools || [],
    isLoading,
    error,
  };
}
