import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AnonymizeUAPlugin from "puppeteer-extra-plugin-anonymize-ua";

// stealth plugin 활성화
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());

const {
  GPT_SERVER_EMAIL,
  GPT_SERVER_PASSWORD,
  GPT_SERVER_LOGIN_PAGE,
  GPT_SERVER_CHAT_PAGE,
} = process.env;

let browser = null;
let page = null;
let chatPage = null;
let currentStatus = null;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const submitButtonStatus = {
  IDLE: "IDLE",
  SUBMIT_READY: "SUBMIT_READY",
  FETCHING: "FETCHING",
  ERROR: "ERROR",
  UNKNOWN: "UNKNOWN",
};

const checkPoints = {
  emailSelector: "input[name=email]",
  nextButtnText: "계속하기",
  promptSelector: "textarea[placeholder^=뤼튼에게]",
  downButtonText: "아래로",
};

export const login = async () => {
  // login process
  try {
    const emailSelector = checkPoints.emailSelector;
    await page.waitForSelector(emailSelector, { timeout: 3_000 });
    const el = await page.$(emailSelector);
    await page.type(emailSelector, GPT_SERVER_EMAIL);

    const nextButtnText = checkPoints.nextButtnText;
    const elementsWithText = await page.$$eval(
      "button",
      (elements, { nextButtnText }) => {
        const nextBtn = elements.filter((element) => {
          return element.innerText.includes(nextButtnText);
        });
        if (nextBtn[0]) nextBtn[0].click();
      },
      { nextButtnText }
    );
  } catch (error) {
    console.error("login - email fail");
    console.error(error);
  }

  try {
    const passwordSelector = "input[type=password]";
    await page.waitForSelector(passwordSelector, { timeout: 3_000 });
    const el = await page.$(passwordSelector);
    await page.type(passwordSelector, GPT_SERVER_PASSWORD);

    const nextButtnText = "계속하기";
    const elementsWithText = await page.$$eval(
      "button",
      (elements, { nextButtnText }) => {
        const nextBtn = elements.filter((element) => {
          return element.innerText.includes(nextButtnText);
        });
        if (nextBtn[0]) nextBtn[0].click();
      },
      { nextButtnText }
    );
  } catch (error) {
    console.error("login - password fail");
    console.error(error);
  }
};

export const gotoLoginPage = async () => {
  // await page.setViewport({ width: 1080, height: 1200 });
  await page.goto(GPT_SERVER_LOGIN_PAGE);
};

export const gptAPI = async ({ prompt = "" }) => {
  // remove modal if exist
  try {
    await page.waitForSelector("#__modal", { timeout: 3_000 });
    const el = await page.$("#__modal");
    if (el) await el.evaluate((el) => el.remove());
  } catch (error) {
    console.warn("modal - remove fail");
    console.warn(error);
  }

  // check down arrow
  try {
    await page.$$eval("button", (elements) => {
      const button = Array.from(document.querySelectorAll("*")).filter(
        (e) =>
          String(e.tagName).toLowerCase() === "button" &&
          e.innerText.includes("아래로")
      );
      if (button) button.click();
    });
  } catch (error) {
    console.warn("check down arrow fail");
    console.warn(error);
  }

  // type prompt
  try {
    const promptSelector = checkPoints.promptSelector;
    await page.waitForSelector(promptSelector, { timeout: 3_000 });
    const el = await page.$(promptSelector);
    console.log("typping...", prompt);
    await page.type(promptSelector, prompt, { delay: 50 });
    console.log("-->promptSelector", el);
    console.log("enter done", el?.target?.value);
    await el.focus();
    await el.press("Enter");
  } catch (error) {
    console.error(error);
  }
  await sleep(1);
  // wait element
  console.log("-->wait element");

  try {
    const checkIsDone = async () => {
      const isDone = await page.$$eval("button", (elements) => {
        const buttons = Array.from(document.querySelectorAll("*")).filter(
          (e) =>
            String(e.tagName).toLowerCase() === "button" &&
            (e.innerText.includes("아래로") ||
              e.innerText.includes("다시 생성"))
        );
        console.log("-->buttons", buttons);
        if (buttons?.length >= 1) return true;
        return false;
      });
      return isDone;
    };

    const checkIsDoneTenTime = () =>
      new Promise(async (res, rej) => {
        for (let i = 0; i <= 60; i++) {
          console.log("check done...");
          const responseGPT = await page.$$eval("swiper-slide", (elements) => {
            const length = elements?.length;
            const innerText = elements[length - 1]?.innerText;
            const innerHTML = elements[length - 1]?.innerHTML;
            return { length, innerHTML, innerText };
          });
          console.log("-->", String(responseGPT?.innerText).slice(-20));
          if (await checkIsDone()) return res(true);
          await sleep(1000);
        }
        return rej(false);
      });

    await checkIsDoneTenTime();
  } catch (error) {
    console.error(error);
  }
  // get
  await sleep(1);
  await page.waitForSelector("swiper-slide");
  const responseGPT = await page.$$eval("swiper-slide", (elements) => {
    const length = elements?.length;
    const innerText = elements[length - 1].innerText;
    const innerHTML = elements[length - 1].innerHTML;
    return { length, innerHTML, innerText };
  });
  console.log("-->length", responseGPT?.length);
  console.log("-->innerHTML", responseGPT?.innerHTML);
  console.log("-->innerText", responseGPT?.innerText);

  return {
    length: responseGPT?.length,
    innerHTML: responseGPT?.innerHTML,
    innerText: responseGPT?.innerText,
  };
};

