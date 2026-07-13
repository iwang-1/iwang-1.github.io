// Post-build prerender — runs as the last step of `npm run build`.
//
// Serves the freshly built dist/ with `vite preview`, renders each of the
// four pages in headless Chromium, and writes the rendered #root markup back
// into the corresponding dist/*.html shell. Result: every page is fully
// readable static HTML before (or without) the JS bundle — if the bundle is
// blocked or fails, the site degrades to a complete static page instead of a
// blank #root. Pairs with src/js-flag.ts: the `.js` class that hides .reveal
// content is only added when the bundle actually executes, so the
// prerendered markup is never hidden in that failure mode.
//
// At runtime React 18 `createRoot(...).render(...)` simply replaces the
// prerendered children with identical markup — no hydration mismatch risk.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const PORT = 4317;
const ORIGIN = `http://localhost:${PORT}`;
const EMPTY_ROOT = '<div id="root"></div>';

const PAGES = [
  { path: "/", file: "dist/index.html" },
  { path: "/experience/", file: "dist/experience/index.html" },
  { path: "/projects/", file: "dist/projects/index.html" },
  { path: "/404.html", file: "dist/404.html" },
];

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: ["ignore", "pipe", "pipe"],
});
const kill = () => server.kill("SIGTERM");
process.on("exit", kill);

let up = false;
for (let i = 0; i < 50 && !up; i++) {
  await new Promise((r) => setTimeout(r, 200));
  try {
    up = (await fetch(ORIGIN + "/")).ok;
  } catch {
    /* not up yet */
  }
}
if (!up) {
  console.error("PRERENDER FAILED: vite preview never came up on " + ORIGIN);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

let failed = false;
for (const spec of PAGES) {
  await page.goto(ORIGIN + spec.path, { waitUntil: "networkidle" });
  const inner = await page.evaluate(() => document.getElementById("root")?.innerHTML ?? "");
  if (!inner.includes("</main>") || !inner.includes("</footer>")) {
    console.error(`PRERENDER FAILED: ${spec.path} rendered no main/footer content`);
    failed = true;
    continue;
  }
  const shell = readFileSync(spec.file, "utf8");
  if (!shell.includes(EMPTY_ROOT)) {
    console.error(`PRERENDER FAILED: ${spec.file} has no empty ${EMPTY_ROOT} shell`);
    failed = true;
    continue;
  }
  writeFileSync(spec.file, shell.replace(EMPTY_ROOT, `<div id="root">${inner}</div>`));
  console.log(`prerendered ${spec.file} (${inner.length} bytes of static markup)`);
}

await browser.close();
kill();
if (failed) process.exit(1);
console.log("prerender OK — all four pages carry static #root content");
