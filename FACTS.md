# FACTS.md — the rendered-claim checklist

Human companion to the automated gates. Every claim the site renders maps to a
row below, with the file that holds the evidence. **Re-verify this before every
deploy** — and read the "machine-verified" column first, because most of it does
not need re-checking by hand.

This file is deliberately OUTSIDE `check-facts.mjs`'s scan set (which reads
`src/`, `public/`, the four HTML entries, and `README.md`) so it can quote the
strings and patterns it describes without tripping them.

**Rebuilt 2026-08-06 against the working tree.** Everything below was read out of
the source at that commit, not carried over. The previous revision had drifted
badly enough to be dangerous — it described copy the site no longer renders and
denied a link the site does render — so the rule for future edits is: **change
this file in the same commit that changes what it describes, and cite a file, not
a memory.**

## How to read the tables

Each row is one rendered claim → where its evidence lives → whether a gate
already checks it.

| Marker | Meaning |
| --- | --- |
| **GATE** | A gate fails if this drifts. The gate is named. No hand-checking needed. |
| **EYE** | No gate. A human must confirm this against the cited source. |
| **EYE (repo)** | No gate in this repo, and the evidence is in a **sibling repo** this repo cannot read. Open the cited file on GitHub. |

`content.ts:NNN` = line number in `src/content.ts`, the single module every page
renders from.

---

## 1. What the build already guarantees

Read this before hand-checking anything. Four mechanisms lock most of the
numbers, and a checklist that ignores them sends a reviewer to re-verify things
that cannot drift.

### 1a. DERIVED NUMBER LOCK — `scripts/check-facts.mjs` (§5, lines 219–318)

The lodestone numbers are not string-matched; they are **recomputed
arithmetically** from `benchmarks/lodestone/bench_50k_128d.txt` (a verbatim copy
of lodestone's own committed benchmark; byte-identical to
`lodestone/benchmarks/raw/bench_50k_128d.txt`, verified 2026-08-06). The gate
parses the oracle QPS and the HNSW/IVF-PQ tables out of that file and then, over
the whole scanned corpus:

- every `"<N>x the exact/brute/oracle"` claim must fall inside the measured
  **≥ 0.90-recall** band (1x rounding tolerance);
- any stated band `"<lo>–<hi>x across"` must have the band's **real** endpoints;
- every `"<0.NNN> recall@10"` must match a row that exists in the file (±0.0006);
- every quoted QPS ≥ 500 must be within 2% of a QPS actually measured in the
  file (either table, or the oracle).

**Consequence: you cannot make the lodestone claims stronger by editing prose.**
Inflating recall, QPS, or a speedup ratio now fails arithmetic rather than having
to dodge a banned spelling. The 0.90 floor is also why the retired wider-band
multiple is excluded *by computation* — its top end sits at 0.8996 recall, below
the band the page asserts.

The lock fails loudly if it cannot parse the benchmark (`"the lock must never
silently pass"`), so deleting or mangling the file is not a way around it.

### 1b. REQUIRED_IN_CONTENT — a rendered-value lock on `src/content.ts` ALONE

`check-facts.mjs` lines 70–75. Four strings must be present **in
`src/content.ts` specifically**, not merely somewhere in the scanned corpus:

```
"2.9 million client operations"   "878 µs"   "~29x"   "not core-for-core"
```

The scoping is the entire point and is worth preserving: the general `REQUIRED`
list is satisfied by a match **anywhere** in the corpus, including comments, so
`"878 µs"` stayed "present" after being deleted from the rendering module because
a CSS comment mentioned it. A gate a comment can satisfy is not a gate on the
site. These three measured values live in sibling repos this script cannot read,
so they are pinned as exact strings; `"not core-for-core"` is the 1-core-vs-
48-core caveat, and it is gated precisely because deleting it *strengthens* the
site's headline ratio and breaks nothing else.

### 1c. The two résumé gates — `verify.mjs`

1. **No document file in `dist/`, of any name** (lines 178–186). Widened
   2026-08-05 from one hardcoded filename to an extension sweep of the whole
   recursive build output: `.pdf .docx? .rtf .odt .pages`.
2. **No rendered link offering one** (lines 1037–1057), on every page, and it
   reads **accent- and case-blind** (NFD-normalize, strip combining marks,
   lowercase — so `résumé`, `Resumé`, `RÉSUMÉ`, `resume` are one string). Fails
   on any of: an href fetching a document, a link whose *text* offers a
   résumé/CV (which catches a Drive or Dropbox URL with no file extension), or a
   `download` attribute.

Together these are what make `"Resume on request"` (content.ts:104, contact.ts
body at 654) honest: the sentence IS the artifact. **The spelling of the word is
free.** The old `"Résumé"` entry on every page's `absent` list was replaced
because it watched one accented spelling, which the copy then avoided on
purpose — a gate its subject satisfies by choosing a spelling checks nothing.

### 1d. `scripts/generate-figures.mjs --check` — now wired into CI

`.github/workflows/deploy.yml:34`. Runs `--check`, which writes nothing and
**fails if the committed `src/generated/sweep-figure.ts` is not byte-identical to
what the generator emits from the current benchmark.** Two failure modes it
closes, both previously undetectable:

- a **hand edit** to the generated module (its "DO NOT EDIT BY HAND" header was a
  request, not a rule — `npm run build` regenerates in write mode and would
  silently overwrite the edit, deploying the corrected file with no complaint);
- a **stale** artifact someone forgot to regenerate after changing the benchmark.

The emitted module is deterministic (no timestamp, no absolute path) so the
comparison is meaningful. At generation time the script also asserts every number
in the figure is a **byte-exact substring** of the benchmark file, and records the
source's sha256 in the header.

### 1e. The four gate commands, and what each covers

| Command | What it is |
| --- | --- |
| `npm run check` | generate-figures (write mode) + `check-facts.mjs`. Also runs as `prebuild`. |
| `npm run typecheck` | `tsc -b`. |
| `npm run lint` | `eslint .`. |
| `npm run build` | `prebuild` (so the fact gate genuinely fails the build) → `tsc -b` → `vite build` → `prerender.mjs`. |
| `npm run verify` | `verify.mjs`: `vite preview` over the built `dist/`, then Playwright across 4 pages × 3 viewports (1366×900, 390×844, 320×700), plus build-artifact and cross-page gates. 86 distinct failure pushes. |

CI (`deploy.yml`) runs, in order: `check-facts.mjs`, `generate-figures --check`,
`typecheck`, `lint`, `build`, `verify` — then uploads `dist/`. `verify` runs in
the **`build` job before the artifact upload**, so a failed assertion stops the
**deploy**. This is why /projects/ says the site "won't **deploy**" rather than
"won't build" (content.ts:616–631) — one half fails the build, the other fails
the deploy, and "deploy" is the word true of both. Do not "restore" the stronger
verb.

### 1f. What the `absent` lists are, and are not

`verify.mjs` lines 16–61. Every string on a page's `absent` list is **vacuous
today by design**: each was grepped across `src/`, `public/` and the four HTML
entries and no source can produce it. An `absent` entry is a **regression
tripwire** for something deliberately removed, never coverage of live copy. **Do
not read a passing run as evidence these were checked against anything.**

Current lists: `Hong Kong` (all pages), `74.2%` / `67.7%` / `64,000` (`/` and
`/projects/`), `95%` (`/projects/`), `1,400` / `2,640` (`/` and `/projects/`),
`star-catalog` / `star-spectral` / `sky map` (`/projects/`).

`1,400` and `2,640` are soak/crash-run counts, and **this list is their only
gate** — `check-facts.mjs` has no pattern for either. The site quotes the operation
count instead.

