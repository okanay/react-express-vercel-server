import {
  dummyUrl,
  headerOptions,
  languageOptions,
} from "../helper/puppeter/options";

import express from "express";
import chrome from "chrome-aws-lambda";

// @ts-ignore
import { puppeteer as puppeteerCore } from "puppeteer-core";
import puppeteer, {
  Browser,
  BrowserLaunchArgumentOptions,
  PuppeteerNode,
} from "puppeteer";

const router = express.Router();

let options;
let browser: Browser;

router.get("/", async (req, res) => {
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      ignoreHTTPErrors: true,
      headless: true,
    };
    browser = (await puppeteerCore.launch()) as Browser;
  } else {
    browser = await puppeteer.launch({ headless: true });
  }

  const srcsets: string[] = [];

  try {
    const page = await browser.newPage();
    await page.setCookie(languageOptions);
    await page.setExtraHTTPHeaders({ ...headerOptions });
    await page.setViewport({
      width: 1080,
      height: 768,
    });

    page.setDefaultNavigationTimeout(30 * 1000);
    await page.goto(dummyUrl);

    const imagesSourceElement = await page.$$(
      "main > article > div > div:nth-child(1) > div:nth-child(1) > section > div:nth-child(1) > ul > li"
    );

    for (let image of imagesSourceElement) {
      const picture = await image.$("li > button > div > div > picture");

      if (picture !== null) {
        const sources = await picture.$$("source");

        const srcset =
          (await sources[0].evaluate((source) =>
            source.getAttribute("srcset")
          )) || "null";

        srcsets.push(srcset.split(" ")[4]);
      }
    }
  } catch (e) {
    return res.json({ ok: false });
  }

  await browser?.close();
  return res.json({ ok: true, srcsets });
});

export default router;
