/** Progressive-enhancement layer — everything here is injected by the bundle
 *  at runtime and lives OUTSIDE #root, so it never touches the prerendered
 *  static HTML. Without JS the site is unchanged and fully usable; with JS it
 *  gains four tactile touches:
 *
 *    1. a keyboard command palette (g-chords + `?` help overlay) with a
 *       discoverable floating button,
 *    2. a cursor-reactive keycap cluster in the Home "About" motif, and
 *    3. cursor-reactive climbing holds in the Home hero.
 *
 *  Motion respects prefers-reduced-motion (the cursor effect is skipped and
 *  the global reduced-motion CSS block strips every transition). Imported
 *  after js-flag by every page entry; guarded so it runs once per document. */
import { person } from "./content";

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Shortcut {
  second: string; // the key pressed after `g`
  label: string;
  href: string;
}

const SHORTCUTS: Shortcut[] = [
  { second: "h", label: "Go to Home", href: "/" },
  { second: "e", label: "Go to Experience", href: "/experience/" },
  { second: "p", label: "Go to Projects", href: "/projects/" },
  { second: "r", label: "Open Résumé (PDF)", href: person.resumeUrl },
];

// ----------------------------------------------------------- command palette
function keycapGlyph(): string {
  // small keyboard glyph for the floating button (decorative)
  return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M6.5 13.5h11"/></svg>`;
}

function buildOverlay(): { fab: HTMLButtonElement; overlay: HTMLElement } {
  const rows = SHORTCUTS.map(
    (s) =>
      `<li><a href="${s.href}"><span>${s.label}</span><span class="kbd-combo"><kbd>g</kbd><kbd>${s.second}</kbd></span></a></li>`,
  ).join("");

  const overlay = document.createElement("div");
  overlay.id = "kbd-help";
  overlay.className = "kbd-help";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Keyboard shortcuts");
  overlay.hidden = true;
  overlay.innerHTML =
    `<div class="kbd-help-backdrop" data-close></div>` +
    `<div class="kbd-help-card">` +
    `<p class="kbd-help-title">Keyboard shortcuts</p>` +
    `<ul class="kbd-help-list">${rows}</ul>` +
    `<p class="kbd-help-foot"><kbd>?</kbd> toggles this panel · <kbd>Esc</kbd> closes it</p>` +
    `<button type="button" class="keycap kbd-help-close" data-close>Close</button>` +
    `</div>`;

  const fab = document.createElement("button");
  fab.type = "button";
  fab.id = "kbd-fab";
  fab.className = "kbd-fab";
  fab.setAttribute("aria-haspopup", "dialog");
  fab.setAttribute("aria-label", "Keyboard shortcuts");
  fab.innerHTML = keycapGlyph();

  document.body.appendChild(overlay);
  document.body.appendChild(fab);
  return { fab, overlay };
}

function mountCommandPalette(): void {
  if (document.getElementById("kbd-fab")) return;
  const { fab, overlay } = buildOverlay();
  const card = overlay.querySelector<HTMLElement>(".kbd-help-card");
  let lastFocused: HTMLElement | null = null;

  const focusables = (): HTMLElement[] =>
    card
      ? Array.from(card.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      : [];

  const isOpen = () => !overlay.hidden;

  let closeTimer = 0;
  const root = document.getElementById("root");

  const open = () => {
    if (closeTimer) {
      // reopen mid-exit: cancel the pending hide and resume
      window.clearTimeout(closeTimer);
      closeTimer = 0;
    } else if (isOpen()) {
      return;
    }
    const active = document.activeElement as HTMLElement | null;
    if (!active || !overlay.contains(active)) lastFocused = active;
    overlay.hidden = false;
    // make the page behind the modal inert so focus can't escape the dialog
    root?.setAttribute("inert", "");
    fab.setAttribute("inert", "");
    document.body.classList.add("modal-open");
    // next frame so the transition runs from the hidden state
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    focusables()[0]?.focus();
  };

  const close = () => {
    if (!isOpen() || closeTimer) return;
    overlay.classList.remove("is-open");
    const finish = () => {
      closeTimer = 0;
      overlay.hidden = true;
      // remove inert BEFORE restoring focus — .focus() is a no-op inside an
      // inert subtree, and lastFocused usually lives inside #root.
      root?.removeAttribute("inert");
      fab.removeAttribute("inert");
      document.body.classList.remove("modal-open");
      // Restore focus per the WAI-ARIA dialog pattern: back to where the user
      // was, falling back to the launcher when the palette was opened with no
      // meaningful focus (activeElement === body) or the element is gone.
      const target =
        lastFocused && lastFocused !== document.body && lastFocused.isConnected
          ? lastFocused
          : fab;
      target.focus();
    };
    if (prefersReduced()) finish();
    else closeTimer = window.setTimeout(finish, 200);
  };

  const toggle = () => (isOpen() ? close() : open());

  fab.addEventListener("click", open);
  overlay.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("[data-close]")) close();
  });

  // g-chord tracking
  let pendingG = false;
  let gTimer = 0;
  const resetChord = () => {
    pendingG = false;
    if (gTimer) window.clearTimeout(gTimer);
    gTimer = 0;
  };

  const typingTarget = (el: EventTarget | null): boolean => {
    const t = el as HTMLElement | null;
    if (!t) return false;
    const tag = t.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      t.isContentEditable
    );
  };

  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;

    if (isOpen()) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        // simple focus trap
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!active || !card?.contains(active)) {
          // focus escaped the dialog (e.g. onto <body>) — pull it back in
          e.preventDefault();
          first.focus();
          return;
        }
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
      return;
    }

    if (typingTarget(e.target)) return;

    if (e.key === "?") {
      e.preventDefault();
      toggle();
      return;
    }

    if (pendingG) {
      const match = SHORTCUTS.find((s) => s.second === e.key.toLowerCase());
      resetChord();
      if (match) {
        e.preventDefault();
        if (match.href.endsWith(".pdf")) window.open(match.href, "_blank", "noopener");
        else window.location.assign(match.href);
      }
      return;
    }

    if (e.key.toLowerCase() === "g") {
      pendingG = true;
      gTimer = window.setTimeout(resetChord, 1200);
    }
  });
}

