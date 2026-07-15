// SINGLE SOURCE OF TRUTH for everything the site renders, consumed by all
// four page entries. Numbers come from public artifacts and the verified
// portfolio facts sheet; re-verify against FACTS.md before every deploy.
// Report-only DANN metrics are intentionally excluded because the committed
// artifacts do not reproduce them. scripts/check-facts.mjs enforces the
// mechanical parts (it runs as `prebuild`).
//
// Confidentiality: the AWS bullets below use only PUBLIC AWS product terms
// (EC2, VPC, canary, CloudWatch, CDK, SDK) exactly as they appear on Ivan's
// own resume — no internal system names, ever. A private pre-push gate
// (check-confidentiality.mjs, outside this repo) blocks the specifics.

export const person = {
  name: "Ivan Wang",
  github: "https://github.com/iwang-1",
  linkedin: "https://www.linkedin.com/in/ivanwang1",
  email: "ivanwang8989@gmail.com",
  // NOTE: the hosted PDF includes Ivan's phone number — his call whether that
  // stays on a public, indexed site. The site text itself never shows it.
  resumeUrl: "/Ivan-Wang-Resume.pdf",
};

// ---------------------------------------------------------------------------
// Home — hero, About.

export const hero = {
  kicker: "BACKEND · DISTRIBUTED SYSTEMS · ML/NLP",
  headline: "Ivan Wang",
  subhead:
    "Software engineer building correctness-focused backend and distributed systems. AWS SDE intern and UMD CS B.S./M.S. candidate, graduating May 2027.",
  thesis: "I build software the way I build keyboards: carefully, end to end.",
  availability: "Seeking new-grad SWE roles · available Summer 2027",
};

// About — ≤120 words, first person; max ONE keyboard/climbing metaphor on the
// whole site (the hero thesis is it — P3's closer stays literal).
export const about = {
  p1: "I'm a software engineer drawn to distributed systems, storage engines, and ML/NLP: the layer where correctness has to survive real failures, not just a demo.",
  p2Before: "I like software you can check: my ",
  p2LinkText: "projects",
  p2LinkHref: "/projects/",
  p2After: " ship with deterministic tests, reproducible measurements, and explicit limitations.",
  p3: "Away from a terminal I'm usually on a climbing wall. As Secretary of the UMD Climbing Club I organize 8 trips a semester and helped grow attendance 30%. The rest of my tinkering budget goes to building mechanical keyboards and custom PCs. Different materials, same habit: understand the whole system, then make it solid.",
};

export interface ProofPoint {
  value: string;
  label: string;
}

export const proofPoints: ProofPoint[] = [
  { value: "AWS", label: "SDE intern · Summer 2026" },
  { value: "1,400", label: "fault scenarios · zero violations" },
  { value: "2,640", label: "crash executions · zero acknowledged-write loss" },
  { value: "4", label: "pull requests merged upstream" },
];

export interface FeaturedSystem {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  proof: string;
  caveat?: string;
  repoHref: string;
  chips: string[];
  diagram: "raft" | "lsm";
  metrics: { value: string; label: string }[];
}

