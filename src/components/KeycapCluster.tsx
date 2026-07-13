/** KeycapCluster — decorative inline-SVG keyboard motif for the About
 *  section's desktop right column. Two staggered rows of keycaps spelling
 *  I-V-A-N / W-A-N-G in the same double-rect keycap language as the nav
 *  monogram. Purely decorative: aria-hidden, no interaction, token-driven
 *  colors so it tracks the theme. */

const KEY = 56; // keycap size
const GAP = 10; // gap between caps
const DROP = 4; // bottom-edge shadow offset
const ROW_STAGGER = 28; // half-key offset, like a real keyboard row

const ROWS: string[][] = [
  ["I", "V", "A", "N"],
  ["W", "A", "N", "G"],
];

function Key({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y + DROP} width={KEY} height={KEY - DROP} rx="9" fill="var(--shadow-edge)" />
      <rect
        x={x}
        y={y}
        width={KEY}
        height={KEY - DROP}
        rx="9"
        fill="var(--surface)"
        stroke="var(--border-interactive)"
        strokeWidth="1"
      />
      <text
        x={x + KEY / 2}
        y={y + (KEY - DROP) / 2 + 6}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="17"
        fontWeight="600"
        fill="var(--ink-2)"
      >
        {label}
      </text>
    </g>
  );
}

export function KeycapCluster() {
  const rowWidth = ROWS[0].length * KEY + (ROWS[0].length - 1) * GAP;
  const width = rowWidth + ROW_STAGGER + 16;
  const height = 2 * KEY + GAP + 16;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {ROWS.map((row, r) =>
        row.map((label, c) => (
          <Key
            key={`${r}-${c}`}
            x={8 + r * ROW_STAGGER + c * (KEY + GAP)}
            y={8 + r * (KEY + GAP)}
            label={label}
          />
        )),
      )}
    </svg>
  );
}
