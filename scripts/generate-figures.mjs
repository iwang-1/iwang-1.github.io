// Build-time figure generator.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "benchmarks", "lodestone", "bench_50k_128d.txt");
const UPSTREAM = join(root, "..", "lodestone", "benchmarks", "raw", "bench_50k_128d.txt");
const OUT = join(root, "src", "generated", "sweep-figure.ts");
const TOKENS = join(root, "src", "styles", "tokens.css");

const problems = [];
const die = (...lines) => {
  console.error("GENERATE-FIGURES FAILED:");
  for (const line of lines) console.error("  - " + line);
  console.error(
    "\n  The build stops here on purpose. A generated figure must never fall back to\n" +
      "  stale or hardcoded numbers: fix the source file or fix this script.",
  );
  process.exit(1);
};

// ---------------------------------------------------------------------------
// 1. READ THE SOURCE. Loudly.

if (!existsSync(SOURCE))
  die(
    `benchmark source not found: ${relative(root, SOURCE)}`,
    "That file is the figure's only input. Restore it from the lodestone repo",
    "(benchmarks/raw/bench_50k_128d.txt) — it must be byte-identical.",
  );

let raw;
try {
  raw = readFileSync(SOURCE, "utf8");
} catch (error) {
  die(`benchmark source unreadable: ${relative(root, SOURCE)}`, String(error.message ?? error));
}
if (!raw.trim()) die(`benchmark source is empty: ${relative(root, SOURCE)}`);

const sha256 = createHash("sha256").update(raw, "utf8").digest("hex");

// The vendored copy must equal the public original wherever the original is on
// disk. CI has no sibling checkout and skips this; a developer machine does not.
if (existsSync(UPSTREAM)) {
  const upstream = readFileSync(UPSTREAM, "utf8");
  if (upstream !== raw)
    die(
      "the vendored benchmark file has DRIFTED from the lodestone working copy",
      `vendored:  ${relative(root, SOURCE)} (sha256 ${sha256.slice(0, 16)})`,
      `upstream:  ${UPSTREAM} (sha256 ${createHash("sha256").update(upstream, "utf8").digest("hex").slice(0, 16)})`,
      "Copy the upstream file over the vendored one, or explain the difference.",
    );
}

// 2. parse, with the expected shape asserted rather than assumed.

const ORACLE_RE = /^#\s*exact brute-force oracle:\s*(\d+)\s*QPS\s*\(([^)]+)\)\s*$/m;
const RUN_RE =
  /^lodestone-bench:\s*n=(\d+)\s+dim=(\d+)\s+queries=(\d+)\s+k=(\d+)\s+backend=(\S+)\s*$/m;
const HOST_RE = /^#\s*host:\s*(.+?)\s*$/m;
const ROW_RE = /^\|\s*(\d+)\s*\|\s*([\d.]+)\s*\|\s*(\d+)\s*\|\s*$/;

const oracleMatch = raw.match(ORACLE_RE);
if (!oracleMatch)
  problems.push(
    'no oracle line matched /^# exact brute-force oracle: <int> QPS (<note>)$/ — the figure draws that marker, so it may not be inferred',
  );

const runMatch = raw.match(RUN_RE);
if (!runMatch)
  problems.push(
    "no run header matched /^lodestone-bench: n=… dim=… queries=… k=… backend=…$/ — the measurement conditions are read from it, never typed",
  );

const hostMatch = raw.match(HOST_RE);
if (!hostMatch) problems.push("no '# host:' line — the figure names the host it was measured on");

// Section split: rows are attributed to a series by which "## " heading they
// follow, so a row can never be silently filed under the wrong curve.
const HNSW_HEAD = /^##\s*HNSW\s*\(m=(\d+)\)/;
const IVF_HEAD = /^##\s*IVF-PQ\s*\(nlist=(\d+),\s*m=(\d+),\s*([\d.]+x)\s*compression\)/;

let section = null;
let hnswM = null;
let ivfParams = null;
const parsed = { HNSW: [], "IVF-PQ": [] };

for (const line of raw.split("\n")) {
  const hnswHead = line.match(HNSW_HEAD);
  if (hnswHead) {
    section = "HNSW";
    hnswM = hnswHead[1];
    continue;
  }
  const ivfHead = line.match(IVF_HEAD);
  if (ivfHead) {
    section = "IVF-PQ";
    ivfParams = { nlist: ivfHead[1], m: ivfHead[2], compression: ivfHead[3] };
    continue;
  }
  // The header/rule rows of each markdown table carry no digits in column 1.
  const row = line.match(ROW_RE);
  if (!row) continue;
  if (!section) {
    problems.push(`data row outside any series section: ${JSON.stringify(line)}`);
    continue;
  }
  parsed[section].push({ knob: row[1], recall: row[2], qps: row[3] });
}

if (hnswM === null) problems.push("no '## HNSW (m=…)' section heading");
if (ivfParams === null)
  problems.push("no '## IVF-PQ (nlist=…, m=…, …x compression)' section heading");

// The exact shape this figure is built on. Both the count and the knob values are asserted: a sweep that
// kept five rows but changed which five is a different figure, and it should not inherit this one's geometry.
const EXPECT_EF = ["16", "32", "64", "128", "256"];
const EXPECT_NPROBE = ["1", "4", "8", "16", "32"];

const checkSeries = (name, rows, expected, knobName) => {
  if (rows.length !== expected.length) {
    problems.push(
      `${name}: parsed ${rows.length} data rows, expected exactly ${expected.length}`,
    );
    return;
  }
  const got = rows.map((r) => r.knob);
  if (got.join(",") !== expected.join(","))
    problems.push(
      `${name}: ${knobName} values are ${got.join("/")}, expected ${expected.join("/")}`,
    );
  for (const r of rows) {
    if (!/^\d\.\d{4}$/.test(r.recall))
      problems.push(
        `${name} ${knobName}=${r.knob}: recall ${JSON.stringify(r.recall)} is not 4-decimal — the figure renders source precision, so it may not be reformatted`,
      );
    if (!/^\d+$/.test(r.qps))
      problems.push(`${name} ${knobName}=${r.knob}: throughput ${JSON.stringify(r.qps)} is not an integer`);
  }
};

