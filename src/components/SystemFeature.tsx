import type { FeaturedSystem } from "../content";
import { Chip } from "./chips";
import { ExternalLink } from "./Keycap";

function SystemDiagram({ kind }: { kind: FeaturedSystem["diagram"] }) {
  if (kind === "raft") {
    return (
      <div
        className="system-diagram diagram-raft"
        role="img"
        aria-label="Client requests flow through gRPC to a three-node Raft cluster and durable write-ahead logs"
      >
        <div className="diagram-stage diagram-client">client</div>
        <span className="diagram-flow" aria-hidden="true" />
        <div className="diagram-stage diagram-core">Raft core</div>
        <span className="diagram-flow" aria-hidden="true" />
        <div className="diagram-nodes">
          <span className="diagram-node is-leader">N1</span>
          <span className="diagram-node">N2</span>
          <span className="diagram-node">N3</span>
        </div>
        <div className="diagram-caption">gRPC · WAL · snapshots</div>
      </div>
    );
  }

  return (
    <div
      className="system-diagram diagram-lsm"
      role="img"
      aria-label="Writes flow through a write-ahead log and memtable into SSTables and size-tiered compaction"
    >
      <div className="diagram-stage diagram-write">write</div>
      <span className="diagram-flow" aria-hidden="true" />
      <div className="diagram-stage diagram-wal">WAL</div>
      <span className="diagram-flow" aria-hidden="true" />
      <div className="diagram-stage diagram-mem">memtable</div>
      <span className="diagram-flow" aria-hidden="true" />
      <div className="diagram-sstables">
        <span>SST</span>
        <span>SST</span>
        <span>SST</span>
      </div>
      <div className="diagram-caption">bloom · sparse index · compaction</div>
    </div>
  );
}

export function SystemFeature({ project }: { project: FeaturedSystem }) {
  return (
    <article className="card system-feature" id={project.id}>
      <div className="system-copy">
        <p className="kicker">{project.eyebrow}</p>
        <h3>
          <ExternalLink href={project.repoHref}>{project.title}</ExternalLink>
        </h3>
        <p className="system-summary">{project.summary}</p>
        <p className="system-proof">{project.proof}</p>
        {project.caveat && <p className="system-caveat">{project.caveat}</p>}
        <div className="chip-rail">
          {project.chips.map((chip) => (
            <Chip key={chip} label={chip} />
          ))}
        </div>
        <p className="project-links">
          <ExternalLink className="cta-text-link" href={project.repoHref}>
            Inspect the repository <span className="arrow" aria-hidden="true">→</span>
          </ExternalLink>
        </p>
      </div>
      <div className="system-evidence">
        <SystemDiagram kind={project.diagram} />
        <dl className="metric-grid">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="metric">
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
