# Klaytn AddGame BApp

Klaytn AddGame BApp

# background 

## What is this 

```
스마트 컨트렉을 (솔리디티언어)를 이용해 작성하고, 
스마트 컨트렉 함수를 호출하는 프론트엔드를 통해 테스트 합니다.

--- 스마트 컨트렉 작성 및 베포 단계
1. truffle 을 설정하여, 어떤 네트워크에 베포할지 환경변수를 줍니다. (truffle-config.js)
2. 스마트 컨트렉 작성하기.
    /migrations *.sol 를 베포해주는 js 로직
    /contractss 스마트 컨트렉 변수 및 함수 
3. 스마트 컨트렉 베포하기.  
    베포된 결과 - 주소와 Application Binary Interface, ABI 를 저장합니다.

--- Frontend 로직 처리단계 
4. Caver.js를 통해, 스마트컨트렉과 인터렉션 합니다.
5. 지갑을 연결
6. 송금 실행

```

# install 

## config 설정
> truffle-config.js 코드내 private key 를 자신의 키로 모두 변경합니다.

cf) 키스토어파일+비밀번호 => 비밀키

## NODE 모듈 설치

> npm install

cf) 버전정보

> node 버전: 16.13.0
> npm 버전: 8.1.4
> truffle 버전: 5.1.23
> solidity 버전: 0.5.16
> setting #programa 0.5.16


## 스마트 컨트랙트 빌드 및 베포

```
// - contarct deploy
// npx truffle deploy --network klaytn

// - re deploy
// npx truffle deploy --compile-all --reset --network klaytn

// 
> truffle migrate --compile-all --reset --network klaytn
```

## frontend 실행

> npm run dev


## 강좌 URL

> https://www.inflearn.com/course/%ED%81%B4%EB%A0%88%EC%9D%B4%ED%8A%BC


# Front Logic

```
[1] login
1.handleImport : read keystore file 
2.checkValidKeystore : validation logic
3.handlePassword : password input bind
4.handleLogin : decrypt wallet, 
5.integrateWallet : 
    - save in sessionStorage 
    - cav.klay.accounts.privateKeyToAccount
6. start : 
    - check in sessionStorage, login info

[2] deposit

1.deposit
2. callOwner : check owner
    - agContract.methods.owner().call();
3. deposit : 
    - agContract.methods.deposit().send();

[3] logout

1.removeWallet
    -   cav.klay.accounts.wallet.clear();
    -   sessionStorage.removeItem("walletInstance");

[4] klay 송금

1. submitAnswer

2. callContractBalance : 잔고 확인하기
    -   agContract.methods.getBalance().call();
3. receiveKlay : 클레이 보내기
    - agContract.methods
      .transfer(cav.utils.toPeb("0.1", "KLAY"))
      .send({
        from: walletInstance.address,
        gas: "250000",
      })


```