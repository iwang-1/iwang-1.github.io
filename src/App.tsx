import {
  classifier,
  education,
  experience,
  flags,
  leadership,
  openSource,
  projects,
  research,
  sideProjects,
  starSystem,
} from "./content";
import ClassifierPanel from "./components/ClassifierPanel";
import EducationEntry from "./components/EducationEntry";
import Footer from "./components/Footer";
import LedgerRow from "./components/LedgerRow";
import LedgerSection from "./components/LedgerSection";
import Masthead from "./components/Masthead";
import PipelineRail from "./components/PipelineRail";
import ProjectCard from "./components/ProjectCard";
import RoleEntry from "./components/RoleEntry";
import Screenshot from "./components/Screenshot";
import SideProjectCard from "./components/SideProjectCard";
import SkillChips from "./components/SkillChips";
import SkipLink from "./components/SkipLink";
import StatusBadge from "./components/StatusBadge";

export default function App() {
  return (
    <>
      <SkipLink />
      <Masthead />
      <main id="main">
        <LedgerSection id="experience" kicker="EXPERIENCE">
          {experience.map((role) => (
            <RoleEntry key={`${role.org}-${role.title}`} role={role} />
          ))}
        </LedgerSection>

        <LedgerSection id="education" kicker="EDUCATION">
          {education.map((item) => (
            <EducationEntry key={item.school} item={item} />
          ))}
        </LedgerSection>

        <LedgerSection id="star-system" kicker={starSystem.kicker} title={starSystem.heading}>
          <p className="story">{starSystem.story}</p>
          <PipelineRail />
          <Screenshot />
          {/* Three cards here; the system's fourth repo (the classifier) has its
              own section below. Test counts stay per-repo, never summed. */}
          <div className="project-grid">
            {projects.map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
          </div>
        </LedgerSection>

        <LedgerSection id="classifier" kicker={classifier.kicker} title={classifier.heading}>
          <ClassifierPanel />
        </LedgerSection>

        <LedgerSection id="projects" kicker="SELECTED PROJECTS" title="More ML & NLP work">
          {sideProjects.map((p) => (
            <SideProjectCard key={p.name} project={p} />
          ))}
        </LedgerSection>

        {/* Heading framing lock: the section holds both merged AND open rows, so
            the title must stay status-neutral — the per-row badges carry status. */}
        <LedgerSection id="open-source" kicker="OPEN SOURCE" title="Open source — upstream work">
          {openSource.map((row) => (
            <div key={row.badge} className="oss-row">
              <StatusBadge status={row.status} label={row.badge} />
              <p>
                {row.text}{" "}
                <a href={row.url}>
                  {row.linkLabel}
                  <span aria-hidden="true"> ↗</span>
                </a>
              </p>
            </div>
          ))}
        </LedgerSection>

        <LedgerSection id="research" kicker={research.kicker} title={research.heading}>
          <p>
            {flags.repoLinksEnabled ? (
              <a className="mono" href={research.repoUrl}>
                {research.repoName}
              </a>
            ) : (
              <span className="mono">{research.repoName}</span>
            )}
            {research.summaryAfterName}
          </p>
          <p>{research.role}</p>
          <p>{research.result}</p>
          <p className="chip-row">
            {research.tech.map((t) => (
              <span key={t} className="chip mono">
                {t}
              </span>
            ))}
          </p>
        </LedgerSection>

        <LedgerSection id="leadership" kicker="LEADERSHIP & COMMUNITY">
          {leadership.map((row) => (
            <LedgerRow key={row.title} {...row} />
          ))}
        </LedgerSection>

        <LedgerSection id="skills" kicker="SKILLS">
          <SkillChips />
        </LedgerSection>
      </main>
      <Footer />
    </>
  );
}
