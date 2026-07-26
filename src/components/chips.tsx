/** ProofChip — a measured, verifiable cell set as a label tag with a status
 *  dot. The dot is not optional: it is the one thing distinguishing a checked
 *  number from a tech tag, and a chip that could render either way was a
 *  distinction the caller could accidentally drop. */
export function ProofChip({ label }: { label: string }) {
  return (
    <span className="proof-chip">
      <span className="dot" aria-hidden="true" />
      {label}
    </span>
  );
}

/** Chip — a label tag: quiet ink on a hairline, no fill, no dot. Skills,
 *  coursework, tech tags.
 *
 *  Non-interactive on purpose. The hairline is the affordance in this system, so
 *  a tag that reacted to the pointer while doing nothing on click would be a
 *  false one. There is no tone variant: coursework used to render lime, which
 *  spent the loudest colour on the site's least load-bearing content while the
 *  measured numbers were grey. */
export function Chip({ label }: { label: string }) {
  return <span className="chip">{label}</span>;
}
