import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../js-flag";
import "../../enhance";
import "../../index.css";
import { communityRoles, engineeringRoles } from "../../content";
import { ContactBand } from "../../components/cards";
import { Footer } from "../../components/Footer";
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
      <main id="main" className="main-with-contact">
        <div className="page-head-band">
          <div className="page-head container">
            <h1>Experience</h1>
            <p className="page-dek">
              Production engineering across AWS, backend and data systems, research, and technical
              leadership.
            </p>
          </div>
        </div>

        <Section title="Engineering & community">
          <Timeline entries={entries} />
        </Section>

        <ContactBand heading="Looking for a systems-minded new-grad engineer?" />
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
