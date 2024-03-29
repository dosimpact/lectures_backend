import express, { Request } from "express";
import { Queue, QueueScheduler } from "bullmq";
import { WorkerJob } from "./jobs";

const app = express();

console.log("[info] REDIS_HOST", process.env.REDIS_HOST);
console.log("[info] REDIS_PORT", process.env.REDIS_PORT);

const redisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 5059,
};

// QUEUE SETUP

const queues = {
  testQueue: new Queue("testQueue", {
    connection: redisOptions,
  }),
};

const schedulers = {
  testQueue: new QueueScheduler(queues.testQueue.name, {
    connection: redisOptions,
  }),
};

// UTILITIES

const addJobToTestQueue = (job: WorkerJob) =>
  queues.testQueue.add(job.type, job);

const addRetryableJobToTestQueue = (job: WorkerJob) =>
  queues.testQueue.add(job.type, job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000, // 2, 4, 8 sec
    },
  });

// EXPRESS SETUP

app.get("/hello-world", async (_req, res) => {
  await addJobToTestQueue({
    type: "PrintHelloWorld",
    data: { hello: "world" },
  });

  res.json({ queued: true });
});

app.get("/heavy-computing", async (req: Request<{ number: number }>, res) => {
  await addJobToTestQueue({
    type: "DoSomeHeavyComputing",
    data: { magicNumber: Number(req.params.number || 10) },
  });

  res.json({ queued: true });
});

app.get("/retryable", async (req, res) => {
  await addRetryableJobToTestQueue({
    type: "MayFailOrNot",
    data: { magicNumber: Math.floor(Math.random() * 1000) },
  });

  res.json({ queued: true });
});

// ARENA SETUP (DASHBOARD)

import Arena from "bull-arena";

const arena = Arena(
  {
    BullMQ: Queue,
    queues: [
      {
        type: "bullmq",
        name: queues.testQueue.name,
        hostId: "server",
        redis: redisOptions,
      },
    ],
  },
  { disableListen: true }
);

app.use("/arena", arena);

// BULL-BOARD SETUP (DASHGOARD)

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const serverAdapter = new ExpressAdapter();

const bullBoard = createBullBoard({
  queues: [new BullMQAdapter(queues.testQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/bull-board");

app.use("/bull-board", serverAdapter.getRouter());

// STARTUP

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
  console.log(`Bull arena is available at: http://localhost:${PORT}/arena`);
  console.log(
    `Bull-board is available at: http://localhost:${PORT}/bull-board`
  );
});
