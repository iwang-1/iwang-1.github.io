---
name: Double-Shot
description: A recruiting site set like a mechanical-keyboard spec sheet — a force curve beside a spec column, which is what a benchmark sweep already is.
status: AS BUILT. This file describes what is in the repository, derived from
  src/styles/tokens.css, src/index.css and the components, and re-derived on
  2026-08-05 against the shipped tree. Where a rule was paid for with a measured
  defect, the measurement is quoted so nobody undoes it by tidying. Anything
  retained purely as history is marked "(history)" and is not the spec for new
  work.
colors:
  cap-beige: "#EDE7DA"
  case-grey: "#D9D2C2"
  case-shade: "#D2CBBB"
  charcoal: "#26241F"
  rust: "#7A2E12"
  slate: "#33566E"
  sublegend: "#5A554B"
  rule: "#7A766E"
  rule-soft: "#C1BCB1"
# THE PAPER PALETTE. These nine are the SAME TOKENS re-declared inside
# `@media print` (src/index.css), and they belong in the frontmatter for a
# concrete reason: the machine-readable layer is what tooling validates, so a
# paper value documented only in prose reads as drift on every audit. It was
# reported as unexplained colour three separate times before this block existed.
#
# They are LITERAL and must stay literal. Tokenising them once regressed the
# printed primary button to a measured 1.59-1.86:1, because any later :root remap
# reaches into the print sheet; fixed values cannot be reached. See "## Print".
#
# Every one is WARM except paper-slate, and that exception is real rather than
# sloppy: `slate` is a genuine blue in the screen palette too ("data traces and
# links"), so its darkened paper form is correct. Hue alone does not identify
# drift here — verify.mjs instead asserts that every printed value is one of
# exactly these nine, read out of the print block's own :root at build time.
paperColors:
  paper-white: "#FFFFFF"      # cap-beige and case-grey both flatten to true white
  paper-inset: "#F4F2EC"      # case-shade, the only tinted paper surface
  paper-charcoal: "#1A1815"   # 17.72:1 on white
  paper-rust: "#6B2810"       # 10.85:1
  paper-slate: "#24405A"      # 10.74:1 — links and button ink
  paper-sublegend: "#4A463E"  # 9.39:1 — body
  paper-rule: "#8A857C"       # 3.67:1 — control boundaries, clears the 3:1 non-text floor
  paper-rule-soft: "#D5D1C8"  # 1.52:1 — sheet hairlines, structure not information

semanticColors:
  surface-page: "{colors.cap-beige}"
  surface-figure: "{colors.case-grey}"
  surface-inset: "{colors.case-shade}"
  ink: "{colors.charcoal}"
  ink-accent: "{colors.rust}"
  ink-data: "{colors.slate}"
  ink-secondary: "{colors.sublegend}"
  rule: "{colors.rule}"
  rule-soft: "{colors.rule-soft}"
  on-accent: "{colors.cap-beige}"
typography:
  display:
    fontFamily: "'Martian Mono Subset', ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace"
    fontSize: "clamp(2.4rem, 5.2vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.02
  body:
    fontFamily: "'Familjen Grotesk Subset', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "0.75rem"
    letterSpacing: "0.08em"
geometry:
  r-xs: "2px"
  r-chip: "999px"
  hairline: "1px"
---

# Design System: Double-Shot — as built

## The complaint this answers

The owner looked at the previous site and said **"it looks like ai."** Two
mechanical causes were found, and both were real:

1. `--font-display` was **byte-identical** to samwho.dev's `--heading-font`.
2. `--series-1` / `--series-3` were **exactly** Tailwind sky-400 and teal-400.

And the structural cause, which the old codebase admitted in its own comment
(`Keyboard.tsx`): the hobbies were "drawn in the same grammar as the measured
plates", where "a keycap here is a tick label that happens to be square." When
the keyboard, the climbing wall and the benchmark all wore hairlines and mono
tick labels, a reader concluded one template made all three. **That uniformity
is the signature** — not any single colour. Note the negative result behind the
fix: 12 comparable sites were checked for fake-handmade devices (rotated paper,
tape, handwriting faces) and eleven use none. The answer is specificity, not
texture.

## Thesis

The site is set like a **mechanical-keyboard spec sheet**. Not a page about
keyboards — a page whose *drawing conventions come from* keyboards, because the
native literature of that hobby is already a measurement document: a switch
datasheet is a force-versus-travel curve with a spec column beside it, which is
structurally the same object as a recall-versus-throughput sweep. The world is
therefore not a costume over the evidence; it is a grammar the evidence and the
hobby both already fit.

## THE DOUBLE-SHOT RULE — two grammars, and the reason there are two

**Measured figures keep the plots' hairline grammar. Drawings look drawn.**
These pull in opposite directions on purpose, and the second half exists because
the first half, applied to everything, is what produced the complaint above.

- **A plot** is a 1px-ruled frame, mono tick labels, a `FIG.` label, a footnote
  strip carrying provenance and limits. The Sweep, the three system spec sheets
  and the 404's empty plate are all drawn this way.
- **A drawing** is an object. The keyboard has a case wall and a recessed well,
  every keycap is two shapes (outline plus a sculpted inset top), legends print
  where a real cap prints them, and modifiers are the darker half of a two-tone
  set. A climbing hold is three shapes — shadow, body, bolt — so it reads as
  bolted to plywood, and the wall is two panels at two angles with seams and a
  generated grid of t-nuts. Neither drawing wears a hairline plot frame, a mono
  tick label or an axis.

Concretely, as shipped: `.kb` carries **no** `.plate` class and no footnote strip
(`Keyboard.tsx`, `Keyboard.css`); the boulder and the follow list are `.plate`
but take **plain labels** — "Bouldering", "What I follow" — never a `FIG.`
number, so a reader never has to decode a hobby. Both drawings close on a prose
`figcaption` at the 14px sans/`--ink-secondary` register, not on a footnote
strip: the caption says what was **drawn**, and a footnote strip says what was
**measured**.

The rule is enforceable in review by one question: *does this object claim a
measurement?* If not, it may not borrow the measurement grammar.

## Colour — two layers, and why

`tokens.css` is split into a RAW layer (the colorway: an alpha, a modifier, one
accent — the logic of a double-shot keycap set) and a SEMANTIC layer (what each
value is *for*). Components read only the semantic roles. That split is what
makes a dark counterpart ~10 re-pointed roles instead of a stylesheet re-audit,
which is the standing mitigation for the fact that this world **reverses the
earlier light-primary rejection** (PRODUCT.md records the reversal).

The world is **light**: keycap-beige page, case-grey figures, charcoal ink, ONE
rust accent, slate for data traces. No blue as an affordance, no teal, no third
series colour, and no dark theme — `color-scheme: light` is declared, and
`verify.mjs` asserts the page surface sits in a light luminance band.

**Every ratio was re-measured, not copied.** `node scripts/measure.mjs` re-reads
these from the LIVE computed styles of the built pages, so the table cannot
drift from the tokens above it (re-run 2026-08-05; all values below reproduced
to the digit):

| token | on cap beige | on case grey | on inset |
|---|---|---|---|
| charcoal ink | 12.58 | 10.30 | 9.60 |
| modifier rust | 7.65 | 6.26 | 5.84 |
| slate | 6.32 | 5.17 | 4.82 |
| sublegend grey | 6.01 | 4.92 | 4.58 |

Surface luminance: page 0.8022, figure 0.6474, inset 0.6000.

Three values are DERIVED rather than given, and each derivation is a constraint,
not a preference:
- `--raw-case-shade` `#D2CBBB` is 4% charcoal into case grey — the largest step
  that keeps sublegend grey, the palette's weakest ink, above the 4.5 body floor
  on it (4.58; 5% gives 4.49 and fails). A third surface earns its place only if
  every ink legal on the second is still legal on it.
- `--raw-rule` `#7A766E` is 58% charcoal into cap beige — the **smallest**
  fraction reaching the 3:1 non-text floor on *both* reading surfaces (3.67 /
  3.00), so a drawn rule is a rule.
- `--raw-rule-soft` `#C1BCB1` is deliberately *below* 3:1 (1.54 / 1.26). It
  divides rows of a spec column and carries nothing a reader could miss. A
  structural rule must never be swapped for it.

### Named rules

**The Label-On-Accent Rule.** A rust fill takes **cap beige** as its label
(7.65:1). Charcoal on rust measures **1.64:1** — this palette's version of the
invisible-CTA defect. The primary-CTA gate (rest, hover *and* focus) is what
keeps it out. Measured on the shipped primary button: rest and hover both paint
`rgb(237,231,218)` on `rgb(122,46,18)`.

**One accent, and it is the only interactive colour.** Rust is every link, focus
ring, active-tab tick, the single filled primary button per page, the timeline
node, the crosshair, the knee callout, the scroll-progress trace and its scrub
marker, and the on-route holds on the boulder. Slate (`--ink-data`) is data and
lives only inside a figure — the Sweep's traces and sample marks and the nav
mark's sample line. Nothing else may be saturated: coursework, skills and tech
tags are `--ink-secondary` on a hairline.

**Two series are told apart by DASH, not hue** — and this is a direct
consequence of having one accent. In the Sweep, HNSW is the solid trace with
filled marks and IVF-PQ is dashed (`6 4`) with hollow marks; both stroke
`--ink-data`. The boulder's three sequences are one colour at one weight,
distinguished only by dash pattern (`7 5` / `2 4` / `11 4 2 4`), which is
*also* the honesty rule there — see The Boulder below. Dash is a difference
without a hierarchy, where colour or width would rank them.

