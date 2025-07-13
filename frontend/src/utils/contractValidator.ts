import { Address, createPublicClient, http } from 'viem';
import { anvil } from 'viem/chains';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';

// Create a public client for contract validation
const publicClient = createPublicClient({
  chain: anvil,
  transport: http(),
});

export interface ContractValidationResult {
  isValid: boolean;
  errors: string[];
  details: {
    factoryAddress: string;
    factoryCode: string;
    poolAddress?: string;
    poolCode?: string;
    tokenAddress?: string;
    tokenCode?: string;
  };
}

export async function validateContracts(
  poolAddress?: Address,
  tokenAddress?: Address,
): Promise<ContractValidationResult> {
  const errors: string[] = [];
  const details: ContractValidationResult['details'] = {
    factoryAddress: CONTRACT_ADDRESSES.BETTING_POOL_FACTORY,
    factoryCode: '',
    poolAddress: poolAddress || '',
    poolCode: '',
    tokenAddress: tokenAddress || '',
    tokenCode: '',
  };

  try {
    // Validate factory contract
    const factoryCode = await publicClient.getBytecode({
      address: CONTRACT_ADDRESSES.BETTING_POOL_FACTORY as Address,
    });
    details.factoryCode = factoryCode || '';

    if (!factoryCode || factoryCode === '0x') {
      errors.push('BettingPoolFactory contract not found at specified address');
    }

    // Validate pool contract if provided
    if (poolAddress) {
      const poolCode = await publicClient.getBytecode({
        address: poolAddress,
      });
      details.poolCode = poolCode || '';

      if (!poolCode || poolCode === '0x') {
        errors.push('BettingPool contract not found at specified address');
      }
    }

    // Validate token contract if provided
    if (tokenAddress) {
      const tokenCode = await publicClient.getBytecode({
        address: tokenAddress,
      });
      details.tokenCode = tokenCode || '';

      if (!tokenCode || tokenCode === '0x') {
        errors.push('Token contract not found at specified address');
      }
    }
  } catch (error) {
    errors.push(`Contract validation failed: ${error}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    details,
  };
}

export async function validateUserConnection(
  userAddress?: Address,
): Promise<{ isValid: boolean; error?: string }> {
  if (!userAddress) {
    return { isValid: false, error: 'No user address provided' };
  }

  if (userAddress === '0x0000000000000000000000000000000000000000') {
    return { isValid: false, error: 'User address is zero address' };
  }

  try {
    // Check if the address has any balance or is a contract
    const balance = await publicClient.getBalance({ address: userAddress });
    const code = await publicClient.getBytecode({ address: userAddress });

    if (balance === BigInt(0) && (!code || code === '0x')) {
      return {
        isValid: false,
        error: 'User address has no balance and is not a contract',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `Failed to validate user address: ${error}`,
    };
  }
}
