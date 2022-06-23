- [auth, session, redis, cookie, passport](#auth-session-redis-cookie-passport)
- [Node.js-쿠키와 인증](#nodejs-쿠키와-인증)
  - [1~3](#13)
  - [3~5](#35)
  - [6. session cookies vs permanent cookies](#6-session-cookies-vs-permanent-cookies)
  - [7. secure, httponly](#7-secure-httponly)
  - [8 path & domain](#8-path--domain)
  - [실습 및 정리](#실습-및-정리)
    - [주석](#주석)
    - [코드](#코드)
- [Web4 - Express Session & Auth](#web4---express-session--auth)


# auth, session, redis, cookie, passport



# Node.js-쿠키와 인증 

https://www.youtube.com/watch?v=i51xW3eh-T4&list=PLuHgQVnccGMDo8561VLWTZox8Zs3K7K_m

## 1~3

브라우저의 개인화   

    - 장바구니 상태 유지  
    - 로그인 인증 후 계속 유지   

ref: https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies 

쿠키 = HTTP 프로토콜에 포함된 기술

용도

1. 인증 - session management. 서버에 저장해야 할 로그인, 장바구니, 게임 스코어 등의 정보 관리

2. 개인화 - Personalization. 사용자 선호, 테마 등의 세팅. 

  eg) MDN 사이트는 에서는, 언어설정에 따라 웹의 리다이렉션을 다르게 보내준다.   
    - 쿠기값에 따라서, 웹서버가 언어별 route를 응답해준다.   

3. 추적  - Tracking.  사용자 행동을 기록하고 분석하는 용도


* 브라우저단 데이터저장은, modern storage APIs 이용할 것.  
* 쿠키는 매 요청마다 같이 보내지기 때문이다.  
* Modern APIs의 종류인 웹 스토리지 API (localStorage와 sessionStorage) 와 IndexedDB를 사용하면 됩니다.



## 3~5

쿠키의 읽기 / 쓰기  

- express 에서 , 쿠키의 읽기 쓰기 with cookie-parser. 
- eg) 1.cookie. 


## 6. session cookies vs permanent cookies

session cookies   

  - 일반 쿠키이다.  
  - 하나의 웹의 탭에서 살아 있음  

permanent cookies

  - 껐다켜도 살아 있음  
  - Max-Age : 현재시점기준으로, 얼만큼 살지 
  - Expires : 언제 쿠키를 죽일지 지정  


```js

'Set-Cookie':[
    `permanent=my-cookies;Max-Age=${60*60*24*30}`
]
```

## 7. secure, httponly


## 8 path & domain

특정 디렉토리에서만, 쿠키를 살리고 싶을 때, path를 지정

  브라우저의 하위 도메인에서도 쿠키가 유효하도록 설정
  eg)
  1. Domain 설정 - eg) "Set-Cookie":"Domain=Domain-value;Domain=o2.org"
  test.o2.org, dev.o2.org 등 서브도메인이 test, dev 모두 쿠키가 살아 있다.


## 실습 및 정리

### 주석

```
1.yarn add express cookie-parser

해당 모듈은 req.cookies 를 채운다.
  eg) console.log('Cookies: ', req.cookies)

또한 res 에서 쿠키를 설정한다.
  eg) res.cookie("my-cookie", "banana", { signed: false });

다음으로 쿠키를 지울 수 있다.
  eg) res.clearCookie("my-cookie");
  응답 헤더  : 
    Set-Cookie: my-cookie=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT

cookieParser.JSONCookie(str)
cookieParser.JSONCookies(cookies)
cookieParser.signedCookie(str, secret)
cookieParser.signedCookies(cookies, secret)
---
옵션 : signed: true, // 서명된 쿠키 , secret 필요
    쿠키의 value를 암호화
  > app.use(cookieParser("secret"));

옵션 : maxAge 
  permanent cookie 만드는 옵션
  지금 지간으로부터 TTL르 시정

옵션 :  expires
  permanent cookie 만드는 옵션
  절대적은 시간값을 지정

옵션 : secure
  https 를 사용해야만, 쿠키가 나간다.

옵션 : httpOnly  
  브라우저의 document.cookie 등의 JS를 통해, 쿠키를 볼 수 없도록 하는 옵션

옵션 : path
  브라우저의 path의 하위에서만 쿠키를 살리고 싶을 때, 


옵션 : domain
  브라우저의 하위 도메인에서도 쿠키가 유효하도록 설정
  eg)
  1. Domain 설정 - eg) "Set-Cookie":"Domain=Domain-value;Domain=o2.org"
  test.o2.org, dev.o2.org 등 서브도메인이 test, dev 모두 쿠키가 살아 있다.

```

### 코드 

```js

const express = require("express");
const cookieParser = require("cookie-parser");
const PORT = 4000;

// 쿠키 옵션 설정
const cookieConfig = {
  httpOnly: true,
  maxAge: 1000000,
  signed: true, // 서명된 쿠키 , secret 필요
};

const bootstrap = async () => {
  const app = express();
  app.use(cookieParser());

  app.get("/", (req, res) => {
    console.log("Cookies: ", req.cookies);
    res.cookie("my-cookie", "banana", { signed: false });
    res.send(req.cookies);
  });

  app.get("/permanent", (req, res) => {
    console.log("permanent Cookies: ", req.cookies);
    res.cookie("non-permanent", "short");
    res.cookie("permanent", "longlong", {
      maxAge: 60 * 60 * 24,
      expires: new Date(Date.now() + 900000),
    });
    res.send(req.cookies);
  });

  app.get("/secure", (req, res) => {
    res.cookie("non-secure-info", "non-secure-value", {});
    res.cookie("secure-info", "secure-value", { secure: true });
    res.send(req.cookies);
  });

  app.get("/httponly", (req, res) => {
    res.cookie("non-httponly-info", "non-httponly-value", {});
    res.cookie("httponly-info", "httponly-value", { httpOnly: true });
    res.send(req.cookies);
  });

  app.get("/path", (req, res) => {
    res.cookie("non-path-info", "non-path-value", {});
    res.cookie("path-info", "path-value", { path: "/path" });
    res.send(req.cookies);
  });

  app.get("/delete", (req, res) => {
    res.clearCookie("my-cookie");
    res.send(req.cookies);
  });

  app.listen(PORT, () => {
    console.log(`✨ server is running at http://localhost:${PORT}`);
  });
};

bootstrap();
```

---


# Web4 - Express Session & Auth

ref : https://www.youtube.com/watch?v=IWFMEwmcp44&list=PLuHgQVnccGMCHjWIDStjaZA2ZR-jwq-WU&index=2


--- 


ref : JWT: Access Token & Refresh Token 인증 구현
                        
https://cotak.tistory.com/102?category=456808
