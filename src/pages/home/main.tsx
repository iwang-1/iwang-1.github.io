import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../js-flag";
import "../../enhance";
import "../../index.css";
import { about, education, featuredSystems, hero, person, skills } from "../../content";
import { ContactBand, EduCard } from "../../components/cards";
import { Chip, ProofChip } from "../../components/chips";
import { ClimbingRoute } from "../../components/ClimbingRoute";
import { Footer } from "../../components/Footer";
import { ExternalLink, LabelButton } from "../../components/LabelButton";
import { Nav } from "../../components/Nav";
import { Section } from "../../components/Section";
import { Sweep } from "../../components/Sweep";
import { SystemFeature } from "../../components/SystemFeature";

function Home() {
  return (
    <>
      <Nav active="home" />
      <main id="main" className="main-with-contact">
        {/* The first screen is a figure and its readout: identity and
            availability on the left, the measured recall curve on the right,
            three repos with one number and one link each above the fold. */}
        <section className="hero-band">
          <div className="hero container hero-grid">
            <div className="hero-copy">
              <p className="kicker">{hero.kicker}</p>
              <h1>{hero.headline}</h1>
              <p className="hero-subhead">{hero.subhead}</p>
              <p className="hero-availability">
                <ProofChip label={hero.availability} />
              </p>
              {/* The readout rail: fold-level proof that reads and clicks with
                  the figure ignored entirely. */}
              <div className="hero-readout" role="list">
                {hero.readout.map((r) => (
                  <div className="hero-readout-row" role="listitem" key={r.repo}>
                    <ExternalLink className="hero-readout-repo mono" href={r.href}>
                      {r.repo}
                    </ExternalLink>
                    <span className="hero-readout-value mono">{r.value}</span>
                    <span className="hero-readout-unit mono">{r.unit}</span>
                  </div>
                ))}
              </div>
              {/* Two buttons, one decision. Experience and LinkedIn live in
                  the nav and footer. */}
              <div className="cta-row">
                <LabelButton href={`mailto:${person.email}`} variant="primary">
                  Email me
                </LabelButton>
                <LabelButton href={person.github} external>
                  GitHub
                </LabelButton>
              </div>
              <p className="hero-email-plain">{person.email}</p>
            </div>
            <div className="hero-figure">
              <Sweep />
            </div>
          </div>
        </section>

        <Section id="systems" title="Featured engineering work" rank={1}>
          <div className="system-list">
            {featuredSystems.map((project, i) => (
              <SystemFeature key={project.id} project={project} index={i} />
            ))}
          </div>
        </Section>

        <Section id="about" title="About me" rank={2}>
          {/* Copy left, the boulder topo right: the one drawn figure about the
              person, beside the paragraph that earns it. Never display:none —
              the topo carries gate-asserted labels. */}
          <div className="about-layout">
            <div>
              <p>{about.p1}</p>
              <p>
                {about.p2Before}
                <a href={about.p2LinkHref}>{about.p2LinkText}</a>
                {about.p2After}
              </p>
              <p>{about.p3}</p>
            </div>
            <div className="about-figure">
              <ClimbingRoute />
            </div>
          </div>
        </Section>

        <Section id="education" title="Education" rank={2}>
          {/* Single entry — no card-grid (a lone half-width card reads as a
              missing neighbor on desktop). */}
          {education.map((e) => (
            <EduCard key={e.school} edu={e} />
          ))}
        </Section>

        <Section id="skills" title="Skills" rank={2}>
          {skills.map((row) => (
            <div className="skills-row" key={row.label}>
              <span className="skills-label">{row.label}</span>
              <div className="chip-rail" style={{ marginTop: 0 }}>
                {row.items.map((s) => (
                  <Chip key={s} label={s} />
                ))}
              </div>
            </div>
          ))}
        </Section>

        <ContactBand id="contact" />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
