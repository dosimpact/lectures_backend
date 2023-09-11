require("dotenv").config({ path: ".env" });

import express from "express";
import * as PuppeteerServier from "./service/puppeteer.service";

const PORT = process.env.PORT || 4000;

const bootstrap = async () => {
  const app = express();

  // await PuppeteerServier.gptAPIForLogin();
  await PuppeteerServier.init({ headless: "new" });
  await PuppeteerServier.openNewPage();
  await PuppeteerServier.gotoLoginPage();
  await PuppeteerServier.login();
  const res1 = await PuppeteerServier.gptAPI({ prompt: "docker란?" });
  console.log(res1.innerText);

  const res2 = await PuppeteerServier.gptAPI({ prompt: "docker network 란?" });
  console.log(res2.innerText);

  // await PuppeteerServier.testWorking();

  app.get("/", (req, res) => {
    return res.json({ ok: true });
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
