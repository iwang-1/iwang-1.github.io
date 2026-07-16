// Fact/framing gate — runs as `prebuild` and in CI before deploy.
//
// Scans src/**/*.{ts,tsx,css}, every HTML entry (index.html, experience/,
// projects/, 404.html), text files in public/, and README.md.
//   1. REQUIRED exact strings — the locked numbers/claims must appear
//      somewhere in the scanned corpus (they live in src/content.ts).
//   2. FORBIDDEN patterns — per-file, reported with line numbers.
//   3. PROXIMITY locks — "merged" may never appear within 200 characters of
//      "lambeq" (checked per file, and on dist/projects/index.html if built).
//   4. "contributed to" is allowed ONLY inside the one CCD-data-archive
//      sentence (exact-string allowlist).
//
// Human companion checklist: FACTS.md (maps every rendered number to its
// source). FACTS.md is deliberately OUTSIDE the scan set so it can describe
// the rules it enforces. A separate, private pre-push confidentiality scan
// (deliberately NOT part of this repo) runs before anything is pushed.
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
].filter((p) => TEXT_EXT.test(p) && existsSync(p));

const problems = [];
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

// Decorative SVG path data (the `d="…"` coordinate runs in brand logos) is not
// site copy — its number soup can coincidentally look like a phone number or a
// banned figure. Blank those values out (same length, so offsets/line numbers
// stay exact) before the number/voice tripwires run. Every other check still
// sees the real text.
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

// Rendered-text lock on the built projects page, if a build exists. The built
// entry is a client-rendered shell, so this mostly guards inlined head/meta
// text; verify.mjs re-checks the same lock on the fully rendered DOM.
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
