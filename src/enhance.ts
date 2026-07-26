/** Progressive-enhancement layer. Everything here is injected or bound by the
 *  bundle at runtime; without JS the prerendered static HTML is complete and
 *  fully usable, and nothing that constitutes evidence lives behind a pointer.
 *  With JS the site gains two things:
 *
 *    1. THE SWEEP's crosshair — the figure's readout follows the pointer or the
 *       arrow keys, snapping to real measured samples. The figure already ships
 *       annotated at its knee, so this sharpens an existing state rather than
 *       revealing a hidden one.
 *    2. a keyboard command palette (g-chords + `?` legend overlay) behind a
 *       discoverable legend swatch.
 *
 *  The crosshair is the site's one animated moment and it is user-driven. Under
 *  prefers-reduced-motion it still tracks — the transition just drops to 0ms in
 *  Sweep.css. Imported after js-flag by every page entry; guarded so it runs
 *  once per document. */
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
  { second: "c", label: "Contact Ivan", href: "/#contact" },
];

// ----------------------------------------------------------- command palette
function legendGlyph(): string {
  // A legend swatch: two series keys and a sample point, which is what the
  // overlay it opens actually is — the page's legend. Decorative; the button's
  // aria-label carries the meaning.
  return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8h6M4 16h6"/><circle cx="16.5" cy="8" r="2" fill="currentColor" stroke="none"/><circle cx="16.5" cy="16" r="2"/></svg>`;
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
  overlay.setAttribute("aria-label", "Legend and shortcuts");
  overlay.hidden = true;
  overlay.innerHTML =
    `<div class="kbd-help-backdrop" data-close></div>` +
    `<div class="kbd-help-card">` +
    `<p class="kbd-help-title">Legend &amp; shortcuts</p>` +
    `<ul class="kbd-help-list">${rows}</ul>` +
    `<p class="kbd-help-foot"><kbd>?</kbd> toggles this panel · <kbd>Esc</kbd> closes it</p>` +
    `<button type="button" class="keycap kbd-help-close" data-close>Close</button>` +
    `</div>`;

  const fab = document.createElement("button");
  fab.type = "button";
  fab.id = "kbd-fab";
  fab.className = "kbd-fab";
  fab.setAttribute("aria-haspopup", "dialog");
  fab.setAttribute("aria-label", "Legend and shortcuts");
  fab.innerHTML = legendGlyph();

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
        window.location.assign(match.href);
      }
      return;
    }

    if (e.key.toLowerCase() === "g") {
      pendingG = true;
      gTimer = window.setTimeout(resetChord, 1200);
    }
  });
}

// ------------------------------------------------------- the Sweep crosshair
/** Binds the figure's crosshair. The figure (src/components/Sweep.tsx) already
 *  renders every sample, every label and the amber knee callout, and the
 *  crosshair already sits on the knee via the CSS fallbacks — so this adds
 *  inspection, never evidence.
 *
 *  Mechanism, deliberately small: each `.sweep-sample` group carries its own
 *  plot coordinate and its own readout string as data attributes, so the only
 *  arithmetic here is "which sample is nearest". A pointermove (passive,
 *  coalesced into one rAF) or an arrow key sets two custom properties on the
 *  <figure>, swaps one textContent, and mirrors the same string into a polite
 *  live region. No canvas, no loop, no library, and the single
 *  getBoundingClientRect is the pointer-to-user-unit conversion — there is no
 *  other layout read. */
