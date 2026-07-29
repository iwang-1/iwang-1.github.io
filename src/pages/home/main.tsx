import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../js-flag";
import "../../enhance";
import "../../index.css";
import { education, featuredSystems, hero, hobbies, person, skills } from "../../content";
import { ContactBand, EduCard } from "../../components/cards";
import { ProofChip } from "../../components/chips";
import { ClimbingRoute } from "../../components/ClimbingRoute";
import { Footer } from "../../components/Footer";
import { Keyboard } from "../../components/Keyboard";
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
        {/* The first screen is the person, not the proof (owner call,
            2026-07-27): centered name, a friendly line, availability, and the
            two contact affordances. The evidence moved one scroll down into
            Featured engineering work, where it opens with the readout rail and
            the measured curve. */}
        <section className="hero-band">
          <div className="hero container hero-centered">
            <p className="kicker">{hero.kicker}</p>
            <h1>{hero.headline}</h1>
            <p className="hero-subhead">{hero.subhead}</p>
            <p className="hero-availability">
              <ProofChip label={hero.availability} />
            </p>
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
        </section>

        {/* Off the clock — the hobbies, each drawn as its own small figure:
            the key tester you can type on, the boulder topo, the feed table. */}
        <Section id="off-hours" title={hobbies.title} rank={2}>
          <p className="hobby-intro">{hobbies.intro}</p>
          <div className="hobby-grid">
            <div className="hobby-cell">
              <h3 className="hobby-blurb">{hobbies.keyboards.blurb}</h3>
              <p className="hobby-lead">{hobbies.keyboards.lead}</p>
              <Keyboard />
            </div>
            <div className="hobby-cell">
              <h3 className="hobby-blurb">{hobbies.climb.blurb}</h3>
              <p className="hobby-lead">{hobbies.climb.lead}</p>
              <ClimbingRoute />
            </div>
            <div className="hobby-cell">
              <h3 className="hobby-blurb">{hobbies.tech.blurb}</h3>
              <p className="hobby-lead">{hobbies.tech.lead}</p>
              {/* A stacked list, not a two-column table: in a third-width
                  column a table wrapped both cells every two words. */}
              <figure className="plate feed-fig">
                <p className="plate-label">What I follow</p>
                <dl className="feed-list">
                  {hobbies.tech.feed.map((row) => (
                    <div className="feed-row" key={row.topic}>
                      <dt>{row.topic}</dt>
                      <dd>{row.note}</dd>
                    </div>
                  ))}
                </dl>
              </figure>
            </div>
          </div>
        </Section>

        <Section id="systems" title="Featured engineering work" rank={1}>
          {/* The evidence opens with the rail: three repos, what each IS, one
              measured number each — then the curve, then the plates. */}
          <p className="hero-readout-lead">{hero.readoutLead}</p>
          <div className="hero-readout" role="list">
            {hero.readout.map((r) => (
              <div className="hero-readout-row" role="listitem" key={r.repo}>
                <span className="hero-readout-name">
                  <ExternalLink className="hero-readout-repo mono" href={r.href}>
                    {r.repo}
                  </ExternalLink>
                  <span className="hero-readout-what">{r.what}</span>
                </span>
                <span className="hero-readout-value mono">{r.value}</span>
                <span className="hero-readout-unit mono">
                  {r.unit}
                  {r.plain ? <span className="hero-readout-plain">{r.plain}</span> : null}
                </span>
              </div>
            ))}
          </div>
          <p className="hero-readout-aside">
            <a className="mono" href={hero.readoutAside.href}>
              {hero.readoutAside.text}
            </a>
          </p>
          <div className="systems-sweep">
            <Sweep />
          </div>
          <div className="system-list">
            {featuredSystems.map((project, i) => (
              <SystemFeature key={project.id} project={project} index={i} />
            ))}
          </div>
        </Section>

        <Section id="education" title="Education" rank={2}>
          {/* Single entry — no card-grid (a lone half-width card reads as a
              missing neighbor on desktop). */}
          {education.map((e) => (
            <EduCard key={e.school} edu={e} />
          ))}
        </Section>

        {/* Skills are metadata, so they are set like the plate footnotes:
            mono lines, not a wall of pills. */}
        <Section id="skills" title="Skills" rank={2}>
          {skills.map((row) => (
            <div className="skills-row" key={row.label}>
              <span className="skills-label">{row.label}</span>
              <p className="skills-line">{row.items.join(" · ")}</p>
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
