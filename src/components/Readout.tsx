/** Readout. */
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
