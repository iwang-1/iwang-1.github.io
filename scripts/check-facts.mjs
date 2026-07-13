// Fact/framing gate — run before every build and in CI before deploy.
// Scans src/, index.html, public/ (text files), and README.md. Exits 1 on any
// hit. Human companion checklist: FACTS.md (maps every rendered number to its
// source).
//
// Note: a separate, private pre-push scan (deliberately NOT part of this repo
// or its history) is run by the publish script before anything is pushed.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ---------------------------------------------------------------------------
// 1. Framing tripwires.
const TRIPWIRES = [
  /qnlp_lorenz/i, // the fork must appear nowhere
  /(?<![\d.])219(?![\d.])/, // summed test count (bare integer; star coords like 219.91 are fine)
  /\b80(\.0)?\s?%/, // rounded classifier accuracy
  /\b99(\.0+)?\s?%/, // rounded classifier coverage
];

// Proximity tripwires: word A within `radius` chars of word B.
const PROXIMITY = [
  { a: /merged/gi, b: /lambeq/gi, radius: 200, why: "'merged' near 'lambeq'" },
  { a: /contributed/gi, b: /\bFIRE\b/g, radius: 200, why: "'contributed' near 'FIRE'" },
];

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
  join(root, "README.md"),
].filter((p) => TEXT_EXT.test(p));

const problems = [];

for (const file of files) {
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");

  for (const re of TRIPWIRES) {
    const m = text.match(re);
    if (m) problems.push(`${rel}: forbidden pattern ${re} (matched ${JSON.stringify(m[0])})`);
  }

  for (const { a, b, radius, why } of PROXIMITY) {
    const posA = [...text.matchAll(a)].map((m) => m.index);
    const posB = [...text.matchAll(b)].map((m) => m.index);
    for (const i of posA)
      for (const j of posB)
        if (Math.abs(i - j) <= radius)
          problems.push(`${rel}: framing tripwire — ${why} (offsets ${i}/${j})`);
  }
}

if (problems.length) {
  console.error("CHECK-FACTS FAILED:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log(`check-facts OK (${files.length} files scanned)`);
