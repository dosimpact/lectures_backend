const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");

const PORT = 4000;
/*
Exampel) session counter 
*/
const bootstrap = async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

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

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "pwd",
      },
      function (username, password, done) {
        console.log("LocalStrategy", username, password);
      }
    )
  );

  app.post(
    "/auth/login_process",
    (req, res, next) => {
      console.log("login_process");
      next();
    },
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
    })
  );

  app.get("/auth/logout", function (request, response) {
    request.session.destroy(function (err) {
      response.redirect("/");
    });
  });

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
