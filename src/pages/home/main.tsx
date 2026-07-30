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
        {/* The hero band owns the first screen by itself (539px desktop, ~684px
            at 390w): who he is, what he's doing now, and how to reach him. The
            engineering evidence follows it directly — hobbies come after the
            work, because a screener's first scroll should buy proof. */}
        <section className="hero-band">
          <div className="hero container hero-centered">
            <p className="kicker">{hero.kicker}</p>
            <h1>{hero.headline}</h1>
            <p className="hero-subhead">{hero.subhead}</p>
            <p className="hero-availability">
              <ProofChip label={hero.availability} />
            </p>
            {/* The paid production work, in body type, in the hero. */}
            <p className="hero-aws">
              {hero.awsLine.text}{" "}
              <a href={hero.awsLine.href}>
                {hero.awsLine.linkText} <span className="arrow" aria-hidden="true">→</span>
              </a>
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
          <div className="systems-sweep">
            <Sweep />
          </div>
          <div className="system-list">
            {featuredSystems.map((project, i) => (
              <SystemFeature key={project.id} project={project} index={i} />
            ))}
          </div>
          {/* An exit that points at what the reader has NOT seen. */}
          <p className="section-exit">
            <a className="mono" href="/projects/#selected">
              Eight more projects <span className="arrow" aria-hidden="true">→</span>
            </a>
          </p>
        </Section>

        {/* The hobbies, each drawn as its own small figure: the key tester you
            can type on, the boulder route, the feed. */}
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

        {/* Education and skills are one thing — where he studied and what he
            works in — so they are one section instead of two identical
            headings. The #education anchor is kept for the footer link. */}
        <Section id="background" title="Background" rank={2}>
          <div id="education">
            {education.map((e) => (
              <EduCard key={e.school} edu={e} />
            ))}
          </div>
          <div className="skills-block" id="skills">
            {skills.map((row) => (
              <div className="skills-row" key={row.label}>
                <span className="skills-label">{row.label}</span>
                <p className="skills-line">{row.items.join(" · ")}</p>
              </div>
            ))}
          </div>
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