function mountSweep(): void {
  const figure = document.querySelector<HTMLElement>("figure.sweep");
  if (!figure) return;
  const svg = figure.querySelector<SVGSVGElement>("svg.sweep-plot");
  const readout = figure.querySelector<HTMLElement>(".sweep-readout-value");
  const live = figure.querySelector<HTMLElement>(".sweep-live");
  if (!svg || !readout) return;

  const samples = Array.from(figure.querySelectorAll<SVGGElement>(".sweep-sample"))
    .map((node) => ({
      x: Number(node.dataset.sweepX),
      y: Number(node.dataset.sweepY),
      readout: node.dataset.sweepReadout ?? "",
    }))
    .filter((s) => Number.isFinite(s.x) && Number.isFinite(s.y) && s.readout)
    // Left-to-right, so ArrowRight means "faster" and Home/End are the ends of
    // the throughput axis rather than of the markup.
    .sort((a, b) => a.x - b.x);
  if (samples.length === 0) return;

  // The knee is the server-rendered default, so start the keyboard cursor there
  // instead of at index 0 — the first Arrow press should step off what the
  // reader is already looking at.
  const knee = figure.querySelector<SVGGElement>(".sweep-sample-knee");
  let index = Math.max(
    0,
    samples.findIndex((s) => s.readout === knee?.dataset.sweepReadout),
  );

  const select = (next: number, announce: boolean): void => {
    index = Math.min(samples.length - 1, Math.max(0, next));
    const sample = samples[index];
    figure.style.setProperty("--sweep-x", String(sample.x));
    figure.style.setProperty("--sweep-y", String(sample.y));
    if (readout.textContent !== sample.readout) readout.textContent = sample.readout;
    // Pointer users get the visual readout; only deliberate (keyboard) moves are
    // announced, so dragging across ten samples is not ten interruptions.
    if (announce && live) live.textContent = sample.readout;
  };

  // Pointer → nearest sample on the throughput axis. Comparing x alone is the
  // right model here: the reader is scrubbing a curve, not hunting a scatter.
  const nearest = (clientX: number): number => {
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return index;
    const view = svg.viewBox.baseVal;
    const userX = ((clientX - rect.left) / rect.width) * view.width;
    let best = 0;
    let bestDistance = Infinity;
    for (let i = 0; i < samples.length; i++) {
      const distance = Math.abs(samples[i].x - userX);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    return best;
  };

  let queued = false;
  let pointerX = 0;
  const apply = () => {
    queued = false;
    select(nearest(pointerX), false);
  };

  figure.addEventListener(
    "pointermove",
    (event: PointerEvent) => {
      pointerX = event.clientX;
      if (queued) return;
      queued = true;
      requestAnimationFrame(apply);
    },
    { passive: true },
  );

  figure.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    let next = index;
    if (event.key === "ArrowRight") next = index + 1;
    else if (event.key === "ArrowLeft") next = index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = samples.length - 1;
    else return;
    event.preventDefault();
    select(next, true);
  });
}

// ------------------------------------------------------- hash / contact nav
// The nav "Contact" link is /#contact. On the Home page that target exists, so
// a same-document click should smooth-scroll to it. From another page the link
// navigates to "/" and the fragment must scroll AFTER React has rendered the
// real #root (the prerendered nodes are replaced, and lazy images/reveals
// shift layout), which the browser's own on-load scroll misses. This wires
// both: intercept same-doc fragment links, and re-run the fragment scroll once
// the page has settled.
function scrollToHash(hash: string, smooth: boolean): boolean {
  if (!hash || hash === "#") return false;
  let target: HTMLElement | null = null;
  try {
    target = document.querySelector<HTMLElement>(hash);
  } catch {
    return false; // malformed selector
  }
  if (!target) return false;
  target.scrollIntoView({
    behavior: smooth && !prefersReduced() ? "smooth" : "auto",
    block: "start",
  });
  // move focus for keyboard/screen-reader users without a visible outline jump
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  return true;
}

function mountHashNav(): void {
  const samePage = (path: string): boolean => {
    // "/#contact" targets Home; "#contact" (or "") targets the current page.
    if (path === "" || path === "/") return true;
    return path === window.location.pathname;
  };

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    const hashIdx = href.indexOf("#");
    if (hashIdx < 0) return; // no fragment
    const path = href.slice(0, hashIdx);
    const hash = href.slice(hashIdx);
    if (!samePage(path)) return; // let the browser navigate to the other page

    if (scrollToHash(hash, true)) {
      e.preventDefault();
      if (window.location.hash !== hash) history.pushState(null, "", hash);
    }
  });

  // On first load with a fragment (e.g. arrived at /#contact from another
  // page), retry the scroll a few times as React renders and images settle.
  if (window.location.hash) {
    const hash = window.location.hash;
    let tries = 0;
    const retry = () => {
      if (scrollToHash(hash, false) || tries++ > 20) return;
      window.setTimeout(retry, 80);
    };
    window.setTimeout(retry, 80);
  }
}

function init(): void {
  mountCommandPalette();
  mountSweep();
  mountHashNav();
}

// ES imports are hoisted, so this module evaluates BEFORE the page entry's
// createRoot(...).render(...). Defer init one frame past a settled DOM so the
// crosshair binds React's rendered figure, not the prerendered nodes React is
// about to replace.
function boot(): void {
  requestAnimationFrame(init);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
}

export {};
