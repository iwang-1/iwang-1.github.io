import type { Role } from "../content";
import { RoleCard } from "./cards";

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
 *  role="list": Safari/VoiceOver drops list semantics from `list-style: none`
 *  lists — the explicit role restores the "list, N items" announcement.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  let n = 0; // role counter — labels don't alternate
  let row = 1; // desktop grid row cursor
  return (
    <ol className="alt-timeline" role="list">
      {entries.map((e) => {
        if (e.kind === "label") {
          row += 1; // clear the previous role's second row
          const start = row++;
          return (
            <li
              key={e.text}
              className="alt-timeline-label"
              style={{ gridRow: `${start} / span 1` }}
            >
              {/* heading = programmatic group boundary (WCAG 1.3.1) */}
              <h3>
                <span>{e.text}</span>
              </h3>
            </li>
          );
        }
        const start = row++;
        return (
          <li
            key={`${e.role.role}-${e.role.org}`}
            className={`alt-timeline-item ${n++ % 2 === 0 ? "tl-left" : "tl-right"}`}
            style={{ gridRow: `${start} / span 2` }}
          >
            <RoleCard role={e.role} tagTone={e.tagTone ?? "default"} />
          </li>
        );
      })}
    </ol>
  );
}
