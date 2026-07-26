import type { CSSProperties } from "react";
import type { Role } from "../content";
import { RoleCard } from "./cards";
import { Reveal } from "./Reveal";

export type TimelineEntry =
  | { kind: "role"; role: Role }
  | { kind: "label"; text: string };

/* NO YEAR TICKS ON THE SPINE — deliberate, and the reason is in the data.
 *
 *  The spine is meant to read as a date axis, which needs its tick labels to be
 *  monotonic. The engineering roles are (2026, 2025, 2023, 2022); the community
 *  roles are NOT — Kids For Code starts 2021, CodeDay 2019, Panda Programmer
 *  2022 — so ticks down the rail render 2021, 2019, 2022 and the axis reads as a
 *  sorting bug. Measured on the built page before this was reverted.
 *
 *  A drawn axis annotated with out-of-order values is worse than an undrawn one,
 *  so the re-grammar lands through plate weight and type rank instead, and each
 *  card keeps stating its own full date range. Sorting `communityRoles` by start
 *  date makes the ticks correct, but that array is composed in the Experience
 *  page, not here. Re-add the tick in the same change that sorts it. */

/** Center-spine alternating timeline, re-read in the figure grammar: the spine
 *  is the axis, each role's node is a sample point on it, and the role cards are
 *  plates. Hierarchy comes from plate weight and type rank, not from size — the
 *  layout is untouched.
 *
 *  Spine left + single column on mobile. Label entries sit ON the axis and do not
 *  consume a left/right slot.
 *
 *  Desktop interleaving: each role card spans 2 grid rows and starts one row
 *  after the previous role, so opposite-side cards genuinely overlap vertically
 *  instead of stacking in full blank rows. gridRow is inert in the mobile flex
 *  layout. A label must start only after the previous role's two rows END (skip
 *  one extra row), then the next role resumes after it.
 *
 *  Every entry scroll-reveals (Reveal as="li"), staggered 80ms by DOM order and
 *  capped at 240ms; the inline style merges gridRow with the delay var.
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
            <RoleCard role={e.role} />
          </Reveal>
        );
      })}
    </ol>
  );
}
