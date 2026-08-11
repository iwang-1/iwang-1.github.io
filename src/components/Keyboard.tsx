import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import "./Keyboard.css";

/** A drawn keyboard. */

/** Ivan: replace this with your board if you want it named. Anything here is rendered verbatim under the
 * drawing. */
const BOARD_NOTE: string | null = null;

/** One key. `u` is width in units (1u = one alpha key). `legend` is what is
 *  printed on it; `sub` is the shifted legend where a real cap carries one. */
type Key = { id: string; legend: string; u?: number; sub?: string; type?: "mod" };

/** A 60% layout, row by row, in real unit widths. The rows sum to 15u, which is
 *  what makes the right edge line up without fudging any single key. */
const ROWS: readonly (readonly Key[])[] = [
  [
    { id: "grave", legend: "`", sub: "~" },
    { id: "1", legend: "1", sub: "!" },
    { id: "2", legend: "2", sub: "@" },
    { id: "3", legend: "3", sub: "#" },
    { id: "4", legend: "4", sub: "$" },
    { id: "5", legend: "5", sub: "%" },
    { id: "6", legend: "6", sub: "^" },
    { id: "7", legend: "7", sub: "&" },
    { id: "8", legend: "8", sub: "*" },
    { id: "9", legend: "9", sub: "(" },
    { id: "0", legend: "0", sub: ")" },
    { id: "minus", legend: "-", sub: "_" },
    { id: "equal", legend: "=", sub: "+" },
    { id: "bksp", legend: "delete", u: 2, type: "mod" },
    { id: "del", legend: "del", type: "mod" },
  ],
  [
    { id: "tab", legend: "tab", u: 1.5, type: "mod" },
    { id: "q", legend: "Q" },
    { id: "w", legend: "W" },
    { id: "e", legend: "E" },
    { id: "r", legend: "R" },
    { id: "t", legend: "T" },
    { id: "y", legend: "Y" },
    { id: "u", legend: "U" },
    { id: "i", legend: "I" },
    { id: "o", legend: "O" },
    { id: "p", legend: "P" },
    { id: "lbracket", legend: "[", sub: "{" },
    { id: "rbracket", legend: "]", sub: "}" },
    { id: "backslash", legend: "\\", u: 1.5, sub: "|", type: "mod" },
    { id: "pgup", legend: "pg\u2191", type: "mod" },
  ],
  [
    { id: "caps", legend: "caps", u: 1.75, type: "mod" },
    { id: "a", legend: "A" },
    { id: "s", legend: "S" },
    { id: "d", legend: "D" },
    { id: "f", legend: "F" },
    { id: "g", legend: "G" },
    { id: "h", legend: "H" },
    { id: "j", legend: "J" },
    { id: "k", legend: "K" },
    { id: "l", legend: "L" },
    { id: "semicolon", legend: ";", sub: ":" },
    { id: "quote", legend: "'", sub: '"' },
    { id: "enter", legend: "return", u: 2.25, type: "mod" },
    { id: "pgdn", legend: "pg\u2193", type: "mod" },
  ],
  [
    { id: "lshift", legend: "shift", u: 2.25, type: "mod" },
    { id: "z", legend: "Z" },
    { id: "x", legend: "X" },
    { id: "c", legend: "C" },
    { id: "v", legend: "V" },
    { id: "b", legend: "B" },
    { id: "n", legend: "N" },
    { id: "m", legend: "M" },
    { id: "comma", legend: ",", sub: "<" },
    { id: "period", legend: ".", sub: ">" },
    { id: "slash", legend: "/", sub: "?" },
    { id: "rshift", legend: "shift", u: 1.75, type: "mod" },
    { id: "up", legend: "\u2191", type: "mod" },
    { id: "end", legend: "end", type: "mod" },
  ],
  [
    { id: "lctrl", legend: "ctrl", u: 1.25, type: "mod" },
    { id: "lmeta", legend: "cmd", u: 1.25, type: "mod" },
    { id: "lalt", legend: "alt", u: 1.25, type: "mod" },
    { id: "space", legend: "", u: 6.25 },
    { id: "ralt", legend: "alt", u: 1.25, type: "mod" },
    { id: "fn", legend: "fn", u: 1.75, type: "mod" },
    { id: "left", legend: "\u2190", type: "mod" },
    { id: "down", legend: "\u2193", type: "mod" },
    { id: "right", legend: "\u2192", type: "mod" },
  ],
];

/** Which physical keys map to which drawn cap, so typing presses the right one. every cap that prints a
 * typeable character is mapped, not just the alphanumerics. */
const BY_KEY = new Map<string, string>();
for (const row of ROWS)
  for (const k of row) {
    if (k.type === "mod") continue;
    if (k.legend.length === 1) {
      BY_KEY.set(k.legend.toUpperCase(), k.id);
      if (k.legend !== k.legend.toUpperCase()) BY_KEY.set(k.legend, k.id);
    }
    if (k.sub && k.sub.length === 1) BY_KEY.set(k.sub, k.id);
  }
