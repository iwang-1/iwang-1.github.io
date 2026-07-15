import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../js-flag";
import "../../enhance";
import "../../index.css";
import {
  about,
  education,
  featuredSystems,
  hero,
  person,
  proofPoints,
  skills,
  teasers,
} from "../../content";
import { EduCard } from "../../components/cards";
import { Chip, ProofChip } from "../../components/chips";
import { Footer } from "../../components/Footer";
import { Keycap } from "../../components/Keycap";
import { KeycapCluster } from "../../components/KeycapCluster";
import { Nav } from "../../components/Nav";
import { Reveal } from "../../components/Reveal";
import { Section } from "../../components/Section";
import { SystemFeature } from "../../components/SystemFeature";

function Home() {
  return (
    <>
      <Nav active="home" />
      <main id="main">
        <section className="hero-band">
          <div className="hero container">
            <p className="kicker">{hero.kicker}</p>
            <h1>{hero.headline}</h1>
            <p className="hero-subhead">{hero.subhead}</p>
            <p className="hero-availability">
              <ProofChip label={hero.availability} />
            </p>
            {/* The shared nav already carries this page's single accent keycap
                (Résumé) — "exactly ONE accent-filled keycap per page" is a
                binding restraint rule, so the hero caps stay default. */}
            <div className="cta-row">
              <Keycap href={person.resumeUrl} external>
                Résumé (PDF)
              </Keycap>
              <Keycap href={person.github} external>
                GitHub
              </Keycap>
              <Keycap href={person.linkedin} external>
                LinkedIn
              </Keycap>
              <Keycap href={`mailto:${person.email}`}>Email</Keycap>
            </div>
            <p className="hero-email-plain">{person.email}</p>
          </div>
        </section>
        <section className="proof-band" aria-label="Selected evidence">
          <dl className="container proof-rail">
            {proofPoints.map((point) => (
              <div key={point.label} className="proof-point">
                <dd>{point.value}</dd>
                <dt>{point.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <Section id="systems" title="Systems work">
          <div className="system-list">
            {featuredSystems.map((project) => (
              <SystemFeature key={project.id} project={project} />
            ))}
          </div>
        </Section>


        <Section id="about" title="About me">
          {/* Desktop 2-col: copy left, decorative keycap cluster right — it
              literally illustrates the hero's keyboard thesis and keeps the
              right half of the container from reading as dead field. */}
          <div className="about-layout">
            <div className="about-copy">
              <p>{about.p1}</p>
              <p>
                {about.p2Before}
                <a href={about.p2LinkHref}>{about.p2LinkText}</a>
                {about.p2After}
              </p>
              <p>{about.p3}</p>
            </div>
            <div className="about-visual" aria-hidden="true">
              <KeycapCluster />
            </div>
          </div>
        </Section>

        <Section id="education" title="Education">
          {/* Single entry — no card-grid (a lone half-width card reads as a
              missing neighbor on desktop). The .edu-card max-width caps the
              measure; bring the grid back with a second entry. */}
          {education.map((e) => (
            <EduCard key={e.school} edu={e} />
          ))}
        </Section>

        <Section id="skills" title="Skills">
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

        <Section title="Selected work">
          <div className="card-grid card-grid-3">
            {teasers.map((t, i) => (
              <Reveal key={t.title} delay={i}>
                <article className="card card-live">
                  <h3>{t.title}</h3>
                  <p style={{ marginTop: 8 }}>{t.body}</p>
                  {t.proofChips && (
                    <div className="chip-rail">
                      {t.proofChips.map((c) => (
                        <ProofChip key={c} label={c} />
                      ))}
                    </div>
                  )}
                  <p className="project-links">
                    <a className="cta-text-link" href={t.href}>
                      {t.linkText}{" "}
                      <span className="arrow" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
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
