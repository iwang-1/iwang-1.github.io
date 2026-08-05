// GENERATED FILE — DO NOT EDIT BY HAND.
//
// Written by scripts/generate-figures.mjs, which runs as the first half of
// `prebuild`. Every number below is parsed from the benchmark file named in
// SWEEP_SOURCE and asserted, at generation time, to be a byte-exact substring of
// it. Hand-editing this file breaks that guarantee silently: the next build
// overwrites your edit, and until it does, the figure is claiming something its
// cited file does not say.
//
// To change what this figure shows, change the generator. To change what it
// measures, change the benchmark.
//
//   source      benchmarks/lodestone/bench_50k_128d.txt
//   sha256      3c918d5f490c9e810f4e4f48f7e7c400155824dbedb9ae3ad1fa5161cadc9978
//   captured    20260716T005157Z
//   host        Intel(R) Xeon(R) Platinum 8488C, 48 vCPU
//   run         n=50000 dim=128 queries=1000 k=10 backend=avx512
//   parsed      10 samples (HNSW ef 16/32/64/128/256, IVF-PQ nprobe 1/4/8/16/32) + oracle 971 q/s
//   palette     --ink-data=#33566e · --ink-accent=#7a2e12 · --ink-secondary=#5a554b · --rule=#7a766e · --rule-soft=#c1bcb1 · --surface-figure=#d9d2c2
//               (read from src/styles/tokens.css; the markup emits var() refs,
//                so no hex is duplicated anywhere in the source tree)

/** One measured sample, at the source file's own precision. `qpsDisplay` is
 *  `qps` with thousands separators inserted and nothing else changed. */
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
 *  two series interleave: ef=256 sits between nprobe=4 and nprobe=1. Grouping
 *  the rows by series would silently falsify that caption. */
export const SWEEP_SAMPLES: readonly SweepSample[] = [
  { series: "IVF-PQ", setting: "nprobe=32", recall: "0.9747", qps: "1229", qpsDisplay: "1,229", readout: "nprobe=32 · recall 0.9747 · 1,229 q/s · single core" },
  { series: "IVF-PQ", setting: "nprobe=16", recall: "0.9747", qps: "2305", qpsDisplay: "2,305", readout: "nprobe=16 · recall 0.9747 · 2,305 q/s · single core" },
  { series: "IVF-PQ", setting: "nprobe=8", recall: "0.9748", qps: "4110", qpsDisplay: "4,110", readout: "nprobe=8 · recall 0.9748 · 4,110 q/s · single core" },
  { series: "IVF-PQ", setting: "nprobe=4", recall: "0.9409", qps: "6128", qpsDisplay: "6,128", readout: "nprobe=4 · recall 0.9409 · 6,128 q/s · single core" },
  { series: "HNSW", setting: "ef=256", recall: "1.0000", qps: "8898", qpsDisplay: "8,898", readout: "ef=256 · recall 1.0000 · 8,898 q/s · single core" },
  { series: "IVF-PQ", setting: "nprobe=1", recall: "0.4850", qps: "9797", qpsDisplay: "9,797", readout: "nprobe=1 · recall 0.4850 · 9,797 q/s · single core" },
  { series: "HNSW", setting: "ef=128", recall: "1.0000", qps: "13514", qpsDisplay: "13,514", readout: "ef=128 · recall 1.0000 · 13,514 q/s · single core" },
  { series: "HNSW", setting: "ef=64", recall: "0.9964", qps: "20946", qpsDisplay: "20,946", readout: "ef=64 · recall 0.9964 · 20,946 q/s · single core" },
  { series: "HNSW", setting: "ef=32", recall: "0.9759", qps: "31845", qpsDisplay: "31,845", readout: "ef=32 · recall 0.9759 · 31,845 q/s · single core" },
  { series: "HNSW", setting: "ef=16", recall: "0.8996", qps: "47335", qpsDisplay: "47,335", readout: "ef=16 · recall 0.8996 · 47,335 q/s · single core" },
];

/** The annotated sample: the fastest HNSW setting still above the 0.90 reference
 *  line the figure draws. It is the figure's server-rendered default state, and
 *  this exact string is what src/enhance.ts joins the crosshair to. */
export const SWEEP_KNEE: SweepSample = SWEEP_SAMPLES[8];

/** The exact brute-force baseline, and its own disclosure. It runs across all
 *  48 cores while every sample above runs on one, so the two sides of any ratio
 *  between them are not core-for-core. */