**Both are TRUE and both are sourced — the ban is editorial, not factual, and that
distinction matters.** `1,400` is parallax-kv's scenario-run count
(`docs/BUG_LEDGER.md`: "2,914,245 client operations over 1,400 scenario runs") and
`2,640` is accretion-db's total exhaustive crash executions
(`benchmarks/RESULTS.md`: 330 crash points × 4 × 2, produced by the runnable test
`exhaustive::reports_crash_point_count`, which passes). They are kept off the SITE
because run counts are weaker evidence than the operation count and the crash-loss
result they support — not because anything is wrong with them.

Consequence to know before "fixing" it: **the profile README at
`github.com/iwang-1` publishes 330 / 2,640 / 160 deliberately**, and that is not a
contradiction of this ban. A reader comparing the two surfaces sees the same
project described at two depths, which is normal. Do not delete them from the README
on this file's authority, and do not add them to the site to "make it consistent".

---

## 2. Person

| Rendered | Source | Checked |
| --- | --- | --- |
| Ivan Wang | content.ts:14 | **GATE** — `verify.mjs` title/OG assertions per page |
| github.com/iwang-1 | content.ts:15 | **GATE** — footer link asserted on every page (verify.mjs:1011) |
| linkedin.com/in/ivanwang1 | content.ts:16 | **GATE** — same |
| ivanwang8989@gmail.com | content.ts:17 | **GATE** — `check-facts` REQUIRED string + `verify.mjs` mailto assertion (1015) |
| Kicker: "UMD CS B.S./M.S. · GRADUATING MAY 2027 · AWS SDE INTERN, SUMMER 2026" | content.ts:36 | **GATE** — `"May 2027"` is a REQUIRED string and a `/` locked fact |
| Availability: "Open to Summer 2027 internships and new-grad roles · relocating anywhere in the US" | content.ts:57 | **EYE** — both tracks named because he is eligible for both; relocation stated, no metro named |
| Subhead: "…Outside of work I'm into mechanical keyboards, rock climbing, and keeping up with tech." | content.ts:52–53 | **GATE** — `"mechanical keyboards"` and `"rock climbing"` are locked `/` facts (verify.mjs:78); the lowercase literals exist nowhere else in the DOM |
| "Resume on request · ivanwang8989@gmail.com" (hero) | content.ts:104 + home/main.tsx:101 | **GATE** — §1c, both directions |
| Contact body: "…I can send a full resume on request." | content.ts:653–654 | **GATE** — §1c |
| NO phone number anywhere in site text | — | **GATE** — `check-facts` phone-shaped-string tripwire (SVG path data masked first so logo coordinates can't false-positive) |
| Date-anchored AWS framing ("Summer 2026", never "currently") | content.ts:36, 110 | **EYE** — ungated. The `"Now — SDE Intern"` literal that gestured at this was dropped 2026-08-05; the *rule* was never what that literal checked. |

The résumé PDF itself is **not in this repo and is not published**. It lives
outside the repo (`~/Ivan_Wang_Resume.tex` / `.pdf`) and is cited below as
"résumé" where it is the source of a claim.

---

## 3. Education — Home `#education` / `#background`

One `EduCard`, from `education[0]` (content.ts:313–337).

| Rendered | Source | Checked |
| --- | --- | --- |
| University of Maryland, College Park | content.ts:315; résumé line 87 | **EYE** |
| "B.S./M.S. in Computer Science, M.S. expected May 2027 — Departmental Honors (research track)" | content.ts:320; résumé lines 87–88 ("B.S./M.S. in Computer Science (CS Honors Program)", "Aug. 2023 -- May 2027") | **GATE** — `"Departmental Honors (research track)"` and `"May 2027"` are REQUIRED strings; `"Departmental Honors"` is a locked `/` fact |
| Aug 2023 – May 2027 | content.ts:321; résumé line 87 | **EYE** |
| "On the faculty-mentored research track; minors in Data Science and Philosophy" | content.ts:323; résumé line 88 (minors) | **GATE** — `"faculty-mentored research track"` is a REQUIRED string |
| GPA 3.6/4.0 (proof chip) | content.ts:325; résumé line 88 | **GATE** — `"GPA 3.6/4.0"` REQUIRED string |
| 9 coursework items, one mono line | content.ts:326–336; résumé line 89 (same nine, same order) | **EYE** |
| NO thesis claim; honors = research-track membership only | — | **GATE** — `check-facts` forbids `/honors\s+thesis\|thesis\s+defen/i` |
| No HKU / Hong Kong — education is UMD only | — | **GATE** — `check-facts` forbids it in source; `verify.mjs` asserts absence in the DOM on every page **and** in `/`'s raw HTML so JSON-LD cannot smuggle it past `innerText` |

---

## 4. Experience — the complete 7-role inventory (`/experience/`)

One center-spine alternating timeline: 4 engineering roles reverse-chron with
ProofChips, then a `Community & Teaching` spine label, then 3 community roles
with teal tags. Single left column on mobile.

**GATE** (verify.mjs:571–626): exactly **7** `.alt-timeline-item`; the spine
label must read `Community & Teaching`; desktop must alternate **and truly
interleave** (row-packing, not one card per blank row); mobile must be a single
left column; **exactly one real `<img>` logo per card, counted per card** (a
7-in-total count would pass one card with two marks and another with none), and
**zero** drawn/lettermark stand-ins — content.ts:398–401 promises every one of
the seven is the employer's real vendor mark, so nothing on a recruiting page is
ever the wrong company's logo.

### Rendered role titles, in DOM order

`Software Development Engineer Intern` · `Software Engineer Intern` · `Quantum
Machine Learning Researcher` · `Software Engineer Intern` — then the spine
label — `Vice President` · `Technical Program Manager` · `Software Programming
Instructor`.

### Engineering (content.ts:426–480)

| # | Rendered | Source | Checked |
| --- | --- | --- | --- |
| 1 | **Software Development Engineer Intern**, Amazon Web Services (AWS) — EC2 Networking (Amazon VPC), May 2026 – Aug 2026, Herndon VA | content.ts:428–431; résumé lines 95–98 | **EYE** |
| 1 | Bullet (a): autonomous Claude Code agent with custom skills, **seven** production EC2/VPC canaries Scala → Java + JUnit 5, **~1 week → ~1 day** per test, gated on live integration testing | content.ts:434; résumé line 100 | **EYE (résumé)** |
| 1 | Bullet (b): canary framework extended with AWS SDK v2, CDK, CloudWatch; LIFO resource cleanup; VPC suite spanning **eight AWS services** in us-east-1; an authentication fix that unblocked CI | content.ts:435; résumé line 101 | **EYE (résumé)** |
| 1 | ProofChips: `7 agent-migrated tests` · `~1 week → ~1 day/test` · `8 AWS services` | content.ts:437 | **GATE** — `"7 agent-migrated tests"` is a locked `/experience/` fact |
| 2 | **Software Engineer Intern**, University of Maryland (Observatory), May 2025 – Sep 2025, College Park MD | content.ts:440–443; résumé lines 105–106 | **EYE** |
| 2 | Full-stack search platform (Python/Flask REST APIs, SQLite, JavaScript front end), **50,000+** telescope observation records | content.ts:446; résumé line 108 | **EYE (résumé)** |
| 2 | "Cut data-processing time 75% with a Python ETL pipeline ingesting FITS files." | content.ts:447; résumé line 109 | **EYE (résumé)** |
| 2 | "Merged four pull requests to the open-source observatory archive." | content.ts:448; résumé line 109 ("merged **4 pull requests**"); the fork's own README names them: PRs #1, #2, #4, #5 to `warnerem/CCD-data-archive` | **EYE (repo)** |
| 2 | ProofChips: `50,000+ records` · `−75% pipeline runtime` · `4 merged PRs`; proof link → github.com/warnerem/CCD-data-archive | content.ts:450–451 | **GATE** — `"50,000+ records"` is a locked `/experience/` fact |
| 3 | **Quantum Machine Learning Researcher**, University of Maryland (IonQ & NQL partnership), Aug 2023 – Jan 2025, College Park MD | content.ts:454–457; résumé lines 113–114 | **EYE** |
| 3 | Open-source quantum NLP text classifier, **four-person** team, Python pipeline feeding parsed sentences into parameterized quantum circuits (Qiskit, DisCoPy, pytket) | content.ts:460; résumé line 116 | **GATE** (team size) — `check-facts` forbids `/\b3[- ]person\|\bthree[- ]person/i` |
| 3 | "Unlocked IonQ quantum-hardware execution via qiskit-ionq backends; the team's enhanced SPSA/Adam/genetic optimizers cut test error from **41% to 4–9%** in simulation." | content.ts:461; résumé line 117; and the repo's own README: "standard SPSA 34%/41%, Enhanced SPSA 3%/4%, ADAM 7%/9%, genetic algorithm 6%/9%" over 20 runs, exact noiseless simulation | **EYE (repo)** — `FIRE-QML-WINNERS-QNLP/README.md:96` |
| 3 | "Co-built and open-sourced the research artifact and wrote up the comparison methodology." | content.ts:462 | **GATE** — `"co-built and open-sourced"` is a REQUIRED string |
| 3 | ProofChips: `4-person team` · `Qiskit/DisCoPy/pytket` · `qiskit-ionq backend`; proof link → iwang-1/FIRE-QML-WINNERS-QNLP | content.ts:464–465 | **EYE** |
| 4 | **Software Engineer Intern**, Washington Software Inc., Mar 2022 – Aug 2023, Gaithersburg MD | content.ts:468–471; résumé lines 122–123 | **EYE** |
| 4 | "Saved ~15 engineering hours weekly" via automated presentation generation in Python (Selenium, BeautifulSoup), replacing the manual client-reporting workflow | content.ts:474; résumé line 125 | **EYE (résumé)** |
| 4 | Manual research/data-gathering replaced across **three product teams** with reusable Python automation in CI/CD | content.ts:475; résumé line 126 | **EYE (résumé)** |
| 4 | Structured logging, retries, error handling, tests; Jenkins CI/CD | content.ts:476 | **EYE** — see §9, Jenkins |
| 4 | ProofChips: `~15 hrs/week saved` · `3 product teams` | content.ts:478 | **EYE** |

### Community & Teaching (content.ts:482–522, teal tags)

| # | Rendered | Source | Checked |
| --- | --- | --- | --- |
| 5 | **Vice President**, Kids For Code, Dec 2021 – May 2023, Remote: **3,000+** students, **400+** lessons, **10+** instructors, **25%** enrollment growth | content.ts:484–493; résumé line 168 ("400+ coding lessons to 3,000+ students, growing enrollment 25%") | **GATE** (partial) — `"3,000+ students"` is a locked `/experience/` fact; the 10+ instructors figure is **EYE**, see §9 |
| 5 | Tags: `3,000+ students` · `400+ lessons` | content.ts:494 | **GATE** — as above |
| 6 | **Technical Program Manager**, CodeDay, Nov 2019 – Dec 2022, Washington DC–Baltimore Area: **500+** participants, **200+** schools, sponsorships **(including Vercel and Brave)** | content.ts:497–505; résumé line 169 ("secured Vercel and Brave sponsorships; led outreach to 200+ schools") | **EYE** — the parenthetical **currently renders** (content.ts:504, 1 occurrence). The 500+ figure is **EYE**, see §9 |
| 6 | Tags: `500+ participants` · `200+ schools` | content.ts:507 | **EYE** |
| 7 | **Software Programming Instructor**, Panda Programmer, Mar – Nov 2022, Gaithersburg MD: Python, JavaScript, Scratch; ages 6–12 | content.ts:510–519; résumé line 170 | **EYE** |
| 7 | Tags: `Python` · `JavaScript` · `Scratch` | content.ts:520 | **EYE** |

### Confidentiality

The AWS bullets use **only public AWS product names** — EC2, VPC, canary,
CloudWatch, CDK, SDK v2, us-east-1 — never an internal system or codename. The
term/URL denylist is deliberately **not** in this repo: a private pre-push scan
next to the publish script enforces it over the working tree **and the full git
history** before anything is pushed. `check-facts.mjs` keeps the framing/number
tripwires, the required-string lists, the phone tripwire, and the banned voice
words (`passionate`, `results-driven`, `detail-oriented`, `rockstar`, `ninja`,
`cutting-edge`).

Do not add, round, or invent beyond the résumé on any AWS claim.

---

## 5. The three systems (`featuredSystems`, content.ts:188–299)

Rendered twice: Home `#systems` "Featured engineering work" as
`variant="preview"`, and `/projects/` "Built from scratch" as the full sheet.
**GATE** (verify.mjs:1331–1350, cross-page): the two pages may share at most
**3** identical >150-char text blocks — one summary per project. The home page
previously rendered 13 byte-identical blocks, i.e. it *was* the projects page.

**Every number here is the repo/benchmark figure, not the résumé figure.** The
résumé's soak counts (1,400 / 2,640) must never render — see §1f.

### 5a. parallax-kv — Go (content.ts:189–239)

| Rendered | Source | Checked |
| --- | --- | --- |
| Three-node Raft KV from scratch: PreVote, ReadIndex, persist-before-send ordering, snapshots, a durable WAL, a gRPC runtime | `parallax-kv/README.md:12–13, 28` | **EYE (repo)** |
| "A deterministic stress harness ran **2.9 million client operations** through partitions, crashes, message loss, delays, and snapshot churn. Zero safety or linearizability violations." | `parallax-kv/docs/BUG_LEDGER.md:27` — "2,914,245 client operations over 1,400 scenario runs"; four per-step safety invariants + end-of-run Porcupine linearizability, "zero genuine consensus bugs" | **GATE** — `"2.9 million client operations"` is REQUIRED_IN_CONTENT (§1b); `"2.9M"` is a locked `/` fact and `"2.9 million"` a locked `/projects/` fact |
| Footnote: "The first bug the harness caught was in my own **election-safety check**, not in consensus. Not built: chunked snapshot streaming or incremental snapshots." | `parallax-kv/docs/BUG_LEDGER.md:59` — "election-safety check fired on every fault-injecting scenario" | **EYE (repo)** — the component name is load-bearing. It is the **election-safety check**, not the linearizability checker; those are two different components and the ledger names the first. Do not "correct" this. |
| Proof sentence: "Proposing queued writes together cut WAL fsyncs from **2.23 to 0.46 per write**, and raised durable throughput at 64 clients from **102 to 1,408 writes per second**." | `parallax-kv/benchmarks/RESULTS.md` §[W3] (table row `\| 64 \| 102.0 \| 763.7 ms \| 1,407.7 \| 60.3 ms \| 13.8x \|`; "570 WAL fsyncs ... (2.23 per write) and 118 after (0.46 per write)"); raw `benchmarks/raw/W3_batched_apple_m3max.txt`; fsync counts from `server.TestConcurrentWritesShareFsyncs` | **EYE (repo)** |
| "Production log compaction keeps each node at **about 1.3 MB on disk instead of 11.5 MB**." | `parallax-kv/benchmarks/RESULTS.md` §[W4] (node 1: 1,268 / 1,272 KiB with `--snapshot-entries 10000` vs 11,464 / 11,692 KiB without, after ~45,000 writes); raw `benchmarks/raw/W4_compaction_apple_m3max.txt`. The figure depends on where in the snapshot cycle a run stops; RESULTS notes a 3,200 KiB exploratory run. | **EYE (repo)** |
| Footnote "Not built: chunked snapshot streaming or incremental snapshots." | `parallax-kv/README.md` design boundaries and `docs/DESIGN_NOTES.md` §10 scope limits. Production snapshot scheduling is now built (`server/drive.go` `maybeSnapshot`), so it was removed from this list. | **EYE (repo)** |
| Metric `1,408 w/s` · durable writes · c=64 | `RESULTS.md` §[W3], same row (median of 3 runs, 1,407.7) | **EYE (repo)** |
| Metric `60 ms` · p99 latency · c=64 (glossed "near-worst-case write time") | same row (60.3 ms) | **EYE (repo)** |
| Metric `2.9M` · client operations checked | `BUG_LEDGER.md:27` | **GATE** — as above |
| Provenance: "3 nodes · soak: 6 simulated clients, virtual time · throughput: localhost, c=64, Apple M3 Max, 4 KiB fsync p50 ≈ 3.96 ms · measured 2026-11-13" | `RESULTS.md` §[W3] (three `parallaxd` processes on localhost, Apple M3 Max, fsync p50 3.96 ms); header of `benchmarks/raw/W3_batched_apple_m3max.txt`. The earlier c=8 / 0.89 ms figures ([W1]) describe the pre-batching code on another host and are no longer rendered. | **EYE (repo)** |
| Chips: Go · Raft · gRPC · Porcupine · deterministic simulation | `README.md:12–13, 23, 144, 232` | **EYE (repo)** |
| Artifact deep link → `docs/BUG_LEDGER.md` on GitHub | content.ts:221–224 | **EYE** — external; `verify.mjs` only resolves **same-origin** links (line 470) |

### 5b. accretion-db — Rust (content.ts:240–270)

| Rendered | Source | Checked |
| --- | --- | --- |
| Embeddable LSM engine: CRC-framed WAL, group commit, memtables, block SSTables, bloom filters, size-tiered compaction | `accretion-db/benchmarks/RESULTS.md`; `accretion-db/src/lib.rs` | **EYE (repo)** |
| "The crate root forbids unsafe code, so the engine has no unsafe blocks by construction." | `accretion-db/src/lib.rs:24` — `#![forbid(unsafe_code)]` | **EYE (repo)** — this is the precise, checkable form of the claim; keep the mechanism named |
| "Results are benchmarked against sled, **including the cases where sled wins**." | `RESULTS.md:186–200` — §6 publishes three matched comparisons, "**sled wins every matched comparison on this host**" | **EYE (repo)** — the concession is the credibility; do not trim it |
| "Fault-injection and property tests confirm that acknowledged writes survive simulated crashes, and that **multi-key write batches are all-or-nothing at every crash point**." | `accretion-db/tests/crash.rs` module `batches` (exhaustive sweep, both durable modes; the verifier requires the whole key space to equal the acked batches with or without the entire in-flight batch); `README.md` crash-harness table. The run count is deliberately not rendered (§1f). | **EYE (repo)** |
| "Index-seeking range scans cut **per-scan p50 from 22.4 ms to 0.26 ms**." | `accretion-db/benchmarks/RESULTS.md` §4 "Update: index-seeking scans" (22.36 ms → 0.265 ms, Apple M3 Max, same host before/after); raw `benchmarks/raw/b3_scan_apple_m3max_{before,after}.txt`. Note: a different host from this card's provenance line, which describes the WAL / fdatasync metrics. | **EYE (repo)** |
| Metric `~29x` · WAL-bound group commit (glossed "gain from batching log writes") | `RESULTS.md:70` — "**Group-commit multiplier: 8,082 / 276 ≈ 29× at c=64**"; the table at `RESULTS.md:64` gives `GroupCommit` 8,082 and `Always` 276 at c=64 | **GATE** — `"~29x"` is REQUIRED_IN_CONTENT (§1b) |
| Metric `878 µs` · fdatasync p50 (glossed "median durable-write flush") | `RESULTS.md:36` — `\| sync_data (fdatasync, 4 KiB) \| **878 µs** \| **975 µs** \|` | **GATE** — `"878 µs"` is REQUIRED_IN_CONTENT (§1b) |
| Footnote: "The ~29x group-commit figure is **WAL-bound**. Compaction runs synchronously under the write lock, which caps full-engine throughput." | `RESULTS.md:71` and §3a's framing ("This isolates the commit pipeline… the regime the group-commit math describes") | **EYE (repo)** — this scope note is what keeps ~29x fair to quote |
| Provenance: "16-byte keys / 100-byte values · ext4 on NVMe · Xeon 8488C · measured 2026-07-13" | `RESULTS.md:51` (16-byte keys / 100-byte values), `RESULTS.md:16` (Intel Xeon Platinum 8488C, 48 vCPU), `RESULTS.md:20` (ext4 on NVMe, `noatime`) | **EYE (repo)** — the **date** is the weak cell; see §9 |
| Chips: Rust · LSM tree · group commit · crash consistency · proptest | `RESULTS.md`; repo source | **EYE (repo)** |
| Artifact deep link → `benchmarks/RESULTS.md` on GitHub | content.ts:253–257 | **EYE** — external |

### 5c. lodestone — Rust (content.ts:271–298)

The benchmark backing these is **committed in this repo**:
`benchmarks/lodestone/bench_50k_128d.txt` (27 lines; header `captured
20260716T005157Z`, host `Intel(R) Xeon(R) Platinum 8488C, 48 vCPU`, rustc
1.95.0). Verified byte-identical to lodestone's own
`benchmarks/raw/bench_50k_128d.txt` on 2026-08-06.

| Rendered | Source (line in `benchmarks/lodestone/bench_50k_128d.txt`) | Checked |
| --- | --- | --- |
| HNSW proximity graph + IVF-PQ compressed index over hand-written AVX-512 and ARM NEON distance kernels with runtime feature dispatch | line 6 (`backend=avx512`); `lodestone/src/distance/neon.rs`; `lodestone/README.md` | **EYE (repo)** |
| "...and both index types reload from checksummed files **in under 100 ms** instead of seconds of rebuilding." | `lodestone/benchmarks/raw/persistence_apple_m3max.txt`: HNSW load 89–93 ms vs 9.4 s build; IVF-PQ load 71–75 ms vs 3.9–4.0 s build. | **EYE (repo)** |
| "On Apple Silicon, the NEON kernels run **6 to 12 times faster per distance call** than scalar code." | `lodestone/benchmarks/raw/kernels_apple_m3max.txt` (speedup column spans 6.0x–11.7x); `lodestone/README.md` § Apple Silicon (NEON). Written as "times" so the band gate's `x across` pattern does not read it as an oracle-speedup claim. | **EYE (repo)** |
| "**0.976 recall@10** at about **31,800 queries per second**" on one core | line 14 — `\| 32 \| 0.9759 \| 31845 \|` | **GATE** — derived lock §1a: recall must match a real row (±0.0006), QPS within 2% of a measured value |
| "about **33x** the exact brute-force search at that recall" | line 7 — `exact brute-force oracle: 971 QPS`; 31845 / 971 = 32.8 | **GATE** — derived lock: must be ≤ measured max ratio + 1 |
| "**9–33x** across the 90%+ recall band" | rows ≥ 0.90 recall (lines 14–17): 31845, 20946, 13514, 8898 ÷ 971 = 32.8x … 9.2x | **GATE** — derived lock: stated endpoints must be the real endpoints |
| "The baseline… runs in parallel across all 48 cores while the search runs on one, so the two sides of that ratio are **not core-for-core**." | line 2 (48 vCPU host), line 7 (oracle is "parallel, full corpus scan") | **GATE** — `"not core-for-core"` is REQUIRED_IN_CONTENT (§1b). The most deletable sentence on the site: removing it strengthens the claim and breaks nothing, which is exactly why it is gated. |
| Footnote: "IVF-PQ trades accuracy for footprint: **0.975 recall@10 at 16x** memory compression. Single machine, single core. Not built: distributed sharding." | line 25 — `\| 8 \| 0.9748 \| 4110 \|`; line 22 — `ivfpq compression ratio: 16.0x` | **GATE** — derived lock covers the recall (0.9748 rounds to 0.975); the 16x is **EYE (repo)** |
| Metric `0.976` · HNSW recall@10; `~31.8K` · queries/sec · 1 core | line 14 | **GATE** — derived lock |
| Provenance: "50,000 x 128-d · k=10 · search on 1 core, brute-force baseline on 48 · Xeon 8488C · measured 2026-07-16" | lines 1–2, 4, 6 (`n=50000 dim=128 queries=1000 k=10`), line 7 | **GATE** (partially) — the generator asserts run-header values byte-exact into the figure; the prose strip in `content.ts` is **EYE** |
| Chips: Rust · HNSW · IVF-PQ · AVX-512 & NEON SIMD · RAG retrieval | `lodestone/README.md` | **EYE (repo)** |
| Artifact deep link → `benchmarks/raw/bench_50k_128d.txt` on GitHub | content.ts:284–289 | **EYE** — external. Note the *href* points at lodestone's `benchmarks/raw/` path while this repo's copy lives at `benchmarks/lodestone/`; both files are byte-identical. |

### 5d. The generated sweep figure (Home `#systems`)

`src/generated/sweep-figure.ts` — **generated, never hand-edited.** Emitted by
`scripts/generate-figures.mjs` from the benchmark above: 10 samples (HNSW ef
16/32/64/128/256, IVF-PQ nprobe 1/4/8/16/32) plus the 971 q/s oracle, ordered by
throughput ascending because the transcription table's caption states that
ordering. Palette values are read from `src/styles/tokens.css` and emitted as
`var()` references, so no hex is duplicated in the tree. Source sha256 is
recorded in the module header.

**GATE**: `generate-figures --check` in CI (§1d) + the byte-exact-substring
assertion at generation time.

### 5e. Star Catalog System — REMOVED, do not reintroduce

The three-repo star-catalog system (ingest / api / web, plus the spectral
classifier) was removed from the site on 2026-07-13. The GitHub repos are
deleted and the old live demo URL 404s, so re-rendering any of it would advertise
work that no longer exists.

**GATE**: `verify.mjs` asserts `star-catalog`, `star-spectral` and `sky map` are
absent from the rendered `/projects/` DOM. Regression tripwire only — see §1f.

---

## 6. Other projects (`projects`, content.ts:536–635 → `/projects/` "More projects")

Fourteen cards, in this DOM order. Every one links a public repo. The eight
older cards render their license as `<license> License`; the six newer repos
(the first six rows) carry no license file yet, so their cards show none.

| id | Rendered title | Repo link | License | Source of the claims | Checked |
| --- | --- | --- | --- | --- | --- |
| `relaybench` | **RelayBench** — injected faults (a reservation that succeeds but reports a timeout), two policies on the same inventory, request and fault, deterministic replay. Result line: "With a timeout that hides a committed write, a blind-retry policy double-books the reservation in 12 of 12 seeds, while a reconcile-first policy passes all 12. All 72 recorded runs replay exactly." | iwang-1/relaybench | none | `relaybench/README.md` opening, "See the failure on GitHub", "Run the demo"; result line from "Reproduce the results" table (Blind retry, lost acknowledgment 0/12; Reconcile 12/12) and "All 72 recorded trajectories verified on replay" | **EYE (repo)** |
| `spillway-join` | **Spillway Join** — external-memory inner equijoin in Rust under a fixed build-memory budget; partitions, recursion, bounded blocks for skewed keys; every output checked row for row against SQLite. Result line: "Choosing the partition fanout from the data, instead of a fixed 16, cut median end-to-end time on a 100,000-row join from 1.227 s to 0.468 s, about 2.6x faster." | iwang-1/spillway-join | none | `spillway-join/README.md` "How the budget changes execution" steps 1–4 and "Reproduce the evidence" (verifier compares every triple against SQLite); result line from "What changed after measuring the first version?" (1.227 s → 0.468 s; 2.6x derived) | **EYE (repo)** |
| `batchwindow` | **BatchWindow** — single-request, FIFO and deadline-aware policies; on small traces, each one's gap from an exact offline optimum. Result line: "On the recorded burst trace, deadline-aware batching left 4 of 12 requests late, against all 12 for FIFO batching, while using 30% less device time." | iwang-1/batchwindow | none | `batchwindow/README.md`: "an exact offline reference for small traces"; "How far are the online policies from optimal?" (48 eight-request traces); result line from "Recorded synthetic experiment" table (FIFO 12 late / 484 ticks; deadline 4 late / 338 ticks; 30% derived) | **EYE (repo)** — "on small traces" is load-bearing |
| `leasepost` | **LeasePost** — durable single-host SQLite job queue with fenced leases; tests race concurrent claims and kill real worker processes. Result line: "A recorded contention run validated 256 job histories across eight worker processes, and eight racing redrives of one dead job extend its attempts exactly once." | iwang-1/leasepost | none | `leasepost/README.md` opening (paused worker), "Reproduce the evidence" (twelve racing claims, killing a real child process); result line from "Reproduce the evidence" (256 job histories, eight worker-process slots) and "Recover an exhausted job" (eight redrives, exactly one extends) | **EYE (repo)** |
| `minuteledger` | **MinuteLedger** — corrections and deletions after a window is published; each revision in a durable changelog consumers replay from a checkpoint. Result line: "600 seeded updates match an independent offline computation, and 40 trials that crash it twice before chosen database writes all recover to the uninterrupted result." | iwang-1/minuteledger | none | `minuteledger/README.md` opening and "Processing semantics"; result line from differential-test paragraph (600 seeded updates) and crash-test paragraph (40 trials, two crashes each) | **EYE (repo)** |
| `testtrail` | **TestTrail** — selects tests a change could reach through imports, prints the shortest import path; for a fast first CI lane, with the full suite as the merge gate. Result line: "On faults injected into a real project, it selected all five failing test pairs out of six and skipped the one that passed." | iwang-1/testtrail | none | `testtrail/README.md` "How it works" and "Interpretation" ("keep the full suite as the merge gate"); result line from "Check predicted tests against observed failures" (5 failing of 6 pairs selected, one passing skipped) | **EYE (repo)** — do not claim a full-suite fallback; the README does not |
| `dann` | **Unsupervised Domain Adaptation for Sentiment** | iwang-1/cross-domain-sentiment-dann | MIT | `cross-domain-sentiment-dann/README.md:6–8` (Yelp, Amazon, Twitter/X, Reddit; DistilBERT; gradient-reversal DANN) | **GATE** (partial) — `"unsupervised domain adaptation"` is a REQUIRED string; `"Unsupervised Domain Adaptation"` is a locked `/projects/` fact |
| `dann` | "The committed CSV is a **smoke-scale artifact, so this page quotes no accuracy numbers.** The full figures live in the linked repo's team report." | `cross-domain-sentiment-dann/README.md:141` — "`results/dann_results.csv` is a smoke-test-scale local run" | **GATE** — the report figures are **un-renderable by design**: `check-facts` forbids `/74\.2\s?%\|67\.7\s?%\|64,?000/` and `/\+26%/`, and `verify.mjs` asserts `74.2%` / `67.7%` / `64,000` are absent from the DOM |
| `fire-qnlp` | **Quantum NLP research (FIRE)** — "Four-person research project, co-built and open-sourced. My role was dataset preparation, experiment integration, and project documentation." + "compares optimizer and ansatz variants in **exact noiseless simulation** with documented methodology" | iwang-1/FIRE-QML-WINNERS-QNLP | GPL-3.0 (repo ships GPL v3) | `FIRE-QML-WINNERS-QNLP/README.md:84` (exact noiseless simulation via DisCoPy `Circuit.eval()`, JIT-compiled with JAX, 20 runs capped at 2,000 iterations) | **GATE** — `"Four-person research project, co-built and open-sourced"` and `"co-built and open-sourced"` are REQUIRED strings; `"Four-person research project"` is a locked `/projects/` fact; `check-facts` forbids any three-person spelling. **Framing lock: never "contributed to"** — `check-facts` allows that phrase in exactly one allowlisted sentence and nowhere else. |
| `genai` | **Generative AI & LLM experiments** — RAG pipeline built stage by stage in LangChain (tokenizers → chunking → embeddings → retrieval → QA chat); Streamlit/Gradio LLM apps; GAN/VAE studies in PyTorch; "Each notebook isolates one idea." | iwang-1/generative-ai-experiments | MIT | The repo's own README (local working copy `github-profile-work/cmsc398o-staging`, remote `iwang-1/generative-ai-experiments`) states the RAG-pipeline stages, Streamlit/Gradio apps, GAN/VAE work, and "each notebook isolates one idea" nearly verbatim | **EYE (repo)** — and see §9: **no LICENSE file is tracked in my local clone of this repo**, while the card renders "MIT License" |
| `prof-rating` | **Professor rating prediction** — predicts a PlanetTerp average star rating from review text (VADER sentiment + review count) "**without ever using the star ratings as features**"; "On a committed, seeded snapshot, a Ridge model over the review text plus those two features explains **86% of the variance** on held-out professors (test R² **0.859**), against **0.771** for the original two-feature linear regression." | **iwang-1/professor-rating-prediction** | MIT | `professor-rating-prediction/README.md` (results table: `TF-IDF + 2 features + Ridge` 0.859, `LinearRegression (2 features)` 0.771) and `results/model_comparison.csv`, which CI regenerates from `data/planetterp_snapshot.csv.gz` and diffs. LICENSE tracked. | **GATE** (partial) — `check-facts` forbids `/\b80(\.0)?\s?%/`. The 86% / 0.859 / 0.771 figures are **EYE (repo)**. **This card renders a public repo link.** |
| `survey-analysis` | **Survey response analysis** — reusable cleaning function, then chi-squared tests with **Bonferroni correction** on moral-judgment questions | iwang-1/survey-response-analysis | MIT | `ds-survey-analysis/README.md:3` — near-verbatim | **EYE (repo)** |
| `gender-perception` | **Gender perception study** — chi-squared testing on gender-swapped survey scenarios, "with the method written down" | iwang-1/gender-perception-study | MIT | `ds-gender-perception/README.md:1, 3, 18` | **EYE (repo)** |
| `weather-attendance` | **Weather vs. attendance study** — per-group detrending, WMO/NWS rain classification, Welch's t-tests, then a rain-plus-wind regression | iwang-1/weather-attendance-study | MIT | `ds-weather-attendance-study/README.md:3, 7, 15` — verbatim on all four methods | **EYE (repo)** — note the card quotes **only methods, no results**; the repo's own results are mixed (p = 0.025 with all rain counted, p = 0.07 reclassified) and the card does not claim a finding. Keep it that way. |
| `this-site` | **This site** — "multi-page React + TypeScript + Vite site on GitHub Pages. It prerenders to static HTML, works without JavaScript, and **won't deploy** if a fact check or Playwright assertion fails." Chips: React + TypeScript + Vite · fact-gate in CI · Playwright-verified · no trackers | iwang-1/iwang-1.github.io | MIT | This repo: `package.json` (`prebuild` → check-facts; `verify` → playwright), `.github/workflows/deploy.yml:27–44`, `scripts/prerender.mjs` | **GATE** — `"This site"` is a locked `/projects/` fact; the prerender claim is asserted by `verify.mjs` (every `dist` HTML must carry full static `#root` markup **and must not** pre-bake the `.js` class); the deploy claim is structurally true per §1e. **The verb "deploy" is load-bearing** — see content.ts:616–631. |

### Retired project rows — reference only, do not "restore"

| Row | Why it is gone | Checked |
| --- | --- | --- |
| RAG Research Assistant | Removed from the site. No public repo, and the old 95% QA figure is forbidden. | **GATE** — `check-facts` forbids `/\b95\s?%/`; `verify.mjs` asserts `95%` is absent from `/projects/` |
| The `qnlp_lorenz` fork | Must appear nowhere. | **GATE** — `check-facts` forbids `/qnlp_lorenz/i` |
| The two standalone open-source cards ("Contributed to an open source project: 4 merged pull requests to warnerem/CCD-data-archive" and the lambeq #259 card) | **Neither renders any more.** Grep confirms no `Contributed to` string in `src/`, and no `lambeq` anywhere in `src/`. The CCD work now renders **only** as experience role 2's third bullet + the `4 merged PRs` chip + the proof link (content.ts:448–451). | **GATE, but dormant** — `check-facts` still enforces both locks against the day either card returns: the `contributed to` exact-sentence allowlist, and the proximity lock (`merged` may never appear within 200 chars of `lambeq`, per file and on `dist/projects/index.html`); `verify.mjs` re-checks the proximity lock on the rendered page. **These gates currently have no live subject.** |

---

## 7. Home page — other sections

### 7a. Hero readout rail (content.ts:33–113)

Three repos, one measured cell each, values identical to the corresponding
`featuredSystems.metrics`: parallax-kv `2.9M` client operations checked ·
accretion-db `878 µs` fdatasync p50 · lodestone `0.976` recall@10.

`what` and `plain` are **surfacing, never new claims**: each `what` is the
opening noun phrase of that project's own summary, and each `plain` names what
the metric IS rather than asserting a second measurement. Do not let a future
edit turn a `plain` into a claim.

The `awsLine` paragraph (content.ts:110) restates only facts already in
`engineeringRoles[0]` — org, dates, and the first bullet's own numbers.

**GATE** (verify.mjs:716–819): rail overlap and mid-token-wrap gates at 320px —
the name track must fit its mono anchor, not merely stop overlapping.

### 7b. Hobby section — rendered title is **"Outside of work"**

`hobbies` (content.ts:124–153). `title: "Outside of work"` at **content.ts:125**.

> The string **"Off the clock"** survives only in a **code comment** at
> content.ts:116, describing the section's history. It is not rendered anywhere.
> A previous revision of this file reported it as the rendered title; it was
> wrong.

| Rendered | Source | Checked |
| --- | --- | --- |
| Title "Outside of work"; intro "A few things I spend my free time on." | content.ts:125–126 | **EYE** |
| "Building keyboards" + blurb; the drawn keyboard figure | content.ts:131–134; `src/components/Keyboard.tsx` | **GATE** — keyboard tab-budget + hit-alignment gate and keyboard-trap gate (verify.mjs:884, 954) |
| "Rock climbing" + blurb; the boulder figure | content.ts:135–138; `src/components/Boulder.tsx` | **GATE** — the boulder's contract (verify.mjs:521–569): exactly **3** sequences at **equal weight** (equal stroke/width/opacity — an unequal one would assert a correct beta), ≥12 on-route and ≥4 off-route holds, **no invented problem identity** (`SET 01`, `BOULDER / SET`, `top out at` are forbidden), and the `aria-label`'s hold count must be **derived from the data** and equal the painted count — a spelled-out number is rejected outright because a word cannot be derived |
| "Following the industry" + blurb + a 4-row follow list (hardware / AI policy / keyboards / the industry) | content.ts:139–152 | **EYE** |
| **NO leadership claims in this section** — owner decision 2026-07-27. The "Secretary of the UMD Climbing Club · 8 trips · 30%" line is **résumé-only** (résumé line 171). Do not re-add without his ask. | — | **EYE** — ungated. Nothing forbids the string. |

### 7c. Skills — the FIVE rendered rows (content.ts:348–379)

Rendered as `<label> · item · item · …` per row, in this order:

| Row label | Items | Checked |
| --- | --- | --- |
| **Languages** | Python, Java, Go, Rust, TypeScript/JavaScript, Scala, SQL, Bash | **EYE** — all appear on the résumé's Languages line (159) |
| **Distributed & storage** | Raft, gRPC/Protobuf, LSM trees, PostgreSQL/SQLite | **EYE** — Raft/LSM/SQLite/gRPC/Protobuf on the résumé (projects + Frameworks/Tools lines) |
| **Backend, web & testing** | Flask/FastAPI, Node.js, JUnit 5, Playwright | **EYE** — Flask/FastAPI/Node.js/JUnit 5 on the résumé's Frameworks line; **Playwright** is this repo (`package.json` devDependency, `verify.mjs`) |
| **ML & NLP** | PyTorch, HuggingFace, scikit-learn, LangChain, JAX, Qiskit, DisCoPy, pytket | **EYE** — PyTorch/scikit-learn/LangChain/Qiskit on the résumé; DisCoPy/pytket/**JAX** in `FIRE-QML-WINNERS-QNLP/README.md:84`; HuggingFace/LangChain in the generative-AI and CMSC472 repos |
| **Cloud & CI** | AWS (EC2/VPC, SDK, CDK, CloudWatch), Docker, Linux, GitHub Actions, CI/CD, Jenkins | **EYE** — AWS/Docker/Linux/CI-CD on the résumé's Tools line; **GitHub Actions** is this repo (`.github/workflows/deploy.yml`); **Jenkins** — see §9 |

> The rows are **not** "Languages / Frameworks / Tools". That is the *résumé's*
> three-row grouping (résumé lines 159–161); the site regroups the same items
> into five rows so a reader keyword-matching against a req can find them.
> Nothing was added or removed in the regrouping — but the row labels themselves
> are a site-only structure, so do not "restore" the résumé's three.

### 7d. Section order and structure (Home)

Hero → **Featured engineering work** (`#systems`, rank 1, the sweep figure then
three preview plates then the exit link) → **Open source** (`#open-source`,
rank 2) → **Background** (`#background`, containing `#education` and `#skills`)
→ **Outside of work** (`#off-hours`, rank 2) → contact band.

The work leads by owner call of 2026-11-16, reversing the earlier
personality-first order (PRODUCT.md, constraint 2). The exit link reads
"14 more: developer tools, data systems, ML, NLP, statistics, and this site"; the
count is `projects.length`, so it cannot drift from the cards, and the categories
are the ones those fourteen cards' own titles and chips carry. It targets
`/projects/#selected`.

### 7e. Open source (Home, `#open-source`, `content.ts` `openSource`)

| Rendered | Source | Checked |
| --- | --- | --- |
| Intro: "Bugs I found and fixed in other people's projects. Each was reproduced before it was fixed." | Each row's pull request describes its reproduction (RocksDB: a crash test; Abseil: a failing `-Werror` build; SwiftNIO: an injected delay failing 3 of 3 runs; mimalloc: the UBSan report). | **EYE (repo)** |
| Microsoft · mimalloc — **fixed upstream** — "the maintainer fixed it upstream, crediting the pull request" | microsoft/mimalloc commit `9743b2588`: "simplify mi_aligned_ptr_page0 and avoid UB, see PR #1491 by @iwang-1"; PR #1491 closed with the maintainer's comment that he fixed it directly. The PR itself was not merged, so the row says "fixed upstream", never "merged". | **EYE (repo)** |
| Meta · RocksDB — **under review** | meta/rocksdb#15675 (open as of 2026-11-16) | **EYE (repo)** — update the status word when it changes |
| Google · Abseil — **under review** | abseil/abseil-cpp#2501 (open as of 2026-11-16; Google CLA pending) | **EYE (repo)** — same |
| Apple · SwiftNIO — **under review** | apple/swift-nio#3791 (open as of 2026-11-16) | **EYE (repo)** — same |

**GATE**: exactly one `.contact-band` per page; every same-origin link resolves
200 (so `#selected` cannot rot); the one-left-spine alignment gate checks
`.hero .kicker` **and** `.section .section-head h2` on `/` against the nav
anchor.

---

## 8. Site / meta

| Rendered | Source | Checked |
| --- | --- | --- |
| 4 pages: `/` (index.html), `/experience/`, `/projects/`, `/404.html` — each hand-writes its own head | the four HTML entries; `src/pages/*/main.tsx` | **GATE** — `verify.mjs` asserts per-page title, canonical, and noindex; `/404.html` is `noindex` with no canonical |
| Titles: "Ivan Wang — Software Engineer · UMD CS · AWS SDE Intern" / "Experience — Ivan Wang" / "Projects — Ivan Wang" / "Page not found — Ivan Wang" | index.html:6 etc. | **GATE** — verify.mjs PAGES table |
| Meta description + OG description: "Software engineer. CS B.S./M.S. (Departmental Honors) at the University of Maryland, SDE intern at AWS for Summer 2026, seeking new-grad SWE roles for Summer 2027." | index.html:9, 48 | **EYE** |
| JSON-LD `Person`: jobTitle "Software Engineer"; description naming the M.S. May 2027 and the AWS Summer 2026 internship; worksFor AWS; alumniOf/affiliation UMD College Park; sameAs GitHub + LinkedIn | index.html:69–98 | **EYE**. **The `Person` block declares no specialty-topic field on purpose** (index.html:61–68): naming a lane is what the owner removed from the bio on 2026-07-31, and it was still shipping in the layer an ATS reads first. schema.org `Person` is valid without it and it has no rich-result surface. **Do not add one back.** |
| `og:image` = /og.png, 1200×630, generated by `scripts/generate-og.mjs` from the live tokens | index.html:50–59; `public/og.png` | **EYE** |
| `<noscript>` quick-links block | index.html:102–111 | **EYE** — the prerender gate covers the no-JS *page*; the noscript copy itself is ungated |
| Footer colophon "Built with React + TypeScript + Vite · Deployed on GitHub Pages · No trackers"; "© 2026 Ivan Wang" | content.ts:657–660 | **EYE** |
| No trackers / no CDN fonts — 4 self-hosted subsetted faces in `public/fonts/`, both LICENSE texts shipped verbatim | `public/fonts/`; index.html:32–33 | **GATE** — the four `.woff2` must be in `dist/`; no `@font-face` may reference a remote origin; nothing may depend on `font-variant-numeric` (Martian Mono ships no `tnum` — its columns align on a fixed 0.750 em advance, so such a rule would be a silent no-op reading as a guarantee). The two OFL texts are the only files excluded from the fact scan, scoped to `public/fonts/LICENSE-*.txt` so a future `.txt` there is still scanned. |
| `robots.txt` allows all + points at the sitemap; `sitemap.xml` lists the three indexable pages with `lastmod 2026-07-16` | `public/robots.txt`, `public/sitemap.xml` | **EYE** — the `lastmod` dates are stale relative to the current tree; see §9 |
| Palette / world: **"DOUBLE-SHOT"** — a mechanical-keyboard spec sheet. Light surface, cap beige `#EDE7DA` (measured luminance 0.8022), case grey figures, one rust accent, slate data traces. Two token layers (raw → semantic) in `src/styles/tokens.css`. | `src/styles/tokens.css:1–60` | **GATE** — page-surface luminance must sit in a **two-sided** 0.62–0.93 band (so it can neither drift back to dark nor to paper white); **no italic anywhere** (a keycap legend has no italic — emphasis is a shifted sublegend); print-palette gate; primary-CTA contrast ≥ 4.5:1 at rest, hover **and** focus, with a focus ring that is not the button's own fill |
| Reduced motion honored | `src/index.css` | **GATE** — built CSS must contain both a `prefers-reduced-motion: reduce` block and a `no-preference` gate around the `.reveal` hidden state; and a full scroll must leave no `.reveal` without `.is-in`, including from a parked offset |
| Role logo intrinsic dimensions declared (`w`/`h` on every `RoleLogo`) | content.ts:403–424; the seven files in `public/logos/` | **EYE** — see §9, logo dimensions |
| No horizontal overflow; no console/page errors; no 4xx/5xx same-origin request; images have non-empty `alt` | — | **GATE** — all four, at every page × viewport |

> The previous revision of this file called the palette "Figure One (dark-first)".
> That world was **replaced** by the light DOUBLE-SHOT world on 2026-08-04, and
> `verify.mjs` now asserts the *opposite* of what the old note described. The
> string "Figure One" survives only in a `verify.mjs` comment recording the
> reversal.

---

## 9. Claims whose source I could not locate

These render on the site (or in this checklist's supporting detail) and no citable
artifact for them was found in the working tree, the three flagship repos, the eight
project repos, or the résumé. **None of them is necessarily wrong** — this records
that they could not be sourced, which is a different statement.

Six were opened on 2026-08-06 and four are now closed, each way it resolved kept in
place rather than deleted:

| # | Claim | Status |
|---|---|---|
| 1 | "10+ instructors" (Kids For Code) | **OPEN — only Ivan can confirm** |
| 2 | "500+ participants" (CodeDay) | **OPEN — only Ivan can confirm** |
| 3 | accretion-db "measured 2026-07-13" | **FIXED at the source** (date added to that repo) |
| 4 | "MIT License" on the genai card | **RESOLVED — the claim is true** (verified against GitHub, not the stale clone) |
| 5 | "Jenkins", two places | **OPEN — only Ivan can confirm** |
| 6 | the misnamed-image count | **NOT A DEFECT — the original comment was right; the correction was wrong** |

THE THREE STILL OPEN — #1, #2 and #5 — share a shape: each is a
number or tool from a role whose evidence lives outside every repo (LinkedIn, or
Ivan's memory). Nothing here suggests any of them is false. But a screener who asks
"where does 10+ instructors come from?" needs an answer that is not "the website
says so", so each should be either confirmed by Ivan or dropped — and dropping is
cheap, because none of the three is load-bearing.

1. **"Trained and coordinated 10+ instructors"** (content.ts:492, Kids For Code).
   The résumé's Kids For Code line (171 → line 168) carries 400+ lessons, 3,000+
   students, and 25% enrollment growth, but **no instructor count**. The `10+
   instructors` figure appears in the site copy only. Source: presumably LinkedIn
   or Ivan directly — not verifiable from anything in this tree.

2. **"500+ participants"** (content.ts:503 and the `500+ participants` tag,
   CodeDay). The résumé's CodeDay line names Vercel/Brave sponsorships and 200+
   schools, **not** a participant count. Same situation as above.

3. ~~**accretion-db provenance date "measured 2026-07-13"**~~ — **FIXED AT THE
   SOURCE 2026-08-06.** The finding was correct: content.ts:251 asserted a
   measurement date that `accretion-db/benchmarks/RESULTS.md` did not state, and no
   file under that repo's `benchmarks/raw/` carried a timestamp — unlike parallax-kv
   (raw headers read `2026-07-13T11:33:47Z`) and lodestone (header reads `captured
   20260716T005157Z`). Rather than soften the site's strip, the date was added to
   the repo's host-disclosure table (accretion-db commit `e4e6220`), sourced from
   the commits that added every raw file: "S6: full benchmark matrix on the build
   host + RESULTS.md" and "S6: capture fsync_probe raw outputs", both dated
   2026-07-13. The site's claim is now checkable where a reader would look. No
   number changed; accretion-db's full suite (100 tests) stayed green.

5. **Jenkins**, in two places: the Washington Software bullet "supported Jenkins
   CI/CD for consistent releases" (content.ts:476) and the `Cloud & CI` skills
   row (content.ts:376). The résumé's Washington Software bullets say "CI/CD
   pipelines" and its Tools line says "CI/CD" — **neither names Jenkins**, and
   the string appears nowhere else I could find. Plausible and probably true; not
   sourced.

6. ~~**The `.png`-named-but-actually-JPEG note**~~ — **NOT A DEFECT. The original
   comment was right and this entry was wrong; recorded because the mistake is
   instructive.** The note at content.ts:404-407 says "five of these seven are
   named `.png` and are actually JPEG (progressive, SOF2)". An earlier draft of
   this checklist claimed the count of MISNAMED files was four, listing `aws.png`,
   `kids-for-code.png`, `panda-programmer.png` and `umd.png`. Re-measured by
   reading all seven file headers: **`washington-software.png` is also JPEG**, so
   five files are misnamed, exactly as the comment says. Full result —
   MISNAMED (JPEG bytes, `.png` name): aws, kids-for-code, panda-programmer, umd,
   washington-software. Correctly named: `codeday.jpg` (JPEG). The only true PNG is
   `ionq.png`. All declared `w`/`h` values match the real headers.
   The lesson for this file: a "correction" is a claim too, and needs the same
   verification as the thing it corrects.

7. **`sitemap.xml` `lastmod` dates** are all `2026-07-16` while the tree has
   commits through 2026-08-06. Not a factual claim about Ivan, and nothing gates
   it, but it is a stale machine-readable assertion about the site.

8. **The AWS bullet metrics as a set.** Every AWS figure the site renders (seven
   canaries, ~1 week → ~1 day, eight AWS services, the auth fix) traces to the
   résumé and nowhere else — by design, since the underlying work is not public.
   That means **no gate and no artifact can check them**; they rest entirely on
   Ivan standing behind his own résumé. Recording that explicitly so a future
   reviewer does not mistake the résumé citation for independent evidence. Note
   the résumé's own bullet is deliberately hedged ("porting 7 …, gated on live
   integration testing"); the site's phrasing follows that hedge, and it should
   not be un-hedged here before it is un-hedged there.

---

## 10. Rules for editing this file

1. **No new factual claims.** This file may only record what the code already
   renders and cite where the evidence lives. Corrections may narrow or remove,
   never add.
2. **Cite a file and a line.** "resume" or "facts sheet" alone is not a citation
   a reviewer can follow; the previous revision's unfollowable citations are how
   it drifted.
3. **Change this file in the commit that changes what it describes.** Every
   confirmed drift in the 2026-08-06 rebuild existed because copy moved and this
   file did not.
4. **Never delete a live link or restore removed copy on this file's authority
   alone.** Check `src/content.ts` first. That is the failure mode this rebuild
   was written to prevent: the previous revision claimed the professor-rating
   project had no public repo while content.ts:573 linked one, and claimed the
   Vercel/Brave parenthetical had been dropped while content.ts:504 still renders
   it.
5. **This file is not scanned by `check-facts.mjs`** — that is deliberate, so it
   can quote the forbidden patterns it documents. It also means nothing here is
   machine-checked. Treat every unmarked row as **EYE**.
