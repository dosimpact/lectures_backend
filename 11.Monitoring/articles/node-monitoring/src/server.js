const express = require("express");
const client = require("prom-client");

let register = new client.Registry();

const headsCount = new client.Counter({
  name: "heads_count",
  help: "Number of heads",
});

const tailsCount = new client.Counter({
  name: "tails_count",
  help: "Number of tails",
});

const flipCount = new client.Counter({
  name: "flip_count",
  help: "Number of flip",
});

register.registerMetric(headsCount);
register.registerMetric(tailsCount);
register.registerMetric(flipCount);
register.setDefaultLabels({ app: "coin-api" });
client.collectDefaultMetrics({ register });

const PORT = process.env.PORT || 5050;

const bootstrap = async () => {
  const app = express();

  app.get("/", (req, res) => {
    res.json({ ok: true });
  });

  app.get("/simulate/coin", (req, res) => {
    const times = Number(req.query?.times) || 10;
    flipCount.inc(times);
    let heads = 0;
    let tails = 0;
    for (let i = 0; i < times; i++) {
      let r = Math.random();
      r < 0.5 ? heads++ : tails++;
    }
    headsCount.inc(heads);
    tailsCount.inc(tails);
    res.json({ heads, tails });
  });

  app.get("/metrics", async (req, res) => {
    res.setHeader("Content-type", register.contentType);
    res.end(await register.metrics());
  });

  app.listen(PORT, () =>
    console.log(`server is running http://localhost:${PORT}`)
  );
};
bootstrap();
