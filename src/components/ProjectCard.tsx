import { flags } from "../content";
import type { Project } from "../content";
import MetricChip from "./MetricChip";

export default function ProjectCard({ project }: { project: Project }) {
  const linked = flags.repoLinksEnabled;
  return (
    <article className="project-card" id={`card-${project.name}`}>
      <h3 className="mono">
        {linked ? <a href={project.repoUrl}>{project.name}</a> : project.name}
      </h3>
      <p className="card-one-liner">{project.oneLiner}</p>
      {project.details.map((d) => (
        <p key={d} className="card-detail">
          {d}
        </p>
      ))}
      <p className="chip-row">
        {/* Chips are plain text even when linking is enabled: the h3 above is
            the card's single repo link (one tab stop per card, clear purpose). */}
        {project.chips.map((c) => (
          <MetricChip key={c.label} label={c.label} />
        ))}
      </p>
    </article>
  );
}
