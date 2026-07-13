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
        {classifier.chips.map((label) => (
          <MetricChip key={label} label={label} href={linked ? classifier.repoUrl : undefined} />
        ))}
      </p>
    </article>
  );
}
