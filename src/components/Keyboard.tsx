import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import "./Keyboard.css";

/** A DRAWN KEYBOARD — 60% layout, and deliberately not a figure.
 *
 *  This replaces a key tester whose own header comment admitted the defect that
 *  got the last version of this site called machine-made: the hobbies were
 *  "drawn in the same grammar as the measured plates", where "a keycap here is a
 *  tick label that happens to be square". When the keyboard, the climbing wall
 *  and the benchmark all wore hairlines and mono tick labels, a reader concluded
 *  one template made all three.
 *
 *  So this one is a DRAWING. No plate label, no footnote strip, no hairline
 *  grammar. What it has instead is observation: the real unit widths of a 60%
 *  board (1u alphas, 1.5u tab, 1.75u caps, 2.25u shift, 2u backspace and enter,
 *  6.25u spacebar), the real row stagger, and a sculpted cap — each key is two
 *  shapes, an outline and an inset top, because that is what a keycap looks like
 *  from above and it is the single detail that separates a drawn board from
 *  squares in a grid.
 *
 *  WHAT THIS DRAWING DOES NOT CLAIM. It names no model, manufacturer, switch,
 *  keycap set, profile or colourway, because none of that is known and
 *  PRODUCT.md forbids inventing it. Every annotation on it is true OF THE
 *  DRAWING — "60%", "6.25u" — not of anyone's desk. If Ivan wants his actual
 *  board named, the slot is marked BOARD_NOTE below and it is his sentence to
 *  write, not mine to guess.
 *
 *  Interaction survives from the old component because it earned its place:
 *  click a cap, or type while the pointer is over the board, and the cap goes
 *  down. Listeners are armed only while hovered or focused, every timer is
 *  cleaned up, and the drawing is complete in the static HTML — the caps simply
 *  do nothing until the bundle lands, which is honest for a toy.
 */

/** Ivan: replace this with your board if you want it named. Anything here is
 *  rendered verbatim under the drawing. Leave it null and nothing renders — the
 *  drawing does not need a caption to be worth looking at. */
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
    { id: "rshift", legend: "shift", u: 2.75, type: "mod" },
  ],
  [
    { id: "lctrl", legend: "ctrl", u: 1.25, type: "mod" },
    { id: "lmeta", legend: "cmd", u: 1.25, type: "mod" },
    { id: "lalt", legend: "alt", u: 1.25, type: "mod" },
    { id: "space", legend: "", u: 6.25 },
    { id: "ralt", legend: "alt", u: 1.25, type: "mod" },
    { id: "rmeta", legend: "cmd", u: 1.25, type: "mod" },
    { id: "fn", legend: "fn", u: 1.25, type: "mod" },
    { id: "rctrl", legend: "ctrl", u: 1.25, type: "mod" },
  ],
];

/* Drawing geometry, in SVG user units. These are DRAWING dimensions — the same
   class of value as a stroke width — not page type sizes. */
const U = 34; /* one key unit */
const GAP = 3; /* the gap a real board leaves between caps */
const PAD = 14; /* the case bezel */
const ROW_H = U;

const ROW_WIDTH = 15 * U;
const SVG_W = ROW_WIDTH + PAD * 2;
const SVG_H = ROWS.length * ROW_H + PAD * 2;

/** Which physical keys map to which drawn cap, so typing presses the right one.
 *
 *  EVERY cap that prints a typeable character is mapped, not just the alphanumerics.
 *  It used to test `/[A-Z0-9]/i`, which left twelve drawn caps dead to the keyboard
 *  while CLICKING them worked (the button path calls tap() directly) — so the two
 *  affordances the figure advertises behaved differently, and the SVG's own label
 *  promised "type … to press that key" without qualification. Typing `-`, `[`, `;`
 *  or `,` lit nothing.
 *
 *  Both the base legend AND the shifted sub-legend map to the cap, because that is
 *  what a real cap does: pressing `?` presses the `/` key. The modifier caps
 *  (tab/caps/shift/ctrl/cmd/alt/fn/return/delete) are deliberately NOT mapped —
 *  they are chords and browser-owned keys, and hijacking Tab in particular would
 *  trap a keyboard user inside a toy. */
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

