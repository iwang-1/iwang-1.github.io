// Chips are always plain text — never links. Each card/panel exposes exactly
// one repo link (its heading or an explicit "View … on GitHub" link), so
// keyboard users get one tab stop per repo instead of one per chip.
export default function MetricChip({ label }: { label: string }) {
  return <span className="chip mono">{label}</span>;
}
