# Clash Of Fanzzz
# hackaton-chiliz submission

### Done by Simon Arvaux, William Simon--Vezo, Franck Rieu-Patey

Betting project, but with a twist !
Make it real with DeFi and Attendance proof

"My club is better than yours !" : Prove it, make your fan token worth your club involvement. And rekt the others by automatically swaping their boring token. Go to the stadium, earn more, eazy lil hooligan.

![logo](https://github.com/Varadiell/hackaton-chiliz/tree/main/assets/illus.png "Logo")

### One track ? All tracks !
- Fan Token Utility
- DeFi
- Socios Wallet Connectivity / Features 

Live on mainnet, test in prod.



## Backend install

```
$ cd backend
$ pnpm install
```

Install Foundry
```
$ curl -L https://foundry.paradigm.xyz | bash
```

Install Slither (for Mac)
```
$ brew install pipx
$ pipx install slither-analyzer
```

## Frontend install

```
$ cd frontend
$ pnpm install
```

## Githooks

Check that your core.hookspath is ".githooks"
```
$ git config --local core.hooksPath
```

Else, set value to ".githooks"
```
$ git config --local core.hooksPath .githooks
```
