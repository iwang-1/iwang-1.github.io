/** Adds the root `.js` class that gates the scroll-reveal hidden state
 *  (`.js .reveal { opacity: 0 }`) and the hero/page-head entrance animations.
 *
 *  This deliberately lives in the app bundle — NOT in an inline <head>
 *  script — so the reveal-hiding contract only activates when the bundle
 *  actually executed. If the bundle is blocked or fails, the prerendered
 *  static HTML (scripts/prerender.mjs) stays fully visible.
 *
 *  It is a FUNCTION, not a top-level side effect, and every page entry calls it
 *  immediately AFTER `createRoot(...).render(...)`. As a side effect on import
 *  it was a receipt for a STARTED module, not a completed mount: anything that
 *  threw between this import and render left the class on with the static DOM
 *  still in place, so the reveal-hiding rule blanked content that was perfectly
 *  intact. Measured with `window.matchMedia` deleted: `#root` rendered 0
 *  children and 0 visible characters on `/` and `/projects/` while
 *  `documentElement.classList.contains('js')` was still true. Called after
 *  render, a throw anywhere in the mount path leaves the prerendered HTML fully
 *  visible with no fade — exactly the shipped no-JS look.
 *
 *  React's first paint is synchronous inside `render()` for this tree, so the
 *  class still lands before any .reveal element can be seen unfaded. */
export function enableJs() {
  if (mountFailed) return;
  document.documentElement.classList.add("js");
}

let mountFailed = false;

/** The other half of the same contract, called by the page-root ErrorBoundary
 *  (src/components/ErrorBoundary.tsx).
 *
 *  Calling `enableJs()` after render made a THROWN mount safe, because render()
 *  never returned. A CAUGHT one is the case that reintroduces the hazard: the
 *  boundary handles the error, `render()` returns normally, and `enableJs()` would
 *  then switch on `.js .reveal { opacity: 0 }` over restored static markup that has
 *  no useReveal hook left to add `.is-in` — a fully intact page, hidden, which is
 *  the exact defect the after-render ordering was introduced to remove.
 *
 *  So the flag is checked on the way in, and the class is removed on the way out:
 *  an error thrown LATER (an event handler, a subsequent update) hits a document
 *  that already carries `.js`, and it is removed in the same synchronous commit as
 *  the fallback, so no frame ever paints the hidden state. Either way the document
 *  ends up in the no-JS configuration, which is the one the prerendered markup was
 *  built to be read in. */
export function markMountFailed() {
  mountFailed = true;
  document.documentElement.classList.remove("js");
}
