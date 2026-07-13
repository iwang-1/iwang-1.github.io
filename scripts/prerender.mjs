// Post-build prerender — runs as the last step of `npm run build`.
//
// Serves the freshly built dist/ from an IN-PROCESS static server (no child
// processes: a spawned `vite preview` held pipes/undying children open on the
// CI runner and hung the Pages deploy indefinitely), renders each of the four
// pages in headless Chromium, and writes the rendered #root markup back into
// the corresponding dist/*.html shell. Result: every page is fully readable
// static HTML before (or without) the JS bundle — if the bundle is blocked or
// fails, the site degrades to a complete static page instead of a blank
// #root. Pairs with src/js-flag.ts: the `.js` class that hides .reveal content
// is only added when the bundle actually executes, so the prerendered markup
// is never hidden in that failure mode.
//
// At runtime React 18 `createRoot(...).render(...)` simply replaces the
// prerendered children with identical markup — no hydration mismatch risk.
import { createServer } from "node:http";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const PORT = 4317;
const ORIGIN = `http://localhost:${PORT}`;
const DIST = "dist";
const EMPTY_ROOT = '<div id="root"></div>';

// Watchdog: a prerender that runs past 2 minutes is hung — fail the build
// loudly instead of letting CI spin until the job timeout.
const watchdog = setTimeout(() => {
  console.error("PRERENDER FAILED: watchdog timeout (120s) — aborting");
  process.exit(1);
}, 120_000);
watchdog.unref?.(); // never keep the process alive for the watchdog alone

const PAGES = [
  { path: "/", file: "dist/index.html" },
  { path: "/experience/", file: "dist/experience/index.html" },
  { path: "/projects/", file: "dist/projects/index.html" },
  { path: "/404.html", file: "dist/404.html" },
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
};

const server = createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, ORIGIN).pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(DIST, path));
  if (!file.startsWith(normalize(DIST)) || !existsSync(file)) {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(existsSync(join(DIST, "404.html")) ? readFileSync(join(DIST, "404.html")) : "not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(PORT, resolve);
});

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
server.close();
if (failed) {
  console.error("prerender FAILED — see errors above");
  process.exit(1);
}
console.log("prerender OK — all four pages carry static #root content");
// Explicit exit: guarantees the build step ends even if a stray handle
// (browser transport, server socket) is still referenced by the event loop.
process.exit(0);