export const featuredSystems: FeaturedSystem[] = [
  {
    id: "parallax-kv",
    eyebrow: "DISTRIBUTED SYSTEMS · GO",
    title: "parallax-kv",
    summary:
      "A three-node Raft key-value store built from scratch with PreVote, ReadIndex, persist-before-send ordering, snapshots, a durable WAL, and a gRPC runtime.",
    proof:
      "A deterministic 200-seed soak drove 1,400 partition, crash, loss, delay, and snapshot scenarios through 2,914,245 client operations with zero safety or linearizability violations.",
    caveat:
      "The harness found and fixed a checker-precision bug; it found zero consensus bugs. Production snapshot scheduling and chunked streaming remain future work.",
    repoHref: "https://github.com/iwang-1/parallax-kv",
    chips: ["Go", "Raft", "gRPC", "Porcupine", "deterministic simulation"],
    diagram: "raft",
    metrics: [
      { value: "272 w/s", label: "durable writes · c=8" },
      { value: "41 ms", label: "p99 latency · c=8" },
      { value: "2,914,245", label: "client operations checked" },
    ],
  },
  {
    id: "accretion-db",
    eyebrow: "STORAGE ENGINE · RUST",
    title: "accretion-db",
    summary:
      "An embeddable LSM-tree storage engine with a CRC-framed WAL, group commit, memtables, block-based SSTables, bloom filters, and size-tiered compaction — with unsafe Rust forbidden.",
    proof:
      "Its fault-injecting storage layer simulated 330 crash points across 2,640 executions plus 160 property-based schedules, with zero acknowledged-write loss.",
    caveat:
      "The ~29x group-commit result is WAL-bound. Synchronous compaction is intentionally disclosed and limits full-engine throughput.",
    repoHref: "https://github.com/iwang-1/accretion-db",
    chips: ["Rust", "LSM tree", "group commit", "crash consistency", "proptest"],
    diagram: "lsm",
    metrics: [
      { value: "~29x", label: "WAL-bound group commit" },
      { value: "878 µs", label: "fdatasync p50" },
      { value: "2,640", label: "crash executions" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Education (first-class Home section, #education).

export interface Education {
  school: string;
  degree: string;
  dates: string;
  detailLines: string[];
  proofChip?: string;
  coursework: string[];
}

export const education: Education[] = [
  {
    school: "University of Maryland, College Park",
    degree: "B.S./M.S. in Computer Science — Departmental Honors (research track)",
    dates: "Aug 2023 – May 2027",
    detailLines: [
      "CS Departmental Honors — faculty-mentored research track",
      "Minors in Data Science and Philosophy",
    ],
    proofChip: "GPA 3.6/4.0",
    coursework: [
      "Algorithms",
      "Data Structures",
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Database Design",
      "Operating Systems",
      "Computer Networks",
      "Distributed Systems",
      "Computer Vision",
    ],
  },
];

// ---------------------------------------------------------------------------
// Skills — focused on tools backed by experience or public work.

export const skills: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["Python", "Java", "Go", "Rust", "TypeScript/JavaScript", "Scala", "SQL", "Bash"],
  },
  {
    label: "Backend & systems",
    items: [
      "Raft",
      "gRPC/Protobuf",
      "LSM trees",
      "Flask/FastAPI",
      "Node.js",
      "PostgreSQL/SQLite",
      "JUnit 5",
    ],
  },
  {
    label: "ML & research",
    items: [
      "PyTorch",
      "HuggingFace",
      "scikit-learn",
      "LangChain",
      "Qiskit",
      "DisCoPy",
      "pytket",
      "JAX",
    ],
  },
  {
    label: "Infrastructure",
    items: [
      "AWS (EC2/VPC, SDK, CDK, CloudWatch)",
      "Docker",
      "Linux",
      "GitHub Actions",
      "CI/CD",
      "Jenkins",
      "Playwright",
    ],
  },
];

// ---------------------------------------------------------------------------
// Home — Selected Work teasers (text-only).

export interface Teaser {
  title: string;
  body: string;
  href: string;
  linkText: string;
  proofChips?: string[];
}

// Home teasers are PROJECTS ONLY — the AWS internship lives in the hero
// subhead and on /experience/, never framed as a project here.
export const teasers: Teaser[] = [
  {
    title: "Domain adaptation research",
    body: "A team research artifact exploring DistilBERT and unsupervised domain adaptation across Yelp, Amazon, Twitter, and Reddit.",
    href: "/projects/#dann",
    linkText: "See the project",
    proofChips: ["PyTorch", "public research artifact"],
  },
  {
    title: "This portfolio",
    body: "A multi-page React and TypeScript site with static prerendering, no-JS fallbacks, factual guardrails, and Playwright verification.",
    href: "/projects/#this-site",
    linkText: "See the build details",
    proofChips: ["React", "Playwright"],
  },
  {
    title: "Open source",
    body: "Four pull requests merged into a UMD Observatory data archive, plus an open upstream PR under review at Quantinuum.",
    href: "/projects/#open-source",
    linkText: "See the contribution evidence",
  },
];

// ---------------------------------------------------------------------------
// Experience — all 7 roles. Bullets lightly copyedited from the sheet only;
// every number/tool/claim verbatim. AWS phrasing stays date-anchored
// ("Summer 2026"), never "currently".

export interface Role {
  role: string;
  org: string;
  dates: string;
  location: string;
  bullets: string[];
  chips?: string[]; // ProofChips (exact verifiable metrics)
  tags?: string[]; // flat tags (Community & Teaching, teal)
}

export const engineeringRoles: Role[] = [
  {
    role: "Software Development Engineer Intern",
    org: "Amazon Web Services (AWS)",
    dates: "May 2026 – Present",
    location: "Herndon, VA",
    bullets: [
      "Built an autonomous Claude Code agent with custom skills that migrated seven production EC2/VPC canaries from Scala to Java and JUnit 5, reducing per-test migration from about one week to about one day and validating each with live integration runs.",
      "Extended an existing canary framework with AWS SDK v2, CDK, and CloudWatch, adding LIFO resource cleanup, a VPC test suite spanning eight AWS services in us-east-1, and an authentication fix that unblocked CI.",
    ],
    chips: ["7 agent-migrated tests", "~1 week → ~1 day/test", "8 AWS services"],
  },
  {
    role: "Software Engineer",
    org: "University of Maryland Observatory",
    dates: "May – Sep 2025",
    location: "College Park, MD (Remote)",
    bullets: [
      "Shipped a web app serving 50,000+ records with REST APIs and real-time search/filter for researchers.",
      "Built a Python ETL pipeline for legacy CCD data with ingestion, normalization, schema validation, deduplication, and scheduled updates.",
      "Cut pipeline runtime by 75%, optimized SQL and API query paths, and landed four pull requests in the upstream open-source archive.",
    ],
    chips: ["50,000+ records", "−75% pipeline runtime", "4 upstream PRs"],
  },
  {
    role: "Quantum Machine Learning Researcher",
    org: "University of Maryland",
    dates: "Aug 2023 – Jan 2025",
    location: "College Park, MD",
    bullets: [
      "Prepared datasets and integrated experiment workflows for a four-person quantum NLP research project using DisCoPy, Qiskit, pytket, and JAX.",
      "Co-built and open-sourced the research artifact, with reproducible simulator workflows and documented comparison methodology.",
      "Evaluated enhanced optimizers against a default-gain SPSA baseline in exact noiseless simulation.",
    ],
    chips: ["4-person team", "Qiskit/DisCoPy/pytket", "open-source research"],
  },
  {
    role: "Software Engineer Intern",
    org: "Washington Software Inc.",
    dates: "Mar 2022 – Aug 2023",
    location: "Gaithersburg, MD",
    bullets: [
      "Built a Python automation pipeline using Selenium and BeautifulSoup to extract data and generate reports/presentations from templates.",
      "Created reusable automation across three product teams, saving about 15 engineering hours per week.",
      "Improved reliability with structured logging, retries, error handling, and tests; supported Jenkins CI/CD for consistent releases.",
    ],
    chips: ["~15 hrs/week saved", "3 product teams"],
  },
];

export const communityRoles: Role[] = [
  {
    role: "Vice President",
    org: "Kids For Code",
    dates: "Dec 2021 – May 2023",
    location: "Remote",
    bullets: [
      "Led curriculum and instructor operations for a Python/JavaScript program serving 3,000+ students.",
      "Delivered 400+ lessons and standardized materials to keep instruction consistent across classes.",
      "Trained and coordinated 10+ instructors and improved program operations to support 25% enrollment growth.",
    ],
    tags: ["3,000+ students", "400+ lessons"],
  },
  {
    role: "Technical Program Manager",
    org: "CodeDay",
    dates: "Nov 2019 – Dec 2022",
    location: "Washington DC–Baltimore Area",
    bullets: [
      "Ran regional hackathon programs end-to-end, coordinating planning, logistics, and stakeholder communication for 500+ participants.",
      "Drove outreach to 200+ schools and built partnerships and sponsorships to support event delivery.",
      "Managed budgets, runbooks, and risk/last-minute changes to keep events reliable and repeatable.",
    ],
    tags: ["500+ participants", "200+ schools"],
  },
  {
    role: "Software Programming Instructor",
    org: "Panda Programmer",
    dates: "Mar – Nov 2022",
    location: "Gaithersburg, MD",
    bullets: [
      "Taught Python, JavaScript, and Scratch to students ages 6–12 through hands-on projects and structured practice.",
      "Built lesson plans and adapted pacing/explanations to match each student's level while reinforcing core CS fundamentals.",
      "Communicated progress clearly to parents and program staff and helped students build confidence through debugging.",
    ],
    tags: ["Python", "JavaScript", "Scratch"],
  },
];

// ---------------------------------------------------------------------------
// Projects.

export interface Project {
  id?: string;
  title: string;
  date?: string;
  description: string[];
  chips?: string[];
  repoHref?: string;
  license?: string;
  noRepo?: boolean;
}

export const projects: Project[] = [
  {
    id: "dann",
    title: "Unsupervised Domain Adaptation for Sentiment",
    repoHref: "https://github.com/iwang-1/cross-domain-sentiment-dann",
    license: "MIT",
    description: [
      "DistilBERT and a gradient-reversal DANN across Yelp, Amazon, Twitter, and Reddit. Labeled source-domain examples train the sentiment head while unlabeled target-domain text trains the domain head.",
      "The committed CSV is a smoke-scale artifact, so the project documents its pipeline and evidence boundary instead of promoting report-only accuracy figures.",
    ],
    chips: ["PyTorch", "DistilBERT", "gradient reversal"],
  },
  {
    id: "fire-qnlp",
    title: "Quantum NLP research (FIRE)",
    repoHref: "https://github.com/iwang-1/FIRE-QML-WINNERS-QNLP",
    license: "GPL-3.0",
    description: [
      "Four-person research project, co-built and open-sourced. My role was dataset preparation, experiment integration, and project documentation.",
      "The repository compares optimizer and ansatz variants in exact noiseless simulation with documented methodology.",
    ],
    chips: ["Python", "Jupyter", "DisCoPy", "Qiskit", "pytket"],
  },
  {
    id: "this-site",
    title: "This site",
    repoHref: "https://github.com/iwang-1/iwang-1.github.io",
    license: "MIT",
    description: [
      "The page you're reading: a multi-page React + TypeScript + Vite site deployed to GitHub Pages, with static prerendering, a no-JS fallback, factual guardrails, responsive screenshots, and Playwright interaction checks.",
    ],
    chips: ["React + TypeScript + Vite", "fact-gate in CI", "Playwright-verified", "no trackers"],
  },
];

// ---------------------------------------------------------------------------
// Open source — two SEPARATE cards, structurally guaranteeing the wording
// locks. Card A carries the site's ONLY contributed-to-an-open-source-project
// claim.

export interface OpenSourceCard {
  title: string;
  body: string;
  href: string;
  linkText: string;
}

export const ossCardA: OpenSourceCard = {
  title: "Merged upstream",
  body: "Contributed to an open source project: 4 merged pull requests to warnerem/CCD-data-archive — a Python/Flask/SQLite archive of UMD Observatory CCD astronomy data.",
  href: "https://github.com/warnerem/CCD-data-archive/pulls?q=is%3Apr+author%3Aiwang-1+is%3Amerged",
  linkText: "View the pull requests on GitHub",
};

// Framing lock (and spacing, deliberately verbose): the card below is an OPEN
// pull request that is still under review upstream. Nothing in it — title,
// body, or link label — may ever describe it with the past-tense m-word that
// Card A uses, and check-facts.mjs enforces a 200-character quarantine radius
// between that word and this project's name in every scanned file AND in the
// rendered page text. This comment doubles as the required separation
// distance inside this file; the two cards render as separate cards with the
// same guarantee. Keep it that way.
export const ossCardB: OpenSourceCard = {
  title: "Under review upstream",
  body: "Open pull request under review: Quantinuum/lambeq #259 — LAMBEQ_MODELS_URL override.",
  href: "https://github.com/Quantinuum/lambeq/pull/259",
  linkText: "View the pull request on GitHub",
};

// ---------------------------------------------------------------------------
// Shared chrome.

export const footer = {
  colophon: "Built with React + TypeScript + Vite · Deployed on GitHub Pages · No trackers",
  copyright: "© 2026 Ivan Wang",
};

export const siteUrl = "https://iwang-1.github.io";
