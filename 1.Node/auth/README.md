- [Topic : auth, session, redis, cookie, passport](#topic--auth-session-redis-cookie-passport)
- [1. Node.js -쿠키와 인증](#1-nodejs--쿠키와-인증)
  - [1~3](#13)
  - [3~5](#35)
  - [6. session cookies vs permanent cookies](#6-session-cookies-vs-permanent-cookies)
  - [7. secure, httponly](#7-secure-httponly)
  - [8 path & domain](#8-path--domain)
  - [실습 및 정리](#실습-및-정리)
    - [주석](#주석)
    - [코드](#코드)
- [Web4 - Express Session & Auth](#web4---express-session--auth)
  - [session-counter 구현 및 이론](#session-counter-구현-및-이론)
    - [이론](#이론)
    - [코드](#코드-1)
  - [secure 고려 요소](#secure-고려-요소)


# Topic : auth, session, redis, cookie, passport


--- 

# 1. Node.js -쿠키와 인증 

ref :
https://www.youtube.com/watch?v=i51xW3eh-T4&list=PLuHgQVnccGMDo8561VLWTZox8Zs3K7K_m

## 1~3

ref: https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies 


쿠키의 사용 목적 - 브라우저의 개인화   

    - 장바구니 상태 유지  
    - 로그인 인증 후 계속 유지   

쿠키 = HTTP 프로토콜에 포함된 기술

쿠키의 용도

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
'Set-Cookie':[`permanent=my-cookies;Max-Age=${60*60*24*30}`]
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

```js

1.yarn add express cookie-parser

쿠키파서는 쿠키를 쉽게 CRUD 할 수 있는 모듈.  

해당 모듈은 req.cookies 를 채운다.
  eg) console.log('Cookies: ', req.cookies)

또한 res 에서 쿠키를 설정한다.
  eg) res.cookie("my-cookie", "banana", { signed: false });

다음으로 쿠키를 지울 수 있다.
  eg) res.clearCookie("my-cookie");
  결과 : 응답 헤더  : 
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
ref : https://opentutorials.org/course/3400/21840


## session-counter 구현 및 이론

### 이론 

```

1.yarn add express-session session-file-store

세션아이디는, 쿠키에 포함되어 보내진다. 
connect.sid : s%3AZsNExJnlcYSduAloYUpvaUDZyNTU3fl0.H6Fqc9veTqNyGmtQJG1Kw%2BgDX%2Bd9tQF6Et4CijSceK8

eg)
    Cookie:
      my-cookie=banana; 
      connect.sid=s%3AZsNExJnlcYSduAloYUpvaUDZyNTU3fl0.H6Fqc9veTqNyGmtQJG1Kw%2BgDX%2Bd9tQF6Et4CijSceK8

세션 파일 스토어를 사용하면
ZsNExJnlcYSduAloYUpvaUDZyNTU3fl0.json 에 다음 정보가 포함된다. 

      {"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"__lastAccess":1655983955101,"num":16}


x. 세션 callback 함수  & 라이프 싸이클 

Session.save(callback) : 세션 인 ( 로그인 ) , 세션정보를 바로 저장한다.
  *req.session 객체에 값을 쓰면, 어차피 sid 발급 및 store에 save 된다.

Session.touch() : Updates the .maxAge property. 
Session.regenerate(callback) : 새 SID 및 세션 인스턴스가 req.session에서 초기화
Session.reload(callback) : Reloads the session data from the store

Session.destroy(callback) : 세션 아웃 ( 로그아웃 )

x. 세션 정보 
  
  req.session.id : 아이디 점보

x. 세션 쿠키 정보 

  var hour = 3600000
  req.session.cookie.expires = new Date(Date.now() + hour)
  req.session.cookie.maxAge = hour


x. 세션으로 로그인/로그아웃 구현

1.로그인
post - id,password 로그인 요청 
정보가 일치하면, 세션 발급 및 세션쿠키 전송하기 

2. 재검증
클라이언트는 세션쿠키를 전송  
req.session 에 정보가 채워져 있는지 확인 
없다면 다시 로그인으로 유도,
있다면 재검증 완료 , 세션객체에서 사용자 정보를 획득 

3. 세션 연장 

클라이언트가 세션 쿠키 전송
쿠키 시간 리프래시 
세션 객체(TTL)등 연장

4. 로그아웃
세션아이디를 획득 및 세션 객체 파괴 

Q. ? 로그인 안한 사용자에 대해서, 세션정보를 기록해두어야 하나?
- req.session 객체를 건드리지 않으면 된다. 

```

### 코드 
```js
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const PORT = 4000;
/*
Exampel) session counter 
*/
const bootstrap = async () => {
  const app = express();
  app.use(cookieParser());

  // 세션정보를 찾아, req.session을 추가해준다.
  app.use(
    session({
      secret: "dodo",
      resave: false, // if true, 세션값 같더라도 매번 저장 IO 발생(bad)
      saveUninitialized: false, // 세션이 필요하기 전까지는 세션을 구동하지 않는다.
      // if true, 세션이 필요없더라도, 빈 object객체로 세션을 처리한다.
      store: new FileStore(),
      // cookie: {
      //   secure: true,
      //   httpOnly: true,
      // },
    })
  );

  app.get("/", (req, res) => {
    console.log("session : ", req.session);

    if (!req?.session?.num) {
      req.session.num = 1;
    } else {
      req.session.num = req.session.num + 1;
      if (req.session.num >= 10) {
        req.session.fin = "ok";
        req.session.num = 1;
      }
    }
    res.send({ num: req.session.num });
  });

  app.listen(PORT, () => {
    console.log(`✨ server is running at http://localhost:${PORT}`);
  });
};

bootstrap();

```

## secure 고려 요소

1. https 에서 세션을 주고 받는 secure 옵션    

http로 세션 Id를 탈취당하지 않도록 

2. client에서 script를 실행시켜, 세션쿠키정보를 공격자로 보내지 않도록 

httpOnly 옵션으로, js를 통해 쿠키를 빼가지 못하도록 할 수 있다.  

```js
  // 세션정보를 찾아, req.session을 추가해준다.
  app.use(
    session({
      secret: "dodo",
      resave: false, // if true, 세션값 같더라도 매번 저장 IO 발생(bad)
      saveUninitialized: false, // 세션이 필요하기 전까지는 세션을 구동하지 않는다.
      // if true, 세션이 필요없더라도, 빈 object객체로 세션을 처리한다.
      store: new FileStore(),
      cookie: {
        secure: true,
        httpOnly: true,
      },
    })
  );

```



--- 


ref : JWT: Access Token & Refresh Token 인증 구현
                        
https://cotak.tistory.com/102?category=456808
