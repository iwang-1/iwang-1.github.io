// Generates public/og.png — the 1200x630 summary_large_image card.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "og.png");

// Live tokens tokens.css became two-layered with double-shot (2026-08-04): the semantic roles point at raw
// values through `var()`, and the outgoing world's names are a migration shim pointing at the semantic roles.
const tokensCss = readFileSync(join(root, "src", "styles", "tokens.css"), "utf8");
function rawToken(name) {
  const m = tokensCss.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`token --${name} not found in src/styles/tokens.css`);
  return m[1].trim();
}
function token(name, seen = new Set()) {
  if (seen.has(name)) throw new Error(`token --${name} is part of a var() cycle`);
  seen.add(name);
  const value = rawToken(name);
  const ref = value.match(/^var\(\s*--([\w-]+)\s*\)$/);
  return ref ? token(ref[1], seen) : value;
}
const T = {
  // Named against the semantic roles, which is what this world calls them. The legacy aliases still
  // resolve, but nothing new should be written against them (see the migration-shim note in tokens.css).
  ground: token("surface-page"),
  plate: token("surface-figure"),
  grid: token("rule-soft"),
  axis: token("rule"),
  ink: token("ink"),
  ink2: token("ink-secondary"),
  ink3: token("ink-secondary"),
  series1: token("ink-data"),
  series2: token("ink-accent"),
  series3: token("ink-data"),
  display: token("font-display"),
  body: token("font-body"),
  mono: token("font-mono"),
};
// Every colour must be a literal a standalone SVG can paint.
for (const [name, value] of Object.entries(T)) {
  if (/\bvar\(/.test(value)) throw new Error(`token ${name} still holds an unresolved var(): ${value}`);
}

// The miniature figure Committed measurements (lodestone/benchmarks/raw/bench_50k_128d.txt), the same
// series the homepage figure draws.
const HNSW = [
  { qps: 47335, recall: 0.8996 },
  { qps: 31845, recall: 0.9759 },
  { qps: 20946, recall: 0.9964 },
  { qps: 13514, recall: 1.0 },
  { qps: 8898, recall: 1.0 },
];
const IVFPQ = [
  { qps: 9797, recall: 0.485 },
  { qps: 6128, recall: 0.9409 },
  { qps: 4110, recall: 0.9748 },
  { qps: 2305, recall: 0.9747 },
  { qps: 1229, recall: 0.9747 },
];
const KNEE = HNSW[1];

const W = 448;
const H = 336;
const PAD = { left: 54, right: 14, top: 26, bottom: 62 };
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;
const X_MIN = 1000;
const X_MAX = 50000;
const Y_MIN = 0.45;
const Y_MAX = 1.0;

const r1 = (n) => Math.round(n * 10) / 10;
const px = (qps) =>
  r1(PAD.left + ((Math.log10(qps) - Math.log10(X_MIN)) / (Math.log10(X_MAX) - Math.log10(X_MIN))) * plotW);
const py = (recall) => r1(PAD.top + ((Y_MAX - recall) / (Y_MAX - Y_MIN)) * plotH);

const line = (series) => series.map((p, i) => `${i ? "L" : "M"} ${px(p.qps)} ${py(p.recall)}`).join(" ");
const dots = (series, fill) =>
  series.map((p) => `<circle cx="${px(p.qps)}" cy="${py(p.recall)}" r="4" fill="${fill}"/>`).join("");

const X_TICKS = [
  { qps: 2000, label: "2k" },
  { qps: 5000, label: "5k" },
  { qps: 10000, label: "10k" },
  { qps: 20000, label: "20k" },
  { qps: 50000, label: "50k" },
];
const Y_TICKS = [0.5, 0.7, 0.9, 1.0];
const yLabel = (v) => (v === 1 ? "1.00" : v.toFixed(2));

const kneeX = px(KNEE.qps);
const kneeY = py(KNEE.recall);
// The knee sits near the top of the plate, so the leader drops straight down
// into the empty quadrant under the 0.90 reference line.
const calloutY = py(0.74);

const figure = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img"
     aria-label="Recall against throughput for two index families, with the 0.90 reference line">
  <g stroke="${T.grid}" stroke-width="1">
    ${Y_TICKS.map((v) => `<line x1="${PAD.left}" y1="${py(v)}" x2="${W - PAD.right}" y2="${py(v)}"/>`).join("\n    ")}
  </g>
  <line x1="${PAD.left}" y1="${py(0.9)}" x2="${W - PAD.right}" y2="${py(0.9)}"
        stroke="${T.ink3}" stroke-width="1.5" stroke-dasharray="6 5"/>
  <g stroke="${T.axis}" stroke-width="1.5">
    <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${H - PAD.bottom}"/>
    <line x1="${PAD.left}" y1="${H - PAD.bottom}" x2="${W - PAD.right}" y2="${H - PAD.bottom}"/>
    ${X_TICKS.map((t) => `<line x1="${px(t.qps)}" y1="${H - PAD.bottom}" x2="${px(t.qps)}" y2="${H - PAD.bottom + 5}"/>`).join("\n    ")}
  </g>
  <g fill="${T.ink3}" font-size="15" text-anchor="end" dominant-baseline="middle">
    ${Y_TICKS.map((v) => `<text x="${PAD.left - 9}" y="${py(v)}">${yLabel(v)}</text>`).join("\n    ")}
  </g>
  <g fill="${T.ink3}" font-size="15" text-anchor="middle">
    ${X_TICKS.map((t) => `<text x="${px(t.qps)}" y="${H - PAD.bottom + 22}">${t.label}</text>`).join("\n    ")}
  </g>
  <path d="${line(IVFPQ)}" fill="none" stroke="${T.series3}" stroke-width="2.5"/>
  ${dots(IVFPQ, T.series3)}
  <path d="${line(HNSW)}" fill="none" stroke="${T.series1}" stroke-width="3"/>
  ${dots(HNSW, T.series1)}
  <line x1="${kneeX}" y1="${kneeY}" x2="${kneeX}" y2="${calloutY}" stroke="${T.series2}" stroke-width="1.5"/>
  <circle cx="${kneeX}" cy="${kneeY}" r="6.5" fill="${T.series2}"/>
  <text x="${kneeX - 13}" y="${calloutY}" fill="${T.series2}" font-size="16" text-anchor="end"
        dominant-baseline="middle">0.976 @ 31.8k</text>
  <g font-size="15" dominant-baseline="middle">
    <line x1="${PAD.left}" y1="${H - 15}" x2="${PAD.left + 22}" y2="${H - 15}" stroke="${T.series1}" stroke-width="3"/>
    <text x="${PAD.left + 30}" y="${H - 15}" fill="${T.ink2}">HNSW</text>
    <line x1="${PAD.left + 108}" y1="${H - 15}" x2="${PAD.left + 130}" y2="${H - 15}" stroke="${T.series3}" stroke-width="2.5"/>
    <text x="${PAD.left + 138}" y="${H - 15}" fill="${T.ink2}">IVF-PQ</text>
    <line x1="${PAD.left + 222}" y1="${H - 15}" x2="${PAD.left + 244}" y2="${H - 15}" stroke="${T.ink3}" stroke-width="1.5" stroke-dasharray="6 5"/>
    <text x="${PAD.left + 252}" y="${H - 15}" fill="${T.ink2}">0.90 recall</text>
  </g>
</svg>`;

// --- the card ----------------------------------------------------------------
const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    background: ${T.ground};
    color: ${T.ink};
    font-family: ${T.body};
    display: flex;
    padding: 40px;
    box-sizing: border-box;
  }
  .plate {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: ${T.plate};
    border: 1px solid ${T.grid};
    border-radius: 2px;
    padding: 30px 44px 26px;
    box-sizing: border-box;
  }
  .plate-label {
    display: flex;
    justify-content: space-between;
    font-family: ${T.mono};
    font-size: 19px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${T.ink2};
  }
  .body-row {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 52px;
  }
  h1 {
    font-family: ${T.display};
    font-size: 86px;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.02;
    margin: 0 0 22px;
  }
  .axis-rule { display: block; margin-bottom: 22px; }
  /* One provenance fact per line, so no separator ever dangles at a wrap. */
  .provenance {
    font-family: ${T.mono};
    font-size: 25px;
    line-height: 1.56;
    letter-spacing: 0.02em;
    color: ${T.ink2};
    margin: 0;
    list-style: none;
    padding: 0;
    font-variant-numeric: tabular-nums;
  }
  .figure { flex: none; }
  .footnote {
    border-top: 1px solid ${T.grid};
    padding-top: 14px;
    font-family: ${T.mono};
    font-size: 19px;
    letter-spacing: 0.04em;
    color: ${T.ink3};
    font-variant-numeric: tabular-nums;
  }
</style>
</head>
<body>
  <div class="plate">
    <!-- The right-hand label reads "measured results", not the figure's own
         axis pair. This card is the ONLY thing a recruiter sees for a link
         shared in Slack or a DM, and headlining it "recall@10 vs queries/sec"
         typed the whole person as a vector-search specialist off one project's
         units — the lane-naming the owner removed from the bio and the meta on
         2026-07-31. The curve stays as the visual and the plot's own tick
         labels stay as-is (they are the artifact's units, which is evidence);
         only the card's headline stops claiming a specialty. -->
    <div class="plate-label"><span>iwang-1.github.io</span><span>measured results</span></div>
    <div class="body-row">
      <div>
        <h1>Ivan&nbsp;Wang</h1>
        <svg class="axis-rule" width="130" height="9" viewBox="0 0 130 9" aria-hidden="true">
          <line x1="0" y1="1" x2="130" y2="1" stroke="${T.series2}" stroke-width="2"/>
          <g stroke="${T.series2}" stroke-width="2">
            <line x1="1" y1="1" x2="1" y2="7"/>
            <line x1="43" y1="1" x2="43" y2="7"/>
            <line x1="86" y1="1" x2="86" y2="7"/>
            <line x1="129" y1="1" x2="129" y2="7"/>
          </g>
        </svg>
        <ul class="provenance">
          <li>Software Engineer</li>
          <li>UMD CS B.S./M.S.</li>
          <li>AWS SDE Intern, Summer 2026</li>
        </ul>
      </div>
      <div class="figure">${figure}</div>
    </div>
    <div class="footnote">50,000 x 128-d · k=10 · single core · Xeon 8488C</div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.waitForLoadState("networkidle");
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out} (1200x630)`);
