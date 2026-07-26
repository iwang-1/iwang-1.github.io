import { contact, person, type Education, type Project, type Role } from "../content";
import { Chip, ProofChip } from "./chips";
import { CopyEmailButton, ExternalLink, LabelButton } from "./LabelButton";
import { Reveal } from "./Reveal";

/** RoleLogo — the employer's real logo in a white chip, so transparent and dark
 *  marks read on the plate. `wide` lets a wordmark span the chip. Every role has
 *  a real vendor mark, so nothing on a recruiting page is ever the wrong
 *  company's logo. */
function RoleLogo({ logo }: { logo: Role["logo"] }) {
  return (
    <span className={`role-logo${logo.pad ? " role-logo-pad" : ""}`}>
      <img
        src={logo.src}
        alt={logo.alt}
        className={logo.wide ? "role-logo-img role-logo-wide" : "role-logo-img"}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

/** RoleCard — one role, plated: logo, title, the date range as an axis-style
 *  mono line, then the bullets. */
export function RoleCard({ role }: { role: Role }) {
  return (
    <article className="card role-card">
      <header className="role-card-head">
        <RoleLogo logo={role.logo} />
        <div>
          <h3>{role.role}</h3>
          <p className="role-org">{role.org}</p>
        </div>
      </header>
      <p className="role-meta">
        {role.dates} · {role.location}
      </p>
      <ul className="role-bullets">
        {role.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {(role.chips || role.tags) && (
        <div className="chip-rail">
          {role.chips?.map((c) => <ProofChip key={c} label={c} />)}
          {role.tags?.map((t) => <Chip key={t} label={t} />)}
        </div>
      )}
      {role.proofLink && (
        <p className="project-links">
          <ExternalLink href={role.proofLink.href} className="cta-text-link">
            {role.proofLink.label}
          </ExternalLink>
        </p>
      )}
    </article>
  );
}

/** EduCard — the Home #education entry. */
export function EduCard({ edu }: { edu: Education }) {
  return (
    <article className="card edu-card">
      <h3>{edu.school}</h3>
      <p className="edu-degree">{edu.degree}</p>
      <p className="role-meta">{edu.dates}</p>
      {edu.detailLines.map((line) => (
        <p key={line} className="edu-detail">
          {line}
        </p>
      ))}
      {edu.proofChip && (
        <div className="chip-rail">
          <ProofChip label={edu.proofChip} />
        </div>
      )}
      {/* One mono line, not nine pills: coursework is metadata, and a wall of
          identical chips was ~1.5 phone screens of low-information pills. */}
      <p className="edu-coursework">Coursework: {edu.coursework.join(", ")}</p>
    </article>
  );
}

/** ProjectCard — one project. Every project links a public repo, so the linked
 *  title is the card's primary affordance and `.card-live` is what carries the
 *  hover promise. */
export function ProjectCard({ project }: { project: Project }) {
  const { repoHref } = project;
  return (
    <article className={repoHref ? "card card-live" : "card"} id={project.id}>
      <h3>{repoHref ? <ExternalLink href={repoHref}>{project.title}</ExternalLink> : project.title}</h3>
      <div className="project-meta">
        {project.license && <span className="role-meta">{project.license}</span>}
      </div>
      {project.description.map((d) => (
        <p key={d} style={{ marginTop: 12, marginBottom: 0 }}>
          {d}
        </p>
      ))}
      {project.chips && (
        <div className="chip-rail">
          {project.chips.map((c) => (
            <Chip key={c} label={c} />
          ))}
        </div>
      )}
    </article>
  );
}

/** Shared recruiter-facing contact band, at the end of every primary page.
 *
 *  One channel, three ways to use it: open a mail client, copy the address, or
 *  read it. Profile links live in the nav and the footer, so this band is a
 *  decision rather than another four-button row. */
export function ContactBand({
  id,
  heading = contact.heading,
  body = contact.body,
}: {
  id?: string;
  heading?: string;
  body?: string;
}) {
  return (
    <section className="contact-band" id={id}>
      <Reveal className="container contact-layout">
        <div className="contact-copy">
          <h2>{heading}</h2>
          <p>{body}</p>
        </div>
        <div className="contact-actions">
          <LabelButton href={`mailto:${person.email}`} variant="primary">
            Email me
          </LabelButton>
          <CopyEmailButton email={person.email} />
          <span className="mono contact-email">{person.email}</span>
        </div>
      </Reveal>
    </section>
  );
}
