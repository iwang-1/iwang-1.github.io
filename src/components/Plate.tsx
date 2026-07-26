import type { CSSProperties, ReactNode } from "react";

/** Plate — the figure frame, and the site's primary container.
 *
 *  Three parts, in this order: a small-caps mono label naming what the figure
 *  is ("FIG. 02 · parallax-kv"), the body, and a footnote strip under a
 *  hairline. The footnote is where measurement conditions and the † scope note
 *  live, which is the structural point of the primitive: a limitation set as a
 *  footnote is a footnote, whereas the same sentence set as the card's last
 *  paragraph is a closing argument. Nothing about the wording changes — only
 *  where it sits.
 *
 *  `footnote` accepts nodes so a caller can join provenance and the scope note
 *  in one strip without this component owning the separator.
 *
 *  `stripStyle` exists for one case: a plate whose className switches the box to
 *  a multi-column grid. The label and the footnote are siblings of the body, so
 *  they become grid items too and would sit in a column each; the caller passes
 *  `gridColumn: "1 / -1"` and both strips span the full width. The plate does not
 *  guess at the caller's track list. */
export function Plate({
  label,
  footnote,
  className,
  id,
  stripStyle,
  children,
}: {
  label?: string;
  footnote?: ReactNode;
  className?: string;
  id?: string;
  stripStyle?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={className ? `plate ${className}` : "plate"} id={id}>
      {label && (
        <p className="plate-label" style={stripStyle}>
          {label}
        </p>
      )}
      {children}
      {footnote && (
        <p className="plate-footnote" style={stripStyle}>
          {footnote}
        </p>
      )}
    </div>
  );
}
