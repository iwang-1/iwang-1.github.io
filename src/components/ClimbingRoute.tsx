import type { CSSProperties } from "react";

const routeHolds = [
  { x: 82, y: 84, rotate: -12, shape: "start" },
  { x: 88, y: 81, rotate: 14, shape: "start" },
  { x: 73, y: 69, rotate: 18, shape: "edge" },
  { x: 86, y: 57, rotate: -9, shape: "jug" },
  { x: 68, y: 44, rotate: 22, shape: "edge" },
  { x: 80, y: 30, rotate: -15, shape: "jug" },
  { x: 64, y: 18, rotate: 11, shape: "edge" },
  { x: 77, y: 8, rotate: -5, shape: "top" },
] as const;

const offRouteHolds = [
  { x: 57, y: 77, rotate: 20, tone: "gold" },
  { x: 95, y: 68, rotate: -18, tone: "chalk" },
  { x: 58, y: 57, rotate: -7, tone: "chalk" },
  { x: 94, y: 41, rotate: 16, tone: "gold" },
  { x: 56, y: 31, rotate: -20, tone: "gold" },
  { x: 92, y: 19, rotate: 8, tone: "chalk" },
] as const;

const routeSegments = [
  { left: 82, top: 82, width: 16, rotate: -128 },
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
      <div className="climbing-wall-panel" />
      <div className="climbing-wall-lines">
        <span />
        <span />
        <span />
      </div>
      <div className="climbing-wall-bolts">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <span className="climb-route-tag">BOULDER / SET 01</span>
      <span className="climb-mat" />
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
          className={`climb-hold climb-hold-route climb-hold-${hold.shape}`}
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
      {offRouteHolds.map((hold) => (
        <span
          key={`${hold.x}-${hold.y}`}
          className={`climb-hold climb-hold-off-route climb-hold-${hold.tone}`}
          style={{
            "--hold-x": `${hold.x}%`,
            "--hold-y": `${hold.y}%`,
            "--hold-rotate": `${hold.rotate}deg`,
          } as CSSProperties}
        >
          <span />
        </span>
      ))}
      <span className="climb-label climb-label-start">START</span>
      <span className="climb-label climb-label-top">TOP</span>
    </div>
  );
}
