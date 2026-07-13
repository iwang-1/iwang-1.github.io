// AS OF 2026-07-13 — every number below is from the verified facts sheet.
// Re-verify against FACTS.md before every deploy. NEVER: sum test counts,
// round 79.5→80 or 98.56→99, drop a '~', or elaborate on the AWS internship
// beyond the single constant below. scripts/check-facts.mjs enforces the
// mechanical parts of this on every build.

export const flags = {
  /** Flip true after the project repos are pushed public. Until then every
   *  github.com/iwang-1/<repo> link renders as plain text — zero dead links. */
  repoLinksEnabled: false,
  /** Flip true after the star-catalog-web Pages deploy is live. */
  showLiveDemo: false,
};

export const person = {
  name: "Ivan Wang",
  subhead: "Software engineer — backend systems, ML/NLP, and research software.",
  identityLine:
    "CS B.S./M.S. · University of Maryland, College Park · M.S. May 2027 — SDE Intern @ Amazon Web Services, Summer 2026 — seeking new-grad SWE roles (available ~Summer 2027)",
  github: "https://github.com/iwang-1",
  linkedin: "https://www.linkedin.com/in/ivanwang1",
  email: "", // TODO: fill when available; email UI renders only when non-empty
  resumeUrl: "", // TODO: optional — link to a resume PDF; renders only when non-empty
};

// HARD CEILING (confidentiality): this exact string, nowhere elaborated.
export const AWS_DESCRIPTION = "backend systems and cloud infrastructure";

export interface LedgerEntry {
  title: string;
  detail: string;
  date: string;
}

// Additional LinkedIn experience entries paste in here later.
export const experience: LedgerEntry[] = [
  {
    title: "Software Development Engineer Intern — Amazon Web Services",
    detail: AWS_DESCRIPTION,
    date: "Summer 2026",
  },
];

export const education: LedgerEntry[] = [
  {
    title: "B.S./M.S., Computer Science — University of Maryland, College Park",
    detail: "M.S. expected May 2027",
    date: "May 2027",
  },
];

export const starSystem = {
  kicker: "FEATURED — FOUR REPOS, ONE SYSTEM",
  heading: "The Star Catalog System",
  story:
    "Telescope observation CSVs go in one end; a validated catalog, a typed API, and an interactive sky map come out the other — and the map's own star snapshot trains an ML classifier.",
};

export interface Chip {
  label: string;
}

export interface Project {
  name: string;
  repoUrl: string;
  oneLiner: string;
  details: string[];
  chips: Chip[];
}

export const projects: Project[] = [
  {
    name: "star-catalog-ingest",
    repoUrl: "https://github.com/iwang-1/star-catalog-ingest",
    oneLiner:
      "Python ETL CLI that turns messy telescope observation CSVs into a validated, deduplicated SQLite catalog.",
    details: [
      "Streaming validation with stable reject codes; idempotent hash-gated loads.",
    ],
    chips: [
      { label: "101 tests" },
      { label: "~95% cov" },
      { label: "mypy --strict" },
      { label: "ruff" },
      { label: "CI py3.11–3.14" },
      { label: "v0.3.2" },
    ],
  },
  {
    name: "star-catalog-api",
    repoUrl: "https://github.com/iwang-1/star-catalog-api",
    oneLiner:
      "Typed FastAPI service over that catalog: name search, magnitude and catalog-designation-prefix filters, cone search, pagination, stats.",
    details: ["Cone search handles the RA 0/360 seam."],
    chips: [
      { label: "66 tests" },
      { label: "~97% cov" },
      { label: "Dockerized — built + smoke-tested in CI" },
      { label: "v0.2.3" },
    ],
  },
  {
    name: "star-catalog-web",
    repoUrl: "https://github.com/iwang-1/star-catalog-web",
    oneLiner:
      "Interactive sky map + searchable catalog of 8,920 naked-eye HYG v4.3 stars.",
    details: [
      "Magnitude-scaled, color-indexed star markers; linked map/table selection; live search.",
    ],
    chips: [
      { label: "React + TS + Vite" },
      { label: "Playwright-gated deploy" },
      { label: "v0.1.0" },
    ],
  },
];

export const screenshot = {
  src: "/star-catalog-web.png",
  width: 1200,
  height: 820,
  alt: "star-catalog-web — interactive sky map and searchable catalog table",
  caption:
    "star-catalog-web — the system's front end: 8,920 naked-eye HYG v4.3 stars with linked map/table selection.",
};

export const liveDemoUrl = "https://iwang-1.github.io/star-catalog-web/";

