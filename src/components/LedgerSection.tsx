import type { ReactNode } from "react";

interface Props {
  id: string;
  kicker: string;
  /** Visible h2. When omitted, the kicker text becomes a visually hidden h2. */
  title?: string;
  children: ReactNode;
}

export default function LedgerSection({ id, kicker, title, children }: Props) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} className="ledger-section" aria-labelledby={headingId}>
      {title ? (
        <>
          {/* Visible h2 follows, so the kicker stays in the accessibility tree. */}
          <p className="kicker mono">{kicker}</p>
          <h2 id={headingId}>{title}</h2>
        </>
      ) : (
        <>
          {/* No visible title: the kicker text doubles as the hidden h2, so the
              visible copy is aria-hidden to avoid AT double-announcement. */}
          <p className="kicker mono" aria-hidden="true">
            {kicker}
          </p>
          <h2 id={headingId} className="visually-hidden">
            {kicker}
          </h2>
        </>
      )}
      {children}
    </section>
  );
}
