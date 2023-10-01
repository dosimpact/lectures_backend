require("dotenv").config({ path: ".env" });

import express from "express";
import * as PuppeteerServier from "./service/puppeteer.service";
import fs from "fs/promises";

const PORT = process.env.PORT || 4000;

const promptExample = `
아래의 """으로 구분된 [지시사항]을 읽고 JSON 출력형식으로 출력할꺼야.
[JSON출력형식]에 맞춰서 응답해줘.

[JSON출력형식]
"""
{
  content: [content],
  author: [author],
  name: [name],
  syntaxLogic: [syntaxLogic]
} 
"""

[지시사항]
"""
0. 출력은 한글로 변역.
1. [content] : 300자 정도의 단락의 글을 찾아줘. 논리적인 글을 필사하면서 문장 생성능력을 기르기 좋은걸 알려줘. 이는 매번 요청마다 다른 예시를 알려줘.
2. [author] : 작가의 이름
3. [name] : 글 제목
4. [syntaxLogic] : 문단의 서술 패턴을 1줄로 표현해줘
"""
`;

const promptExample2 = `
아래의 """으로 구분된 지시사항을 읽고 [출력형식]에 맞춰서 응답해줘.

[출력형식]
{
  content: [content],
  author: [author],
  name: [name],
  syntaxLogic: [syntaxLogic]
} 

지시사항
"""
0. 출력은 한글로 변역.
1. [content] : 300자 정도의 단락의 글을 찾아줘. 논리적인 글을 필사하면서 문장 생성능력을 기르기 좋은걸 알려줘. 이는 매번 요청마다 다른 예시를 알려줘.
2. [author] : 작가의 이름
3. [name] : 글 제목
4. [syntaxLogic] : 문단의 서술 패턴을 1줄로 표현해줘
"""
`;

const promptExample3 = `
다음 지시사항을 따라서 결과물만 출력할 것 
- 논리적인 글을 필사하면서 문장 생성능력을 기르기 좋은걸 알려줘.
- 300자 정도의 단락의 글
`;

const againPromptExample = `예시를 하나 더 알려줘`;

const bootstrap = async () => {
  const app = express();

  await PuppeteerServier.init({ headless: "new" });
  await PuppeteerServier.openNewPage();
  await PuppeteerServier.gotoLoginPage();
  await PuppeteerServier.login();
  // await PuppeteerServier.testWorking();
  await PuppeteerServier.makeChatPageV2();
  await PuppeteerServier.insertInfiniteEventV2({ useGPT4: false });

  let cnt = 0;
  while (true) {
    const { innerText, innerHTML } = await PuppeteerServier.gptAPIV2({
      prompt: cnt === 0 ? promptExample2 : againPromptExample,
    });
    try {
      console.log("-->innerText", innerText);
      const parsedInnerText = String(innerText).endsWith("}")
        ? innerText
        : innerText + "}";
      const parsed = JSON.stringify(JSON.parse(parsedInnerText), null, "");
      console.log("-->parsed", parsed);
      fs.appendFile("result.log", parsed + "\n");
    } catch (error) {}
    cnt += 1;
    if (cnt >= 1_000) break;
  }

  app.get("/", (req, res) => {
    return res.json({ ok: true });
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
