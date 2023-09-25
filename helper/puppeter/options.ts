import { Page, Protocol } from "puppeteer";
import puppeteer from "puppeteer";

export default puppeteer;

export const headerOptions = {
  "user-agent": "AWS Apple M1 Macbook Pro",
  "upgrade-insecure-requests": "1",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "en-US,en;q=0.9,en;q=0.8",
};

export const languageOptions: Protocol.Network.CookieParam = {
  name: "storepath",
  value: "us%2Fen",
  domain: ".zara.com",
  path: "/",
  httpOnly: false,
  priority: "Medium",
};

export const getProductId = (link: string): string => {
  let productId = "";
  try {
    const parts = link.split("/");
    const lastPart = parts[parts.length - 1];

    const potentialsProductsIds = lastPart.split("-p");
    const potential = potentialsProductsIds[potentialsProductsIds.length - 1];

    const potentialParts = potential.split(".html");
    productId = potentialParts[0];
  } catch (error) {
    console.log(error);
    productId = "fail";
  }
  return productId;
};

export const getUrlLink = (productId: string): string | boolean => {
  if (productId !== "fail") {
    return `https://www.zara.com/uk/us/-p${productId}.html?v1=281585859&v2=2297854`;
  } else return false;
};

export const dummyUrl =
  "https://www.zara.com/us/en/extra-heavyweight-t-shirt-p04231550.html";
