const express = require("express");
const cookieParser = require("cookie-parser");
const PORT = 2000;

// 쿠키 옵션 설정
const cookieConfig = {
  httpOnly: true,
  maxAge: 1000000,
  expires: null,
  signed: true, // 서명된 쿠키 , secret 필요,
  secure: null,
  httpOnly: null,
  path: null,
  domin: null,
};

const bootstrap = async () => {
  const app = express();
  app.use(cookieParser());

  // eg) cookie setter
  app.get("/", (req, res) => {
    console.log("Cookies: ", req.cookies);
    res.cookie("my-cookie", "banana", { signed: false });
    res.send(req.cookies);
  });

  // eg) cookie, 기간설정
  // non-permanent 5초뒤 사라짐
  app.get("/permanent", (req, res) => {
    console.log("permanent Cookies: ", req.cookies);
    res.cookie("non-permanent", "short", {
      // maxAge: 1000 * 5,
      expires: new Date(Date.now() + 1000 * 5),
    });
    res.cookie("permanent", "longlong", {
      maxAge: 60 * 60 * 24,
      expires: new Date(Date.now() + 900000),
    });
    res.send(req.cookies);
  });

  // eg) 시큐어 옵션
  // https에서만 secure-info 쿠키가 보일것이다.
  app.get("/secure", (req, res) => {
    res.cookie("non-secure-key", "non-secure-value", {});
    res.cookie("secure-key", "secure-value", { secure: true });
    res.send(req.cookies);
  });

  // eg) httponly 옵션
  // js로 쿠키 변조 접근 불가
  app.get("/httponly", (req, res) => {
    res.cookie("non-httponly-key", "non-httponly-value", {});
    res.cookie("httponly-key", "httponly-value", { httpOnly: true });
    res.send(req.cookies);
  });

  // eg) 하위 경로
  // o2.org           --- non-exist
  // o2.org/path      --- ok
  // o2.org/path/123  --- ok

  app.get("/path/is-live", (req, res) => {
    res.send(req.cookies);
  });

  app.get("/path", (req, res) => {
    res.cookie("non-path-key", "non-path-value", {});
    res.cookie("path-key", "path-value", { path: "/path" });
    res.send(req.cookies);
  });

  // eg) 도메인
  // 테스트는 불가 (도메인구매로 해볼 순 있음)
  // www.dodo.xyz   --- provider
  // m.dodo.xyz     --- consumer
  app.get("/doin", (req, res) => {
    res.cookie("domain-key", "domain-value", { domain: "m" });
    res.send(req.cookies);
  });

  // eg) 쿠키 삭제
  app.get("/delete", (req, res) => {
    res.clearCookie("my-cookie");
    res.send(req.cookies);
  });

  // eg) 쿠키 카운터
  // + refresh
  app.get("/count", (req, res) => {
    const current = Number(req.cookies["count"]) || 0;
    res.cookie("count", `${current + 1}`, { maxAge: 1000 * 5 });
    res.send(req.cookies);
  });

  app.listen(PORT, () => {
    console.log(`✨ server is running at http://localhost:${PORT}`);
  });
};

bootstrap();
/*

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

*/
