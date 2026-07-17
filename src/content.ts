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
};

// ---------------------------------------------------------------------------
// Home — hero, About.

export const hero = {
  kicker: "SOFTWARE ENGINEER · BACKEND / DISTRIBUTED SYSTEMS",
  headline: "Ivan Wang",
  subhead:
    "AWS SDE intern and UMD CS B.S./M.S. candidate building backend and distributed systems where correctness, reliability, and performance matter.",
  thesis: "I build software the way I build keyboards: carefully, end to end.",
  availability: "Seeking Summer 2027 new-grad software engineering roles",
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

export interface FeaturedSystem {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  proof: string;
  caveat?: string;
  repoHref: string;
  chips: string[];
  diagram: "raft" | "lsm" | "ann";
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
      "A deterministic stress harness exercised partitions, crashes, message loss, delays, and snapshots across 2.9 million client operations with zero safety or linearizability violations.",
    caveat:
      "The harness also exposed and fixed a checker-precision bug. Production snapshot scheduling and chunked streaming remain future work.",
    repoHref: "https://github.com/iwang-1/parallax-kv",
    chips: ["Go", "Raft", "gRPC", "Porcupine", "deterministic simulation"],
    diagram: "raft",
    metrics: [
      { value: "272 w/s", label: "durable writes · c=8" },
      { value: "41 ms", label: "p99 latency · c=8" },
      { value: "2.9M", label: "client operations checked" },
    ],
  },
  {
    id: "accretion-db",
    eyebrow: "STORAGE ENGINE · RUST",
    title: "accretion-db",
    summary:
      "An embeddable LSM-tree storage engine with a CRC-framed WAL, group commit, memtables, block-based SSTables, bloom filters, and size-tiered compaction — with unsafe Rust forbidden.",
    proof:
      "Fault-injection and property-based tests verified that acknowledged writes survive simulated crashes.",
    caveat:
      "The ~29x group-commit result is WAL-bound. Synchronous compaction is intentionally disclosed and limits full-engine throughput.",
    repoHref: "https://github.com/iwang-1/accretion-db",
    chips: ["Rust", "LSM tree", "group commit", "crash consistency", "proptest"],
    diagram: "lsm",
    metrics: [
      { value: "~29x", label: "WAL-bound group commit" },
      { value: "878 µs", label: "fdatasync p50" },
      { value: "0", label: "unsafe Rust blocks" },
    ],
  },
  {
    id: "lodestone",
    eyebrow: "VECTOR SEARCH · RUST",
    title: "lodestone",
    summary:
      "A vector search engine built from scratch in Rust for embeddings and RAG retrieval: an HNSW proximity graph and an IVF-PQ compressed index over hand-written AVX-512 distance kernels with runtime feature dispatch.",
    proof:
      "On 50,000 128-dimensional vectors on a single core, HNSW reached 0.976 recall@10 at about 31,800 queries per second — a 30–48x speedup over the exact brute-force oracle at 90%+ recall — measured on a recall-vs-throughput curve, not a single point.",
    caveat:
      "IVF-PQ trades accuracy for footprint: 0.975 recall@10 at 16x memory compression via product quantization. The benchmark is single-machine and single-core; distributed sharding is future work.",
    repoHref: "https://github.com/iwang-1/lodestone",
    chips: ["Rust", "HNSW", "IVF-PQ", "AVX-512 SIMD", "RAG retrieval"],
    diagram: "ann",
    metrics: [
      { value: "0.976", label: "HNSW recall@10" },
      { value: "~31.8K", label: "queries/sec · 1 core" },
      { value: "16x", label: "IVF-PQ compression" },
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
      "On the faculty-mentored research track; minors in Data Science and Philosophy",
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
    title: "Quantum NLP research",
    body: "A four-person open-source research artifact comparing optimizer and ansatz variants in exact noiseless simulation.",
    href: "/projects/#fire-qnlp",
    linkText: "See the project",
    proofChips: ["Qiskit", "DisCoPy", "pytket"],
  },
  {
    title: "This portfolio",
    body: "A multi-page React and TypeScript site with static prerendering, no-JS fallbacks, factual guardrails, and Playwright verification.",
    href: "/projects/#this-site",
    linkText: "See the build details",
    proofChips: ["React", "Playwright"],
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
  logo: RoleLogo;
  chips?: string[]; // ProofChips (exact verifiable metrics)
  tags?: string[]; // flat tags (Community & Teaching, teal)
  proofLink?: { label: string; href: string }; // optional "see the code" link
}

// Each role shows its employer's real logo, served from /logos (bundled in
// public/, never hotlinked from a CDN). Recognizable brands use the actual
// vendor mark; the small orgs with no public logo get a lettermark tile
// (kind: "mark") drawn from initials + a brand color, so nothing on a
// recruiting page is ever the WRONG company's logo.
export type RoleLogo =
  | { kind: "img"; src: string; alt: string; wide?: boolean; pad?: boolean }
  | { kind: "mark"; initials: string; color: string; alt: string };

export const engineeringRoles: Role[] = [
  {
    role: "Software Development Engineer Intern",
    org: "Amazon Web Services (AWS) — EC2 Networking (Amazon VPC)",
    dates: "May 2026 – Aug 2026",
    location: "Herndon, VA",
    logo: { kind: "img", src: "/logos/aws.png", alt: "Amazon Web Services logo" },
    bullets: [
      "Built an autonomous Claude Code agent with custom skills that migrated seven production EC2/VPC canaries from Scala to Java and JUnit 5, reducing per-test migration from about one week to about one day, gated on live integration testing.",
      "Extended an existing canary framework with AWS SDK v2, CDK, and CloudWatch, adding LIFO resource cleanup, a VPC test suite spanning eight AWS services in us-east-1, and an authentication fix that unblocked CI.",
    ],
    chips: ["7 agent-migrated tests", "~1 week → ~1 day/test", "8 AWS services"],
  },
  {
    role: "Software Engineer Intern",
    org: "University of Maryland (Observatory)",
    dates: "May 2025 – Sep 2025",
    location: "College Park, MD",
    logo: { kind: "img", src: "/logos/umd.png", alt: "University of Maryland logo" },
    bullets: [
      "Independently built a full-stack search platform (Python/Flask REST APIs, React, SQLite) giving UMD astrophysicists real-time query and filtering over 50,000+ telescope observation records.",
      "Cut data-processing time 75% with a Python ETL pipeline ingesting FITS files with schema validation, deduplication, and scheduled refreshes.",
      "Merged four code-reviewed pull requests to the open-source observatory archive.",
    ],
    chips: ["50,000+ records", "−75% pipeline runtime", "4 merged PRs"],
    proofLink: { label: "CCD-data-archive", href: "https://github.com/warnerem/CCD-data-archive" },
  },
  {
    role: "Quantum Machine Learning Researcher",
    org: "University of Maryland (IonQ & NQL partnership)",
    dates: "Aug 2023 – Jan 2025",
    location: "College Park, MD",
    logo: { kind: "img", src: "/logos/ionq.png", alt: "IonQ logo" },
    bullets: [
      "Shipped an open-source quantum NLP text classifier on a four-person team, building the Python pipeline that fed parsed sentences into parameterized quantum circuits (Qiskit, DisCoPy, pytket).",
      "Unlocked IonQ quantum-hardware execution via qiskit-ionq backends; the team's enhanced SPSA/Adam/genetic optimizers cut test error from 41% to 4–9% in simulation.",
      "Co-built and open-sourced the research artifact with reproducible simulator workflows and documented comparison methodology.",
    ],
    chips: ["4-person team", "Qiskit/DisCoPy/pytket", "qiskit-ionq backend"],
    proofLink: { label: "FIRE-QML-WINNERS-QNLP", href: "https://github.com/iwang-1/FIRE-QML-WINNERS-QNLP" },
  },
  {
    role: "Software Engineer Intern",
    org: "Washington Software Inc.",
    dates: "Mar 2022 – Aug 2023",
    location: "Gaithersburg, MD",
    logo: { kind: "img", src: "/logos/washington-software.png", alt: "Washington Software Inc. logo" },
    bullets: [
      "Saved ~15 engineering hours weekly by designing an automated presentation-generation system in Python (Selenium, BeautifulSoup) that replaced the manual client-reporting workflow.",
      "Replaced recurring manual research and data-gathering across three product teams with modular, reusable Python automation integrated into CI/CD pipelines.",
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
    logo: { kind: "img", src: "/logos/kids-for-code.png", alt: "Kids For Code logo" },
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
    logo: { kind: "img", src: "/logos/codeday.jpg", alt: "CodeDay logo" },
    bullets: [
      "Ran regional hackathon programs end-to-end, coordinating planning, logistics, and stakeholder communication for 500+ participants.",
      "Drove outreach to 200+ schools and secured sponsorships (including Vercel and Brave) to support event delivery.",
      "Managed budgets, runbooks, and risk/last-minute changes to keep events reliable and repeatable.",
    ],
    tags: ["500+ participants", "200+ schools"],
  },
  {
    role: "Software Programming Instructor",
    org: "Panda Programmer",
    dates: "Mar – Nov 2022",
    location: "Gaithersburg, MD",
    logo: { kind: "img", src: "/logos/panda-programmer.png", alt: "Panda Programmer logo" },
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
      "The committed CSV is a smoke-scale artifact, so this page describes the pipeline and its evidence boundary rather than quoting accuracy numbers; the linked repo carries the full team report's figures, attributed to the paper.",
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
    id: "genai",
    title: "Generative AI & LLM experiments",
    repoHref: "https://github.com/iwang-1/generative-ai-experiments",
    license: "MIT",
    description: [
      "A collection of hands-on generative-AI notebooks: a retrieval-augmented generation (RAG) pipeline built stage by stage in LangChain — tokenizers, chunking, embeddings, a vector store, retrieval, and QA/chat — plus Streamlit/Gradio LLM apps and GAN/VAE architecture studies in PyTorch.",
      "Each notebook isolates one idea so the pieces are easy to revisit and reuse.",
    ],
    chips: ["LangChain", "RAG", "PyTorch", "Streamlit/Gradio"],
  },
  {
    id: "prof-rating",
    title: "Professor rating prediction",
    repoHref: "https://github.com/iwang-1/professor-rating-prediction",
    license: "MIT",
    description: [
      "Predicts a professor's average star rating on PlanetTerp from the text of student reviews — VADER sentiment plus review count — without ever using the star ratings as features.",
      "Two text-derived features in a plain linear regression explain about 79% of the variance in ratings.",
    ],
    chips: ["Python", "scikit-learn", "VADER", "NLP"],
  },
  {
    id: "stats-studies",
    title: "Statistical studies",
    repoHref: "https://github.com/iwang-1/survey-response-analysis",
    license: "MIT",
    description: [
      "A set of reproducible statistics projects: chi-squared hypothesis testing with Bonferroni correction on a multi-wave survey dataset, a gender-perception moral-judgment study, and a weather-vs-attendance analysis with per-group detrending and Welch's t-tests.",
      "Each ships a reusable cleaning pipeline and documents its evidence boundary honestly.",
    ],
    chips: ["Python", "pandas", "SciPy", "hypothesis testing"],
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
// Shared chrome.

export const contact = {
  kicker: "OPEN TO SUMMER 2027 NEW-GRAD ROLES",
  heading: "Let's talk about building reliable software.",
  body:
    "I'm recruiting for software engineering roles, especially on backend, infrastructure, storage, and distributed systems teams. Email is the fastest way to reach me.",
};

export const footer = {
  colophon: "Built with React + TypeScript + Vite · Deployed on GitHub Pages · No trackers",
  copyright: "© 2026 Ivan Wang",
};

export const siteUrl = "https://iwang-1.github.io";