export const init = async ({ headless }) => {
  try {
    const _browser = await puppeteer.launch({ headless });
    browser = _browser;
  } catch (err) {
    console.error(err);
  }
};

export const openNewPage = async () => {
  const _page = await browser.newPage();
  page = _page;
};

export const makeChatPageV2 = async () => {
  const _chatPage = await browser.newPage();
  await _chatPage.goto(GPT_SERVER_CHAT_PAGE);
  chatPage = _chatPage;
  console.log("[info] done makeChatPageV2", await _chatPage.title());
};

export const insertInfiniteEventV2 = async ({ useGPT4 = false }) => {
  // intervalEvent : Insert page down
  await chatPage.evaluate(() => {
    setInterval(() => {
      document
        .querySelector("#ScrollContainer")
        ?.scrollTo(0, document.querySelector("#ScrollContainer").scrollHeight);
    }, 1000);
  });

  // intervalEvent : modal removoal
  await chatPage.evaluate(() => {
    setInterval(() => {
      const modal = document.querySelector("#__modal");
      if (modal) modal.remove();
    }, 500);
  });
  // let currentStatus = null;
  // internvalEvent : pageButton sync
  setInterval(async () => {
    const status = await chatPage.evaluate(
      ({ submitButtonStatus }) => {
        const checkStatus = () => {
          try {
            // const btns = document
            // .querySelector("#ScrollContainer + div")
            // .querySelectorAll("button");

            const btns = Array.from(document.querySelectorAll("button")).filter(
              (el) => el.querySelectorAll("svg").length === 1
            );

            const submitButtonDisabled = btns[btns?.length - 1].disabled;
            const submitButtonWidth = btns[btns?.length - 1]
              .querySelector("svg")
              .getAttribute("width");

            // state - idle
            const idleCond1 = submitButtonDisabled === true;
            const idleCond2 = submitButtonWidth === "20";
            if (idleCond1 && idleCond2) return submitButtonStatus.IDLE;

            // state - type complete
            // btns[btns.length - 1].querySelector("svg").getAttribute("width") === '20'
            const typeCompleteCond1 = submitButtonDisabled === false;
            const typeCompleteCond2 = submitButtonWidth === "20";
            if (typeCompleteCond1 && typeCompleteCond2)
              return submitButtonStatus.SUBMIT_READY;

            // state - type complete
            const fetchingCond1 = submitButtonDisabled === true;
            const fetchingCond2 = submitButtonWidth === "16";
            if (fetchingCond1 && fetchingCond2)
              return submitButtonStatus.FETCHING;

            return submitButtonStatus.UNKNOWN;
          } catch (error) {
            return submitButtonStatus.ERROR;
          }
        };

        const status = checkStatus();
        // console.log("-->status", status);
        return status;
      },
      { submitButtonStatus }
    );
    currentStatus = status;
  }, [500]);

  //
  // internvalEvent : remove button in swiper-slide
  setInterval(async () => {
    const status = await chatPage.evaluate(() => {
      Array.from(document.querySelectorAll("swiper-slide")).map((el) => {
        Array.from(el?.querySelectorAll("button")).map((bt) => bt?.remove());
      });
      currentStatus = status;
    }, [500]);
  });

  // onetime Event : selector GTP4
  if (useGPT4) {
    await chatPage.evaluate(() => {
      document.querySelectorAll("button[tabindex]")?.[1]?.click();
    });
  }
  const el = chatPage.$(`div[tabindex="0"]`);
  console.log("[info] selected GPT : ", el?.innerText);

  console.log("[info] done insertInfiniteEventV2");
};

