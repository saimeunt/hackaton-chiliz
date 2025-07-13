'use client';

import { useReadContract } from 'wagmi';
import { Address } from 'viem';
import { bettingPoolFactoryContract } from '@/contracts/betting-pool-factory.contract';
import { bettingPoolContract } from '@/contracts/betting-pool.contract';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';

export interface PoolInfo {
  totalAmount: bigint;
  bettorCount: bigint;
}

export interface TeamPoolInfo {
  token: Address;
  wrappedToken: Address;
  totalAmount: bigint;
  totalPoints: bigint;
}

export interface PoolManagerInfo {
  team1Token: Address;
  team2Token: Address;
  matchStartTime: bigint;
  matchEndTime: bigint;
  status: number; // BettingPool.MatchStatus enum
  winningTeamToken: Address;
}

export function useBettingPoolInfo(poolAddress?: Address) {
  // Get pool info from PoolManager (via BettingPoolFactory)
  const { data: poolInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.BETTING_POOL_FACTORY as Address,
    abi: bettingPoolFactoryContract.abi,
    functionName: 'getPoolInfo',
    args: poolAddress ? [poolAddress] : undefined,
    query: { enabled: !!poolAddress },
  });

  // Get team1 pool info from BettingPool contract
  const { data: team1PoolInfo } = useReadContract({
    address: poolAddress,
    abi: bettingPoolContract.abi,
    functionName: 'getPoolInfo',
    args: poolInfo ? [poolInfo[0]] : undefined, // team1Token
    query: { enabled: !!poolAddress && !!poolInfo },
  });

  // Get team2 pool info from BettingPool contract
  const { data: team2PoolInfo } = useReadContract({
    address: poolAddress,
    abi: bettingPoolContract.abi,
    functionName: 'getPoolInfo',
    args: poolInfo ? [poolInfo[1]] : undefined, // team2Token
    query: { enabled: !!poolAddress && !!poolInfo },
  });

  // Parse pool info from PoolManager
  const parsedPoolInfo: PoolManagerInfo | undefined = poolInfo ? {
    team1Token: poolInfo[0],
    team2Token: poolInfo[1],
    matchStartTime: poolInfo[2],
    matchEndTime: poolInfo[3],
    status: poolInfo[4],
    winningTeamToken: poolInfo[5],
  } : undefined;

  // Parse team pool info
  const team1Pool: PoolInfo | undefined = team1PoolInfo ? {
    totalAmount: team1PoolInfo[0],
    bettorCount: team1PoolInfo[1],
  } : undefined;

  const team2Pool: PoolInfo | undefined = team2PoolInfo ? {
    totalAmount: team2PoolInfo[0],
    bettorCount: team2PoolInfo[1],
  } : undefined;

  return {
    // Pool manager info
    team1Token: parsedPoolInfo?.team1Token,
    team2Token: parsedPoolInfo?.team2Token,
    matchStartTime: parsedPoolInfo?.matchStartTime,
    matchEndTime: parsedPoolInfo?.matchEndTime,
    matchStatus: parsedPoolInfo?.status,
    winningTeamToken: parsedPoolInfo?.winningTeamToken,
    
    // Team pool info
    team1Pool,
    team2Pool,
  };
}