checkSeries("HNSW", parsed.HNSW, EXPECT_EF, "ef");
checkSeries("IVF-PQ", parsed["IVF-PQ"], EXPECT_NPROBE, "nprobe");

const totalRows = parsed.HNSW.length + parsed["IVF-PQ"].length;
if (totalRows !== 10)
  problems.push(`parsed ${totalRows} data rows in total, expected exactly 10`);

if (problems.length)
  die(
    `source did not parse to the expected shape: ${relative(root, SOURCE)}`,
    ...problems,
    "Expected exactly 10 data rows (HNSW ef 16/32/64/128/256, IVF-PQ nprobe 1/4/8/16/32) and one oracle line.",
  );

const oracleQps = oracleMatch[1];
const oracleNote = oracleMatch[2];
const run = {
  n: runMatch[1],
  dim: runMatch[2],
  queries: runMatch[3],
  k: runMatch[4],
  backend: runMatch[5],
};
const host = hostMatch[1];

// 3. the palette, read from src/styles/tokens.css — never a second copy of a hex.

if (!existsSync(TOKENS)) die(`token file not found: ${relative(root, TOKENS)}`);
const tokensCss = readFileSync(TOKENS, "utf8");

const declared = new Map();
for (const m of tokensCss.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g))
  if (!declared.has(m[1])) declared.set(m[1], m[2].trim());

// Resolve one level of var() indirection (LAYER 2 semantic -> LAYER 1 raw) so a
// role that resolves to nothing is caught, not just a role that is missing.
const resolve = (name, depth = 0) => {
  if (depth > 8) return null;
  const value = declared.get(name);
  if (!value) return null;
  const via = value.match(/^var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)$/);
  return via ? resolve(via[1], depth + 1) : value;
};

