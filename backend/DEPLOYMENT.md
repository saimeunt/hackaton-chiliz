# Deployment Guide

Ce guide explique comment déployer les contrats de betting pool en utilisant Hardhat Ignition.

## Structure des Scripts

### 1. Module Ignition (`ignition/modules/BettingPoolModule.ts`)
- Déploie tous les contrats dans le bon ordre
- Crée 20 matchs randomisés avec des équipes de football
- Configure les POAPs pour chaque match
- Mint des tokens initiaux pour les tests

### 2. Script Post-Déploiement (`scripts/post-deployment.ts`)
- Démarre et termine aléatoirement certains matchs
- Attribue des POAPs à des utilisateurs aléatoires
- Gère les opérations qui nécessitent les adresses de pool créées dynamiquement

### 3. Script d'Extraction d'Adresses (`scripts/extract-addresses.ts`)
- Extrait les adresses de contrat des artefacts de déploiement Ignition
- Sauvegarde les adresses dans un fichier JSON pour utilisation ultérieure

### 4. Script de Déploiement Complet (`scripts/deploy-complete.ts`)
- Orchestre tout le processus de déploiement
- Exécute les trois étapes dans l'ordre

## Contrats Déployés

1. **MockSwapRouter** - Routeur de swap simulé pour les échanges de tokens
2. **MockPOAP** - Contrat POAP simulé pour la vérification d'assiduité
3. **MockFanToken** (x4) - Tokens de fans pour 4 équipes différentes
4. **BettingPoolFactory** - Factory principale pour créer et gérer les pools de paris

## Ordre de Déploiement

1. MockSwapRouter (aucun paramètre)
2. MockPOAP (aucun paramètre)
3. MockFanToken pour chaque équipe (nom, symbole, décimales, propriétaire)
4. BettingPoolFactory (swapRouter, poapContract)

## Matchs Créés

Le script crée 20 matchs avec :
- **Équipes** : PSG, Real Madrid, Barcelona, Manchester United, Liverpool, etc.
- **Horaires** : 1 heure à 7 jours dans le futur
- **Durées** : 1.5 à 2 heures
- **POAPs** : Créés pour chaque match avec des noms descriptifs

## Utilisation

### Déploiement Complet (Recommandé)
```bash
npx hardhat run scripts/deploy-complete.ts --network <network>
```

### Déploiement Étape par Étape

1. **Déployer les contrats** :
```bash
npx hardhat ignition deploy ignition/modules/BettingPoolModule.ts --network <network>
```

2. **Extraire les adresses** :
```bash
npx hardhat run scripts/extract-addresses.ts --network <network>
```

3. **Exécuter les opérations post-déploiement** :
```bash
npx hardhat run scripts/post-deployment.ts --network <network>
```

## Configuration

### Variables d'Environnement (Optionnel)
Si les adresses ne peuvent pas être extraites automatiquement, vous pouvez les définir manuellement :

```bash
export BETTING_POOL_FACTORY_ADDRESS="0x..."
export MOCK_POAP_ADDRESS="0x..."
```

### Réseaux Supportés
- `localhost` - Pour les tests locaux
- `hardhat` - Pour les tests Hardhat
- `sepolia` - Pour le testnet Sepolia
- `mainnet` - Pour le réseau principal (attention !)

## Résultats

Après le déploiement, vous aurez :
- ✅ Tous les contrats déployés
- ✅ 20 matchs créés avec des équipes aléatoires
- ✅ POAPs configurés pour chaque match
- ✅ Certains matchs démarrés/terminés aléatoirement
- ✅ POAPs attribués à des utilisateurs aléatoires
- ✅ 1000 tokens mintés pour chaque équipe au déployeur

## Fichiers Générés

- `deployment-addresses.json` - Adresses de tous les contrats déployés
- `ignition/deployments/` - Artefacts de déploiement Ignition

## Dépannage

### Erreur "No deployment artifacts found"
Assurez-vous que le déploiement Ignition s'est bien terminé avant d'exécuter l'extraction d'adresses.

### Erreur "Failed to load deployment addresses"
Vérifiez que le fichier `deployment-addresses.json` a été créé correctement.

### Erreur de réseau
Assurez-vous que votre configuration Hardhat inclut le réseau cible et que vous avez suffisamment de fonds.

## Personnalisation

Pour modifier le comportement du déploiement :

1. **Nombre de matchs** : Modifiez `NB_MATCHES` dans `BettingPoolModule.ts`
2. **Équipes** : Modifiez le tableau `teamNames` dans `generateRandomMatch()`
3. **Probabilités** : Ajustez les pourcentages dans les scripts
4. **Tokens initiaux** : Modifiez `initialMintAmount` dans le module Ignition 