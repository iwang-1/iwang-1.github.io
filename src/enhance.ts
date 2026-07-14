/** Progressive-enhancement layer — everything here is injected by the bundle
 *  at runtime and lives OUTSIDE #root, so it never touches the prerendered
 *  static HTML. Without JS the site is unchanged and fully usable; with JS it
 *  gains three keyboard-themed touches:
 *
 *    1. a reading-progress rail under the sticky nav,
 *    2. a keyboard command palette (g-chords + `?` help overlay) with a
 *       discoverable floating button, and
 *    3. a cursor-reactive keycap cluster in the Home "About" motif.
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

// --------------------------------------------------------------- progress rail
function mountProgressRail(): void {
  if (document.getElementById("progress-rail")) return;
  const rail = document.createElement("div");
  rail.id = "progress-rail";
  rail.setAttribute("aria-hidden", "true");
  document.body.appendChild(rail);

  let ticking = false;
  const paint = () => {
    ticking = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    rail.style.transform = `scaleX(${pct})`;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };
  paint();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

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
    `<p class="kbd-help-foot"><kbd>?</kbd> toggles this panel · <kbd>Esc</kbd> closes</p>` +
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

  const open = () => {
    if (isOpen()) return;
    lastFocused = document.activeElement as HTMLElement | null;
    overlay.hidden = false;
    // next frame so the transition runs from the hidden state
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    focusables()[0]?.focus();
  };

  const close = () => {
    if (!isOpen()) return;
    overlay.classList.remove("is-open");
    overlay.hidden = true;
    (lastFocused ?? fab).focus();
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

// -------------------------------------------------- hero cursor backlight
// The hero band reads as a backlit keyboard: a faint keycap grid (CSS
// ::before) lights under the pointer. This drives the light "puck" position
// via --kx/--ky. Guarded off under reduced motion and on touch/no-hover
// devices; no-op on pages without a .hero-band (Experience/Projects/404).
function mountHeroBacklight(): void {
  if (prefersReduced()) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (!window.matchMedia("(hover: hover)").matches) return;
  const band = document.querySelector<HTMLElement>(".hero-band");
  if (!band) return;

  let rect: DOMRect | null = null; // cached; recomputed lazily inside paint
  let ticking = false;
  let lastX = 0;
  let lastY = 0;

  const paint = () => {
    ticking = false;
    if (!rect) rect = band.getBoundingClientRect();
    band.style.setProperty("--kx", `${lastX - rect.left}px`);
    band.style.setProperty("--ky", `${lastY - rect.top}px`);
  };
  const onMove = (e: PointerEvent) => {
    lastX = e.clientX;
    lastY = e.clientY;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };
  const reset = () => {
    band.style.setProperty("--kx", "-999px");
    band.style.setProperty("--ky", "-999px");
  };
  const invalidate = () => {
    rect = null;
  };

  band.addEventListener("pointermove", onMove);
  band.addEventListener("pointerleave", reset);
  window.addEventListener("resize", invalidate, { passive: true });
  window.addEventListener("scroll", invalidate, { passive: true });

  // Inline custom properties are NOT reset by the CSS reduced-motion block, so
  // if the user flips the preference mid-session, detach and park the puck.
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", (e) => {
      if (!e.matches) return;
      band.removeEventListener("pointermove", onMove);
      band.removeEventListener("pointerleave", reset);
      reset();
    });
}

function init(): void {
  mountProgressRail();
  mountCommandPalette();
  mountReactiveCluster();
  mountHeroBacklight();
}

// ES imports are hoisted, so this module evaluates BEFORE the page entry's
// createRoot(...).render(...). Defer init one frame past a settled DOM so the
// reactive cluster queries React's rendered nodes, not the prerendered ones
// React is about to replace. The rail + palette live outside #root and would
// be safe either way.
function boot(): void {
  requestAnimationFrame(init);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
}

export {};
