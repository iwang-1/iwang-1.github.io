import type { CSSProperties } from "react";
import type { Role } from "../content";
import { RoleCard } from "./cards";
import { Reveal } from "./Reveal";

export type TimelineEntry =
  | { kind: "role"; role: Role }
  | { kind: "label"; text: string };

/* The spine has no year ticks. */

/** Center-spine alternating timeline, re-read in the figure grammar: the spine is the axis, each role's node is
 * a sample point on it, and the role cards are plates. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  let n = 0; // role counter — labels don't alternate
  let row = 1; // desktop grid row cursor
  const delayMs = (i: number) => `${Math.min(i * 80, 240)}ms`;
  return (
    <ol className="alt-timeline" role="list">
      {entries.map((e, i) => {
        if (e.kind === "label") {
          row += 1; // clear the previous role's second row
          const start = row++;
          return (
            <Reveal
              as="li"
              key={e.text}
              className="alt-timeline-label"
              style={
                {
                  gridRow: `${start} / span 1`,
                  "--reveal-delay": delayMs(i),
                } as CSSProperties
              }
            >
              {/* heading = programmatic group boundary (WCAG 1.3.1) */}
              <h3>
                <span>{e.text}</span>
              </h3>
            </Reveal>
          );
        }
        const start = row++;
        return (
          <Reveal
            as="li"
            key={`${e.role.role}-${e.role.org}`}
            className={`alt-timeline-item ${n++ % 2 === 0 ? "tl-left" : "tl-right"}`}
            style={
              {
                gridRow: `${start} / span 2`,
                "--reveal-delay": delayMs(i),
              } as CSSProperties
            }
          >
            <RoleCard role={e.role} />
          </Reveal>
        );
      })}
    </ol>
  );
}
