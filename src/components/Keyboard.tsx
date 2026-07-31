import { useCallback, useEffect, useRef, useState } from "react";
import "./Keyboard.css";

/** FIG. 00A — the keyboard. The second off-hours figure, and the sibling of
 *  FIG. 00 (the boulder topo): a hobby drawn in the same grammar as the
 *  measured plates, so the person and the work are set by one hand.
 *
 *  What it is: a key tester. Ten caps of the home row, flat --plate-2 fill,
 *  hairline border, 2px radius, mono legends. No gradient, no bevel, no glow —
 *  a keycap here is a tick label that happens to be square, and the only
 *  saturated colour is the amber a pressed cap borrows, because amber is
 *  interaction and a press is the only interaction this figure has.
 *
 *  Two ways in, both of them the same state:
 *    - click (or Enter/Space) a cap  -> a transient press, TAP_HOLD_MS long
 *    - type the matching letter      -> a real press, held until keyup
 *  The document keydown/keyup listeners exist ONLY while the pointer is over
 *  the figure or focus is inside it, and the disarm path clears every held cap
 *  so a key held while the pointer leaves can never stick down.
 *
 *  Static render: the drawn keyboard is complete in the markup and the readout
 *  ships in its idle state. The caps do nothing until the bundle lands, which
 *  is honest for a toy — this plate is decoration about a hobby, not evidence,
 *  and it carries no number a reader has to be able to check.
 *
 *  Unmounted on its own; a page has to place it. No props: the legends and the
 *  copy are the figure. */

type Cap = {
  /** what is printed on the cap, and the key's identity */
  legend: string;
  /** how the cap is announced, since ";" reads as nothing out loud */
  name: string;
};

/** The home row, split the way a key tester splits it — left hand, right hand,
 *  the second row staggered like a real board. Ten unique legends, so a
 *  physical keypress maps to exactly one cap and the log never doubles. */
const ROWS: readonly (readonly Cap[])[] = [
  [
    { legend: "A", name: "A" },
    { legend: "S", name: "S" },
    { legend: "D", name: "D" },
    { legend: "F", name: "F" },
    { legend: "G", name: "G" },
  ],
  [
    { legend: "H", name: "H" },
    { legend: "J", name: "J" },
    { legend: "K", name: "K" },
    { legend: "L", name: "L" },
    { legend: ";", name: "semicolon" },
  ],
];

const CAPS = ROWS.flat();
const LEGENDS = new Set(CAPS.map((cap) => cap.legend));
const NAMES = new Map(CAPS.map((cap) => [cap.legend, cap.name]));

/** How many legends the readout keeps. Long enough to look like a tester's
 *  scroll, short enough that the line never wraps twice in a 480px plate. */
const LOG_LIMIT = 8;

/** A click has no keyup to wait for, so a tap is a press plus a timer. Longer
 *  than the 120ms --t-tap transition, so the press is always visibly reached
 *  rather than half-eased and cancelled. */
const TAP_HOLD_MS = 180;

/** The physical key -> cap legend map. Single characters only, upper-cased, so
 *  both "a" and "A" find the A cap and no chord or named key ever matches. */
function legendFor(key: string): string | null {
  if (key.length !== 1) return null;
  const legend = key.toUpperCase();
  return LEGENDS.has(legend) ? legend : null;
}

/** True while the event's target is somewhere a reader is actually writing, so
 *  arming the figure by hovering it can never shadow a real text field. */
function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.tagName !== "string") return false;
  return (
    el.isContentEditable ||
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT"
  );
}