BY_KEY.set(" ", "space");

const TAP_MS = 190;

/* Drawing geometry, in SVG user units. These are DRAWING dimensions — the same
   class of value as a stroke width — not page type sizes. */
const U = 34; /* one key unit */
const GAP = 3; /* the gap a real board leaves between caps */
const PAD = 14; /* the case bezel */
const ROW_H = U;

/* 16u, because this is a 65%: the 60% grid plus a right-hand column (del, pgup, pgdn, end) and an inverted-T
   arrow cluster in the bottom two rows. */
const ROW_WIDTH = 16 * U;
const SVG_W = ROW_WIDTH + PAD * 2;
const SVG_H = ROWS.length * ROW_H + PAD * 2;

/** The caps flattened into one indexed list, with their pixel geometry resolved once. */
type FlatKey = {
  id: string;
  legend: string;
  row: number;
  col: number;
  left: number;
  top: number;
  width: number;
  height: number;
  a11yLabel: string;
};

const FLAT: FlatKey[] = (() => {
  const out: FlatKey[] = [];
  ROWS.forEach((row, r) => {
    /* `x` must advance per cap. */
    let x = PAD;
    row.forEach((k, c) => {
      const w = (k.u ?? 1) * U - GAP;
      const centre = x + w / 2;
      out.push({
        id: k.id,
        legend: k.legend,
        row: r,
        col: c,
        left: (x / SVG_W) * 100,
        top: ((PAD + r * ROW_H) / SVG_H) * 100,
        width: (w / SVG_W) * 100,
        height: ((U - GAP) / SVG_H) * 100,
        /* Side is decided here, where the true centre is known; whether it is
           USED is decided below, once every name's duplicate count is known. */
        a11yLabel: centre < PAD + ROW_WIDTH / 2 ? "left" : "right",
      });
      x += (k.u ?? 1) * U;
    });
  });
  // Only the genuinely duplicated names take a side prefix.
  const counts = new Map<string, number>();
  for (const k of out) counts.set(k.legend || "space", (counts.get(k.legend || "space") ?? 0) + 1);
  for (const k of out) {
    const base = k.legend || "space";
    k.a11yLabel = (counts.get(base) ?? 0) > 1 ? `${k.a11yLabel} ${base}` : base;
  }
  return out;
})();

function isTyping(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || typeof el.tagName !== "string") return false;
  return (
    el.isContentEditable ||
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT"
  );
}

