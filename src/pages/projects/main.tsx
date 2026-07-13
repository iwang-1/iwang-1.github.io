import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../index.css";
import { ossCardA, ossCardB, person, projects, starRepos, starSystem } from "../../content";
import { CtaBand, ProjectCard, RepoRow } from "../../components/cards";
import { Footer } from "../../components/Footer";
import { ExternalLink, Keycap } from "../../components/Keycap";
import { Nav } from "../../components/Nav";
import { Section } from "../../components/Section";

function Projects() {
  return (
    <>
      <Nav active="projects" />
      <main id="main">
        <div className="page-head container">
          <h1>Projects</h1>
          <p className="page-dek">
            Everything below with a link is a live, public repo — stats are exact, not rounded.
          </p>
        </div>

        <Section id="star-catalog" kicker="01 · FEATURED" title={starSystem.heading}>
          <div className="card featured-card">
            <div className="featured-top">
              <div className="featured-copy">
                <p>{starSystem.intro}</p>
                <div className="cta-row">
                  <Keycap href={starSystem.demoUrl} external>
                    Live demo
                  </Keycap>
                </div>
              </div>
              <div className="featured-shot">
                <img
                  src={starSystem.screenshot.src}
                  alt={starSystem.screenshot.alt}
                  width={starSystem.screenshot.width}
                  height={starSystem.screenshot.height}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="repo-rows">
              {starRepos.map((r) => (
                <RepoRow key={r.name} repo={r} />
              ))}
            </div>
          </div>
        </Section>

        <Section kicker="02 · PROJECTS" title="More projects">
          <div className="card-grid">
            {projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </Section>

        <Section kicker="03 · OPEN SOURCE" title="Open source">
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
