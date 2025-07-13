'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { toast } from 'sonner';
import { type ChilizTeam } from '@/data/chiliz-teams';
import { bettingPoolFactoryContract } from '@/contracts/betting-pool-factory.contract';
import { useTransactionStatus } from './useTransactionStatus';

export interface MatchInfo {
  id: string;
  teamA: ChilizTeam;
  teamB: ChilizTeam;
  startTime: Date;
  endTime: Date;
  league: string;
  description?: string;
  poolAddress?: string;
  status: 'pending' | 'active' | 'finished' | 'cancelled';
  winner?: 'teamA' | 'teamB' | 'draw';
  totalBetsA?: bigint;
  totalBetsB?: bigint;
  totalBetCount?: bigint;
}

export interface CreateMatchData {
  teamA: ChilizTeam;
  teamB: ChilizTeam;
  startTime: Date;
  endTime: Date;
  league: string;
  description?: string;
}

export function useAdminMatches() {
  const { address, isConnected } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Contract interactions
  const {
    data: createHash,
    writeContract: writeCreateContract,
    status: createStatus,
  } = useWriteContract();

  const {
    data: endMatchHash,
    writeContract: writeEndMatchContract,
    status: endMatchStatus,
  } = useWriteContract();

  // Read contract for owner check
  const { data: factoryOwner, isLoading: isLoadingOwner } = useReadContract({
    ...bettingPoolFactoryContract,
    functionName: 'owner',
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Transaction status tracking
  const createTxStatus = useTransactionStatus({
    hash: createHash,
    successMessage: 'Match created successfully!',
    errorMessage: 'Error creating match',
    pendingMessage: 'Creating match...',
  });

  const endMatchTxStatus = useTransactionStatus({
    hash: endMatchHash,
    successMessage: 'Match finalized successfully!',
    errorMessage: 'Error finalizing match',
    pendingMessage: 'Finalizing match...',
  });

  // Check if current user is admin (owner of factory)
  const isAdmin = factoryOwner === address;

  // Create a new match and betting pool
  const createMatch = async (matchData: CreateMatchData) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!isAdmin) {
      toast.error('You must be an administrator to create matches');
      return;
    }

    setIsCreating(true);

    try {
      const matchDuration = Math.floor(
        (matchData.endTime.getTime() - matchData.startTime.getTime()) / 1000,
      );
      const matchStartTime = Math.floor(matchData.startTime.getTime() / 1000);
      const matchName = `${matchData.teamA.name} vs ${matchData.teamB.name}`;

      writeCreateContract({
        ...bettingPoolFactoryContract,
        functionName: 'createPool',
        args: [
          matchData.teamA.fanTokenAddress as `0x${string}`,
          matchData.teamB.fanTokenAddress as `0x${string}`,
          BigInt(matchStartTime),
          BigInt(matchDuration),
          matchName,
        ],
      });

      // Add match to local state
      const newMatch: MatchInfo = {
        id: Date.now().toString(),
        teamA: matchData.teamA,
        teamB: matchData.teamB,
        startTime: matchData.startTime,
        endTime: matchData.endTime,
        league: matchData.league,
        description: matchData.description,
        status: 'pending',
      };

      setMatches((prev) => [...prev, newMatch]);
      toast.success('Match created successfully!');
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error('Error creating match');
    } finally {
      setIsCreating(false);
    }
  };

  // End a match and set the winner
  const endMatch = async (
    poolAddress: string,
    winner: 'teamA' | 'teamB',
    teamA: ChilizTeam,
    teamB: ChilizTeam,
  ) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }
    console.log(
      '>>>',
      isAdmin,
      address,
      isConnected,
      bettingPoolFactoryContract,
    );
    if (!isAdmin) {
      toast.error('You must be an administrator to finalize matches');
      return;
    }

    setIsEnding(true);

    try {
      const winningTeamToken =
        winner === 'teamA'
          ? (teamA.fanTokenAddress as `0x${string}`)
          : (teamB.fanTokenAddress as `0x${string}`);

      writeEndMatchContract({
        ...bettingPoolFactoryContract,
        functionName: 'endMatch',
        args: [poolAddress as `0x${string}`, winningTeamToken],
      });

      // Update match status in local state
      setMatches((prev) =>
        prev.map((match) =>
          match.poolAddress === poolAddress
            ? { ...match, status: 'finished', winner }
            : match,
        ),
      );

      toast.success('Match finalized successfully!');
    } catch (error) {
      console.error('Error ending match:', error);
      toast.error('Error finalizing match');
    } finally {
      setIsEnding(false);
    }
  };

  // Load matches from blockchain
  const loadMatches = async () => {
    if (!isConnected) return;

    setIsLoadingMatches(true);

    try {
      // In a real implementation, you would:
      // 1. Call getPools() to get all pool addresses
      // 2. For each pool, read the pool data to get match information
      // 3. Combine with local match data

      // For now, we'll use mock data
      const mockMatches: MatchInfo[] = [
        {
          id: '1',
          teamA: {
            id: 'psg',
            name: 'Paris Saint-Germain',
            shortName: 'PSG',
            fanTokenSymbol: 'PSG',
            fanTokenAddress: '0xc2661815C69c2B3924D3dd0c2C1358A1E38A3105',
            sport: 'football',
            league: 'Ligue 1',
            logo: '/teams/psg.png',
            primaryColor: '#001E65',
            secondaryColor: '#FF0000',
            country: 'France',
          },
          teamB: {
            id: 'barcelona',
            name: 'FC Barcelona',
            shortName: 'Barça',
            fanTokenSymbol: 'BAR',
            fanTokenAddress: '0xFD3C73b3B09D418841dd6Aff341b2d6e3abA433b',
            sport: 'football',
            league: 'La Liga',
            logo: '/teams/barcelona.png',
            primaryColor: '#004B87',
            secondaryColor: '#A50044',
            country: 'Spain',
          },
          startTime: new Date('2024-12-25T20:00:00'),
          endTime: new Date('2024-12-25T22:00:00'),
          league: 'Champions League',
          description: 'Quart de finale',
          poolAddress: '0x1234567890abcdef1234567890abcdef12345678',
          status: 'pending',
          totalBetsA: BigInt(1000000),
          totalBetsB: BigInt(800000),
          totalBetCount: BigInt(150),
        },
      ];

      setMatches(mockMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast.error('Error loading matches');
    } finally {
      setIsLoadingMatches(false);
    }
  };

  // Load matches on mount and when connection status changes
  useEffect(() => {
    if (isConnected) {
      loadMatches();
    }
  }, [isConnected]);

  return {
    // State
    matches,
    isCreating,
    isEnding,
    isLoadingMatches,
    isLoadingOwner,
    isAdmin,
    isConnected,

    // Actions
    createMatch,
    endMatch,
    loadMatches,
  };
}
