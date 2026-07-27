# FACTS.md — rendered-number checklist

Human companion to `scripts/check-facts.mjs`. Every number or claim rendered
anywhere on the multi-page site maps to a line of the verified facts sheet
(2026-07-13). Re-verify this table before every deploy. This file is
intentionally OUTSIDE the check-facts scan set (`src/`, the four HTML entries,
`public/`, `README.md`) so it can describe the rules it enforces.

## Person

| Rendered | Source |
| --- | --- |
| Ivan Wang; github.com/iwang-1; linkedin.com/in/ivanwang1; ivanwang8989@gmail.com | resume |
| CS B.S./M.S. — Departmental Honors (research track: faculty-mentored, eligibility 3.5 CS-GPA / 3.25 overall; NEVER a thesis claim), UMD College Park; M.S. expected May 2027; GPA 3.6/4.0; minors Data Science + Philosophy | UMD CS departmental honors page + resume |
| SDE Intern, Amazon Web Services — May–Aug 2026 (always date-anchored "Summer 2026", never "currently") | resume |
| Open to new-grad SWE roles · available Summer 2027 | facts sheet · PERSON |
| NO phone number anywhere in site text (it exists only inside the resume PDF) | constraint 3 |

## Experience — the complete 7-entry inventory (`/experience/`)

One center-spine alternating timeline (single left column on mobile):
engineering roles reverse-chron with ProofChips, then a "Community & Teaching"
spine label, then the community roles (teal tags). Non-AWS bullet copy is the
LinkedIn verbatim text; AWS keeps its resume bullets (LinkedIn has none).

Engineering (reverse-chron), with ProofChips:

| # | Rendered | Source |
| --- | --- | --- |
| 1 | AWS SDE Intern, May–Aug 2026, Herndon VA — the two shipped bullets: (a) autonomous Claude Code agent with custom skills, seven production EC2/VPC canaries Scala→Java+JUnit5, ~1 week → ~1 day per test, gated on live integration testing; (b) canary framework extended with SDK v2/CDK/CloudWatch, LIFO resource cleanup, VPC suite spanning eight AWS services in us-east-1, auth fix that unblocked CI | resume (rebuilt 2026-07) |
| 2 | UMD Full-Stack SWE Intern, May–Sep 2025, College Park (Remote): 50,000+ records, REST APIs, ETL over 10+ yrs legacy data via cron, −75% pipeline runtime | resume + LinkedIn |
| 3 | UMD ML Engineer Intern, Aug 2023–Jan 2025, College Park: +30% NLP accuracy, −25% training time (SPSA/ADAM/SGD) | resume + LinkedIn |
| 4 | Washington Software Inc. SWE Intern, Mar 2022–Aug 2023, Gaithersburg: Selenium/BeautifulSoup automation, −40% manual work, 15+ hrs/week saved, Jenkins CI/CD | resume + LinkedIn |

Community & Teaching (timeline cards after the spine label, teal tags):

| # | Rendered | Source |
| --- | --- | --- |
| 5 | Kids For Code VP, Dec 2021–May 2023, Remote: 3,000+ students, 400+ lessons, 10+ instructors, 25% enrollment growth | resume + LinkedIn |
| 6 | CodeDay TPM, Nov 2019–Dec 2022, DC–Baltimore: 500+ participants, 200+ schools, partnerships/sponsorships (the "(including Vercel and Brave)" parenthetical was dropped — LinkedIn is the verbatim source; removing a claim is safe) | LinkedIn |
| 7 | Panda Programmer Instructor, Mar–Nov 2022, Gaithersburg: Python/JS/Scratch, ages 6–12 | resume + LinkedIn |

CONFIDENTIALITY: the AWS bullets use only public AWS product names (EC2, VPC,
canary, CloudWatch, CDK, SDK v2, us-east-1, Sev2) — never internal
system/codenames. A private pre-push gate (outside this repo) blocks the
codenames over the working tree and full git history. Every AWS metric (5x,
40%, 60%, 1M+) is a resume claim Ivan stands behind — do not add, round, or
invent beyond the resume.

## Education (Home `#education`)

| Rendered | Source |
| --- | --- |
| UMD College Park, B.S./M.S. CS — Departmental Honors (research track), Aug 2023–May 2027, GPA 3.6/4.0, minors DS + Philosophy, 9 coursework chips | UMD CS departmental honors page + resume |

## Home page extras

Design notes: the palette is "Figure One" (dark-first, sampled from the
committed benchmark plots; amber darkened for contrast —
src/styles/tokens.css). The hero readout rail carries the fold-level proof
(three repos, one measured cell each, values identical to
featuredSystems.metrics).

