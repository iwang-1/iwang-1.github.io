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
  document.documentElement.classList.add("js");
}
