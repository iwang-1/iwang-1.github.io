# PRODUCT.md — iwang-1.github.io

Durable product truth for Ivan Wang's personal recruiting site. Visual decisions
live in [DESIGN.md](DESIGN.md); this file is who the site is for and what future
work may not break. Confirmed by the owner 2026-07-31 unless marked otherwise.

## Platform

`web`. A four-page static site (Vite MPA: `/`, `/experience/`, `/projects/`,
`/404.html`), prerendered to static HTML and served from GitHub Pages. No router,
no CMS, no analytics, no trackers, no CDN fonts. Must work with JavaScript
disabled for anything that constitutes proof.

## Who it is for

**Primary user: a technical recruiter or university-recruiting screener**, mid-scan
through a stack of new-grad candidates, giving this page ten to sixty seconds
before deciding to keep reading or close the tab. They know school names, dates,
company names, and role titles. They do NOT know what Raft, recall@10, LSM, or
fdatasync mean, and copy that assumes otherwise loses them.

**Secondary user: a senior engineer** doing a two-minute pre-interview screen, who
will click into a repo, look for something real, and try to falsify a number.

**Tertiary: Ivan himself**, sending the link, and people who know him.

Their job, in order: (1) is this person plausibly hireable, (2) what has he
actually built, (3) can I verify any of it, (4) how do I contact him.

## What the site is for

One job: **get Ivan interviews for Summer 2027 software engineering roles** —
both new-grad full-time AND Summer 2027 internships. He is genuinely eligible for
both (confirmed 2026-07-31: the combined UMD B.S./M.S. can extend past May 2027),
so no copy may address only one of the two audiences or imply a single track.

The mechanism that makes it different from a template portfolio: **every claim on
the site is attached to a measurement someone can re-run.** Numbers appear inside
labelled plates with their measurement conditions and their limits stated as
footnotes, and the homepage carries an interactive figure rendered from a
benchmark file committed in a public repo. The site's argument is not "trust me,"
it is "here is the raw file."

## Product facts future work must preserve

- **UMD CS combined B.S./M.S., Departmental Honors (research track).** Graduating
  May 2027, extendable — so BOTH intern and new-grad framing must stay valid.
- **AWS SDE intern, Summer 2026** (May–Aug 2026), EC2 Networking. Date-anchored
  always; a bare present-tense "AWS SDE intern" goes stale.
- **Three flagship public repos** with committed benchmarks: `parallax-kv`
  (Raft KV), `accretion-db` (LSM engine), `lodestone` (vector search). Plus eight
  more public repos surfaced on `/projects/`.
- **Open to relocating anywhere in the US** (confirmed 2026-07-31). No home metro
  is named on the site, deliberately — maximum geographic breadth.
- **Email is the only contact channel offered**: ivanwang8989@gmail.com.
  Deliberate: no phone number anywhere on the site, ever.
- **No resume PDF is published.** `verify.mjs` enforces the absence two ways: no
  document file of any name ships in `dist/`, and no rendered link offers one
  (accent- and case-blind, so the spelling of the word is free). The site says
  "Resume on request" instead. Changing this is a product decision, not an edit.
- **No photograph of Ivan exists to use.** Do not design a layout that needs one.

## Positioning constraints (binding, owner-set)

1. **No pigeonholing.** The bio, page titles, meta/OG descriptions, and JSON-LD
   may NOT name a language, framework, or specialty lane ("backend", "systems",
   "distributed", "full-stack", "Go and Rust") as a description of *Ivan*. A
   project describing its own real technology is evidence and stays. This is the
   difference between "he built an LSM engine" (fine) and "he is a systems
   engineer" (not fine).
2. ~~**Personality leads.** "Outside of work" sits above the engineering work on
   the home page. This is deliberate and is not a bug to fix.~~ **REVERSED
   2026-11-16 by owner direction.** On a phone, the projects sat 3.5 screens down,
   behind the three hobby figures, and the primary reader (a recruiter giving the
   page ten to sixty seconds) often stops before that. The home page now reads:
   hero → Featured engineering work → Open source → Background → Outside of work →
   contact. The hobbies keep their own words and figures; only their position
   moved. The hero's readout rail stays above the fold and is still load-bearing.
   The earlier decision is recorded rather than deleted, as with constraint 5.
