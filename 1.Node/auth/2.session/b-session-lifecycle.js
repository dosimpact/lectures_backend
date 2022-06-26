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