// -------------------------------------------------- cursor-reactive cluster
function mountReactiveCluster(): void {
  if (prefersReduced()) return;
  const svg = document.querySelector<SVGSVGElement>(".about-visual svg.kc-cluster");
  if (!svg) return;
  // Only wire up when the motif is actually laid out (it is display:none below
  // 1024px, where getBBox would report a zero rect).
  if (svg.getBoundingClientRect().width === 0) return;
  const keys = Array.from(svg.querySelectorAll<SVGGElement>(".kc-key"));
  if (keys.length === 0) return;

  const vb = svg.viewBox.baseVal;
  const centers = keys.map((g) => {
    const b = g.getBBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  });

  const MAX_LIFT = 6; // user units — matched by the CSS transition on .kc-key
  const RADIUS = 78;

  let ticking = false;
  let lastX = 0;
  let lastY = 0;
  const apply = () => {
    ticking = false;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = ((lastX - rect.left) / rect.width) * vb.width;
    const py = ((lastY - rect.top) / rect.height) * vb.height;
    for (let i = 0; i < keys.length; i++) {
      const c = centers[i];
      const dist = Math.hypot(px - c.x, py - c.y);
      const lift = dist < RADIUS ? MAX_LIFT * (1 - dist / RADIUS) : 0;
      // CSS transform (not the SVG attribute) so the .kc-key transition eases
      // the lift and the return-to-rest on pointerleave.
      keys[i].style.transform = `translateY(${(-lift).toFixed(2)}px)`;
    }
  };
  const onMove = (e: PointerEvent) => {
    lastX = e.clientX;
    lastY = e.clientY;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  };
  const reset = () => keys.forEach((k) => (k.style.transform = "translateY(0px)"));

  svg.addEventListener("pointermove", onMove);
  svg.addEventListener("pointerleave", reset);
}

// ------------------------------------------------ reactive climbing route
function mountReactiveClimbingRoute(): void {
  if (prefersReduced()) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (!window.matchMedia("(hover: hover)").matches) return;
  const band = document.querySelector<HTMLElement>(".hero-band");
  if (!band) return;
  const holds = Array.from(
    band.querySelectorAll<HTMLElement>(".climbing-route .climb-hold"),
  );
  if (holds.length === 0) return;

  let ticking = false;
  let lastX = 0;
  let lastY = 0;

  const paint = () => {
    ticking = false;
    for (const hold of holds) {
      const rect = hold.getBoundingClientRect();
      const distance = Math.hypot(
        lastX - (rect.left + rect.width / 2),
        lastY - (rect.top + rect.height / 2),
      );
      const lift = distance < 150 ? 8 * (1 - distance / 150) : 0;
      hold.style.setProperty("--hold-lift", `${-lift.toFixed(2)}px`);
    }
  };
  const onMove = (event: PointerEvent) => {
    lastX = event.clientX;
    lastY = event.clientY;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };
  const reset = () => {
    holds.forEach((hold) => hold.style.setProperty("--hold-lift", "0px"));
  };

  band.addEventListener("pointermove", onMove);
  band.addEventListener("pointerleave", reset);

  // Inline custom properties are not reset by the reduced-motion CSS block.
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", (event) => {
      if (!event.matches) return;
      band.removeEventListener("pointermove", onMove);
      band.removeEventListener("pointerleave", reset);
      reset();
    });
}

function init(): void {
  mountCommandPalette();
  mountReactiveCluster();
  mountReactiveClimbingRoute();
}

// ES imports are hoisted, so this module evaluates BEFORE the page entry's
// createRoot(...).render(...). Defer init one frame past a settled DOM so the
// reactive elements query React's rendered nodes, not the prerendered nodes
// React is about to replace.
function boot(): void {
  requestAnimationFrame(init);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
}

export {};
