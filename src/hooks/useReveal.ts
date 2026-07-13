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
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  ));
}

/** Adds .is-in on viewport entry. Pairs with the `.js .reveal` CSS contract;
 *  shows content immediately if IO is missing or reduced motion is set. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("is-in");
      return;
    }
    observer().observe(el);
    return () => io?.unobserve(el);
  }, []);
  return ref;
}
