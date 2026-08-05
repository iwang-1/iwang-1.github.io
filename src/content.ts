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
//
// `what` and `plain` exist because the repo names are invented words and two of
// the three units are jargon: a reader who has never seen "lodestone" or
// "recall@10" learns nothing from a rail that only prints them. Both fields are
// SURFACING, never new claims — every `what` is the opening noun phrase of that
// project's own summary below, and every `plain` names what the metric IS
// rather than asserting a second measurement.
export const hero = {
  // Date-anchored: a bare "AWS SDE INTERN" silently goes stale when the
  // internship ends.
  kicker: "UMD CS B.S./M.S. · GRADUATING MAY 2027 · AWS SDE INTERN, SUMMER 2026",
  headline: "Ivan Wang",
  // The second sentence is gate-locked verbatim — verify.mjs asserts the
  // lowercase literals "mechanical keyboards" and "rock climbing" on "/", and
  // they exist nowhere else in the rendered DOM (the hobby headings are
  // capitalized). Edit the first sentence only.
  // NO language or specialty in the first sentence — naming a stack narrows the
  // roles a screener will consider him for (owner call, 2026-07-31). The site
  // shows the range; it doesn't announce a lane.
  //
  // The first sentence states an ACTION, not a category: "I'm a software
  // engineer" on a page already titled "Software Engineer" described the set
  // every candidate belongs to rather than anything he does, so the whole
  // self-description fell to the hobby list. This names zero technologies (the
  // no-lane call stands) and is exactly what the three repos in the rail below
  // demonstrate — it introduces no fact the page did not already carry.
  subhead:
    "I like taking things apart to understand how they work, then building my own. Outside of work I'm into mechanical keyboards, rock climbing, and keeping up with tech.",
  // Both tracks, because he is eligible for both (confirmed 2026-07-31: the
  // combined B.S./M.S. can extend past May 2027). Addressing only one would make
  // the other kind of recruiter rule him out. Relocation stated, no metro named.
  availability: "Open to Summer 2027 internships and new-grad roles · relocating anywhere in the US",
  // "Three OF the things": eleven public repos exist, and a rail that reads as
  // the complete portfolio is what makes a broad body of work look like one
  // track. Two words, no count asserted.
  readoutLead: "Three of the things I've built, with one measured result each. The names link to the code.",
  readout: [
    {
      repo: "parallax-kv",
      what: "Raft key-value store",
      href: "https://github.com/iwang-1/parallax-kv",
      value: "2.9M",
      unit: "client operations checked",
      // The one hero metric that shipped without a gloss, and the exact row both
      // non-engineer reviewers named as the one they could not judge. Names what
      // the number IS; asserts no second measurement.
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
  // The line under the CTA row. It used to be the bare address, a second copy of
  // the "Email me" button directly above it; now the same line carries the ONE
  // affordance a screener could otherwise only find 5,000px down in the contact
  // band. Not a new claim — contact.body has published "I can send a full resume
  // on request" all along, and verify.mjs still blocks any public PDF, so the
  // sentence IS the artifact. Unaccented "Resume": the accented literal is on
  // the gate's absent list for "/".
  emailLine: "Resume on request",
  // The paid production work, in the hero in body type. It is the highest-signal
  // thing a new grad has and the one thing GitHub can't show, and it used to
  // render only as a mono aside two screens down. Every fact here is already in
  // engineeringRoles[0] — org, dates, and the first bullet's own numbers.
  awsLine: {
    text: "This summer I'm an SDE intern on EC2 Networking at AWS, where I built an agent that migrated seven production canaries from Scala to Java, cutting each one from about a week of work to about a day.",
    linkText: "Full timeline",
    href: "/experience/",
  },
};

// Off the clock — the hobby section. Quick and warm by design (owner call,
// 2026-07-27): no leadership claims, no metrics, just the three things he is
// actually into, each with its own drawn figure. The old About paragraphs and
// the club-officer line were retired at the same time.
// Outside of work — the hobby section. The blurbs are Ivan's own words, lightly
// edited for grammar only: his reasons for liking each thing, not a description
// of the thing. Do not "improve" these into cleverness; the whole point is that
// they sound like him.
export const hobbies = {
  title: "Outside of work",
  intro: "A few things I spend my free time on.",
  // Trimmed 2026-07-31, subtractively: personality only works if it reads in a
  // few seconds, and this section now stands between a screener and the proof.
  // 208 words -> ~76. Nothing is rephrased into cleverness — clauses that
  // restated the heading above them, or the plate rows below them, came out.
  keyboards: {
    blurb: "Building keyboards",
    lead: "You can customize every part, so you can tailor a board to exactly what you or someone else needs — and picking the right part for the job is the fun of it.",
  },
  climb: {
    blurb: "Rock climbing",
    lead: "I climb for the community and the problem solving. A boulder can usually be done a lot of different ways, and which one costs you the least depends on your body — working that out is my favorite part.",
  },
  tech: {
    blurb: "Following the industry",
    // One clause, no enumeration: the four rows below name the specifics, and
    // the paragraph used to say all four of them 30px above the plate.
    lead: "I keep up with tech pretty closely — from new hardware to how governments are handling AI. I'm interested in where the industry is heading.",
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
  /** One first-person aside, in body register, on ONE plate only — the
   *  deliberate break in an otherwise identical three-plate anatomy. Restates a
   *  fact the plate already carries; never introduces a number. */
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
  /** `plain` is the metric said in words, on the labels that are axis labels
   *  rather than English. Identical contract to the hero rail's own `plain`
   *  field: it NAMES WHAT THE LABEL IS and may not assert a second measurement
   *  or introduce any number. Two of the three reuse the rail's already-approved
   *  wording verbatim, so the same jargon is never translated two ways.
   *  Omitted wherever the label already reads as English — "client operations
   *  checked" and "queries/sec · 1 core" need no gloss, and writing one anyway
   *  would fill in a schema. */
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
      "A deterministic stress harness ran 2.9 million client operations through partitions, crashes, message loss, delays, and snapshot churn. Zero safety or linearizability violations.",
    limits:
      "† The first bug the harness caught was in the linearizability checker, not in consensus. Not built: production snapshot scheduling or chunked streaming.",
    // One plate carries an aside so the three do not read as one filled-in
    // template. It restates the footnote's checker-bug fact in plain prose;
    // no second copy of any number.
    // The aside is GONE, not moved. It existed to break the three-plate
    // sameness back when `limits` was a 14px dagger footnote nobody read — so it
    // restated the checker-bug fact in body register where it would land. Now
    // `limits` IS a titled column at body size, so the aside was the same
    // sentence twice in one block, 200px apart. The fact keeps its stronger
    // position; the duplicate goes.
    provenance:
      "3 nodes · localhost · c=8 · 4 KiB fsync p50 ≈ 0.89 ms · measured 2026-07-13",
    repoHref: "https://github.com/iwang-1/parallax-kv",
    artifactLinks: [
      {
        label: "docs/BUG_LEDGER.md",
        href: "https://github.com/iwang-1/parallax-kv/blob/main/docs/BUG_LEDGER.md",
      },
    ],
    chips: ["Go", "Raft", "gRPC", "Porcupine", "deterministic simulation"],
    diagram: "raft",
    // Two of the three labels are already English — "durable writes" and
    // "client operations checked" — so only the percentile one is glossed. A
    // gloss on every row would be the filled-in schema the readout exists to
    // avoid.
    metrics: [
      { value: "272 w/s", label: "durable writes · c=8" },
      // p99 = the 99th percentile, i.e. all but the slowest hundredth. Names
      // what the 41 ms IS; asserts nothing the label did not already say.
      { value: "41 ms", label: "p99 latency · c=8", plain: "near-worst-case write time" },
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
      "Fault-injection and property tests confirm that acknowledged writes survive simulated crashes. Results are benchmarked against sled, including the cases where sled wins.",
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
      // "WAL-bound" and "group commit" are both jargon; the gloss says what the
      // batching IS. No number, and no claim about the rest of the engine — the
      // footnote's † already states the compaction limit.
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
      "A vector search engine built from scratch in Rust for embeddings and RAG retrieval. An HNSW proximity graph and an IVF-PQ compressed index sit over hand-written AVX-512 distance kernels with runtime feature dispatch.",
    proof:
      "On 50,000 128-dimensional vectors on a single core, HNSW reached 0.976 recall@10 at about 31,800 queries per second — about 33x the exact brute-force search at that recall, and 9–33x across the 90%+ recall band. The baseline is the honest catch: it runs in parallel across all 48 cores while the search runs on one, so the two sides of that ratio are not core-for-core.",
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
    chips: ["Rust", "HNSW", "IVF-PQ", "AVX-512 SIMD", "RAG retrieval"],
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
    // Which degree lands in May 2027 was unresolved: B.S.-new-grad and
    // M.S.-new-grad are different reqs with different bands, and routing a
    // candidate is literally the recruiter's job. FACTS.md:14 already recorded
    // the answer ("M.S. expected May 2027"); this states it.
    degree: "B.S./M.S. in Computer Science, M.S. expected May 2027 — Departmental Honors (research track)",
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

// Four rows, not two: the same items in the same mono/interpunct grammar, but
// the 22-item "Tools & frameworks" run was a 276-character grey wall in which a
// fast reader keyword-matching against a req found nothing. Grouping is the
// whole change — nothing added, nothing removed, and the strongest items lead
// each row.
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
    // The row label names what all four items are, testing tools included:
    // "Backend & web" was the only label on the page that a JUnit 5 and a
    // Playwright entry did not belong under.
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
//
// `w`/`h` are the asset's INTRINSIC pixel dimensions, read out of each file's own
// header rather than assumed — and the headers are the reason to read them: five of
// these seven are named `.png` and are actually JPEG (progressive, SOF2), so the
// extension is not a source of truth about the file and neither is the eye. Three
// distinct sizes across the seven (200², 240², 100²).
//
// They render as the `width`/`height` attributes and change nothing about the drawn
// box — the chip is a fixed 48px and `.role-logo-img` is `100%`/`100%`, measured
// 46x46 for all seven before and after. What they buy is the aspect ratio being
// known before a byte of image arrives, which is what keeps the `.role-logo-wide`
// variant (`height: auto`) honest and what stops a future layout that sizes on one
// axis from re-introducing a shift. Measured CLS is 0 before and after, at 9Mbps
// and at 400Kbps: this is a guard, not a fix for a live defect.
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
    org: "Amazon Web Services (AWS) — EC2 Networking (Amazon VPC)",
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
  heading: "Get in touch",
  // "Full resume on request" removes the screener's dead end without shipping a
  // PDF — verify.mjs blocks any public résumé/PDF link, so the sentence IS the
  // affordance. No accented spelling: that literal is on the gate's absent list.
  //
  // BOTH tracks named, matching the hero chip's already-approved phrasing
  // (hero.availability). This band is the peak-end position on all three content
  // pages; opening it with new-grad only told an intern recruiter who scrolled to
  // the bottom that this candidate wants something else. Introduces no new fact —
  // the dual-track eligibility already ships above the fold.
  body:
    "I'm looking for Summer 2027 software engineering internships and new-grad roles. Email is the fastest way to reach me, and I can send a full resume on request.",
};

export const footer = {
  colophon: "Built with React + TypeScript + Vite · Deployed on GitHub Pages · No trackers",
  copyright: "© 2026 Ivan Wang",
};

// The page-root ErrorBoundary's last resort, and it renders on ONE path only: a
// mount that failed on a page carrying no prerendered markup to restore, which in
// practice means `npm run dev`. Every built page is asserted to have that markup
// (scripts/prerender.mjs fails the build otherwise), so on the deployed site the
// boundary shows the complete static page instead and none of this renders.
//
// It names the problem and the recovery and stops — no apology, no explanation of
// a layer the reader cannot see, and no joke. The routes are the recovery, which
// is why they are the bulk of it.
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
