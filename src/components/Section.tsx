import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Section — serif H2 + container, with an optional mono kicker above the
 *  heading. Section heads scroll-reveal (below-the-fold). */
export function Section({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="section">
      <div className="container">
        <Reveal className="section-head">
          {kicker && <p className="kicker">{kicker}</p>}
          <h2>{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
