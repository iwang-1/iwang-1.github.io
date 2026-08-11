import { footer, person } from "../content";
import { CopyEmailButton, LabelButton } from "./LabelButton";

/** Shared footer: label buttons for the three channels plus the Education anchor, then the colophon. */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <LabelButton href={`mailto:${person.email}`}>Email</LabelButton>
          <CopyEmailButton email={person.email} />
          <LabelButton href={person.github} external>
            GitHub
          </LabelButton>
          <LabelButton href={person.linkedin} external>
            LinkedIn
          </LabelButton>
          <LabelButton href="/#education">Education</LabelButton>
          <span className="mono footer-email">{person.email}</span>
        </div>
        <div className="footer-colophon">
          <p>{footer.colophon}</p>
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
