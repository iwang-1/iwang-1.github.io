import type { CSSProperties } from "react";

const routeHolds = [
  { x: 82, y: 86, rotate: -18, tone: "cyan" },
  { x: 72, y: 71, rotate: 16, tone: "chalk" },
  { x: 86, y: 57, rotate: -8, tone: "gold" },
  { x: 66, y: 44, rotate: 21, tone: "cyan" },
  { x: 79, y: 29, rotate: -14, tone: "chalk" },
  { x: 61, y: 17, rotate: 10, tone: "gold" },
  { x: 76, y: 7, rotate: -5, tone: "cyan" },
] as const;

const routeSegments = [
  { left: 77, top: 79, width: 17, rotate: -124 },
  { left: 70, top: 64, width: 17, rotate: -50 },
  { left: 69, top: 50, width: 20, rotate: -138 },
  { left: 65, top: 36, width: 18, rotate: -48 },
  { left: 62, top: 23, width: 18, rotate: -139 },
  { left: 61, top: 12, width: 16, rotate: -34 },
] as const;

/** Full-bleed bouldering route used as the Home hero's signature scene. */
export function ClimbingRoute() {
  return (
    <div className="climbing-route" aria-hidden="true">
      <div className="climbing-wall-lines">
        <span />
        <span />
        <span />
      </div>
      <div className="climbing-route-line">
        {routeSegments.map((segment, index) => (
          <span
            key={`${segment.left}-${segment.top}`}
            className="climb-segment"
            style={{
              "--segment-left": `${segment.left}%`,
              "--segment-top": `${segment.top}%`,
              "--segment-width": `${segment.width}%`,
              "--segment-rotate": `${segment.rotate}deg`,
              "--segment-delay": `${300 + index * 90}ms`,
            } as CSSProperties}
          />
        ))}
      </div>
      {routeHolds.map((hold, index) => (
        <span
          key={`${hold.x}-${hold.y}`}
          className={`climb-hold climb-hold-${hold.tone}`}
          style={{
            "--hold-x": `${hold.x}%`,
            "--hold-y": `${hold.y}%`,
            "--hold-rotate": `${hold.rotate}deg`,
            "--hold-delay": `${440 + index * 90}ms`,
          } as CSSProperties}
        >
          <span />
        </span>
      ))}
      <span className="climb-finish-ring climb-finish-ring-left" />
      <span className="climb-finish-ring climb-finish-ring-right" />
    </div>
  );
}
