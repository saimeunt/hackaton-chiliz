# hackaton-chiliz

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
