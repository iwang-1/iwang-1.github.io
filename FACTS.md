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
| 1 | AWS SDE Intern, May–Aug 2026, Herndon VA: agentic AI system, 8+ tests Scala→JUnit5, 5x migration throughput, EC2 VPC control-plane APIs; canary infra on SDK v2/CDK/CloudWatch, us-east-1, −40% test runtime, −60% flaky failures, Sev2 alarms, 1M+ customers | resume |
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
| UMD College Park, B.S./M.S. CS — Departmental Honors (research track), Aug 2023–May 2027, GPA 3.6/4.0, minors DS + Philosophy, 10 coursework chips | UMD CS departmental honors page + resume |

## Home page extras

v3 design notes: the palette is now "Harbor Ink" (navy brand bands over a cool
near-white field — src/styles/tokens.css); the hero tri-card "Now" strip
(nowStrip) was removed — the availability proof-chip carries the who/what/when.

| Rendered | Source |
| --- | --- |
| Secretary of the UMD Climbing Club — 8 trips a semester, grew attendance 30% | resume |
| Mechanical keyboards + custom PCs hobby line (About P3) | facts sheet · ABOUT |
| Max ONE keyboard/climbing metaphor site-wide: the hero headline is it | design spec |
| Skills rows exactly per resume (Languages / Frameworks / Tools) | resume |

## Star Catalog System (`/projects/#star-catalog`)

| Rendered | Source |
| --- | --- |
| ingest: 101 tests · ~95% cov, mypy --strict, ruff, CI py3.11–3.14, v0.3.2 | facts sheet · PROJECTS |
| ingest processes telescope-observation CSVs (NOT the HYG dataset) | facts sheet · PROJECTS |
| api: 66 tests · ~97% cov, Dockerized · smoke-tested in CI, v0.2.3; cone search handles the RA 0/360 seam | facts sheet · PROJECTS |
| web: 8,920 naked-eye HYG v4.3 stars; Playwright-gated deploy; v0.1.0; live demo iwang-1.github.io/star-catalog-web/ | facts sheet · PROJECTS |
| classifier: 79.5% accuracy / 0.665 macro-F1 (once-touched hold-out) vs 72.3% zero-parameter physics baseline; O-class recall 0 (support 10) disclosed; 92.6% adjacent-class errors; 52 tests · 98.56% cov, mypy --strict, CI py3.11–3.13, v0.1.0 | facts sheet · PROJECTS |
| No rounding: 79.5 never becomes 80, 98.56 never becomes 99 | constraint (check-facts) |
| Test counts stay per-repo — never summed | constraint (check-facts) |
| Keep every `~` on coverage numbers | constraint (check-facts) |
| Trained on the SAME 8,920-star HYG snapshot as the web app (sha256-pinned) | facts sheet · PROJECTS |

## Other projects (`/projects/`)

| Rendered | Source |
| --- | --- |
| DANN (cross-domain-sentiment-dann, MIT): DistilBERT, LODO across Yelp/Amazon/Twitter/Reddit, 64,000 labeled samples, 16 experimental conditions, DANN moonshot, Financial PhraseBank OOD probe | repo README |
| DANN result line EXACTLY: "DANN reached 74.2% on Yelp and 67.7% average accuracy across held-out domains." — never "+26%", never an unqualified "74.2% on held-out domains" (74.2% is Yelp-only per repo README / report Table 2) | repo README · Table 2 |
| RAG Research Assistant (Jan 2025, private / no public repo — no link): LangChain+FAISS over 25+ papers, Streamlit + W&B, 95% policy-analysis QA | resume |
| ML Professor Rating Predictor (Apr 2025, private / no public repo — no link): 13,000+ profiles, VADER, scikit-learn, R² 0.79 | resume |
| QNLP (FIRE-QML-WINNERS-QNLP, GPL-3.0): 3-person UMD FIRE project, "co-built and open-sourced" — NEVER "contributed to"; role = dataset preparation and integration + project documentation; enhanced optimizers beat out-of-the-box standard-SPSA by roughly 30 percentage points (exact noiseless simulation) | facts sheet · OPEN SOURCE |
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
