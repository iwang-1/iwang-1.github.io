import { rail } from "../content";
import type { RailNode } from "../content";

// Node anatomy: glowing star-dot, then mono label over headline metric.
function NodeLabel({ node }: { node: RailNode }) {
  return (
    <>
      <span className="rail-dot" aria-hidden="true" />
      <span className="rail-text mono">
        <span className="rail-label">{node.label}</span>
        {node.metric && <span className="rail-metric">{node.metric}</span>}
      </span>
    </>
  );
}

/** Signature element B — the system diagram that doubles as in-page nav. */
export default function PipelineRail() {
  return (
    <ol className="rail" aria-label="The star-catalog pipeline">
      {rail.nodes.map((node) => (
        <li key={node.label} className="rail-node">
          {node.anchor ? (
            <a className="rail-link" href={node.anchor}>
              <NodeLabel node={node} />
            </a>
          ) : (
            <NodeLabel node={node} />
          )}
        </li>
      ))}
      <li className="rail-node rail-branch">
        <a className="rail-link" href={rail.branch.anchor}>
          <NodeLabel node={rail.branch} />
        </a>
      </li>
    </ol>
  );
}
