/** Progressive-enhancement layer. */
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
  // A legend swatch: two series keys and a sample point, which is what the overlay it opens actually is.
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
  // Aria-labelledby, not aria-label: the dialog's name is the heading it already renders, so the two can
  // never drift, and the panel now has a real heading in the document outline instead of a <p> styled to look like one.
  overlay.setAttribute("aria-labelledby", "kbd-help-title");
  overlay.hidden = true;
  overlay.innerHTML =
    `<div class="kbd-help-backdrop" data-close></div>` +
    `<div class="kbd-help-card">` +
    `<h2 class="kbd-help-title" id="kbd-help-title">Legend &amp; shortcuts</h2>` +
    `<ul class="kbd-help-list">${rows}</ul>` +
    `<p class="kbd-help-foot"><kbd>?</kbd> toggles this panel · <kbd>Esc</kbd> closes it</p>` +
    `<button type="button" class="btn kbd-help-close" data-close>Close</button>` +
    `</div>`;

  const fab = document.createElement("button");
  fab.type = "button";
  fab.id = "kbd-fab";
  fab.className = "kbd-fab";
  fab.setAttribute("aria-haspopup", "dialog");
  fab.setAttribute("aria-label", "Legend and shortcuts");
  // A native tooltip, because an unlabelled glyph floating over every page is the same defect as an
  // uncaptioned chart: readers guessed "settings", "filter", "download" and clicked hoping for a resume.
  fab.title = "Legend & shortcuts";
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
      // Restore focus per the wai-aria dialog pattern: back to where the user was, falling back to the
      // launcher when the palette was opened with no meaningful focus (activeElement === body) or the element is gone.
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

  /** True while the hobby key tester is armed. */
  const armedKeyTester = (): boolean => {
    /* `.kb`, not `.keyboard-fig`. */
    const fig = document.querySelector<HTMLElement>(".kb");
    if (!fig) return false;
    return fig.matches(":hover") || fig.contains(document.activeElement);
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

    // The key-tester truce. The hobby figure invites "type while hovering" and draws the home row — which
    // contains both halves of the g→h "Go to Home" chord.
    if (armedKeyTester()) {
      resetChord();
      return;
    }

    // `?` lives below the truce, and that placement is the fix for a real defect: it used to be handled
    // above it, so the truce covered only the g-chords the comment describes.
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
/** Binds the figure's crosshair. */
interface SweepView {
  figure: HTMLElement;
  svg: SVGSVGElement;
  readout: HTMLElement;
  live: HTMLElement | null;
  samples: { x: number; y: number; readout: string }[];
  index: number;
}

function readSweep(figure: HTMLElement): SweepView | null {
  const svg = figure.querySelector<SVGSVGElement>("svg.sweep-plot");
  const readout = figure.querySelector<HTMLElement>(".sweep-readout-value");
  if (!svg || !readout) return null;

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
  if (samples.length === 0) return null;

  // The knee is the server-rendered default, so start the keyboard cursor there instead of at index 0.
  const knee = figure.querySelector<SVGGElement>(".sweep-sample-knee");
  const index = Math.max(
    0,
    samples.findIndex((s) => s.readout === knee?.dataset.sweepReadout),
  );

  return {
    figure,
    svg,
    readout,
    live: figure.querySelector<HTMLElement>(".sweep-live"),
    samples,
    index,
  };
}

function mountSweep(): void {
  let view: SweepView | null = null;

  // Resolve from the event's own target, so a re-rendered figure is picked up
  // the first time a reader touches it — no MutationObserver, no retry timer.
  const resolve = (target: EventTarget | null): SweepView | null => {
    const figure = (target as Element | null)?.closest?.<HTMLElement>("figure.sweep") ?? null;
    if (!figure) return null;
    if (!view || view.figure !== figure || !view.figure.isConnected)
      view = readSweep(figure);
    return view;
  };

  /** Pan the pannable window so the selected sample is actually on screen. */
  const revealSample = (v: SweepView, x: number): void => {
    const scroller = v.svg.parentElement;
    if (!scroller) return;
    if (scroller.scrollWidth - scroller.clientWidth <= 1) return; // nothing pans
    const rect = v.svg.getBoundingClientRect();
    const box = v.svg.viewBox.baseVal;
    if (!rect.width || !box.width) return;
    const dotX = rect.left + (x / box.width) * rect.width;
    const windowRect = scroller.getBoundingClientRect();
    scroller.scrollLeft += dotX - (windowRect.left + windowRect.width / 2);
  };

  const select = (v: SweepView, next: number, announce: boolean): void => {
    v.index = Math.min(v.samples.length - 1, Math.max(0, next));
    const sample = v.samples[v.index];
    v.figure.style.setProperty("--sweep-x", String(sample.x));
    v.figure.style.setProperty("--sweep-y", String(sample.y));
    if (v.readout.textContent !== sample.readout) v.readout.textContent = sample.readout;
    // Pointer users get the visual readout; only deliberate (keyboard) moves are
    // announced, so dragging across ten samples is not ten interruptions.
    if (announce && v.live) {
      v.live.textContent = sample.readout;
      revealSample(v, sample.x);
    }
  };

  // Pointer → nearest sample on the throughput axis. Comparing x alone is the
  // right model here: the reader is scrubbing a curve, not hunting a scatter.
  const nearest = (v: SweepView, clientX: number): number => {
    const rect = v.svg.getBoundingClientRect();
    if (rect.width === 0) return v.index;
    const box = v.svg.viewBox.baseVal;
    const userX = ((clientX - rect.left) / rect.width) * box.width;
    let best = 0;
    let bestDistance = Infinity;
    for (let i = 0; i < v.samples.length; i++) {
      const distance = Math.abs(v.samples[i].x - userX);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    return best;
  };

  let queued = false;
  let pointerX = 0;
  let pointerView: SweepView | null = null;
  const apply = () => {
    queued = false;
    if (pointerView && pointerView.figure.isConnected)
      select(pointerView, nearest(pointerView, pointerX), false);
  };

  /** One entry point for every pointing gesture. `apply()` is idempotent and rAF-coalesced, so a hybrid device
   * firing both a pointer and a touch event for the same frame costs one redundant select at worst. */
  const track = (target: EventTarget | null, clientX: number): void => {
    /* The stepper buttons are inside the figure, and pointer tracking must ignore them. */
    if ((target as Element | null)?.closest?.("[data-sweep-step]")) return;
    const v = resolve(target);
    if (!v) return;
    pointerView = v;
    pointerX = clientX;
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  };

  document.addEventListener(
    "pointermove",
    (event: PointerEvent) => track(event.target, event.clientX),
    { passive: true },
  );

  // Touch. pointermove alone made the figure lie on a phone: the pannable .sweep-scroll claims the gesture,
  // so the browser fires exactly one pointermove and then pointercancel, while the following ~14 touchmoves.
  document.addEventListener(
    "touchmove",
    (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) track(event.target, touch.clientX);
    },
    { passive: true },
  );

  // A tap is the first thing anyone tries on a curve, and it did nothing: the touch sequence is
  // pointerdown/touchstart/pointerup/touchend with no pointermove at all, so the readout never moved anywhere on the plot.
  document.addEventListener(
    "pointerdown",
    (event: PointerEvent) => track(event.target, event.clientX),
    { passive: true },
  );

  /* The stepper buttons. Same `select()` path as the arrow keys — including `announce: true`, which is what
     pans the window so the chosen dot is visible. */
  document.addEventListener("click", (event: MouseEvent) => {
    const btn = (event.target as Element | null)?.closest?.<HTMLElement>("[data-sweep-step]");
    if (!btn) return;
    const v = resolve(btn);
    if (!v) return;
    const delta = Number(btn.dataset.sweepStep) || 0;
    select(v, v.index + delta, true);
  });

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const v = resolve(event.target);
    if (!v) return;
    /* The figure owns these keys; its descendants DO not. */
    if (event.target !== v.figure) return;
    let next = v.index;
    if (event.key === "ArrowRight") next = v.index + 1;
    else if (event.key === "ArrowLeft") next = v.index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = v.samples.length - 1;
    else return;
    event.preventDefault();
    select(v, next, true);
  });
}

// Hash / contact nav The nav "Contact" link is /#contact. On the Home page that target exists, so a
// same-document click should smooth-scroll to it.
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

// ES imports are hoisted, so this module evaluates before the page entry's createRoot(...).render(...).
function boot(): void {
  requestAnimationFrame(init);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
}

export {};