export const gptAPIV2 = async ({ prompt }) => {
  // wait IDE status
  const typePromptWhenIdleStatus = async ({ prompt }) => {
    const promptSelector = checkPoints.promptSelector;
    await sleep(3000);
    let cnt = 0;
    while (true) {
      console.log(
        "[info] typePromptWhenIdleStatus > wait currentStatus === IDLE",
        currentStatus
      );
      if (currentStatus === submitButtonStatus.IDLE) break;
      if (currentStatus === submitButtonStatus.SUBMIT_READY) {
        await chatPage.evaluate(() => {
          document.querySelectorAll("textarea")[0].value = "";
        });
        await chatPage.type(promptSelector, " ");
        const promptInput = await chatPage.$(promptSelector);
        await promptInput.press("Backspace");
      }
      await sleep(1000);
      cnt += 1;
      if (cnt >= 30)
        throw Error(
          "[Error][timeout][typePromptWhenIdleStatus] IDLE status is not income"
        );
    }
    console.log(
      "[info] typePromptWhenIdleStatus currentStatus is ",
      currentStatus
    );
    try {
      await chatPage.waitForSelector(promptSelector, { timeout: 3_000 });
      const promptInput = await chatPage.$(promptSelector);

      console.log("[info] prompt ", prompt);
      await chatPage.evaluate(
        ({ prompt }) => {
          document.querySelectorAll("textarea")[0].value = prompt;
        },
        { prompt }
      );
      await chatPage.type(promptSelector, " ");

      await promptInput.focus();
      await promptInput.press("Enter");
      console.log("[info] prompt Enter ");
    } catch (error) {
      console.error(error);
    }
    await sleep(500);
  };

  await typePromptWhenIdleStatus({
    prompt,
  });

  const waitForGPTResponse = async () => {
    await sleep(3000);
    let cnt = 0;
    let prevLen = 0;
    while (true) {
      const responseGPT = await chatPage.$$eval("swiper-slide", (elements) => {
        const length = elements?.length;
        const lastEl = elements[length - 1];
        const innerText = lastEl?.innerText;
        const innerHTML = lastEl?.innerHTML;
        return { length, innerHTML, innerText };
      });
      const currentLen = String(responseGPT?.innerText).length;

      console.log(
        `[info] waitForGPTResponse status(${currentStatus}) / len(${prevLen}vs${currentLen}) lastMsg(${String(
          responseGPT?.innerText
        ).slice(-5)})`
      );

      if (currentStatus === submitButtonStatus.IDLE && prevLen === currentLen)
        return true;
      prevLen = currentLen;
      cnt += 1;
      if (cnt >= 100) return false;
      await sleep(2000);
    }
  };
  // awit for done
  await waitForGPTResponse();

  // get last gpt data
  await sleep(2000);
  await chatPage.waitForSelector("swiper-slide");
  const responseGPT = await chatPage.$$eval("swiper-slide", (elements) => {
    const length = elements?.length;
    const innerText = elements[length - 1].innerText;
    const innerHTML = elements[length - 1].innerHTML;
    return { length, innerHTML, innerText };
  });
  console.log("[info] get last gpt response > length", responseGPT?.length);
  console.log(
    "[info] get last gpt response > innerText",
    responseGPT?.innerText
  );

  return {
    length: responseGPT?.length,
    innerHTML: responseGPT?.innerHTML,
    innerText: responseGPT?.innerText,
  };
};

