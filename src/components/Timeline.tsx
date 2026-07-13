import type { CSSProperties } from "react";
import type { Role } from "../content";
import { RoleCard } from "./cards";
import { Reveal } from "./Reveal";

export type TimelineEntry =
  | { kind: "role"; role: Role; tagTone?: "default" | "teal" }
  | { kind: "label"; text: string };

/** Center-spine alternating timeline (spine left + single column on mobile).
 *  Label entries sit ON the spine and do not consume a left/right slot.
 *
 *  Desktop interleaving: each role card spans 2 grid rows and starts one row
 *  after the previous role, so opposite-side cards genuinely overlap
 *  vertically instead of stacking in full blank rows. gridRow is inert in the
 *  mobile flex layout. A label must start only after the previous role's two
 *  rows END (skip one extra row), then the next role resumes after it.
 *
 *  Every entry scroll-reveals (Reveal as="li"), staggered 80ms by DOM order
 *  and capped at 240ms; the inline style merges gridRow with the delay var.
 *
 *  role="list": Safari/VoiceOver drops list semantics from `list-style: none`
 *  lists — the explicit role restores the "list, N items" announcement.
 */
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
            <RoleCard role={e.role} tagTone={e.tagTone ?? "default"} />
          </Reveal>
        );
      })}
    </ol>
  );
}
