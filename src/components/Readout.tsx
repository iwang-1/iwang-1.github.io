/** Readout — measured values as value / label on one left-aligned baseline, in
 *  tabular figures, with as many rows as the project actually measured.
 *
 *  Deliberately not a fixed-column grid. Three cards with exactly three
 *  metrics each is a schema, and a schema reads as filled in rather than
 *  measured; the row count here is whatever the evidence supports (3/2/2
 *  across the three systems).
 *
 *  `plain` is the metric said in words, and it is the same contract the hero
 *  rail's own gloss carries (`.hero-readout-plain`): it NAMES WHAT THE LABEL IS
 *  and may not assert a second measurement or introduce a number. "fdatasync p50"
 *  and "recall@10" are the axis labels of the source plots, and PRODUCT.md's
 *  primary reader — a recruiter mid-scan — does not know either one, so a rail
 *  that only prints them is a figure with no caption. Optional because some labels
 *  are already plain English ("client operations checked" needs no translation,
 *  and glossing it would be filling in a schema).
 *
 *  A dropped `unit?` field lived here until 2026-08-02: no caller ever set it, so
 *  `.readout-unit` never rendered on any page.
 *
 *  Not a <dl>, and the rows are not <p>. A definition list would have to carry
 *  its <dd> before its <dt> to render value-first, which is invalid inside a dl
 *  group, and a <p> row would bring the global paragraph margin into a stack
 *  whose spacing is already owned by `.readout`'s gap. Each row announces as one
 *  run of text either way, so the plain elements cost nothing and claim no
 *  structure the markup does not have. */
export type ReadoutCell = { value: string; label: string; plain?: string };

export function Readout({ cells, className }: { cells: ReadoutCell[]; className?: string }) {
  return (
    <div className={className ? `readout ${className}` : "readout"}>
      {cells.map((cell) => (
        <div className="readout-row" key={cell.label}>
          <span className="readout-value">{cell.value}</span>
          <span className="readout-label">
            {cell.label}
            {cell.plain ? <span className="readout-plain">{cell.plain}</span> : null}
          </span>
        </div>
      ))}
    </div>
  );
}
