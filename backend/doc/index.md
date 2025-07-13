# Solidity API

## BettingPool

### BetPlaced

```solidity
event BetPlaced(address user, address teamToken, uint256 amount, uint256 multiplier)
```

### MatchEnded

```solidity
event MatchEnded(address winningTeamToken)
```

### Claimed

```solidity
event Claimed(address user, uint256 amount)
```

### AdminClaimed

```solidity
event AdminClaimed(uint256 amount)
```

### GlobalClaimed

```solidity
event GlobalClaimed(uint256 amount)
```

### WithdrawalsBlocked

```solidity
event WithdrawalsBlocked(uint256 blockTime)
```

### MatchStatus

```solidity
enum MatchStatus {
  UPCOMING,
  IN_PROGRESS,
  FINISHED
}
```

### Bet

```solidity
struct Bet {
  uint256 amount;
  uint256 points;
  bool claimed;
}
```

### TeamPool

```solidity
struct TeamPool {
  address token;
  address wrappedToken;
  uint256 totalAmount;
  uint256 totalPoints;
  mapping(address => struct BettingPool.Bet) bets;
  address[] bettors;
}
```

### factory

```solidity
address factory
```

### swapRouter

```solidity
address swapRouter
```

### poapContract

```solidity
address poapContract
```

### matchStartTime

```solidity
uint256 matchStartTime
```

### matchEndTime

```solidity
uint256 matchEndTime
```

### withdrawalBlockTime

```solidity
uint256 withdrawalBlockTime
```

### CLAIM_ADMIN_DELAY

```solidity
uint256 CLAIM_ADMIN_DELAY
```

### CLAIM_GLOBAL_DELAY

```solidity
uint256 CLAIM_GLOBAL_DELAY
```

### team1Token

```solidity
address team1Token
```

### team2Token

```solidity
address team2Token
```

### winningTeamToken

```solidity
address winningTeamToken
```

### wrappedChilizToken

```solidity
address wrappedChilizToken
```

### team1Pool

```solidity
struct BettingPool.TeamPool team1Pool
```

### team2Pool

```solidity
struct BettingPool.TeamPool team2Pool
```

### hasClaimed

```solidity
mapping(address => bool) hasClaimed
```

### nonReentrant

```solidity
modifier nonReentrant()
```

### onlyFactory

```solidity
modifier onlyFactory()
```

### onlyBeforeMatch

```solidity
modifier onlyBeforeMatch()
```

### onlyAfterMatch

```solidity
modifier onlyAfterMatch()
```

### onlyBeforeWithdrawalBlock

```solidity
modifier onlyBeforeWithdrawalBlock()
```

### onlyAfterWithdrawalBlock

```solidity
modifier onlyAfterWithdrawalBlock()
```

### constructor

```solidity
constructor(address _factory, address _swapRouter, address _poapContract, address _team1Token, address _team2Token, uint256 _matchStartTime, uint256 _matchDuration) public
```

### placeBet

```solidity
function placeBet(address teamToken, uint256 amount) external
```

_Place a bet on a team_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| teamToken | address | The token of the team to bet on |
| amount | uint256 | Amount of tokens to bet |

### endMatch

```solidity
function endMatch(address newWinningTeamToken) external
```

_End the match and set the winner_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newWinningTeamToken | address | The token of the winning team |

### claimWinnings

```solidity
function claimWinnings(address user) external
```

_Claim winnings for a user_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user claiming |

### _canAdminClaim

```solidity
function _canAdminClaim() internal view returns (bool)
```

_Check if admin claim delay has passed_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if admin claim is allowed |

### adminClaim

```solidity
function adminClaim() external
```

This function uses block.timestamp for claim delay validation
The granularity of block.timestamp (seconds) is sufficient for this use case
as claim delays are measured in days/months, not seconds

_Admin claim for unclaimed tokens after 1 year_

### _canGlobalClaim

```solidity
function _canGlobalClaim() internal view returns (bool)
```

_Check if global claim delay has passed_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if global claim is allowed |

