// Serves the built dist/ with `vite preview` and drives it in headless Chromium
// at desktop and phone viewports: asserts the hero + every section heading is
// visible, no console errors, repo/demo links match the launch flags (absent
// while a flag is off, present once it is on), and captures the README
// screenshots (docs/screenshot*.png — commit them when they change).
//
//   npm run build && npm run verify
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const PORT = 4173;
const URL = process.env.VERIFY_URL ?? `http://localhost:${PORT}/`;

// Launch flags, read straight from the source of truth so these assertions
// flip automatically with src/content.ts. (join/fileURLToPath because the
// VERIFY_URL constant above shadows the global URL constructor.)
const here = dirname(fileURLToPath(import.meta.url));
const contentSrc = readFileSync(join(here, "src", "content.ts"), "utf8");
const repoLinksEnabled = /repoLinksEnabled:\s*true\b/.test(contentSrc);
const showLiveDemo = /showLiveDemo:\s*true\b/.test(contentSrc);

const EXPECTED_HEADINGS = [
  "The Star Catalog System",
  "star-spectral-classifier — ML that shows its work",
  "More ML & NLP work",
  "Open source — upstream work",
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

  // above-the-fold guarantee: the EXPERIENCE kicker and the first role's title
  // (the AWS internship) are visible without scrolling — the who/what a
  // recruiter must see in the first screen.
  const expKicker = await page.locator("#experience .kicker").first().boundingBox();
  if (!expKicker || expKicker.y > height)
    problems.push(`${tag}: EXPERIENCE kicker below the fold (y=${expKicker?.y})`);
  const firstRole = page.locator("#experience .role .role-title").first();
  if ((await firstRole.count()) === 0) {
    problems.push(`${tag}: no experience roles rendered`);
  } else {
    const box = await firstRole.boundingBox();
    if (!box || box.y + box.height > height)
      problems.push(`${tag}: first role title below the fold (y=${box?.y})`);
  }

  // launch-flag acceptance: repo links into github.com/iwang-1/<repo> must be
  // absent while repoLinksEnabled=false and present once it flips true (the
  // bare profile link is expected either way).
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  const repoLinks = hrefs.filter((h) => /github\.com\/iwang-1\//.test(h ?? ""));
  if (!repoLinksEnabled && repoLinks.length)
    problems.push(`${tag}: premature repo links while flags are off: ${repoLinks.join(", ")}`);
  if (repoLinksEnabled && repoLinks.length === 0)
    problems.push(`${tag}: repoLinksEnabled=true but no repo links rendered`);
  // ...same contract for the live-demo URL.
  const demo = hrefs.filter((h) => (h ?? "").includes("iwang-1.github.io/star-catalog-web"));
  if (!showLiveDemo && demo.length)
    problems.push(`${tag}: premature live-demo link: ${demo.join(", ")}`);
  if (showLiveDemo && demo.length === 0)
    problems.push(`${tag}: showLiveDemo=true but no live-demo link rendered`);

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
