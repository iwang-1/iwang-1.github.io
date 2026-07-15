import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../js-flag";
import "../../enhance";
import "../../index.css";
import { featuredSystems, ossCardA, ossCardB, person, projects } from "../../content";
import { CtaBand, ProjectCard } from "../../components/cards";
import { Footer } from "../../components/Footer";
import { ExternalLink, Keycap } from "../../components/Keycap";
import { Nav } from "../../components/Nav";
import { Reveal } from "../../components/Reveal";
import { Section } from "../../components/Section";
import { SystemFeature } from "../../components/SystemFeature";

function Projects() {
  return (
    <>
      <Nav active="projects" />
      <main id="main">
        <div className="page-head-band">
          <div className="page-head container">
            <h1>Projects</h1>
            <p className="page-dek">
              Public artifacts with explicit evidence, ownership, and limitations.
            </p>
          </div>
        </div>

        <Section title="Systems projects">
          <div className="system-list">
            {featuredSystems.map((project) => (
              <SystemFeature key={project.id} project={project} />
            ))}
          </div>
        </Section>

        <Section title="Selected projects">
          <div className="card-grid">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section title="Open source">
          <div className="card-grid">
            <Reveal delay={0}>
              <article className="card card-live">
                <h3>{ossCardA.title}</h3>
                <p style={{ marginTop: 12 }}>{ossCardA.body}</p>
                <p className="project-links">
                  <ExternalLink className="cta-text-link" href={ossCardA.href}>
                    {ossCardA.linkText}
                  </ExternalLink>
                </p>
              </article>
            </Reveal>
            <Reveal delay={1}>
              <article className="card card-live">
                <h3>{ossCardB.title}</h3>
                <p style={{ marginTop: 12 }}>{ossCardB.body}</p>
                <p className="project-links">
                  <ExternalLink className="cta-text-link" href={ossCardB.href}>
                    {ossCardB.linkText}
                  </ExternalLink>
                </p>
              </article>
            </Reveal>
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
