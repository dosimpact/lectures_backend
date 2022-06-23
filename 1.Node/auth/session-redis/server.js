// redis-cli -h 221.153.254.18 -p 27000 -a dosimpact

const express = require("express");
const redis = require("redis");
const session = require("express-session");

const app = express();

const RedisStore = require("connect-redis")(session);
const PORT = 3000;

const bootstrap = async () => {
  const client = redis.createClient({
    url: "redis://:dosimpact@221.153.254.18:27000",
  });
  client.on("connect", () => console.log("connected"));
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();

  app.use(
    session({
      secret: "no-enter-secret",
      saveUninitialized: false,
      resave: false,
      store: new RedisStore({ client, logErrors: true }),
    })
  );

  app.get("/", (req, res, next) => {
    console.log("hello");
    res.send({ url: req.url, key: req.session.key });
  });

  app.get("/session-login", (req, res, next) => {
    console.log("session-login");
    req.session.key = req.body.id;
    res.send("login");
  });

  app.listen(PORT, () => {
    console.log(`✨ server is running at http://localhost:${PORT}`);
  });
};

bootstrap();
