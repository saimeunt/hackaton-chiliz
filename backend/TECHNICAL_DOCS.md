# Documentation Technique - Système de Paris Sportifs

## Architecture Technique

### Vue d'ensemble
Le système est composé de plusieurs contrats intelligents qui travaillent ensemble pour créer un écosystème de paris sportifs décentralisé. L'architecture suit le pattern Factory pour permettre la création de multiples pools de paris.

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

## Contrats Détaillés

### 1. BettingPool.sol

#### Structure des Données
```solidity
struct Bet {
    uint256 amount;      // Montant parié
    uint256 multiplier;  // Multiplicateur POAP (80-150)
    bool claimed;        // Si les gains ont été réclamés
}

struct TeamPool {
    address token;           // Adresse du token de l'équipe
    uint256 totalAmount;     // Montant total parié sur cette équipe
    mapping(address => Bet) bets;  // Paris par utilisateur
    address[] bettors;       // Liste des parieurs
}
```

#### États du Match
```solidity
enum MatchStatus {
    UPCOMING,    // Match à venir
    IN_PROGRESS, // Match en cours
    STOPPED,     // Match arrêté
    FINISHED     // Match terminé
}
```

#### Fonctions Principales

##### `placeBet(address teamToken, uint256 amount)`
- **Objectif** : Permettre à un utilisateur de parier sur une équipe
- **Vérifications** :
  - Montant minimum de 10 tokens
  - Match pas encore commencé
  - Avant le blocage des retraits (1h avant)
- **Actions** :
  - Transfert des tokens vers le contrat
  - Calcul du multiplicateur POAP
  - Ajout du pari à la pool appropriée

##### `calculateMultiplier(address user)`
- **Objectif** : Calculer le multiplicateur basé sur l'attendance POAP
- **Formule** :
  - 0 match : 0.8x (80)
  - 5+ matchs : 1.0x (100)
  - 100+ matchs : 1.5x (150)
  - Entre 5-100 : courbe logarithmique

##### `claimWinnings(address user)`
- **Objectif** : Permettre à un utilisateur de réclamer ses gains
- **Processus** :
  1. Vérification que le match est terminé
  2. Calcul des gains pour chaque pool
  3. Swap automatique des tokens perdants
  4. Distribution des gains avec multiplicateur

### 2. BettingPoolFactory.sol

#### Fonctions de Gestion
- `createPool()` : Création d'un nouveau pool de paris
- `startMatch()` : Démarrage d'un match
- `endMatch()` : Fin d'un match avec déclaration du gagnant
- `verifyPOAPAttendance()` : Vérification de l'attendance POAP

#### Gestion des Claims
- `adminClaim()` : Récupération des tokens non réclamés après 1 an
- `globalClaim()` : Récupération de tous les tokens après 2 ans

## Algorithmes Clés

### 1. Calcul des Multiplicateurs POAP

```solidity
function calculateMultiplier(address user) public view returns (uint256) {
    uint256 matchCount = userMatchCount[user];
    
    if (matchCount == 0) return 80;        // 0.8x
    if (matchCount >= 100) return 150;     // 1.5x
    if (matchCount >= 5) return 100;       // 1.0x
    
    // Courbe logarithmique entre 0.8 et 1.0
    uint256 multiplier = 80 + (20 * _log(matchCount + 1) / _log(6));
    return multiplier;
}
```

### 2. Distribution des Gains

```solidity
function _calculateWinnings(TeamPool storage pool, address user) internal view returns (uint256) {
    Bet storage bet = pool.bets[user];
    if (bet.amount == 0 || bet.claimed) return 0;

    uint256 totalPoolAmount = team1Pool.totalAmount + team2Pool.totalAmount;
    uint256 userShare = (bet.amount * bet.multiplier) / 100; // Appliquer multiplicateur
    uint256 winnings = (userShare * totalPoolAmount) / pool.totalAmount;
    
    return winnings;
}
```

### 3. Swap Automatique

