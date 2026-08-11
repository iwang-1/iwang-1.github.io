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
    // Two thresholds, and the 0 is load-bearing.
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
    // Every branch here fails open.
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