**The Legacy Shim Is Temporary.** The outgoing world's token names still exist,
re-pointed at the semantic roles, so the stylesheet keeps computing while
components move: `--ground` `--plate` `--plate-2` `--grid` `--axis` `--ink-2`
`--ink-3` `--series-1/2/3`. Two consequences worth stating rather than
discovering:
- `--series-1` and `--series-3` both resolve to `--ink-data` (verified in the
  live page: both compute `#33566e`), because this palette has one data colour
  where the old world had two series hues. Anything that still tries to
  distinguish them by colour distinguishes nothing. The Sweep's plot is already
  fixed — the generated SVG strokes both traces `var(--ink-data)` and separates
  them by dash. The **HTML series key** (`.sweep-key`, the phone-only legend
  outside the pannable window) still colours its two swatches `--series-1` and
  `--series-3`, i.e. one colour, and does **not** carry the dash its own source
  comment claims: measured at 390w, both swatches paint `rgb(51,86,110)` at
  `height: 2px`. That is a real defect, recorded here so it is not mistaken for
  finished.
- `--ink-2` and `--ink-3` both resolve to `--ink-secondary`, so the old
  three-step ink ramp is two steps: `--ink` and `--ink-secondary`.

Write new rules against the semantic roles, and delete a shim name as its last
caller moves.

## Type — and the rule the whole system exists for

Two self-hosted, subsetted, committed faces. **Real shipped cost: 21,516 B
across four files** (`du -b public/fonts/*.woff2`: 9,320 + 760 Martian, 10,588 +
848 Familjen), against a gate ceiling of 24,000 B.

- **Martian Mono** (wght 400–700, wdth pinned 112.5) — display, all labels, all
  data. Verified against the font binary: cap height **exactly 0.800 em**, and a
  **fixed 0.750 em advance for every glyph**. That is what a keycap legend looks
  like, and it means numeric columns align natively.
- **Familjen Grotesk** (wght 400–700) — body prose only. Also the label-button
  face and the `.readout-plain` / `.hero-readout-plain` glosses. The italic file
  is not shipped, because there is no italic here to ship it for.

**THE DERIVED RULE: there is no italic anywhere on this site, because a keycap
legend has no italic.** Emphasis is set the way a legend marks a shifted
character — small caps (`font-variant-caps: all-small-caps`, a feature and not a
transform, so copied text is unchanged), `+0.06em` tracking, a `0.08em`
underline at `0.1em` offset. Two declarations enforce it — `font-style: normal`
on `em/i/cite/dfn/var/address/.em`, and `font-synthesis-style: none` at the
root, which is the half that stops a UA *synthesising* a slant — and
**`verify.mjs` fails on any element that computes `font-style: italic` on any of
the four pages.**

Re-proved 2026-08-05 by appending `.kicker { font-style: italic }` and
rebuilding: **6 of 12 combos FAIL, 21 findings**, each naming the element and
quoting its text, e.g.

```
/ @ desktop: NO-ITALIC rule broken — <p.kicker> computes font-style: italic
  — "UMD CS B.S./M.S. · GRADUATING MAY 2027 ·"
```

With the declaration removed: twelve PASS, exit 0. Why the rule matters: it can
only be derived by someone who has looked closely at a keycap. It proves the
fixation without a sentence claiming it.

### The scale, as it computes

Ten steps (`--fs-100` 11px → `--fs-900` 2.6rem, plus the `--fs-display` clamp),
three weights (400 body, 600 headings, 700 display). Measured in the built page
at 1366 unless noted:

| rank | selector | computed |
|---|---|---|
| display | `h1` | Martian 700, 60px / 61.2 (38.4px at 390w — a clamp, not a breakpoint) |
| rank-1 heading | `#systems h2` | Martian 600, 41.6px (28px at 390w) |
| rank-2 heading | `#off-hours h2` | Martian 600, 24px |
| subtitle | `h3`, `.hobby-blurb`, `.readout-value` | Martian 600, 20px |
| body | `p` | Familjen 400, 17px / 1.65 |
| label / footnote | `.plate-footnote`, `.readout-label` | Martian 400, 14px |
| provenance | `.kicker`, `.chip`, `.edu-coursework` | Martian 400, 13–14px |
| plate label | `.plate-label`, `.spec-col-head` | Martian 400, 12px, 0.08em, uppercase |

Measures: `--measure-tight` 22ch (the `h1`), `--measure-body` 56ch (deks,
intros), `--measure-prose` 66ch (prose), `--measure-mono` 68ch. The mono step is
not a duplicate: `ch` is the element's OWN "0", so at 66ch the sans body renders
54–60 characters per line while a mono box renders exactly its ch count.
`--measure-mono` binds `.plate-footnote` and `.edu-coursework`, which ran
unbounded at 113–131ch before it existed.

### Named rules

**The Fourteen-Pixel Floor Rule.** Nothing set in `--ink-secondary` goes below
14px *in prose*. Verified against the shipped rules: the ones below 14px are all
labels rather than reading text — `.spec-col-head` and `.nf-note` at 12px,
`.sweep-axis-title` at 11px, `.hero-readout-unit` / `.hero-readout-plain` /
`.project-license` / `.edu-coursework` at 13px. `.readout-plain` is deliberately
14px and **not** the 13px its sibling on the hero rail uses, precisely so it does
not add a second breach: the register there separates by FAMILY (sans against
mono), not by size.

**The Rank Rule.** A section declares its rank and the heading size moves with
the gap above it. Five identically-sized headings over five identical pads is the
generated-page fingerprint; rank-1 opens a page, everything supporting it is
rank-2. A page gets exactly ONE rank-1, and it is the section that carries the
page's argument — never a preamble that merely happens to come first. Corollary,
and the reason the rule is stated this sharply: ORDER carries emphasis of a
different kind than SIZE does, so a section may lead the page and still be
rank-2. Home does exactly that — the hobbies come first by owner call and sit at
rank-2 (24px), while "Featured engineering work" keeps the page's biggest type
(41.6px). Rank-1's size is a clamp with a 28px floor, and that floor is
load-bearing: a flat 2.6rem would render LARGER than the `h1` on a phone, and a
floor equal to rank-2's 24px would collapse the two ranks below 640px.

