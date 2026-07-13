import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../index.css";
import { ossCardA, ossCardB, person, projects } from "../../content";
import { CtaBand, ProjectCard } from "../../components/cards";
import { Footer } from "../../components/Footer";
import { ExternalLink, Keycap } from "../../components/Keycap";
import { Nav } from "../../components/Nav";
import { Section } from "../../components/Section";

function Projects() {
  return (
    <>
      <Nav active="projects" />
      <main id="main">
        <div className="page-head-band">
          <div className="page-head container">
            <h1>Projects</h1>
            <p className="page-dek">
              Everything below with a link is a live, public repo — stats are exact, not rounded.
            </p>
          </div>
        </div>

        <Section kicker="01 · PROJECTS" title="Selected projects">
          <div className="card-grid">
            {projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </Section>

        <Section kicker="02 · OPEN SOURCE" title="Open source">
          <div className="card-grid">
            <article className="card">
              <h3>{ossCardA.title}</h3>
              <p style={{ marginTop: 12 }}>{ossCardA.body}</p>
              <p className="project-links">
                <ExternalLink href={ossCardA.href}>{ossCardA.linkText}</ExternalLink>
              </p>
            </article>
            <article className="card">
              <h3>{ossCardB.title}</h3>
              <p style={{ marginTop: 12 }}>{ossCardB.body}</p>
              <p className="project-links">
                <ExternalLink href={ossCardB.href}>{ossCardB.linkText}</ExternalLink>
              </p>
            </article>
          </div>
        </Section>

        {/* Nav already carries the page's single accent keycap (Résumé), so
            the band keycap stays default — "exactly ONE accent cap per page"
            is a binding restraint rule. */}
        <CtaBand heading="If you're hiring new-grad engineers for Summer 2027, I'd love to talk.">
          <Keycap href={`mailto:${person.email}`}>Email me</Keycap>
          <ExternalLink className="cta-text-link" href={person.resumeUrl}>
            Résumé (PDF)
          </ExternalLink>
        </CtaBand>
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Projects />
  </StrictMode>,
);