export const SWEEP_ORACLE = {
  qps: "971",
  qpsDisplay: "971",
  note: "parallel, full corpus scan",
} as const;

/** Measurement conditions, read from the source file's run header. */
export const SWEEP_RUN = {
  n: "50000",
  nDisplay: "50,000",
  dim: "128",
  queries: "1000",
  k: "10",
  backend: "avx512",
  host: "Intel(R) Xeon(R) Platinum 8488C, 48 vCPU",
} as const;

/** Where the numbers come from, for the footnote that links to it. */
export const SWEEP_SOURCE = {
  file: "benchmarks/raw/bench_50k_128d.txt",
  name: "bench_50k_128d.txt",
  href: "https://github.com/iwang-1/lodestone/blob/main/benchmarks/raw/bench_50k_128d.txt",
  sha256: "3c918d5f490c9e810f4e4f48f7e7c400155824dbedb9ae3ad1fa5161cadc9978",
} as const;

/** THE FIGURE. A static inline SVG in datasheet grammar, animated by CSS
 *  keyframes INSIDE the element — no <script>, no SMIL — so the walking cursor
 *  runs with JavaScript fully disabled and the numbers it visits are already in
 *  the static markup either way. Injected as markup because it is generated
 *  output, not a component: nothing here is meant to be edited by hand. */
