import type { CSSProperties } from "react";

/** FIG. 00 — the boulder topo. A guidebook-style route topo drawn in the
 *  figure grammar: the wall is a contour silhouette, the marked route is
 *  numbered holds joined by a dashed amber leader, and everything off the
 *  route is the unhighlighted sample grey. It is the climbing cell of the
 *  hobby section, set exactly like the measured figures about the work.
 *
 *  Gate contract (verify.mjs): the `.climbing-route` element keeps >=8
 *  `.climb-hold-route`, >=6 `.climb-hold-off-route`, and the literals
 *  START / TOP / "BOULDER / SET 01" as visible text descendants at every
 *  viewport. Do not hide any of them and do not move them out of this node. */

const routeHolds = [
  { n: 1, x: 30, y: 88, rotate: -12, shape: "start" },
  { n: 2, x: 39, y: 84, rotate: 14, shape: "start" },
  { n: 3, x: 26, y: 70, rotate: 18, shape: "edge" },
  { n: 4, x: 44, y: 59, rotate: -9, shape: "jug" },
  { n: 5, x: 33, y: 46, rotate: 22, shape: "edge" },
  { n: 6, x: 52, y: 33, rotate: -15, shape: "jug" },
  { n: 7, x: 41, y: 21, rotate: 11, shape: "edge" },
  { n: 8, x: 55, y: 9, rotate: -5, shape: "top" },
] as const;

const offRouteHolds = [
  { x: 63, y: 79, rotate: 20 },
  { x: 15, y: 62, rotate: -18 },
  { x: 70, y: 55, rotate: -7 },
  { x: 22, y: 36, rotate: 16 },
  { x: 66, y: 27, rotate: -20 },
  { x: 74, y: 12, rotate: 8 },
] as const;

export function ClimbingRoute() {
  return (
    <figure className="plate climbing-route">
      {/* The 00 series is the hobby shelf (A keyboard, B topo, C feed); the
          measured work starts at FIG. 01 below it. */}
      <p className="plate-label">FIG. 00B · off-hours · boulder topo</p>
      <div className="climb-topo">
        <svg
          className="climb-wall"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="climb-wall-face"
            d="M 6 100 L 10 64 L 18 42 L 15 26 L 26 2 L 94 2 L 90 36 L 96 70 L 92 100 Z"
          />
          <path className="climb-wall-seam" d="M 10 64 L 90 58" />
          <path className="climb-wall-seam" d="M 15 26 L 92 31" />
          <g className="climb-wall-bolts" aria-hidden="true">
            <circle className="climb-wall-bolt" cx="24" cy="20" r="0.6" />
            <circle className="climb-wall-bolt" cx="40" cy="16" r="0.6" />
            <circle className="climb-wall-bolt" cx="56" cy="14" r="0.6" />
            <circle className="climb-wall-bolt" cx="72" cy="18" r="0.6" />
            <circle className="climb-wall-bolt" cx="30" cy="44" r="0.6" />
            <circle className="climb-wall-bolt" cx="48" cy="40" r="0.6" />
            <circle className="climb-wall-bolt" cx="64" cy="38" r="0.6" />
            <circle className="climb-wall-bolt" cx="80" cy="42" r="0.6" />
            <circle className="climb-wall-bolt" cx="26" cy="72" r="0.6" />
            <circle className="climb-wall-bolt" cx="44" cy="68" r="0.6" />
            <circle className="climb-wall-bolt" cx="62" cy="66" r="0.6" />
            <circle className="climb-wall-bolt" cx="78" cy="70" r="0.6" />
          </g>
          <path
            className="climb-route-path"
            d="M 30 88 L 39 84 L 26 70 L 44 59 L 33 46 L 52 33 L 41 21 L 55 9"
          />
        </svg>
        {routeHolds.map((hold) => (
          <span
            key={hold.n}
            className={`climb-hold climb-hold-route climb-hold-${hold.shape}`}
            style={
              {
                "--hold-x": `${hold.x}%`,
                "--hold-y": `${hold.y}%`,
                "--hold-rotate": `${hold.rotate}deg`,
              } as CSSProperties
            }
          >
            <i className="climb-num">{hold.n}</i>
          </span>
        ))}
        {offRouteHolds.map((hold) => (
          <span
            key={`${hold.x}-${hold.y}`}
            className="climb-hold climb-hold-off-route"
            style={
              {
                "--hold-x": `${hold.x}%`,
                "--hold-y": `${hold.y}%`,
                "--hold-rotate": `${hold.rotate}deg`,
              } as CSSProperties
            }
          />
        ))}
        <span className="climb-label climb-label-start">START</span>
        <span className="climb-label climb-label-top">TOP</span>
      </div>
      {/* The gate literals stay verbatim and stay in THIS element. The aside is
          appended inside the same footnote node rather than added as a sibling,
          so the caption/figure overlap gate has no new box to collide — and so
          the site acknowledges its own joke once, which is the cheapest warmth
          available on a page this disciplined. */}
      <figcaption className="plate-footnote">
        BOULDER / SET 01 · 8 numbered holds · the dashed line marks the route
        <span className="climb-wink">Yes, I drew my climbing wall as a figure. It felt right.</span>
      </figcaption>
    </figure>
  );
}
