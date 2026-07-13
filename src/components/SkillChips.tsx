import { skills } from "../content";

function Row({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="skill-row">
      <span className="skill-label mono">{label}</span>
      <span className="chip-row">
        {items.map((s) => (
          <span key={s} className="chip mono">
            {skills.usedAbove.includes(s) && (
              <span className="used-dot" aria-hidden="true" />
            )}
            {s}
          </span>
        ))}
      </span>
    </div>
  );
}

export default function SkillChips() {
  return (
    <div className="skills">
      <Row label="Languages" items={skills.languages} />
      <Row label="Frameworks" items={skills.frameworks} />
      <Row label="ML / NLP" items={skills.mlnlp} />
      <Row label="Tools" items={skills.tools} />
      <p className="skills-legend mono">
        <span className="used-dot" aria-hidden="true" /> · used in the projects above
      </p>
    </div>
  );
}