export const testWorking = async () => {
  // console.log("-->GPT_SERVER_EMAIL", GPT_SERVER_EMAIL);
  // console.log("-->GPT_SERVER_PASSWORD", GPT_SERVER_PASSWORD);
  // console.log("-->GPT_SERVER_LOGIN_PAGE", GPT_SERVER_LOGIN_PAGE);
  // console.log("-->GPT_SERVER_CHAT_PAGE", GPT_SERVER_CHAT_PAGE);

  // const browser = await puppeteer.launch({ headless: false });

  // // # step login page
  // const loginPage = await browser.newPage();
  // await loginPage.goto(GPT_SERVER_LOGIN_PAGE);

  // // intervalEvent : modal removoal
  // await loginPage.evaluate(() => {
  //   setInterval(() => {
  //     const modal = document.querySelector("#__modal");
  //     if (modal) modal.remove();
  //   }, 500);
  // });

  // try {
  //   const emailSelector = checkPoints.emailSelector;
  //   await loginPage.waitForSelector(emailSelector, { timeout: 10_000 });
  //   const el = await loginPage.$(emailSelector);
  //   await loginPage.type(emailSelector, GPT_SERVER_EMAIL);
  //   console.log("[info] email typing", GPT_SERVER_EMAIL);
  //   const nextButtnText = checkPoints.nextButtnText;
  //   await loginPage.$$eval(
  //     "button",
  //     (elements, { nextButtnText }) => {
  //       const nextBtn = elements.filter((element) => {
  //         return element.innerText.includes(nextButtnText);
  //       });
  //       if (nextBtn[0]) nextBtn[0].click();
  //     },
  //     { nextButtnText }
  //   );
  // } catch (error) {
  //   console.error("login - email fail");
  //   console.error(error);
  // }

  // console.log("[info] email typing done");

  // try {
  //   const passwordSelector = "input[type=password]";
  //   await loginPage.waitForSelector(passwordSelector, { timeout: 3_000 });
  //   const el = await loginPage.$(passwordSelector);
  //   await loginPage.type(passwordSelector, GPT_SERVER_PASSWORD);

  //   const nextButtnText = "계속하기";
  //   const elementsWithText = await loginPage.$$eval(
  //     "button",
  //     (elements, { nextButtnText }) => {
  //       const nextBtn = elements.filter((element) => {
  //         return element.innerText.includes(nextButtnText);
  //       });
  //       if (nextBtn[0]) nextBtn[0].click();
  //     },
  //     { nextButtnText }
  //   );
  // } catch (error) {
  //   console.error("login - password fail");
  //   console.error(error);
  // }

  // awit login success
  // try {
  //   const isPageOver = await new Promise(async (res, rej) => {
  //     let cnt = 0;
  //     while (true) {
  //       const pathname = await page.evaluate(() => {
  //         return document.location.pathname;
  //       });
  //       if (pathname === "/") res(true);
  //       cnt += 1;
  //       await sleep(1000);
  //       if (cnt >= 10) rej(false);
  //     }
  //   });
  //   console.log("[info] login success and isPageOver");
  // } catch (error) {
  //   console.error("[error] PageOver fail");
  // }

  // # step chat page
  const chatPage = await browser.newPage();
  await chatPage.goto(GPT_SERVER_CHAT_PAGE);
  console.log("[info] chatPage title", await chatPage.title());

  // intervalEvent : Insert page down
  await chatPage.evaluate(() => {
    setInterval(() => {
      document
        .querySelector("#ScrollContainer")
        ?.scrollTo(0, document.querySelector("#ScrollContainer").scrollHeight);
    }, 1000);
  });

  // intervalEvent : modal removoal
  await chatPage.evaluate(() => {
    setInterval(() => {
      const modal = document.querySelector("#__modal");
      if (modal) modal.remove();
    }, 500);
  });
  let currentStatus = null;
  // internvalEvent : pageButton sync
  setInterval(async () => {
    const status = await chatPage.evaluate(
      ({ submitButtonStatus }) => {
        const checkStatus = () => {
          try {
            const btns = document
              .querySelector("#ScrollContainer + div")
              .querySelectorAll("button");

            const submitButtonDisabled = btns[btns.length - 1].disabled;
            const submitButtonWidth = btns[btns.length - 1]
              .querySelector("svg")
              .getAttribute("width");

            // state - idle
            const idleCond1 = submitButtonDisabled === true;
            const idleCond2 = submitButtonWidth === "20";
            if (idleCond1 && idleCond2) return submitButtonStatus.IDLE;

            // state - type complete
            // btns[btns.length - 1].querySelector("svg").getAttribute("width") === '20'
            const typeCompleteCond1 = submitButtonDisabled === false;
            const typeCompleteCond2 = submitButtonWidth === "20";
            if (typeCompleteCond1 && typeCompleteCond2)
              return submitButtonStatus.SUBMIT_READY;

            // state - type complete
            const fetchingCond1 = submitButtonDisabled === true;
            const fetchingCond2 = submitButtonWidth === "16";
            if (fetchingCond1 && fetchingCond2)
              return submitButtonStatus.FETCHING;

            return submitButtonStatus.UNKNOWN;
          } catch (error) {
            return submitButtonStatus.ERROR;
          }
        };

        const status = checkStatus();
        // console.log("-->status", status);
        return status;
      },
      { submitButtonStatus }
    );
    console.log("-->status", status);
    currentStatus = status;
  }, [500]);

  // wait IDE status

  const typePromptWhenIdleStatus = async ({ prompt }) => {
    // prompt = String(prompt).replace("\n", "");
    // prompt = String(prompt).replace("\t", "");
    // prompt = String(prompt).replace("\b", "");

    await sleep(3000);
    let cnt = 0;
    while (true) {
      console.log(
        "[info] typePromptWhenIdleStatus > currentStatus",
        currentStatus
      );
      if (currentStatus === submitButtonStatus.IDLE) break;
      await sleep(500);
      cnt += 1;
      if (cnt >= 10) throw Error("[Error] typePromptWhenIdleStatus");
    }
    console.log("[info] typePromptWhenIdleStatus currentStatus", currentStatus);
    try {
      const promptSelector = checkPoints.promptSelector;
      await chatPage.waitForSelector(promptSelector, { timeout: 3_000 });
      const promptInput = await chatPage.$(promptSelector);

      console.log("typping...", prompt);
      await chatPage.evaluate(
        ({ prompt }) => {
          document.querySelectorAll("textarea")[0].value = prompt;
        },
        { prompt }
      );
      await chatPage.type(promptSelector, " ");

      await promptInput.focus();
      await promptInput.press("Enter");
      console.log("enter done");
    } catch (error) {
      console.error(error);
    }
    await sleep(500);
  };

  await typePromptWhenIdleStatus({
    prompt: `400자 정도의 단락의 글을 찾아줘. 논리적인 글을 필사하면서 문장 생성능력을 기르기 좋은걸 알려줘.
  - 글 작가의 이름과 제목도 알려줘
  - 문단의 서술 패턴을 1줄로 표현해줘
  - 이번엔 다른 예시를 알려줘`,
  });

  const waitForGPTResponse = async () => {
    await sleep(3000);
    let cnt = 0;
    let prevLen = 0;
    while (true) {
      console.log("check done...", currentStatus);
      const responseGPT = await chatPage.$$eval("swiper-slide", (elements) => {
        const length = elements?.length;
        const innerText = elements[length - 1]?.innerText;
        const innerHTML = elements[length - 1]?.innerHTML;
        return { length, innerHTML, innerText };
      });
      const currentLen = String(responseGPT?.innerText).length;
      console.log(`prev Len${prevLen} vs currentLen${currentLen}`);
      console.log("-->", String(responseGPT?.innerText).slice(-20));

      if (currentStatus === submitButtonStatus.IDLE && prevLen === currentLen)
        return true;
      prevLen = currentLen;
      cnt += 1;
      if (cnt >= 100) return false;
      await sleep(1000);
    }
  };
  // awit for done
  await waitForGPTResponse();

  // get last gpt data
  await sleep(1);
  await chatPage.waitForSelector("swiper-slide");
  const responseGPT = await chatPage.$$eval("swiper-slide", (elements) => {
    const length = elements?.length;
    const innerText = elements[length - 1].innerText;
    const innerHTML = elements[length - 1].innerHTML;
    return { length, innerHTML, innerText };
  });
  console.log("-->length", responseGPT?.length);
  // console.log("-->innerHTML", responseGPT?.innerHTML);
  console.log("-->innerText", responseGPT?.innerText);

  return {
    length: responseGPT?.length,
    innerHTML: responseGPT?.innerHTML,
    innerText: responseGPT?.innerText,
  };
};
