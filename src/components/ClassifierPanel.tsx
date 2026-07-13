import { classifier, flags } from "../content";
import MetricChip from "./MetricChip";

export default function ClassifierPanel() {
  const linked = flags.repoLinksEnabled;
  return (
    <article className="classifier-panel">
      <p className="key-line">{classifier.keyLine}</p>
      <p className="card-detail">{classifier.intro}</p>
      <div className="comparison mono" role="group" aria-label="Model versus baseline">
        <p className="comparison-row comparison-model">{classifier.modelRow}</p>
        <p className="comparison-row comparison-baseline">{classifier.baselineRow}</p>
      </div>
      <p className="disclosure">{classifier.oClass}</p>
      <p className="chip-row">
        {/* Chips stay plain text; the single repo link below carries the URL. */}
        {classifier.chips.map((label) => (
          <MetricChip key={label} label={label} />
        ))}
      </p>
      {linked && (
        <p>
          <a href={classifier.repoUrl}>
            View star-spectral-classifier on GitHub
            <span aria-hidden="true"> ↗</span>
          </a>
        </p>
      )}
    </article>
  );
}
