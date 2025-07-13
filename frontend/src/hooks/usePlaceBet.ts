'use client';

import { useState, useEffect, useCallback } from 'react';
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
import {
  validateContracts,
  validateUserConnection,
} from '@/utils/contractValidator';

export interface PlaceBetParams {
  poolAddress: Address;
  teamToken: Address;
  amount: string;
}

export function usePlaceBet() {
  const { address, isConnected } = useAccount();
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [pendingBetParams, setPendingBetParams] =
    useState<PlaceBetParams | null>(null);

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
  const {
    approveTokens,
    isApproving,
    checkAllowance,
    currentAllowance,
    approveTxStatus,
    approveError,
  } = useTokenApproval();

  // Read contract to get match status
  const { data: matchStatus } = useReadContract({
    address: CONTRACT_ADDRESSES.BETTING_POOL_FACTORY as Address,
    abi: bettingPoolContract.abi,
    functionName: 'getMatchStatus',
    query: { enabled: isConnected },
  });

  // Memoized function to place bet with consistent amount conversion
  const executePlaceBet = useCallback(
    (params: PlaceBetParams) => {
      if (!address) {
        toast.error('Invalid user address. Please reconnect your wallet.');
        return;
      }

      console.log('Placing bet with amount:', params.amount);
      console.log('User address for bet:', address);

      writePlaceBetContract({
        address: params.poolAddress,
        abi: bettingPoolContract.abi,
        functionName: 'placeBet',
        args: [params.teamToken, BigInt(params.amount)],
        account: address,
      });
    },
    [address, writePlaceBetContract],
  );

  // Place bet function
  const placeBet = async ({
    poolAddress,
    teamToken,
    amount,
  }: PlaceBetParams) => {
    console.log('placeBet called with:', { poolAddress, teamToken, amount });
    console.log('User address:', address);
    console.log('Is connected:', isConnected);

    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    // Validate user address
    if (address === '0x0000000000000000000000000000000000000000') {
      toast.error('Invalid user address. Please reconnect your wallet.');
      return;
    }

    // Validate user connection
    const userValidation = await validateUserConnection(address);
    if (!userValidation.isValid) {
      toast.error(`User validation failed: ${userValidation.error}`);
      return;
    }

    // Validate contracts
    const contractValidation = await validateContracts(poolAddress, teamToken);
    if (!contractValidation.isValid) {
      console.error('Contract validation errors:', contractValidation.errors);
      toast.error(
        'Contract validation failed. Please check your network connection.',
      );
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Check if match is still open for betting
    if (matchStatus !== undefined && matchStatus !== 0) {
      console.log('Match status:', matchStatus);
      toast.error('Betting is closed for this match');
      return;
    }

    setIsPlacingBet(true);

    try {
      // Set addresses for allowance checking
      checkAllowance(teamToken, poolAddress);
      console.log('Amount:', amount);
      console.log('Current allowance:', currentAllowance?.toString());
      console.log('User address for transaction:', address);

      const amountInWei = parseEther(amount);

      // If allowance is insufficient, approve first
      if (!currentAllowance || currentAllowance < amountInWei) {
        console.log('Insufficient allowance, approving tokens...');
        setPendingApproval(true);
        setPendingBetParams({ poolAddress, teamToken, amount });
        await approveTokens({
          tokenAddress: teamToken,
          spenderAddress: poolAddress,
          amount,
        });
        // Don't place bet immediately - wait for approval confirmation
        return;
      } else {
        console.log('Sufficient allowance, placing bet directly...');
        // Directly place bet if allowance is sufficient
        executePlaceBet({ poolAddress, teamToken, amount });
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error('Failed to place bet. Please try again.');
      setIsPlacingBet(false);
      setPendingApproval(false);
      setPendingBetParams(null);
    }
  };

  // Handle approval completion and trigger bet placement
  useEffect(() => {
    if (pendingApproval && approveTxStatus === 'success' && pendingBetParams) {
      console.log('Approval successful, waiting for allowance update...');

      // Wait a bit for the allowance to be updated on the blockchain
      const timer = setTimeout(() => {
        if (pendingBetParams) {
          console.log('Executing delayed bet placement...');
          executePlaceBet(pendingBetParams);
          setPendingApproval(false);
          setPendingBetParams(null);
        }
      }, 2000); // Wait 2 seconds for blockchain state to update

      return () => clearTimeout(timer);
    }
  }, [pendingApproval, approveTxStatus, pendingBetParams, executePlaceBet]);

  // Handle transaction status changes
  useEffect(() => {
    if (placeBetTxStatus === 'success') {
      toast.success('Bet placed successfully! 🎉');
      setIsPlacingBet(false);
      setPendingApproval(false);
      setPendingBetParams(null);
    } else if (placeBetTxStatus === 'error') {
      toast.error('Transaction failed. Please try again.');
      setIsPlacingBet(false);
      setPendingApproval(false);
      setPendingBetParams(null);
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
      setPendingApproval(false);
      setPendingBetParams(null);
    }
  }, [placeBetError]);

  // Handle approval errors
  useEffect(() => {
    if (approveError) {
      console.error('Approval error:', approveError);
      toast.error('Token approval failed. Please try again.');
      setIsPlacingBet(false);
      setPendingApproval(false);
      setPendingBetParams(null);
    }
  }, [approveError]);

  return {
    placeBet,
    isPlacingBet: isPlacingBet || isApproving,
    isApproving,
    placeBetStatus,
    placeBetTxStatus,
    placeBetError,
    matchStatus,
  };
}