**There is no Tabular Rule any more, and its absence is the rule.** Martian Mono
ships **no `tnum` feature** — verified against its GSUB table, which lists only
`calt/ccmp/dnom/frac/locl/numr/rvrn`. Seventeen `font-variant-numeric`
declarations were deleted because all seventeen had become inert: they would have
read as a guarantee the shipped font cannot make. Alignment comes from the fixed
0.750 em advance, which is stronger, and the built CSS is gated against the
property. What still has to be *stated* is the outcome the deleted property was
standing in for: **numbers in this world line up.** The hero rail spends fixed
grid tracks rather than content-sized ones for exactly that reason — auto-sized,
the three figures found three different right edges (measured 393.7 / 392.7 /
401 at 1440, an 8.3px wobble in the one component whose job is that they don't).

**The Named-Fallback Rule.** `←`, `→` and `≈` exist in **no upstream file of
either family** (checked across all 18 shipped `.woff2`). They render from the
fallback by necessity, so the fallback stacks name a mono and a sans of the right
proportion — the substitution is *chosen*, not left to the UA.

**Button labels are the one UI exception.** `.btn` takes the body face, because
Martian's cap-I and lowercase-l are near-identical at 16px and rendered "GitHub"
as "GItHub" in the fold. Legends and data stay in Martian; UI text does not.

**The Licence Travels With The Bytes.** Both families are OFL-1.1. pyftsubset
drops name IDs 0 (copyright) and 14 (licence URL) by default, and the first cut
of these files shipped without them — a real compliance gap, not a nit. The
subsetter now keeps `0,1,2,3,4,5,6,13,14`, and the full licence texts sit beside
the fonts in `public/fonts/`. The fact gate excludes those two files by exact
filename, and narrowly: it polices Ivan's claims, and the OFL's own boilerplate
contains a phrase the gate forbids in the site's voice.

**The Cut Is Reproducible.** woff2 writes `head.modified` from the clock, so the
first version of the subsetter produced four different files on every run with no
input change (all four md5s moved across back-to-back runs). Because these
binaries are *committed*, that made any font rebuild an unreviewable diff.
`SOURCE_DATE_EPOCH` is pinned, so identical inputs give identical bytes and a
font diff always means a real change.

**The Dagger Split.** `†` — which the footnote convention rests on — is not in
either family's `latin` file; upstream ships it in `latin-ext`. Each family
therefore has a second one-glyph face (760 B / 848 B) on a `unicode-range`
split. This is a correctness fix, not a micro-optimisation.

## Performance

Unthrottled, from the built `dist/` over a local server
(`node scripts/measure.mjs`, three runs 2026-08-05): home LCP **108 / 112 /
116 ms**, 353 KB transferred, of which 19,908 B is fonts (the two latin cuts;
the dagger supplements load only when a `†` paints). `/experience/` 376 ms,
`/projects/` 396 ms, `/404.html` 48 ms.

Both faces are preloaded on every page and `verify.mjs` asserts all eight
preload tags, because deleting them looks harmless: the page still renders and
simply reflows. `font-display: swap` on all four faces — every number on this
site is real HTML text, so a swap re-flows type and never withholds evidence.

(history) The throttled numbers this section used to carry (Fast 3G, 5 loads,
median; ~92ms for two typefaces; a 1464→796ms 404 improvement from preloading
Martian) were taken with a harness that is not in the repository, so they cannot
be reproduced from a clean checkout and are not restated as current. The two
findings that survive them and still govern decisions: **request interception is
not a valid method here** (it distorts timing enough to invert the answer), and
**the no-preload CLS is entirely the font swap**, dominated by body prose
reflowing, which is why preloading the sans recovers most of it.

## The primitives, as shipped

Six objects, and the list is complete for the current tree. Counted in the built
home page: 6 plates, 3 axis rules, 4 sheet blocks, 3 readouts (7 rows), 15
chips, 2 proof chips.

### The Plate (signature primitive)

`src/components/Plate.tsx`. Three parts in one order: a small-caps mono label
naming the figure (`FIG. 02 · accretion-db`), the body, and a footnote strip
under a hairline. Flat `--surface-figure` fill, 1px `--rule-soft` border, 2px
radius, 24px pad (16px below 640px). No gradient, no blur.

The footnote is the structural point — a limitation set as a footnote is a
footnote; the same sentence set as the card's last paragraph is a closing
argument against yourself. Provenance (`50,000 x 128-d · k=10 · single core ·
Xeon 8488C`) lives there, and the strip carries `overflow-wrap: anywhere` on its
links because artifact filenames are long unbroken tokens.

**The strip's cap is spent on `padding-right`, never on `max-width`**, and that
distinction is load-bearing. This element's `border-top` IS the plate's internal
divider, so narrowing the box narrows the rule: measured at 1440 with
`max-width: 68ch` the box fell 1022px → 607px and the hairline stopped 415px
short of the plate's inner right edge, and on the Sweep it broke the contract
that the plot, the gloss and the footnote all end on one right edge (footnote
right 1109 → 816 against an unmoved plot). Padding leaves the border box on the
plate's full measure and shortens only the line box; a `max()` floor of 0 keeps
every narrow render byte-identical.

`stripStyle` exists for one case: a plate whose className switches the box to a
multi-column grid. The label and footnote are siblings of the body, so they
become grid items too; the caller passes `gridColumn: "1 / -1"`. The plate does
not guess at the caller's track list.

### The Sheet Block

`.sheet-block` — a datasheet's bounded region, **not** a web "card". The rename
is not cosmetic: a card is a floating object with a shadow and a hover lift, and
a page of equal cards is the single most template-shaped thing a portfolio can
do. A block sits ON the sheet: same fill, separated by a **rule** (1px `--rule`,
one step stronger than a plate's `--rule-soft`), never by elevation.

There is no `.card` class anywhere in the tree — the primitive and every
`.card` selector are gone. Role cards, the education card and project cards are
all `.sheet-block`. Link-bearing blocks add `.sheet-live`, whose contract is
narrow: the border warms to rust and the block translates `-2px`. That is 2px
and not 4px because a block is a heavier object than a button and a 4px hop
reads as one falling off the page.

### The Spec Column

`.spec-col-head` + `.spec-notes`. A titled column, mono 12px uppercase over a
1px `--rule`, carrying "Specifications" and "Notes & limits". **The notes are set
at body size (17px), in `--ink`** — the limits used to be a 14px dagger footnote,
which is where a page puts something it hopes you skim. On a datasheet, the thing
a part does NOT do is a titled column printed at the same size as everything it
qualifies. `SystemFeature.tsx` strips the leading `†` when it moves the text
there, because a marker pointing at a footnote that no longer exists reads as a
broken reference. The owner's limit sentences are otherwise verbatim.

### The Readout

`src/components/Readout.tsx`. Value / label on one left-aligned baseline, with as
many rows as the project actually measured. Explicitly **not** a fixed-column
grid: three cards with exactly three metrics each is a schema, and a schema reads
as filled in rather than measured. As shipped: 3 / 2 / 2 rows.

A row whose label is an *axis* label rather than English carries a `plain` gloss
under it — sans against the row's mono, at 14px — on a contract worth stating
because it is easy to break: it NAMES WHAT THE METRIC IS and may never assert a
second measurement or introduce a number. "fdatasync p50" and "recall@10" reuse
the hero rail's already-approved wording verbatim so one piece of jargon is never
translated two ways on one page. Rows whose label is already English ("client
operations checked", "queries/sec · 1 core") get none — glossing all of them
would be the filled-in schema this primitive exists to avoid, which is why 4 of
the 7 rows carry one. The sans/mono contrast is what makes a gloss legible AS a
gloss; an earlier version inherited mono from an undeclared variable and was
invisible.

The **hero rail** is the same idea as a three-row rail of hairline-separated
rows — repo name as the rust link, value in `--ink`, unit quiet — and it lives in
the hero's right column, which is what makes the first screen a figure rather
than a decorated résumé header. Its value and unit tracks are fixed widths (see
the Tabular note above). Those tracks need 220px plus the name, so **below 412px
the row stacks** to one column in DOM order and the three values share the
container's left spine — which satisfies "numbers line up" rather than breaking
it. The ceiling is 412 and not 380 because between them the tracks stopped
overlapping without starting to fit: the name track computed to 80–111px against
mono anchors needing 92.7–101.2px, so `parallax-kv` and `accretion-db` wrapped
mid-token with the hyphen dangling. A repo name broken over two lines is not a
name a reader can recognise or retype, and it is the fold's clickable route into
the evidence.

### The Axis Rule

`src/components/AxisRule.tsx`. A 1px `--rule-soft` line carrying four 5px
`--rule` ticks, opening every section the way an axis opens a plot. It is the
only decorative line on the site, it is `aria-hidden`, and it is never a
heading's substitute.

The gradient runs `270deg` with the tile pinned RIGHT, exactly as the progress
rail's identical primitive does it. Left-pinned at 90deg the repeating tile put
ticks at 0/25/50/75%: the first landed ON the container's inner left edge and
merged with the page's one alignment spine, and none landed at 100% — so four
ticks drew as three plus a smudge.

### Chips

`src/components/chips.tsx`. `--surface-figure` fill, 1px `--rule-soft` hairline,
pill radius, 13px mono, `--ink` text. **Non-interactive by design**; the hover
state is a barely-warmer border and nothing else, because a tag that answers the
pointer and does nothing on click is a false affordance. There is no coloured
variant: coursework chips used to render lime, which spent the loudest colour on
the site's least load-bearing content while the measured numbers were grey.

**Proof chip:** the same tag plus a mandatory 6px status dot. The dot is what
separates a checked number from a tech tag, so it is not an option the caller can
drop. It rides the FIRST line of its label, not the centre of the chip.
`align-items: center` is right while a chip is one line — all eleven single-line
proof chips measured 0.22px off their line's centre — but the hero availability
chip wraps (two lines from 640px up, three at 390), and centring on its 54.8px
box put the dot 11.9px below the first line's centre at 1440 and 23.1px at 390: a
status dot floating in the gutter *between* two lines of the string it qualifies.
`flex-start` plus `margin-top: calc((1lh - 6px) / 2)` is arithmetically identical
to `center` on one line, so nothing that already read correctly moved, and `1lh`
lets the 13px chip and the 16px hero chip each derive their own offset. Both
declarations live inside one `@supports (margin-top: 1lh)` block and must stay
there: without the guard a non-supporting engine would keep `flex-start` and drop
the offset, riding every dot to the line box's top edge.

### The Label Button

One interactive primitive: a flat plate with a hairline border and a body-face
label, 44px minimum in both axes, 10px/16px padding, 600 weight at 16px.
Default: `--surface-figure` fill, `--ink` label — the hairline IS the affordance.
Primary: rust fill, cap-beige label, one per page. Current (nav / current page):
inset fill, `--ink-secondary` boundary, and an inset rust hairline under the label
like the active tick on an axis — three signals, none of them colour alone, and
it never lifts.

**Cascade contract, and it is the reason this system was rebuilt.** Hover /
focus-visible and `:active` are each written ONCE, at one specificity, in cascade
order. The lift is a custom property (`--btn-lift`) so variants and the
reduced-motion block change it without adding a second `:hover` rule, and the
label colour is restated from the variant's own property so no ancestor link rule
can repaint it. The previous stylesheet had a second, later `:hover` whose
`:not()` qualifier out-specified the primary variant and rendered its label at
1.21:1.

The primary CTA's focus ring is the one control that opts out of the global rust
ring: rust drawn around a rust fill measured 1.00:1. It takes `--ink` at a 3px
offset, so the ring lands on the surface where `--ink` is 12.58:1. Outline
properties only — no second `:hover`, no border or lift change.

## The figures

### Figure numbering — the current scheme

**The three system spec sheets are FIG. 01–03 in page order, and the Sweep is a
DETAIL of lodestone's sheet rather than a number of its own.** As rendered:

```
FIG. 01 · parallax-kv
FIG. 02 · accretion-db
FIG. 03 · lodestone
FIG. 03 DETAIL · lodestone · recall vs throughput
```

`SystemFeature.tsx` owns the offset (`FIRST_SYSTEM_FIGURE = 1`) so both pages
that render these sheets number them identically.

The reason it is a DETAIL and not FIG. 04 is measured in reviewers: the Sweep
used to be FIG. 01 while lodestone's own sheet was FIG. 04, so **one subject
carried two numbers on one page and three cold reviewers read it as a numbering
bug.**

Everything else takes typographic rank instead. The hobby plates carry plain
labels ("Bouldering", "What I follow"), the 404's empty plate says "This page",
and About / Education / Skills carry no label at all — **five FIG. labels are a
system, nine are a costume.**

(history) The retired scheme was FIG. 00 the climbing topo, FIG. 01 the recall
curve, FIG. 02–04 the three systems, plus FIG. 404. Both the topo and that
numbering are gone; do not restore either from an older document.

### The Sweep (`FIG. 03 DETAIL`)

One inspectable measured figure, on the homepage, once: a 680×360 inline SVG of
lodestone's committed recall-vs-throughput curve, drawn in the grammar of a
switch force-travel datasheet — a closed frame with inward ticks, uppercase
spaced axis titles carrying quantity and unit, a dashed and NAMED reference level
(the 0.90 recall floor the fast end breaks), a title block in the corner with the
test conditions, and two strokes told apart by dash.

**The numbers are not authored.** `scripts/generate-figures.mjs` parses
`benchmarks/lodestone/bench_50k_128d.txt` at build time and emits
`src/generated/sweep-figure.ts`; it asserts that every value it presents as data
is a byte-exact substring of that file, and exits non-zero if the source is
missing or does not parse to the exact expected shape. It also parses
`tokens.css` — not to copy hexes (the markup emits `var()` refs) but to FAIL if a
role the figure paints with has been renamed, since a `var(--ink-data)` pointing
at nothing renders black and passes every other gate. Numbers are at source
precision inside the figure (`0.9759`, `31,845`), while the prose plates keep the
site's approved rounded style.

Its rules, all load-bearing:

- **The figure is complete in the markup.** Every label, the legend, the
  transcription table and the default knee callout are server-rendered, so the
  no-JS, prerendered, reduced-motion render is the same evidence. Nothing that
  constitutes proof lives behind a pointer.
- **The crosshair is two custom properties** (`--sweep-x`, `--sweep-y`) on the
  `<figure>`, defaulting to the knee, plus a `textContent` swap on nodes that
  already exist. No canvas, no layout measurement beyond one
  `getBoundingClientRect` for pointer conversion, no animation loop, no
  dependency. Keyboard-operable (arrow keys, Home/End) with a real focus ring and
  a polite live region. `enhance.ts` binds it **delegated on `document`** and
  re-resolves the figure per event: bound directly, the node was orphaned when
  React replaced `#root`, and the figure shipped dead while its `aria-label` went
  on promising an interaction that did not exist.
- **The walk is inside the SVG, in CSS.** A cursor steps the five HNSW samples on
  a 10s linear loop via `@keyframes` in the generated element's own `<style>` —
  no script, no SMIL, so it runs with JavaScript disabled. It pauses on hover and
  focus-within, and under `prefers-reduced-motion: reduce` it stops and parks on
  the annotated sample. Each stop is HELD at both ends of its span so the cursor
  never rests at a position corresponding to no measurement, and the loop has six
  stops for five samples so every pass ends on the same sample the static figure
  and the reduced-motion render show. Every selector inside that `<style>` is
  prefixed `.sweep-plot`, because an inline `<style>` in an inline SVG is
  DOCUMENT-scoped: an unqualified selector there could restyle the page and break
  the luminance or no-italic gates from inside a figure.
- **Below its floor width the plate PANS** rather than scaling labels into
  illegibility, and the pan starts at the annotated end (`direction: rtl` on the
  scroller, restored on the child) so the default state is never behind a
  gesture. With LTR the window opened on the IVF-PQ end while the knee callout
  sat entirely outside it up to 480w — and the readout quoted an off-screen
  sample as the current reading.
- **The pan's tab stop is the UA's, not ours.** `.sweep-scroll` carries
  `role="group"` plus an `aria-label` naming the job it does — panning, not
  measuring — because Chromium makes a scrolling box a tab stop by itself, and it
  did so silently as an unnamed DIV whose name computed from its own contents.
  **No `tabIndex` is set, deliberately**: the UA grants the stop exactly when the
  box scrolls and withholds it when it does not (measured pan 326 / 256 / 38px at
  320 / 390 / 640w with the stop present, 0px and no stop at 680 / 998 / 1366),
  so `tabIndex={0}` would ADD a dead stop at every desktop width. The stop is not
  removable either: with JavaScript blocked, Home on the `<figure>` pans 0px
  because there is no crosshair to move, while ArrowLeft here pans 80px — making
  this the only keyboard route to the plot's left half on the no-JS render.
  The `<svg>` must stay the DIRECT child of this div: `enhance.ts` pans via
  `svg.parentElement`, so an extra wrapper silently kills arrow-key panning.
- **A visually-hidden transcription table carries the same ten samples as text**,
  server-rendered, immediately after the drawing. It is the accessible copy of
  the evidence: the drawing pans its per-point labels out of the window at 400%
  zoom, and to a screen reader the SVG is one `role="img"` summary plus a single
  live line. Hidden rather than shown because the drawing IS the figure wherever
  the drawing is legible, and a second visible copy of ten rows is the
  duplicated-legend defect this figure already fixed once. Two rules hold it up:
  - **`.visually-hidden` goes on a WRAPPER, never on the `<table>`.** Not a style
    preference: the primitive's `width: 1px` is a MINIMUM for a CSS table, which
    sizes to its columns' min-content regardless. Measured by moving the class
    onto the table in the live page — the table renders 573.5px wide and the home
    page takes **285px of horizontal document overflow at 320w**, against 0px
    with the wrapper.
  - **The caption states an ordering, so the row order must BE that ordering.**
    Both the caption and the arrow keys claim throughput-ascending, and the
    generator emits `SWEEP_SAMPLES` in true x-ascending order — which interleaves
    the two series (`ef=256` at ~8.9K sits between `nprobe=4` and `nprobe=1` at
    ~9.8K). Grouping the rows by series is the obvious tidy-up and it silently
    falsifies the caption for the one reader who has no drawing to cross-check
    against.
- **The gloss.** Two sentences of body-size sans between the mono FIG. label and
  the plot, naming the object and saying which way is good, before any axis has
  to be read. It carries no number — the callout, the readout and the footnote
  already do. The owner looked at his own fold and asked what the graphic was,
  which is the whole argument for it. It is deliberately the one non-mono text
  leaf inside the plate.
- **The cap lives on the PLATE, not the drawing, from 998px up.** The cap exists
  for type rank: the 680-unit viewBox at a full 1072px plate scales 1.503x and
  renders the plot's 10px axis type at 15px, above the page's 13px mono label
  rank. Measured as shipped: 900px wide / 1.324x / **13.24px** at 998, 1366, 1920
  and 2560; 580px / 0.853x / 8.53px at 320–640, where the plate pans instead.
  Capping only the drawing inside an uncapped plate left the SVG ending 147px
  short of the plate's inner right edge at 1440 while the footnote hairline still
  ruled the full width — the empty-ruled-line signature of unfinished, one level
  in. 998px is where the handoff must happen (the plate's interior reaches 900px
  when the container's inner measure hits 950px); handing over at 1120 left the
  1000–1119px band with NEITHER cap in force, and the footnote hairline ruled a
  measured 2px past the last gridline at vw=1000, 26px at 1024, 82px at 1080 and
  121px at 1119 — in a band (landscape iPad, a half-width 2560 monitor, small
  laptop windows) that none of the three verify viewports samples. Exactly one cap
  is active at any width. The plot is also pinned with `margin-inline-end: auto`,
  because `direction: rtl` on the scroller otherwise aligns it to the plate's
  RIGHT (measured plot x 209 → 331).
- Coordinates are literal `d="…"` path attributes and axis labels are decimals,
  never percentages — the fact gate masks path data before its numeric tripwires
  run, so a coordinate run can never be read as a claim. The generator also
  spells its keyframe percentages to avoid the gate's number patterns, and that
  spelling is not to be "tidied" back into round numbers.

### The Keyboard (a drawing, not a figure)

`src/components/Keyboard.tsx`, `Keyboard.css`. A 60% layout in **real unit
widths** — 1u alphas, 1.5u tab, 1.75u caps, 2.25u shift, 2u backspace, 2.25u
enter, 6.25u space — with the rows summing to 15u, which is what makes the right
edge line up without fudging any single key. The case is two shapes because a
case has a wall you can see: an outer plate and a recessed well. Every cap is two
shapes, an outline and a sculpted inset top, because that is what a keycap looks
like from above and it is the single detail that separates a drawn board from
squares in a grid. Dual-legend caps print the shifted character upper-left and
the base character lower-left; single-legend caps stay centred. Modifiers are the
darker half of a two-tone set — the one place this drawing takes a colour
relationship from a keycap set rather than from the page.

**What it does not claim.** No model, manufacturer, switch, keycap set, profile
or colourway, because none of that is known and PRODUCT.md forbids inventing it.
Every annotation is true OF THE DRAWING — "60% layout, drawn to unit width — 1u
alphas, 1.75u caps, 6.25u space." A `BOARD_NOTE` slot is marked in the source and
left `null`: it is the owner's sentence to write.

Interaction survives because it earned its place: click a cap, or type while the
pointer is over the board, and the cap travels 1.5 units down and its top warms
toward rust. Listeners are armed only while hovered or focused, every timer is
cleaned up, and the drawing is complete in the static HTML — the caps simply do
nothing until the bundle lands, which is honest for a toy. The hit targets are
**real `<button>`s positioned over the SVG in percentages**, so the interaction
is accessible (real focus rings, real labels) without the drawing becoming a
control surface. They are invisible until focused: a visible button grid laid over
a drawing would destroy the drawing. The 34-unit caps are deliberately NOT in the
site's 44px touch-target list; `Keyboard.css` documents that trade.

### The Boulder (a drawing, not a figure)

`src/components/Boulder.tsx`, `Boulder.css`. One plywood wall — two panels at two
angles, the upper one lighter because it kicks back away from the viewer, with
seams where sheets meet and a **generated** grid of t-nuts clipped to the panels
(the point of them is the regularity; hand-scattered bolts read as decoration
instead of hardware). Fourteen on-route holds and five off-route ones, each drawn
as **shadow + body + bolt**, in four silhouettes — jug, crimp, sloper, pinch —
because a hold you can wrap a hand around, a quarter-inch edge, a featureless
dome and a squeeze are four different objects, and the silhouette is what tells
you which move a sequence is asking for. Each hold is rotated: a wall of
axis-aligned holds is the tell that nobody looked at one. Off-route holds are the
wall's furniture, drawn the same way without the accent, which is what makes the
three sequences read as CHOSEN out of a wall rather than as the only holds on it.

**Its honesty rule, and it is the reason this drawing exists in this shape.** The
paragraph 30px above it is the owner's own words: a boulder can usually be done a
lot of different ways, and which one costs you the least depends on your body.
The drawing this replaced showed ONE route, holds numbered 1 through 8, captioned
as a single prescribed sequence — the exact opposite of the sentence it was
illustrating — and invented a specific problem ("BOULDER / SET 01") that no
source records. So: **three sequences, at equal weight and equal colour**,
distinguished only by dash pattern. All three finish on the same hold because
they are ways up ONE boulder; two share a start because two really would. The
moment one of them is heavier or brighter, the drawing is asserting a correct beta
and has started arguing with the paragraph above it — which is why `verify.mjs`
asserts exactly three sequences with **identical computed stroke, width and
opacity** (verified: all three `rgb(122,46,18)` / `1.5px` / `0.5`, differing only
in `stroke-dasharray`), plus lower bounds on the on/off-route hold counts so the
wall stays a wall.

Two data rules that are the same rule: **the routes are built FROM the hold
coordinates**, not re-typed (the old version hand-wrote its route as a second
copy of all eight positions, so moving a hold slid the line off the dots), and
the accessible name's hold count is **derived** from the two collections rather
than spelled out, because `verify.mjs` asserts only lower bounds on the counts —
so a 15th hold would change the picture, falsify the label and pass every gate,
and a wrong number inside an accessible name is invisible to every sighted
reviewer.

**What it claims: only what is true of the drawing** — three ways up, and the
count of holds you can see. No gym, no grade, no set date, no problem name, and
no assertion that anyone climbed any of it. `verify.mjs` also forbids the retired
invented identity coming back in any skin.

The drawing is square, deliberately: the 5:6 topo it replaces once stood 1.86x
its shortest sibling and measured the largest, most saturated object in the whole
document, one screen above the benchmark it out-shouted. A hobby drawing does not
get to be the loudest thing on a recruiting page.

### The System Diagram

Three small box diagrams (`raft` / `lsm` / `ann`) inside the spec sheets' evidence
column, built from HTML boxes and hairline connectors with an arrowhead
pseudo-element. Stage labels are single tokens and carry `nowrap` — "top-k" broke
mid-word at 900w and made the figure read as a rendering bug — so the box grows
instead of the label breaking, and the connectors are the figure's only
shrinkable part. The caption is a real box in the flow (`flex: 0 0 100%`); it used
to be absolutely positioned and measured 20–35px INTO the stage boxes on mobile.

The diagram is **hidden below 640px** and that is a mobile-budget decision, not a
permanent one: the proof is the readout and the artifact links, and the diagram
was ~200px per plate on a page with three of them. The `≤479px` geometry rules
that follow it therefore cannot paint at any width they apply to; they are kept,
not deleted, because they are what the diagram would need if the hide were ever
lifted.

### The 404's empty plate

Drawn axes with nothing plotted, in the plate grammar, labelled "This page" with
the footnote "404 · nothing here". The whole figure is `aria-hidden` — it is a
joke in the drawing conventions, not information — and the recovery links below
it are what `verify.mjs` asserts.

### The nav mark

A plate with drawn axes, a rising three-point sample line in the data colour, and
one rust annotation dot on the middle sample: the thesis at 32px, and the same
drawing as the favicon. Paths are literal `d` attributes, so the mark is one
object in the grammar rather than a lettermark that happens to sit in the corner.

### The Legend Modal (`.kbd-help`)

The site's one dialog — the `?` legend-and-shortcuts panel, injected by
`enhance.ts`. It is a plate that happens to be modal: hairline boundary, flat
fill, and the backdrop is what separates it from the page rather than a blur under
its own edge. The `?` affordance is a fixed button, hidden on touch and below
640px.

Its name and geometry both carry rules:
- **`aria-labelledby` pointing at the `<h2 id="kbd-help-title">` it already
  renders**, not a hand-written `aria-label`. Two strings for one name can drift;
  one cannot. The title is a real `<h2>` — a rank under the page `<h1>` — instead
  of a `<p>` styled to look like a heading, so the panel exists in the document
  outline. Every id and class in the injected markup is asserted by `verify.mjs`,
  which also drives the open/escape/backdrop-click states and the focus trap.
- **The overlay SCROLLS, and both halves of that fix are load-bearing.** A
  centred flex item taller than its container overflows both ends equally, and a
  centred item's TOP overflow is not scrollable — at 320×256 the 444px card sat at
  y −86..358, putting the dialog's name 61.5px above the screen and its only
  visible exit 77.5px below it, with no way to reach either; 13.1px above and
  29.1px below at 1024×300. Both are ordinary viewports (400% zoom on a laptop, a
  short window). So: `overflow: auto` on the overlay, `align-items: start` plus
  `margin: auto` on the card — the auto margin absorbs free space when there is
  any and collapses to zero when there is not, which keeps the centred rest state
  at full height while letting a too-tall card grow past the container. Measured
  after: the card is fully on-screen at 24..232 (320×256) and 24..276 (1024×300),
  its own content scrolls 235 / 137px, and the title and the Close button are both
  reachable. `cardMargin` computes 0px on the short viewports and 231.4px at
  1366×900 — the same rule doing both jobs.
- **The backdrop is `fixed`, not `absolute`.** An absolutely positioned child of a
  scroll container is laid out at the scroll origin and then scrolls with the
  content, so on a short screen the backdrop slid off the top and left raw page
  showing above the card.

### The Static Fallback (`.static-fallback`)

Not a visual primitive — a contract, recorded here because it owns two CSS rules
that each read as redundant on their own. Every page root is wrapped in an
`ErrorBoundary` whose fallback is not an apology but **the prerendered page**: it
snapshots `#root`'s markup at module evaluation, before `createRoot` replaces it,
and on a caught error re-renders that snapshot and strips the root `.js` class.
The design argument is that this site already ships a complete static render of
every page and PRODUCT.md requires the no-JS page to carry everything that
constitutes proof, so the correct fallback for a broken interactive layer is the
no-JS page. There is deliberately **no visible banner** — reporting a failed layer
the reader cannot see is a defect with no user-facing consequence and no action
available; the failure goes to `console.error` and a `data-static-fallback`
attribute.

The two rules, both mandatory:
- **`.static-fallback { display: contents }`.** The wrapper exists only to hold a
  snapshot. With a box of its own it becomes the single flex item of `#root`, and
  Nav / main / Footer stop being flex items at all — the footer would float
  mid-viewport on the 404.
- **The paired `#root > .static-fallback > main` selector beside `#root > main`.**
  Not redundant: `display: contents` removes the BOX, never the element, so a `>`
  selector still does not match through it, and without the pair the restored
  `<main>` loses its `flex: 1 0 auto`.

Related, and the same class of ordering bug: `.js` is set **after** render
(`enableJs()` at the end of each page entry), because the class is the receipt for
a completed mount. As an import side effect it hid intact prerendered content
whenever anything above it threw. `verify.mjs` asserts the class is not baked into
the static HTML.

## Layout

A 1120px container with 24px gutters (16px below 480px). One vertical rhythm
token, `--section-gap`, owns section separation: 96px on desktop, 64px below
768px, 32px below 640px. Every section-level block carries its gap *above* itself
and nothing carries a gap below, so the four stacked verticals that used to
compound (section padding, main padding, contact-band margin, footer margin)
resolve to a single value and need no patch rule. Space is a nine-step ladder
(4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px).

**The Last-Child Rule.** A block that closes its container owns that container's
bottom edge and carries no trailing margin — a bottom margin inside a box whose
own padding or hairline already states the edge is two spacing mechanisms on one
boundary. Scoped with `:last-child`, since `.project-links`, `.skills-row` and
`.hero-email-plain` each also appear mid-container elsewhere, where the margin is
correct. It is not collapsed away for free: all four parents are flex or grid, so
the margins were painted in full — 64px of doubled air at *every* width, 1440
included.

**The Media-Block-Goes-After Rule.** This stylesheet resolves overrides by SOURCE
ORDER at equal specificity, never by adding a qualifier — so a
`@media (max-width: 639px)` rule must sit *after* the base rule it overrides, and
one consolidated mobile block near the top of the file is therefore a trap, not a
convenience. The file recorded this failing three times (`.section-head`,
`.hero-band`, `--section-gap`) and then reproduced it a fourth time at larger
scale, where **eight of ten rules silently computed the desktop value at 390w**
— `.contact-layout` 48px, `.footer` 48px, `.system-feature` 16px, `.skills-row`
24px, `.contact-copy h2` 16px — with the build green and every gate passing. Only
a computed-style probe caught it. The rules are split to sit beside the base rules
they override, each carrying a comment saying so.

**The cross-file version is worse and is the same rule:** a component stylesheet
(`Sweep.css`) is emitted *after* `index.css`, so its unmediated declaration beats
index.css's mobile block regardless of which file "looks" more specific — this is
exactly how the Sweep kept a 16px plate gap while every other plate stepped to
8px, six children deep, costing 40px of phone height. Mobile overrides for a
component belong in that component's own file, and if the primitive's mobile step
changes, that rule has to follow it.

Corollary for any future pass: after changing a mobile vertical, assert its
**computed** value at 320 and 390, per declaration. The twelve verify combos
cannot see this class of defect — a rule losing the cascade renders a taller
page, not a broken one.

**The One-Left-Spine Rule.** The page has exactly one alignment spine: the
container's inner left edge (x = 184 / 147 / 104 / 64 / 24 / 16 by width, which is
the nav brand's own edge). Every block starts on it — the nav brand, the hero,
every section head, every plate, the hobby grid, the skills rows, the contact
band. The only thing permitted to leave that edge is the interior of a figure's
own drawing, and even there the drawing is pinned to the plate's padding edge
rather than allowed to float. A centred band on a left-aligned page reads as a
second document pasted on top, which is what a 2026-07-27 centred hero produced
and what this rule supersedes — deliberately, as a decision, not as drift.
`verify.mjs` gates both the hero kicker and the first section head against the nav
anchor at every viewport, so re-centring anything fails the build rather than
shipping.

The box diagram inside a spec sheet obeys this rule too. It shipped
`justify-content: center`, which is the "allowed to float" case the paragraph
above rules out: below 1024px the evidence column is the plate's full measure, so
the drawing sat a measured 191.8 / 224.8 / 257.8 / 307.8 / 319.3px off the spine
at 768 / 834 / 900 / 1000 / 1023w — the largest single left-edge miss on the site,
inside a plate whose label, readout and footnote strip all start on that edge.
`flex-start` pins it to the padding edge (deadLeft 0.0 at every width from 640 to
2560), and the caption drops its `text-align: center` for the same reason: a
centred caption under a left-pinned drawing puts one figure's two halves on two
different edges. The dead field moves to the drawing's right, where a figure is
entitled to end before its plate does.

### Responsive behaviour, as built

- **Hero**: three named grid areas — `lead` (kicker, name, bio, the availability
  chip), `rail` (the three-repo readout), `tail` (the AWS sentence, the CTAs, the
  contact line). Single column until 1024px in that DOM order, then
  `"lead rail" / "tail rail"` at `1fr / minmax(420px, 1fr)`. The three-area split
  exists for two measured reasons, and NO `order` property is used to achieve
  either: (a) with the rail authored last, its first row closed at y=1070 on a
  390×844 phone — 226px below the fold, so a phone screener met the bio and no
  evidence; reordered, it closes at ~715; (b) at 1440 the tab order ran down the
  copy to y=595 and then jumped 407px back up to the rail. Areas fix both at
  once, because DOM order is the reading order at every width. 50/50 and not
  56/44: at 44% the readout's unit column wrapped to three lines and "878 µs"
  broke across two, because Martian is a wide face.
- **Spec sheets**: single column until 1024px, then copy 1.2fr / evidence 0.8fr
  with the evidence column separated by a left hairline instead of a top one. The
  900px breakpoint was measured and abandoned — the evidence column could not hold
  its own figure there (1px gutters, "top-k" wrapping mid-word).
- **Timeline**: left-rail single column on mobile, centre-spine true interleaving
  from 900px (88px column gap, 44px each side of the spine). Cards span two grid
  rows and each starts one row later, so a right card begins near the vertical
  midpoint of the left card rather than in its own blank full-height row —
  `verify.mjs` asserts both the alternation and the interleave.
- **Hobby grid**: one column below 1024px; three columns above it, where the grid
  declares three named rows (heading / paragraph / figure) and each cell
  `subgrid`s onto them. That is the only way three independent columns share a
  horizontal edge — authored as three flex columns, each figure started wherever
  its own paragraph happened to stop (tops 1181 / 1258 / 1155 at 1440, 103px of
  scatter). `align-self: start` on each figure is load-bearing: a subgrid row
  stretches its item, which would pull the drawings to each other's heights and
  distort them. The paragraphs are pinned to the top of their row for the mirror
  reason — a ragged bottom is normal typography, a floating paragraph is not. A
  browser without subgrid falls back to the flex column, which is what shipped
  before, so it degrades to no-change. The grid closes on a hairline at every
  width, like the hero band and every plate footnote.
- **Sheet grids**: one column, two from 768px, three for the `-3` variant.
- **Nav**: fixed 64px height at every width. The wordmark hides below 640px and
  the whole brand below 360px; tab padding and gap tighten in three steps so the
  last tab keeps a ≥12px gutter at 320px rather than the brand reappearing.
- **Touch**: 44px minimum in both axes on every interactive primitive; block and
  repo titles get padding-plus-negative-margin below 768px so a 20px line box
  hit-tests at 44px without changing the page's height budget. The same idiom
  covers `.hero-readout-repo` (three fold-level routes into the evidence) and
  `.sweep-source` (the link a senior engineer taps to falsify a number).

**The tab row PANS, it never pushes the page.** `.nav-tabs` is an
`overflow-x: auto` scroll container with `min-width: 0` — the same answer
`.sweep-scroll` gives a plot too wide for its plate, applied to the one component
every page depends on. Under text-only zoom (the reader raises the root font size
and the viewport stays at 320px) the four tabs outgrow the nav's measure, and as a
flex item at its default `min-width: auto` the row could not shrink, so it drove
the whole DOCUMENT into horizontal scroll: 30px of page overflow at 320w with the
root at 18px, 47px at 19px, 65px at 20px, with the Contact tab's right edge 1.7 /
15.5 / 29.3px outside the viewport. Measured after: 0px of document overflow at
every root size to 24px, where the row itself pans 6px instead. The frozen box is
untouched.

Two details there are load-bearing, and the reason they are recorded here rather
than left in the stylesheet is that both look like removable noise:
- **The `padding-block: 5px` / `margin-block: -5px` pair cancels out**, so the
  box is the size it always was — but the padding is what puts a focused tab's 2px
  ring plus 2px offset INSIDE the scroll container's clip box. Delete it and every
  tab's ring is clipped 4px top and bottom. 5px rather than exactly 4 leaves 1px
  of slack so a sub-pixel layout cannot shave the ring's last row.
- **The scrollbar is hidden**, because a classic horizontal scrollbar drawn inside
  a 64px bar whose height is gate-asserted would break that assertion. Focusing a
  tab scrolls it into view and every tab is still a real link in the tab order.

**The nav's geometry is frozen**: 64px height, and the progress rail pinned at
`bottom: -3px; height: 7px`. `verify.mjs` measures the rail's top edge against
navBottom−3px with a ±2 tolerance, so the two move together or the gate fails, and
it whitelists the rail's children by class — the rail's ONLY children are the
scrub fill and the scrub marker, so an ornament squatting in that 7px box fails
under any name. Restyle its appearance; do not move its box.

### The phone budget

The phone page is held to a low-thousands scroll height and supplementary
illustration is dropped rather than shrunk (the box diagrams below 640px). A
structural pass on the owner's ask took the home page 9,288 → 8,635px at 390w
(−653, −7.0%) with **no content removed, nothing hidden on mobile, no
`display:none` added to any number, metric, repo link or footnote, and no "read
more" introduced.** Every pixel came from whitespace or a cascade defect.
Attribution was leave-one-out — each group reverted against the shipped
stylesheet and re-measured — and the parts summed to the whole exactly (557 at
320w, 653 at 390w), so nothing was double-counted. The largest contributors: the
three sheets' interior copy ladder 16→12px (88px), the Last-Child Rule (64), hero
interior (56), `--section-gap` 48→32px across 5 boundaries (53), the skills block
(48), the contact band (44), the Sweep's cross-file cascade loss (40), the footer
(40). Text was verified NOT to reflow: hobby leads 4/5/4 lines, coursework 6,
skills 2×5, footnotes 1/2/3/7/6/7 — identical before and after.

Current heights, measured 2026-08-05 on the built pages (`scrollHeight`), after
the preview-variant change moved three duplicated sheets off the home page:

| page | 320w | 360w | 390w | 414w | 1366w |
|---|---|---|---|---|---|
| `/` | 8,483 | 7,776 | 7,453 | 7,125 | 5,075 |
| `/experience/` | 7,901 | 6,941 | 6,460 | 6,112 | 3,611 |
| `/projects/` | 9,608 | 8,743 | 8,082 | 7,742 | 5,063 |

What was measured and **rejected**: shrinking the boulder's phone cap
(320 → 280px buys 40px, but the holds are fixed-size over a percentage wall, so
hold density went 11.2% → 15.1% and hold-on-hold collisions 1 → 3 — that distorts
a drawing); the 68ch mono caps, which are *inert* on phones (the padding computes
to 0px at 320/360/390/414); and the diagram containers, which already collapse to
exactly 0px under `display: none` and reserve no space. Going materially lower
means cutting copy, which is an owner decision and not a layout pass.

## Elevation, depth and shape

There is no elevation. No ambient shadow, no gradient wash, no glow. Depth comes
from three things: a few points of surface luminance between page, figure and
inset; a 1px boundary; and a 1px–2px lift on hover. A surface that wants more
presence gets a stronger border, never a softer edge.

**The Hairline-Only Rule.** `box-shadow` survives in exactly **two** roles, both
hairlines drawing a shape CSS has no other way to draw: the rust tick under the
current nav tab (`inset 0 -1px 0`), and the halo around the scroll-progress scrub
marker (`0 0 0 1px`). If a `box-shadow` has a blur radius or an alpha, it does not
belong here.

Blur exists in exactly two places and neither is under an edge: the nav's
`backdrop-filter` (with a solid `@supports not` fallback) and the modal backdrop's
2px. Both are *behind* content, not decoration on it.

**One radius: 2px** (`--r-xs`) on everything rectangular — plates, sheet blocks,
buttons, `<kbd>`, the modal panel, the logo chip, the site mark, the diagram
stages. It reads as a drawn frame rather than a soft object. The single exception
is the pill radius (`--r-chip`, 999px) on non-interactive chips and the timeline
group label, which is what keeps a chip visually distinct from a button at the
same size. Circles are reserved for the Raft diagram's nodes, timeline nodes
(12px), the proof chip's status dot (6px), the scrub marker (7px), the plot's
sample marks (r=4) and the boulder's t-nuts and bolts. The keyboard's 3.5-unit cap
radius and 3px hit-target radius are drawing dimensions, not page furniture.

Route holds are the one organic silhouette in the system — four asymmetric
silhouettes drawn once each in local coordinates and placed by transform — and
they are contained inside the boulder.

Gradients appear only as machinery, never as decoration: a repeating
`linear-gradient` generates the axis rule's four ticks and the progress rail's
quarter-mark ticks, because a repeating tile is the cheapest way to draw evenly
spaced hairlines. No gradient ever fills a surface.

## Motion

**One animated moment, and it is user-driven: the Sweep's crosshair.** Around it:
one scroll-reveal fade, and hover/focus feedback. That is the whole system. The
hero's 7-step cascade, the page-head rise-in, the timeline dot pop, the
route-draw and hold-set sequences and the status-dot pop are all deleted — five
stacked systems on first paint was the tell.

`src/index.css` declares **no keyframes at all**; every motion in it is a
transition on an interaction. The one `@keyframes` in the tree lives inside the
generated SVG (the Sweep's walking cursor) and is scoped to `.sweep-plot`.
Anything that wants a keyframe back should first answer which animated moment it
is.

The scroll-reveal fade is permitted machinery, gated on **both** the `.js` root
class and `prefers-reduced-motion: no-preference`, and the built CSS must keep
both the `reduce` and `no-preference` queries. Nothing revealable may start hidden
under `reduce`, and no revealable element may sit inside a `display: none`
container — `verify.mjs` asserts both, walks a full scroll to check every
`.reveal` gains `.is-in`, and asserts the footer never reveals. Under `reduce` the
crosshair still tracks; its transition just drops to 0ms.

## Print

`@media print` re-declares the nine raw tokens to paper values and then uses
literal hexes for the surfaces and controls it must force. The screen world is
already light, so print no longer inverts a dark theme — what paper needs is the
two things it does differently: the tinted surfaces become true white so a figure
does not print as a grey slab, and the two saturated roles darken enough to clear
AA in ink. Computed from the paper values (WCAG 2.1, and re-read from the live
computed styles on a cold print load): print charcoal `#1a1815` on white
**17.72:1**, the darkened slate `#24405A` on white **10.74:1**, white on the
darkened rust `#6B2810` **10.85:1**, and the print body's `#4a463e` **9.39:1**.
(The comment in `index.css`'s print block quotes 15.9 / 8.2 / 9.1 for three of
these against surfaces it does not name; those figures do not reproduce from the
hexes beside them and are not restated as current here.)

Every paper value is **warm**, and that is a correction: the sheet borders, links
and control boundaries were `#c4ccd4`, `#0b3a6b` and `#6b7885` — all at hue
210–211°, cool blue-greys inherited from the retired dark palette, printed on a
page whose every other value is warm (39–42°). They are now `#d5d1c8`, `#24405a`
and `#8a857c`, so the printed sheet carries ONE world's colour.

Three print rules are not belt-and-braces:
- **Reveal-hidden content is forced visible.** The IntersectionObserver never
  fires for below-the-fold sections when printing from a fresh load.
- **A collapsed grid must re-declare its gap.** `display: block` on `.hero-layout`
  discards the 32px row gap and `block` has no gap primitive, so on a cold print
  load (media emulated BEFORE navigation — the case a hot reload hides) the
  identity, the evidence rail and the AWS-plus-CTA block butted at a measured 0px
  at both 1440 and 794px, printing as one undifferentiated column. The two blocks
  that FOLLOW one carry `margin-top: 32px` in print — the same value the screen
  grid spends — and `.hero-lead`, being first, carries none, so the band never
  opens on dead air.
- **Print blocks are where dead selectors hide.** This block listed
  `.climbing-route` after the topo was replaced and `.about-visual` after that
  component was deleted, so two rules matched nothing and the boulder printed.
  Nothing renders differently until someone prints the page, so a stale selector
  here is invisible. It is `.boulder` now.

## The two places a literal value is CORRECT

Everything on this site takes its colour and size from a token. There are exactly
two documented exceptions, both deliberate, both verified, and both re-flagged by
a design detector on every pass — so the reasoning lives here rather than in a
commit message nobody re-reads.

### 1. The print sheet is fixed values, not tokens

`@media print` re-declares the nine raw tokens to paper values and then uses
literal hexes for the surfaces and controls it must force (`#ffffff`, `#1a1815`,
`#24405a`, `#8a857c`, `#d5d1c8`). This is not drift.

A previous pass tokenised the print block. The printed primary button regressed to
a **measured 1.59:1**, because any later `:root` remap silently reaches into the
print sheet — the print rules inherit whatever the screen world decides next.
Fixed values cannot be reached that way. The mechanism is worth stating: the
buttons are anchors, so print's `a { color: … !important }` beats the primitive's
own unprefixed `color: var(--btn-label)`, while the primary's fill still resolved
through a token — a dark label on a saturated field on the first Save-as-PDF from
a fresh load.

Measured on a COLD print load (print media emulated *before* navigation, which is
the case a still-earlier pass missed), re-run 2026-08-05 at both 1440 and 794px
(A4 at 96dpi) and identical at both: body text **17.72:1**, primary CTA label on
its fill **10.74:1**, its border **3.67:1** against the paper, every sheet border
**1.52:1**. The CTA figure is 10.74 and not the 11.46 an earlier pass recorded,
because the warm-paper rebase moved the link colour from `#0b3a6b` to `#24405a` —
0.72 of a ratio nobody can see, spent to stop the printed sheet carrying two
different blues. The border is the one value with little headroom: 3.67 against a
3:1 non-text floor. Re-measure all four before touching this block, and do not
re-tokenise it.

### 2. SVG font-size inside a drawing is a drawing dimension

`font-size` values inside an SVG — `10px`/`11px` in `.sweep-plot`, `10px`/`8px` on
the drawn keyboard's legends and sublegends — are **viewBox user units**, not CSS
ramp steps. They are the same class of value as a tick length or a stroke width,
and putting them on the type ramp would couple a drawing's internal geometry to
the page's reading sizes, which are unrelated systems.

The plot is 680 units wide and scales with its container, so its "10px" renders at
8.53px at 320–640w and 13.24px from 998w up (measured across nine viewports;
13.24px is the page's 13px mono label rank, which is the constraint the plate's
950px cap exists to hold). They are tuned so ten per-point labels never collide,
and the generator asserts collision-freedom rather than trusting it.

Everything the reader must actually READ from the curve — every recall value,
every QPS figure, the annotation — also exists as real HTML text at ramp sizes: in
the callout, the readout line, the footnote and the transcription table. The SVG
labels are the drawing's own annotation layer, not the proof.

The keyboard is the clearer case: its keys are 34 user units wide, so a legend at
10 units is proportioned to the cap it is printed on, exactly as the 1.25-unit
case stroke is proportioned to the case. That "10px" renders at 5.35px on a 320px
phone and 6.25px at 1366 — which would be an accessibility defect if it were
information, and is not, because **nothing on that drawing is information a reader
needs**: it carries no claim and no number, and the caption states in real text
what the drawing shows.

## The gates are part of the design system

A visual rule that cannot survive the gates is not shipped. Five commands, all of
which must pass:

```
npm run check      # generate figures + fact/framing gate (also runs as prebuild)
npm run typecheck
npm run lint
npm run build      # tsc -b && vite build && prerender
npm run verify     # Playwright, every page at 1366×900, 390×844, 320×700
```

`scripts/check-facts.mjs` holds required exact strings and forbidden patterns
(including retired claims), scans `src/`, `public/`, the four HTML entries and
`README.md`, and masks SVG path data before its numeric tripwires run.
`verify.mjs` drives twelve page/viewport combos and asserts, among others: head
metadata, nav state and the frozen rail box, internal links, locked facts and the
absent-text tripwires, the light-surface luminance band, **no synthesised
italics**, caption/figure non-overlap, hero-rail overlap and mid-token wrapping,
primary-CTA contrast at rest *and* hovered, the reveal contracts, the
no-JS/broken-mount fallbacks, the boulder's honesty contract, the build-artifact
gates (four font files present, the 24,000 B budget, no remote `@font-face`, no
`tabular-nums`, eight preload tags), and zero console errors.

**Prove a new gate by reverting the defect it claims to catch. A gate nobody has
seen fail is a comment.** Three lessons from doing it, each of which is why a
particular gate is written the way it is:

- **The no-italic gate**, re-proved 2026-08-05: `.kicker { font-style: italic }`
  → **6 of 12 combos FAIL, 21 findings**, each naming the element and quoting its
  text. Removed: twelve PASS, exit 0. It walks EVERY element and reads the
  COMPUTED value, so it also catches a UA default (`<cite>`, `<var>`) and a
  component stylesheet emitted after `index.css`; elements with no painted text
  are skipped, because an italic that paints nothing is not a defect a reader can
  see.
- **A gate must not lock a defect in place.** The boulder's old gate asserted the
  literals "START", "TOP" and "BOULDER / SET 01" and a single 8-hold route — i.e.
  it pinned the invented problem and the one-correct-sequence framing that
  contradicted the owner's own paragraph. A gate that locks a defect is worse than
  no gate. What is asserted now is what must stay true: three sequences at equal
  computed weight, no invented identity, and an accessible name that agrees with
  the data.
- **A gate written against one dead name is not a gate.** The rail assertion used
  to count one retired class that no component had emitted for weeks, so it could
  only ever read 0 — while a differently-named ornament would walk straight past
  it. It is now stated as the contract (the rail's only children are the fill and
  the marker), whitelisted by class. Same lesson in the fact gate: a tripwire for
  a retracted figure originally matched one spelling of it and missed the em-dash,
  spaced-hyphen, spelled-out-"to", bare-multiplier and stale-QPS forms.

Two more, worth stating because both cost a real defect:
- **`verify.mjs`'s `absent` list is a regression tripwire, not coverage.** Every
  string on it is vacuous today by design — no source can produce it — so a
  passing run is not evidence those strings were checked against anything live.
  The bar for staying on the list is that the string would be UNTRUE, not merely
  old: a retired *design* is not a falsehood, and freezing one is not a truth gate.
- **A required string that any comment can satisfy is not a gate on the site.**
  Locked measured values are checked against `src/content.ts` specifically,
  because a corpus-wide check passed while the value was deleted from the module
  that renders — a CSS comment mentioning it was enough.

## Do's and Don'ts

### Do

- **Do** keep the two grammars apart: a plot gets hairlines, ticks, a `FIG.`
  label and a footnote strip; a drawing gets shapes, depth and a prose caption.
- **Do** keep the data colour inside figures and make every clickable, focusable
  or scrubbable thing the rust accent.
- **Do** put a cap-beige label on any rust fill.
- **Do** separate two series by dash, not by hue — the palette has one accent and
  one data colour.
- **Do** wrap a measured claim in a plate, with its conditions in the footnote
  strip and what it does NOT cover in a titled column at body size.
- **Do** number a figure only when the object genuinely is one: the three spec
  sheets are FIG. 01–03, the Sweep is FIG. 03 DETAIL, and hobbies and the 404 take
  plain labels.
- **Do** vary the number of readout rows with the evidence (3 / 2 / 2 as shipped).
- **Do** state a section's rank so the heading size and the gap above it move
  together.
- **Do** use `--section-gap` for section separation and the 4→96px ladder for
  everything else.
- **Do** set every measured number in the mono face, and keep footnote *prose* at
  14px or larger.
- **Do** write a hover state once, at one specificity, with the label colour
  restated from the variant's own custom property.
- **Do** keep proof in the markup. If it only exists after a pointermove, a hover,
  a scroll, or a bundle load, it is not proof.
- **Do** generate a figure from its measurement rather than transcribing it, and
  assert byte-exactness against the source.
- **Do** let a figure pan on narrow screens rather than shrinking its labels below
  legibility, and start the pan at the annotated end.
- **Do** put a component's mobile overrides in that component's own stylesheet,
  and put every media block after the rule it overrides.
- **Do** prove a new gate by reintroducing the exact defect it names, and record
  the failure message.

### Don't

- **Don't** give the data colour an interactive role, or the accent a data role.
- **Don't** put charcoal on a rust fill (1.64:1).
- **Don't** set body-register text in `--ink-secondary` below 14px.
- **Don't** dress a drawing in the plots' grammar. That uniformity is the
  signature that got this site called machine-made, and the fix is not reversible
  by taste.
- **Don't** add a blurred or alpha `box-shadow`. The only shadow is a hairline;
  the two existing uses are the nav tick and the scrub marker's halo.
- **Don't** use a gradient to fill a surface. Gradients here generate evenly
  spaced hairline ticks and nothing else.
- **Don't** introduce a second radius. 2px for everything rectangular, the pill
  only for non-interactive chips and the timeline group label.
- **Don't** add a second `:hover` rule for the label button, and don't qualify one
  with `:not()` — that is the exact shape of the invisible-CTA defect this system
  was rebuilt around.
- **Don't** add an entrance animation or a keyframe to `index.css`. The site is
  entitled to one animated moment and the crosshair has it.
- **Don't** let anything revealable start hidden under
  `prefers-reduced-motion: reduce`, and don't place a revealable element inside a
  `display: none` container.
- **Don't** reintroduce a `.card` primitive, or build a fixed-column metric grid
  to hold varying evidence. Both were deleted, and the second is what the readout
  replaced.
- **Don't** write `font-variant-numeric` — Martian Mono ships no `tnum` and the
  built CSS is gated against the property.
- **Don't** colour metadata — coursework, skills, tech tags — to compete with
  evidence.
- **Don't** set a `padding` shorthand on `.hero`, `.page-head` or `.not-found`:
  they share their element with `.container`, and a shorthand zeroes the page's
  horizontal gutter.
- **Don't** change the nav's 64px height or the progress rail's box, put anything
  else inside that box, or un-hide the brand below 360px — the tab row's left edge
  is an alignment anchor there.
- **Don't** re-tokenise the print block, and don't put an SVG's internal
  `font-size` on the type ramp. See the two exceptions above.

## Slots left open, deliberately

- **Photos: none.** The owner said "maybe later", so nothing here needs one and
  nothing stands in for one — no stock imagery, no illustration substituting for a
  photograph, no generated image.
- **`BOARD_NOTE`** in `Keyboard.tsx` is the owner's slot to name his actual board.
  Left `null`; the drawing does not need a caption to be worth looking at, and
  guessing a model would be an invented claim.
- **A dark counterpart** is ~10 re-pointed semantic roles, which is the reason for
  the two-layer split.

## Known defects, measured and not yet fixed

- **The Sweep's phone-only HTML series key draws both series in one colour and
  carries no dash**, so its two swatches are indistinguishable — the exact
  legibility defect the plot itself fixed by switching to dash. Its own source
  comment already claims the dash ("so the key's swatches carry the dash too"),
  which makes this a documentation/implementation disagreement as well as a visual
  one. Measured at 390w: both `::before` swatches paint `rgb(51,86,110)` at
  `height: 2px`. Fix belongs in `Sweep.css`'s `≤640px` block.
- **`.callout` is dead CSS.** Ten lines plus a `::before` in `index.css`, and no
  component emits the class — grep of `src/` returns no `className` match, and the
  built pages render zero `.callout` elements (the four matches on `/` are the
  Sweep's own `sweep-callout-*` classes, which have their own rules in
  `Sweep.css`). It survives into the built stylesheet. It is the same shape as
  `.data-table` and `.metric-grid`, both already deleted.
- **`--case-border` and `--gasket` are declared and unused.** `tokens.css`
  describes a "case-and-gasket construction" — a 2px charcoal border with a 12px
  inner margin — that no rule implements: every plate draws a 1px `--rule-soft` or
  `--rule` border and a 24px pad. Either the construction lands or the tokens go;
  a token nothing reads is a claim about the system that the system does not keep.
- **`--callout-leader` is referenced only as a fallback** inside the dead
  `.callout` rule and is declared nowhere.

## History, kept only where it explains a rule

Everything below is retired. It is here because each item was paid for with a
measured defect and the reasoning still applies to whatever replaces it — not as
a description of anything currently built.

- **The dark world (retired 2026-08-04 by owner direction).** Three near-black
  surfaces, a three-step ink ramp, three series colours, blue-is-data /
  amber-is-interaction, and a dark-surface luminance ceiling. What survives it:
  the *shape* of the colour argument (saturated colour rationed to evidence and
  affordance, metadata never coloured to look important), the invisible-CTA gate
  it was written after, and the two-layer token split that made the reversal cheap.
  The luminance gate was **replaced, not deleted**: it asserted `lum > 0.05` →
  fail, and now asserts the page surface sits in the light band **0.62–0.93**,
  two-sided on purpose — the floor sits just under the figure fill (0.6474) so a
  page that ever computed its *figure's* colour fails, and the ceiling refuses a
  drift to paper white (1.0), which is the regression that would make this generic
  again. Same strictness, inverted world.
- **The system-font world.** Iowan Old Style display, system sans and mono, and
  "the shipped site loads zero font bytes". What survives it: the type
  *discipline* — the ten-step scale, explicit line-heights, the three-weight
  collapse — which is what actually carries the character. Also the reason the
  measures are per-family: `ch` is the element's own "0".
- **FIG. 00, the boulder topo.** A route drawn as a chart: holds were "sample
  points with a shape", START and TOP were "axis tick labels on the topo", the
  route was "the human annotation on the measurement". Replaced by
  `src/components/Boulder.tsx`. What survives it: the DOUBLE-SHOT rule at the top
  of this document, and the two defects it teaches — a drawing must not wear the
  plots' grammar, and a drawing must not contradict the sentence beside it.
- **The key tester.** "A keycap here is a tick label that happens to be square."
  Replaced by `src/components/Keyboard.tsx`. Same lesson, and the one that named
  it first.
- **The old figure numbering.** FIG. 00 topo / FIG. 01 the curve / FIG. 02–04 the
  systems / FIG. 404. Retired because one subject carried two numbers and three
  cold reviewers read it as a bug. The current scheme is FIG. 01–03 with the Sweep
  as FIG. 03 DETAIL.
- **`.data-table`.** Hairline row rules, striped even rows, mono uppercase
  headers. Deleted as dead CSS — nothing emitted it. The Sweep's transcription
  table is a `<table>` but takes no such treatment; it is visually hidden.
- **`.card`, `.metric-grid`, `.readout-unit`, `.chip-teal`.** All deleted, and
  each for a stated reason: the first was renamed to `.sheet-block` (see above);
  the second is the fixed-column grid the readout replaced, which shipped
  unrendered for weeks; the third was a track no caller ever populated
  (`cell.unit` was always undefined); the fourth spent the loudest colour on the
  site's least load-bearing content — an intro course list — while the measured
  numbers were grey. No source emits any of the four today; the only remaining
  mentions are the comments recording the deletions, which are kept so a future
  pass reads each as a decision rather than an omission.
- **The centred hero (2026-07-27).** Superseded by the One-Left-Spine Rule, and
  gated so it cannot come back by accident.
- **The Sweep beside a rail.** The side-by-side arrangement traded 576px of dead
  horizontal field for a 335px vertical void, and below its own breakpoint drew
  the rail's hairline rows across the whole 976px measure with the last glyph at
  ~452px — 547px of empty ruled line, this world's signature of "unfinished". The
  rail moved to the hero, above the fold, and the Sweep opens the section alone.
- **The duplicated home page.** Thirteen blocks of rendered text were
  BYTE-IDENTICAL across `/` and `/projects/`, and a cold reviewer put it first of
  five findings. One component now serves both with one source of truth:
  `variant="preview"` on home is an index entry (label, title, eyebrow, summary,
  chips, the numbers, and a link INTO the full sheet), `variant="full"` on
  `/projects/` is everything. Nothing is retyped, so a number can still only be
  wrong in one place.
