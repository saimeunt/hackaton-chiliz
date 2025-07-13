'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { toast } from 'sonner';
import { Address, parseEther, erc20Abi } from 'viem';

export interface ApprovalParams {
  tokenAddress: Address;
  spenderAddress: Address;
  amount: string;
}

export function useTokenApproval() {
  const { address, isConnected } = useAccount();
  const [isApproving, setIsApproving] = useState(false);
  const [currentTokenAddress, setCurrentTokenAddress] =
    useState<Address | null>(null);
  const [currentSpenderAddress, setCurrentSpenderAddress] =
    useState<Address | null>(null);

  const {
    data: approveHash,
    writeContract: writeApproveContract,
    status: approveStatus,
    error: approveError,
  } = useWriteContract();

  const { status: approveTxStatus } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Check current allowance using a hook
  const { data: currentAllowance } = useReadContract({
    address: currentTokenAddress!,
    abi: erc20Abi,
    functionName: 'allowance',
    args:
      currentTokenAddress && currentSpenderAddress
        ? [address!, currentSpenderAddress]
        : undefined,
    query: {
      enabled:
        isConnected &&
        !!address &&
        !!currentTokenAddress &&
        !!currentSpenderAddress,
    },
  });

  // Function to set the addresses for allowance checking
  const checkAllowance = (tokenAddress: Address, spenderAddress: Address) => {
    setCurrentTokenAddress(tokenAddress);
    setCurrentSpenderAddress(spenderAddress);
    return { data: currentAllowance };
  };

  // Approve tokens
  const approveTokens = async ({
    tokenAddress,
    spenderAddress,
    amount,
  }: ApprovalParams) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsApproving(true);

    try {
      const amountInWei = parseEther(amount);

      writeApproveContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spenderAddress, amountInWei],
      });
    } catch (error) {
      console.error('Error approving tokens:', error);
      toast.error('Failed to approve tokens. Please try again.');
      setIsApproving(false);
    }
  };

  // Handle transaction status changes
  useEffect(() => {
    if (approveTxStatus === 'success') {
      toast.success('Token approval successful! ✅');
      setIsApproving(false);
    } else if (approveTxStatus === 'error') {
      toast.error('Approval transaction failed. Please try again.');
      setIsApproving(false);
    }
  }, [approveTxStatus]);

  // Handle write contract errors
  useEffect(() => {
    if (approveError) {
      console.error('Approval error:', approveError);
      toast.error(
        'Failed to approve tokens. Please check your balance and try again.',
      );
      setIsApproving(false);
    }
  }, [approveError]);

  return {
    approveTokens,
    isApproving,
    approveStatus,
    approveTxStatus,
    approveError,
    checkAllowance,
    currentAllowance,
  };
}
