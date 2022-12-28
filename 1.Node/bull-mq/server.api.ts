import express from "express";
import { getRandomInt } from "./utils";
import rateLimit, { MemoryStore } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";
import Bottleneck from "bottleneck";
import AsyncRateLimiter from "async-ratelimiter";
import Redis from "ioredis";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const bootstrap = async () => {
  const client = createClient({
    url: "redis://localhost:5059", // redis-cli -h host -p 5059
  });
  await client.connect();

  const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 sec
    max: 3, // Limit each IP to 3 requests per `window` (here, per 10 sec)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    keyGenerator: (request, response) => {
      console.log(`[info] request.ip ${request.ip}`);
      return request.ip;
    },
    store: new RedisStore({
      sendCommand: (...args: string[]) => client.sendCommand(args),
    }),
  });

  const asyncRateLimiter = new AsyncRateLimiter({
    duration: 3000,
    max: 3,
    db: new Redis({ port: 5059 }),
  });

  const app = express();

  // EXPRESS SETUP

  let inboundCnt = 1;

  app.get("/", async (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/num", limiter, async (_req, res) => {
    console.log("[info] inbound : ", inboundCnt++);
    setTimeout(() => {
      console.log("[info] setTimeout : ", inboundCnt);
    }, 1000);
    res.json({ num: getRandomInt(1, 100) });
  });

  app.get("/num-2", async (_req, res) => {
    console.log("[info] inbound : ", inboundCnt++);
    const { remaining, reset, total } = await asyncRateLimiter.get({ id: "1" });
    console.log("[info] remaining,reset,total", remaining, reset, total);
    if (remaining === 0) {
      return res.json({ fail: true, remaining, reset, total });
    }
    /*
      total: max value.
      remaining: number of calls left in current duration without decreasing current get.
      reset: time since epoch in seconds that the rate limiting period will end (or already ended).
    */
    return res.json({ num: getRandomInt(1, 100), remaining, reset, total });
  });

  // STARTUP
  const PORT = process.env.PORT || 5058;

  app.listen(PORT, () => {
    console.log(`Example api app listening on port ${PORT}`);
  });
};
bootstrap();
