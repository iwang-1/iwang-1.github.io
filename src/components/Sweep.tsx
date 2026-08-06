import "./Sweep.css";
import {
  SWEEP_KNEE,
  SWEEP_ORACLE,
  SWEEP_RUN,
  SWEEP_SAMPLES,
  SWEEP_SOURCE,
  SWEEP_SVG,
} from "../generated/sweep-figure";

/** THE FORCE CURVE — lodestone's committed recall-vs-throughput sweep, drawn in
 *  the grammar of a switch force-travel datasheet.
 *
 *  THIS FILE NO LONGER CONTAINS THE FIGURE'S NUMBERS, and that is the point of
 *  the change. It used to: ten samples and their coordinates were authored here
 *  in JSX beside a comment naming the benchmark file they came from. That is a
 *  transcription, and a transcription drifts — the figure and the file it cited
 *  agreed only because someone kept them agreeing. Now
 *  `scripts/generate-figures.mjs` PARSES the committed benchmark file at build
 *  time (as the first half of `prebuild`) and emits
 *  `src/generated/sweep-figure.ts`, and every number this component renders
 *  comes from there. The generator asserts, at generation time, that every value
 *  it presents as data is a byte-exact substring of the source file, and it exits
 *  non-zero — failing the build — if the source is missing or does not parse to
 *  the exact expected shape. A figure here can no longer say anything the file it
 *  links to does not say.
 *
 *  WHAT THIS COMPONENT STILL OWNS: the plate around the drawing — the FIG.
 *  label, the plain-English gloss, the pannable window, the transcription table,
 *  the HTML series key, the live readout line and the footnote. Everything inside
 *  the `<svg>` is generated.
 *
 *  THE ANIMATION IS INSIDE THE SVG, IN CSS. The generated element carries its own
 *  `<style>` with an `@keyframes` walk: a cursor steps the five HNSW samples on a
 *  10s linear loop, wrapped in `@media (prefers-reduced-motion: reduce)` so under
 *  `reduce` it stops and parks on the annotated sample. No `<script>`, no SMIL —
 *  it runs with JavaScript fully disabled. It is enhancement and nothing more:
 *  every number the cursor visits is already in the static markup, in the amber
 *  callout, and in the transcription table below.
 *
 *  NUMBERS ARE AT SOURCE PRECISION. `0.9759`, not `0.976`; `31,845`, not
 *  `~31.8K`. The site's approved `~31,800` style still exists in src/content.ts
 *  for the prose plates; this figure quotes the file instead of summarising it,
 *  because it is the object a reader came here to check.
 *
 *  Unmounted on its own — a page has to place it. Pair it with the crosshair in
 *  src/enhance.ts, which finds this figure by its `.sweep` class and reads each
 *  generated sample's `data-sweep-*` attributes. */

/** THE TRANSCRIPTION, AND THE PROOF. The plot draws ten samples at once; the
 *  crosshair reports one at a time. Neither serves a reader at 400% zoom (where
 *  the plot pans and the per-point labels leave the window), on a screen reader
 *  (where the SVG is one `role="img"` summary), or with images and animation
 *  gone. This table is the same ten samples as REAL HTML TEXT, server-rendered,
 *  in the same order the axis and the arrow keys use — so every plotted number
 *  is also a DOM text node, and the drawing is never the only copy of the
 *  evidence.
 *
 *  Visually hidden rather than shown: the drawing IS the figure at every width
 *  the drawing is legible, and a second visible copy of ten rows is the
 *  duplicated-legend defect this figure already fixed once. Hidden is not
 *  absent — it is in the static HTML with the bundle blocked, which is the whole
 *  no-JS contract.
 *
 *  The `.visually-hidden` class is on a WRAPPER, not on the <table>. That is not
 *  a style preference: the primitive's `width: 1px` is a MINIMUM for a CSS table,
 *  which sizes to its columns' min-content regardless, so hiding the table
 *  directly measured 605.5px wide and drove the home page into 285px of
 *  horizontal document overflow at 320w. A block wrapper honours the 1px and
 *  `overflow: hidden` clips the table inside it, so the transcription costs zero
 *  layout at every width. Do not move the class onto the table.
 *
 *  The caption states an ordering, so the rows must BE that ordering. They are
 *  rendered straight from `SWEEP_SAMPLES`, which the generator emits in true
 *  throughput-ascending order — the interleaved pair is the tell. */
