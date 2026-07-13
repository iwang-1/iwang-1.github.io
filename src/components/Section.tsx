import type { ReactNode } from "react";

/** Section — mono kicker + serif H2 + container (kickers are numbered on
 *  Home: "01 · ABOUT", …). */
export function Section({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="section">
      <div className="container">
        <div className="section-head">
          <p className="kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
