import "./Sweep.css";

/** THE SWEEP — lodestone's committed recall-vs-throughput curve, as one
 *  inspectable figure.
 *
 *  Every sample point, every tick, every per-point label and the amber knee
 *  annotation are authored here in JSX, so the server-rendered (prerendered,
 *  no-JS, reduced-motion) figure is already complete. Nothing that constitutes
 *  proof appears only on hover: the crosshair in src/enhance.ts moves an
 *  annotation that is already sitting on the default sample.
 *
 *  Numbers: taken verbatim from the run committed at
 *  benchmarks/raw/bench_50k_128d.txt in the lodestone repo — the same file the
 *  published docs/benchmark.png plots. Oracle (exact brute force) 971 q/s at
 *  perfect recall. HNSW m=16 sweeps ef; IVF-PQ nlist=256 m=32 sweeps nprobe.
 *  Nothing is interpolated and nothing is rounded except the q/s figures in the
 *  readout strings, which carry a leading `~`.
 *
 *  Geometry: viewBox 680x360 user units. Plot box x 92..596, y 44..296.
 *  x is log10 over 700..72,000 q/s, y is linear recall over 0.46..1.06. The
 *  coordinate for every literal below was solved offline against those two
 *  mappings, then checked for label overlap, out-of-frame text and point/label
 *  collisions — which is why the values carry one decimal place.
 *
 *  Curve paths are literal `d="…"` attributes on purpose: that is the one form
 *  the repo's fact gate masks before its numeric tripwires run, so a coordinate
 *  run can never be mistaken for a claim. Axis labels are decimals, never
 *  percentages, for the same reason.
 *
 *  Unmounted on its own — a page has to place it. Pair it with the crosshair in
 *  src/enhance.ts, which finds this figure by its `.sweep` class and reads each
 *  sample's `data-sweep-*` attributes. No props: the figure IS the data, and a
 *  second copy of these numbers in a page file is a second thing to keep true. */

/** The ten measured samples, declared ONCE. Every number below is the value
 *  already carried by this figure's own `data-sweep-readout` strings — the run
 *  committed at benchmarks/raw/bench_50k_128d.txt. Nothing here is new, rounded
 *  or derived: the readout strings and the transcription table are now two
 *  renderings of one table instead of two copies of the same figures.
 *
 *  ORDERED BY THROUGHPUT ASCENDING, which is left-to-right on the log x-axis and
 *  therefore also the order the arrow keys walk (src/enhance.ts sorts on x). That
 *  order is load-bearing, not incidental: the transcription table below renders
 *  this array as-authored and its caption states the ordering, so this is the one
 *  array whose sequence a reader is told about. Grouping the rows by series is the
 *  obvious tidy-up and it would silently falsify both. The interleaved pair is the
 *  tell — ef=256 (~8.9K, x=368.6) sits BETWEEN nprobe=4 and nprobe=1 (~9.8K,
 *  x=379), which is exactly where the arrow keys visit it and exactly where a
 *  series-grouped table would not have it.
 *
 *  Plot COORDINATES stay as literal attributes on the markup below. They are
 *  hand-solved against the two axis mappings and individually nudged for label
 *  collisions, so they are geometry, not data — and the repo's fact gate only
 *  masks coordinate runs inside `d="…"`, which is why they are never expressed as
 *  numbers a reader could mistake for a claim. */
const SAMPLES = [
  { series: "IVF-PQ", setting: "nprobe=32", recall: "0.9747", qps: "~1.2K" },
  { series: "IVF-PQ", setting: "nprobe=16", recall: "0.9747", qps: "~2.3K" },
  { series: "IVF-PQ", setting: "nprobe=8", recall: "0.9748", qps: "~4.1K" },
  { series: "IVF-PQ", setting: "nprobe=4", recall: "0.9409", qps: "~6.1K" },
  { series: "HNSW", setting: "ef=256", recall: "1.0000", qps: "~8.9K" },
  { series: "IVF-PQ", setting: "nprobe=1", recall: "0.4850", qps: "~9.8K" },
  { series: "HNSW", setting: "ef=128", recall: "1.0000", qps: "~13.5K" },
  { series: "HNSW", setting: "ef=64", recall: "0.9964", qps: "~20.9K" },
  { series: "HNSW", setting: "ef=32", recall: "0.9759", qps: "~31.8K" },
  { series: "HNSW", setting: "ef=16", recall: "0.8996", qps: "~47.3K" },
] as const;

