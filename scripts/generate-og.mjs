// Generates public/og.png — a 1200×630 (1.91:1) cover-crop of the committed
// app screenshot (public/star-catalog-web.png), sized for summary_large_image
// social cards so scrapers never have to center-crop the in-page 1200×820 one.
//
//   node scripts/generate-og.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// Data URI so the screenshot loads regardless of the page's file:// origin.
const src = `data:image/png;base64,${readFileSync(
  join(root, "public", "star-catalog-web.png"),
).toString("base64")}`;
const out = join(root, "public", "og.png");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(`<!doctype html>
  <style>
    html, body { margin: 0; width: 1200px; height: 630px; background: #0a0e17; }
    img { width: 1200px; height: 630px; object-fit: cover; object-position: center top; display: block; }
  </style>
  <img src="${src}" alt="" />`);
await page.waitForLoadState("networkidle");
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out} (1200x630)`);
