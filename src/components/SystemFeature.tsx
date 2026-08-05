import type { CSSProperties } from "react";
import { featuredSystems, type FeaturedSystem } from "../content";
import { Chip } from "./chips";
import { ExternalLink } from "./LabelButton";
import { Plate } from "./Plate";
import { Readout } from "./Readout";
import { Reveal } from "./Reveal";

/** Figure numbering across the site: the three system plates are FIG. 01-03 in
 *  page order, and the Sweep labels itself a DETAIL of lodestone's plate rather
 *  than taking a number of its own — it used to be FIG. 01 while lodestone's
 *  plate was FIG. 04, so one subject carried two numbers on one page and three
 *  cold reviewers read it as a numbering bug. The hobby plates carry plain
 *  labels, not figure numbers.
 *
 *  (historical note) FIG. 00 was the climbing topo, FIG. 01 was
 *  the recall curve on the homepage, and the three system plates follow. The
 *  offset lives here so both pages that render these cards number them
 *  identically. */
const FIRST_SYSTEM_FIGURE = 1;

/** The plate label format, zero-padded: "FIG. 02 · lodestone". Figure numbers
 *  belong to objects that genuinely are figures — the three systems, the curve,
 *  the topo, the 404's empty plate. About, Education and Skills get typographic
 *  rank instead: five FIG. labels are a system, nine are a costume. */
function figureLabel(n: number, subject: string) {
  return `FIG. ${String(n).padStart(2, "0")} · ${subject}`;
}

/** The links row: the repo, then the committed artifact a reader can open to
 *  check the numbers themselves. Flex here rather than in the stylesheet because
 *  the row's own gap is the only thing this markup needs that `.project-links`
 *  does not already give it. */
const LINK_ROW: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  columnGap: "var(--space-5)",
  rowGap: "var(--space-1)",
};

/** `.system-feature` is a grid from 1024px up, and the plate's label and
 *  footnote are siblings of the two body columns — so without this they would
 *  each take a single track and the footnote strip would run half width under the
 *  copy column only. */
const PLATE_STRIP: CSSProperties = { gridColumn: "1 / -1" };

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
        {/* The caption is the figure's last child and claims a full flex line of
            its own, so it is a real box in the flow. It used to be absolutely
            positioned and measured 20–35px INTO the stage boxes on mobile. */}
        <div className="diagram-caption">gRPC · WAL · snapshots</div>
      </div>
    );
  }

  if (kind === "lsm") {
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

  return (
    <div
      className="system-diagram diagram-ann"
      role="img"
      aria-label="A query embedding is scored by AVX-512 distance kernels through an HNSW graph and IVF-PQ index to return the top-k nearest neighbors"
    >
      <div className="diagram-stage diagram-query">query</div>
      <span className="diagram-flow" aria-hidden="true" />
      <div className="diagram-stage diagram-simd">AVX-512</div>
      <span className="diagram-flow" aria-hidden="true" />
      <div className="diagram-nodes">
        <span className="diagram-node is-leader">HNSW</span>
        <span className="diagram-node">IVF-PQ</span>
      </div>
      <span className="diagram-flow" aria-hidden="true" />
      <div className="diagram-stage diagram-topk">top-k</div>
      <div className="diagram-caption">recall@10 · single-core QPS</div>
    </div>
  );
}

/** SystemFeature — one flagship repo as a figure.
 *
 *  Plate anatomy: a label naming the figure, the two-column body (copy left,
 *  evidence right), and a footnote strip carrying the measurement conditions and
 *  the † scope note.
 *
 *  The ordering is the point. The card used to end on its own limitation, which
 *  is a closing argument against yourself; the limitation is unchanged word for
 *  word and now sits in the footnote strip, while the card closes on the proof,
 *  the measured numbers, and the links you can open to check them.
 *
 *  `index` staggers the reveal. It is the card's position in the rendered list,
 *  not its figure number. */
export function SystemFeature({ project, index = 0 }: { project: FeaturedSystem; index?: number }) {
  const figureNumber = FIRST_SYSTEM_FIGURE + featuredSystems.findIndex((s) => s.id === project.id);
  return (
    <Reveal delay={index}>
      <Plate
        id={project.id}
        /* `.sheet-block` carries the block's fill, hairline, radius and pad;
           `.sheet-live` is the hover promise, because the title is a link.
           A datasheet block does NOT lift on hover — only its rule warms. */
        className="system-feature sheet-block sheet-live"
        label={figureLabel(figureNumber, project.title)}
        stripStyle={PLATE_STRIP}
        /* The footnote is now provenance ONLY — the measurement conditions.
           `limits` moved OUT of here into the NOTES column below, at body size.
           A 14px dagger footnote is where a page puts something it hopes you
           skim; on a datasheet the thing a part does NOT do is a titled column,
           printed at the same size as everything it qualifies. */
        footnote={project.provenance}
      >
        <div className="system-copy">
          <p className="kicker">{project.eyebrow}</p>
          <h3>
            <ExternalLink href={project.repoHref}>{project.title}</ExternalLink>
          </h3>
          <p className="system-summary">{project.summary}</p>
          <div className="chip-rail">
            {project.chips.map((chip) => (
              <Chip key={chip} label={chip} />
            ))}
          </div>
          <p className="system-proof">{project.proof}</p>
          {project.aside && <p className="system-aside">{project.aside}</p>}
          <p className="project-links" style={LINK_ROW}>
            <ExternalLink className="cta-text-link" href={project.repoHref}>
              Inspect the repository <span className="arrow" aria-hidden="true">→</span>
            </ExternalLink>
            {project.artifactLinks.map((link) => (
              <ExternalLink key={link.href} className="cta-text-link mono" href={link.href}>
                {link.label}
              </ExternalLink>
            ))}
          </p>
        </div>
        <div className="system-evidence">
          <p className="spec-col-head">Specifications</p>
          <SystemDiagram kind={project.diagram} />
          {/* As many rows as the repo actually measured — three, two, two. The
              `plain` gloss rides along on the rows whose label is an axis label
              rather than English; see the field's contract in content.ts. */}
          <Readout
            cells={project.metrics.map((m) => ({ value: m.value, label: m.label, plain: m.plain }))}
          />
          {project.limits && (
            <div className="spec-notes">
              <p className="spec-col-head">Notes &amp; limits</p>
              {/* Ivan's own limit text, verbatim. The leading dagger is dropped
                  because the column is titled — a marker pointing at a footnote
                  that no longer exists reads as a broken reference. */}
              <p>{project.limits.replace(/^†\s*/, "")}</p>
            </div>
          )}
        </div>
      </Plate>
    </Reveal>
  );
}
