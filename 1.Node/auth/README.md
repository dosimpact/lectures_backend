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
  - [eg-1) session-counter 구현 및 정리](#eg-1-session-counter-구현-및-정리)
    - [정리](#정리)
    - [코드](#코드-1)
  - [eg-2) b-session-lifecycle 세션 + CURD](#eg-2-b-session-lifecycle-세션--curd)
    - [정리](#정리-1)
    - [코드](#코드-2)
  - [eg-3) c-session-redis 세션 + 레디스 저장소](#eg-3-c-session-redis-세션--레디스-저장소)
    - [정리](#정리-2)
    - [코드](#코드-3)
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


## eg-1) session-counter 구현 및 정리

### 정리

```js

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

express-session 미들웨어는 , 쿠키에 전송된 sid(sesion-id)를 읽고 서버측 session store를 불러서 req.session 을 만들어 준다.  
또한 req.session 이 변화되면, 이를 store에 저장하도록 한다.  


x. 세션 callback 함수  & 라이프 싸이클 

Session.save(callback) : 세션 인 ( 로그인 ) , 세션정보를 바로 저장한다.
  *req.session 객체에 값을 쓰면, 어차피 sid 발급 및 store에 save 된다.

Session.touch() : Updates the .maxAge property. 
Session.regenerate(callback) : 새 SID 및 세션 인스턴스가 req.session에서 초기화
Session.reload(callback) : Reloads the session data from the store

Session.destroy(callback) : 세션 아웃 ( 로그아웃 )

x. 세션 정보 
  
  req.session.id : 아이디 정보

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

## eg-2) b-session-lifecycle 세션 + CURD

### 정리

```js
/*

eg) sid 식별자는, 세션아이디, 세션쿠키의 값, 데이터 저장시 키값으로 사용
    uqyoqVZOvzzqb31aRkF0jd4NV-tEg7lW // -->req.session.id
s%3AuqyoqVZOvzzqb31aRkF0jd4NV-tEg7lW.ukibxI5rE5M1OWUESFnam8LWKsc3R%2FkdXWOobpNy7UQ // -->cookie.connect.sid
uqyoqVZOvzzqb31aRkF0jd4NV-tEg7lW.json // --> sessions FileStore

eg) loggout > session.destory 으로 세션 Store의 sid 객체는 없어져도, 
사용자가 계속 쿠키를 가지고 있는 경우도 있다. 


? access-token 을 가지고 , login 여부 확인 API 호출 
성공하면, session 객체 생성 - 
refresh는 재접속시, session이 있다면 - access-token 연장 
그렇다면, session 객체는 언제 만료되는가 ? 혹은 영구인가?


x. 세션의 만료와 쿠키의 만료
case 1, 쿠키가 먼저 만료된 경우 
- 서버에 세션은 살아 있고, 세션쿠키가없는 브라우저는 로그인 실패
- 브라우저단에서 유통기한이 지난 쿠키는 알아서 제거.


case 2, 세션이 먼저 만료된 경우
- 브라우저가 가진 쿠키는, 유통기한이 지남 - 다시 세션을 생성
- 세션미들웨어는, 유통기한이 지난 쿠키를 제거해준다.  

*/

```

### 코드

```js
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const PORT = 4000;

const CONFIG = {
  COOKIE_MAX_AGE_10_SEC: 1000 * 10, // 10sec
  COOKIE_MAX_AGE_20_SEC: 1000 * 20, // 20sec
  COOKIE_MAX_AGE_ONE_HOUR: 1000 * 60 * 60, // 1hour
  ACCESS_TOKEN: "ACCESS_TOKEN",
};

const bootstrap = async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    session({
      secret: "dodo",
      resave: false,
      saveUninitialized: false,
      store: new FileStore({
        ttl: 10, // 10sec
      }),
      cookie: {
        maxAge: 1000 * 5,
      },
    })
  );

  // 3. session revalidate
  app.get("/", (req, res) => {
    if (req.session["access-token"]) {
      res.send({ loggedIn: true });
    } else {
      res.send({ loggedIn: false });
    }
  });
  // 1. session in
  // cookie maxAge 1 hour
  app.get("/login", (req, res) => {
    req.session["access-token"] = CONFIG.ACCESS_TOKEN; // later, for auth server
    res.send({ ok: true });
  });

  // 2. session out
  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.send({ ok: true });
  });

  // error : dont touch direct sid cookie option
  // 4. session cookie , refresh
  // cookie maxAge 1 hour
  //   app.get("/refresh", (req, res) => {
  //     if (req.cookies["connect.sid"]) {
  //       res.cookie("connect.sid", req.session.cookie, {
  //         maxAge: CONFIG.COOKIE_MAX_AGE_ONE_HOUR,
  //       });
  //       res.send({ ok: true });
  //     } else {
  //       res.send({ ok: false });
  //     }
  //   });

  app.listen(PORT, () => {
    console.log(`✨ server is running at http://localhost:${PORT}`);
  });
};
bootstrap();


```

## eg-3) c-session-redis 세션 + 레디스 저장소

### 정리

```js

case1 : redis ttl 과 cookie maxAge 둘 다 설정한 경우
    - redis 의 ttl은 cookie 의 maxAge와 일치 된다.
    - (redis 에 ttl을 설정해도 오버라이드 된다.)

case2 : redis의 ttl 만 설정한 경우 

    - cookie 의 만료시간은 없다.
    - redis의 ttl은 카운트다운이 되고 있다. 
    - 사용자가 재요청시 redis의 ttl은 refresh 된다.  
    - 하지만 ttl이 만료되면, 사용자는 유통기한이 지난 쿠키로 계속 요청하게 된다. (로그아웃됨)

case3 : cookie maxAge만 설정한 경우
    - case 1 과 동일 
    
```
### 코드 


```js
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const redis = require("redis");
const FileStore = require("session-file-store")(session);
const RedisStore = require("connect-redis")(session);

const PORT = 4000;

const CONFIG = {
  COOKIE_MAX_AGE_10_SEC: 1000 * 10, // 10sec
  COOKIE_MAX_AGE_20_SEC: 1000 * 20, // 20sec
  COOKIE_MAX_AGE_ONE_HOUR: 1000 * 60 * 60, // 1hour
  ACCESS_TOKEN: "ACCESS_TOKEN",
};

const bootstrap = async () => {
  const app = express();

  // redis-cli -h 221.153.254.18 -p 27000 -a dosimpact
  const client = redis.createClient({
    url: "redis://:dosimpact@221.153.254.18:27000",
    legacyMode: true,
  });
  client.on("connect", () => console.log("✔️ Redis Session connected"));
  await client.connect().catch(console.error);

  app.use(cookieParser());
  app.use(
    session({
      secret: "dodo",
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({ client, logErrors: true, ttl: 30 }),
      cookie: {
        // maxAge: 1000 * 60,
      },
    })
  );

  // 3. session revalidate
  app.get("/", (req, res) => {
    if (req.session["access-token"]) {
      res.send({ loggedIn: true });
    } else {
      res.send({ loggedIn: false });
    }
  });
  // 1. session in
  // cookie maxAge 1 hour
  app.get("/login", (req, res) => {
    req.session["access-token"] = CONFIG.ACCESS_TOKEN; // later, for auth server
    res.send({ ok: true });
  });

  // 2. session out
  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.send({ ok: true });
  });

  // error : dont touch direct sid cookie option
  // 4. session cookie , refresh
  // cookie maxAge 1 hour
  //   app.get("/refresh", (req, res) => {
  //     if (req.cookies["connect.sid"]) {
  //       res.cookie("connect.sid", req.session.cookie, {
  //         maxAge: CONFIG.COOKIE_MAX_AGE_ONE_HOUR,
  //       });
  //       res.send({ ok: true });
  //     } else {
  //       res.send({ ok: false });
  //     }
  //   });

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
