import type { Role } from "../content";

export default function RoleEntry({ role }: { role: Role }) {
  return (
    <article className="role">
      <div className="role-head">
        <div className="role-headline">
          <span className="role-title">{role.title}</span>
          <span className="role-org">{role.org}</span>
        </div>
        <div className="role-meta mono">
          <span className="role-date">{role.date}</span>
          <span className="role-location">{role.location}</span>
        </div>
      </div>
      <ul className="role-bullets">
        {role.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </article>
  );
}
