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
    console.log('approveTokens called with:', {
      tokenAddress,
      spenderAddress,
      amount,
    });
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

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Validate addresses
    if (!tokenAddress || !spenderAddress) {
      toast.error('Invalid token or spender address');
      return;
    }

    setIsApproving(true);

    try {
      const amountInWei = parseEther(amount);
      console.log('Approval amount in Wei:', amountInWei.toString());
      console.log('User address for approval:', address);

      writeApproveContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spenderAddress, amountInWei],
        account: address, // Explicitly set the account
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
