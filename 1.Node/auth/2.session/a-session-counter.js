const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const PORT = 2000;
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
      // 세션은 내부적으로 쿠키를 사용하고, 이에 대한 옵션을 여기서 지정할 수 있다.
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


x. 세션 callback 함수  & 라이프 싸이클 

Session.save(callback) : 세션 인 ( 로그인 ) , 세션정보를 바로 저장한다.
  *req.session 객체에 값을 쓰면, 어차피 sid 발급 및 store에 save 된다.

Session.touch() : Updates the .maxAge property. 
Session.regenerate(callback) : 새 SID 및 세션 인스턴스가 req.session에서 초기화
Session.reload(callback) : Reloads the session data from the store

Session.destroy(callback) : 세션 아웃 ( 로그아웃 )

x. 세션 정보 
  
  req.session.id : 아이디 정보,
    우선 use.session을 타면, 누구나 발급받는 아이디  
    이 아이디를 바탕으로 세션정보를 store에 저장.  
    

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

*/