export function Keyboard() {
  const [down, setDown] = useState<readonly string[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  /** Which cap the roving tabindex is on. `null` until the grid is first entered,
   *  so nothing is focused on load. */
  const [active, setActive] = useState<number | null>(null);
  const timers = useRef(new Map<string, number>());
  const capRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const press = useCallback((id: string) => {
    setDown((held) => (held.includes(id) ? held : [...held, id]));
  }, []);
  const release = useCallback((id: string) => {
    setDown((held) => held.filter((h) => h !== id));
  }, []);

  const tap = useCallback(
    (id: string) => {
      press(id);
      const t = timers.current;
      const pending = t.get(id);
      if (pending !== undefined) window.clearTimeout(pending);
      t.set(
        id,
        window.setTimeout(() => {
          t.delete(id);
          release(id);
        }, TAP_MS),
      );
    },
    [press, release],
  );

  useEffect(() => {
    const t = timers.current;
    return () => {
      for (const id of t.values()) window.clearTimeout(id);
      t.clear();
    };
  }, []);

  /** Move the roving focus, and press on Enter/Space. */
  const onGridKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const i = active ?? 0;
      const cur = FLAT[i];
      const centre = cur.left + cur.width / 2;
      const rowOf = (r: number) => FLAT.filter((k) => k.row === r);
      const nearestIn = (r: number) => {
        const cands = rowOf(r);
        if (!cands.length) return null;
        return cands.reduce((best, k) =>
          Math.abs(k.left + k.width / 2 - centre) < Math.abs(best.left + best.width / 2 - centre)
            ? k
            : best,
        );
      };
      let next: number | null = null;
      switch (e.key) {
        case "ArrowRight":
          next = Math.min(i + 1, FLAT.length - 1);
          break;
        case "ArrowLeft":
          next = Math.max(i - 1, 0);
          break;
        case "ArrowDown": {
          const k = nearestIn(Math.min(cur.row + 1, ROWS.length - 1));
          next = k ? FLAT.indexOf(k) : null;
          break;
        }
        case "ArrowUp": {
          const k = nearestIn(Math.max(cur.row - 1, 0));
          next = k ? FLAT.indexOf(k) : null;
          break;
        }
        case "Home":
          next = FLAT.indexOf(rowOf(cur.row)[0]);
          break;
        case "End": {
          const r = rowOf(cur.row);
          next = FLAT.indexOf(r[r.length - 1]);
          break;
        }
        case "Enter":
        case " ":
          e.preventDefault();
          setActive(i);
          tap(cur.id);
          return;
        default:
          return;
      }
      if (next === null) return;
      e.preventDefault();
      setActive(next);
      capRefs.current[next]?.focus();
    },
    [active, tap],
  );

  const armed = hovered || focused;
  useEffect(() => {
    if (!armed) return;
    const onDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || isTyping(e.target)) return;
      const id = BY_KEY.get(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      if (id) press(id);
    };
    const onUp = (e: KeyboardEvent) => {
      const id = BY_KEY.get(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      if (id) release(id);
    };
    document.addEventListener("keydown", onDown);
    document.addEventListener("keyup", onUp);
    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("keyup", onUp);
      setDown([]);
    };
  }, [armed, press, release]);

  return (
    <figure
      className="kb"
      /* The hit layer's aspect ratio comes from the SVG's own viewBox, so the two
         boxes are the same shape by construction. See the note in Keyboard.css. */
      style={{ "--kb-aspect": `${SVG_W} / ${SVG_H}` } as React.CSSProperties}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <svg
        className="kb-svg"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        role="img"
        aria-label="A drawn 60% keyboard. Activate a key, or type while the pointer is over it, to press that key."
      >
        {/* The case. Two shapes, because a case has a wall you can see: the outer
            plate and the recessed floor the keys sit in. */}
        <rect className="kb-case" x="1" y="1" width={SVG_W - 2} height={SVG_H - 2} rx="7" />
        <rect
          className="kb-well"
          x={PAD - 5}
          y={PAD - 5}
          width={ROW_WIDTH + 10}
          height={ROWS.length * ROW_H + 10}
          rx="3"
        />
        {ROWS.map((row, r) => {
          let x = PAD;
          return (
            <g key={r} className="kb-row">
              {row.map((k) => {
                const w = (k.u ?? 1) * U - GAP;
                const y = PAD + r * ROW_H;
                const h = U - GAP;
                const isDown = down.includes(k.id);
                const el = (
                  <g
                    key={k.id}
                    className={`kb-key${k.type === "mod" ? " kb-key-mod" : ""}${isDown ? " is-down" : ""}`}
                    transform={`translate(${x} ${y})`}
                  >
                    {/* Cap outline, then the sculpted top inset within it. The inset is the whole reason this
                       reads as a keycap rather than a rectangle: real caps are dished and you see the wall on three sides. */}
                    <rect className="kb-cap" width={w} height={h} rx="3.5" />
                    <rect
                      className="kb-top"
                      x="2.5"
                      y="1.5"
                      width={Math.max(w - 5, 2)}
                      height={Math.max(h - 6, 2)}
                      rx="2.5"
                    />
                    {/* A real dual-legend cap prints the shifted character upper-left and the base character
                       lower-left, not centred on top of each other. */}
                    {k.sub ? (
                      <>
                        <text className="kb-sub" x="6" y="12">
                          {k.sub}
                        </text>
                        <text className="kb-legend kb-legend-dual" x="6" y={h - 6}>
                          {k.legend}
                        </text>
                      </>
                    ) : (
                      <text className="kb-legend" x={w / 2} y={h / 2 + 3.5}>
                        {k.legend}
                      </text>
                    )}
                  </g>
                );
                x += (k.u ?? 1) * U;
                return el;
              })}
            </g>
          );
        })}
      </svg>

      {/* One tab stop, not sixty-one. Buttons live outside the SVG so the drawing stays a drawing and the
         interaction stays real: real hit targets, real focus ring, real labels. */}
      <div
        className="kb-hit"
        role="grid"
        aria-label="Keycaps. Use the arrow keys to move between keys, then Enter or Space to press one."
        tabIndex={0}
        onFocus={(e) => {
          if (e.target === e.currentTarget && active === null) setActive(0);
        }}
        onKeyDown={onGridKeyDown}
      >
        {FLAT.map((k, i) => (
          <button
            key={k.id}
            type="button"
            className="kb-hit-btn"
            style={{ left: `${k.left}%`, top: `${k.top}%`, width: `${k.width}%`, height: `${k.height}%` }}
            onClick={() => {
              setActive(i);
              tap(k.id);
            }}
            /* Roving tabindex: the container owns the tab stop, so every cap is
               -1 and reached by arrow key instead. */
            tabIndex={-1}
            ref={(el) => {
              capRefs.current[i] = el;
            }}
            /* Two shift caps, two ctrls, two cmds and two alts announced with identical names, so a
               screen-reader user could not tell which one they were on. */
            aria-label={k.a11yLabel}
          />
        ))}
      </div>

      <figcaption className="kb-caption">
        65% layout, drawn to unit width: 1u alphas, 1.75u caps, 6.25u space, and the
        right-hand column an arrow cluster needs.
        {BOARD_NOTE ? ` ${BOARD_NOTE}` : ""}
      </figcaption>
    </figure>
  );
}
