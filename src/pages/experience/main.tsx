import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../index.css";
import { communityRoles, engineeringRoles, person } from "../../content";
import { CtaBand, RoleCard } from "../../components/cards";
import { Footer } from "../../components/Footer";
import { Keycap } from "../../components/Keycap";
import { Nav } from "../../components/Nav";
import { Section } from "../../components/Section";

function Experience() {
  return (
    <>
      <Nav active="experience" />
      <main id="main">
        <div className="page-head container">
          <h1>Experience</h1>
          <p className="page-dek">
            Four engineering internships and three community &amp; teaching roles — the complete
            list.
          </p>
        </div>

        <Section kicker="01 · ENGINEERING" title="Engineering">
          <div className="timeline">
            {engineeringRoles.map((r) => (
              <RoleCard key={`${r.role}-${r.org}`} role={r} />
            ))}
          </div>
        </Section>

        {/* Community roles render as visually lighter compact cards (per the
            FACTS.md design spec) — no timeline dot/rule — so engineering
            reads as the headline section. Every number stays. */}
        <Section kicker="02 · COMMUNITY & TEACHING" title="Community & teaching">
          <div className="card-grid card-grid-3 community-grid">
            {communityRoles.map((r) => (
              <RoleCard key={`${r.role}-${r.org}`} role={r} compact tagTone="teal" />
            ))}
          </div>
        </Section>

        {/* Nav already carries the page's single accent keycap (Résumé), so
            the band keycap stays default — "exactly ONE accent cap per page"
            is a binding restraint rule. */}
        <CtaBand heading="Want the one-pager?">
          <Keycap href={person.resumeUrl} external>
            Résumé (PDF)
          </Keycap>
          <a className="cta-text-link" href="/projects/">
            See the projects →
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
