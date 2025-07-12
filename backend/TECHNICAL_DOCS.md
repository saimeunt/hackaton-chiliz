# Technical Documentation - Sports Betting System

## Technical Architecture

### Overview
The system consists of several smart contracts that work together to create a decentralized sports betting ecosystem. The architecture follows the Factory pattern to enable the creation of multiple betting pools.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   BettingPool   │    │ BettingPool      │    │   MockFanToken  │
│     Factory     │───▶│   (Instance)     │◀───│   (Team A)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MockPOAP      │    │  MockSwapRouter  │    │   MockFanToken  │
│                 │    │                  │    │   (Team B)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Detailed Contracts

### 1. BettingPool.sol

#### Data Structure
```solidity
struct Bet {
    uint256 amount;      // Bet amount
    uint256 multiplier;  // POAP multiplier (80-150)
    bool claimed;        // Whether winnings have been claimed
}

struct TeamPool {
    address token;           // Team token address
    uint256 totalAmount;     // Total amount bet on this team
    mapping(address => Bet) bets;  // Bets by user
    address[] bettors;       // List of bettors
}
```

#### Match States
```solidity
enum MatchStatus {
    UPCOMING,    // Upcoming match
    IN_PROGRESS, // Match in progress
    FINISHED     // Match finished
}
```

#### Main Functions

##### `placeBet(address teamToken, uint256 amount)`
- **Objective**: Allow a user to bet on a team
- **Validations**:
  - Minimum amount of 10 tokens
  - Match not yet started
  - Before withdrawal block (1 hour before)
- **Actions**:
  - Transfer tokens to contract
  - Calculate POAP multiplier
  - Add bet to appropriate pool

##### `calculateMultiplier(address user)`
- **Objective**: Calculate multiplier based on POAP attendance
- **Formula**:
  - 0 matches: 0.8x (80)
  - 5+ matches: 1.0x (100)
  - 100+ matches: 1.5x (150)
  - Between 5-100: logarithmic curve

##### `claimWinnings(address user)`
- **Objective**: Allow a user to claim their winnings
- **Process**:
  1. Verify match is finished
  2. Calculate winnings for each pool
  3. Automatic swap of losing tokens
  4. Distribute winnings with multiplier

### 2. BettingPoolFactory.sol

#### Management Functions
- `createPool()` : Create a new betting pool
- `endMatch()` : End a match with winner declaration
- `verifyPOAPAttendance()` : Verify POAP attendance

#### Claim Management
- `adminClaim()` : Recover unclaimed tokens after 1 year
- `globalClaim()` : Recover all tokens after 2 years

## Key Algorithms

### 1. POAP Multiplier Calculation

```solidity
function calculateMultiplier(address user) public view returns (uint256) {
    uint256 matchCount = userMatchCount[user];
    
    if (matchCount == 0) return 80;        // 0.8x
    if (matchCount >= 100) return 150;     // 1.5x
    if (matchCount >= 5) return 100;       // 1.0x
    
    // Logarithmic curve between 0.8 and 1.0
    uint256 multiplier = 80 + (20 * _log(matchCount + 1) / _log(6));
    return multiplier;
}
```

### 2. Winnings Distribution

```solidity
function _calculateWinnings(TeamPool storage pool, address user) internal view returns (uint256) {
    Bet storage bet = pool.bets[user];
    if (bet.amount == 0 || bet.claimed) return 0;

    uint256 totalPoolAmount = team1Pool.totalAmount + team2Pool.totalAmount;
    uint256 userShare = (bet.amount * bet.multiplier) / 100; // Apply multiplier
    uint256 winnings = (userShare * totalPoolAmount) / pool.totalAmount;
    
    return winnings;
}
```

### 3. Automatic Swap

```solidity
function _swapAndCalculateWinnings(TeamPool storage pool, address user) internal returns (uint256) {
    Bet storage bet = pool.bets[user];
    
    // Approve swap
    IFanToken(pool.token).approve(swapRouter, bet.amount);
    
    // Create path for swap (tokenIn -> tokenOut)
    address[] memory path = new address[](2);
    path[0] = pool.token;
    path[1] = winningTeamToken;
    
    // Perform swap using Uniswap V2 interface
    uint256[] memory amounts = ISwapRouter(swapRouter).swapExactTokensForTokens(
        bet.amount,           // amountIn
        0,                    // amountOutMin (no slippage protection for simplicity)
        path,                 // path
        address(this),        // to
        block.timestamp + 300 // deadline (5 minutes)
    );
    
    uint256 swappedAmount = amounts[1]; // amountOut is at index 1
    
    // Calculate winnings based on swapped amount
    uint256 totalPoolAmount = team1Pool.totalAmount + team2Pool.totalAmount;
    uint256 userShare = (swappedAmount * bet.multiplier) / 100;
    uint256 winnings = (userShare * totalPoolAmount) / pool.totalAmount;
    
    bet.claimed = true;
    return winnings;
}
```

## Security

### Protection Measures

#### 1. Access Controls
- `onlyFactory` : Only factory can call certain functions
- `onlyOwner` : Only owner can perform administrative actions
- `onlyBeforeMatch` : Actions limited before match start

#### 2. Attack Protection
- **Minimum amount** : 10 tokens to prevent dust attacks
- **Withdrawal block** : 1 hour before match
- **Security delays** : 1 year for admin claim, 2 years for global claim

#### 3. Data Validation
- Token address verification
- Amount validation
- Match state control

### Identified Risks

#### 1. Swap Risks
- **Slippage** : No slippage protection in mock
- **Liquidity** : Dependency on DEX liquidity
- **Price manipulation** : MEV attack risk

#### 2. POAP Risks
- **Falsification** : Possibility to create fake POAPs
- **Centralization** : Dependency on authority that assigns POAPs

#### 3. Gas Risks
- **High cost** : Swaps can be expensive
- **Gas limits** : Risk of transaction failure

## Optimizations

### 1. Gas Optimizations
- Use `uint256` for multipliers (avoid decimals)
- Optimized mapping for bets
- Reduce loops in calculations

### 2. Storage Optimizations
- Compact structs
- Variable reuse
- Minimize events

### 3. Future Optimizations
- Batch claims to reduce costs
- Cache multiplier calculations
- Optimize distribution calculations

## Tests

### Test Coverage
- Unit tests for each function
- Integration tests for complete workflows
- Security tests for edge cases
- Performance tests for complex calculations

### Test Scenarios
1. **Bet placement** : Amount and multiplier validation
2. **Match management** : State transitions and access controls
3. **Winnings distribution** : Precise calculations and automatic swaps
4. **Claims** : Delays and token recovery
5. **POAP** : Verification and multiplier updates

## Deployment

### Configuration
- Solidity 0.8.25
- EVM Cancun
- OpenZeppelin 5.0.0
- Foundry for testing

### Deployment Addresses
- Factory : Main entry point
- POAP : Attendance verification contract
- Swap Router : Exchange interface
- Fan Tokens : Team tokens

### Migration
1. Deploy support contracts
2. Deploy factory
3. Configure parameters
4. Validation tests
5. Open to users

## Monitoring

### Key Metrics
- Number of pools created
- Total betting volume 