// Every role the figure paints with, and what it is for here.
const PALETTE = {
  "--ink-data": "the data traces and every measured sample",
  "--ink-accent": "the one annotation: the walking cursor and the knee callout",
  "--ink-secondary": "tick labels, legend, units, sublegends",
  "--rule": "the frame and the axes — a drawn rule",
  "--rule-soft": "the grid, which carries no information a reader could miss",
  "--surface-figure": "the plate the figure sits on: dot haloes, title-block backing",
};
const missing = [];
const paletteResolved = {};
for (const [token, why] of Object.entries(PALETTE)) {
  const value = resolve(token);
  if (!value || !/^#[0-9a-f]{3,8}$/i.test(value))
    missing.push(`${token} (${why}) resolves to ${JSON.stringify(value)} — expected a hex`);
  else paletteResolved[token] = value.toLowerCase();
}
if (missing.length)
  die(
    `src/styles/tokens.css no longer provides the roles this figure paints with`,
    ...missing,
    "The figure emits var(--…) references; a role that resolves to nothing renders black and passes every gate.",
  );

// 4. geometry.
const VIEW = { w: 680, h: 360 };
const FIELD = { x0: 92, x1: 596, y0: 44, y1: 296 };
const XDOMAIN = { min: 700, max: 72000 };
const YDOMAIN = { min: 0.46, max: 1.06 };

const r1 = (n) => {
  const s = n.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
};
const lgMin = Math.log10(XDOMAIN.min);
const lgSpan = Math.log10(XDOMAIN.max) - lgMin;
const px = (qps) => FIELD.x0 + ((Math.log10(qps) - lgMin) / lgSpan) * (FIELD.x1 - FIELD.x0);
const py = (recall) =>
  FIELD.y0 + ((YDOMAIN.max - recall) / (YDOMAIN.max - YDOMAIN.min)) * (FIELD.y1 - FIELD.y0);

// Label placement.
const ADVANCE_EM = 0.75; // Martian Mono, fixed advance
const TRACKING_EM = 0.02; // the labels' letter-spacing
const LABEL_FS = 10;
const LABEL_ASCENT = 7.6;
const LABEL_DESCENT = 2.4;
const charW = (fontSize) => fontSize * (ADVANCE_EM + TRACKING_EM);
const textWidth = (text, fontSize = LABEL_FS) => text.length * charW(fontSize);

/** The box a text run paints, given its anchor. */
const textRect = (text, x, baseline, anchor, fontSize = LABEL_FS) => {
  const w = textWidth(text, fontSize);
  const left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  const scale = fontSize / LABEL_FS;
  return {
    x0: left,
    x1: left + w,
    y0: baseline - LABEL_ASCENT * scale,
    y1: baseline + LABEL_DESCENT * scale,
  };
};

const rectsOverlap = (a, b, pad = 1) =>
  a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;

/** Does a line segment cross a rect? Cohen–Sutherland region codes: cheap,
 *  exact, and it needs no clipping result — only whether one exists. */
const segmentHitsRect = (p, q, rect, pad = 1) => {
  const r = { x0: rect.x0 - pad, x1: rect.x1 + pad, y0: rect.y0 - pad, y1: rect.y1 + pad };
  const code = (x, y) =>
    (x < r.x0 ? 1 : 0) | (x > r.x1 ? 2 : 0) | (y < r.y0 ? 4 : 0) | (y > r.y1 ? 8 : 0);
  let [x0, y0] = p;
  let [x1, y1] = q;
  let c0 = code(x0, y0);
  let c1 = code(x1, y1);
  for (let guard = 0; guard < 32; guard++) {
    if (!(c0 | c1)) return true; // both inside
    if (c0 & c1) return false; // both outside the same edge
    const out = c0 || c1;
    let x, y;
    if (out & 8) {
      x = x0 + ((x1 - x0) * (r.y1 - y0)) / (y1 - y0);
      y = r.y1;
    } else if (out & 4) {
      x = x0 + ((x1 - x0) * (r.y0 - y0)) / (y1 - y0);
      y = r.y0;
    } else if (out & 2) {
      y = y0 + ((y1 - y0) * (r.x1 - x0)) / (x1 - x0);
      x = r.x1;
    } else {
      y = y0 + ((y1 - y0) * (r.x0 - x0)) / (x1 - x0);
      x = r.x0;
    }
    if (out === c0) {
      x0 = x;
      y0 = y;
      c0 = code(x0, y0);
    } else {
      x1 = x;
      y1 = y;
      c1 = code(x1, y1);
    }
  }
  return true; // degenerate: treat as a hit rather than risk a silent overlap
};

/** Candidate positions, generated rather than tabulated, and searched nearest first. */
const LABEL_REACH = 46;
const CANDIDATES = (() => {
  const out = [];
  for (let dy = 3; dy <= LABEL_REACH; dy += 1.5) {
    // directly under, then directly over, then shouldered off to each side
    out.push({ dx: 0, dy: dy + 9.6, anchor: "middle", d: dy });
    out.push({ dx: 0, dy: -(dy + 5.6), anchor: "middle", d: dy + 0.5 });
    out.push({ dx: -8, dy: dy - 3.5, anchor: "end", d: dy + 8 });
    out.push({ dx: 8, dy: dy - 3.5, anchor: "start", d: dy + 8 });
    out.push({ dx: -8, dy: -(dy - 3.5), anchor: "end", d: dy + 8.5 });
    out.push({ dx: 8, dy: -(dy - 3.5), anchor: "start", d: dy + 8.5 });
  }
  return out.sort((a, b) => a.d - b.d);
})();

const XTICKS = [2000, 5000, 10000, 20000, 50000];
const YTICKS = [1.0, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5];
const REFERENCE_RECALL = 0.9;

const group = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// 5. the samples, in one array, ordered by throughput ascending.
const samples = [
  ...parsed.HNSW.map((r) => ({
    series: "HNSW",
    cls: "hnsw",
    setting: `ef=${r.knob}`,
    recall: r.recall,
    qps: r.qps,
  })),
  ...parsed["IVF-PQ"].map((r) => ({
    series: "IVF-PQ",
    cls: "ivf",
    setting: `nprobe=${r.knob}`,
    recall: r.recall,
    qps: r.qps,
  })),
]
  .map((s) => ({
    ...s,
    qpsDisplay: group(s.qps),
    x: px(Number(s.qps)),
    y: py(Number(s.recall)),
  }))
  .sort((a, b) => a.x - b.x);

for (const s of samples) {
  if (s.x < FIELD.x0 || s.x > FIELD.x1 || s.y < FIELD.y0 || s.y > FIELD.y1)
    die(
      `sample ${s.setting} plots outside the field: (${r1(s.x)}, ${r1(s.y)})`,
      `field is x ${FIELD.x0}..${FIELD.x1}, y ${FIELD.y0}..${FIELD.y1}`,
      "The axis domains in this script no longer cover the data they are drawing.",
    );
}

// One readout string shape, resolved once, so the crosshair's live text, each sample's data attribute and
// the transcription table can never disagree about a sample. src/enhance.ts joins the annotated sample to.
const readoutOf = (s) =>
  `${s.setting} · recall ${s.recall} · ${s.qpsDisplay} q/s · single core`;

// The annotated sample: the knee, and the figure's server-rendered default state. Chosen by measurement,
// not by taste — the highest-throughput HNSW sample that still clears the 0.90 reference line the figure draws.
const knee = [...samples]
  .filter((s) => s.series === "HNSW" && Number(s.recall) >= REFERENCE_RECALL)
  .sort((a, b) => Number(b.qps) - Number(a.qps))[0];
if (!knee)
  die(
    `no HNSW sample clears the ${REFERENCE_RECALL} reference line`,
    "The figure annotates the fastest sample above that line; there is nothing to annotate.",
  );

// THE WALK: the five HNSW samples, left to right, which is the direction the
// arrow keys move and the direction throughput increases.
const walk = samples.filter((s) => s.series === "HNSW");
const WALK_SECONDS = 10;

// ---------------------------------------------------------------------------
// 5b. SOLVE THE LABEL POSITIONS, then prove no two things overlap.

const oracleX = px(Number(oracleQps));
const oracleY = py(1);
const refY = py(REFERENCE_RECALL);

// The fixed furniture. Everything already committed to a position: the boxes a sample label must dodge, and
// the segments of the two traces it must not sit on top of.
const LEGEND_X = FIELD.x0 + 6;
const LEGEND_LABEL_X = FIELD.x0 + 26;
// The legend's three rows.
const LEGEND_ROWS = [
  { y: 200, text: `HNSW m=${hnswM}` },
  { y: 222, text: `IVF-PQ nlist=${ivfParams.nlist} m=${ivfParams.m}` },
  { y: 244, text: "oracle · exact brute force" },
];
// The title block's rows, and its box sized from them rather than from a typed width.
const BLOCK_ROWS = [
  "TEST CONDITIONS",
  `n=${group(run.n)} · d=${run.dim}`,
  `k=${run.k} · 1 core`,
  `${run.backend} · Xeon 8488C`,
];
const BLOCK_W = Math.ceil(Math.max(...BLOCK_ROWS.map((r) => textWidth(r))) + 16);
const BLOCK_H = 15 + BLOCK_ROWS.length * 14 - 6;
const BLOCK = {
  x0: FIELD.x1 - 1 - BLOCK_W,
  y0: FIELD.y1 - 1 - BLOCK_H,
  x1: FIELD.x1 - 1,
  y1: FIELD.y1 - 1,
};
const REF_LABEL_X = FIELD.x0 + 8;
// "48 vCPU", not "48 cores": the benchmark header this file parses reads "Intel(R) Xeon(R) Platinum 8488C,
// 48 vCPU", and the generated module already carries that exact string as `host`.
const ORACLE_LABEL = `oracle · ${group(oracleQps)} q/s exact · 48 vCPU`;

// The annotation's two lines.
const CALLOUT_LINES = [
  `${knee.setting} · recall ${knee.recall} ·`,
  `${knee.qpsDisplay} q/s`,
];
// Right-anchored, so x is the RIGHT edge; held one label-width off the frame so
// the longer of the two lines cannot leave the drawing.
const CALLOUT_X = VIEW.w - 8;

const furniture = [
  // the reference level's two-line label
  {
    what: "the recall-floor label",
    rect: textRect(`recall ${REFERENCE_RECALL.toFixed(2)} floor ·`, REF_LABEL_X, refY + 12.8, "start"),
  },
  {
    what: "the recall-floor label, line 2",
    rect: textRect(
      `${samples[samples.length - 1].setting} falls below it`,
      REF_LABEL_X,
      refY + 23.8,
      "start",
    ),
  },
  // the oracle marker's annotation and its crosshair glyph
  { what: "the oracle annotation", rect: textRect(ORACLE_LABEL, oracleX + 11, oracleY - 5.2, "start") },
  {
    what: "the oracle marker",
    rect: { x0: oracleX - 6, x1: oracleX + 6, y0: oracleY - 6, y1: oracleY + 6 },
  },
  // the legend: swatch and text per row
  ...LEGEND_ROWS.map((r) => ({
    what: `the legend row "${r.text}"`,
    rect: textRect(r.text, LEGEND_LABEL_X, r.y + 4, "start"),
  })),
  ...LEGEND_ROWS.map((r) => ({
    what: "a legend swatch",
    rect: { x0: LEGEND_X, x1: LEGEND_X + 14, y0: r.y - 5, y1: r.y + 5 },
  })),
  // the title block
  { what: "the title block", rect: BLOCK },
  // the annotation ring around the annotated sample
  {
    what: "the annotation ring",
    rect: { x0: knee.x - 8, x1: knee.x + 8, y0: knee.y - 8, y1: knee.y + 8 },
  },
];

// The one rule A label may not cross: the dashed reference level.
const rules = [
  { what: "the recall-floor reference line", p: [FIELD.x0, refY], q: [FIELD.x1, refY] },
];

// The two traces, as segment lists, so a label is never laid over a stroke.
const traceSegments = ["HNSW", "IVF-PQ"].flatMap((series) => {
  const pts = samples.filter((s) => s.series === series).map((s) => [s.x, s.y]);
  return pts.slice(1).map((q, i) => ({ what: `the ${series} trace`, p: pts[i], q }));
});

// Every sample dot (r=4 plus its 1.5 halo) is an obstacle for every label.
const dots = samples.map((s) => ({
  what: `the ${s.setting} sample dot`,
  rect: { x0: s.x - 5.5, x1: s.x + 5.5, y0: s.y - 5.5, y1: s.y + 5.5 },
}));

// Solve in x order, so the placement is deterministic and re-running the
// generator on an unchanged source emits a byte-identical file.
const placed = [];
const labelFor = new Map();
for (const s of samples) {
  const obstacles = [...furniture, ...dots, ...placed];
  let chosen = null;
  for (const c of CANDIDATES) {
    const rect = textRect(s.setting, s.x + c.dx, s.y + c.dy, c.anchor);
    // inside the field, with a little air off the frame
    if (rect.x0 < FIELD.x0 + 2 || rect.x1 > FIELD.x1 - 2) continue;
    if (rect.y0 < FIELD.y0 + 2 || rect.y1 > FIELD.y1 - 2) continue;
    if (obstacles.some((o) => rectsOverlap(rect, o.rect))) continue;
    if (traceSegments.some((t) => segmentHitsRect(t.p, t.q, rect))) continue;
    if (rules.some((t) => segmentHitsRect(t.p, t.q, rect, 0))) continue;
    chosen = { ...c, rect };
    break;
  }
  if (!chosen) {
    // Report WHAT blocked the preferred position, so the failure is actionable.
    const first = textRect(s.setting, s.x + CANDIDATES[0].dx, s.y + CANDIDATES[0].dy, CANDIDATES[0].anchor);
    const blockers = [
      ...obstacles.filter((o) => rectsOverlap(first, o.rect)).map((o) => o.what),
      ...traceSegments.filter((t) => segmentHitsRect(t.p, t.q, first)).map((t) => t.what),
    ];
    die(
      `no collision-free position for the label ${JSON.stringify(s.setting)} at (${r1(s.x)}, ${r1(s.y)})`,
      `${CANDIDATES.length} candidate positions were tried and every one overlapped something.`,
      blockers.length
        ? `the preferred position is blocked by: ${[...new Set(blockers)].join(", ")}`
        : "the preferred position leaves the field",
      "Widen the field, add a candidate position, or drop a label — but do not ship an overlap.",
    );
  }
  labelFor.set(s.setting, chosen);
  placed.push({ what: `the ${s.setting} label`, rect: chosen.rect });
}

// The assertion, run over the solved result rather than trusted from the loop: every pair of labels, and
// every label against every piece of furniture, dot and trace.
const collisions = [];
for (let i = 0; i < placed.length; i++) {
  for (let j = i + 1; j < placed.length; j++)
    if (rectsOverlap(placed[i].rect, placed[j].rect))
      collisions.push(`${placed[i].what} overlaps ${placed[j].what}`);
  for (const o of [...furniture, ...dots])
    if (rectsOverlap(placed[i].rect, o.rect)) collisions.push(`${placed[i].what} overlaps ${o.what}`);
  for (const t of traceSegments)
    if (segmentHitsRect(t.p, t.q, placed[i].rect))
      collisions.push(`${placed[i].what} sits on ${t.what}`);
  for (const t of rules)
    if (segmentHitsRect(t.p, t.q, placed[i].rect, 0))
      collisions.push(`${placed[i].what} is set across ${t.what}`);
}
// The furniture must also not collide with itself — the legend and the title
// block are both fixed, and this is what catches one growing into the other.
for (let i = 0; i < furniture.length; i++)
  for (let j = i + 1; j < furniture.length; j++)
    if (rectsOverlap(furniture[i].rect, furniture[j].rect))
      collisions.push(`${furniture[i].what} overlaps ${furniture[j].what}`);

if (collisions.length)
  die(
    "the solved figure contains overlapping elements",
    ...[...new Set(collisions)],
    "A figure that prints two strings on top of each other is not evidence.",
  );

// 6. the markup.

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const trace = (series) => {
  const pts = samples
    .filter((s) => s.series === series)
    .map((s) => `${r1(s.x)} ${r1(s.y)}`);
  return `M ${pts.join(" L ")}`;
};

// The walk's keyframes. Two decisions worth reading.
const stops = [...walk, knee];
const pct = (n) => String(Number(n.toFixed(2)));
const walkStops = stops
  .map((s, i) => {
    const last = i === stops.length - 1;
    const from = pct((i / stops.length) * 100);
    const to = last ? "100" : pct(((i + 1) / stops.length) * 100 - 0.1);
    return `      ${from}%, ${to}% { transform: translate(${r1(s.x)}px, ${r1(s.y)}px); }`;
  })
  .join("\n");

// Every selector below is prefixed `.sweep-plot`.
const style = `    .sweep-plot { font-family: var(--font-mono); }
    .sweep-plot .sweep-frame { fill: none; stroke: var(--rule); stroke-width: 1; }
    .sweep-plot .sweep-grid line { stroke: var(--rule-soft); stroke-width: 1; }
    .sweep-plot .sweep-axis line { stroke: var(--rule); stroke-width: 1; }
    .sweep-plot .sweep-reference { stroke: var(--ink-secondary); stroke-width: 1; stroke-dasharray: 5 4; }
    .sweep-plot .sweep-reference-label,
    .sweep-plot .sweep-tick text,
    .sweep-plot .sweep-legend text,
    .sweep-plot .sweep-oracle text,
    .sweep-plot .sweep-block text,
    .sweep-plot .sweep-samples text { font-size: 10px; letter-spacing: 0.02em; fill: var(--ink-secondary); }
    .sweep-plot .sweep-axis-title { font-size: 11px; letter-spacing: 0.09em; text-anchor: middle; fill: var(--ink-secondary); }
    .sweep-plot .sweep-tick-x text { text-anchor: middle; }
    .sweep-plot .sweep-tick-y text { text-anchor: end; }
    .sweep-plot .sweep-legend text,
    .sweep-plot .sweep-oracle text { text-anchor: start; }
    .sweep-plot .sweep-legend line { stroke: var(--ink-data); stroke-width: 2; }
    .sweep-plot .sweep-legend-ivf { stroke-dasharray: 6 4; }
    .sweep-plot .sweep-legend-oracle { fill: none; stroke: var(--ink-secondary); stroke-width: 1; }
    .sweep-plot .sweep-oracle path { fill: none; stroke: var(--ink-secondary); stroke-width: 1; }
    .sweep-plot .sweep-block rect { fill: var(--surface-figure); stroke: none; }
    .sweep-plot .sweep-block-rule { stroke: var(--rule); stroke-width: 1; }
    .sweep-plot .sweep-block-key { letter-spacing: 0.09em; }
    .sweep-plot .sweep-line { fill: none; stroke: var(--ink-data); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
    .sweep-plot .sweep-line-ivf { stroke-dasharray: 6 4; }
    .sweep-plot .sweep-samples text { text-anchor: middle; }
    .sweep-plot .sweep-label-end { text-anchor: end; }
    .sweep-plot .sweep-label-start { text-anchor: start; }
    .sweep-plot .sweep-sample circle { stroke: var(--ink-data); stroke-width: 1.5; }
    .sweep-plot .sweep-sample-hnsw circle { fill: var(--ink-data); }
    .sweep-plot .sweep-sample-ivf circle { fill: var(--surface-figure); }
    .sweep-plot .sweep-callout-ring { fill: none; stroke: var(--ink-accent); stroke-width: 1.5; }
    .sweep-plot .sweep-callout-leader { fill: none; stroke: var(--ink-accent); stroke-width: 1; }
    .sweep-plot .sweep-callout-label { font-size: 12px; letter-spacing: 0.02em; text-anchor: end; fill: var(--ink-accent); }

    /* THE WALK. A measurement cursor stepping the five HNSW samples on one
       ${WALK_SECONDS}s linear pass, forever, in CSS, inside the SVG: no script and no SMIL,
       so it runs with JavaScript fully disabled. It is enhancement only, and every
       number it visits is already in the static markup and in the transcription
       table below the drawing, so nothing it does constitutes proof. */
    .sweep-plot .sweep-walk {
      fill: none;
      stroke: var(--ink-accent);
      stroke-width: 1.5;
      pointer-events: none;
      transform: translate(${r1(knee.x)}px, ${r1(knee.y)}px);
      animation: sweep-walk ${WALK_SECONDS}s linear infinite;
    }

    @keyframes sweep-walk {
${walkStops}
    }

    /* A reader who takes over the cursor is not competing with it. Pure CSS, so
       the pause costs nothing and exists on the no-script render too. */
    .sweep:hover .sweep-plot .sweep-walk,
    .sweep:focus-within .sweep-plot .sweep-walk { animation-play-state: paused; }

    /* REDUCED MOTION: the walk stops and the cursor parks on the annotated
       default sample, which is where the static figure already points. The
       figure loses a moving dot and no evidence. */
    @media (prefers-reduced-motion: reduce) {
      .sweep-plot .sweep-walk { animation: none; transform: translate(${r1(knee.x)}px, ${r1(knee.y)}px); }
    }

    @media print {
      .sweep-plot .sweep-walk { display: none; }
    }

    /* Forced colours: mirrored from Sweep.css at this file's specificity, or
       these rules would paint over a user's own scheme. The two series keep
       their dash difference, which is why they are readable here at all. */
    @media (forced-colors: active) {
      .sweep-plot .sweep-reference-label,
      .sweep-plot .sweep-tick text,
      .sweep-plot .sweep-legend text,
      .sweep-plot .sweep-oracle text,
      .sweep-plot .sweep-block text,
      .sweep-plot .sweep-samples text,
      .sweep-plot .sweep-axis-title { fill: CanvasText; }
      .sweep-plot .sweep-callout-label { fill: LinkText; }
      .sweep-plot .sweep-frame,
      .sweep-plot .sweep-grid line,
      .sweep-plot .sweep-axis line,
      .sweep-plot .sweep-reference,
      .sweep-plot .sweep-line { stroke: CanvasText; }
      .sweep-plot .sweep-sample circle { fill: Canvas; stroke: CanvasText; }
      .sweep-plot .sweep-sample-hnsw circle { fill: CanvasText; }
      .sweep-plot .sweep-callout-ring,
      .sweep-plot .sweep-callout-leader,
      .sweep-plot .sweep-walk { stroke: LinkText; }
    }`;

const svg = `<svg class="sweep-plot" viewBox="0 0 ${VIEW.w} ${VIEW.h}" role="img" aria-label="${esc(
  `Recall at k=${run.k} against queries per second on a log scale, drawn as a force-travel trace. HNSW is the solid trace and trades recall for throughput at a knee at ${knee.setting}; IVF-PQ is the dashed trace and holds lower throughput at comparable recall.`,
)}">
  <style>
${style}
  </style>

  <!-- the field: a closed frame with an interior grid, the way a datasheet
       boxes its measurement area -->
  <g class="sweep-grid">
${YTICKS.map((r) => `    <line x1="${FIELD.x0}" y1="${r1(py(r))}" x2="${FIELD.x1}" y2="${r1(py(r))}" />`).join("\n")}
${XTICKS.map((q) => `    <line x1="${r1(px(q))}" y1="${FIELD.y0}" x2="${r1(px(q))}" y2="${FIELD.y1}" />`).join("\n")}
  </g>
  <rect class="sweep-frame" x="${FIELD.x0}" y="${FIELD.y0}" width="${FIELD.x1 - FIELD.x0}" height="${FIELD.y1 - FIELD.y0}" />

  <!-- the reference level, dashed and named: a datasheet marks actuation and
       bottom-out this way. The fast end of the solid trace crosses BELOW it,
       which is the honest part of this figure. -->
  <line class="sweep-reference" x1="${FIELD.x0}" y1="${r1(refY)}" x2="${FIELD.x1}" y2="${r1(refY)}" />
  <text class="sweep-reference-label" x="${REF_LABEL_X}" y="${r1(refY + 12.8)}">recall ${REFERENCE_RECALL.toFixed(
    2,
  )} floor ·<tspan x="${REF_LABEL_X}" dy="11">${esc(samples[samples.length - 1].setting)} falls below it</tspan></text>

  <!-- inward ticks -->
  <g class="sweep-axis">
${XTICKS.map((q) => `    <line x1="${r1(px(q))}" y1="${FIELD.y1}" x2="${r1(px(q))}" y2="${FIELD.y1 - 5}" />`).join("\n")}
${YTICKS.map((r) => `    <line x1="${FIELD.x0}" y1="${r1(py(r))}" x2="${FIELD.x0 + 5}" y2="${r1(py(r))}" />`).join("\n")}
  </g>

  <g class="sweep-tick sweep-tick-x">
${XTICKS.map((q) => `    <text x="${r1(px(q))}" y="${FIELD.y1 + 18}">${group(q / 1000)}K</text>`).join("\n")}
  </g>
  <g class="sweep-tick sweep-tick-y">
${YTICKS.map((r) => `    <text x="${FIELD.x0 - 10}" y="${r1(py(r) + 3.5)}">${r.toFixed(2)}</text>`).join("\n")}
  </g>
  <text class="sweep-axis-title" x="${(FIELD.x0 + FIELD.x1) / 2}" y="${VIEW.h - 20}">THROUGHPUT (QUERIES / SECOND, LOG SCALE)</text>
  <text class="sweep-axis-title" x="26" y="${(FIELD.y0 + FIELD.y1) / 2 - 0.2}" transform="rotate(-90 26 ${(FIELD.y0 + FIELD.y1) / 2 - 0.2})">RECALL (AT k=${run.k}, 0 TO 1)</text>

  <!-- the legend. Rows and label strings come from LEGEND_ROWS, which the
       collision solver above also reads, so the drawn legend and the obstacle it
       represents can never be two different rectangles. -->
  <g class="sweep-legend">
    <line x1="${LEGEND_X}" y1="${LEGEND_ROWS[0].y}" x2="${LEGEND_X + 14}" y2="${LEGEND_ROWS[0].y}" />
    <text x="${LEGEND_LABEL_X}" y="${LEGEND_ROWS[0].y + 4}">${esc(LEGEND_ROWS[0].text)}</text>
    <line class="sweep-legend-ivf" x1="${LEGEND_X}" y1="${LEGEND_ROWS[1].y}" x2="${LEGEND_X + 14}" y2="${LEGEND_ROWS[1].y}" />
    <text x="${LEGEND_LABEL_X}" y="${LEGEND_ROWS[1].y + 4}">${esc(LEGEND_ROWS[1].text)}</text>
    <path class="sweep-legend-oracle" d="M ${LEGEND_X} ${LEGEND_ROWS[2].y} L ${LEGEND_X + 14} ${LEGEND_ROWS[2].y} M ${LEGEND_X + 7} ${LEGEND_ROWS[2].y - 4} L ${LEGEND_X + 7} ${LEGEND_ROWS[2].y + 4}" />
    <text x="${LEGEND_LABEL_X}" y="${LEGEND_ROWS[2].y + 4}">${esc(LEGEND_ROWS[2].text)}</text>
  </g>

  <!-- the oracle: the thing the index is being compared against -->
  <g class="sweep-oracle">
    <path d="M ${r1(oracleX - 6)} ${r1(oracleY)} L ${r1(oracleX + 6)} ${r1(oracleY)} M ${r1(oracleX)} ${r1(oracleY - 6)} L ${r1(oracleX)} ${r1(oracleY + 6)}" />
    <text x="${r1(oracleX + 11)}" y="${r1(oracleY - 5.2)}">${esc(ORACLE_LABEL)}</text>
  </g>

  <!-- the two strokes: solid is HNSW sweeping ef, dashed is IVF-PQ sweeping
       nprobe. Told apart by dash, never by hue. -->
  <path class="sweep-line sweep-line-ivf" d="${trace("IVF-PQ")}" />
  <path class="sweep-line sweep-line-hnsw" d="${trace("HNSW")}" />

  <!-- the crosshair, defaulting to the annotated sample so the annotated state
       is the state the static HTML ships in. src/enhance.ts only moves it by
       rewriting --sweep-x / --sweep-y on the <figure>. -->
  <g class="sweep-crosshair" aria-hidden="true">
    <line class="sweep-crosshair-v" x1="0" y1="${FIELD.y0}" x2="0" y2="${FIELD.y1}" />
    <line class="sweep-crosshair-h" x1="${FIELD.x0}" y1="0" x2="${FIELD.x1}" y2="0" />
    <circle class="sweep-crosshair-dot" cx="0" cy="0" r="6.5" />
  </g>

  <!-- every sample carries its own plot coordinate and its own readout string,
       so src/enhance.ts needs no copy of this table and no arithmetic. Label
       positions are solved above and asserted collision-free. -->
  <g class="sweep-samples">
${samples
  .map((s) => {
    const label = labelFor.get(s.setting);
    const isKnee = s.setting === knee.setting;
    const cls =
      label.anchor === "end" ? ' class="sweep-label-end"' : label.anchor === "start" ? ' class="sweep-label-start"' : "";
    return `    <g class="sweep-sample sweep-sample-${s.cls}${isKnee ? " sweep-sample-knee" : ""}" data-sweep-x="${r1(
      s.x,
    )}" data-sweep-y="${r1(s.y)}" data-sweep-readout="${esc(readoutOf(s))}">
      <circle cx="${r1(s.x)}" cy="${r1(s.y)}" r="4" />
      <text${cls} x="${r1(s.x + label.dx)}" y="${r1(s.y + label.dy)}">${esc(s.setting)}</text>
    </g>`;
  })
  .join("\n")}
  </g>

  <!-- the walking cursor: CSS keyframes, ${stops.length} stops, ${WALK_SECONDS}s, no script -->
  <circle class="sweep-walk" cx="0" cy="0" r="7" aria-hidden="true" />

  <!-- the annotation, in the markup, so it is the figure's default state and
       not a hover reward -->
  <g class="sweep-callout">
    <circle class="sweep-callout-ring" cx="${r1(knee.x)}" cy="${r1(knee.y)}" r="8" />
    <path class="sweep-callout-leader" d="M ${r1(knee.x)} ${r1(knee.y - 8)} L ${r1(knee.x + 28.7)} 46 L ${r1(
      CALLOUT_X - 2,
    )} 46" />
    <text class="sweep-callout-label" x="${r1(CALLOUT_X)}" y="22">${esc(CALLOUT_LINES[0])}<tspan x="${r1(
      CALLOUT_X,
    )}" dy="16">${esc(CALLOUT_LINES[1])}</tspan></text>
  </g>

  <!-- THE TITLE BLOCK, bottom-right, where a datasheet puts it: the conditions
       the trace was measured under, read from the source file's own run header.
       Backed by the plate colour so the grid does not read through it. -->
  <g class="sweep-block">
    <rect x="${BLOCK.x0}" y="${BLOCK.y0}" width="${BLOCK.x1 - BLOCK.x0}" height="${BLOCK.y1 - BLOCK.y0}" />
    <line class="sweep-block-rule" x1="${BLOCK.x0}" y1="${BLOCK.y0}" x2="${BLOCK.x1}" y2="${BLOCK.y0}" />
${BLOCK_ROWS.map(
  (row, i) =>
    `    <text${i === 0 ? ' class="sweep-block-key"' : ""} x="${BLOCK.x0 + 8}" y="${
      BLOCK.y0 + 15 + i * 14
    }">${esc(row)}</text>`,
).join("\n")}
  </g>
