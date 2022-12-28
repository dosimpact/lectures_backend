const express = require("express");

const queue = require("fastq").promise(worker, 1);
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function worker({ num }) {
  await sleep(2000);
  const result = num * 2;
  console.log("worker done,  result is", result, "remain job", queue.length);
  console.log("all jobs", queue.getQueue());
  return result;
}

const bootstrap = async () => {
  const app = express();

  const PORT = process.env.PORT || 5050;

  app.get("/", (req, res) => {
    return res.json({ ok: true });
  });

  app.get("/q", async (req, res) => {
    queue.push({ num: 52 });
    queue.push({ num: 152 });
    queue.push({ num: 252 });

    return res.json({ ok: true, job: 3 });
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
