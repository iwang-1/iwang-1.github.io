interface Props {
  label: string;
  /** Proof-chip behavior: when set, the whole chip links to the repo. */
  href?: string;
}

export default function MetricChip({ label, href }: Props) {
  if (href) {
    return (
      <a className="chip chip-link mono" href={href}>
        {label}
        <span aria-hidden="true"> ↗</span>
      </a>
    );
  }
  return <span className="chip mono">{label}</span>;
}