type Sample = (typeof SAMPLES)[number];
type Setting = Sample["setting"];

/** One readout string shape, so the crosshair's live text and the transcription
 *  table can never disagree about a sample. */
const readoutOf = (s: Sample) =>
  `${s.setting} · recall ${s.recall} · ${s.qps} q/s · single core`;

/** Settings → readout string, resolved once at module scope and keyed on the
 *  literal union of the settings above. A mistyped key is a TYPE ERROR (`npm run
 *  typecheck`, which `npm run build` runs first) rather than a runtime throw or,
 *  worse, an empty attribute the crosshair would silently skip. */
const READOUT: Record<Setting, string> = Object.fromEntries(
  SAMPLES.map((s) => [s.setting, readoutOf(s)]),
) as Record<Setting, string>;

/** The knee: the figure's server-rendered default state. */
const READOUT_DEFAULT = READOUT["ef=32"];

/** THE TRANSCRIPTION. The plot draws ten samples at once; the crosshair reports
 *  one at a time. Neither of those serves a reader who is at 400% zoom (where the
 *  plot pans and the per-point labels leave the window) or on a screen reader
 *  (where the SVG is one `role="img"` summary and the readout is a single live
 *  line). This table is the same ten samples as text, in one place, in the same
 *  order the axis and the arrow keys use.
 *
 *  Visually hidden rather than shown: the drawing IS the figure at every width
 *  the drawing is legible, and a second visible copy of ten rows would be the
 *  duplicated-legend defect this figure already fixed once. It is server-rendered
 *  markup, so it is in the static HTML with the bundle blocked — the same
 *  no-JS-proof contract every other number in this plate holds to.
 *
 *  The `.visually-hidden` class is on a WRAPPER, not on the <table>. That is not
 *  a style preference: the primitive's `width: 1px` is a MINIMUM for a CSS table,
 *  which sizes to its columns' min-content regardless, so hiding the table
 *  directly measured 605.5px wide and drove the home page into 285px of
 *  horizontal document overflow at 320w — the exact class of bug this batch is
 *  fixing. A block wrapper honours the 1px and `overflow: hidden` clips the table
 *  inside it, so the transcription costs zero layout at every width. */
