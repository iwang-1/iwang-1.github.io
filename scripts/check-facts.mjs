// Fact/framing gate.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ---------------------------------------------------------------------------
// 1. REQUIRED exact strings (locked facts).
const REQUIRED = [
  "unsupervised domain adaptation",
  "Four-person research project, co-built and open-sourced",
  "co-built and open-sourced",
  "GPA 3.6/4.0",
  "May 2027",
  "ivanwang8989@gmail.com",
  "Departmental Honors (research track)",
  "faculty-mentored research track",
  // Measured values are locked as exact strings.
];

// 1b. rendered-value lock — required in src/content.ts specifically.
const REQUIRED_IN_CONTENT = [
  "2.9 million client operations",
  "878 µs",
  "~29x",
  "not core-for-core",
  // The three other claims A pre-ship review found overstated, locked the same way.
  "Illegal verdicts from the linearizability checker",
  "sled, which wins every matched comparison",
  "6 simulated clients, virtual time",
];

// ---------------------------------------------------------------------------
// 2. FORBIDDEN patterns (per file).
const FORBIDDEN = [
  { re: /\+26%/, why: "inflated DANN delta (+26%) — use the exact Table-2 numbers" },
  {
    re: /74\.2\s?%|67\.7\s?%|64,?000/,
    why: "report-only DANN metric without reproducible committed evidence",
  },
  { re: /\b95\s?%/, why: "unsupported RAG accuracy claim" },
  { re: /\b3[- ]person|\bthree[- ]person/i, why: "FIRE/QNLP team size is four" },
  { re: /qnlp_lorenz/i, why: "the qnlp_lorenz fork must appear nowhere" },
  {
    re: /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/,
    why: "phone-number-shaped string (no phone number anywhere in site text)",
  },
  {
    // Widened 2026-08-03: the original /30[–-]48x/ caught only the hyphen and en-dash spellings it happened
    // to ship in.
    re: /3\s*0\s*[-–—]\s*4\s*8\s*[x×]|30\s*to\s*48\s*[x×]|(?<![\d.])48\s*[x×]\s*(?:the\s+)?(?:oracle|exact|brute|faster|speedup)|31,?700/i,
    why: "retired lodestone claim — 48.7x occurs at 0.8996 recall, below the asserted 90%; true ≥0.90 HNSW band is 9.2x–32.8x, and the QPS figure is ~31,800 not ~31,700",
  },
  { re: /\b80(\.0)?\s?%/, why: "rounded classifier accuracy (79.5% never becomes 80%)" },
  { re: /\b99(\.\d+)?\s?%/, why: "rounded coverage (98.56% never becomes 99%)" },
  { re: /(?<![\d.])219(?![\d.])/, why: "summed test count (101+66+52) — counts stay per-repo" },
  { re: /(?<![\d.])271(?![\d.])/, why: "summed test count — counts stay per-repo" },
  { re: /(?<![\d.])167(?![\d.])/, why: "summed test count (101+66) — counts stay per-repo" },
  {
    re: /passionate|results-driven|detail-oriented|rockstar|ninja|cutting-edge/i,
    why: "banned voice word",
  },
  { re: /hong\s?kong|\bHKU\b/i, why: "HKU removed — education is UMD only" },
  {
    re: /honors\s+thesis|thesis\s+defen/i,
    why: "no thesis claim — honors = research-track membership only",
  },
];

// "contributed to" is allowed only inside this exact sentence (Card A).
const CCD_ALLOWLIST =
  "Contributed to an open source project: 4 merged pull requests to warnerem/CCD-data-archive";
const CONTRIBUTED = /contributed to/gi;

// PROXIMITY lock: "merged" within 200 chars of "lambeq".
const PROXIMITY = [{ a: /merged/gi, b: /lambeq/gi, radius: 200, why: "'merged' near 'lambeq'" }];

// ---------------------------------------------------------------------------
const TEXT_EXT = /\.(ts|tsx|js|jsx|mjs|css|html|md|json|svg|txt|xml|webmanifest)$/i;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const files = [
  ...walk(join(root, "src")),
  ...walk(join(root, "public")),
  join(root, "index.html"),
  join(root, "experience", "index.html"),
  join(root, "projects", "index.html"),
  join(root, "404.html"),
  join(root, "README.md"),
]
  .filter((p) => TEXT_EXT.test(p) && existsSync(p))
  // Third-party font licence texts are excluded, and the exclusion is narrow on purpose.
  .filter((p) => !/public\/fonts\/LICENSE-[\w-]+\.txt$/.test(p.replace(/\\/g, "/")));

