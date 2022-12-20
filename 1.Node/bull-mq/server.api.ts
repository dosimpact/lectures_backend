import express from "express";
import { getRandomInt } from "./utils";
import rateLimit, { MemoryStore } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

const bootstrap = async () => {
  const client = createClient({
    url: "redis://localhost:5059",
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

  const app = express();

  // EXPRESS SETUP

  let inboundCnt = 0;

  app.get("/", async (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/num", limiter, async (_req, res) => {
    console.log("[info] inbound : ", ++inboundCnt);
    res.json({ num: getRandomInt(1, 100) });
  });

  // STARTUP

  const PORT = process.env.PORT || 5058;

  app.listen(PORT, () => {
    console.log(`Example api app listening on port ${PORT}`);
  });
};
bootstrap();

// redis-cli -h host -p 5059
