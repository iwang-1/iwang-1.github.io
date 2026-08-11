import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { enableJs } from "../../js-flag";
import "../../enhance";
import "../../index.css";
import { featuredSystems, projects } from "../../content";
import { ContactBand, ProjectCard } from "../../components/cards";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { Reveal } from "../../components/Reveal";
import { Section } from "../../components/Section";
import { SystemFeature } from "../../components/SystemFeature";

function Projects() {
  return (
    <>
      <Nav active="projects" />
      <main id="main" className="main-with-contact">
        <div className="page-head-band">
          <div className="page-head container">
            <h1>Projects</h1>
            <p className="page-dek">
              Every project links to its code. Any number here comes from a benchmark
              committed in that repo, so you can re-run it yourself.
            </p>
          </div>
        </div>

        {/* "Built from scratch" / "More projects", not "Systems projects" / "Selected projects". */}
        <Section title="Built from scratch">
          <div className="system-list">
            {featuredSystems.map((project) => (
              <SystemFeature key={project.id} project={project} />
            ))}
          </div>
        </Section>

        <Section id="selected" title="More projects">
          <div className="sheet-grid sheet-grid-3">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </Section>

        <ContactBand id="contact" heading="Get in touch" />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Projects />
    </ErrorBoundary>
  </StrictMode>,
);
// AFTER render — see src/js-flag.ts.
enableJs();