function SweepTable() {
  return (
    <div className="visually-hidden">
      <table className="sweep-table">
        {/* "FIG. 03 DETAIL", not "Figure 1" — the visible plate label. A screen
            reader heard this figure call itself "Figure 1" while every sighted
            reader saw "FIG. 03 DETAIL", so the two audiences could not talk about
            the same object. That is the exact defect the numbering scheme was
            rebuilt to remove (lodestone used to hold two numbers on one page); it
            survived here because an accessible name is invisible to the eye. */}
        <caption>
          FIG. 03 DETAIL, as measured values: ten samples, ordered by throughput, at the source
          file's own precision.
        </caption>
        <thead>
          <tr>
            <th scope="col">Index</th>
            <th scope="col">Setting</th>
            <th scope="col">Recall at k={SWEEP_RUN.k}</th>
            <th scope="col">Queries per second</th>
          </tr>
        </thead>
        <tbody>
          {SWEEP_SAMPLES.map((s) => (
            <tr key={s.setting}>
              <th scope="row">{s.series}</th>
              <td>{s.setting}</td>
              <td>{s.recall}</td>
              <td>{s.qpsDisplay}</td>
            </tr>
          ))}
        </tbody>
        {/* The baseline the plot marks, so the one number drawn outside the two
            series is also HTML text. Its recall cell says "exact" rather than a
            figure: the source file states the throughput and the word, and a
            4-decimal recall for it appears nowhere in that file. */}
        <tfoot>
          <tr>
            <th scope="row">Baseline</th>
            <td>exact brute force ({SWEEP_ORACLE.note})</td>
            <td>exact</td>
            <td>{SWEEP_ORACLE.qpsDisplay}</td>
          </tr>
        </tfoot>
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
      /* Same string a sighted reader sees in the figcaption below — see the note
         on SweepTable's caption. */
      aria-label="FIG. 03 DETAIL, lodestone recall against throughput: ten measured samples. Move the pointer across the plot, or use the arrow keys, to read each sample."
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
          sample-stepping contract.

          THE SVG IS THE DIRECT CHILD OF THIS DIV, and that is a contract, not a
          formatting accident: src/enhance.ts pans the window via
          `svg.parentElement`, so an extra wrapper here silently kills arrow-key
          panning. The markup is injected because it is GENERATED OUTPUT — see
          src/generated/sweep-figure.ts, which nothing may hand-edit. It renders
          during React's own render pass, so the prerenderer captures the complete
          figure into the static HTML. */}
      <div
        className="sweep-scroll"
        role="group"
        aria-label="lodestone plot, pannable — move across the figure with the arrow keys"
        dangerouslySetInnerHTML={{ __html: SWEEP_SVG }}
      />

      {/* --- the same ten samples as text, immediately after the drawing they
              transcribe, so the reading order is "figure, then figure's values".
              Visually hidden; see the note on SweepTable. -------------------- */}
      <SweepTable />

      {/* --- the series key, in HTML, OUTSIDE the pannable window. The SVG
              legend is the real one on desktop, but below ~600px the plot pans
              inside the plate and the in-plot legend, both axis titles and six
              of seven y-ticks sit off-window — so a phone reader met two
              strokes with no key. All three strings are the SVG legend's own,
              restated where the pan cannot take them. The two series differ by
              DASH, not by hue — this palette carries one accent — so the key's
              swatches carry the dash too. ---------------------------------- */}
      <p className="sweep-key" aria-hidden="true">
        <span className="sweep-key-item sweep-key-hnsw">HNSW m=16</span>
        <span className="sweep-key-item sweep-key-ivf">IVF-PQ nlist=256 m=32</span>
        <span className="sweep-key-item sweep-key-oracle">oracle · exact</span>
      </p>

      {/* --- the readout the crosshair rewrites. Ships on the annotated sample.
              "READING" rather than "CROSSHAIR": the old key named the mechanism
              to someone who already knew what it was. The hint beside it is the
              only invitation a sighted mouse user gets — the same instruction
              previously existed ONLY in the figure's aria-label. It is gated on
              `.js` because without the bundle there is nothing to drag, and a
              site that tells a no-JS reader to drag is lying to them; evidence
              parity holds either way, since the callout, this readout and the
              footnote all carry the numbers statically. */}
      <p className="sweep-readout">
        <span className="sweep-readout-key">reading</span>
        <span className="sweep-readout-value">{SWEEP_KNEE.readout}</span>
        {/* Two registers. The one string used to name the two mechanisms a
            touch device does not have — a hover-drag and arrow keys — while the
            gesture it actually supports (tap a point, drag to pan) went
            unnamed. */}
        <span className="sweep-readout-hint sweep-readout-hint-fine">
          drag across the plot · or press ← →
        </span>
        {/* "or step" names the buttons below. The string used to promise only "tap a
            point", and two of the ten points could not be tapped at any phone width
            — so the hint was accurate about the gesture and wrong about the
            outcome. */}
        <span className="sweep-readout-hint sweep-readout-hint-coarse">
          tap a point · drag to pan · or step
        </span>
      </p>
      {/* STEPPERS, because a pointer alone could not reach every sample.
          Measured at 320px: the plot has a 580px floor width (its axis labels stop
          being legible below it), so the plate pans a 254px window over it — and
          `nearest()` maps only pixels INSIDE that window to a sample. Scrubbing the
          full width reached 5 of 10 samples; panning fully and scrubbing again
          reached 3; the UNION was 8 of 10. Two measured samples were unreachable by
          pointer or finger at every phone width, while the hint said "tap a point".
          Arrow keys always reached them (`revealSample` pans correctly), so the
          mechanism existed and only the pointer affordance was missing — which is
          what these two buttons are. They drive the exact same `select()` path the
          keys do, so nothing new can drift out of sync.
          Progressive-enhancement note: these are `.js`-gated in CSS, like the copy
          button, because a stepper that cannot step is a dead control — and the
          static readout plus the footnote already carry the numbers without JS. */}
      <p className="sweep-step">
        <button type="button" className="sweep-step-btn" data-sweep-step="-1" aria-label="Previous sample">
          ←
        </button>
        <button type="button" className="sweep-step-btn" data-sweep-step="1" aria-label="Next sample">
          →
        </button>
      </p>
      <p className="sweep-live visually-hidden" aria-live="polite" />

      <p className="plate-footnote">
        {SWEEP_RUN.nDisplay} x {SWEEP_RUN.dim}-d · k={SWEEP_RUN.k} · single core · Xeon 8488C ·{" "}
        <a
          className="sweep-source"
          href={SWEEP_SOURCE.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {SWEEP_SOURCE.name}
          <span className="visually-hidden"> (opens in new tab)</span>
        </a>
      </p>
    </figure>
  );
}