| Rendered | Source |
| --- | --- |
| Hobby section ("Off the clock"): mechanical keyboards, rock climbing, keeping up with tech — NO leadership claims by owner decision 2026-07-27 (the "Secretary of the UMD Climbing Club · 8 trips · 30%" line is resume-only now; do not re-add without his ask) | owner call |
| Skills rows exactly per resume (Languages / Frameworks / Tools) | resume |

## Star Catalog System — REMOVED

The three-repo star-catalog system (ingest / api / web, plus the spectral
classifier) was removed from the site on 2026-07-13; the underlying GitHub
repos are deleted and the old live demo URL 404s. Do NOT reintroduce it —
`verify.mjs` asserts `star-catalog` / `star-spectral` / `sky map` are absent
from the rendered /projects/ page.

## Systems projects (`featuredSystems` — Home "Featured engineering work" + `/projects/` "Systems projects")

Three from-scratch systems, each rendered as a SystemFeature card (summary +
proof + caveat + metric grid). Every number below is the exact repo/benchmark
figure — NOT the résumé figure. The résumé's soak counts (1,400 / 2,640) are on
verify.mjs's `absent` list for `/` and `/projects/`, so they must never render
here; the site quotes the operation count and the recall/QPS/compression curve
instead.

| Rendered | Source |
| --- | --- |
| parallax-kv (Go, public repo): Raft KV from scratch — PreVote, ReadIndex, WAL, gRPC; deterministic harness across 2.9 million client operations, zero safety/linearizability violations; 272 writes/s at 41 ms p99 (c=8) | repo README |
| accretion-db (Rust, public repo): embeddable LSM engine — CRC-framed WAL, group commit, bloom SSTables, size-tiered compaction, zero unsafe; ~29x WAL-bound group-commit edge, 878 µs fdatasync | repo README |
| lodestone (Rust, public repo): from-scratch vector search for embeddings/RAG — HNSW + IVF-PQ over hand-written AVX-512 kernels; HNSW 0.976 recall@10 at ~31,800 QPS single-core (~33x the exact oracle's throughput at that recall; 9x–33x across the ≥0.90 recall band — the old wider-band multiple is RETIRED and check-facts FORBIDS it: its top end sits at 0.8996 recall, below the band it asserted), IVF-PQ 0.975 recall@10 at 16x compression. Numbers = benchmarks/raw/bench_50k_128d.txt (50,000 x 128-d, 1,000 queries, k=10, single core) | repo README + bench raw |

## Other projects (`/projects/`)

| Rendered | Source |
| --- | --- |
| DANN (cross-domain-sentiment-dann, MIT): DistilBERT, LODO across Yelp/Amazon/Twitter/Reddit — REFERENCE-ONLY, UN-RENDERABLE BY DESIGN: the report figures (74.2 / 67.7 / 64,000) never render anywhere; check-facts FORBIDS them and verify.mjs asserts their absence. The card describes the pipeline and quotes no accuracy numbers. | repo README (reference only) |
| RAG Research Assistant: REMOVED from the site (no public repo, and the old 95% QA figure is check-facts-FORBIDDEN). Reference-only row; do not "restore". | historical |
| ML Professor Rating Predictor (Apr 2025, private / no public repo — no link): 13,000+ profiles, VADER, scikit-learn, R² 0.79 | resume |
| QNLP (FIRE-QML-WINNERS-QNLP, GPL-3.0): four-person project, "co-built and open-sourced" — NEVER "contributed to"; role = dataset preparation and integration + project documentation; enhanced optimizers beat out-of-the-box standard-SPSA by roughly 30 percentage points (exact noiseless simulation) | facts sheet · OPEN SOURCE |
| This site — public repo iwang-1/iwang-1.github.io, MIT, CI = check-facts + verify (no `date` field — none invented) | repo + this file |

## Open source (framing locks — two SEPARATE cards)

| Rendered | Source |
| --- | --- |
| Card A: "Contributed to an open source project: 4 merged pull requests to warnerem/CCD-data-archive" — the site's ONLY contributed-to claim; link = pre-filtered merged-PR query | facts sheet · OPEN SOURCE |
| Card B: lambeq #259 = 1 OPEN PR, "under review"; the word "merged" never appears within 200 chars of "lambeq" (check-facts enforces per file; verify.mjs enforces on the rendered page text) | facts sheet · OPEN SOURCE |
| The qnlp_lorenz fork appears nowhere | facts sheet · OPEN SOURCE |

## Confidentiality

Zero Amazon-internal information anywhere in the repo (or its git history).
The specific term/URL denylist is deliberately NOT in this repo — a private
pre-push scan next to the publish script enforces it over the working tree and
the full history before anything is pushed. `check-facts.mjs` keeps the
framing/number tripwires, required-string list, phone-number tripwire, and
banned voice words.
