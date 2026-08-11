import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { enableJs } from "../../js-flag";
import "../../enhance";
import "../../index.css";
import { communityRoles, engineeringRoles } from "../../content";
import { ContactBand } from "../../components/cards";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Footer } from "../../components/Footer";
import { Nav } from "../../components/Nav";
import { Section } from "../../components/Section";
import { Timeline, type TimelineEntry } from "../../components/Timeline";

// One center-spine timeline: 4 engineering roles reverse-chron, then a spine label, then the 3 community &
// teaching roles (teal tags).
const entries: TimelineEntry[] = [
  ...engineeringRoles.map((role): TimelineEntry => ({ kind: "role", role })),
  { kind: "label", text: "Community & Teaching" },
  ...communityRoles.map((role): TimelineEntry => ({ kind: "role", role })),
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
              Four engineering roles, then the teaching and community work I did alongside school.
              Newest first.
            </p>
          </div>
        </div>

        <Section title="Engineering & community">
          <Timeline entries={entries} />
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
      <Experience />
    </ErrorBoundary>
  </StrictMode>,
);
// AFTER render — see src/js-flag.ts.
enableJs();
