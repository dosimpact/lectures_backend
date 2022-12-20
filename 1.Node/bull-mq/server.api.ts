import express from "express";
import { getRandomInt } from "./utils";

const app = express();

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// EXPRESS SETUP

app.get("/", async (_req, res) => {
  res.json({ ok: true });
});

app.get("/num", async (_req, res) => {
  await sleep(getRandomInt(500, 1500));
  res.json({ num: getRandomInt(1, 100) });
});

// STARTUP

const PORT = process.env.PORT || 5058;

app.listen(PORT, () => {
  console.log(`Example api app listening on port ${PORT}`);
});
