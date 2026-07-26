import type { ReactNode } from "react";
import { AxisRule } from "./AxisRule";
import { Reveal } from "./Reveal";

/** Section — a heading and its container, opened by an axis rule.
 *
 *  `rank` is the hierarchy control: rank 1 is a page's lead section (the systems
 *  work), rank 2 is everything supporting it, and the CSS moves the heading size
 *  and the gap above it together. Five identically-sized headings over five
 *  identical pads is what makes a page read as generated, so the rank is stated
 *  rather than inherited. Omitting it falls back to position (first section on
 *  the page is rank 1), which is what the stylesheet already assumes. */
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
