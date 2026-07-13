import type { ReactNode } from "react";
import type { Education, Project, Repo, Role } from "../content";
import { Chip, ProofChip } from "./chips";
import { ExternalLink } from "./Keycap";

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
      <h3>{role.role}</h3>
      <p className="role-org">{role.org}</p>
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

/** RepoRow — Star Catalog sub-entries inside the featured card. */
export function RepoRow({ repo }: { repo: Repo }) {
  return (
    <div className="repo-row">
      <h3>
        <ExternalLink href={repo.href}>{repo.name}</ExternalLink>
      </h3>
      <p>{repo.description}</p>
      <div className="chip-rail">
        {repo.chips.map((c) => (
          <ProofChip key={c} label={c} />
        ))}
      </div>
      {repo.demoHref && (
        <p className="project-links">
          <ExternalLink href={repo.demoHref}>Live demo</ExternalLink>
        </p>
      )}
    </div>
  );
}

/** ProjectCard — non-featured projects. `noRepo` renders a mono
 *  "private / no public repo" tag instead of a link. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card" id={project.id}>
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
        {project.noRepo && <span className="no-repo-tag">private / no public repo</span>}
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

/** CtaBand — end-of-page call-to-action band. */
export function CtaBand({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="container">
      <div className="cta-band">
        <h2>{heading}</h2>
        <div className="cta-row">{children}</div>
      </div>
    </section>
  );
}
