// SINGLE SOURCE OF TRUTH for everything the site renders, consumed by all
// four page entries. AS OF 2026-07-13. Numbers come from Ivan's resume /
// LinkedIn / the verified portfolio facts sheet — re-verify against FACTS.md
// before every deploy. NEVER: sum the star-catalog per-repo test counts,
// round 79.5→80 or 98.56→99, or drop a '~'. scripts/check-facts.mjs enforces
// the mechanical parts (it runs as `prebuild`).
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
// Home — hero, Now strip, About.

export const hero = {
  kicker: "SOFTWARE ENGINEER · NEW-GRAD 2027",
  headline: "I build software the way I build keyboards — carefully, end to end.",
  subhead:
    "CS B.S./M.S. (Honors Program), University of Maryland — M.S. expected May 2027 · Software Development Engineer Intern at Amazon Web Services, Summer 2026.",
  availability: "Open to new-grad SWE roles · available Summer 2027",
};

export const nowStrip = [
  "Now — SDE Intern @ AWS · Summer 2026",
  "Next — M.S. Computer Science · expected May 2027",
  "Looking for — new-grad SWE · Summer 2027",
];

// About — ≤120 words, first person; max ONE keyboard/climbing metaphor on the
// whole site (the hero headline is it — P3's closer stays literal).
export const about = {
  p1: "I'm a software engineer drawn to backend systems and ML/NLP — the layer where data pipelines, APIs, and models either hold up or don't.",
  p2Before: "I like software you can check: my ",
  p2LinkText: "projects",
  p2LinkHref: "/projects/",
  p2After: " ship with test suites, coverage numbers, and honest caveats in the README.",
  p3: "Away from a terminal I'm usually on a climbing wall — as Secretary of the UMD Climbing Club I organize 8 trips a semester and helped grow attendance 30%. The rest of my tinkering budget goes to building mechanical keyboards and custom PCs. Different materials, same habit: understand the whole system, then make it solid.",
};

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
    degree: "B.S./M.S. in Computer Science (CS Honors Program)",
    dates: "Aug 2023 – May 2027",
    detailLines: ["Minors in Data Science and Philosophy"],
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
  {
    school: "The University of Hong Kong",
    degree: "Study Abroad (Exchange Program), Computer Science",
    dates: "Aug – Dec 2025",
    detailLines: [],
    coursework: ["Numerical Analysis", "Cryptography"],
  },
];

// ---------------------------------------------------------------------------
// Skills — three rows exactly per the resume.