export function Keyboard() {
  /** legends currently down — from a real keydown, or from a tap's timer */
  const [down, setDown] = useState<readonly string[]>([]);
  const [log, setLog] = useState<readonly string[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  /** A monotonic press count, whose ONLY job is to make the live region's text
   *  differ on every press. Pressing A four times produced the identical string
   *  "A pressed" each time, so React skipped the DOM write and an unchanged live
   *  region is not re-announced: a screen-reader user heard the first press and
   *  then silence. Rendered as a zero-width discriminator, so the announcement
   *  still reads as "A pressed" and never as a number. */
  const [presses, setPresses] = useState(0);
  const tapTimers = useRef(new Map<string, number>());

  const press = useCallback((legend: string) => {
    setDown((held) => (held.includes(legend) ? held : [...held, legend]));
    setLog((entries) => [...entries, legend].slice(-LOG_LIMIT));
    setPresses((n) => n + 1);
  }, []);

  const release = useCallback((legend: string) => {
    setDown((held) => held.filter((entry) => entry !== legend));
  }, []);

  const tap = useCallback(
    (legend: string) => {
      press(legend);
      const timers = tapTimers.current;
      const pending = timers.get(legend);
      if (pending !== undefined) window.clearTimeout(pending);
      timers.set(
        legend,
        window.setTimeout(() => {
          timers.delete(legend);
          release(legend);
        }, TAP_HOLD_MS),
      );
    },
    [press, release],
  );

  // Every tap leaves a timer behind; unmounting mid-press must not leave one
  // running against a component that is gone.
  useEffect(() => {
    const timers = tapTimers.current;
    return () => {
      for (const id of timers.values()) window.clearTimeout(id);
      timers.clear();
    };
  }, []);

  // ARMED. The listeners are on `document`, so they exist for exactly as long
  // as the reader is plausibly aiming at this figure — pointer over it, or
  // focus inside it — and not one moment longer.
  const armed = hovered || focused;

  useEffect(() => {
    if (!armed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      // Never shadow a shortcut, an auto-repeat, or someone's text field. And
      // never preventDefault: this figure listens, it does not intercept.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.repeat || isTyping(event.target)) return;
      const legend = legendFor(event.key);
      if (legend) press(legend);
    };

    // Deliberately unguarded by modifiers: pressing A, then Ctrl, then
    // releasing A must still let the cap up.
    const onKeyUp = (event: KeyboardEvent) => {
      const legend = legendFor(event.key);
      if (legend) release(legend);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      // Disarming with a key still held would leave that cap down forever,
      // since its keyup lands after the listener is gone.
      setDown([]);
    };
  }, [armed, press, release]);

  const last = log.length ? log[log.length - 1] : null;

  return (
    <figure
      className="plate keyboard-fig"
      role="group"
      aria-label="A drawn key tester, off the clock: ten home-row keycaps. Activate a keycap to press it, or type the matching letter while the pointer is over the figure."
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        // Tabbing from one cap to the next fires blur then focus. Without this
        // check the figure would disarm and re-arm between every cap, dropping
        // whatever was held on the way through.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      <p className="plate-label">Key tester</p>

      <div className="keyboard-rows">
        {ROWS.map((row, index) => (
          <div
            key={row[0].legend}
            className={index ? "keyboard-row keyboard-row-lower" : "keyboard-row"}
          >
            {row.map((cap) => (
              <button
                key={cap.legend}
                type="button"
                className={
                  down.includes(cap.legend) ? "keyboard-cap is-down" : "keyboard-cap"
                }
                aria-label={`Press the ${cap.name} key`}
                onClick={() => tap(cap.legend)}
              >
                {cap.legend}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* The tester's own readout: the last few legends, in the amber that
          every other interaction on the site is set in. Idle it drops to
          --ink-3, because nothing has been annotated yet. */}
      <p className="keyboard-readout">
        <span className="keyboard-readout-key">log</span>
        <span
          className={
            log.length ? "keyboard-readout-value" : "keyboard-readout-value is-idle"
          }
        >
          {log.length ? log.join(" ") : "idle · no keys yet"}
        </span>
        {/* Gated on `.js` in the stylesheet: without the bundle there is
            nothing to press, and inviting a reader to press it would be a lie.
            Two registers, because half the old single string was unreachable on
            the pointer that meets this figure first: a phone has no hover, and
            this is now the first interactive thing on the page. The stylesheet
            shows exactly one of these per input type. */}
        <span className="keyboard-hint keyboard-hint-fine">
          Click a key, or type while hovering
        </span>
        <span className="keyboard-hint keyboard-hint-coarse">Tap a key</span>
      </p>
      {/* The live region is the stable <p>; the message is a child keyed on the
          press count, so every press REMOVES and RE-INSERTS a node inside the
          region rather than rewriting an identical string. Pressing A four times
          used to produce the same "A pressed" text, React skipped the DOM write,
          and an unchanged live region is not re-announced — one announcement for
          four presses. The announced string is untouched. */}
      <p className="keyboard-live visually-hidden" aria-live="polite">
        {last ? <span key={presses}>{`${NAMES.get(last) ?? last} pressed`}</span> : null}
      </p>

      <figcaption className="plate-footnote">Linear switches, lubed.</figcaption>
    </figure>
  );
}