</svg>`;

// ---------------------------------------------------------------------------
// 7. THE SELF-CHECK. No data number reaches the page that is not a byte-exact
// substring of the file the page cites.
//
// Coordinates are excluded because they are geometry, derived from the axis
// mappings above — they are not claims and the repo's fact gate masks them for
// the same reason. What IS checked: every recall, every throughput (in both the
// raw and the separator-grouped spelling), the oracle, and the run conditions.
const dataNumbers = new Set();
for (const s of samples) {
  dataNumbers.add(s.recall);
  dataNumbers.add(s.qps);
}
dataNumbers.add(oracleQps);
dataNumbers.add(run.n);
dataNumbers.add(run.dim);
dataNumbers.add(run.k);
dataNumbers.add(hnswM);
dataNumbers.add(ivfParams.nlist);
dataNumbers.add(ivfParams.m);

const notInSource = [...dataNumbers].filter((n) => !raw.includes(n));
if (notInSource.length)
  die(
    "a number this figure presents as data is NOT a byte-exact substring of the source",
    ...notInSource.map((n) => `${JSON.stringify(n)} does not appear in ${relative(root, SOURCE)}`),
  );

// The grouped spellings must be the same value with separators inserted and
// nothing else — a formatting bug that changed a digit would otherwise ship.
for (const s of samples)
  if (s.qpsDisplay.replace(/,/g, "") !== s.qps)
    die(
      `thousands separators changed a value: ${s.setting} renders ${s.qpsDisplay} from ${s.qps}`,
    );

// The knee's data attribute and the module's exported default must be the same
// string: src/enhance.ts joins them by exact equality, and a mismatch silently
// moves the keyboard cursor to the slowest sample.
const kneeReadout = readoutOf(knee);
if (!svg.includes(`data-sweep-readout="${esc(kneeReadout)}"`))
  die("the annotated sample's readout string is not present in the markup as authored");

// The emitted SVG must be safe to carry in a template literal, and its `d="…"`
// runs must be in the literal-quote form the repo's fact gate masks.
for (const [pattern, why] of [
  [/`/, "a backtick would terminate the template literal the module emits"],
  [/\$\{/, "a ${ sequence would be interpolated by the template literal"],
  [/\\/, "a backslash would escape inside the template literal"],
  [/d=\\"/, "escaped-quote path data is invisible to the fact gate's coordinate mask"],
])
  if (pattern.test(svg)) die(`generated markup is unsafe to emit: ${why}`);