const problems = [];
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

// Decorative SVG path data (the `d="…"` coordinate runs in brand logos) is not site copy.
function maskSvgPathData(text) {
  return text.replace(/(\sd=")([^"]*)(")/g, (_, open, data, close) =>
    open + " ".repeat(data.length) + close,
  );
}

function scan(rel, text) {
  const scannable = maskSvgPathData(text);
  for (const { re, why } of FORBIDDEN) {
    const m = scannable.match(re);
    if (m)
      problems.push(
        `${rel}:${lineOf(scannable, m.index)}: forbidden — ${why} (matched ${JSON.stringify(m[0])})`,
      );
  }

  // "contributed to" outside the allowlisted CCD sentence.
  const scrubbed = text.split(CCD_ALLOWLIST).join("");
  for (const m of scrubbed.matchAll(CONTRIBUTED))
    problems.push(
      `${rel}: "contributed to" outside the one allowed CCD-data-archive sentence (near offset ${m.index})`,
    );

  for (const { a, b, radius, why } of PROXIMITY) {
    const posA = [...text.matchAll(a)].map((m) => m.index);
    const posB = [...text.matchAll(b)].map((m) => m.index);
    for (const i of posA)
      for (const j of posB)
        if (Math.abs(i - j) <= radius)
          problems.push(
            `${rel}:${lineOf(text, Math.min(i, j))}: framing tripwire — ${why} (offsets ${i}/${j})`,
          );
  }
}

let corpus = "";
for (const file of files) {
  const text = readFileSync(file, "utf8");
  corpus += text + "\n";
  scan(relative(root, file), text);
}

for (const s of REQUIRED)
  if (!corpus.includes(s))
    problems.push(`REQUIRED string missing from the scanned corpus: ${JSON.stringify(s)}`);

const contentSrc = readFileSync(join(root, "src", "content.ts"), "utf8");
for (const s of REQUIRED_IN_CONTENT)
  if (!contentSrc.includes(s))
    problems.push(
      `RENDERED-VALUE missing from src/content.ts: ${JSON.stringify(s)} — this is checked against content.ts alone, because a mention in any comment would otherwise satisfy it`,
    );

