/** Adds the root `.js` class that gates the scroll-reveal hidden state (`.js .reveal { opacity: 0 }`) and the
 * hero/page-head entrance animations. */
export function enableJs() {
  if (mountFailed) return;
  document.documentElement.classList.add("js");
}

let mountFailed = false;

/** The other half of the same contract, called by the page-root ErrorBoundary
 * (src/components/ErrorBoundary.tsx). */
export function markMountFailed() {
  mountFailed = true;
  document.documentElement.classList.remove("js");
}
