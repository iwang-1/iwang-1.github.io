import type { EducationItem } from "../content";

export default function EducationEntry({ item }: { item: EducationItem }) {
  return (
    <article className="edu">
      <div className="role-head">
        <div className="role-headline">
          <span className="role-title">{item.school}</span>
          <span className="role-org">{item.degree}</span>
        </div>
        <span className="role-date mono">{item.date}</span>
      </div>
      {item.detail && <p className="edu-detail">{item.detail}</p>}
      {item.coursework && <p className="edu-coursework">{item.coursework}</p>}
    </article>
  );
}