### globalClaim

```solidity
function globalClaim() external
```

This function uses block.timestamp for claim delay validation
The granularity of block.timestamp (seconds) is sufficient for this use case
as claim delays are measured in days/months, not seconds

_Global claim for remaining tokens after 2 years_

### calculateMultiplier

```solidity
function calculateMultiplier(address user) public view returns (uint256)
```

_Calculate multiplier based on POAP attendance_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Multiplier value (0.8 to 1.5) |

### _addBetToPool

```solidity
function _addBetToPool(struct BettingPool.TeamPool pool, address user, uint256 amount, uint256 multiplier) internal
```

### _reclaim

```solidity
function _reclaim(struct BettingPool.TeamPool winningPool, address user) internal view returns (uint256)
```

### _swapAndCalculateWinnings

```solidity
function _swapAndCalculateWinnings(struct BettingPool.TeamPool winningPool, struct BettingPool.TeamPool losingPool, address user) internal returns (uint256)
```

### _claimUnclaimedPool

```solidity
function _claimUnclaimedPool(struct BettingPool.TeamPool pool) internal
```

### getMatchStatus

```solidity
function getMatchStatus() public view returns (enum BettingPool.MatchStatus)
```

_Get the current match status based on time and match state_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | enum BettingPool.MatchStatus | Current match status (UPCOMING, IN_PROGRESS, or FINISHED) |

### getBet

```solidity
function getBet(address user, address teamToken) external view returns (uint256 amount, uint256 multiplier, bool claimed)
```

### getPoolInfo

```solidity
function getPoolInfo(address teamToken) external view returns (uint256 totalAmount, uint256 bettorCount)
```

### getBettors

```solidity
function getBettors(address teamToken) external view returns (address[])
```

## BettingPoolFactory

_Factory contract for creating and managing betting pools
Inherits from PoolManager to use the core pool management functionality_

### OwnershipTransferred

```solidity
event OwnershipTransferred(address previousOwner, address newOwner)
```

### UserMatchCountUpdated

```solidity
event UserMatchCountUpdated(address user, uint256 newCount, uint256 matchId)
```

### owner

```solidity
address owner
```

### userMatchCount

```solidity
mapping(address => uint256) userMatchCount
```

### onlyOwner

```solidity
modifier onlyOwner()
```

### onlyPoap

```solidity
modifier onlyPoap()
```

### constructor

```solidity
constructor(address _swapRouter, address _poapContract) public
```

### createPool

```solidity
function createPool(address team1Token, address team2Token, uint256 matchStartTime, uint256 matchDuration, string matchName) external returns (address poolAddress)
```

_Create a new betting pool for a match_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| team1Token | address | Token of the first team |
| team2Token | address | Token of the second team |
| matchStartTime | uint256 | Start time of the match |
| matchDuration | uint256 | Duration of the match in seconds |
| matchName | string | Name of the match (for POAP) |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the created pool |

### endMatch

```solidity
function endMatch(address poolAddress, address winningTeamToken) external
```

_End a match and set the winner_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the pool |
| winningTeamToken | address | Token of the winning team |

### verifyPOAPAttendance

```solidity
function verifyPOAPAttendance(address user, uint256 matchId) external
```

_Verify POAP attendance and update user match count_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| matchId | uint256 | POAP match ID |

### claimWinnings

```solidity
function claimWinnings(address poolAddress, address user) external
```

_Claim winnings for a user_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the pool |
| user | address | Address of the user |

### adminClaim

```solidity
function adminClaim(address poolAddress) external
```

_Admin claim for unclaimed tokens after 1 year_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the pool |

### globalClaim

```solidity
function globalClaim(address poolAddress) external
```

_Global claim for remaining tokens after 2 years_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the pool |

### calculateMultiplier

```solidity
function calculateMultiplier(address user) public view returns (uint256)
```

_Calculate multiplier based on POAP attendance_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Multiplier value starting at 100% |

### _updateUserMatchCount

