import type { SideProject } from "../content";

export default function SideProjectCard({ project }: { project: SideProject }) {
  return (
    <article className="side-project">
      <div className="role-head">
        <div className="role-headline">
          <span className="role-title">{project.name}</span>
          <span className="role-org mono">{project.stack}</span>
        </div>
        <span className="role-date mono">{project.date}</span>
      </div>
      <ul className="role-bullets">
        {project.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </article>
  );
}
