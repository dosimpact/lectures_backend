const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const PORT = 4000;

const bootstrap = async () => {
  const app = express();
  app.use(cookieParser());

  app.use(
    session({
      secret: "dodo",
      resave: false,
      saveUninitialized: false,
      store: new FileStore(),
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
/*

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


*/
