import { contact, flags, person } from "../content";

export default function Footer() {
  return (
    <footer id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">{contact.heading}</h2>
      <p className="contact-cta">{contact.cta}</p>
      <p className="link-row">
        <a href={person.github}>GitHub</a>
        <a href={person.linkedin}>LinkedIn</a>
        {person.email && <a href={`mailto:${person.email}`}>{person.email}</a>}
        {person.resumeUrl && <a href={person.resumeUrl}>Résumé</a>}
      </p>
      <p className="colophon">
        {contact.colophon}
        {flags.repoLinksEnabled && (
          <>
            {" "}
            <a href={contact.siteSourceUrl}>View this site&apos;s source</a>.
          </>
        )}
      </p>
    </footer>
  );
}
