'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { Address } from 'viem';
import { BetMatch } from '@/app/api/live-bets/route';
import { bettingPoolFactoryContract } from '@/contracts/betting-pool-factory.contract';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { chilizTeams, ChilizTeam } from '@/data/chiliz-teams';

interface UseLiveBetsReturn {
  matches: BetMatch[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseMatchByIdReturn {
  match: BetMatch | null;
  loading: boolean;
  error: string | null;
}

// Mock data for when ID is a number
const mockMatches: BetMatch[] = [
  {
    id: '2',
    homeTeam: {
      name: 'Real Madrid',
      flag: '🇪🇸',
      color: 'bg-purple-500',
    },
    awayTeam: {
      name: 'Liverpool',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      color: 'bg-orange-500',
    },
    competition: 'Champions League',
    time: '22:00',
    status: 'upcoming',
    bettingStats: {
      totalBettors: 89,
      homePercentage: 35,
      awayPercentage: 65,
    },
  },
  {
    id: '3',
    homeTeam: {
      name: 'Bayern Munich',
      flag: '🇩🇪',
      color: 'bg-emerald-500',
    },
    awayTeam: {
      name: 'Manchester City',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      color: 'bg-pink-500',
    },
    competition: 'Champions League',
    time: '21:00',
    status: 'live',
    bettingStats: {
      totalBettors: 203,
      homePercentage: 61,
      awayPercentage: 39,
    },
  },
  {
    id: '4',
    homeTeam: {
      name: 'Arsenal',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      color: 'bg-yellow-500',
    },
    awayTeam: {
      name: 'AC Milan',
      flag: '🇮🇹',
      color: 'bg-emerald-500',
    },
    competition: 'Champions League',
    time: '20:45',
    status: 'upcoming',
    bettingStats: {
      totalBettors: 142,
      homePercentage: 54,
      awayPercentage: 46,
    },
  },
  {
    id: '5',
    homeTeam: {
      name: 'Vitality',
      flag: '🇫🇷',
      color: 'bg-amber-500',
    },
    awayTeam: {
      name: 'MIBR',
      flag: '🇧🇷',
      color: 'bg-green-500',
    },
    competition: 'CS:GO Major',
    time: '19:00',
    status: 'live',
    bettingStats: {
      totalBettors: 312,
      homePercentage: 63,
      awayPercentage: 37,
    },
  },
  {
    id: '6',
    homeTeam: {
      name: 'OG',
      flag: '🇪🇺',
      color: 'bg-red-600',
    },
    awayTeam: {
      name: 'Team Heretics',
      flag: '🇪🇸',
      color: 'bg-slate-700',
    },
    competition: 'Valorant Champions Tour',
    time: '20:30',
    status: 'upcoming',
    bettingStats: {
      totalBettors: 189,
      homePercentage: 46,
      awayPercentage: 54,
    },
  },
];

function isNumeric(str: string) {
  return /^-?\d+$/.test(str);
}

// Helper function to find team by token address
function findTeamByTokenAddress(tokenAddress: string): ChilizTeam | null {
  return (
    chilizTeams.find(
      (team) =>
        team.fanTokenAddress.toLowerCase() === tokenAddress.toLowerCase(),
    ) || null
  );
}

// Helper function to get team data with fallback
function getTeamData(tokenAddress: string) {
  const team = findTeamByTokenAddress(tokenAddress);

  if (team) {
    return {
      name: team.name,
      flag: team.flag || '🏆',
      color: team.color || 'bg-gray-500',
    };
  }

  // Fallback for unknown teams
  return {
    name: `Team (${tokenAddress.slice(0, 6)}...)`,
    flag: '🏆',
    color: 'bg-gray-500',
  };
}

// Helper function to convert pool data to BetMatch format
function convertPoolToBetMatch(
  poolAddress: Address,
  poolInfo: {
    team1Token: `0x${string}`;
    team2Token: `0x${string}`;
    matchStartTime: bigint;
    matchEndTime: bigint;
    // matchStatus: number;
    // winningTeamToken: `0x${string}` | undefined;
    // team1Pool: PoolInfo;
    // team2Pool: PoolInfo;
  },
): BetMatch {
  const now = Date.now();
  const startTime = Number(poolInfo.matchStartTime) * 1000;
  const endTime = Number(poolInfo.matchEndTime) * 1000;

  let status: 'live' | 'upcoming' | 'finished';
  if (now < startTime) {
    status = 'upcoming';
  } else if (now > endTime) {
    status = 'finished';
  } else {
    status = 'live';
  }

  // Format time
  const matchDate = new Date(startTime);
  const time = matchDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Get team data from Chiliz teams
  const team1Data = getTeamData(poolInfo.team1Token);
  const team2Data = getTeamData(poolInfo.team2Token);

  // Calculate betting stats (mock for now, could be enhanced with real data)
  const totalBettors = Math.floor(Math.random() * 200) + 50;
  const homePercentage = Math.floor(Math.random() * 40) + 30;
  const awayPercentage = 100 - homePercentage;

  return {
    id: poolAddress,
    homeTeam: team1Data,
    awayTeam: team2Data,
    competition: 'Blockchain Match',
    time,
    status,
    bettingStats: {
      totalBettors,
      homePercentage,
      awayPercentage,
    },
  };
}

// Hook to get pool info for a specific pool
function usePoolInfo(poolAddress?: Address) {
  const {
    data: poolInfo,
    isLoading,
    error,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.BETTING_POOL_FACTORY as Address,
    abi: bettingPoolFactoryContract.abi,
    functionName: 'getPoolInfo',
    args: poolAddress ? [poolAddress] : undefined,
    query: { enabled: !!poolAddress },
  });

  return { poolInfo, isLoading, error };
}

export function useLiveBets(): UseLiveBetsReturn {
  const [matches, setMatches] = useState<BetMatch[]>(mockMatches);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all pools from factory
  // const {
  //   data: pools,
  //   isLoading: poolsLoading,
  //   error: poolsError,
  // } = useReadContract({
  //   address: CONTRACT_ADDRESSES.BETTING_POOL_FACTORY as Address,
  //   abi: bettingPoolFactoryContract.abi,
  //   functionName: 'getPools',
  //   query: {
  //     refetchInterval: 10000, // Refetch every 10 seconds
  //   },
  // });

  // Get info for the first pool (as an example)
  // const { poolInfo: firstPoolInfo, isLoading: firstPoolLoading } = usePoolInfo(
  //   pools && pools.length > 0 ? pools[0] : undefined,
  // );

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      // if (poolsError) {
      //   throw new Error('Failed to fetch pools from contract');
      // }

      // if (poolsLoading) {
      //   return;
      // }

      // Convert pool data to BetMatch format
      // const contractMatches: BetMatch[] = [];

      // For now, we'll use the first pool as an example
      // In a production environment, you'd want to fetch info for all pools
      // if (pools && pools.length > 0 && firstPoolInfo) {
      //   const match = convertPoolToBetMatch(pools[0], {
      //     team1Token: firstPoolInfo[0],
      //     team2Token: firstPoolInfo[1],
      //     matchStartTime: firstPoolInfo[2],
      //     matchEndTime: firstPoolInfo[3],
      //   });
      //   contractMatches.push(match);
      // }

      // Combine contract matches with mock matches
      //const allMatches = [...contractMatches, ...mockMatches];
      setMatches(mockMatches);
    } catch (err) {
      console.error('Error fetching live bets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchMatches();
  //   // eslint-disable-next-line
  // }, [pools, poolsLoading, poolsError, firstPoolInfo, firstPoolLoading]);

  return {
    matches,
    loading: loading, // || poolsLoading || firstPoolLoading,
    error: error, // || (poolsError ? 'Failed to fetch pools' : null),
    refetch: fetchMatches,
  };
}

export function useMatchById(id: string): UseMatchByIdReturn {
  const [match, setMatch] = useState<BetMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get pool info if ID is an address
  const { poolInfo, isLoading: poolInfoLoading } = usePoolInfo(
    isNumeric(id) ? undefined : (id as Address),
  );

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        setError(null);

        // If ID is numeric, use mock data
        if (isNumeric(id)) {
          const mockMatch = mockMatches.find((m) => m.id === id);
          if (mockMatch) {
            setMatch(mockMatch);
          } else {
            throw new Error('Mock match not found');
          }
        } else {
          // If ID is an address, use contract data
          if (poolInfoLoading) {
            return;
          }

          if (!poolInfo) {
            throw new Error('Pool info not found');
          }

          const poolAddress = id as Address;
          const match = convertPoolToBetMatch(poolAddress, {
            team1Token: poolInfo[0],
            team2Token: poolInfo[1],
            matchStartTime: poolInfo[2],
            matchEndTime: poolInfo[3],
          });

          setMatch(match);
        }
      } catch (err) {
        console.error('Error fetching match:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch match');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id, poolInfo, poolInfoLoading]);

  return {
    match,
    loading: loading || poolInfoLoading,
    error,
  };
}
