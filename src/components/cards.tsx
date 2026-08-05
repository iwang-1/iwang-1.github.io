import { contact, person, type Education, type Project, type Role } from "../content";
import { Chip, ProofChip } from "./chips";
import { CopyEmailButton, ExternalLink, LabelButton } from "./LabelButton";
import { Reveal } from "./Reveal";

/** RoleLogo — the employer's real logo in a white chip, so transparent and dark
 *  marks read on the plate. `wide` lets a wordmark span the chip. Every role has
 *  a real vendor mark, so nothing on a recruiting page is ever the wrong
 *  company's logo.
 *
 *  `width`/`height` carry the asset's real intrinsic size from content.ts (read
 *  out of each file's own header). The chip is a fixed 48px box and the image is
 *  `100%`/`100%` inside it, so this moves nothing — it declares the aspect ratio
 *  before the bytes land, which is the guard the drawn box currently doesn't need
 *  and the `-wide` variant (`height: auto`) does.
 *
 *  ALL SEVEN KEEP `loading="lazy"`, AND THE FIRST TWO ARE NOT AN EXCEPTION —
 *  measured, after trying it the other way. The reasoning for dropping it on the
 *  above-fold pair is sound on fetch COUNT: React replaces the prerendered nodes
 *  mid-load, so the browser re-creates every logo while the document is still
 *  loading and fetches all seven in one wave regardless (all seven requests within
 *  3ms of each other at 1440, 65ms at 390), which makes the attribute inert there,
 *  and `lazy` on an in-viewport image is the one case it is specified not to be
 *  used for.
 *
 *  What that argument misses is fetch TIMING. Dropping it moved 16.8KB (aws.png +
 *  umd.png) out of the post-paint wave into the FIRST one, where on a
 *  bandwidth-constrained link it shares the pipe with the render-blocking
 *  stylesheet that gates first paint. Measured on /experience/ at 400Kbps / 400ms
 *  RTT / 6x CPU: the pair started at +524ms instead of +2370ms, `Nav-*.css`
 *  responseEnd slipped 2280 -> 2661ms, and FCP and LCP slipped with it, 2384 ->
 *  2764ms — +380ms across seven runs with a 12ms spread, so not noise. The 381ms
 *  measured matches the 328ms that 16.8KB costs at 51.2KB/s, which is why
 *  `fetchpriority="low"` was tried and did NOT recover it (CSS still 2661ms): the
 *  contention is bandwidth, not request ordering, and a low-priority request
 *  already in flight still spends the bytes.
 *
 *  So the trade is +380ms to first paint on a slow link against zero benefit: these
 *  are 46px vendor marks in a 48px chip, the LCP element on this page is a text
 *  `<li>`, and CLS is 0 either way because the box is fixed by CSS and now also
 *  declared by the attributes below. Nothing above the fold waits on them, so they
 *  go last, all seven, with no per-position knob — an `eager` flag plumbed through
 *  here and RoleCard for a case that measured worse is a switch whose only setting
 *  is wrong. If these are ever inlined or subset, or this tree stops being replaced
 *  mid-load, the number to re-measure is `Nav-*.css` responseEnd on /experience/ at
 *  400Kbps; that is what moved. */
function RoleLogo({ logo }: { logo: Role["logo"] }) {
  return (
    <span className={`role-logo${logo.pad ? " role-logo-pad" : ""}`}>
      <img
        src={logo.src}
        alt={logo.alt}
        className={logo.wide ? "role-logo-img role-logo-wide" : "role-logo-img"}
        width={logo.w}
        height={logo.h}
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
    <article className="sheet-block role-card">
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
    <article className="sheet-block edu-card">
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
 *  title is the block's primary affordance and `.sheet-live` is what carries the
 *  hover promise. */
export function ProjectCard({ project }: { project: Project }) {
  const { repoHref } = project;
  return (
    <article className={repoHref ? "sheet-block sheet-live" : "sheet-block"} id={project.id}>
      <h3>{repoHref ? <ExternalLink href={repoHref}>{project.title}</ExternalLink> : project.title}</h3>
      <div className="project-meta">
        {/* NOT `.role-meta`: that class is the institution/date provenance slot
            ("University of Maryland", "{dates} · {location}"), so a bare "MIT"
            one line under a project title read as Massachusetts Institute of
            Technology to two of six cold reviewers — one of them three times
            before getting suspicious. The word "License" is the whole fix. */}
        {project.license && (
          <span className="project-license">{project.license} License</span>
        )}
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
