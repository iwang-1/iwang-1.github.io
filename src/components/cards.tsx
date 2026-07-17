import { contact, person, type Education, type Project, type Role } from "../content";
import { Chip, ProofChip } from "./chips";
import { ExternalLink, Keycap } from "./Keycap";
import { Reveal } from "./Reveal";

/** RoleLogo — the employer's real logo in a white chip (so transparent and
 *  dark marks read in both themes), or a colored lettermark tile for the
 *  small orgs with no public logo. `wide` lets a wordmark span the chip. */
function RoleLogo({ logo }: { logo: Role["logo"] }) {
  if (logo.kind === "mark") {
    return (
      <span
        className="role-logo role-logo-mark"
        style={{ background: logo.color }}
        role="img"
        aria-label={logo.alt}
      >
        {logo.initials}
      </span>
    );
  }
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

/** RoleCard — surfaced timeline card (Experience alternating timeline);
 *  `tagTone="teal"` renders flat teal tags instead of ProofChips. */
export function RoleCard({
  role,
  tagTone = "default",
}: {
  role: Role;
  tagTone?: "default" | "teal";
}) {
  return (
    <article className={"card role-card"}>
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
          {role.tags?.map((t) => <Chip key={t} label={t} tone={tagTone} />)}
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

/** EduCard — Home #education entries. Coursework chips are teal. */
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
      <div className="chip-rail">
        {edu.coursework.map((c) => (
          <Chip key={c} label={c} tone="teal" />
        ))}
      </div>
    </article>
  );
}

/** ProjectCard — project cards. `noRepo` renders a mono
 *  "no public repo" tag instead of a link. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`card ${project.repoHref ? "card-live" : "card-static"}`} id={project.id}>
      <h3>
        {project.repoHref ? (
          <ExternalLink href={project.repoHref}>{project.title}</ExternalLink>
        ) : (
          project.title
        )}
      </h3>
      <div className="project-meta">
        {project.date && <span className="role-meta">{project.date}</span>}
        {project.license && <span className="role-meta">{project.license}</span>}
        {project.noRepo && <span className="no-repo-tag">no public repo</span>}
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

/** Shared recruiter-facing contact band used at the end of every primary page. */
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
          <p className="kicker">{contact.kicker}</p>
          <h2>{heading}</h2>
          <p>{body}</p>
        </div>
        <div className="contact-actions">
          <Keycap href={`mailto:${person.email}`} variant="primary">
            Email me
          </Keycap>
          <Keycap href={person.linkedin} external>
            LinkedIn
          </Keycap>
          <Keycap href={person.github} external>
            GitHub
          </Keycap>
          <span className="mono contact-email">{person.email}</span>
        </div>
      </Reveal>
    </section>
  );
}
