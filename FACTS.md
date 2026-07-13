# FACTS.md — rendered-number checklist

Human companion to `scripts/check-facts.mjs`. Every number or claim rendered on
the site maps to a line of the verified facts sheet (2026-07-13). Re-verify
this table before every deploy. This file is intentionally OUTSIDE the
check-facts scan set (`src/`, `index.html`, `public/`, `README.md`) so it can
describe the rules it enforces.

## Person

| Rendered | Source |
| --- | --- |
| Ivan Wang; github.com/iwang-1; linkedin.com/in/ivanwang1; ivanwang8989@gmail.com | resume |
| CS B.S./M.S. (Honors), UMD College Park; M.S. expected May 2027; GPA 3.6/4.0; minors Data Science + Philosophy | resume |
| SDE Intern, Amazon Web Services — May–Aug 2026 | resume |
| seeking new-grad SWE roles (available ~Summer 2027) — keep the `~` | facts sheet · PERSON |

## Experience (resume bullets, PUBLIC AWS terms only)

| Rendered | Source |
| --- | --- |
| AWS: agentic AI system, 8+ tests Scala→JUnit5, 5× migration throughput, AWS EC2 VPC control-plane APIs | resume |
| AWS: canary infra on SDK v2/CDK/CloudWatch, us-east-1, −40% runtime, −60% flaky, Sev2 alarms, 1M+ customers | resume |
| UMD Full-Stack (May–Sep 2025): 50,000+ records, REST APIs, ETL 10+ yrs legacy data, −75% runtime, 15+ researchers | resume + LinkedIn |
| UMD ML (Aug 2023–Jan 2025): +30% NLP accuracy, −25% training time (SPSA/ADAM/SGD) | resume + LinkedIn |
| Washington Software (Mar 2022–Aug 2023): Selenium/BeautifulSoup automation, −40% manual work, 15+ hrs/wk, Jenkins CI/CD | resume + LinkedIn |
| CONFIDENTIALITY: AWS bullets use only public AWS product names (EC2, VPC, canary, CloudWatch, CDK, SDK) — never internal codenames. Private pre-push gate blocks codenames. |

## Education

| Rendered | Source |
| --- | --- |
| UMD College Park, B.S./M.S. CS (Honors), Aug 2023–May 2027, GPA 3.6, minors DS + Philosophy | resume + LinkedIn |
| University of Hong Kong, Study Abroad (Exchange), Aug–Dec 2025, coursework Numerical Analysis + Cryptography | LinkedIn |

## Selected projects (resume)

| Rendered | Source |
| --- | --- |
| Cross-Domain NLP Sentiment Classifier: 64,000 samples, 16 conditions, DANN on DistilBERT, +26% / 74.2% held-out | resume |
| RAG Research Assistant: LangChain+FAISS over 25+ papers, Streamlit + W&B, 95% policy-analysis QA | resume |
| ML Professor Rating Predictor: 13,000+ profiles, VADER, scikit-learn, R² 0.79 | resume |

## Leadership (resume + LinkedIn)

| Rendered | Source |
| --- | --- |
| Kids For Code VP: 3,000+ students, 400+ lessons, 10+ instructors, 25% enrollment growth | resume + LinkedIn |
| CodeDay TPM: 500+ participants, 200+ schools, sponsorships incl. Vercel + Brave | resume + LinkedIn |
| Panda Programmer instructor: Python/JS/Scratch, ages 6–12 | resume + LinkedIn |
| UMD Climbing Club Secretary: 8 trips/semester, +30% attendance | resume |

## Star Catalog System

| Rendered | Source |
| --- | --- |
| ingest: 101 tests, ~95% cov, mypy --strict, ruff, CI py3.11–3.14, v0.3.2 | facts sheet · PROJECTS |
| ingest processes telescope-observation CSVs (NOT the HYG dataset) | facts sheet · PROJECTS |
| api: 66 tests, ~97% cov, Dockerized — built + smoke-tested in CI, v0.2.3 | facts sheet · PROJECTS |
| api: cone search handles the RA 0/360 seam | facts sheet · PROJECTS |
| web: 8,920 naked-eye HYG v4.3 stars; Playwright-gated deploy; v0.1.0 | facts sheet · PROJECTS |
| Test counts stay per-repo — never summed (101+66+52 must not appear) | constraint 3 |
| Keep every `~` on coverage numbers | constraint 3 |

## Classifier

| Rendered | Source |
| --- | --- |
| 79.5% accuracy / 0.665 macro-F1, once-touched hold-out | facts sheet · PROJECTS |
| 72.3% zero-parameter physics baseline | facts sheet · PROJECTS |
| O-class recall 0 (support 10), disclosed; 92.6% adjacent-class errors | facts sheet · PROJECTS |
| 52 tests, 98.56% cov, mypy --strict, CI py3.11–3.13, v0.1.0 | facts sheet · PROJECTS |
| No rounding: 79.5 never becomes 80, 98.56 never becomes 99 | constraint 3 |
| Trained on the SAME 8,920-star HYG snapshot as the web app (sha256-pinned) | facts sheet · PROJECTS |

## Open source (framing locks)

| Rendered | Source |
| --- | --- |
| 4 MERGED PRs to warnerem/CCD-data-archive — the ONLY "contributed to an open source project" claim | facts sheet · OPEN SOURCE |
| CCD link = pre-filtered merged-PR query on warnerem's repo (safe from day one) | facts sheet · OPEN SOURCE |
| lambeq #259 = 1 OPEN PR, "OPEN — UNDER REVIEW"; the word "merged" never appears near it | facts sheet · OPEN SOURCE |
| FIRE-QML-WINNERS-QNLP = "co-built and open-sourced (GPL-3.0)", never a "contribution" | facts sheet · OPEN SOURCE |
| FIRE role: dataset preparation and integration, and project documentation | facts sheet · OPEN SOURCE |
| FIRE result: ~30-pp win over out-of-the-box standard-SPSA, qualifier "(exact noiseless simulation)" welded on | facts sheet · OPEN SOURCE |
| The qnlp_lorenz fork appears nowhere | facts sheet · OPEN SOURCE |

## Skills

Languages / frameworks / ML-NLP / tools lists from the resume + LinkedIn.
"Used above" dots mark skills demonstrated in the experience or projects shown
on the page (see skills.usedAbove in content.ts).

## Star field

150 brightest stars of the 8,920-star HYG snapshot, committed in
`src/starfield-data.ts`; caption on the masthead states the provenance.
Attribution in the footer colophon: HYG database (Astronomy Nexus), CC BY-SA.

## Confidentiality

Zero Amazon-internal information anywhere in the repo (or its git history).
The specific term/URL denylist is deliberately NOT in this repo — a private
pre-push scan next to the publish script enforces it over the working tree and
the full history before anything is pushed. `check-facts.mjs` keeps the
framing/number tripwires.

AWS content: the two AWS bullets are transcribed verbatim from Ivan's resume
and use only PUBLIC AWS product terms (EC2, VPC, canary, CloudWatch, CDK, SDK
v2, us-east-1, Sev2). Internal system/codenames never appear; the private
pre-push gate blocks them. Every AWS metric (5×, 40%, 60%, 1M+) is a resume
claim Ivan stands behind — do not add, round, or invent beyond the resume.
