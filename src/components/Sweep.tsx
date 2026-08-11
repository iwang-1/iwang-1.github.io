import "./Sweep.css";
import {
  SWEEP_KNEE,
  SWEEP_ORACLE,
  SWEEP_RUN,
  SWEEP_SAMPLES,
  SWEEP_SOURCE,
  SWEEP_SVG,
} from "../generated/sweep-figure";

/** The recall-throughput curve. */

/** The accessible data table. The plot draws ten samples at once; the crosshair reports one at a time. */
function SweepTable() {
  return (
    <div className="visually-hidden">
      <table className="sweep-table">
        {/* "fig. 03 detail", not "Figure 1" — the visible plate label. */}
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
        {/* The baseline the plot marks, so the one number drawn outside the two series is also HTML text. */}
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

      {/* The gloss. The plate label above is machine grammar — "lodestone" is a repo name a reader has never
         seen, and a rotated log axis is not an introduction. */}
      <p className="sweep-gloss">
        lodestone is a vector search engine I built in Rust. This is its benchmark: higher is more
        accurate, further right is faster, and each dot is one setting I measured.
      </p>

      {/* The plot keeps a minimum width and pans inside the plate rather than scaling its labels into
         illegibility on a phone. */}
      <div
        className="sweep-scroll"
        role="group"
        aria-label="lodestone plot, pannable — move across the figure with the arrow keys"
        dangerouslySetInnerHTML={{ __html: SWEEP_SVG }}
      />

      {/* The same ten samples as text, immediately after the drawing they transcribe, so the reading order is
         "figure, then figure's values". */}
      <SweepTable />

      {/* The series key, in HTML, outside the pannable window. */}
      <p className="sweep-key" aria-hidden="true">
        <span className="sweep-key-item sweep-key-hnsw">HNSW m=16</span>
        <span className="sweep-key-item sweep-key-ivf">IVF-PQ nlist=256 m=32</span>
        <span className="sweep-key-item sweep-key-oracle">oracle · exact</span>
      </p>

      {/* The readout the crosshair rewrites. Ships on the annotated sample. "reading" rather than "crosshair":
         the old key named the mechanism to someone who already knew what it was. */}
      <p className="sweep-readout">
        <span className="sweep-readout-key">reading</span>
        <span className="sweep-readout-value">{SWEEP_KNEE.readout}</span>
        {/* Two registers. The one string used to name the two mechanisms a touch device does not have — a
           hover-drag and arrow keys — while the gesture it actually supports (tap a point, drag to pan) went unnamed. */}
        <span className="sweep-readout-hint sweep-readout-hint-fine">
          drag across the plot · or press ← →
        </span>
        {/* "or step" names the buttons below. The string used to promise only "tap a point", and two of the ten
           points could not be tapped at any phone width — so the hint was accurate about the gesture and wrong about the outcome. */}
        <span className="sweep-readout-hint sweep-readout-hint-coarse">
          tap a point · drag to pan · or step
        </span>
      </p>
      {/* Steppers, because a pointer alone could not reach every sample. */}
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
