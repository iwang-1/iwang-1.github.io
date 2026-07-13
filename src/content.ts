// SINGLE SOURCE OF TRUTH for everything the site renders.
// AS OF 2026-07-13. Numbers come from Ivan's resume / LinkedIn / the verified
// portfolio facts sheet. Re-verify against FACTS.md before every deploy.
// NEVER: sum the star-catalog per-repo test counts, round 79.5→80 or
// 98.56→99, or drop a '~'. scripts/check-facts.mjs enforces the mechanical
// parts. Confidentiality: the AWS bullets below use only PUBLIC AWS product
// terms (EC2, VPC, canary, CloudWatch, CDK, SDK) exactly as they appear on
// Ivan's own resume — no internal system/codenames, ever. A private pre-push
// gate (check-confidentiality.mjs, outside this repo) blocks the codenames.

export const flags = {
  /** True while the project repos are public (verified 200 on 2026-07-13). If a
   *  repo is taken private again, flip false: every github.com/iwang-1/<repo>
   *  link renders as plain text — zero dead links. */
  repoLinksEnabled: true,
  /** True while the star-catalog-web Pages deploy is live (verified 200 on
   *  2026-07-13). */
  showLiveDemo: true,
};

export const person = {
  name: "Ivan Wang",
  subhead: "Software engineer — backend systems, ML/NLP, and full-stack.",
  identityLines: [
    "CS B.S./M.S. (Honors) · University of Maryland, College Park · M.S. expected May 2027",
    "SDE Intern @ Amazon Web Services, Summer 2026 · seeking new-grad SWE roles (available ~Summer 2027)",
  ],
  github: "https://github.com/iwang-1",
  linkedin: "https://www.linkedin.com/in/ivanwang1",
  email: "ivanwang8989@gmail.com",
  // NOTE: the hosted PDF includes Ivan's phone number — his call whether that
  // stays on a public, indexed site. Swap the file in public/ to change it.
  resumeUrl: "/Ivan-Wang-Resume.pdf",
};

// ---------------------------------------------------------------------------
// Experience — bullets transcribed from Ivan's resume (public AWS terms only).

export interface Role {
  title: string;
  org: string;
  location: string;
  date: string;
  bullets: string[];
}

