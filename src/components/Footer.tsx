import { footer, person } from "../content";
import { Keycap } from "./Keycap";

/** Shared footer: contact keycaps + Education anchor, then the colophon.
 *  No phone number, ever. */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <Keycap href={`mailto:${person.email}`}>Email</Keycap>
          <Keycap href={person.github} external>
            GitHub
          </Keycap>
          <Keycap href={person.linkedin} external>
            LinkedIn
          </Keycap>
          <Keycap href={person.resumeUrl} external>
            Résumé (PDF)
          </Keycap>
          <a href="/#education">Education</a>
          <span className="mono" style={{ fontSize: "0.875rem", color: "var(--ink-2)" }}>
            {person.email}
          </span>
        </div>
        <div className="footer-colophon">
          <p>{footer.colophon}</p>
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
