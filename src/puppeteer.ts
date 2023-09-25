import express from "express";
const router = express.Router();
import {
  dummyUrl,
  headerOptions,
  languageOptions,
} from "../helper/puppeter/options";

import puppeteer, { Browser, PuppeteerLaunchOptions } from "puppeteer";

router.get("/", async (req, res) => {
  const browser = await puppeteer.launch();
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
