/** ProofChip. */
export function ProofChip({ label }: { label: string }) {
  return (
    <span className="proof-chip">
      <span className="dot" aria-hidden="true" />
      {label}
    </span>
  );
}

/** Chip. */
export function Chip({ label }: { label: string }) {
  return <span className="chip">{label}</span>;
}
