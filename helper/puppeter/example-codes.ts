// let srcsets: string[] = [];
// const imageList = await page.$("ul.product-detail-images__images");
//
// if (imageList !== null) {
//   const imageItems = await imageList.$$(
//     "li.product-detail-images__image-wrapper"
//   );
//
//   for (let image of imageItems) {
//     const picture = await image.$("picture.media-image");
//
//     if (picture !== null) {
//       const sources = await picture.$$("source");
//
//       const srcset =
//         (await sources[0].evaluate((source) =>
//           source.getAttribute("srcset")
//         )) || "null";
//
//       srcsets.push(srcset.split(" ")[4]);
//     }
//   }
// }

// await page.click("a[href='/products']"); // bunu bulur ve attributes a gore gitmeye calisir.
// await page.waitForSelector(".next-page"); // class icinde next-page olan elementin yuklenmesini bekler.
// const productsElement = await page.$$("main > div:nth-child(2) > div"); // $$ 2 tane varsa cogul 1 tane varsa tekil. $eval ise callback olusturur ve onun elementi ile ilgili typelari dondurur.

// await page.screenshot({ path: "./last-screen-shot.png" });
