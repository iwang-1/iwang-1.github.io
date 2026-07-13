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
          <a className="nav-brand" href="/">
            <Monogram />
            <span className="nav-wordmark">Ivan Wang</span>
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
            <Keycap
              href={person.resumeUrl}
              variant="primary"
              external
              ariaLabel="Résumé (PDF)"
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
