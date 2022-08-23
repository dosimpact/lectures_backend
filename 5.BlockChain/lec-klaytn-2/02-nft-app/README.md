- [crypto-ytt-starter](#crypto-ytt-starter)
  - [사전준비](#사전준비)
  - [스마트 컨트랙트 빌드](#스마트-컨트랙트-빌드)
  - [NODE 모듈 설치](#node-모듈-설치)
  - [frontend 실행](#frontend-실행)
  - [버전정보](#버전정보)
  - [강좌 URL](#강좌-url)
  - [개발 프로세스](#개발-프로세스)
  - [install](#install)
  - [truffle version check](#truffle-version-check)
  - [가나슈 테스트](#가나슈-테스트)
- [bapp 요구사항](#bapp-요구사항)
  - [범주](#범주)

# crypto-ytt-starter

Klaytn ERC721 BApp

## 사전준비

> 코드내 private key 를 자신의 키로 모두 변경합니다.

## 스마트 컨트랙트 빌드

> truffle migrate --compile-all --reset --network klaytn

## NODE 모듈 설치

> npm install

## frontend 실행

> npm run dev

## 버전정보

> node 버전: 16.13.0

> npm 버전: 8.1.4

> truffle 버전: 5.1.23

> solidity 버전: 0.5.16

## 강좌 URL

> https://www.inflearn.com/course/%ED%81%B4%EB%A0%88%EC%9D%B4%ED%8A%BC-%EB%B8%94%EB%A1%9D%EC%B2%B4%EC%9D%B8-%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-ERC721/dashboard

--- 


## 개발 프로세스

contracts development process

    1. contracts 작성 및 가냐슈 테스트 
    2. contracts klaytn IDE 테스트 및 테스트넷 deploy 
    3. contracts 메인넷 deploy
    4. contracts ABI, Address
    5. FrontEnd Web DApp


## install

```
npm install
npm install -g ganache-cli 

```

## truffle version check

```
npx truffle version
    Truffle v5.5.25 (core: 5.5.25)
    Ganache v7.4.0
    Solidity v0.5.16 (solc-js)
    Node v16.14.2
    Web3.js v1.7.4

```

## 가나슈 테스트

```
가나슈 : 솔리디티 네트워크 로컬 테스트 목적
솔리디티 : 클레이튼과 이더리움 둘 모두 사용 가능 (클레이튼이 이더리움에서 fork)

---
// 설치
npm install -g ganache-cli

// 실행
>ganache-cli

  Ganache CLI v6.12.2 (ganache-core: 2.13.2)
  ...
  Listening on 127.0.0.1:8545


// local test

// 컴파일 및 베포 (ganache에 )
npx truffle migrate --compile-all --reset --network ganache
    - 빌드 결과물 생성
    - 로컬 가나슈 네트워크에 베포되었음.

// 가나슈 콘솔
npx truffle console --network ganache

// 스마트컨트랙 인스턴스 가져오기
truffle(ganache)> instance = await YouTubeThumbnailToken.deployed()

// 스마트컨트랙 확인
truffle(ganache)> instance.name()
  'Youtube Thumbnail'

truffle(ganache)> instance.symbol()
  'YTT'

// 토큰 발행 
// - from: accounts[1] : 가냐슈의 두번째 계정에서 호출함을 명시
truffle(ganache)> instance.mintYTT("1234","dodo","2022.08.06","https://ipfs.io",{from: accounts[1]})
  {
    tx: '0x5d23b0c785917bbd32203415ecbe2da380f7caafd242f6a9a35d7b27e316909f',
    receipt: {
      transactionHash: '0x5d23b0c785917bbd32203415ecbe2da380f7caafd242f6a9a35d7b27e316909f',
      transactionIndex: 0,
      blockHash: '0xba4523be44959d12edfab370df3dc7fbb4ff3c5b3e5e879de446ab6d3776a828',
      blockNumber: 13,
      from: '0xa98d6b25571bab3c4883cce87e9c6bc723cf6f69',
      to: '0x365828f21ffc407d78eecc3053a6feb67b4ca2f4',
      gasUsed: 242376,
      cumulativeGasUsed: 242376,
      contractAddress: null,
      logs: [ [Object] ],
      status: true,
      logsBloom: '0x000..',
      rawLogs: [ [Object] ]
    },
    logs: [
      {
        logIndex: 0,
        transactionIndex: 0,
        transactionHash: '0x5d23b0c785917bbd32203415ecbe2da380f7caafd242f6a9a35d7b27e316909f',
        blockHash: '0xba4523be44959d12edfab370df3dc7fbb4ff3c5b3e5e879de446ab6d3776a828',
        blockNumber: 13,
        address: '0x365828f21ffc407d78EECc3053a6fEb67b4CA2f4',
        type: 'mined',
        removed: false,
        id: 'log_ba1741b7',
        event: 'Transfer',
        args: [Result]
      }
    ]
  }

// 총 토큰
truffle(ganache)> instance.totalSupply();
BN { negative: 0, words: [ 1, <1 empty item> ], length: 1, red: null }

// 토큰 메타정보
truffle(ganache)> instance.tokenURI(1);
'https://ipfs.io'


// 뷰 함수 - 토큰의 정보
truffle(ganache)> instance.getYTT(1)
Result { '0': 'dodo', '1': '2022.08.06' }

// 뷰 함수 - 이미 제작 여부 
truffle(ganache)> instance.isTokenAlreadyCreated("1111")
false

truffle(ganache)> instance.isTokenAlreadyCreated("1234")
true

---
// 토큰 세일즈 컨트렉
truffle(ganache)> instance = await TokenSales.deployed()

>instance.nftAddress();


```

```
// 바오밥 테스트넷 베포
// - contarct deploy
npx truffle deploy --network klaytn

// - re deploy
npx truffle deploy --compile-all --reset --network klaytn

// cf) only build 
npx truffle build
```

# bapp 요구사항

토큰 생성  
- 생성전에 이미 만들어진 video ID인지 컨트렉으로 확인.  
- 토큰생성할때 메타데이터도 같이 만들기
  - ERC721 Metadata JSON schema 형태를 따르도록 생성
  - 이미지 데이터는 IPFS 에 올리기 ( p2p 분산 파일 시스템)  
    - 공식 사이트 : https://ipfs.io/ 
    - 공개 노드 : https://ipfs.github.io/public-gateway-checker/
    - 사이즈가 큰 파일을 IPFS에 업로드하고, 결과로 나온ㄴ 해쉬값을 블럭체인에 저장
    - (텍스트->블럭체인 , 사진/동영상 -> IPFS )
- FEE_DELEGATED_SMART_CONTRACT_EXECUTION 타입의 TX 이용해서 대납을 구현

불러오기
- 로그인된 계정이 토큰 소유 여부
- 저장된 토큰 정보 블럭체인에서 로딩 ( index )
- ipfs에서 사진 가져오기

전체 토큰 불러오기
- totalSupply 로 모든 토큰의 인덱스를 가져오고
- totalByIndex 로 모든 토큰의 정보를 가져온다.


## 범주   

ERC721 스마트 컨트렉 함수
- ERC721 커스텀함수
- ipfs
- ERC721 enumeralbe interface
- ERC721 meta data

스마트 컨트렉 함수 호출 주체
- 사용자 - 로그인한 계정 
- 서버 - 대납 계정, 컨트렉 베포자.  