```solidity
function _swapAndCalculateWinnings(TeamPool storage pool, address user) internal returns (uint256) {
    Bet storage bet = pool.bets[user];
    
    // Approbation pour le swap
    IFanToken(pool.token).approve(swapRouter, bet.amount);
    
    // Paramètres du swap
    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
        tokenIn: pool.token,
        tokenOut: winningTeamToken,
        fee: 3000, // 0.3%
        recipient: address(this),
        deadline: block.timestamp + 300,
        amountIn: bet.amount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
    });
    
    uint256 swappedAmount = ISwapRouter(swapRouter).exactInputSingle(params);
    
    // Calcul des gains basé sur le montant swappé
    uint256 totalPoolAmount = team1Pool.totalAmount + team2Pool.totalAmount;
    uint256 userShare = (swappedAmount * bet.multiplier) / 100;
    uint256 winnings = (userShare * totalPoolAmount) / pool.totalAmount;
    
    bet.claimed = true;
    return winnings;
}
```

## Sécurité

### Mesures de Protection

#### 1. Contrôles d'Accès
- `onlyFactory` : Seule la factory peut appeler certaines fonctions
- `onlyOwner` : Seul le propriétaire peut effectuer des actions administratives
- `onlyBeforeMatch` : Actions limitées avant le début du match

#### 2. Protection contre les Attaques
- **Montant minimum** : 10 tokens pour éviter les attaques par poussière
- **Blocage des retraits** : 1 heure avant le match
- **Délais de sécurité** : 1 an pour admin claim, 2 ans pour global claim

#### 3. Validation des Données
- Vérification des adresses de tokens
- Validation des montants
- Contrôle des états du match

### Risques Identifiés

#### 1. Risques de Swap
- **Slippage** : Pas de protection contre le slippage dans le mock
- **Liquidité** : Dépendance à la liquidité des DEX
- **Manipulation de prix** : Risque d'attaques MEV

#### 2. Risques de POAP
- **Falsification** : Possibilité de créer de faux POAPs
- **Centralisation** : Dépendance à l'autorité qui attribue les POAPs

#### 3. Risques de Gas
- **Coût élevé** : Les swaps peuvent être coûteux
- **Limites de gas** : Risque d'échec des transactions

## Optimisations

### 1. Optimisations de Gas
- Utilisation de `uint256` pour les multiplicateurs (éviter les décimaux)
- Mapping optimisé pour les paris
- Réduction des boucles dans les calculs

### 2. Optimisations de Stockage
- Structs compactes
- Réutilisation des variables
- Minimisation des événements

### 3. Optimisations Futures
- Batch claims pour réduire les coûts
- Mise en cache des calculs de multiplicateurs
- Optimisation des calculs de distribution

## Tests

### Couverture de Tests
- Tests unitaires pour chaque fonction
- Tests d'intégration pour les workflows complets
- Tests de sécurité pour les cas limites
- Tests de performance pour les calculs complexes

### Scénarios de Test
1. **Placement de paris** : Validation des montants et multiplicateurs
2. **Gestion du match** : Transitions d'état et contrôles d'accès
3. **Distribution des gains** : Calculs précis et swaps automatiques
4. **Claims** : Délais et récupération des tokens
5. **POAP** : Vérification et mise à jour des multiplicateurs

## Déploiement

### Configuration
- Solidity 0.8.25
- EVM Cancun
- OpenZeppelin 5.0.0
- Foundry pour les tests

### Adresses de Déploiement
- Factory : Point d'entrée principal
- POAP : Contrat de vérification d'attendance
- Swap Router : Interface d'échange
- Fan Tokens : Tokens des équipes

### Migration
1. Déploiement des contrats de support
2. Déploiement de la factory
3. Configuration des paramètres
4. Tests de validation
5. Ouverture aux utilisateurs

## Monitoring

### Métriques Clés
- Nombre de pools créés
- Volume total des paris
- Distribution des multiplicateurs
- Taux de claim des gains
- Performance des swaps

### Alertes
- Échecs de swap
- Claims non effectués
- Anomalies dans les multiplicateurs
- Activité suspecte

## Support et Maintenance

### Mises à Jour
- Amélioration des algorithmes de calcul
- Optimisation des contrats
- Ajout de nouvelles fonctionnalités
- Corrections de bugs

### Support Utilisateur
- Documentation détaillée
- Guides d'utilisation
- Support technique
- Formation des utilisateurs 