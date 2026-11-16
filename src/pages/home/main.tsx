import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { enableJs } from "../../js-flag";
import "../../enhance";
import "../../index.css";
import { education, featuredSystems, hero, hobbies, openSource, person, projects, skills } from "../../content";
import { ContactBand, EduCard } from "../../components/cards";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Chip, ProofChip } from "../../components/chips";
import { Boulder } from "../../components/Boulder";
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
        {/* The hero band is the report's first figure: identity and one sentence on the left, the three-repo
           readout rail on the right, both hanging off the container's left spine and closed by a hairline at the band's bottom edge. */}
        <section className="hero-band">
          <div className="hero container">
            {/* Three blocks in DOM order. */}
            <div className="hero-layout">
              <div className="hero-lead">
                <p className="kicker">{hero.kicker}</p>
                <h1>{hero.headline}</h1>
                <p className="hero-subhead">{hero.subhead}</p>
                <p className="hero-availability">
                  <ProofChip label={hero.availability} />
                </p>
              </div>
              {/* The rail: three repos, what each is, one measured number each. It belongs on the first screen
                 — it is the evidence the headline is claiming. */}
              <div className="hero-side">
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
              </div>
              <div className="hero-tail">
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
                {/* Was the bare address. */}
                <p className="hero-email-plain">
                  {hero.emailLine} · {person.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section id="systems" title="Featured engineering work" rank={1}>
          {/* The section opens with one figure at the full container measure. */}
          <div className="systems-sweep">
            <Sweep />
          </div>
          <div className="system-list">
            {/* Preview, not the full sheet. */}
            {featuredSystems.map((project, i) => (
              <SystemFeature key={project.id} project={project} index={i} variant="preview" />
            ))}
          </div>
          {/* An exit that points at what the reader has not seen. */}
          <p className="section-exit">
            <a className="mono" href="/projects/#selected">
              {projects.length} more: developer tools, data systems, ML, NLP, statistics, and this site{" "}
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </p>
        </Section>

        {/* Upstream contributions, each with its exact status. */}
        <Section id="open-source" title={openSource.title} rank={2}>
          <p className="hobby-intro">{openSource.intro}</p>
          <div className="oss-list">
            {openSource.items.map((item) => (
              <div className="skills-row" key={item.href}>
                <span className="skills-label">
                  {item.org} · {item.project}
                </span>
                <p className="oss-line">
                  {item.summary} <Chip label={item.status} />{" "}
                  <a className="mono" href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.linkText} <span className="arrow" aria-hidden="true">→</span>
                  </a>
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Education and skills are one thing. */}
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

        {/* The hobbies, each drawn as its own small figure — the key tester you can type on, the boulder route,
           the feed. They led the page from 2026-07-31; by owner call on 2026-11-16 they follow the work, so a
           recruiter on a phone reaches the projects first (PRODUCT.md, positioning constraint 2). */}
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
              <Boulder />
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

        <ContactBand id="contact" />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  </StrictMode>,
);
// After render, never before: `.js` is the receipt for a completed mount. See src/js-flag.ts — as an import
// side effect it hid intact prerendered content whenever anything above threw.
enableJs();
