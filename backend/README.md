# Sports Betting System with Fan Tokens

This project implements a decentralized sports betting system where fans can bet their fan tokens on their favorite teams. The system includes advanced features such as POAPs for match attendance, winnings multipliers, and an automatic swap system.

## Main Features

### 🏆 Betting with Fan Tokens
- Fans bet their fan tokens on their favorite teams
- Minimum bet of 10 fan tokens to prevent dust bets
- Withdrawal block 1 hour before match start

### 🎫 POAP System and Multipliers
- Match attendance verification via POAPs
- Winnings multiplier based on attendance history:
  - Start: 0.8x (new users)
  - After 5 matches: 1.0x
  - Maximum: 1.5x (after 100 matches)
  - Logarithmic curve between 5 and 100 matches

### 💰 Winner Takes All
- Winners receive all tokens from the pool
- Automatic swap of losing team tokens to winning team tokens
- Distribution of winnings proportional to invested tokens (with multiplier)

### ⏰ Claim Management
- Immediate claim after match end
- Admin claim after 1 year for unclaimed tokens
- Global claim after 2 years for all remaining tokens

## Contract Architecture

### Main Contracts

#### `BettingPool.sol`
Main contract that manages a betting pool for a specific match.

**Features:**
- Bet placement with minimum amount verification
- Multiplier calculation based on POAP attendance
- Match state management (upcoming, in progress, finished)
- Automatic swap of losing tokens to winning tokens
- Winnings distribution with multipliers

#### `BettingPoolFactory.sol`
Factory for creating and managing betting pools.

**Features:**
- Creation of new betting pools
- Match lifecycle management
- POAP attendance verification
- Admin and global claims

### Support Contracts

#### `MockFanToken.sol`
ERC20 mock token for testing and demonstrations.

#### `MockPOAP.sol`
Mock contract to simulate match attendance POAPs.

#### `MockSwapRouter.sol`
Mock swap router to simulate token exchanges.

### Interfaces

#### `IFanToken.sol`
Interface for ERC20 fan tokens.

#### `ISwapRouter.sol`
Interface for swap routers (Uniswap V3 compatible).

#### `IPOAP.sol`
Interface for POAP contracts.

## Usage Workflow

### 1. Creating a Match
```solidity
// Create a POAP for the match
poap.createMatch(matchId, "Team A vs Team B");

// Create the betting pool
factory.createPool(
    team1Token,
    team2Token,
    matchStartTime,
    matchDuration,
    matchId
);
```

### 2. Placing Bets
```solidity
// Approve tokens
fanToken.approve(poolAddress, amount);

// Place a bet
pool.placeBet(teamToken, amount);
```

### 3. POAP Verification
```solidity
// Award a POAP to a user
poap.awardPOAP(user, matchId);

// Verify attendance
factory.verifyPOAPAttendance(user, matchId);
```

### 4. Match Management
```solidity
// Start the match
factory.startMatch(poolAddress);

// End the match with the winner
factory.endMatch(poolAddress, winningTeamToken);
```

### 5. Claiming Winnings
```solidity
// Claim winnings
factory.claimWinnings(poolAddress, user);
```

## Tests

The project includes a comprehensive test suite with Foundry:

```bash
# Run all tests
forge test

# Run a specific test
forge test --match-test test_PlaceBet

# Run tests with verbosity
forge test -vvv
```

### Included Tests
- Bet placement and minimum amount validation
- Match state management
- POAP multiplier calculation
- Claims and winnings distribution
- Admin and global delay management
- Complete betting workflow

## Deployment

### Prerequisites
- Node.js and npm/pnpm
- Foundry
- Hardhat (optional)

### Installation
```bash
cd backend
pnpm install
```

### Compilation
```bash
forge build
```

### Tests
```bash
forge test
```

## Security

### Implemented Security Measures
- Minimum amount verification to prevent dust attacks
- Withdrawal block before match
- Security delays for admin and global claims
- POAP verification for attendance
- Access controls for administrative functions

### Recommended Audits
- Complete security audit before production deployment
- Swap system penetration testing
- Access control verification
- Multiplier calculation audit

## Future Improvements

### Proposed Features
- Integration with real DEXs (Uniswap V3, SushiSwap)
- Fan token liquidity system
- Web3 user interface
- Regular bettor reward system
- Oracle integration for match results

### Technical Optimizations
- Gas optimization for multiplier calculations
- Batch claims system to reduce costs
- POAP data caching
- Winnings distribution calculation optimization

## License

MIT License - see LICENSE file for details.
