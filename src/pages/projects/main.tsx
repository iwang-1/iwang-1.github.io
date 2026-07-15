import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../js-flag";
import "../../enhance";
import "../../index.css";
import { featuredSystems, projects } from "../../content";
import { ContactBand, ProjectCard } from "../../components/cards";
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
              Systems, backend, and ML/NLP work with public code, reproducible evidence, and clear
              engineering tradeoffs.
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
          <div className="card-grid card-grid-3">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </Section>

        <ContactBand heading="Building a backend or infrastructure team?" />
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
