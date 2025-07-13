'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { toast } from 'sonner';
import { Address, parseEther } from 'viem';
import { bettingPoolContract } from '@/contracts/betting-pool.contract';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { useTokenApproval } from './useTokenApproval';

export interface PlaceBetParams {
  poolAddress: Address;
  teamToken: Address;
  amount: string;
}

export function usePlaceBet() {
  const { address, isConnected } = useAccount();
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const {
    data: placeBetHash,
    writeContract: writePlaceBetContract,
    status: placeBetStatus,
    error: placeBetError,
  } = useWriteContract();

  const { status: placeBetTxStatus } = useWaitForTransactionReceipt({
    hash: placeBetHash,
  });

  // Token approval hook
  const { approveTokens, isApproving, checkAllowance, currentAllowance } =
    useTokenApproval();

  // Read contract to get match status
  const { data: matchStatus } = useReadContract({
    address: CONTRACT_ADDRESSES.BETTING_POOL_FACTORY as Address,
    abi: bettingPoolContract.abi,
    functionName: 'getMatchStatus',
    query: { enabled: isConnected },
  });

  // Place bet function
  const placeBet = async ({
    poolAddress,
    teamToken,
    amount,
  }: PlaceBetParams) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsPlacingBet(true);

    try {
      // Set addresses for allowance checking
      checkAllowance(teamToken, poolAddress);
      const amountInWei = parseEther(amount);

      // If allowance is insufficient, approve first
      if (!currentAllowance || currentAllowance < amountInWei) {
        await approveTokens({
          tokenAddress: teamToken,
          spenderAddress: poolAddress,
          amount,
        });

        // Wait for approval to complete before placing bet
        // In a real app, you might want to poll for the allowance change
        setTimeout(() => {
          writePlaceBetContract({
            address: poolAddress,
            abi: bettingPoolContract.abi,
            functionName: 'placeBet',
            args: [teamToken, amountInWei],
          });
        }, 2000);
      } else {
        // Directly place bet if allowance is sufficient
        writePlaceBetContract({
          address: poolAddress,
          abi: bettingPoolContract.abi,
          functionName: 'placeBet',
          args: [teamToken, amountInWei],
        });
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error('Failed to place bet. Please try again.');
      setIsPlacingBet(false);
    }
  };

  // Handle transaction status changes
  useEffect(() => {
    if (placeBetTxStatus === 'success') {
      toast.success('Bet placed successfully! 🎉');
      setIsPlacingBet(false);
    } else if (placeBetTxStatus === 'error') {
      toast.error('Transaction failed. Please try again.');
      setIsPlacingBet(false);
    }
  }, [placeBetTxStatus]);

  // Handle write contract errors
  useEffect(() => {
    if (placeBetError) {
      console.error('Place bet error:', placeBetError);
      toast.error(
        'Failed to place bet. Please check your balance and try again.',
      );
      setIsPlacingBet(false);
    }
  }, [placeBetError]);

  return {
    placeBet,
    isPlacingBet,
    isApproving,
    placeBetStatus,
    placeBetTxStatus,
    placeBetError,
    matchStatus,
  };
}
