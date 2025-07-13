'use client';

import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'sonner';

interface UseTransactionStatusProps {
  hash: `0x${string}` | undefined;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  pendingMessage?: string;
}

export function useTransactionStatus({
  hash,
  onSuccess,
  onError,
  successMessage = 'Transaction confirmed!',
  errorMessage = 'Transaction error',
  pendingMessage = 'Transaction in progress...',
}: UseTransactionStatusProps) {
  const { status, error, isLoading } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!hash) return;

    if (status === 'pending' && isLoading) {
      toast.info(pendingMessage, {
        description: 'Please wait while the transaction is being confirmed...',
        position: 'bottom-right',
      });
    } else if (status === 'success') {
      toast.success(successMessage, {
        description: 'Your transaction has been confirmed on the blockchain',
        position: 'bottom-right',
      });
      onSuccess?.();
    } else if (status === 'error' || error) {
      const errorMsg = error?.message || errorMessage;
      toast.error(errorMsg, {
        description: 'The transaction failed. Please try again.',
        position: 'bottom-right',
      });
      onError?.(error || new Error(errorMsg));
    }
  }, [
    hash,
    status,
    error,
    isLoading,
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    pendingMessage,
  ]);

  return {
    status,
    error,
    isLoading,
    isPending: status === 'pending' && isLoading,
    isSuccess: status === 'success',
    isError: status === 'error' || !!error,
  };
}