// 8. emit.

const tsLiteral = (s) => JSON.stringify(s);

const module_ = `// GENERATED FILE — DO NOT EDIT BY HAND.
//
// Written by scripts/generate-figures.mjs, which runs as the first half of
// \`prebuild\`. Every number below is parsed from the benchmark file named in
// SWEEP_SOURCE and asserted, at generation time, to be a byte-exact substring of
// it. Hand-editing this file breaks that guarantee silently: the next build
// overwrites your edit, and until it does, the figure is claiming something its
// cited file does not say.
//
// To change what this figure shows, change the generator. To change what it
// measures, change the benchmark.
//
//   source      ${relative(root, SOURCE)}
//   sha256      ${sha256}
//   captured    ${(raw.match(/^#\s*lodestone benchmark — captured\s*(\S+)/m) ?? [, "unknown"])[1]}
//   host        ${host}
//   run         n=${run.n} dim=${run.dim} queries=${run.queries} k=${run.k} backend=${run.backend}
//   parsed      ${samples.length} samples (HNSW ef ${parsed.HNSW.map((r) => r.knob).join("/")}, IVF-PQ nprobe ${parsed["IVF-PQ"].map((r) => r.knob).join("/")}) + oracle ${oracleQps} q/s
//   palette     ${Object.entries(paletteResolved)
    .map(([k, v]) => `${k}=${v}`)
    .join(" · ")}
//               (read from src/styles/tokens.css; the markup emits var() refs,
//                so no hex is duplicated anywhere in the source tree)

/** One measured sample, at the source file's own precision. \`qpsDisplay\` is
 *  \`qps\` with thousands separators inserted and nothing else changed. */
export interface SweepSample {
  readonly series: string;
  readonly setting: string;
  readonly recall: string;
  readonly qps: string;
  readonly qpsDisplay: string;
  readonly readout: string;
}

/** THE SAMPLES, ORDERED BY THROUGHPUT ASCENDING — left-to-right on the log
 *  x-axis, the order the arrow keys walk (src/enhance.ts sorts on
 *  data-sweep-x), and the order the transcription table's caption claims. The
 *  two series interleave: ${samples[4].setting} sits between ${samples[3].setting} and ${samples[5].setting}. Grouping
 *  the rows by series would silently falsify that caption. */
export const SWEEP_SAMPLES: readonly SweepSample[] = [
${samples
  .map(
    (s) =>
      `  { series: ${tsLiteral(s.series)}, setting: ${tsLiteral(s.setting)}, recall: ${tsLiteral(
        s.recall,
      )}, qps: ${tsLiteral(s.qps)}, qpsDisplay: ${tsLiteral(s.qpsDisplay)}, readout: ${tsLiteral(
        readoutOf(s),
      )} },`,
  )
  .join("\n")}
];

/** The annotated sample: the fastest HNSW setting still above the ${REFERENCE_RECALL.toFixed(2)} reference
 *  line the figure draws. It is the figure's server-rendered default state, and
 *  this exact string is what src/enhance.ts joins the crosshair to. */
export const SWEEP_KNEE: SweepSample = SWEEP_SAMPLES[${samples.findIndex(
  (s) => s.setting === knee.setting,
)}];

/** The exact brute-force baseline, and its own disclosure. It runs across all
 *  48 vCPU while every sample above runs on one, so the two sides of any ratio
 *  between them are not core-for-core. */
export const SWEEP_ORACLE = {
  qps: ${tsLiteral(oracleQps)},
  qpsDisplay: ${tsLiteral(group(oracleQps))},
  note: ${tsLiteral(oracleNote)},
} as const;

/** Measurement conditions, read from the source file's run header. */
export const SWEEP_RUN = {
  n: ${tsLiteral(run.n)},
  nDisplay: ${tsLiteral(group(run.n))},
  dim: ${tsLiteral(run.dim)},
  queries: ${tsLiteral(run.queries)},
  k: ${tsLiteral(run.k)},
  backend: ${tsLiteral(run.backend)},
  host: ${tsLiteral(host)},
} as const;

/** Where the numbers come from, for the footnote that links to it. */
export const SWEEP_SOURCE = {
  file: ${tsLiteral("benchmarks/raw/bench_50k_128d.txt")},
  name: ${tsLiteral("bench_50k_128d.txt")},
  href: ${tsLiteral(
    "https://github.com/iwang-1/lodestone/blob/main/benchmarks/raw/bench_50k_128d.txt",
  )},
  sha256: ${tsLiteral(sha256)},
} as const;

/** THE FIGURE. A static inline SVG in datasheet grammar, animated by CSS
 *  keyframes INSIDE the element — no <script>, no SMIL — so the walking cursor
 *  runs with JavaScript fully disabled and the numbers it visits are already in
 *  the static markup either way. Injected as markup because it is generated
 *  output, not a component: nothing here is meant to be edited by hand. */
export const SWEEP_SVG = \`${svg}\`;
`;

