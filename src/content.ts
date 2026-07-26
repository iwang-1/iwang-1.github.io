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

// The readout rail is the fold-level proof: three repos, one measured cell
// each, every value already carried by featuredSystems.metrics. It has to read
// and click with the figure ignored entirely.
export const hero = {
  kicker: "UMD CS B.S./M.S. · MAY 2027 · AWS SDE INTERN",
  headline: "Ivan Wang",
  subhead:
    "I build across the stack, from backend services and storage engines to ML and NLP pipelines.",
  availability: "Seeking Summer 2027 new-grad software engineering roles",
  readout: [
    {
      repo: "parallax-kv",
      href: "https://github.com/iwang-1/parallax-kv",
      value: "2.9M",
      unit: "client operations checked",
    },
    {
      repo: "accretion-db",
      href: "https://github.com/iwang-1/accretion-db",
      value: "878 µs",
      unit: "fdatasync p50",
    },
    {
      repo: "lodestone",
      href: "https://github.com/iwang-1/lodestone",
      value: "0.976",
      unit: "recall@10",
    },
  ],
};

// About — ≤120 words, first person. Positioned so any SWE team reads it as a
// strong general engineer, not someone locked into one niche.
export const about = {
  p1: "I'm a CS student at UMD, partway through the combined B.S./M.S. Summer 2026 I'm an SDE intern at AWS, working on EC2 networking. I write mostly Go and Rust. Python covers the ML and NLP.",
  p2Before: "Start with the ",
  p2LinkText: "projects",
  p2LinkHref: "/projects/",
  p2After: ".",
  p3: "I also climb. As Secretary of the UMD Climbing Club I organize 8 trips a semester, and attendance is up 30%.",
};

export interface FeaturedSystem {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  proof: string;
  /** Footnote-register scope note. Renders in the plate's footnote strip under
   *  a hairline with a † marker, never as the card's closing sentence. */
  limits?: string;
  /** The plate footnote's measurement conditions — what the numbers were
   *  measured on, in the same shape as the axis labels in the repo's own plot. */
  provenance: string;
  repoHref: string;
  /** Deep links to the committed artifact a reader can open to check the
   *  numbers. Each verified to return 200 before commit. */
  artifactLinks: { label: string; href: string }[];
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
      "A three-node Raft key-value store built from scratch: PreVote, ReadIndex, persist-before-send ordering, snapshots, a durable WAL, a gRPC runtime.",
    proof:
      "A deterministic stress harness ran 2.9 million client operations through partitions, crashes, message loss, delays, and snapshot churn. Zero safety or linearizability violations.",
    limits:
      "† The first bug the harness caught was in the linearizability checker, not in consensus. Not built: production snapshot scheduling or chunked streaming.",
    provenance: "3 nodes · localhost · c=8 · 4 KiB fsync p50 ≈ 0.89 ms",
    repoHref: "https://github.com/iwang-1/parallax-kv",
    artifactLinks: [
      {
        label: "docs/BUG_LEDGER.md",
        href: "https://github.com/iwang-1/parallax-kv/blob/main/docs/BUG_LEDGER.md",
      },
    ],
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
      "An embeddable LSM-tree storage engine: CRC-framed WAL, group commit, memtables, block SSTables, bloom filters, size-tiered compaction. The crate root forbids unsafe code, so the engine has no unsafe blocks by construction.",
    proof:
      "Fault-injection and property tests check that acknowledged writes survive simulated crashes. They do. Every result is benchmarked against sled, including the cases sled wins.",
    limits:
      "† The ~29x group-commit figure is WAL-bound. Compaction runs synchronously under the write lock, which caps full-engine throughput.",
    provenance: "16-byte keys / 100-byte values · ext4 on NVMe · Xeon 8488C",
    repoHref: "https://github.com/iwang-1/accretion-db",
    artifactLinks: [
      {
        label: "benchmarks/RESULTS.md",
        href: "https://github.com/iwang-1/accretion-db/blob/main/benchmarks/RESULTS.md",
      },
    ],
    chips: ["Rust", "LSM tree", "group commit", "crash consistency", "proptest"],
    diagram: "lsm",
    metrics: [
      { value: "~29x", label: "WAL-bound group commit" },
      { value: "878 µs", label: "fdatasync p50" },
    ],
  },
  {
    id: "lodestone",
    eyebrow: "VECTOR SEARCH · RUST",
    title: "lodestone",
    summary:
      "A vector search engine built from scratch in Rust for embeddings and RAG retrieval. An HNSW proximity graph and an IVF-PQ compressed index sit over hand-written AVX-512 distance kernels with runtime feature dispatch.",
    proof:
      "On 50,000 128-dimensional vectors on a single core, HNSW reached 0.976 recall@10 at about 31,800 queries per second. That is about 33x the exact brute-force oracle's throughput at that recall, and 9–33x across the 90%+ recall band. The whole curve is measured, not one point.",
    limits:
      "† IVF-PQ trades accuracy for footprint: 0.975 recall@10 at 16x memory compression. Single machine, single core. Not built: distributed sharding.",
    provenance: "50,000 x 128-d · k=10 · single core · Xeon 8488C",
    repoHref: "https://github.com/iwang-1/lodestone",
    artifactLinks: [
      {
        label: "benchmarks/raw/bench_50k_128d.txt",
        href: "https://github.com/iwang-1/lodestone/blob/main/benchmarks/raw/bench_50k_128d.txt",
      },
    ],
    chips: ["Rust", "HNSW", "IVF-PQ", "AVX-512 SIMD", "RAG retrieval"],
    diagram: "ann",
    metrics: [
      { value: "0.976", label: "HNSW recall@10" },
      { value: "~31.8K", label: "queries/sec · 1 core" },
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
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Distributed Systems",
      "Operating Systems",
      "Computer Networks",
      "Database Systems",
      "Software Engineering",
      "Machine Learning",
      "Natural Language Processing",
    ],
  },
];

