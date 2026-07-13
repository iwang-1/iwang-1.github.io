import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../index.css";
import { communityRoles, engineeringRoles, person } from "../../content";
import { CtaBand } from "../../components/cards";
import { Footer } from "../../components/Footer";
import { Keycap } from "../../components/Keycap";
import { Nav } from "../../components/Nav";
import { Section } from "../../components/Section";
import { Timeline, type TimelineEntry } from "../../components/Timeline";

// One center-spine timeline: 4 engineering roles reverse-chron, then a spine
// label, then the 3 community & teaching roles (teal tags). Most recent
// (AWS) renders first — LEFT of the spine on desktop.
const entries: TimelineEntry[] = [
  ...engineeringRoles.map((role): TimelineEntry => ({ kind: "role", role })),
  { kind: "label", text: "Community & Teaching" },
  ...communityRoles.map((role): TimelineEntry => ({ kind: "role", role, tagTone: "teal" })),
];

function Experience() {
  return (
    <>
      <Nav active="experience" />
      <main id="main">
        <div className="page-head-band">
          <div className="page-head container">
            <h1>Experience</h1>
            <p className="page-dek">
              Four engineering internships and three community &amp; teaching roles — the complete
              list.
            </p>
          </div>
        </div>

        <Section kicker="01 · TIMELINE" title="Engineering & community">
          <Timeline entries={entries} />
        </Section>

        {/* Nav already carries the page's single accent keycap (Résumé), so
            the band keycap stays default — "exactly ONE accent cap per page"
            is a binding restraint rule. */}
        <CtaBand heading="Want the one-pager?">
          <Keycap href={person.resumeUrl} external>
            Résumé (PDF)
          </Keycap>
          <a className="cta-text-link" href="/projects/">
            See the projects{" "}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </a>
        </CtaBand>
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Experience />
  </StrictMode>,
);
