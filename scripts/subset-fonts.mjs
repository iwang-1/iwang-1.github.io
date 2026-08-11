// Font subsetter.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { TextDecoder } from "node:util";

const OUT = "public/fonts";
mkdirSync(OUT, { recursive: true });

// Repertoire The site is English prose plus measured numbers.
const CORE = [
  "U+0020-007E", // printable ASCII
  "U+00A0", // nbsp
  "U+00A9", // © footer colophon
  "U+00B0", // ° margin
  "U+00B5", // µ microseconds
  "U+00B7", // · the separator this site runs on
  "U+00D7", // × margin ("50,000 × 128-d")
  "U+2013", // – en dash, date ranges
  "U+2014", // — em dash
  "U+2018-2019", // ‘ ’
  "U+201C-201D", // “ ” margin
  "U+2026", // … margin
  "U+2212", // − true minus
].join(",");

// U+2020 † (the footnote dagger, which this site's whole footnote convention rests on) is not in either
// family's `latin` file — upstream ships it in the `latin-ext` file.
const SUPPLEMENT = "U+2020";

// Layout features kept. Deliberately narrow: kerning, plus the contextual and composition machinery the
// variable fonts need to render correctly.
const FEATURES = "kern,liga,calt,ccmp,locl,rvrn";

const FAMILIES = [
  {
    id: "martian-mono",
    // The wdth-axis build. Its fvar default is 112.5 (min 75, max 112.5) — the width the contract names —
    // so pinning wdth=112.5 drops an axis we never vary while keeping the drawing we chose.
    axes: ["wght=400:700", "wdth=112.5"],
    latin: "node_modules/@fontsource-variable/martian-mono/files/martian-mono-latin-wdth-normal.woff2",
    ext: "node_modules/@fontsource-variable/martian-mono/files/martian-mono-latin-ext-wdth-normal.woff2",
    out: "martian-mono-latin-400-700.woff2",
    outExt: "martian-mono-sup-400-700.woff2",
  },
  {
    id: "familjen-grotesk",
    // The wght-normal build only.
    axes: ["wght=400:700"],
    latin: "node_modules/@fontsource-variable/familjen-grotesk/files/familjen-grotesk-latin-wght-normal.woff2",
    ext: "node_modules/@fontsource-variable/familjen-grotesk/files/familjen-grotesk-latin-ext-wght-normal.woff2",
    out: "familjen-grotesk-latin-400-700.woff2",
    outExt: "familjen-grotesk-sup-400-700.woff2",
  },
];

const py = (mod, args) =>
  execFileSync("python3", ["-m", mod, ...args], {
    stdio: ["ignore", "pipe", "pipe"],
    // Reproducibility. woff2 writes head.modified from the clock, so without this every regeneration
    // produced four different files with identical content — measured: all four md5s changed across two back-to-back.
    env: { ...process.env, SOURCE_DATE_EPOCH: "1754265600" }, // 2025-08-04T00:00:00Z
  });

function cut({ src, axes, unicodes, dest }) {
  if (!existsSync(src)) throw new Error(`missing source font: ${src} — run npm install`);
  const tmp = join("/tmp", `subset-${Math.random().toString(36).slice(2)}.ttf`);
  py("fontTools.varLib.instancer", [src, ...axes, "--output", tmp]);
  py("fontTools.subset", [
    tmp,
    `--unicodes=${unicodes}`,
    `--layout-features=${FEATURES}`,
    "--flavor=woff2",
    "--no-hinting",
    "--desubroutinize",
    // Name IDs kept, and 0/13/14 are a licence obligation, not tidiness.
    "--name-IDs=0,1,2,3,4,5,6,13,14",
    `--output-file=${dest}`,
  ]);
  rmSync(tmp, { force: true });
  return statSync(dest).size;
}

/** Codepoints an upstream .woff2 actually contains (not what its CSS claims). */
function upstreamCoverage(src) {
  const out = execFileSync(
    "python3",
    [
      "-c",
      "import sys;from fontTools.ttLib import TTFont;print(' '.join(str(c) for c in sorted(TTFont(sys.argv[1]).getBestCmap())))",
      src,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  return new Set(new TextDecoder().decode(out).trim().split(/\s+/).map(Number));
}

let total = 0;
const coverage = new Map(); // family id -> Set of codepoints shipped
console.log("");
for (const f of FAMILIES) {
  const beforeLatin = statSync(f.latin).size;
  const afterLatin = cut({ src: f.latin, axes: f.axes, unicodes: CORE, dest: join(OUT, f.out) });
  const afterExt = cut({ src: f.ext, axes: f.axes, unicodes: SUPPLEMENT, dest: join(OUT, f.outExt) });
  total += afterLatin + afterExt;
  console.log(
    `${f.out.padEnd(40)} ${String(beforeLatin).padStart(6)} B -> ${String(afterLatin).padStart(6)} B` +
      `  (${(100 - (afterLatin / beforeLatin) * 100).toFixed(1)}% smaller)`,
  );
  console.log(`${f.outExt.padEnd(40)}        ${" ".repeat(4)} ${String(afterExt).padStart(6)} B  (dagger only)`);

  const shipped = new Set();
  for (const src of [join(OUT, f.out), join(OUT, f.outExt)])
    for (const c of upstreamCoverage(src)) shipped.add(c);
  coverage.set(f.id, { shipped, upstream: new Set([...upstreamCoverage(f.latin), ...upstreamCoverage(f.ext)]) });
}
console.log(`\nshipped font total: ${total} B (${(total / 1024).toFixed(1)} KiB) across ${FAMILIES.length * 2} files`);

// Honesty check on the cut Two distinct failure modes, and they must not be confused: (a) a character the
// site renders that upstream has but this cut dropped -> a bug in this script.
if (!existsSync("dist/index.html")) {
  console.log("\nrepertoire check SKIPPED (no dist/ — run `npm run build` first).");
  process.exit(0);
}
const rendered = new Set();
for (const f of [
  "dist/index.html",
  "dist/experience/index.html",
  "dist/projects/index.html",
  "dist/404.html",
]) {
  if (!existsSync(f)) continue;
  for (const ch of readFileSync(f, "utf8").replace(/<[^>]*>/g, " ")) {
    const c = ch.codePointAt(0);
    if (c > 0x1f) rendered.add(c);
  }
}
const show = (c) => `U+${c.toString(16).toUpperCase().padStart(4, "0")} ${JSON.stringify(String.fromCodePoint(c))}`;
let dropped = 0;
for (const [id, { shipped, upstream }] of coverage) {
  const missing = [...rendered].filter((c) => !shipped.has(c)).sort((a, b) => a - b);
  const myFault = missing.filter((c) => upstream.has(c));
  const noSuchGlyph = missing.filter((c) => !upstream.has(c));
  console.log(`\n${id}: ships ${shipped.size} codepoints; covers ${rendered.size - missing.length}/${rendered.size} rendered characters.`);
  if (noSuchGlyph.length)
    console.log(
      `  NOT IN THE TYPEFACE (any upstream file) — needs a named fallback in tokens.css:\n    ` +
        noSuchGlyph.map(show).join("\n    "),
    );
  if (myFault.length) {
    dropped += myFault.length;
    console.error(`  DROPPED BY THIS CUT (upstream has them) — fix the ranges above:\n    ` + myFault.map(show).join("\n    "));
  }
}
if (dropped) {
  console.error("\nSUBSET INCOMPLETE — see DROPPED BY THIS CUT above.");
  process.exit(1);
}
console.log("\nsubset OK — nothing the site renders was dropped by the cut.");
