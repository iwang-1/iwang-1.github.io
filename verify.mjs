// Serves the built dist/ with `vite preview` and drives it in headless Chromium
// at desktop and phone viewports: asserts the hero + every section heading is
// visible, no console errors, no premature repo links while the launch flags
// are off, and captures the README screenshots.
//
//   npm run build && npm run verify
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const PORT = 4173;
const URL = process.env.VERIFY_URL ?? `http://localhost:${PORT}/`;

const EXPECTED_HEADINGS = [
  "The Star Catalog System",
  "star-spectral-classifier — ML that shows its work",
  "Open source — merged upstream",
  "Quantum NLP — UMD FIRE",
  "Contact",
];

mkdirSync("docs", { recursive: true });

// --- serve dist/ ------------------------------------------------------------
const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: ["ignore", "pipe", "pipe"],
});
const kill = () => server.kill("SIGTERM");
process.on("exit", kill);

// wait for the preview server to answer
let up = false;
for (let i = 0; i < 50 && !up; i++) {
  await new Promise((r) => setTimeout(r, 200));
  try {
    const res = await fetch(URL);
    up = res.ok;
  } catch {
    /* not up yet */
  }
}
if (!up) {
  console.error("VERIFY FAILED: vite preview never came up on " + URL);
  process.exit(1);
}

const browser = await chromium.launch();
const problems = [];

async function checkViewport({ width, height, shot }) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(URL, { waitUntil: "networkidle" });

  const tag = `${width}x${height}`;

  // hero
  const h1 = (await page.locator("h1").textContent())?.trim();
  if (h1 !== "Ivan Wang") problems.push(`${tag}: h1 is ${JSON.stringify(h1)}`);
  if (!(await page.locator("h1").isVisible())) problems.push(`${tag}: h1 not visible`);

  // every section heading present + visible
  for (const heading of EXPECTED_HEADINGS) {
    const loc = page.locator("h2", { hasText: heading }).first();
    if ((await loc.count()) === 0 || !(await loc.isVisible()))
      problems.push(`${tag}: heading not visible: ${heading}`);
  }

  // the star field renders its committed 150 stars
  const stars = await page.locator(".starfield circle").count();
  if (stars !== 150) problems.push(`${tag}: expected 150 star-field dots, got ${stars}`);

  // above-the-fold guarantee: both ledger rows + the FEATURED kicker visible
  // without scrolling (checked via bounding boxes against the viewport).
  const ledgerRows = page.locator("#experience .ledger-row");
  if ((await ledgerRows.count()) !== 2) {
    problems.push(`${tag}: expected 2 experience/education rows`);
  } else {
    for (let i = 0; i < 2; i++) {
      const box = await ledgerRows.nth(i).boundingBox();
      if (!box || box.y + box.height > height)
        problems.push(`${tag}: ledger row ${i} below the fold (y=${box?.y})`);
    }
  }
  const kickerBox = await page
    .locator("#star-system .kicker")
    .first()
    .boundingBox();
  if (!kickerBox || kickerBox.y > height)
    problems.push(`${tag}: FEATURED kicker below the fold (y=${kickerBox?.y})`);

  // launch-flag acceptance: with repoLinksEnabled=false there must be no links
  // into github.com/iwang-1/<repo> (the bare profile link is expected).
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  const premature = hrefs.filter((h) => /github\.com\/iwang-1\//.test(h ?? ""));
  if (premature.length)
    problems.push(`${tag}: premature repo links while flags are off: ${premature.join(", ")}`);
  // ...and with showLiveDemo=false, no live-demo URL either.
  const demo = hrefs.filter((h) => (h ?? "").includes("iwang-1.github.io/star-catalog-web"));
  if (demo.length) problems.push(`${tag}: premature live-demo link: ${demo.join(", ")}`);

  // exactly one h1
  const h1Count = await page.locator("h1").count();
  if (h1Count !== 1) problems.push(`${tag}: expected exactly one h1, got ${h1Count}`);

  await page.screenshot({ path: shot, fullPage: false });
  console.log(`${tag}: h1 ok, ${stars} stars, screenshot -> ${shot}`);

  if (errors.length) problems.push(`${tag}: console errors: ${errors.join("; ")}`);
  await page.close();
}

await checkViewport({ width: 1366, height: 900, shot: "docs/screenshot.png" });
await checkViewport({ width: 390, height: 844, shot: "docs/screenshot-mobile.png" });

await browser.close();
kill();

if (problems.length) {
  console.error("VERIFY FAILED:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log("VERIFY OK");
