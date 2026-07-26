/** Readout — measured values as value / unit / label on one left-aligned
 *  baseline, in tabular figures, with as many rows as the project actually
 *  measured.
 *
 *  Deliberately not a fixed-column grid. Three cards with exactly three
 *  metrics each is a schema, and a schema reads as filled in rather than
 *  measured; the row count here is whatever the evidence supports (3/2/2
 *  across the three systems).
 *
 *  `unit` is optional because some cells are dimensionless — a recall figure is
 *  a ratio — and printing a unit on one of those would be a fabricated axis
 *  label.
 *
 *  Not a <dl>, and the rows are not <p>. A definition list would have to carry
 *  its <dd> before its <dt> to render value-first, which is invalid inside a dl
 *  group, and a <p> row would bring the global paragraph margin into a stack
 *  whose spacing is already owned by `.readout`'s gap. Each row announces as one
 *  run of text either way, so the plain elements cost nothing and claim no
 *  structure the markup does not have. */
export type ReadoutCell = { value: string; unit?: string; label: string };

export function Readout({ cells, className }: { cells: ReadoutCell[]; className?: string }) {
  return (
    <div className={className ? `readout ${className}` : "readout"}>
      {cells.map((cell) => (
        <div className="readout-row" key={cell.label}>
          <span className="readout-value">{cell.value}</span>
          {cell.unit && <span className="readout-unit">{cell.unit}</span>}
          <span className="readout-label">{cell.label}</span>
        </div>
      ))}
    </div>
  );
}
