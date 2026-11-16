// Single source of truth for everything the site renders, consumed by all four page entries. Numbers come
// from public artifacts and the verified portfolio facts sheet; re-verify against facts.md before every deploy.

export const person = {
  name: "Ivan Wang",
  github: "https://github.com/iwang-1",
  linkedin: "https://www.linkedin.com/in/ivanwang1",
  email: "ivanwang8989@gmail.com",
};

// ---------------------------------------------------------------------------
// Home — hero, About.

// The readout rail is the fold-level proof: three repos, one measured cell each, every value already
// carried by featuredSystems.metrics.
export const hero = {
  // Date-anchored: a bare "AWS SDE INTERN" silently goes stale when the
  // internship ends.
  kicker: "UMD CS B.S./M.S. · GRADUATING MAY 2027 · AWS SDE INTERN, SUMMER 2026",
  headline: "Ivan Wang",
  // The second sentence is gate-locked verbatim.
  subhead:
    "I mostly build things to find out how they work. Outside of work I'm into mechanical keyboards, bouldering, and keeping up with tech.",
  // Both tracks, because he is eligible for both (confirmed 2026-07-31: the combined B.S./M.S. can extend
  // past May 2027).
  availability: "Open to Summer 2027 internships and new-grad roles · relocating anywhere in the US",
  // "Three OF the things": eleven public repos exist, and a rail that reads as the complete portfolio is
  // what makes a broad body of work look like one track.
  readoutLead: "Three of the things I've built, with one measured result each. The names link to the code.",
  readout: [
    {
      repo: "parallax-kv",
      what: "Raft key-value store",
      href: "https://github.com/iwang-1/parallax-kv",
      value: "2.9M",
      unit: "client operations checked",
      // The one hero metric that shipped without a gloss, and the exact row both non-engineer reviewers
      // named as the one they could not judge.
      plain: "reads and writes replayed under failure",
    },
    {
      repo: "accretion-db",
      what: "LSM storage engine",
      href: "https://github.com/iwang-1/accretion-db",
      value: "878 µs",
      unit: "fdatasync p50",
      plain: "median durable-write flush",
    },
    {
      repo: "lodestone",
      what: "vector search engine",
      href: "https://github.com/iwang-1/lodestone",
      value: "0.976",
      unit: "recall@10",
      plain: "top-10 search accuracy",
    },
  ],
  // The line under the cta row.
  emailLine: "Resume on request",
  // The paid production work, in the hero in body type. It is the highest-signal thing a new grad has and
  // the one thing GitHub can't show, and it used to render only as a mono aside two screens down.
  awsLine: {
    text: "This summer I'm an SDE intern on EC2 Networking at AWS, where I built an agent that migrated seven production canaries from Scala to Java, cutting each one from about a week of work to about a day.",
    linkText: "Full timeline",
    href: "/experience/",
  },
};

// Off the clock.
export const hobbies = {
  title: "Outside of work",
  intro: "A few things I spend my free time on.",
  // Trimmed 2026-07-31, subtractively: personality only works if it reads in a few seconds, and this
  // section now stands between a screener and the proof.
  keyboards: {
    blurb: "Building keyboards",
    lead: "You can customize every part, so you can tailor a board to exactly what you or someone else needs, and picking the right part for the job is the fun of it.",
  },
  climb: {
    blurb: "Bouldering",
    lead: "I climb for the community and the problem solving. A boulder can usually be done a lot of different ways, and which one costs you the least depends on your body, and working that out is my favorite part.",
  },
  tech: {
    blurb: "Following the industry",
    // One clause, no enumeration: the four rows below name the specifics, and
    // the paragraph used to say all four of them 30px above the plate.
    lead: "I keep up with tech pretty closely, from new hardware to how governments are handling AI. I'm interested in where the industry is heading.",
    // Short by design: this renders in a third-width column, so each note has
    // to fit on one or two lines.
    feed: [
      { topic: "hardware", note: "launches and reviews" },
      { topic: "AI policy", note: "regulation, worldwide" },
      { topic: "keyboards", note: "switches and group buys" },
      { topic: "the industry", note: "where it's heading" },
    ],
  },
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
  /** One first-person aside, in body register, on one plate only. */
  aside?: string;
  /** The plate footnote's measurement conditions — what the numbers were
   *  measured on, in the same shape as the axis labels in the repo's own plot. */
  provenance: string;
  repoHref: string;
  /** Deep links to the committed artifact a reader can open to check the
   *  numbers. Each verified to return 200 before commit. */
  artifactLinks: { label: string; href: string }[];
  chips: string[];
  diagram: "raft" | "lsm" | "ann";
  /** `plain` is the metric said in words, on the labels that are axis labels rather than English. */
  metrics: { value: string; label: string; plain?: string }[];
}

