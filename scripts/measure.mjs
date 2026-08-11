// Measurement harness (not a gate).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const ROOT = new URL("../dist/", import.meta.url).pathname;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const candidates = url.endsWith("/") ? [url + "index.html"] : [url, url + "/index.html"];
  for (const c of candidates) {
    const file = join(ROOT, normalize(c).replace(/^(\.\.[/\\])+/, ""));
    try {
      if (!(await stat(file)).isFile()) continue;
      const body = await readFile(file);
      res.writeHead(200, {
        "content-type": TYPES[extname(file)] ?? "application/octet-stream",
        "content-length": body.length,
      });
      res.end(body);
      return;
    } catch {
      /* try next */
    }
  }
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found");
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const ORIGIN = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();

const PAGES = ["/", "/experience/", "/projects/", "/404.html"];
console.log(`\nserved ${ROOT} at ${ORIGIN}`);

for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const bytes = new Map(); // resource type -> bytes
  const files = [];
  page.on("response", async (res) => {
    if (!res.url().startsWith(ORIGIN)) return;
    try {
      const buf = await res.body();
      const type = extname(new URL(res.url()).pathname) || ".html";
      bytes.set(type, (bytes.get(type) ?? 0) + buf.length);
      files.push([new URL(res.url()).pathname, buf.length]);
    } catch {
      /* ignore */
    }
  });
  await page.goto(ORIGIN + path, { waitUntil: "networkidle" });
  // LCP: settle, then read the last entry the browser reported.
  const lcp = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let last = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) last = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => resolve(last), 900);
      }),
  );
  const total = [...bytes.values()].reduce((a, b) => a + b, 0);
  const fontBytes = bytes.get(".woff2") ?? 0;
  console.log(
    `\n${path}\n  LCP ${lcp.toFixed(1)}ms · total ${total} B` +
      `\n  ` +
      [...bytes.entries()].sort((a, b) => b[1] - a[1]).map(([t, b]) => `${t} ${b}`).join(" · ") +
      (fontBytes ? `\n  fonts: ${fontBytes} B across ${files.filter((f) => f[0].endsWith(".woff2")).length} file(s)` : "\n  fonts: 0 B"),
  );
  for (const [f, b] of files.filter((f) => f[0].endsWith(".woff2"))) console.log(`    ${f}  ${b} B`);
  await page.close();
}

// ---- contrast matrix, read from the LIVE computed tokens ---------------------
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(ORIGIN + "/", { waitUntil: "networkidle" });
const matrix = await page.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  if (!cs.getPropertyValue("--surface-page").trim()) return null;
  const read = (n) => cs.getPropertyValue(n).trim();
  const hex = (s) => {
    if (s.startsWith("#")) {
      const h = s.slice(1);
      const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
      return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
    }
    return s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
  };
  const lin = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const lum = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  const ratio = (a, b) => {
    const [l1, l2] = [lum(hex(a)), lum(hex(b))];
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const surfaces = ["--surface-page", "--surface-figure", "--surface-inset"];
  const inks = ["--ink", "--ink-accent", "--ink-data", "--ink-secondary"];
  const out = { luminance: {}, ratios: [], raw: {} };
  for (const n of [...surfaces, ...inks]) out.raw[n] = read(n);
  for (const s of surfaces) out.luminance[s] = lum(hex(read(s)));
  for (const i of inks)
    out.ratios.push([i, ...surfaces.map((s) => ratio(read(i), read(s)))]);
  return out;
});
if (!matrix) {
  console.log("\n(semantic tokens not present yet — skipping the contrast matrix)");
} else {
  console.log("\n--- token values -------------------------------------------------");
  for (const [k, v] of Object.entries(matrix.raw)) console.log(`  ${k.padEnd(18)} ${v}`);
  console.log("\n--- surface luminance --------------------------------------------");
  for (const [k, v] of Object.entries(matrix.luminance)) console.log(`  ${k.padEnd(18)} ${v.toFixed(4)}`);
  console.log("\n--- contrast (ink x surface) ------------------------------------");
  console.log("  token                page    figure  inset");
  for (const [ink, ...r] of matrix.ratios)
    console.log(`  ${ink.padEnd(20)} ${r.map((x) => x.toFixed(2).padEnd(7)).join(" ")}`);
}
await page.close();

await browser.close();
server.close();