/** The caps flattened into one indexed list, with their pixel geometry resolved
 *  once. The hit targets used to recompute `x` inside the render, duplicating the
 *  same running-offset arithmetic the SVG does — two copies of one layout, which
 *  is how a hit target drifts off the cap it covers. This is the single copy, and
 *  it also carries what arrow-key navigation needs (row/col) and a unique
 *  accessible name per cap.
 *
 *  `a11yLabel` disambiguates the doubled modifiers. Four names appeared twice —
 *  shift, ctrl, cmd, alt — so a screen-reader user heard "shift, button… shift,
 *  button" with nothing to tell them apart. The side is a fact the layout already
 *  knows (a cap in the left half of its row is the left one), so it costs nothing
 *  to say. */
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
    /* `x` MUST advance per cap. A first version of this loop omitted the
       `x += ...` step, which collapsed every cap in a row onto the first
       position: all 61 hit targets stacked on the top-left key and every doubled
       modifier resolved to the same side, so the a11y names read "left shift"
       twice. Caught by reading back the rendered labels rather than by trusting
       the arithmetic. */
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
  // Only the genuinely duplicated names take a side prefix — shift, ctrl, cmd and
  // alt, which appear twice each. A unique cap keeps its plain legend, because
  // "left Q" is noise in a screen reader.
  const counts = new Map<string, number>();
  for (const k of out) counts.set(k.legend || "space", (counts.get(k.legend || "space") ?? 0) + 1);
  for (const k of out) {
    const base = k.legend || "space";
    k.a11yLabel = (counts.get(base) ?? 0) > 1 ? `${k.a11yLabel} ${base}` : base;
  }
  return out;
})();

const TAP_MS = 190;

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

  /** Move the roving focus, and press on Enter/Space. Left/Right walk the flat
   *  order (so they cross row boundaries the way reading order does); Up/Down hold
   *  the horizontal position and change row, landing on whichever cap sits nearest
   *  the current one — a 1u alpha above a 6.25u spacebar has to go SOMEWHERE, and
   *  "nearest by centre" is the only answer that feels like a keyboard.
   *  Home/End go to the ends of the current row. Every handled key calls
   *  preventDefault so the page does not also scroll; ARROW KEYS ONLY — Tab is
   *  never intercepted, because trapping Tab inside a hobby toy is the exact
   *  defect this change exists to remove. */
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
                    {/* Cap outline, then the sculpted top inset within it. The
                        inset is the whole reason this reads as a keycap rather
                        than a rectangle: real caps are dished and you see the
                        wall on three sides. */}
                    <rect className="kb-cap" width={w} height={h} rx="3.5" />
                    <rect
                      className="kb-top"
                      x="2.5"
                      y="1.5"
                      width={Math.max(w - 5, 2)}
                      height={Math.max(h - 6, 2)}
                      rx="2.5"
                    />
                    {/* A real dual-legend cap prints the shifted character
                        upper-left and the base character lower-left, not centred
                        on top of each other. Single-legend caps stay centred,
                        which is also what a real cap does. */}
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

      {/* ONE TAB STOP, not sixty-one.

          Buttons live OUTSIDE the SVG so the drawing stays a drawing and the
          interaction stays real: real hit targets, real focus ring, real labels.
          That part was right. What was wrong was giving each of the 61 caps its
          own tab stop. Measured on the built page: 90 focusable elements, 61 of
          them keycaps, the first at index 12 — so a keyboard-only reader tabbing
          from the skip link pressed Tab 61 times through single-character buttons
          that each flash a cap for 190ms, BEFORE reaching the benchmark figure,
          any repository link, or any other evidence. Four labels were duplicated
          ("shift, button… shift, button"), because two shift caps announced
          identically.

          A grid of related controls is one widget, so this is the standard
          composite pattern: the container is the single tab stop, arrow keys move
          between caps inside it, Home/End jump to the row's ends, and Enter or
          Space presses the focused cap. Roving tabindex, so only the active cap is
          reachable by Tab and the rest stay operable by arrow. That is how a real
          keyboard's own key navigation works, and it takes the figure from 61 tab
          stops to 1 without removing a single affordance.

          The caps keep `aria-hidden` off and keep their labels: a screen-reader
          user in browse mode can still read the board cap by cap. */}
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
            /* Two shift caps, two ctrls, two cmds and two alts announced with
               identical names, so a screen-reader user could not tell which one
               they were on. Position is the distinguishing fact, and it is in the
               data already. */
            aria-label={k.a11yLabel}
          />
        ))}
      </div>

      <figcaption className="kb-caption">
        60% layout, drawn to unit width — 1u alphas, 1.75u caps, 6.25u space.
        {BOARD_NOTE ? ` ${BOARD_NOTE}` : ""}
      </figcaption>
    </figure>
  );
}
