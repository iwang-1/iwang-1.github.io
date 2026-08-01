import { useEffect, useRef } from "react";

let io: IntersectionObserver | null = null;
function observer() {
  return (io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io!.unobserve(e.target); // one-shot: never re-hide
        }
      }
    },
    // TWO thresholds, and the 0 is load-bearing. With 0.15 alone and a root
    // shrunk to 90% of the viewport, a block taller than ~6.7x the 15% slice
    // can sit FULLY on screen at a ratio below 0.15 — the one-shot handler
    // never fires and `.js .reveal { opacity: 0 }` never lifts. Measured dead:
    // /projects/ at 390x844 scrolled straight to y=2000 (FIG. 04 lodestone,
    // 1041px tall) and /experience/ at y=800 (869px timeline item), both still
    // opacity 0 after 3s stationary. The 0 entry guarantees a callback the
    // instant any pixel crosses the root; 0.15 stays so a slow scroll still
    // notifies where the fade was authored to start.
    { threshold: [0, 0.15], rootMargin: "0px 0px -10% 0px" },
  ));
}

/** Adds .is-in on viewport entry. Pairs with the `.js .reveal` CSS contract;
 *  shows content immediately if IO is missing or reduced motion is set. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Every branch here fails OPEN. The `.js` root class has already switched
    // on `.js .reveal { opacity: 0 }`, so a throw in this effect would leave
    // intact prerendered content permanently invisible — the one failure that
    // reads as a deliberately empty page rather than a broken one.
    try {
      if (
        typeof window.IntersectionObserver !== "function" ||
        typeof window.matchMedia !== "function" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        el.classList.add("is-in");
        return;
      }
      observer().observe(el);
      return () => io?.unobserve(el);
    } catch {
      el.classList.add("is-in"); // degrade to the no-JS contract: all visible
      return;
    }
  }, []);
  return ref;
}
