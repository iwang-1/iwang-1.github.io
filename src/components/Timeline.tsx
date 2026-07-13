import type { Role } from "../content";
import { RoleCard } from "./cards";

export type TimelineEntry =
  | { kind: "role"; role: Role; tagTone?: "default" | "teal" }
  | { kind: "label"; text: string };

/** Center-spine alternating timeline (spine left + single column on mobile).
 *  Label entries sit ON the spine and do not consume a left/right slot. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  let n = 0; // role counter — labels don't alternate
  return (
    <ol className="alt-timeline">
      {entries.map((e) =>
        e.kind === "label" ? (
          <li key={e.text} className="alt-timeline-label">
            <span>{e.text}</span>
          </li>
        ) : (
          <li
            key={`${e.role.role}-${e.role.org}`}
            className={`alt-timeline-item ${n++ % 2 === 0 ? "tl-left" : "tl-right"}`}
          >
            <RoleCard role={e.role} tagTone={e.tagTone ?? "default"} />
          </li>
        ),
      )}
    </ol>
  );
}