// NO em-dashes IN rendered copy (owner request, 2026-08-07). Checked against src/content.ts and the four
// HTML entries — the surfaces that produce visible text.
{
  const rendered = [
    ["src/content.ts", /"((?:[^"\\]|\\.)*)"/g],
  ];
  for (const [file, re] of rendered) {
    const text = readFileSync(join(root, file), "utf8");
    for (const m of text.matchAll(re))
      if (m[1].includes("\u2014"))
        problems.push(
          `${file}: em-dash in a rendered string (owner asked for none): ${JSON.stringify(m[1].slice(0, 70))}`,
        );
  }
  for (const f of ["index.html", "experience/index.html", "projects/index.html", "404.html"]) {
    const text = readFileSync(join(root, f), "utf8");
    // <title>, og:title and <noscript> are the rendered text in these shells.
    for (const m of text.matchAll(/<title>([^<]*)<\/title>|<noscript>([\s\S]*?)<\/noscript>|og:title" content="([^"]*)"/g)) {
      const seg = m[1] ?? m[2] ?? m[3] ?? "";
      if (seg.includes("\u2014"))
        problems.push(`${f}: em-dash in rendered page text: ${JSON.stringify(seg.slice(0, 70))}`);
    }
  }
}

// 5. derived number lock — the rendered lodestone prose must agree with the committed benchmark,
// arithmetically.
const BENCH = join(root, "benchmarks", "lodestone", "bench_50k_128d.txt");
if (existsSync(BENCH)) {
  const bench = readFileSync(BENCH, "utf8");
  const oracle = Number(bench.match(/oracle:\s*(\d+)\s*QPS/i)?.[1]);
  // The HNSW table only — the IVF-PQ table has the same row shape, so the parse
  // is scoped to the section between the two headings.
  const hnswBlock = bench.slice(
    bench.indexOf("## HNSW"),
    bench.indexOf("## IVF-PQ") >= 0 ? bench.indexOf("## IVF-PQ") : undefined,
  );
  const rows = [...hnswBlock.matchAll(/^\|\s*(\d+)\s*\|\s*([\d.]+)\s*\|\s*(\d+)\s*\|/gm)].map((m) => ({
    ef: Number(m[1]),
    recall: Number(m[2]),
    qps: Number(m[3]),
  }));

  if (!oracle || rows.length < 3) {
    problems.push(
      `derived-number lock: could not parse the benchmark (oracle=${oracle}, ${rows.length} HNSW rows) — the lock must never silently pass`,
    );
  } else {
    // The band the site is allowed to quote: rows at or above the 0.90 recall floor the page itself draws.
    const band = rows.filter((r) => r.recall >= 0.9);
    const ratios = band.map((r) => r.qps / oracle);
    const maxRatio = Math.max(...ratios);
    const minRatio = Math.min(...ratios);
    const best = band.reduce((a, b) => (b.qps > a.qps ? b : a));

    // Every "<N>x" the site claims about this benchmark must fall inside the
    // measured band (1x tolerance for honest rounding of a ratio).
    for (const m of corpus.matchAll(/(\d{1,3}(?:\.\d)?)\s*[x×]\s*(?:the\s+)?(?:exact|brute|oracle)/gi)) {
      const claimed = Number(m[1]);
      if (claimed > maxRatio + 1)
        problems.push(
          `derived-number lock: "${m[0].trim()}" exceeds the measured band — the benchmark's best ≥0.90-recall row is ${best.qps} q/s against a ${oracle} q/s oracle (${maxRatio.toFixed(1)}x)`,
        );
    }
    // The stated band's endpoints must be the real endpoints.
    for (const m of corpus.matchAll(/(\d{1,3})\s*[–-]\s*(\d{1,3})\s*[x×]\s*across/gi)) {
      const [lo, hi] = [Number(m[1]), Number(m[2])];
      if (lo < Math.floor(minRatio) || hi > Math.ceil(maxRatio))
        problems.push(
          `derived-number lock: band "${m[0].trim()}" is not the measured ≥0.90 band (${minRatio.toFixed(1)}x–${maxRatio.toFixed(1)}x)`,
        );
    }
    // Recall and QPS: whatever the prose quotes for the headline row has to
    // round to the row the benchmark actually contains.
    for (const m of corpus.matchAll(/([01]\.\d{3})\s*(?:HNSW\s*)?recall@10/gi)) {
      const claimed = Number(m[1]);
      // Both tables again: 0.975 is IVF-PQ's (0.9748), not an HNSW row.
      const allRecall = [...bench.matchAll(/^\|\s*\d+\s*\|\s*([\d.]+)\s*\|\s*\d+\s*\|/gm)].map((x) =>
        Number(x[1]),
      );
      if (!allRecall.some((r) => Math.abs(r - claimed) < 0.0006))
        problems.push(
          `derived-number lock: recall@10 of ${claimed} matches no row in the benchmark (${allRecall.join(", ")})`,
        );
    }
    for (const m of corpus.matchAll(/~?\s*(\d{1,3}(?:,\d{3})?|\d{1,3}\.\d)\s*(K\s*)?(?:queries per second|q\/s|queries\/sec)/gi)) {
      const raw = Number(m[1].replace(/,/g, "")) * (m[2] ? 1000 : 1);
      if (raw < 500) continue; // the IVF-PQ rows and the oracle are quoted too
      // Every measured QPS in the file is legal to quote, not just the HNSW rows: the ivf-pq table and the
      // generated figure's own transcription both legitimately carry theirs.
      const allQps = [...bench.matchAll(/^\|\s*\d+\s*\|\s*[\d.]+\s*\|\s*(\d+)\s*\|/gm)].map((x) =>
        Number(x[1]),
      );
      const near = [...allQps, oracle].some((q) => Math.abs(q - raw) / q < 0.02);
      if (!near)
        problems.push(
          `derived-number lock: ${m[0].trim()} is within 2% of no QPS value measured in the benchmark (${allQps.join(", ")}, oracle ${oracle})`,
        );
    }
  }
}


// Rendered-text lock on the built projects page, if a build exists. The built entry is a client-rendered
// shell, so this mostly guards inlined head/meta text; verify.mjs re-checks the same lock on the fully rendered DOM.
const distProjects = join(root, "dist", "projects", "index.html");
if (existsSync(distProjects)) {
  const html = readFileSync(distProjects, "utf8");
  const rendered = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ");
  for (const { a, b, radius, why } of PROXIMITY) {
    const posA = [...rendered.matchAll(a)].map((m) => m.index);
    const posB = [...rendered.matchAll(b)].map((m) => m.index);
    for (const i of posA)
      for (const j of posB)
        if (Math.abs(i - j) <= radius)
          problems.push(`dist/projects/index.html: framing tripwire — ${why}`);
  }
}

if (problems.length) {
  console.error("CHECK-FACTS FAILED:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log(`check-facts OK (${files.length} files scanned, ${REQUIRED.length} required strings)`);