export const featuredSystems: FeaturedSystem[] = [
  {
    id: "parallax-kv",
    eyebrow: "DISTRIBUTED SYSTEMS · GO",
    title: "parallax-kv",
    summary:
      "A three-node Raft key-value store built from scratch: PreVote, ReadIndex, persist-before-send ordering, snapshots, a durable WAL, a gRPC runtime.",
    proof:
      // "zero Porcupine Illegal verdicts", not "zero linearizability violations".
      "A deterministic stress harness ran 2.9 million client operations through partitions, crashes, message loss, delays, and snapshot churn. Zero safety violations, and zero Illegal verdicts from the linearizability checker. Proposing queued writes together cut WAL fsyncs from 2.23 to 0.46 per write, and raised durable throughput at 64 clients from 102 to 1,408 writes per second. Production log compaction keeps each node at about 1.3 MB on disk instead of 11.5 MB.",
    limits:
      // "election-safety check", not "linearizability checker"
      "† The first bug the harness caught was in my own election-safety check, not in consensus. Not built: chunked snapshot streaming or incremental snapshots.",
    // One plate carries an aside so the three do not read as one filled-in template. It restates the
    // footnote's checker-bug fact in plain prose; no second copy of any number.
    provenance:
      "3 nodes · soak: 6 simulated clients, virtual time · throughput: localhost, c=64, Apple M3 Max, 4 KiB fsync p50 ≈ 3.96 ms · measured 2026-11-13",
    repoHref: "https://github.com/iwang-1/parallax-kv",
    artifactLinks: [
      {
        label: "docs/BUG_LEDGER.md",
        href: "https://github.com/iwang-1/parallax-kv/blob/main/docs/BUG_LEDGER.md",
      },
    ],
    chips: ["Go", "Raft", "gRPC", "Porcupine", "deterministic simulation"],
    diagram: "raft",
    // Two of the three labels are already English.
    metrics: [
      { value: "1,408 w/s", label: "durable writes · c=64" },
      // p99 = the 99th percentile, i.e. all but the slowest hundredth. Names
      // what the 60 ms IS; asserts nothing the label did not already say.
      { value: "60 ms", label: "p99 latency · c=64", plain: "near-worst-case write time" },
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
      // "sled wins every matched comparison", not "including the cases where sled wins"
      "Fault-injection and property tests confirm that acknowledged writes survive simulated crashes, and that multi-key write batches are all-or-nothing at every crash point. Index-seeking range scans cut per-scan p50 from 22.4 ms to 0.26 ms. Benchmarked against sled, which wins every matched comparison on this host. Reported rather than omitted.",
    limits:
      "† The ~29x group-commit figure is WAL-bound. Compaction runs synchronously under the write lock, which caps full-engine throughput.",
    provenance:
      "16-byte keys / 100-byte values · ext4 on NVMe · Xeon 8488C · measured 2026-07-13",
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
      // "wal-bound" and "group commit" are both jargon; the gloss says what the batching is. No number, and
      // no claim about the rest of the engine — the footnote's † already states the compaction limit.
      { value: "~29x", label: "WAL-bound group commit", plain: "gain from batching log writes" },
      // Verbatim from the hero rail's approved gloss for the same label, so
      // "fdatasync p50" is never translated two different ways on one page.
      { value: "878 µs", label: "fdatasync p50", plain: "median durable-write flush" },
    ],
  },
  {
    id: "lodestone",
    eyebrow: "VECTOR SEARCH · RUST",
    title: "lodestone",
    summary:
      "A vector search engine built from scratch in Rust for embeddings and RAG retrieval. An HNSW proximity graph and an IVF-PQ compressed index sit over hand-written AVX-512 and ARM NEON distance kernels with runtime feature dispatch.",
    proof:
      "On 50,000 128-dimensional vectors on a single core, HNSW reached 0.976 recall@10 at about 31,800 queries per second, about 33x the exact brute-force search at that recall, and 9 to 33x across the 90%+ recall band. The baseline is the honest catch: it runs in parallel across all 48 vCPU while the search runs on one, so the two sides of that ratio are not core-for-core. On Apple Silicon, the NEON kernels run 6 to 12 times faster per distance call than scalar code, and both index types reload from checksummed files in under 100 ms instead of seconds of rebuilding.",
    limits:
      "† IVF-PQ trades accuracy for footprint: 0.975 recall@10 at 16x memory compression. Single machine, single core. Not built: distributed sharding.",
    provenance:
      "50,000 x 128-d · k=10 · search on 1 core, brute-force baseline on 48 · Xeon 8488C · measured 2026-07-16",
    repoHref: "https://github.com/iwang-1/lodestone",
    artifactLinks: [
      {
        label: "benchmarks/raw/bench_50k_128d.txt",
        href: "https://github.com/iwang-1/lodestone/blob/main/benchmarks/raw/bench_50k_128d.txt",
      },
    ],
    chips: ["Rust", "HNSW", "IVF-PQ", "AVX-512 & NEON SIMD", "RAG retrieval"],
    diagram: "ann",
    metrics: [
      // Verbatim from the hero rail's approved gloss for recall@10. "queries/sec
      // · 1 core" below it is already English and gets none.
      { value: "0.976", label: "HNSW recall@10", plain: "top-10 search accuracy" },
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
    // Which degree lands in May 2027 was unresolved: B.S.-new-grad and M.S.-new-grad are different reqs
    // with different bands, and routing a candidate is literally the recruiter's job.
    degree: "B.S./M.S. in Computer Science, M.S. expected May 2027. Departmental Honors (research track)",
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

// Four rows, not two: the same items in the same mono/interpunct grammar, but the 22-item "Tools &
// frameworks" run was a 276-character grey wall in which a fast reader keyword-matching against a req found nothing.
export const skills: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["Python", "Java", "Go", "Rust", "TypeScript/JavaScript", "Scala", "SQL", "Bash"],
  },
  {
    label: "Distributed & storage",
    items: ["Raft", "gRPC/Protobuf", "LSM trees", "PostgreSQL/SQLite"],
  },
  {
    // The row label names what all four items are, testing tools included: "Backend & web" was the only
    // label on the page that a JUnit 5 and a Playwright entry did not belong under.
    label: "Backend, web & testing",
    items: ["Flask/FastAPI", "Node.js", "JUnit 5", "Playwright"],
  },
  {
    label: "ML & NLP",
    items: ["PyTorch", "HuggingFace", "scikit-learn", "LangChain", "JAX", "Qiskit", "DisCoPy", "pytket"],
  },
  {
    label: "Cloud & CI",
    items: [
      "AWS (EC2/VPC, SDK, CDK, CloudWatch)",
      "Docker",
      "Linux",
      "GitHub Actions",
      "CI/CD",
      "Jenkins",
    ],
  },
];

// Experience.

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

// Each role shows its employer's real logo, served from /logos (bundled in public/, never hotlinked from a
// cdn).
export type RoleLogo = {
  kind: "img";
  src: string;
  alt: string;
  w: number;
  h: number;
  wide?: boolean;
  pad?: boolean;
};

export const engineeringRoles: Role[] = [
  {
    role: "Software Development Engineer Intern",
    org: "Amazon Web Services (AWS), EC2 Networking (Amazon VPC)",
    dates: "May 2026 – Aug 2026",
    location: "Herndon, VA",
    logo: { kind: "img", src: "/logos/aws.png", alt: "Amazon Web Services logo", w: 200, h: 200 },
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
    logo: { kind: "img", src: "/logos/umd.png", alt: "University of Maryland logo", w: 200, h: 200 },
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
    logo: { kind: "img", src: "/logos/ionq.png", alt: "IonQ logo", w: 240, h: 240 },
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
    logo: { kind: "img", src: "/logos/washington-software.png", alt: "Washington Software Inc. logo", w: 200, h: 200 },
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
    logo: { kind: "img", src: "/logos/kids-for-code.png", alt: "Kids For Code logo", w: 100, h: 100 },
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
    logo: { kind: "img", src: "/logos/codeday.jpg", alt: "CodeDay logo", w: 200, h: 200 },
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
    logo: { kind: "img", src: "/logos/panda-programmer.png", alt: "Panda Programmer logo", w: 200, h: 200 },
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
      "On a committed, seeded snapshot, a Ridge model over the review text plus those two features explains 86% of the variance on held-out professors (test R² 0.859), against 0.771 for the original two-feature linear regression.",
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
    // "won't deploy", not "won't build"
    description: [
      "The page you're reading: a multi-page React + TypeScript + Vite site on GitHub Pages. It prerenders to static HTML, works without JavaScript, and won't deploy if a fact check or Playwright assertion fails.",
    ],
    chips: ["React + TypeScript + Vite", "fact-gate in CI", "Playwright-verified", "no trackers"],
  },
];

// ---------------------------------------------------------------------------
// Shared chrome.

export const contact = {
  heading: "Get in touch",
  // "Full resume on request" removes the screener's dead end without shipping a pdf.
  body:
    "I'm looking for Summer 2027 software engineering internships and new-grad roles. Email is the fastest way to reach me, and I can send a full resume on request.",
};

export const footer = {
  colophon: "Built with React + TypeScript + Vite · Deployed on GitHub Pages · No trackers",
  copyright: "© 2026 Ivan Wang",
};

// The page-root ErrorBoundary's last resort, and it renders on one path only: a mount that failed on a page
// carrying no prerendered markup to restore, which in practice means `npm run dev`.
export const errorFallback = {
  heading: "This page didn't finish loading.",
  body: "Reloading usually fixes it. These pages work either way:",
  links: [
    { label: "Home", href: "/" },
    { label: "Experience", href: "/experience/" },
    { label: "Projects", href: "/projects/" },
    { label: "Email me", href: "mailto:ivanwang8989@gmail.com" },
  ],
};

export const siteUrl = "https://iwang-1.github.io";
