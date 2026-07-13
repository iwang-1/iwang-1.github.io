import { person, starFieldCaption } from "../content";
import StarField from "./StarField";

// Inline SVG paths — no icon library.
const GITHUB_PATH =
  "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.14c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z";
const LINKEDIN_PATH =
  "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z";
const MAIL_PATH =
  "M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm10 8.6L3.5 6.1v11.8h17V6.1L12 12.6zM4.3 6l7.7 5.8L19.7 6H4.3z";

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d={path} />
    </svg>
  );
}

export default function Masthead() {
  return (
    <header className="masthead">
      <StarField />
      <div className="masthead-scrim" aria-hidden="true" />
      <div className="masthead-content">
        <h1>{person.name}</h1>
        <p className="subhead">{person.subhead}</p>
        <p className="identity-line mono">{person.identityLine}</p>
        <nav className="link-row" aria-label="Profiles">
          <a href={person.github}>
            <Icon path={GITHUB_PATH} /> GitHub
          </a>
          <a href={person.linkedin}>
            <Icon path={LINKEDIN_PATH} /> LinkedIn
          </a>
          {person.email && (
            <a href={`mailto:${person.email}`}>
              <Icon path={MAIL_PATH} /> {person.email}
            </a>
          )}
          {person.resumeUrl && <a href={person.resumeUrl}>Résumé</a>}
        </nav>
      </div>
      <p className="starfield-caption mono">{starFieldCaption}</p>
    </header>
  );
}
