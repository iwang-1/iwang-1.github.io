import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../index.css";
import {
  about,
  education,
  hero,
  nowStrip,
  person,
  skills,
  teasers,
} from "../../content";
import { EduCard, FactTile } from "../../components/cards";
import { Chip, ProofChip } from "../../components/chips";
import { Footer } from "../../components/Footer";
import { Keycap } from "../../components/Keycap";
import { Nav } from "../../components/Nav";
import { Section } from "../../components/Section";

function Home() {
  return (
    <>
      <Nav active="home" />
      <main id="main">
        <section className="hero container">
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
          <div className="now-strip">
            {nowStrip.map((f) => (
              <FactTile key={f} label={f} />
            ))}
          </div>
        </section>

        <Section id="about" kicker="01 · ABOUT" title="About me">
          <p>{about.p1}</p>
          <p>
            {about.p2Before}
            <a href={about.p2LinkHref}>{about.p2LinkText}</a>
            {about.p2After}
          </p>
          <p>{about.p3}</p>
        </Section>

        <Section id="education" kicker="02 · EDUCATION" title="Education">
          <div className="card-grid">
            {education.map((e) => (
              <EduCard key={e.school} edu={e} />
            ))}
          </div>
        </Section>

        <Section id="skills" kicker="03 · SKILLS" title="Skills">
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

        <Section kicker="04 · SELECTED WORK" title="Selected work">
          <div className="card-grid card-grid-3">
            {teasers.map((t) => (
              <article className="card" key={t.title}>
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
                  <a href={t.href}>{t.linkText} →</a>
                </p>
              </article>
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