export const skills: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: [
      "Python",
      "C/C++",
      "Java",
      "Scala",
      "JavaScript/TypeScript",
      "Go",
      "SQL",
      "HTML/CSS",
      "Bash",
      "Rust",
      "OCaml",
      "R",
    ],
  },
  {
    label: "Frameworks",
    items: [
      "React",
      "Flask",
      "FastAPI",
      "Node.js",
      "PyTorch",
      "scikit-learn",
      "LangChain",
      "HuggingFace",
      "JUnit5",
    ],
  },
  {
    label: "Tools",
    items: [
      "Git",
      "Docker",
      "Linux",
      "AWS (EC2/VPC, SDK, CDK, CloudWatch)",
      "PostgreSQL/SQLite",
      "Jenkins",
      "GitHub Actions",
      "CI/CD",
      "pytest",
      "Selenium",
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

export const teasers: Teaser[] = [
  {
    title: "AWS internship",
    body: "Agentic AI test migration + canary infrastructure for EC2 VPC control-plane APIs.",
    href: "/experience/",
    linkText: "See the experience",
  },
  {
    title: "The Star Catalog System",
    body: "Four repos, one pipeline, live demo.",
    href: "/projects/#star-catalog",
    linkText: "See the system",
    proofChips: ["101 tests · ~95% cov", "live demo"],
  },
  {
    title: "Cross-Domain Sentiment Analysis (DANN)",
    body: "DistilBERT across 4 review domains, 64,000 labeled samples.",
    href: "/projects/",
    linkText: "See the projects",
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
    dates: "May – Aug 2026",
    location: "Herndon, VA",
    bullets: [
      "Architected an agentic AI system with custom skill packages to autonomously migrate 8+ production tests from Scala to JUnit5, boosting migration throughput 5x for AWS EC2 VPC control-plane APIs.",
      "Designed and shipped canary infrastructure on AWS SDK v2, CDK, and CloudWatch in us-east-1, cutting test runtime 40% and flaky failures 60% via CI/CD pipelines and Sev2 alarms for services used by 1M+ customers.",
    ],
    chips: ["5x migration throughput", "−40% test runtime", "−60% flaky failures"],
  },
  {
    role: "Full-Stack Software Engineer Intern",
    org: "University of Maryland",
    dates: "May – Sep 2025",
    location: "College Park, MD (Remote)",
    bullets: [
      "Shipped a web app serving 50,000+ records with REST APIs and real-time search/filter for researchers.",
      "Built a Python ETL pipeline for 10+ years of legacy data (ingestion, normalization, schema validation, deduplication), kept continuously updated via cron.",
      "Cut pipeline runtime by 75% and improved query speed by optimizing SQL/indexing and API query paths.",
    ],
    chips: ["50,000+ records", "−75% pipeline runtime"],
  },
  {
    role: "Machine Learning Engineer Intern",
    org: "University of Maryland",
    dates: "Aug 2023 – Jan 2025",
    location: "College Park, MD",
    bullets: [
      "Improved NLP classification accuracy by 30% by iterating PyTorch model architectures and tuning hyperparameters with controlled experiments.",
      "Reduced training time by 25% by tuning optimizers (SPSA/ADAM/SGD), learning-rate schedules, and batch sizing.",
      "Standardized training and evaluation workflows with clean preprocessing and consistent precision/recall/F1 tracking.",
    ],
    chips: ["+30% accuracy", "−25% training time"],
  },
  {
    role: "Software Engineer Intern",
    org: "Washington Software Inc.",
    dates: "Mar 2022 – Aug 2023",
    location: "Gaithersburg, MD",
    bullets: [
      "Built a Python automation pipeline using Selenium and BeautifulSoup to extract data and generate reports/presentations from templates.",
      "Reduced manual work by 40% and saved 15+ engineering hours/week across multiple teams through reusable, configurable automation.",
      "Increased reliability with structured logging, retries/error handling, and tests; supported Jenkins CI/CD.",
    ],
    chips: ["−40% manual work", "15+ hrs/week saved"],
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
      "Delivered 400+ lessons and standardized materials for consistent instruction.",
      "Trained and coordinated 10+ instructors; improved operations to support 25% enrollment growth.",
    ],
    tags: ["3,000+ students", "400+ lessons"],
  },
  {
    role: "Technical Program Manager",
    org: "CodeDay",
    dates: "Nov 2019 – Dec 2022",
    location: "Washington DC–Baltimore Area",
    bullets: [
      "Ran regional hackathon programs end-to-end (planning, logistics, stakeholder communication) for 500+ participants.",
      "Drove outreach to 200+ schools; built partnerships/sponsorships (including Vercel and Brave).",
      "Managed budgets, runbooks, and risk to keep events reliable and repeatable.",
    ],
    tags: ["500+ participants", "200+ schools"],
  },
  {
    role: "Software Programming Instructor",
    org: "Panda Programmer",
    dates: "Mar – Nov 2022",
    location: "Gaithersburg, MD",
    bullets: [
      "Taught Python, JavaScript, and Scratch to students ages 6–12 through hands-on projects.",
      "Built lesson plans and adapted pacing to each student's level.",
      "Communicated progress to parents and staff; helped students build confidence through debugging.",
    ],
    tags: ["Python", "JavaScript", "Scratch"],
  },
];

// ---------------------------------------------------------------------------
// Projects — featured Star Catalog System.

export const starSystem = {
  heading: "The Star Catalog System",
  intro:
    "Four repos, one pipeline: telescope CSVs → validated SQLite → typed API → interactive sky map, plus a spectral classifier. It grew out of pull requests to a UMD Observatory archive.",
  demoUrl: "https://iwang-1.github.io/star-catalog-web/",
  screenshot: {
    src: "/star-catalog-web.png",
    alt: "Screenshot of the star-catalog-web sky map and searchable catalog",
    width: 1200,
    height: 820,
  },
};

export interface Repo {
  name: string;
  href: string;
  description: string;
  chips: string[];
  demoHref?: string;
}

export const starRepos: Repo[] = [
  {
    name: "star-catalog-ingest",
    href: "https://github.com/iwang-1/star-catalog-ingest",
    description:
      "Python ETL CLI: telescope observation CSVs → validated, deduplicated SQLite.",
    chips: ["101 tests · ~95% cov", "mypy --strict", "ruff", "CI py3.11–3.14", "v0.3.2"],
  },
  {
    name: "star-catalog-api",
    href: "https://github.com/iwang-1/star-catalog-api",
    description:
      "Typed FastAPI service: name search, magnitude/designation filters, cone search (handles the RA 0/360 seam), pagination, stats.",
    chips: ["66 tests · ~97% cov", "Dockerized · smoke-tested in CI", "v0.2.3"],
  },
  {
    name: "star-catalog-web",
    href: "https://github.com/iwang-1/star-catalog-web",
    description:
      "Interactive sky map + searchable catalog of 8,920 naked-eye HYG v4.3 stars (React + TS + Vite), Playwright-gated Pages deploy.",
    chips: ["Playwright-gated deploy", "v0.1.0"],
    demoHref: "https://iwang-1.github.io/star-catalog-web/",
  },
  {
    name: "star-spectral-classifier",
    href: "https://github.com/iwang-1/star-spectral-classifier",
    description:
      "scikit-learn HistGradientBoosting predicts OBAFGKM class from B–V color on the same sha256-pinned 8,920-star snapshot; 79.5% accuracy / 0.665 macro-F1 on a once-touched hold-out vs a 72.3% zero-parameter physics baseline; O-class recall 0 (support 10) disclosed; 92.6% of errors are adjacent-class.",
    chips: ["52 tests · 98.56% cov", "mypy --strict", "CI py3.11–3.13", "v0.1.0"],
  },
];

// ---------------------------------------------------------------------------
// Projects — the rest.

export interface Project {
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
    title: "Cross-Domain Sentiment Analysis (DANN)",
    repoHref: "https://github.com/iwang-1/cross-domain-sentiment-dann",
    license: "MIT",
    description: [
      "CMSC472 group deep-learning project: DistilBERT with leave-one-domain-out evaluation across Yelp/Amazon/Twitter/Reddit (64,000 labeled samples, 16 experimental conditions), a DANN domain-adversarial moonshot, and a Financial PhraseBank OOD probe.",
      // Result line is LOCKED — the repo README cites report Table 2. Never
      // an inflated delta, never an unqualified "74.2% on held-out domains".
      "DANN reached 74.2% on Yelp and 67.7% average accuracy across held-out domains.",
    ],
    chips: ["PyTorch", "DistilBERT", "HuggingFace"],
  },
  {
    title: "RAG-Based Research Assistant",
    date: "Jan 2025",
    noRepo: true,
    description: [
      "LangChain + FAISS chatbot over 25+ research papers; tuned chunk size and top-k with OpenAI embeddings; Streamlit app with Weights & Biases tracking; 95% accuracy on policy-analysis QA.",
    ],
    chips: ["LangChain", "FAISS", "OpenAI embeddings", "Streamlit"],
  },
  {
    title: "ML-Driven Professor Rating Predictor",
    date: "Apr 2025",
    noRepo: true,
    description: [
      "Multithreaded scraper over 13,000+ professor profiles, VADER sentiment features, scikit-learn regression with cross-validation, R² 0.79.",
    ],
    chips: ["scikit-learn", "VADER", "Pandas"],
  },
  {
    title: "Quantum NLP research (FIRE)",
    repoHref: "https://github.com/iwang-1/FIRE-QML-WINNERS-QNLP",
    license: "GPL-3.0",
    description: [
      // FRAMING LOCK: "co-built and open-sourced" — never a "contribution".
      "3-person project in UMD's FIRE (First-year Innovation & Research Experience) program, co-built and open-sourced. My role: dataset preparation and integration, and project documentation.",
      "Enhanced optimizers beat an out-of-the-box standard-SPSA baseline by roughly 30 percentage points of train/test accuracy (exact noiseless simulation).",
    ],
    chips: ["Python", "Jupyter", "DisCoPy", "Qiskit", "pytket"],
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
  body: "Contributed to an open source project: 4 merged pull requests to warnerem/CCD-data-archive — a Python/Flask/SQLite archive of UMD Observatory CCD data. Working with this archive is what inspired the star-catalog system above.",
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
  body: "Open pull request, under review: Quantinuum/lambeq #259 — LAMBEQ_MODELS_URL override.",
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