```solidity
function _updateUserMatchCount(address user, uint256 matchId) internal
```

_Update user match count (called internally when POAP is verified)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| matchId | uint256 | POAP match ID |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external
```

_Transfer ownership_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newOwner | address | Address of the new owner |

### emergencyRecover

```solidity
function emergencyRecover(address token, uint256 amount) external
```

_Emergency function to recover tokens stuck in factory_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | Address of the token to recover |
| amount | uint256 | Amount to recover |

## IBettingPoolFactory

_Interface for BettingPoolFactory contract_

### calculateMultiplier

```solidity
function calculateMultiplier(address user) external view returns (uint256)
```

_Calculate multiplier based on POAP attendance_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Multiplier value (0.8 to 1.5) |

### verifyPOAPAttendance

```solidity
function verifyPOAPAttendance(address user, uint256 matchId) external
```

_Verify POAP attendance and update user match count_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| matchId | uint256 | POAP match ID |

### owner

```solidity
function owner() external view returns (address)
```

## IFanToken

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) external returns (bool)
```

### transfer

```solidity
function transfer(address to, uint256 amount) external returns (bool)
```

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

### approve

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

### decimals

```solidity
function decimals() external view returns (uint8)
```

### symbol

```solidity
function symbol() external view returns (string)
```

### name

```solidity
function name() external view returns (string)
```

## IPOAP

### createMatch

```solidity
function createMatch(uint256 matchId, string matchName) external
```

### balanceOf

```solidity
function balanceOf(address account, uint256 id) external view returns (uint256)
```

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) external view returns (bool)
```

## ISwapRouter

### swapExactTokensForTokens

```solidity
function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) external returns (uint256[] amounts)
```

### swapTokensForExactTokens

```solidity
function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) external returns (uint256[] amounts)
```

### getAmountsOut

```solidity
function getAmountsOut(uint256 amountIn, address[] path) external view returns (uint256[] amounts)
```

### getAmountsIn

```solidity
function getAmountsIn(uint256 amountOut, address[] path) external view returns (uint256[] amounts)
```

## MockPOAP

### matchNames

```solidity
mapping(uint256 => string) matchNames
```

### hasAttended

```solidity
mapping(address => mapping(uint256 => bool)) hasAttended
```

### bettingPoolFactory

```solidity
address bettingPoolFactory
```

### constructor

```solidity
constructor() public
```

### createMatch

```solidity
function createMatch(uint256 matchId, string matchName) external
```

_Create a new match POAP_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| matchId | uint256 | Unique ID for the match |
| matchName | string | Name of the match |

### awardPoap

```solidity
function awardPoap(address user, uint256 matchId) external
```

_Award POAP to user for attending a match_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| matchId | uint256 | ID of the match |

### hasUserAttended

```solidity
function hasUserAttended(address user, uint256 matchId) external view returns (bool)
```

_Check if user attended a specific match_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| matchId | uint256 | ID of the match |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if user attended the match |

### getMatchName

```solidity
function getMatchName(uint256 matchId) external view returns (string)
```

_Get match name by ID_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| matchId | uint256 | ID of the match |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | Name of the match |

### setBettingPoolFactory

```solidity
function setBettingPoolFactory(address factory) external
```

_Set the betting pool factory address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| factory | address | Address of the betting pool factory |

### balanceOf

```solidity
function balanceOf(address account, uint256 id) public view returns (uint256)
```

_Override balanceOf to return 1 if user attended, 0 otherwise_

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) public view returns (bool)
```

_Override isApprovedForAll to implement IPOAP interface_

## PoolManager

_Base contract for managing betting pools
Contains the core pool management logic that can be inherited by other contracts_

### PoolCreated

```solidity
event PoolCreated(address poolAddress, address team1Token, address team2Token, uint256 matchStartTime, uint256 matchDuration)
```

### MatchStarted

```solidity
event MatchStarted(address poolAddress)
```

### MatchEnded

```solidity
event MatchEnded(address poolAddress, address winningTeamToken)
```

