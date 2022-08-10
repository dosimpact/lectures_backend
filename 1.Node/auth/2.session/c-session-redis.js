const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const redis = require("redis");
const FileStore = require("session-file-store")(session);
const RedisStore = require("connect-redis")(session);
// redis connect-redis
const PORT = 2000;

const CONFIG = {
  COOKIE_MAX_AGE_10_SEC: 1000 * 10, // 10sec
  COOKIE_MAX_AGE_20_SEC: 1000 * 20, // 20sec
  COOKIE_MAX_AGE_ONE_HOUR: 1000 * 60 * 60, // 1hour
  ACCESS_TOKEN: "ACCESS_TOKEN",
};

const bootstrap = async () => {
  const app = express();

  // redis-cli -h dosimpact.iptime.org -p 23000 -a dosimpact
  const client = redis.createClient({
    url: "redis://:dosimpact@221.153.254.18:23000 ",
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
      res.send({ loggedIn: true, num: req.session.num });
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

*/
