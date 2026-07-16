import {
  CalendarDays,
  GraduationCap,
  Telescope,
  Users,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { contact, person, type Education, type Project, type Role } from "../content";
import { AwsIcon, QiskitIcon, SeleniumIcon } from "./BrandIcons";
import { Chip, ProofChip } from "./chips";
import { ExternalLink, Keycap } from "./Keycap";
import { Reveal } from "./Reveal";

// Real vendor marks (aws/qiskit/selenium) inline as brand SVGs; the remaining
// roles keep a themed lucide glyph. All render as inline <svg>, so verify.mjs's
// role-icon gate counts them the same.
const ROLE_ICONS: Record<Role["icon"], ComponentType<SVGProps<SVGSVGElement>>> = {
  aws: AwsIcon,
  telescope: (props) => <Telescope size={21} strokeWidth={1.8} {...props} />,
  qiskit: QiskitIcon,
  selenium: SeleniumIcon,
  community: (props) => <Users size={21} strokeWidth={1.8} {...props} />,
  events: (props) => <CalendarDays size={21} strokeWidth={1.8} {...props} />,
  teaching: (props) => <GraduationCap size={21} strokeWidth={1.8} {...props} />,
};

/** RoleCard — surfaced timeline card (Experience alternating timeline);
 *  `tagTone="teal"` renders flat teal tags instead of ProofChips. */
export function RoleCard({
  role,
  tagTone = "default",
}: {
  role: Role;
  tagTone?: "default" | "teal";
}) {
  const Icon = ROLE_ICONS[role.icon];

  return (
    <article className={"card role-card"}>
      <header className="role-card-head">
        <span className={`role-icon role-icon-${tagTone}`} aria-hidden="true">
          <Icon />
        </span>
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
