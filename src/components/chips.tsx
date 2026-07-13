/** ProofChip — flat mono pill with a 6px emerald status dot, carrying exact
 *  verifiable metrics ("101 tests · ~95% cov", "GPA 3.6/4.0", …). */
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
