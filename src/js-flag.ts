/** Adds the root `.js` class that gates the scroll-reveal hidden state
 *  (`.js .reveal { opacity: 0 }`) and the hero/page-head entrance animations.
 *
 *  This deliberately lives in the app bundle — NOT in an inline <head>
 *  script — so the reveal-hiding contract only activates when the bundle
 *  actually executed. If the bundle is blocked or fails, the prerendered
 *  static HTML (scripts/prerender.mjs) stays fully visible.
 *
 *  Imported FIRST by every page entry, so it runs before React renders any
 *  .reveal element (no visible→hidden flash within the bundle itself). */
document.documentElement.classList.add("js");

export {};