function SweepTable() {
  return (
    <div className="visually-hidden">
      <table className="sweep-table">
        <caption>
          Figure 1, as measured values: ten samples, ordered by throughput.
        </caption>
        <thead>
          <tr>
            <th scope="col">Index</th>
            <th scope="col">Setting</th>
            <th scope="col">Recall at k=10</th>
            <th scope="col">Queries per second</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLES.map((s) => (
            <tr key={s.setting}>
              <th scope="row">{s.series}</th>
              <td>{s.setting}</td>
              <td>{s.recall}</td>
              <td>{s.qps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Sweep() {
  return (
    <figure
      className="plate sweep"
      tabIndex={0}
      role="group"
      aria-label="Figure 1: lodestone recall against throughput, ten measured samples. Move the pointer across the plot, or use the arrow keys, to read each sample."
    >
      <figcaption className="plate-label">
        FIG. 03 DETAIL · lodestone · recall vs throughput
      </figcaption>

      {/* THE GLOSS. The plate label above is machine grammar — "lodestone" is a
          repo name a reader has never seen, and a rotated log axis is not an
          introduction. The owner of this site looked at his own fold and asked
          what the graphic was, which is the whole argument for these two
          sentences: they name the object, claim it, and say which way is good,
          in body-size sans, before any axis has to be read. No number here — the
          numbers are in the callout, the readout and the footnote already. */}
      <p className="sweep-gloss">
        lodestone is a vector search engine I built in Rust. This is its benchmark: higher is more
        accurate, further right is faster, and each dot is one setting I measured.
      </p>

      {/* The plot keeps a minimum width and pans inside the plate rather than
          scaling its labels into illegibility on a phone. The numbers a reader
          actually needs are in the readout and footnote below, at body size,
          either way.

          IT KEEPS ITS TAB STOP, AND THE STOP IS NAMED. Below ~680px this div
          actually scrolls (measured pan: 38px at 640w, 256px at 390w, 326px at
          320w) and Chromium then makes it a keyboard tab stop by itself — which it
          did silently, as an unnamed DIV whose name computed from its own contents
          ("recall 0.90 floor ·ef=16 falls below it…"). An unlabelled emergent stop
          is a 4.1.2 defect, so the fix is to name it or to remove it, and the
          measurement decides: with JAVASCRIPT BLOCKED, Home on the <figure> pans
          0px — there is no crosshair to move — while ArrowLeft here pans 80px. On
          the no-JS render the whole proof story rests on, this is the ONLY keyboard
          route to the plot's left half, so removing the stop would delete a working
          affordance to tidy the tab order.
          NO `tabIndex` IS SET, deliberately. The UA heuristic already grants the
          stop exactly when the box scrolls and withholds it when it does not
          (measured: a stop at 640/390/320, none at 680/998/1366), so writing
          `tabIndex={0}` would have ADDED a dead stop at every desktop width — the
          mirror of the defect being fixed. `role="group"` is what makes the label
          count on a generic element; the label names the job this control does,
          which is panning, not measuring. The figure above still owns the
          sample-stepping contract. */}
      <div
        className="sweep-scroll"
        role="group"
        aria-label="lodestone plot, pannable — move across the figure with the arrow keys"
      >
      <svg
        className="sweep-plot"
        viewBox="0 0 680 360"
        role="img"
        aria-label="Recall at k=10 against queries per second on a log scale. HNSW trades recall for throughput along a knee at ef=32; IVF-PQ holds lower throughput at comparable recall."
      >
        {/* --- horizontal grid, one line per labelled recall step ---------- */}
        <g className="sweep-grid">
          <line x1="92" y1="69.2" x2="596" y2="69.2" />
          <line x1="92" y1="90.2" x2="596" y2="90.2" />
          <line x1="92" y1="153.2" x2="596" y2="153.2" />
          <line x1="92" y1="195.2" x2="596" y2="195.2" />
          <line x1="92" y1="237.2" x2="596" y2="237.2" />
          <line x1="92" y1="279.2" x2="596" y2="279.2" />
        </g>

        {/* --- the 0.90 reference: dashed, because it is a threshold, not a
                measurement. The fast end of the HNSW curve crosses BELOW it,
                which is the honest part of this figure. ------------------- */}
        <line className="sweep-reference" x1="92" y1="111.2" x2="596" y2="111.2" />
        {/* Named as a floor the fast end breaks, not just "reference": the
            ef=16 sample plotted below already carries recall 0.8996, so this
            states what the figure shows rather than adding to it. Volunteering
            your own failure boundary only counts if the reader can see that you
            did it on purpose.

            TWO LINES, and the break is geometry, not taste. On one line the bbox
            ran x 100..348.5 / y 114.9..126.3, and the IVF-PQ segment
            `M 328 94 L 379 285.5` entered it at (333.6, 115.1) and left at
            (336.6, 126.2) — the data series drew straight through the "i" of
            "falls below it", 30 sampled crossings. Broken here, line one ends at
            x≈257 and line two at x≈290, both clear of the curve, and the y=135
            band is empty for the full label width. Strings and numbers
            unchanged. */}
        <text className="sweep-reference-label" x="100" y="124">
          recall 0.90 floor ·
          <tspan x="100" dy="11">
            ef=16 falls below it
          </tspan>
        </text>

        {/* --- axes ------------------------------------------------------- */}
        <g className="sweep-axis">
          <line x1="92" y1="44" x2="92" y2="296" />
          <line x1="92" y1="296" x2="596" y2="296" />
          <line x1="206.2" y1="296" x2="206.2" y2="301" />
          <line x1="305.9" y1="296" x2="305.9" y2="301" />
          <line x1="381.3" y1="296" x2="381.3" y2="301" />
          <line x1="456.7" y1="296" x2="456.7" y2="301" />
          <line x1="556.3" y1="296" x2="556.3" y2="301" />
          <line x1="87" y1="69.2" x2="92" y2="69.2" />
          <line x1="87" y1="90.2" x2="92" y2="90.2" />
          <line x1="87" y1="111.2" x2="92" y2="111.2" />
          <line x1="87" y1="153.2" x2="92" y2="153.2" />
          <line x1="87" y1="195.2" x2="92" y2="195.2" />
          <line x1="87" y1="237.2" x2="92" y2="237.2" />
          <line x1="87" y1="279.2" x2="92" y2="279.2" />
        </g>

        {/* --- tick labels. Decimals for recall; the fact gate reads percent
                signs as claims, and a recall axis has no business in percent
                anyway. --------------------------------------------------- */}
        <g className="sweep-tick sweep-tick-x">
          <text x="206.2" y="314">2K</text>
          <text x="305.9" y="314">5K</text>
          <text x="381.3" y="314">10K</text>
          <text x="456.7" y="314">20K</text>
          <text x="556.3" y="314">50K</text>
        </g>
        <g className="sweep-tick sweep-tick-y">
          <text x="82" y="72.7">1.00</text>
          <text x="82" y="93.7">0.95</text>
          <text x="82" y="114.7">0.90</text>
          <text x="82" y="156.7">0.80</text>
          <text x="82" y="198.7">0.70</text>
          <text x="82" y="240.7">0.60</text>
          <text x="82" y="282.7">0.50</text>
        </g>
        <text className="sweep-axis-title" x="344" y="340">
          queries per second (log scale)
        </text>
        <text
          className="sweep-axis-title"
          x="26"
          y="170"
          transform="rotate(-90 26 170)"
        >
          recall at k=10
        </text>

        {/* --- legend ----------------------------------------------------- */}
        <g className="sweep-legend">
          <line className="sweep-legend-hnsw" x1="98" y1="200" x2="112" y2="200" />
          <text x="118" y="204">HNSW m=16</text>
          <line className="sweep-legend-ivf" x1="98" y1="222" x2="112" y2="222" />
          <text x="118" y="226">IVF-PQ nlist=256 m=32</text>
          <path className="sweep-legend-oracle" d="M 98 244 L 112 244 M 105 240 L 105 248" />
          <text x="118" y="248">oracle · exact brute force · all 48 cores</text>
        </g>

        {/* --- the oracle: 971 q/s at exact recall, the thing the index is
                being compared against ----------------------------------- */}
        <g className="sweep-oracle">
          <path d="M 121.6 69.2 L 133.6 69.2 M 127.6 63.2 L 127.6 75.2" />
          <text x="138.6" y="64">oracle · 971 q/s exact · 48 cores</text>
        </g>

        {/* --- IVF-PQ, nlist=256 m=32, sweeping nprobe -------------------- */}
        <path className="sweep-line sweep-line-ivf" d="M 153.2 79.8 L 221.6 79.8 L 284.5 79.8 L 328 94 L 379 285.5" />

        {/* --- HNSW, m=16, sweeping ef ------------------------------------ */}
        <path className="sweep-line sweep-line-hnsw" d="M 368.6 69.2 L 414 69.2 L 461.7 70.7 L 507.3 79.3 L 550.4 111.4" />

        {/* --- crosshair. Defaults to the knee, so the annotated state is
                the state the static HTML ships in. enhance.ts only moves it
                by rewriting --sweep-x / --sweep-y on the <figure>. ------- */}
        <g className="sweep-crosshair" aria-hidden="true">
          <line className="sweep-crosshair-v" x1="0" y1="44" x2="0" y2="296" />
          <line className="sweep-crosshair-h" x1="92" y1="0" x2="596" y2="0" />
          <circle className="sweep-crosshair-dot" cx="0" cy="0" r="6.5" />
        </g>

        {/* --- sample points. Each one carries its own plot coordinate and
                its own readout string, so enhance.ts needs no copy of this
                table and no arithmetic. ---------------------------------- */}
        <g className="sweep-samples">
          <g
            className="sweep-sample sweep-sample-ivf"
            data-sweep-x="153.2"
            data-sweep-y="79.8"
            data-sweep-readout={READOUT["nprobe=32"]}
          >
            <circle cx="153.2" cy="79.8" r="4" />
            <text x="153.2" y="99.8">nprobe=32</text>
          </g>
          <g
            className="sweep-sample sweep-sample-ivf"
            data-sweep-x="221.6"
            data-sweep-y="79.8"
            data-sweep-readout={READOUT["nprobe=16"]}
          >
            <circle cx="221.6" cy="79.8" r="4" />
            <text x="221.6" y="99.8">nprobe=16</text>
          </g>
          <g
            className="sweep-sample sweep-sample-ivf"
            data-sweep-x="284.5"
            data-sweep-y="79.8"
            data-sweep-readout={READOUT["nprobe=8"]}
          >
            <circle cx="284.5" cy="79.8" r="4" />
            <text x="284.5" y="99.8">nprobe=8</text>
          </g>
          <g
            className="sweep-sample sweep-sample-ivf"
            data-sweep-x="328"
            data-sweep-y="94"
            data-sweep-readout={READOUT["nprobe=4"]}
          >
            <circle cx="328" cy="94" r="4" />
            <text x="328" y="81">nprobe=4</text>
          </g>
          <g
            className="sweep-sample sweep-sample-ivf"
            data-sweep-x="379"
            data-sweep-y="285.5"
            data-sweep-readout={READOUT["nprobe=1"]}
          >
            <circle cx="379" cy="285.5" r="4" />
            <text x="379" y="272.5">nprobe=1</text>
          </g>

          <g
            className="sweep-sample sweep-sample-hnsw"
            data-sweep-x="368.6"
            data-sweep-y="69.2"
            data-sweep-readout={READOUT["ef=256"]}
          >
            <circle cx="368.6" cy="69.2" r="4" />
            <text x="368.6" y="56.2">ef=256</text>
          </g>
          <g
            className="sweep-sample sweep-sample-hnsw"
            data-sweep-x="414"
            data-sweep-y="69.2"
            data-sweep-readout={READOUT["ef=128"]}
          >
            <circle cx="414" cy="69.2" r="4" />
            <text x="414" y="56.2">ef=128</text>
          </g>
          <g
            className="sweep-sample sweep-sample-hnsw"
            data-sweep-x="461.7"
            data-sweep-y="70.7"
            data-sweep-readout={READOUT["ef=64"]}
          >
            <circle cx="461.7" cy="70.7" r="4" />
            <text x="461.7" y="57.7">ef=64</text>
          </g>
          <g
            className="sweep-sample sweep-sample-hnsw sweep-sample-knee"
            data-sweep-x="507.3"
            data-sweep-y="79.3"
            data-sweep-readout={READOUT_DEFAULT}
          >
            <circle cx="507.3" cy="79.3" r="4" />
            {/* Offset left of the crosshair's default column so the knee's own
                label never sits under the amber rule that annotates it. */}
            <text className="sweep-label-end" x="491.3" y="95.3">ef=32</text>
          </g>
          <g
            className="sweep-sample sweep-sample-hnsw"
            data-sweep-x="550.4"
            data-sweep-y="111.4"
            data-sweep-readout={READOUT["ef=16"]}
          >
            <circle cx="550.4" cy="111.4" r="4" />
            <text x="550.4" y="124">ef=16</text>
          </g>
        </g>

        {/* --- the knee annotation. Amber, leader line plus label, exactly
                how the source plots mark a knee. Present in the markup, so
                it is the figure's default state and not a hover reward. -- */}
        <g className="sweep-callout">
          <circle className="sweep-callout-ring" cx="507.3" cy="79.3" r="8" />
          <path className="sweep-callout-leader" d="M 507.3 71.3 L 536 46 L 590 46" />
          {/* One text node, wrapped over two lines. Set as a single element so
              the annotation reads as one string to a screen reader and to
              anything grepping the DOM; wrapped because 245 user units on one
              line would clip out of the pannable window on a 320px-wide plate,
              and an annotation you have to scroll to find is not a default. */}
          <text className="sweep-callout-label" x="592" y="22">
            ef=32 · recall 0.976 ·
            <tspan x="592" dy="16">
              ~31.8K q/s
            </tspan>
          </text>
        </g>
      </svg>
      </div>

      {/* --- the same ten samples as text, immediately after the drawing they
              transcribe, so the reading order is "figure, then figure's values".
              Visually hidden; see the note on SweepTable. -------------------- */}
      <SweepTable />

      {/* --- the series key, in HTML, OUTSIDE the pannable window. The SVG
              legend is the real one on desktop, but below ~600px the plot pans
              inside the plate and the in-plot legend, both axis titles and six
              of seven y-ticks sit off-window — so a phone reader met two
              coloured lines with no key. All three strings are the SVG legend's
              own, restated where the pan cannot take them. ---------------- */}
      <p className="sweep-key" aria-hidden="true">
        <span className="sweep-key-item sweep-key-hnsw">HNSW m=16</span>
        <span className="sweep-key-item sweep-key-ivf">IVF-PQ nlist=256 m=32</span>
        <span className="sweep-key-item sweep-key-oracle">oracle · exact</span>
      </p>

      {/* --- the readout the crosshair rewrites. Ships on the knee. -------
              "READING" rather than "CROSSHAIR": the old key named the mechanism
              to someone who already knew what it was. The hint beside it is the
              only invitation a sighted mouse user gets — the same instruction
              previously existed ONLY in the figure's aria-label. It is gated on
              `.js` because without the bundle there is nothing to drag, and a
              site that tells a no-JS reader to drag is lying to them; evidence
              parity holds either way, since the amber callout, this readout and
              the footnote all carry the numbers statically. */}
      <p className="sweep-readout">
        <span className="sweep-readout-key">reading</span>
        <span className="sweep-readout-value">{READOUT_DEFAULT}</span>
        {/* Two registers. The one string used to name the two mechanisms a
            touch device does not have — a hover-drag and arrow keys — while the
            gesture it actually supports (tap a point, drag to pan) went
            unnamed. */}
        <span className="sweep-readout-hint sweep-readout-hint-fine">
          drag across the plot · or press ← →
        </span>
        <span className="sweep-readout-hint sweep-readout-hint-coarse">
          tap a point · drag to pan
        </span>
      </p>
      <p className="sweep-live visually-hidden" aria-live="polite" />

      <p className="plate-footnote">
        50,000 x 128-d · k=10 · single core · Xeon 8488C ·{" "}
        <a
          className="sweep-source"
          href="https://github.com/iwang-1/lodestone/blob/main/benchmarks/raw/bench_50k_128d.txt"
          target="_blank"
          rel="noopener noreferrer"
        >
          bench_50k_128d.txt
          <span className="visually-hidden"> (opens in new tab)</span>
        </a>
      </p>
    </figure>
  );
}
