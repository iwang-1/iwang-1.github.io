# FACTS.md — rendered-number checklist

Human companion to `scripts/check-facts.mjs`. Every number or claim rendered on
the site maps to a line of the verified facts sheet (2026-07-13). Re-verify
this table before every deploy. This file is intentionally OUTSIDE the
check-facts scan set (`src/`, `index.html`, `public/`, `README.md`) so it can
describe the rules it enforces.

## Person

| Rendered | Source |
| --- | --- |
| Ivan Wang; github.com/iwang-1; linkedin.com/in/ivanwang1 | facts sheet · PERSON |
| CS B.S./M.S., UMD College Park; M.S. expected May 2027 | facts sheet · PERSON |
| SDE Intern, Amazon Web Services — Summer 2026 | facts sheet · PERSON |
| "backend systems and cloud infrastructure" (the ONLY AWS description, ever) | facts sheet · PERSON + constraint 1 |
| seeking new-grad SWE roles (available ~Summer 2027) — keep the `~` | facts sheet · PERSON |
| email empty; mail UI renders only when non-empty | facts sheet · PERSON |

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

Languages / frameworks / tools lists copied verbatim from the verified profile
README (facts sheet · SKILLS). "Used above" dots only on: Python (primary),
JavaScript/TypeScript, FastAPI, React, scikit-learn, Docker, GitHub Actions CI,
pytest, Git, SQLite/PostgreSQL.

## Star field

150 brightest stars of the 8,920-star HYG snapshot, committed in
`src/starfield-data.ts`; caption on the masthead states the provenance.
Attribution in the footer colophon: HYG database (Astronomy Nexus), CC BY-SA.

## Confidentiality

Zero Amazon-internal information anywhere in the repo (or its git history).
The specific term/URL denylist is deliberately NOT in this repo — a private
pre-push scan next to the publish script enforces it over the working tree and
the full history before anything is pushed. `check-facts.mjs` keeps the
framing/number tripwires. The only permitted Amazon content is the internship
title line plus the single description constant.
