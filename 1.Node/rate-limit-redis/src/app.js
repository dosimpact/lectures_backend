const express = require("express");
const { rateLimit } = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const { createClient } = require("redis");

require("dotenv").config({ path: ".env" });

const PORT = process.env.PORT || 4000;

const REDIS_URI =
  process.env.REDIS_URI || "redis://[id]:[password]@[host]:[port]";

const bootstrap = async () => {
  const app = express();

  /* redis connection  */
  const redisClient = createClient({ url: REDIS_URI });
  await redisClient.connect();
  await redisClient.set("ping", "pong");
  console.log(await redisClient.get("ping"));

  const limiter = rateLimit({
    windowMs: 10 * 1000, // 10sec
    max: 3, // default Limit per timeWindow
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    keyGenerator: (req, res) => {
      console.log("-->req.ip", req.ip);
      return req.ip;
    },
    handler: (req, res, next, options) => {
      return res.status(options.statusCode).send(options.message);
    },
  });

  app.get("/", limiter, (req, res) => {
    return res.json({ ok: true });
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