3. **Never corny.** No jokes about the site itself, no self-aware asides, no
   aphorisms, no punchline sentences, no announced virtue ("honest",
   "thoughtful", "reproducible"). The owner has rejected these twice by name.
4. **The hobby blurbs are the owner's own words**, edited for grammar only. Do not
   rewrite them into cleverness.
5. ~~**Dark-first.** A light theme was explicitly rejected.~~ **REVERSED
   2026-08-04 by owner direction.** The owner's judgement on the dark
   measurement-report world was "it looks like ai", and the replacement
   direction (DOUBLE-SHOT — a mechanical-keyboard spec sheet, see DESIGN.md) is
   light by construction: it is a printed datasheet on stock. The earlier
   rejection is recorded rather than deleted because it was a real owner
   decision and this is a real reversal of it, not drift. Two consequences bind
   future work: the page surface is gated to a light luminance band in
   `verify.mjs` (so this cannot silently revert), and the tokens are two-layered
   specifically so a dark counterpart stays cheap (~10 re-pointed semantic
   roles) if the owner ever asks for one.

## Evidence and truth discipline

- **`src/content.ts` is the single source of every rendered string.**
- **No new factual claims, ever.** Corrections may only narrow or remove. Every
  number traces to a committed artifact; `FACTS.md` maps them.
- **Four gates must stay green** (all four, at every commit): `npm run check`
  (rendered-string fact gate), `npm run lint`, `npm run build`, `npm run verify`
  (Playwright: 12 page-viewport combos — locked facts, nav structure, 7 timeline
  roles, the climbing labels, caption/figure non-overlap, primary-CTA contrast at
  rest AND hover, **light-surface luminance** (a two-sided 0.62–0.93 band, which
  REPLACED the dark-surface ceiling on 2026-08-04 — see the reversal at
  constraint 5), **no italic anywhere** (the DOUBLE-SHOT derived rule), both
  reduced-motion strings, no horizontal overflow), plus a private confidentiality
  scanner outside the repo. `npm run typecheck` is a fifth, and the build runs
  `tsc -b` anyway. Build-artifact gates added 2026-08-04: the four subsetted
  fonts exist in `dist/`, the font budget ceiling, no remote `@font-face`, no
  `tabular-nums` (Martian Mono ships no `tnum`), and the eight font preload tags.
  Two gates are viewport-independent and are NOT part of the 12 combos: the hero
  rail's overlap check and the hero rail's **mid-token wrap** check
  (`verify.mjs:494–536`), both home-page-only. The wrap gate is the one to know
  about, because it exists as evidence that the combos are not a safety net: it was
  added 2026-08-02 after **all twelve combos reported PASS with its defect live at
  verify's own 390px mobile viewport** — `parallax-kv` and `accretion-db` breaking
  across two lines. Nothing else could see it (the boxes do not intersect, so the
  overlap gate is silent by construction; there is no document overflow), and it
  counts LINE BOXES per painted text node against 1 rather than asserting a width,
  so re-tuning the 411px stacking breakpoint cannot quietly retire it. Do not
  re-tune that breakpoint believing the overlap gate covers it.
- **Confidentiality:** AWS content uses only public product terms exactly as they
  appear on Ivan's resume. No internal system names, ever.
- **Locked verbatim strings** (gate-asserted, do not paraphrase): the DANN result
  phrasing, "co-built and open-sourced", the CCD contributed-to sentence,
  "Aug 2023 – May 2027", lowercase "unsupervised domain adaptation", and the
  lowercase "mechanical keyboards" / "rock climbing" in the hero subhead.

## Deploy and workflow constraints

- GitHub Actions deploys `dist/` on every push to `main`. **CI runs only the fact
  gate and the build — not lint, not verify** — so a verify-class regression
  deploys silently. Run all four gates locally before committing.
- **Ivan runs every `git push` himself.** Agents commit; they never push.

## Undecided / owner's call

- Work-authorization signal: not stated, wording not decided.
- Whether to ever publish a resume PDF.
- Pinned repos and profile fields on github.com/iwang-1.
