# Deployment Guide

This guide explains how to deploy the betting pool contracts using Hardhat Ignition.

## Script Structure

### 1. Ignition Module (`ignition/modules/BettingPoolModule.ts`)
- Deploys all contracts in the correct order
- Creates 20 randomized matches with football teams
- Configures POAPs for each match
- Mints initial tokens for testing

### 2. Post-Deployment Script (`scripts/post-deployment.ts`)
- Randomly starts and ends some matches
- Assigns POAPs to random users
- Handles operations that require dynamically created pool addresses

### 3. Address Extraction Script (`scripts/extract-addresses.ts`)
- Extracts contract addresses from Ignition deployment artifacts
- Saves addresses to a JSON file for later use

### 4. Complete Deployment Script (`scripts/deploy-complete.ts`)
- Orchestrates the entire deployment process
- Executes all three steps in order

## Deployed Contracts

1. **MockSwapRouter** - Simulated swap router for token exchanges
2. **MockPOAP** - Simulated POAP contract for attendance verification
3. **MockFanToken** (x4) - Fan tokens for 4 different teams
4. **BettingPoolFactory** - Main factory for creating and managing betting pools

## Deployment Order

1. MockSwapRouter (no parameters)
2. MockPOAP (no parameters)
3. MockFanToken for each team (name, symbol, decimals, owner)
4. BettingPoolFactory (swapRouter, poapContract)

## Created Matches

The script creates 20 matches with:
- **Teams**: PSG, Real Madrid, Barcelona, Manchester United, Liverpool, etc.
- **Schedules**: 1 hour to 7 days in the future
- **Durations**: 1.5 to 2 hours
- **POAPs**: Created for each match with descriptive names

## Usage

### Complete Deployment (Recommended)
```bash
npx hardhat run scripts/deploy-complete.ts --network <network>
```

### Step-by-Step Deployment

1. **Deploy contracts**:
```bash
npx hardhat ignition deploy ignition/modules/BettingPoolModule.ts --network <network>
```

2. **Extract addresses**:
```bash
npx hardhat run scripts/extract-addresses.ts --network <network>
```

3. **Execute post-deployment operations**:
```bash
npx hardhat run scripts/post-deployment.ts --network <network>
```

## Configuration

### Environment Variables (Optional)
If addresses cannot be extracted automatically, you can define them manually:

```bash
export BETTING_POOL_FACTORY_ADDRESS="0x..."
export MOCK_POAP_ADDRESS="0x..."
```

### Supported Networks
- `localhost` - For local testing
- `hardhat` - For Hardhat testing
- `sepolia` - For Sepolia testnet
- `mainnet` - For mainnet (be careful!)

## Results

After deployment, you will have:
- ✅ All contracts deployed
- ✅ 20 matches created with random teams
- ✅ POAPs configured for each match
- ✅ Some matches randomly started/ended
- ✅ POAPs assigned to random users
- ✅ 1000 tokens minted for each team to the deployer

## Generated Files

- `deployment-addresses.json` - Addresses of all deployed contracts
- `ignition/deployments/` - Ignition deployment artifacts

## Troubleshooting

### Error "No deployment artifacts found"
Make sure the Ignition deployment completed successfully before running address extraction.

### Error "Failed to load deployment addresses"
Verify that the `deployment-addresses.json` file was created correctly.

### Network error
Ensure your Hardhat configuration includes the target network and you have sufficient funds.

## Customization

To modify deployment behavior:

1. **Number of matches**: Modify `NB_MATCHES` in `BettingPoolModule.ts`
2. **Teams**: Modify the `teamNames` array in `generateRandomMatch()`
3. **Probabilities**: Adjust percentages in the scripts
4. **Initial tokens**: Modify `initialMintAmount` in the Ignition module 