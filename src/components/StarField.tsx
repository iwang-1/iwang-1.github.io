import { FIELD_STARS } from "../starfield-data";

// Decorative-only spectral ramp (never used for text), bucketed from ci (B–V).
const RAMP = ["#9bb0ff", "#cad7ff", "#f8f7ff", "#fff4ea", "#ffd2a1", "#ffcc6f"];

function color(ci: number): string {
  if (ci < 0.0) return RAMP[0];
  if (ci < 0.3) return RAMP[1];
  if (ci < 0.6) return RAMP[2];
  if (ci < 0.9) return RAMP[3];
  if (ci < 1.2) return RAMP[4];
  return RAMP[5];
}

const TWINKLERS = 12; // exactly 12 stars twinkle (CSS-only; off under reduced motion)

export default function StarField() {
  return (
    <svg
      className="starfield"
      viewBox="0 0 1000 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {FIELD_STARS.map((s, i) => {
        const x = (1 - s.ra / 360) * 1000;
        const y = ((90 - s.dec) / 180) * 400;
        const r = Math.max(0.6, 2.6 - s.mag * 0.55);
        const twinkles = i % 13 === 0 && i / 13 < TWINKLERS;
        return (
          <circle
            key={i}
            cx={x.toFixed(1)}
            cy={y.toFixed(1)}
            r={r.toFixed(2)}
            fill={color(s.ci)}
            className={twinkles ? "twinkle" : undefined}
            style={twinkles ? { animationDelay: `${((i / 13) % 12) * 0.33}s` } : undefined}
          />
        );
      })}
    </svg>
  );
}
