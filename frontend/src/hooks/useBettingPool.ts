'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { toast } from 'sonner';
import { type ChilizTeam } from '@/data/chiliz-teams';

// Mock contract ABI for betting pool (in a real app, this would be imported from the contract artifacts)
const BETTING_POOL_FACTORY_ABI = [
  {
    inputs: [
      { name: 'teamA', type: 'string' },
      { name: 'teamB', type: 'string' },
      { name: 'teamATokenAddress', type: 'address' },
      { name: 'teamBTokenAddress', type: 'address' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
    ],
    name: 'createBettingPool',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'poolAddress', type: 'address' },
      { name: 'winner', type: 'uint8' }, // 0 = teamA, 1 = teamB, 2 = draw
      { name: 'scoreA', type: 'uint256' },
      { name: 'scoreB', type: 'uint256' },
    ],
    name: 'finalizeBettingPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const BETTING_POOL_ABI = [
  {
    inputs: [
      { name: 'team', type: 'uint8' }, // 0 = teamA, 1 = teamB
      { name: 'amount', type: 'uint256' },
    ],
    name: 'placeBet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserBets',
    outputs: [
      {
        components: [
          { name: 'team', type: 'uint8' },
          { name: 'amount', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalBets',
    outputs: [
      { name: 'totalA', type: 'uint256' },
      { name: 'totalB', type: 'uint256' },
      { name: 'totalBets', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimWinnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// Mock contract addresses (in a real app, these would be from your deployment)
const BETTING_POOL_FACTORY_ADDRESS =
  '0x1234567890abcdef1234567890abcdef12345678' as `0x${string}`;

export interface BettingPoolInfo {
  poolAddress: string;
  totalBetsA: bigint;
  totalBetsB: bigint;
  totalBetCount: bigint;
  isFinalized: boolean;
  winner?: 0 | 1 | 2; // 0 = teamA, 1 = teamB, 2 = draw
  scoreA?: number;
  scoreB?: number;
}

export interface UserBet {
  team: 0 | 1; // 0 = teamA, 1 = teamB
  amount: bigint;
  timestamp: bigint;
}

export function useBettingPool() {
  const { address, isConnected } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const {
    data: createHash,
    writeContract: writeCreateContract,
    status: createStatus,
  } = useWriteContract();

  const {
    data: finalizeHash,
    writeContract: writeFinalizeContract,
    status: finalizeStatus,
  } = useWriteContract();

  const {
    data: betHash,
    writeContract: writeBetContract,
    status: betStatus,
  } = useWriteContract();

  const {
    data: claimHash,
    writeContract: writeClaimContract,
    status: claimStatus,
  } = useWriteContract();

  const { status: createTxStatus } = useWaitForTransactionReceipt({
    hash: createHash,
  });

  const { status: finalizeTxStatus } = useWaitForTransactionReceipt({
    hash: finalizeHash,
  });

  const { status: betTxStatus } = useWaitForTransactionReceipt({
    hash: betHash,
  });

  const { status: claimTxStatus } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  // Create a new betting pool
  const createBettingPool = async (
    teamA: ChilizTeam,
    teamB: ChilizTeam,
    startTime: Date,
    endTime: Date,
  ) => {
    if (!isConnected || !address) {
      toast.error('Veuillez connecter votre wallet');
      return;
    }

    setIsCreating(true);

    try {
      // In a real application, you would call the actual contract
      // For now, we'll simulate the transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock transaction
      writeCreateContract({
        address: BETTING_POOL_FACTORY_ADDRESS,
        abi: BETTING_POOL_FACTORY_ABI,
        functionName: 'createBettingPool',
        args: [
          teamA.name,
          teamB.name,
          teamA.fanTokenAddress as `0x${string}`,
          teamB.fanTokenAddress as `0x${string}`,
          BigInt(Math.floor(startTime.getTime() / 1000)),
          BigInt(Math.floor(endTime.getTime() / 1000)),
        ],
      });
    } catch {
      toast.error('Erreur lors de la création du pool de paris');
      setIsCreating(false);
    }
  };

  // Finalize a betting pool with match results
  const finalizeBettingPool = async (
    poolAddress: string,
    winner: 'teamA' | 'teamB' | 'draw',
    scoreA: number,
    scoreB: number,
  ) => {
    if (!isConnected || !address) {
      toast.error('Veuillez connecter votre wallet');
      return;
    }

    setIsFinalizing(true);

    try {
      const winnerCode = winner === 'teamA' ? 0 : winner === 'teamB' ? 1 : 2;

      // In a real application, you would call the actual contract
      await new Promise((resolve) => setTimeout(resolve, 2000));

      writeFinalizeContract({
        address: BETTING_POOL_FACTORY_ADDRESS,
        abi: BETTING_POOL_FACTORY_ABI,
        functionName: 'finalizeBettingPool',
        args: [
          poolAddress as `0x${string}`,
          winnerCode,
          BigInt(scoreA),
          BigInt(scoreB),
        ],
      });
    } catch {
      toast.error('Erreur lors de la finalisation du pool');
      setIsFinalizing(false);
    }
  };

  // Place a bet on a team
  const placeBet = async (
    poolAddress: string,
    team: 'teamA' | 'teamB',
    amount: bigint,
  ) => {
    if (!isConnected || !address) {
      toast.error('Veuillez connecter votre wallet');
      return;
    }

    setIsBetting(true);

    try {
      const teamCode = team === 'teamA' ? 0 : 1;

      // In a real application, you would call the actual contract
      await new Promise((resolve) => setTimeout(resolve, 2000));

      writeBetContract({
        address: poolAddress as `0x${string}`,
        abi: BETTING_POOL_ABI,
        functionName: 'placeBet',
        args: [teamCode, amount],
      });
    } catch {
      toast.error('Erreur lors de la mise');
      setIsBetting(false);
    }
  };

  // Claim winnings from a betting pool
  const claimWinnings = async (poolAddress: string) => {
    if (!isConnected || !address) {
      toast.error('Veuillez connecter votre wallet');
      return;
    }

    setIsClaiming(true);

    try {
      // In a real application, you would call the actual contract
      await new Promise((resolve) => setTimeout(resolve, 2000));

      writeClaimContract({
        address: poolAddress as `0x${string}`,
        abi: BETTING_POOL_ABI,
        functionName: 'claimWinnings',
      });
    } catch {
      toast.error('Erreur lors de la réclamation des gains');
      setIsClaiming(false);
    }
  };

  // Get betting pool information
  const getBettingPoolInfo = (poolAddress: string): BettingPoolInfo => {
    // In a real application, you would use useReadContract to get this data
    // For now, we'll return mock data
    return {
      poolAddress,
      totalBetsA: BigInt(1000000), // 1M tokens
      totalBetsB: BigInt(750000), // 750K tokens
      totalBetCount: BigInt(125),
      isFinalized: false,
    };
  };

  // Get user bets for a specific pool
  const getUserBets = (): UserBet[] => {
    // In a real application, you would use useReadContract to get this data
    // For now, we'll return mock data
    return [
      {
        team: 0,
        amount: BigInt(100000), // 100K tokens
        timestamp: BigInt(Math.floor(Date.now() / 1000) - 3600), // 1 hour ago
      },
    ];
  };

  // Effect to handle transaction status changes
  useEffect(() => {
    if (createStatus === 'success' && createTxStatus === 'success') {
      toast.success('Pool de paris créé avec succès!');
      setIsCreating(false);
    } else if (createStatus === 'error' || createTxStatus === 'error') {
      toast.error('Erreur lors de la création du pool');
      setIsCreating(false);
    }
  }, [createStatus, createTxStatus]);

  useEffect(() => {
    if (finalizeStatus === 'success' && finalizeTxStatus === 'success') {
      toast.success('Pool de paris finalisé avec succès!');
      setIsFinalizing(false);
    } else if (finalizeStatus === 'error' || finalizeTxStatus === 'error') {
      toast.error('Erreur lors de la finalisation du pool');
      setIsFinalizing(false);
    }
  }, [finalizeStatus, finalizeTxStatus]);

  useEffect(() => {
    if (betStatus === 'success' && betTxStatus === 'success') {
      toast.success('Pari placé avec succès!');
      setIsBetting(false);
    } else if (betStatus === 'error' || betTxStatus === 'error') {
      toast.error('Erreur lors du pari');
      setIsBetting(false);
    }
  }, [betStatus, betTxStatus]);

  useEffect(() => {
    if (claimStatus === 'success' && claimTxStatus === 'success') {
      toast.success('Gains réclamés avec succès!');
      setIsClaiming(false);
    } else if (claimStatus === 'error' || claimTxStatus === 'error') {
      toast.error('Erreur lors de la réclamation');
      setIsClaiming(false);
    }
  }, [claimStatus, claimTxStatus]);

  return {
    // State
    isCreating,
    isFinalizing,
    isBetting,
    isClaiming,
    isConnected,

    // Transaction hashes
    createHash,
    finalizeHash,
    betHash,
    claimHash,

    // Functions
    createBettingPool,
    finalizeBettingPool,
    placeBet,
    claimWinnings,
    getBettingPoolInfo,
    getUserBets,
  };
}