export const experience: Role[] = [
  {
    title: "Software Development Engineer Intern",
    org: "Amazon Web Services (AWS)",
    location: "Herndon, VA",
    date: "May – Aug 2026",
    bullets: [
      "Architected an agentic AI system with custom skill packages to autonomously migrate 8+ production tests from Scala to JUnit5, boosting migration throughput 5× for AWS EC2 VPC control-plane APIs.",
      "Designed and shipped canary infrastructure on AWS SDK v2, CDK, and CloudWatch in us-east-1, cutting test runtime 40% and flaky failures 60% via CI/CD pipelines and Sev2 alarms for services used by 1M+ customers.",
    ],
  },
  {
    title: "Full-Stack Software Engineer Intern",
    org: "University of Maryland",
    location: "College Park, MD · Remote",
    date: "May – Sep 2025",
    bullets: [
      "Shipped a web app serving 50,000+ records with REST APIs and real-time search/filter for researchers.",
      "Built a Python ETL pipeline over 10+ years of legacy data (ingestion, normalization, schema validation, deduplication), kept current via scheduled cron refreshes.",
      "Cut pipeline runtime 75% and sped up queries by optimizing SQL indexing and API query paths, enabling 15+ researchers to query a live archive.",
    ],
  },
  {
    title: "Machine Learning Engineer Intern",
    org: "University of Maryland",
    location: "College Park, MD",
    date: "Aug 2023 – Jan 2025",
    bullets: [
      "Improved NLP classification accuracy 30% by iterating PyTorch model architectures and tuning hyperparameters with controlled experiments.",
      "Reduced training time 25% by tuning optimizers (SPSA, ADAM, SGD), learning-rate schedules, and batch sizing for faster convergence.",
      "Standardized training and evaluation with clean preprocessing and consistent precision/recall/F1 tracking to compare model variants reliably.",
    ],
  },
  {
    title: "Software Engineer Intern",
    org: "Washington Software Inc.",
    location: "Gaithersburg, MD",
    date: "Mar 2022 – Aug 2023",
    bullets: [
      "Built a Python automation pipeline (Selenium, BeautifulSoup) to extract data and generate reports and presentations from templates.",
      "Cut manual work 40% and saved 15+ engineering hours/week across teams through reusable, configurable automation.",
      "Improved reliability with structured logging, retries and error handling, and tests; supported Jenkins CI/CD for consistent releases.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Education.

export interface EducationItem {
  school: string;
  degree: string;
  date: string;
  detail?: string;
  coursework?: string;
}

export const education: EducationItem[] = [
  {
    school: "University of Maryland, College Park",
    degree: "B.S./M.S. in Computer Science (Honors Program)",
    date: "Aug 2023 – May 2027",
    detail: "Minors in Data Science and Philosophy · GPA 3.6/4.0",
    coursework:
      "Coursework: Algorithms, Data Structures, Machine Learning, Deep Learning, NLP, Database Design, Operating Systems, Computer Networks, Distributed Systems, Computer Vision.",
  },
  {
    school: "The University of Hong Kong",
    degree: "Study Abroad (Exchange), Computer Science",
    date: "Aug – Dec 2025",
    coursework: "Coursework: Numerical Analysis, Cryptography.",
  },
];

// ---------------------------------------------------------------------------
// Featured portfolio — the star-catalog system.

export const starSystem = {
  kicker: "FEATURED — FOUR REPOS, ONE SYSTEM",
  heading: "The Star Catalog System",
  story:
    "Telescope observation CSVs go in one end; a validated catalog, a typed API, and an interactive sky map come out the other — and the map's own star snapshot trains the fourth repo, the ML classifier below.",
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

// ---------------------------------------------------------------------------
// Selected projects — coursework/personal ML & NLP work (from the resume).

export interface SideProject {
  name: string;
  date: string;
  stack: string;
  bullets: string[];
}

export const sideProjects: SideProject[] = [
  {
    name: "Cross-Domain NLP Sentiment Classifier",
    date: "May 2026",
    stack: "PyTorch · DistilBERT · HuggingFace",
    bullets: [
      "Designed a Leave-One-Domain-Out (LODO) evaluation framework across 64,000 labeled samples (Yelp, Amazon, Twitter, Reddit) to benchmark cross-domain generalization over 16 experimental conditions.",
      "Implemented a Domain-Adversarial Neural Network (DANN) on DistilBERT with gradient reversal, boosting cross-domain accuracy 26% over the fine-tuning baseline (74.2% on held-out domains).",
    ],
  },
  {
    name: "RAG-Based Research Assistant",
    date: "Jan 2025",
    stack: "LangChain · FAISS · OpenAI API · Weights & Biases",
    bullets: [
      "Built a retrieval-augmented chatbot (LangChain + FAISS) over 25+ research papers; tuned chunk size and top-k retrieval with OpenAI embeddings.",
      "Deployed a Streamlit app with Weights & Biases experiment tracking and hyperparameter tuning, reaching 95% accuracy on policy-analysis QA.",
    ],
  },
  {
    name: "ML-Driven Professor Rating Predictor",
    date: "Apr 2025",
    stack: "scikit-learn · VADER · Pandas",
    bullets: [
      "Built an end-to-end ML pipeline with a multithreaded scraper over 13,000+ professor profiles, using VADER sentiment for feature extraction from unstructured reviews.",
      "Trained and cross-validated regression models across multiple families in scikit-learn, reaching R² 0.79 for rating prediction across departments.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Open source.

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
  text: "4 merged pull requests to warnerem/CCD-data-archive — a Python/Flask/SQLite archive of UMD Observatory CCD astronomy data. Working with this data inspired the star-catalog system above.",
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
  repoName: "FIRE-QML-WINNERS-QNLP",
  // Rendered immediately after repoName — kept as a separate field so App.tsx
  // never has to slice the repo name off the front of a sentence.
  summaryAfterName:
    " — a 3-person project in UMD's FIRE (First-year Innovation & Research Experience) research program on quantum natural language processing that the team co-built and open-sourced (GPL-3.0).",
  role: "My role: dataset preparation and integration, and project documentation.",
  result:
    "Enhanced optimizers beat an out-of-the-box standard-SPSA baseline by roughly 30 percentage points of train/test accuracy (exact noiseless simulation).",
  tech: ["Python", "Jupyter", "DisCoPy", "Qiskit", "pytket"],
  repoUrl: "https://github.com/iwang-1/FIRE-QML-WINNERS-QNLP",
};

// ---------------------------------------------------------------------------
// Leadership & community.

export interface LeadershipItem {
  title: string;
  detail: string;
  date: string;
}

export const leadership: LeadershipItem[] = [
  {
    title: "Vice President — Kids For Code",
    detail:
      "Led curriculum and instructor operations for a Python/JavaScript program serving 3,000+ students; delivered 400+ lessons, trained 10+ instructors, supported 25% enrollment growth.",
    date: "2021 – 2023",
  },
  {
    title: "Technical Program Manager — CodeDay",
    detail:
      "Ran regional hackathon programs end-to-end for 500+ participants; drove outreach to 200+ schools and built sponsorships (including Vercel and Brave).",
    date: "2019 – 2022",
  },
  {
    title: "Software Programming Instructor — Panda Programmer",
    detail:
      "Taught Python, JavaScript, and Scratch to students ages 6–12 through hands-on projects and structured practice.",
    date: "2022",
  },
  {
    title: "Secretary — UMD Climbing Club",
    detail: "Organized 8 trips per semester and grew attendance 30%.",
    date: "UMD",
  },
];

// ---------------------------------------------------------------------------
// Skills. Labels must match usedAbove entries exactly (SkillChips dots).

export const skills = {
  languages: [
    "Python (primary)",
    "Java",
    "Scala",
    "C/C++",
    "JavaScript/TypeScript",
    "Go",
    "SQL",
    "Rust",
    "OCaml",
    "R",
    "Bash",
  ],
  frameworks: [
    "FastAPI",
    "Flask",
    "React",
    "Node.js",
    "PyTorch",
    "scikit-learn",
    "LangChain",
    "HuggingFace",
    "JUnit5",
  ],
  mlnlp: [
    "Transformers / DistilBERT",
    "DANN",
    "RAG (FAISS)",
    "VADER",
    "SPSA / ADAM",
  ],
  tools: [
    "Git",
    "Docker",
    "Linux",
    "AWS (SDK v2, CDK, CloudWatch)",
    "SQLite / PostgreSQL",
    "GitHub Actions CI",
    "Jenkins",
    "pytest",
  ],
  // A dot marks a skill demonstrated in the experience/projects shown above.
  usedAbove: [
    "Python (primary)",
    "JavaScript/TypeScript",
    "Scala",
    "FastAPI",
    "Flask",
    "React",
    "PyTorch",
    "scikit-learn",
    "LangChain",
    "HuggingFace",
    "JUnit5",
    "Transformers / DistilBERT",
    "DANN",
    "RAG (FAISS)",
    "VADER",
    "SPSA / ADAM",
    "Git",
    "Docker",
    "AWS (SDK v2, CDK, CloudWatch)",
    "SQLite / PostgreSQL",
    "GitHub Actions CI",
    "Jenkins",
    "pytest",
  ],
};

export const contact = {
  heading: "Contact",
  cta: "Hiring new-grad software engineers for ~Summer 2027? Email me or reach out on LinkedIn.",
  colophon:
    "Built with React + TypeScript + Vite. System fonts, no trackers. Star data (masthead star field and sky map): HYG database (Astronomy Nexus), CC BY-SA.",
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
