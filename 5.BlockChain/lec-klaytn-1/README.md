- [Klaytn 클레이튼 블록체인 어플리케이션 만들기 - 이론과 실습](#klaytn-클레이튼-블록체인-어플리케이션-만들기---이론과-실습)
  - [install check & version check](#install-check--version-check)
  - [Step1. deploy contract](#step1-deploy-contract)

# Klaytn 클레이튼 블록체인 어플리케이션 만들기 - 이론과 실습

Solidity with Klaytn IDE

## install check & version check 

```
> node 버전: 16.13.0
> npm 버전: 8.1.4
> truffle 버전: 5.1.23  // 솔리디티 컴파일 및 베포
> solidity 버전: 0.5.16 //
```


## Step1. deploy contract   

- 스마트
- deploy using truffle.js to baobao test net.   
- output is file   
  ( ABI - application binary interface , Contract Address ). 

```
// - install truffle globally
npm install -g truffle@5.1.23

// - test sol
// truffle test ./test/1_initial_migration.sol
// truffle test ./test/1_initial_migration.sol

// - contarct deploy
// npx truffle deploy --network klaytn

// - re deploy
// npx truffle deploy --compile-all --reset --network klaytn
```

Step2. interaction with user wallet 

- login by keyStore + password
- save wallet instance. 

Step3. interaction with smart contract

- fetch file - ABL, Address 
-  make smartcontract instnace using caver.js. 

