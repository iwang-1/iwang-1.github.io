import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { enableJs } from "../../js-flag";
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
        {/* The hero band IS the report's first figure: identity and one
            sentence on the left, the three-repo readout rail on the right, both
            hanging off the container's left spine and closed by a hairline at
            the band's bottom edge. Measured 713px tall at 1440 and ~1,012px at
            1023, where the rail stacks under the copy. */}
        <section className="hero-band">
          <div className="hero container">
            {/* THREE blocks in DOM order — identity, the rail, then the AWS
                sentence and the CTAs — and at ≥1024 the grid puts identity over
                AWS/CTAs in the left column with the rail spanning both on the
                right, so the desktop picture is unchanged from the two-column
                split it replaces.
                The split is what gets the evidence above a PHONE fold. In one
                copy block the rail came last, and its first row did not close
                until y=1070 on a 390px screen — 226px below the 844 fold — so a
                phone screener saw the bio, the AWS paragraph, two buttons, and no
                evidence at all. Reordered, the first row closes at ~715.
                It also fixes the desktop tab order for free: focus used to run
                down the copy to y=595 and then jump 407px back UP to the rail at
                the hero's top right. DOM order is now the reading order at both
                widths, so no `order` property is needed anywhere — the WCAG 2.4.3
                mismatch is removed rather than relocated. */}
            <div className="hero-layout">
              <div className="hero-lead">
                <p className="kicker">{hero.kicker}</p>
                <h1>{hero.headline}</h1>
                <p className="hero-subhead">{hero.subhead}</p>
                <p className="hero-availability">
                  <ProofChip label={hero.availability} />
                </p>
              </div>
              {/* The rail: three repos, what each IS, one measured number each.
                  It belongs on the first screen — it is the evidence the
                  headline is claiming. */}
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
                {/* Was the bare address — a second copy of the "Email me"
                    button one line above it. The same line now carries the one
                    artifact an ATS asks for, which otherwise appeared only in
                    the contact band 5,000px down. Plain text, not a file:
                    verify.mjs blocks any public PDF link, so the sentence IS
                    the affordance. The address still renders in the contact
                    band and the footer, so the required-string gate holds. */}
                <p className="hero-email-plain">
                  {hero.emailLine} · {person.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personality first, by owner call (2026-07-31): the hobbies lead the
            page, each drawn as its own small figure — the key tester you can
            type on, the boulder route, the feed. The engineering evidence
            follows directly, and the hero's readout rail already puts three
            measured results above the fold, so a screener never has to scroll
            past the personality to find proof.

            rank={2}, deliberately, and it does NOT walk back the ordering call:
            ORDER carries the personality, SIZE carries the rank. At rank-1 this
            heading and "Featured engineering work" both computed to 41.6px, so
            the page had two leads and the louder one was the preamble — the
            identically-sized-headings failure DESIGN.md's Rank Rule names. The
            hobbies still come first; the work keeps the page's biggest type. */}
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
          {/* The section opens with ONE figure at the full container measure —
              the rail that used to sit beside it now lives in the hero, above
              the fold, where the numbers are the first screen's evidence. */}
          <div className="systems-sweep">
            <Sweep />
          </div>
          <div className="system-list">
            {featuredSystems.map((project, i) => (
              <SystemFeature key={project.id} project={project} index={i} />
            ))}
          </div>
          {/* An exit that points at what the reader has NOT seen — and NAMES it.
              A bare "Eight more projects" sits exactly where a reader who has
              just read three Raft/LSM/HNSW plates decides whether this is a
              one-track portfolio, and it named nothing behind the link. All four
              categories are already the titles or chips of those eight cards, so
              this is surfacing, not a new claim. */}
          <p className="section-exit">
            <a className="mono" href="/projects/#selected">
              Eight more — ML, NLP, statistics, and this site{" "}
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </p>
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
// AFTER render, never before: `.js` is the receipt for a completed mount. See
// src/js-flag.ts — as an import side effect it hid intact prerendered content
// whenever anything above threw.
enableJs();