export const classifier = {
  kicker: "MACHINE LEARNING, HONESTLY",
  heading: "star-spectral-classifier — ML that shows its work",
  keyLine:
    "Built to beat the physics baseline honestly — and to disclose where it fails.",
  intro:
    "scikit-learn HistGradientBoosting predicts OBAFGKM spectral class from B–V color, trained on the same 8,920-star HYG snapshot the sky map above renders (sha256-pinned byte-identical copy).",
  modelRow: "model · 79.5% accuracy / 0.665 macro-F1 (once-touched hold-out)",
  baselineRow: "zero-parameter physics baseline · 72.3%",
  oClass:
    "O-class recall is 0 (support 10) — disclosed, not hidden; 92.6% of errors are adjacent-class.",
  chips: ["52 tests", "98.56% cov", "mypy --strict", "CI py3.11–3.13", "v0.1.0"],
  repoUrl: "https://github.com/iwang-1/star-spectral-classifier",
};

export interface OpenSourceRow {
  status: "merged" | "open";
  badge: string;
  text: string;
  url: string;
  linkLabel: string;
}

const ccdRow: OpenSourceRow = {
  status: "merged",
  badge: "MERGED ×4",
  text: "Contributed to an open source project: 4 merged pull requests to warnerem/CCD-data-archive — a Python/Flask/SQLite archive of UMD Observatory CCD astronomy data. Working with this data inspired the star-catalog system above.",
  url: "https://github.com/warnerem/CCD-data-archive/pulls?q=is%3Apr+author%3Aiwang-1+is%3Amerged",
  linkLabel: "See the pull requests",
};

// Framing lock (and spacing, deliberately verbose): the row below is an OPEN
// pull request that is still under review upstream. Nothing in it — badge,
// text, or link label — may ever describe it with the past-tense m-word that
// the row above uses, and check-facts.mjs enforces a 200-character quarantine
// radius between that word and this project's name. This comment doubles as
// the required separation distance inside this file. Keep it that way.
const lambeqRow: OpenSourceRow = {
  status: "open",
  badge: "OPEN — UNDER REVIEW",
  text: "1 open pull request to Quantinuum/lambeq (#259): allow overriding the model download URL via LAMBEQ_MODELS_URL.",
  url: "https://github.com/Quantinuum/lambeq/pull/259",
  linkLabel: "See the pull request",
};

export const openSource: OpenSourceRow[] = [ccdRow, lambeqRow];

export const research = {
  kicker: "RESEARCH",
  heading: "Quantum NLP — UMD FIRE",
  summary:
    "FIRE-QML-WINNERS-QNLP — a 3-person UMD FIRE research project on quantum natural language processing that the team co-built and open-sourced (GPL-3.0).",
  role: "My role: dataset preparation and integration, and project documentation.",
  result:
    "Enhanced optimizers beat an out-of-the-box standard-SPSA baseline by roughly 30 percentage points of train/test accuracy (exact noiseless simulation).",
  tech: ["Python", "Jupyter", "DisCoPy", "Qiskit", "pytket"],
  repoName: "FIRE-QML-WINNERS-QNLP",
  repoUrl: "https://github.com/iwang-1/FIRE-QML-WINNERS-QNLP",
};

export const skills = {
  languages: ["Python (primary)", "Java", "C/C++", "SQL", "JavaScript/TypeScript", "Bash"],
  frameworks: ["FastAPI", "Flask", "React", "PyTorch", "scikit-learn"],
  tools: ["Git", "Docker", "Linux", "SQLite/PostgreSQL", "AWS", "GitHub Actions CI", "pytest"],
  usedAbove: [
    "Python (primary)",
    "JavaScript/TypeScript",
    "FastAPI",
    "React",
    "scikit-learn",
    "Docker",
    "GitHub Actions CI",
    "pytest",
    "Git",
    "SQLite/PostgreSQL",
  ],
};

export const contact = {
  heading: "Contact",
  cta: "Hiring new-grad software engineers for ~Summer 2027? Let's talk.",
  colophon:
    "Built with React + TypeScript + Vite. System fonts, no trackers. Star data in the demo: HYG database (Astronomy Nexus), CC BY-SA.",
  siteSourceUrl: "https://github.com/iwang-1/iwang-1.github.io",
};

export const starFieldCaption =
  "These stars are real — the brightest of the 8,920 HYG stars from my sky map.";

/** Pipeline Rail — system diagram = nav = brand. */
export interface RailNode {
  label: string;
  metric?: string;
  anchor?: string;
}

export const rail: { nodes: RailNode[]; branch: RailNode } = {
  nodes: [
    { label: "observation CSVs" },
    { label: "star-catalog-ingest", metric: "101 tests", anchor: "#card-star-catalog-ingest" },
    { label: "catalog.db (SQLite)" },
    { label: "star-catalog-api", metric: "66 tests", anchor: "#card-star-catalog-api" },
    { label: "star-catalog-web", metric: "8,920 stars", anchor: "#card-star-catalog-web" },
  ],
  branch: {
    label: "stars.json → star-spectral-classifier",
    metric: "79.5% acc",
    anchor: "#classifier",
  },
};
