- [Klaytn ERC721 BApp Recap](#klaytn-erc721-bapp-recap)
- [install](#install)
- [local test](#local-test)
  - [contracts](#contracts)
- [dev test](#dev-test)
  - [contract](#contract)
    - [1.migrate](#1migrate)
- [stage test (WIP)](#stage-test-wip)
- [prod deploy (WIP)](#prod-deploy-wip)
- [Info](#info)
  - [개발 프로세스](#개발-프로세스)
  - [Package](#package)
  - [version check (truffle)](#version-check-truffle)


# Klaytn ERC721 BApp Recap


# install 

```
npm install
cd ./client && npm install
```



# local test 

## contracts

```js
// running local blockchain network
npm run ganache:dev



```
# dev test 

## contract

### 1.migrate

```
npx truffle migrate --compile-all --reset --network ganache
    - 빌드 결과물 생성
    - 로컬 가나슈 네트워크에 베포되었음.
```

# stage test (WIP)

# prod deploy (WIP)


--- 

# Info 

## 개발 프로세스

contracts development process

    1. contracts 작성 및 가냐슈 테스트 
    2. contracts klaytn IDE 테스트 및 테스트넷 deploy 
    3. contracts 메인넷 deploy
    4. contracts ABI, Address
    5. FrontEnd Web DApp


## Package

```
// Solidity
    "truffle": "^5.0.31",
    "truffle-hdwallet-provider-klaytn": "^1.0.13-a"
    "openzeppelin-solidity": "^2.3.0",
// server
    express .. 

// dapp-react
    "caver-js": "^1.0.0",
    "ipfs-http-client": "32.0.1",
```
## version check (truffle)

```
npx truffle version
    Truffle v5.5.25 (core: 5.5.25)
    Ganache v7.4.0
    Solidity v0.5.16 (solc-js)
    Node v16.14.2
    Web3.js v1.7.4
```