mkdirSync(dirname(OUT), { recursive: true });
const previous = existsSync(OUT) ? readFileSync(OUT, "utf8") : null;

// `--check` writes nothing and fails if the committed output is not what this script would emit.
if (process.argv.includes("--check")) {
  if (previous === null)
    die(
      `${relative(root, OUT)} does not exist`,
      "Run `npm run generate:figures` and commit the result.",
    );
  if (previous !== module_)
    die(
      `${relative(root, OUT)} is STALE or HAND-EDITED`,
      "Its contents are not what this generator emits from the current source.",
      "Run `npm run generate:figures` and commit the result. Never edit that file directly.",
    );
  console.log(`generate-figures --check OK — ${relative(root, OUT)} matches the generator`);
  process.exit(0);
}

writeFileSync(OUT, module_);

console.log(
  `generate-figures OK — ${relative(root, OUT)} (${Buffer.byteLength(module_)} B, SVG ${Buffer.byteLength(
    svg,
  )} B)${previous === module_ ? " · unchanged" : ""}`,
);
console.log(
  `  source ${relative(root, SOURCE)} sha256 ${sha256.slice(0, 16)}… · ${samples.length} samples + oracle ${group(
    oracleQps,
  )} q/s · annotated ${knee.setting}`,
);
for (const s of samples)
  console.log(`    ${s.series.padEnd(7)} ${s.setting.padEnd(10)} recall ${s.recall}  ${s.qpsDisplay.padStart(7)} q/s`);
