import { person } from "../content";
import { Keycap } from "./Keycap";

export type ActiveTab = "home" | "experience" | "projects" | null;

const TABS: { key: ActiveTab; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "experience", label: "Experience", href: "/experience/" },
  { key: "projects", label: "Projects", href: "/projects/" },
];

/** IW monogram — a single inline-SVG keycap with a serif "IW". */
function Monogram() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      role="img"
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
            {/* WCAG 2.5.3 Label in Name: the accessible name must contain the
                visible label at every breakpoint — "CV" below 640px, "Résumé"
                above — so both live in the aria-label. Do NOT drop it: with
                the spans hidden the name would compute as empty on mobile. */}
            <Keycap
              href={person.resumeUrl}
              variant="primary"
              external
              ariaLabel="CV — Résumé (PDF)"
            >
              <span className="nav-resume-full">Résumé</span>
              <span className="nav-resume-compact" aria-hidden="true">
                CV
              </span>
            </Keycap>
          </nav>
        </div>
      </header>
    </>
  );
}
