require("dotenv").config({ path: ".env" });

import express from "express";
import * as PuppeteerServier from "./service/puppeteer.service";

const PORT = process.env.PORT || 4000;

const bootstrap = async () => {
  const app = express();

  await PuppeteerServier.init({ headless: false });
  await PuppeteerServier.openNewPage();
  await PuppeteerServier.gotoLoginPage();
  await PuppeteerServier.login();
  // await PuppeteerServier.testWorking();
  await PuppeteerServier.makeChatPageV2();
  await PuppeteerServier.insertInfiniteEventV2();
  await PuppeteerServier.gptAPIV2({
    prompt: `400자 정도의 단락의 글을 찾아줘. 논리적인 글을 필사하면서 문장 생성능력을 기르기 좋은걸 알려줘.
    - 글 작가의 이름과 제목도 알려줘
    - 문단의 서술 패턴을 1줄로 표현해줘
    - 이번엔 다른 예시를 알려줘`,
  });
  await PuppeteerServier.gptAPIV2({
    prompt: `400자 정도의 단락의 글을 찾아줘. 논리적인 글을 필사하면서 문장 생성능력을 기르기 좋은걸 알려줘.
    - 글 작가의 이름과 제목도 알려줘
    - 문단의 서술 패턴을 1줄로 표현해줘
    - 이번엔 다른 예시를 알려줘`,
  });
  // const res1 = await PuppeteerServier.gptAPI({ prompt: "docker란?" });
  // console.log(res1.innerText);

  // const res2 = await PuppeteerServier.gptAPI({ prompt: "docker network 란?" });
  // console.log(res2.innerText);

  // await PuppeteerServier.testWorking();

  app.get("/", (req, res) => {
    return res.json({ ok: true });
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
