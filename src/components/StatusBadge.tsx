interface Props {
  status: "merged" | "open";
  label: string;
}

/** Status is conveyed by text + shape (filled vs outlined), never color alone. */
export default function StatusBadge({ status, label }: Props) {
  return <span className={`badge mono badge-${status}`}>{label}</span>;
}
