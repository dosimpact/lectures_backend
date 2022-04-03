- [Klaytn 클레이튼 블록체인 어플리케이션 만들기 - 이론과 실습](#klaytn-클레이튼-블록체인-어플리케이션-만들기---이론과-실습)
  - [refer urls](#refer-urls)
  - [Solidity with Klaytn IDE](#solidity-with-klaytn-ide)

# Klaytn 클레이튼 블록체인 어플리케이션 만들기 - 이론과 실습


## refer urls

```

인프런 강의	https://www.inflearn.com/course/%ED%81%B4%EB%A0%88%EC%9D%B4%ED%8A%BC/lecture/19236
강좌별 BApp 파일	https://drive.google.com/drive/folders/1oxIqcMry1UnUgJFWYE3TClFYztL8pd9O
클래이튼 공식문서	https://docs.klaytn.com/
클래이튼 트랜젝션 모니터링 	https://scope.klaytn.com/
클레이튼 월렛	https://wallet.klaytn.com/
클레이튼 IDE 	https://ide.klaytn.com/
클레이튼 포지션 페이퍼	https://www.klaytn.com/Klaytn_PositionPaper_V2.1.0.pdf
클레이튼 포럼	https://forum.klaytn.com/
Remix - Ethereum IDE	https://remix-ide.readthedocs.io/en/latest/
KAS ( Klay API Service ) 	https://www.klaytnapi.com/ko/landing/main
```


## Solidity with Klaytn IDE  

Step1. deploy contract   

- write smart contract (.sol).   
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