export const SWEEP_SVG = `<svg class="sweep-plot" viewBox="0 0 680 360" role="img" aria-label="Recall at k=10 against queries per second on a log scale, drawn as a force-travel trace. HNSW is the solid trace and trades recall for throughput at a knee at ef=32; IVF-PQ is the dashed trace and holds lower throughput at comparable recall.">
  <style>
    .sweep-plot { font-family: var(--font-mono); }
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
       10s linear pass, forever, in CSS, inside the SVG: no script and no SMIL,
       so it runs with JavaScript fully disabled. It is enhancement only — every
       number it visits is already in the static markup and in the transcription
       table below the drawing, so nothing it does constitutes proof. */
    .sweep-plot .sweep-walk {
      fill: none;
      stroke: var(--ink-accent);
      stroke-width: 1.5;
      pointer-events: none;
      transform: translate(507.3px, 79.3px);
      animation: sweep-walk 10s linear infinite;
    }

    @keyframes sweep-walk {
      0%, 16.57% { transform: translate(368.6px, 69.2px); }
      16.67%, 33.23% { transform: translate(414px, 69.2px); }
      33.33%, 49.9% { transform: translate(461.7px, 70.7px); }
      50%, 66.57% { transform: translate(507.3px, 79.3px); }
      66.67%, 83.23% { transform: translate(550.4px, 111.4px); }
      83.33%, 100% { transform: translate(507.3px, 79.3px); }
    }

    /* A reader who takes over the cursor is not competing with it. Pure CSS, so
       the pause costs nothing and exists on the no-script render too. */
    .sweep:hover .sweep-plot .sweep-walk,
    .sweep:focus-within .sweep-plot .sweep-walk { animation-play-state: paused; }

    /* REDUCED MOTION: the walk stops and the cursor parks on the annotated
       default sample, which is where the static figure already points. The
       figure loses a moving dot and no evidence. */
    @media (prefers-reduced-motion: reduce) {
      .sweep-plot .sweep-walk { animation: none; transform: translate(507.3px, 79.3px); }
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
    }
  </style>

  <!-- the field: a closed frame with an interior grid, the way a datasheet
       boxes its measurement area -->
  <g class="sweep-grid">
    <line x1="92" y1="69.2" x2="596" y2="69.2" />
    <line x1="92" y1="90.2" x2="596" y2="90.2" />
    <line x1="92" y1="111.2" x2="596" y2="111.2" />
    <line x1="92" y1="153.2" x2="596" y2="153.2" />
    <line x1="92" y1="195.2" x2="596" y2="195.2" />
    <line x1="92" y1="237.2" x2="596" y2="237.2" />
    <line x1="92" y1="279.2" x2="596" y2="279.2" />
    <line x1="206.2" y1="44" x2="206.2" y2="296" />
    <line x1="305.9" y1="44" x2="305.9" y2="296" />
    <line x1="381.3" y1="44" x2="381.3" y2="296" />
    <line x1="456.7" y1="44" x2="456.7" y2="296" />
    <line x1="556.3" y1="44" x2="556.3" y2="296" />
  </g>
  <rect class="sweep-frame" x="92" y="44" width="504" height="252" />

  <!-- the reference level, dashed and named: a datasheet marks actuation and
       bottom-out this way. The fast end of the solid trace crosses BELOW it,
       which is the honest part of this figure. -->
  <line class="sweep-reference" x1="92" y1="111.2" x2="596" y2="111.2" />
  <text class="sweep-reference-label" x="100" y="124">recall 0.90 floor ·<tspan x="100" dy="11">ef=16 falls below it</tspan></text>

  <!-- inward ticks -->
  <g class="sweep-axis">
    <line x1="206.2" y1="296" x2="206.2" y2="291" />
    <line x1="305.9" y1="296" x2="305.9" y2="291" />
    <line x1="381.3" y1="296" x2="381.3" y2="291" />
    <line x1="456.7" y1="296" x2="456.7" y2="291" />
    <line x1="556.3" y1="296" x2="556.3" y2="291" />
    <line x1="92" y1="69.2" x2="97" y2="69.2" />
    <line x1="92" y1="90.2" x2="97" y2="90.2" />
    <line x1="92" y1="111.2" x2="97" y2="111.2" />
    <line x1="92" y1="153.2" x2="97" y2="153.2" />
    <line x1="92" y1="195.2" x2="97" y2="195.2" />
    <line x1="92" y1="237.2" x2="97" y2="237.2" />
    <line x1="92" y1="279.2" x2="97" y2="279.2" />
  </g>

  <g class="sweep-tick sweep-tick-x">
    <text x="206.2" y="314">2K</text>
    <text x="305.9" y="314">5K</text>
    <text x="381.3" y="314">10K</text>
    <text x="456.7" y="314">20K</text>
    <text x="556.3" y="314">50K</text>
  </g>
  <g class="sweep-tick sweep-tick-y">
    <text x="82" y="72.7">1.00</text>
    <text x="82" y="93.7">0.95</text>
    <text x="82" y="114.7">0.90</text>
    <text x="82" y="156.7">0.80</text>
    <text x="82" y="198.7">0.70</text>
    <text x="82" y="240.7">0.60</text>
    <text x="82" y="282.7">0.50</text>
  </g>
  <text class="sweep-axis-title" x="344" y="340">THROUGHPUT (QUERIES / SECOND, LOG SCALE)</text>
  <text class="sweep-axis-title" x="26" y="169.8" transform="rotate(-90 26 169.8)">RECALL (AT k=10, 0 TO 1)</text>

  <!-- the legend. Rows and label strings come from LEGEND_ROWS, which the
       collision solver above also reads, so the drawn legend and the obstacle it
       represents can never be two different rectangles. -->
  <g class="sweep-legend">
    <line x1="98" y1="200" x2="112" y2="200" />
    <text x="118" y="204">HNSW m=16</text>
    <line class="sweep-legend-ivf" x1="98" y1="222" x2="112" y2="222" />
    <text x="118" y="226">IVF-PQ nlist=256 m=32</text>
    <path class="sweep-legend-oracle" d="M 98 244 L 112 244 M 105 240 L 105 248" />
    <text x="118" y="248">oracle · exact brute force</text>
  </g>

  <!-- the oracle: the thing the index is being compared against -->
  <g class="sweep-oracle">
    <path d="M 121.6 69.2 L 133.6 69.2 M 127.6 63.2 L 127.6 75.2" />
    <text x="138.6" y="64">oracle · 971 q/s exact · 48 cores</text>
  </g>

  <!-- the two strokes: solid is HNSW sweeping ef, dashed is IVF-PQ sweeping
       nprobe. Told apart by dash, never by hue. -->
  <path class="sweep-line sweep-line-ivf" d="M 153.2 79.8 L 221.6 79.8 L 284.5 79.8 L 328 94 L 379 285.5" />
  <path class="sweep-line sweep-line-hnsw" d="M 368.6 69.2 L 414 69.2 L 461.7 70.7 L 507.3 79.3 L 550.4 111.4" />

  <!-- the crosshair, defaulting to the annotated sample so the annotated state
       is the state the static HTML ships in. src/enhance.ts only moves it by
       rewriting --sweep-x / --sweep-y on the <figure>. -->
  <g class="sweep-crosshair" aria-hidden="true">
    <line class="sweep-crosshair-v" x1="0" y1="44" x2="0" y2="296" />
    <line class="sweep-crosshair-h" x1="92" y1="0" x2="596" y2="0" />
    <circle class="sweep-crosshair-dot" cx="0" cy="0" r="6.5" />
  </g>

  <!-- every sample carries its own plot coordinate and its own readout string,
       so src/enhance.ts needs no copy of this table and no arithmetic. Label
       positions are solved above and asserted collision-free. -->
  <g class="sweep-samples">
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="153.2" data-sweep-y="79.8" data-sweep-readout="nprobe=32 · recall 0.9747 · 1,229 q/s · single core">
      <circle cx="153.2" cy="79.8" r="4" />
      <text x="153.2" y="93.9">nprobe=32</text>
    </g>
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="221.6" data-sweep-y="79.8" data-sweep-readout="nprobe=16 · recall 0.9747 · 2,305 q/s · single core">
      <circle cx="221.6" cy="79.8" r="4" />
      <text x="221.6" y="105.9">nprobe=16</text>
    </g>
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="284.5" data-sweep-y="79.8" data-sweep-readout="nprobe=8 · recall 0.9748 · 4,110 q/s · single core">
      <circle cx="284.5" cy="79.8" r="4" />
      <text class="sweep-label-start" x="292.5" y="77.3">nprobe=8</text>
    </g>
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="328" data-sweep-y="94" data-sweep-readout="nprobe=4 · recall 0.9409 · 6,128 q/s · single core">
      <circle cx="328" cy="94" r="4" />
      <text class="sweep-label-start" x="336" y="93.5">nprobe=4</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw" data-sweep-x="368.6" data-sweep-y="69.2" data-sweep-readout="ef=256 · recall 1.0000 · 8,898 q/s · single core">
      <circle cx="368.6" cy="69.2" r="4" />
      <text x="368.6" y="105.8">ef=256</text>
    </g>
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="379" data-sweep-y="285.5" data-sweep-readout="nprobe=1 · recall 0.4850 · 9,797 q/s · single core">
      <circle cx="379" cy="285.5" r="4" />
      <text class="sweep-label-end" x="371" y="285">nprobe=1</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw" data-sweep-x="414" data-sweep-y="69.2" data-sweep-readout="ef=128 · recall 1.0000 · 13,514 q/s · single core">
      <circle cx="414" cy="69.2" r="4" />
      <text class="sweep-label-start" x="422" y="60.7">ef=128</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw" data-sweep-x="461.7" data-sweep-y="70.7" data-sweep-readout="ef=64 · recall 0.9964 · 20,946 q/s · single core">
      <circle cx="461.7" cy="70.7" r="4" />
      <text x="461.7" y="84.8">ef=64</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw sweep-sample-knee" data-sweep-x="507.3" data-sweep-y="79.3" data-sweep-readout="ef=32 · recall 0.9759 · 31,845 q/s · single core">
      <circle cx="507.3" cy="79.3" r="4" />
      <text x="507.3" y="67.7">ef=32</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw" data-sweep-x="550.4" data-sweep-y="111.4" data-sweep-readout="ef=16 · recall 0.8996 · 47,335 q/s · single core">
      <circle cx="550.4" cy="111.4" r="4" />
      <text x="550.4" y="125.5">ef=16</text>
    </g>
  </g>

  <!-- the walking cursor: CSS keyframes, 6 stops, 10s, no script -->
  <circle class="sweep-walk" cx="0" cy="0" r="7" aria-hidden="true" />

  <!-- the annotation, in the markup, so it is the figure's default state and
       not a hover reward -->
  <g class="sweep-callout">
    <circle class="sweep-callout-ring" cx="507.3" cy="79.3" r="8" />
    <path class="sweep-callout-leader" d="M 507.3 71.3 L 536 46 L 670 46" />
    <text class="sweep-callout-label" x="672" y="22">ef=32 · recall 0.9759 ·<tspan x="672" dy="16">31,845 q/s</tspan></text>
  </g>

  <!-- THE TITLE BLOCK, bottom-right, where a datasheet puts it: the conditions
       the trace was measured under, read from the source file's own run header.
       Backed by the plate colour so the grid does not read through it. -->
  <g class="sweep-block">
    <rect x="432" y="230" width="163" height="65" />
    <line class="sweep-block-rule" x1="432" y1="230" x2="595" y2="230" />
    <text class="sweep-block-key" x="440" y="245">TEST CONDITIONS</text>
    <text x="440" y="259">n=50,000 · d=128</text>
    <text x="440" y="273">k=10 · 1 core</text>
    <text x="440" y="287">avx512 · Xeon 8488C</text>
  </g>
</svg>`;