// ---------------------------------------------------------------------------
// Skills — focused on tools backed by experience or public work.

// Two rows, not four: the same items per the resume, merged so the section
// stops reading as 1.5 phone screens of identical pills.
export const skills: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["Python", "Java", "Go", "Rust", "TypeScript/JavaScript", "Scala", "SQL", "Bash"],
  },
  {
    label: "Tools & frameworks",
    items: [
      "Raft",
      "gRPC/Protobuf",
      "LSM trees",
      "Flask/FastAPI",
      "Node.js",
      "PostgreSQL/SQLite",
      "JUnit 5",
      "PyTorch",
      "HuggingFace",
      "scikit-learn",
      "LangChain",
      "Qiskit",
      "DisCoPy",
      "pytket",
      "JAX",
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
// public/, never hotlinked from a CDN). Every one of the seven is a real
// vendor mark, so nothing on a recruiting page is ever the WRONG company's
// logo.
export type RoleLogo = { kind: "img"; src: string; alt: string; wide?: boolean; pad?: boolean };

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
      "Independently built a full-stack search platform (Python/Flask REST APIs, SQLite, JavaScript front end) giving UMD astrophysicists query and filtering over 50,000+ telescope observation records.",
      "Cut data-processing time 75% with a Python ETL pipeline ingesting FITS files.",
      "Merged four pull requests to the open-source observatory archive.",
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
      "Co-built and open-sourced the research artifact and wrote up the comparison methodology.",
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
  description: string[];
  chips?: string[];
  repoHref?: string;
  license?: string;
}

export const projects: Project[] = [
  {
    id: "dann",
    title: "Unsupervised Domain Adaptation for Sentiment",
    repoHref: "https://github.com/iwang-1/cross-domain-sentiment-dann",
    license: "MIT",
    description: [
      "DistilBERT with a gradient-reversal DANN for unsupervised domain adaptation across Yelp, Amazon, Twitter, and Reddit. Labeled source-domain examples train the sentiment head; unlabeled target-domain text trains the domain head.",
      "The committed CSV is a smoke-scale artifact, so this page quotes no accuracy numbers. The full figures live in the linked repo's team report.",
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
      "Hands-on generative-AI notebooks. The core is a retrieval-augmented generation (RAG) pipeline built stage by stage in LangChain, from tokenizers through chunking and embeddings to retrieval and QA chat. Alongside it: Streamlit/Gradio LLM apps and GAN/VAE architecture studies in PyTorch.",
      "Each notebook isolates one idea.",
    ],
    chips: ["LangChain", "RAG", "PyTorch", "Streamlit/Gradio"],
  },
  {
    id: "prof-rating",
    title: "Professor rating prediction",
    repoHref: "https://github.com/iwang-1/professor-rating-prediction",
    license: "MIT",
    description: [
      "Predicts a professor's average star rating on PlanetTerp from the text of student reviews (VADER sentiment plus review count), without ever using the star ratings as features.",
      "Two text-derived features in a plain linear regression explain about 79% of the variance in ratings.",
    ],
    chips: ["Python", "scikit-learn", "VADER", "NLP"],
  },
  {
    id: "survey-analysis",
    title: "Survey response analysis",
    repoHref: "https://github.com/iwang-1/survey-response-analysis",
    license: "MIT",
    description: [
      "Cleaning and statistical analysis of a multi-wave survey dataset: a reusable cleaning function, then chi-squared hypothesis tests with Bonferroni correction probing what actually shifts people's answers to moral-judgment questions.",
    ],
    chips: ["Python", "pandas", "SciPy", "hypothesis testing"],
  },
  {
    id: "gender-perception",
    title: "Gender perception study",
    repoHref: "https://github.com/iwang-1/gender-perception-study",
    license: "MIT",
    description: [
      "Does swapping the genders in a moral-judgment scenario change how people judge it? Chi-squared hypothesis testing on gender-swapped survey scenarios, with the method written down.",
    ],
    chips: ["Python", "pandas", "chi-squared"],
  },
  {
    id: "weather-attendance",
    title: "Weather vs. attendance study",
    repoHref: "https://github.com/iwang-1/weather-attendance-study",
    license: "MIT",
    description: [
      "A statistical study of attendance against local weather: per-group detrending, WMO/NWS rain classification, Welch's t-tests, then a rain-plus-wind regression.",
    ],
    chips: ["Python", "SciPy", "regression"],
  },
  {
    id: "this-site",
    title: "This site",
    repoHref: "https://github.com/iwang-1/iwang-1.github.io",
    license: "MIT",
    description: [
      "The page you're reading: a multi-page React + TypeScript + Vite site on GitHub Pages. It prerenders to static HTML, works without JavaScript, and won't build if a fact check or Playwright assertion fails.",
    ],
    chips: ["React + TypeScript + Vite", "fact-gate in CI", "Playwright-verified", "no trackers"],
  },
];

// ---------------------------------------------------------------------------
// Shared chrome.

export const contact = {
  heading: "Let's talk about building reliable software.",
  body:
    "I'm looking for Summer 2027 software engineering roles across the stack. Email is fastest.",
};

export const footer = {
  colophon: "Built with React + TypeScript + Vite · Deployed on GitHub Pages · No trackers",
  copyright: "© 2026 Ivan Wang",
};

export const siteUrl = "https://iwang-1.github.io";
