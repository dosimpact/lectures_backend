import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AnonymizeUAPlugin from "puppeteer-extra-plugin-anonymize-ua";

// stealth plugin 활성화
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());

const { GPT_SERVER_EMAIL, GPT_SERVER_PASSWORD, GPT_SERVER_LOGIN_PAGE } =
  process.env;

let browser = null;
let page = null;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

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
            const innerText = elements[length - 1].innerText;
            const innerHTML = elements[length - 1].innerHTML;
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

export const testWorking = async () => {
  // Navigate the page to a URL
  await page.goto("https://developer.chrome.com/");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Type into search box
  await page.type(".search-box__input", "automate");

  // Wait and click on first result
  const searchResultSelector = ".search-box__link";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(
    "#main-content > div > div > div > div:nth-child(1) > h1 > p"
  );
  const fullTitle = await textSelector?.evaluate((el) => el.textContent);

  // Print the full title
  console.log('The title of this blog post is "%s".', fullTitle);
};
