import express from "express";
const router = express.Router();
import puppeteer, { Browser, PuppeteerLaunchOptions } from "puppeteer";
import chrome from "chrome-aws-lambda";
import {
  dummyUrl,
  headerOptions,
  languageOptions,
} from "../helper/puppeter/options";

export async function BrowserMaker() {
  let options: PuppeteerLaunchOptions;
  let browser: Browser;

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    let core = require("puppeteer-core");
    let chrome = require("chrome-aws-lambda");
    options = {
      headless: true,
      ignoreHTTPSErrors: true,
      // executablePath: await chrome.executablePath,
      args: [
        ...chrome.args,
        "--hide-scrollbars",
        "--disable-web-security",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-extensions",
        "--dns-prefetch-disable",
        "--disable-dev-shm-usage",
        "--ignore-certificate-errors",
        "--allow-running-insecure-content",
        "--enable-features=NetworkService",
      ],
    };
    browser = await core.launch(options);
  } else {
    browser = await puppeteer.launch({ headless: "new" });
  }

  return browser as Browser;
}

router.get("/", async (req, res) => {
  const browser = await BrowserMaker();
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
