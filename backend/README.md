# Système de Paris Sportifs avec Fan Tokens

Ce projet implémente un système de paris sportifs décentralisé où les fans peuvent parier leurs fan tokens sur leurs équipes favorites. Le système inclut des fonctionnalités avancées comme les POAPs pour l'attendance aux matchs, des multiplicateurs de gains, et un système de swap automatique.

## Fonctionnalités Principales

### 🏆 Paris avec Fan Tokens
- Les fans parient leurs fan tokens sur leurs équipes favorites
- Mise minimum de 10 fan tokens pour éviter les paris de poussière
- Blocage des retraits 1 heure avant le début du match

### 🎫 Système POAP et Multiplicateurs
- Vérification de l'attendance aux matchs via POAPs
- Multiplicateur de gains basé sur l'historique d'attendance :
  - Début : 0.8x (nouveaux utilisateurs)
  - Après 5 matchs : 1.0x
  - Maximum : 1.5x (après 100 matchs)
  - Courbe logarithmique entre 5 et 100 matchs

### 💰 Winner Takes All
- Les gagnants récupèrent tous les tokens de la pool
- Swap automatique des tokens de l'équipe perdante vers l'équipe gagnante
- Distribution des gains au prorata des tokens investis (avec multiplicateur)

### ⏰ Gestion des Claims
- Claim immédiat après la fin du match
- Claim admin après 1 an pour les tokens non réclamés
- Claim global après 2 ans pour tous les tokens restants

## Architecture des Contrats

### Contrats Principaux

#### `BettingPool.sol`
Contrat principal qui gère un pool de paris pour un match spécifique.

**Fonctionnalités :**
- Placement de paris avec vérification des montants minimums
- Calcul des multiplicateurs basés sur l'attendance POAP
- Gestion des états du match (à venir, en cours, terminé)
- Swap automatique des tokens perdants vers les tokens gagnants
- Distribution des gains avec multiplicateurs

#### `BettingPoolFactory.sol`
Factory pour créer et gérer les pools de paris.

**Fonctionnalités :**
- Création de nouveaux pools de paris
- Gestion du cycle de vie des matchs
- Vérification des POAPs d'attendance
- Claims admin et global

### Contrats de Support

#### `MockFanToken.sol`
Token ERC20 mock pour les tests et démonstrations.

#### `MockPOAP.sol`
Contrat mock pour simuler les POAPs d'attendance aux matchs.

#### `MockSwapRouter.sol`
Router de swap mock pour simuler les échanges de tokens.

### Interfaces

#### `IFanToken.sol`
Interface pour les fan tokens ERC20.

#### `ISwapRouter.sol`
Interface pour les routers de swap (compatible Uniswap V3).

#### `IPOAP.sol`
Interface pour les contrats POAP.

## Workflow d'Utilisation

### 1. Création d'un Match
```solidity
// Créer un POAP pour le match
poap.createMatch(matchId, "Team A vs Team B");

// Créer le pool de paris
factory.createPool(
    team1Token,
    team2Token,
    matchStartTime,
    matchDuration,
    matchId
);
```

### 2. Placement de Paris
```solidity
// Approuver les tokens
fanToken.approve(poolAddress, amount);

// Placer un pari
pool.placeBet(teamToken, amount);
```

### 3. Vérification POAP
```solidity
// Attribuer un POAP à un utilisateur
poap.awardPOAP(user, matchId);

// Vérifier l'attendance
factory.verifyPOAPAttendance(user, matchId);
```

### 4. Gestion du Match
```solidity
// Démarrer le match
factory.startMatch(poolAddress);

// Terminer le match avec le gagnant
factory.endMatch(poolAddress, winningTeamToken);
```

### 5. Récupération des Gains
```solidity
// Claim des gains
factory.claimWinnings(poolAddress, user);
```

## Tests

Le projet inclut une suite de tests complète avec Foundry :

```bash
# Lancer tous les tests
forge test

# Lancer un test spécifique
forge test --match-test test_PlaceBet

# Lancer les tests avec verbosité
forge test -vvv
```

### Tests Inclus
- Placement de paris et validation des montants minimums
- Gestion des états du match
- Calcul des multiplicateurs POAP
- Claims et distribution des gains
- Gestion des délais admin et global
- Workflow complet de paris

## Déploiement

### Prérequis
- Node.js et npm/pnpm
- Foundry
- Hardhat (optionnel)

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

## Sécurité

### Mesures de Sécurité Implémentées
- Vérification des montants minimums pour éviter les attaques par poussière
- Blocage des retraits avant le match
- Délais de sécurité pour les claims admin et global
- Vérification des POAPs pour l'attendance
- Contrôles d'accès pour les fonctions administratives

### Audits Recommandés
- Audit de sécurité complet avant déploiement en production
- Tests de pénétration du système de swap
- Vérification des contrôles d'accès
- Audit des calculs de multiplicateurs

## Améliorations Futures

### Fonctionnalités Proposées
- Intégration avec des DEX réels (Uniswap V3, SushiSwap)
- Système de liquidité pour les fan tokens
- Interface utilisateur web3
- Système de récompenses pour les parieurs réguliers
- Intégration avec des oracles pour les résultats de matchs

### Optimisations Techniques
- Optimisation du gas pour les calculs de multiplicateurs
- Système de batch claims pour réduire les coûts
- Mise en cache des données POAP
- Optimisation des calculs de distribution des gains

## Licence

MIT License - voir le fichier LICENSE pour plus de détails.
