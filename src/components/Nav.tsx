import { useEffect, useRef } from "react";

export type ActiveTab = "home" | "experience" | "projects" | null;

const TABS: { key: Exclude<ActiveTab, null> | "contact"; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "experience", label: "Experience", href: "/experience/" },
  { key: "projects", label: "Projects", href: "/projects/" },
  { key: "contact", label: "Contact", href: "/#contact" },
];

/** IW monogram — a single inline-SVG keycap with a serif "IW". */
function Monogram() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1" y="3" width="34" height="32" rx="7" fill="var(--shadow-edge)" />
      <rect
        x="1"
        y="1"
        width="34"
        height="32"
        rx="7"
        fill="var(--surface)"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <text
        x="18"
        y="23"
        textAnchor="middle"
        fontFamily="'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif"
        fontSize="14"
        fontWeight="700"
        fill="var(--ink)"
      >
        IW
      </text>
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
            <Monogram />
            <span className="nav-wordmark" aria-hidden="true">
              Ivan Wang
            </span>
          </a>
          <nav aria-label="Primary" className="nav-tabs">
            {TABS.map((tab) => (
              <a
                key={tab.label}
                href={tab.href}
                className={active === tab.key ? "keycap keycap-pressed" : "keycap"}
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
          <span className="route-progress-hold route-progress-hold-1" />
          <span className="route-progress-hold route-progress-hold-2" />
          <span className="route-progress-hold route-progress-hold-3" />
          <span className="route-progress-hold route-progress-hold-4" />
          <span className="route-progress-marker" />
        </div>
      </header>
    </>
  );
}
