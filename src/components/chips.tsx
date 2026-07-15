/** ProofChip — flat mono pill with a status dot for exact, verified metrics. */
export function ProofChip({ label, dot = true }: { label: string; dot?: boolean }) {
  return (
    <span className="proof-chip">
      {dot && <span className="dot" aria-hidden="true" />}
      {label}
    </span>
  );
}

/** Chip — flat pill, no dot, no bottom edge (skills, coursework, tech tags).
 *  Non-interactive on purpose: pressability is an honest affordance reserved
 *  for keycaps. */
export function Chip({ label, tone = "default" }: { label: string; tone?: "default" | "teal" }) {
  return <span className={tone === "teal" ? "chip chip-teal" : "chip"}>{label}</span>;
}
