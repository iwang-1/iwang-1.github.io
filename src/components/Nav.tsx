import { useEffect, useRef } from "react";

export type ActiveTab = "home" | "experience" | "projects" | null;

const TABS: { key: Exclude<ActiveTab, null> | "contact"; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "experience", label: "Experience", href: "/experience/" },
  { key: "projects", label: "Projects", href: "/projects/" },
  { key: "contact", label: "Contact", href: "/#contact" },
];

/** FigureMark — the site's mark, and the same drawing as the favicon: a plate
 *  with drawn axes, a rising three-point sample line in --series-1, and one
 *  amber annotation dot on the middle sample. It is the whole thesis at 32px.
 *
 *  Paths are literal `d` attributes and the dot is a real sample point, so the
 *  mark is one object in the grammar rather than a lettermark that happens to sit
 *  in the corner. */
function FigureMark() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="2"
        fill="var(--plate)"
        stroke="var(--grid)"
        strokeWidth="1"
      />
      {/* axes */}
      <path d="M 6 5 L 6 26 L 27 26" fill="none" stroke="var(--axis)" strokeWidth="1.5" />
      {/* the sample line */}
      <path
        d="M 8 22 L 15 15.5 L 25 9"
        fill="none"
        stroke="var(--series-1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* the annotation */}
      <circle cx="15" cy="15.5" r="3" fill="var(--series-2)" />
    </svg>
  );
}

/** Shared sticky nav; the active tab is set at build time via props — no
 *  route sniffing, no JS behavior at all (plain <a href> everywhere). */
export function Nav({ active }: { active: ActiveTab }) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = progressRef.current;
    if (!rail) return;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      rail.style.setProperty("--scroll-progress", String(progress));
      rail.style.setProperty("--scroll-position", `${progress * 100}%`);
    };
    const schedulePaint = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedulePaint, { passive: true });
    window.addEventListener("resize", schedulePaint, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedulePaint);
      window.removeEventListener("resize", schedulePaint);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="nav">
        <div className="container nav-inner">
          {/* aria-label keeps the accessible name breakpoint-independent: the
              wordmark span is display:none under 640px and the SVG is
              aria-hidden, so without it the link's name computes as EMPTY on
              mobile (WCAG 4.1.2). */}
          <a className="nav-brand" href="/" aria-label="Ivan Wang — home">
            <FigureMark />
            <span className="nav-wordmark" aria-hidden="true">
              Ivan Wang
            </span>
          </a>
          <nav aria-label="Primary" className="nav-tabs">
            {TABS.map((tab) => (
              <a
                key={tab.label}
                href={tab.href}
                className={active === tab.key ? "btn btn-current" : "btn"}
                {...(active === tab.key ? { "aria-current": "page" as const } : {})}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
        <div
          ref={progressRef}
          id="progress-rail"
          className="route-progress"
          aria-hidden="true"
        >
          <span className="route-progress-fill" />
          <span className="route-progress-marker" />
        </div>
      </header>
    </>
  );
}
