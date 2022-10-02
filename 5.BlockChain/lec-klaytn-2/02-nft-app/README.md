- [crypto-ytt-starter](#crypto-ytt-starter)
  - [사전준비](#사전준비)
  - [스마트 컨트랙트 빌드](#스마트-컨트랙트-빌드)
  - [NODE 모듈 설치](#node-모듈-설치)
  - [frontend 실행](#frontend-실행)
  - [버전정보](#버전정보)
  - [강좌 URL](#강좌-url)
  - [개발 프로세스](#개발-프로세스)
- [bapp 요구사항](#bapp-요구사항)
  - [범주](#범주)
- [urls](#urls)

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


# urls
```
인프런 강의-1	https://www.inflearn.com/course/%ED%81%B4%EB%A0%88%EC%9D%B4%ED%8A%BC/lecture/19236
인프런 강의-2	https://www.inflearn.com/course/%ED%81%B4%EB%A0%88%EC%9D%B4%ED%8A%BC
강좌별 BApp 파일	https://drive.google.com/drive/folders/1oxIqcMry1UnUgJFWYE3TClFYztL8pd9O
클래이튼 공식문서	https://docs.klaytn.com/
클래이튼 트랜젝션 모니터링 	https://scope.klaytn.com/
클레이튼 월렛	https://wallet.klaytn.com/
클레이튼 IDE 	https://ide.klaytn.com/
클레이튼 포지션 페이퍼	https://www.klaytn.com/Klaytn_PositionPaper_V2.1.0.pdf
클레이튼 포럼	https://forum.klaytn.com/
Remix - Ethereum IDE	https://remix-ide.readthedocs.io/en/latest/
KAS ( Klay API Service ) 	https://www.klaytnapi.com/ko/landing/main
Truffle Box	https://trufflesuite.com/boxes/
npm - caver-js 	https://www.npmjs.com/package/caver-js
ipfs-public gateway	https://ipfs.github.io/public-gateway-checker/
ipfs-js 	https://js.ipfs.tech/
```