### POAPVerified

```solidity
event POAPVerified(address user, uint256 matchId)
```

### swapRouter

```solidity
address swapRouter
```

### poapContract

```solidity
address poapContract
```

### pools

```solidity
contract BettingPool[] pools
```

### isPool

```solidity
mapping(address => bool) isPool
```

### matchIdToPool

```solidity
mapping(uint256 => address) matchIdToPool
```

### matchCount

```solidity
uint256 matchCount
```

### nonReentrant

```solidity
modifier nonReentrant()
```

### onlyValidPool

```solidity
modifier onlyValidPool(address poolAddress)
```

### constructor

```solidity
constructor(address _swapRouter, address _poapContract) public
```

### _isValidMatchStartTime

```solidity
function _isValidMatchStartTime(uint256 matchStartTime) internal view returns (bool)
```

_Check if match start time is in the future_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| matchStartTime | uint256 | Start time of the match |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if match start time is valid |

### _createPool

```solidity
function _createPool(address team1Token, address team2Token, uint256 matchStartTime, uint256 matchDuration, string matchName) internal returns (address poolAddress)
```

_Create a new betting pool for a match_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| team1Token | address | Token of the first team |
| team2Token | address | Token of the second team |
| matchStartTime | uint256 | Start time of the match |
| matchDuration | uint256 | Duration of the match in seconds |
| matchName | string |  |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the created pool |

### _endMatch

```solidity
function _endMatch(address poolAddress, address winningTeamToken) internal
```

_End a match and set the winner_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the pool |
| winningTeamToken | address | Token of the winning team |

### _verifyPOAPAttendance

```solidity
function _verifyPOAPAttendance(address user, uint256 matchId) internal
```

_Verify POAP attendance_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | Address of the user |
| matchId | uint256 | POAP match ID |

### _claimWinnings

```solidity
function _claimWinnings(address poolAddress, address user) internal
```

_Claim winnings for a user_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the pool |
| user | address | Address of the user |

### _adminClaim

```solidity
function _adminClaim(address poolAddress) internal
```

_Admin claim for unclaimed tokens after 1 year_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the pool |

### _globalClaim

```solidity
function _globalClaim(address poolAddress) internal
```

_Global claim for remaining tokens after 2 years_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolAddress | address | Address of the pool |

### getPools

```solidity
function getPools() external view returns (address[])
```

### getPoolCount

```solidity
function getPoolCount() external view returns (uint256)
```

### getPoolByMatchId

```solidity
function getPoolByMatchId(uint256 matchId) external view returns (address)
```

### getPoolInfo

```solidity
function getPoolInfo(address poolAddress) external view returns (address team1Token, address team2Token, uint256 matchStartTime, uint256 matchEndTime, enum BettingPool.MatchStatus status, address winningTeamToken)
```

## MockFanToken

### constructor

```solidity
constructor(string name, string symbol, uint8 decimals_, address initialOwner) public
```

### mint

```solidity
function mint(address to, uint256 amount) external
```

### decimals

```solidity
function decimals() public view virtual returns (uint8)
```

_Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the default value returned by this function, unless
it's overridden.

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}._

### burn

```solidity
function burn(uint256 amount) external
```

## MockSwapRouter

### owner

```solidity
address owner
```

### constructor

```solidity
constructor() public
```

### onlyOwner

```solidity
modifier onlyOwner()
```

### swapExactTokensForTokens

```solidity
function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) external returns (uint256[] amounts)
```

### swapTokensForExactTokens

```solidity
function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) external returns (uint256[] amounts)
```

### getAmountsOut

```solidity
function getAmountsOut(uint256 amountIn, address[] path) external pure returns (uint256[] amounts)
```

### getAmountsIn

```solidity
function getAmountsIn(uint256 amountOut, address[] path) external pure returns (uint256[] amounts)
```

### withdraw

```solidity
function withdraw() external
```

### emergencyRecover

```solidity
function emergencyRecover(address token, uint256 amount) external
```

