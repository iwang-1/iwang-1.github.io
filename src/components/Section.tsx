import type { ReactNode } from "react";
import { AxisRule } from "./AxisRule";
import { Reveal } from "./Reveal";

/** Section. */
export function Section({
  id,
  title,
  rank,
  children,
}: {
  id?: string;
  title: string;
  rank?: 1 | 2;
  children: ReactNode;
}) {
  const classes = rank ? `section section--rank-${rank}` : "section";
  return (
    <section id={id} className={classes}>
      <div className="container">
        <Reveal className="section-head">
          <AxisRule />
          <h2>{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
