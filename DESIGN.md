---
name: Figure One
description: A recruiting site set like a measurement report — plates, axes, readouts, and one figure you can scrub.
colors:
  ground: "#080C13"
  plate: "#0B1220"
  plate-2: "#101B2A"
  grid: "#1B293D"
  axis: "#24354A"
  ink: "#EEF5F7"
  ink-2: "#9FB3C8"
  ink-3: "#8295A5"
  series-1: "#38BDF8"
  series-2: "#E9A13B"
  series-3: "#2DD4BF"
  logo-chip: "#FFFFFF"
typography:
  display:
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.4rem, 5.2vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.75rem, 4.4vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
    fontFeature: "tabular-nums"
  footnote:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tabular-nums"
rounded:
  xs: "2px"
  chip: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "48px"
  8: "64px"
  9: "96px"
components:
  button:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "10px 16px"
    height: "44px"
  button-primary:
    backgroundColor: "{colors.series-2}"
    textColor: "{colors.ground}"
    rounded: "{rounded.xs}"
    padding: "10px 16px"
    height: "44px"
  button-current:
    backgroundColor: "{colors.plate-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xs}"
    padding: "10px 16px"
    height: "44px"
  plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xs}"
    padding: "24px"
  plate-label:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
  plate-footnote:
    textColor: "{colors.ink-3}"
    typography: "{typography.footnote}"
    padding: "12px 0 0"
  chip:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "4px 12px"
  data-table-header:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "8px 12px"
  readout-value:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
---

# Design System: Figure One

## Overview

**Creative North Star: "The Measurement Report"**

The site is set like a figure in a benchmark report, not like a portfolio. Every claim
appears inside a plate that names itself, states its measurement conditions, and carries
its limits as a footnote under a hairline. The palette was sampled from the benchmark
plots committed in the featured repositories (amber darkened for contrast), so the world
is not a theme applied to the work — it is the work's own drawing conventions promoted to
page furniture. Density is high but never crowded: content sits on hairlines rather than
in boxes-within-boxes, and separation is always a 1px rule.

The register is austere and instrumental. Surfaces are three near-black tones apart by a
few points of luminance; type carries the hierarchy; saturated colour is rationed to two
jobs and nothing else. Restraint here is a load-bearing claim — a page that spends its
loudest colour on an intro course list is asserting that the course list is the evidence.
The named failure mode of this world is reading *unfinished* rather than *restrained*: any
gap, orphan, or unaligned edge is a bug in the spacing or type system, not a taste debate.

The confirmed rejection is the decorated-résumé default: a hero of name plus mono eyebrow
plus serif aphorism plus four buttons over a decorative canvas, with the proof pushed
below the fold. There is no aphorism slot, no decorative wallpaper, and no symmetric stat
grid — metric counts vary (3 / 2 / 2) because a fixed count reads as a schema filled in
rather than a measurement taken.

**Key Characteristics:**
- Three near-black surfaces (`ground` / `plate` / `plate-2`), two hairline greys, a
  three-step ink ramp, three series colours.
- Blue is data and lives only inside figures; amber is every interaction and every human
  annotation.
- Seven primitives borrowed wholesale from plots: plate, axis rule, readout, sample point,
  callout, data table, label button.
- One shadow in the system, and it is a hairline.
- One animated moment, and it is user-driven.
- Figure numbers only on objects that are genuinely figures.

## Colors

A plot's palette: near-black reading surfaces, hairline structure, and three saturated
series colours held back for evidence and affordance.

### Primary
- **Signal Amber** (`series-2`): the only interaction colour on the site. Links, focus
  rings, the active-tab tick, the single filled primary button per page, the timeline
  node, the crosshair, the knee callout, the route line on the topo, the scroll-progress
  trace and its scrub marker. On a fill it always carries `ground` as its label colour
  (8.98:1); `ink` on amber measures 1.98:1 and appears nowhere.

### Secondary
- **Series Blue** (`series-1`): data, and only data. It draws the HNSW curve and its
  sample points, the site mark's sample line, and nothing outside a figure. It is
  deliberately never an affordance, which is the inversion the whole world turns on.

### Tertiary
- **Logo Chip** (`--logo-chip` `#FFFFFF`): the one true white — the chip behind employer
  logos on the timeline. Vendor marks are drawn for paper, so they sit on paper; nothing
  else on the dark theme may be pure white. (The `@media print` remap reuses raw paper
  values by design — see the print rule below.)
- **Series Teal** (`series-3`): the second measured series (IVF-PQ), plus the status dot
  on a proof chip. Present so a two-series plot can be read; never used for emphasis.

### Neutral
- **Ground** (`ground`): the page, and every section body. Measured luminance 0.0036
  against the dark-theme gate's 0.05 ceiling. The hero and page-head bands are the one
  exception: they sit on `plate`, so the first screen reads as one wide plate on ground.
  The hero band is **closed** by a 1px `grid` rule at its bottom edge — six points of
  luminance is not enough for a band to read as a band, and an unclosed one reads as the
  background having a soft accident in it rather than as the first screen ending.
- **Plate** (`plate`): every figure, card, nav bar, footer, and modal surface. Chosen to
  match the source plots' own canvas so a real plot could drop in unrestyled.
- **Plate Two** (`plate-2`): the second-level surface — data-table stripes, the current
  nav tab, the topo's wall face.
- **Grid Hairline** (`grid`): the universal 1px boundary. Every card border, every strip
  divider, every chart gridline, the nav's bottom edge, the halo around a sample point.
- **Axis Hairline** (`axis`): the slightly brighter rule reserved for drawn axes and axis
  ticks, so an axis reads as structure and a gridline reads as reference.
- **Ink** (`ink`): body text, headings, readout values (17.76:1 on ground).
- **Ink Two** (`ink-2`): plate labels, kickers, captions, deks, secondary metadata
  (9.10:1).
- **Ink Three** (`ink-3`): footnotes, units, tick labels, off-route samples, and the
  boundary on non-amber emphasis states. Floor of 6.06:1 on plate and 5.60:1 on plate-2,
  which is why footnotes are never set below 14px.

### Named Rules
**The Blue-Is-Data, Amber-Is-Interaction Rule.** `series-1` may appear only inside a
figure, where the source plots already put it. Everything a reader can click, focus, or
scrub is `series-2`. No third meaning for either colour, ever.

**The Ground-On-Amber Rule.** An amber fill takes a `ground` label. There is no exception
and no lighter amber that changes this; the 1.98:1 alternative is a measured invisible-CTA
defect that the build carries a gate against.

**The Two-Jobs Rule.** Saturated colour is spent on evidence and on affordances. Content
that is metadata — coursework, skills, tech tags — is set in `ink-2` / `ink-3` on a
hairline, never coloured to look important.

## Typography

**Display Font:** system old-style serif (Iowan Old Style → Palatino → Georgia)
**Body Font:** system sans (ui-sans-serif → system-ui → Segoe UI → Roboto)
**Label/Mono Font:** system mono (ui-monospace → SF Mono → Cascadia Code → Menlo)

Webfonts are deliberately deferred: the shipped site loads zero font bytes. The type
*discipline* — the scale, the explicit line-heights, the three-weight collapse, the serif
running down to `h3` — is what carries the character, and it carries it on stacks that are
already on the reader's machine.

**Character:** a printed-report pairing. The serif gives titles the authority of a figure
caption in a journal; the sans carries prose at a comfortable 1.65; the mono does all the
work a plot's own typography does — axis ticks, provenance, units, footnotes, labels —
always with tabular figures so columns of numbers align down the page.

### Hierarchy
- **Display** (700, `clamp(2.4rem, 5.2vw, 3.75rem)`, 1.02): the page `h1` only. A clamp,
  not a fixed size, so the name uses the width available at 1920 and 2560.
- **Headline** (600, `clamp(1.75rem, 4.4vw, 2.6rem)`, 1.15): a rank-1 section heading —
  the page's lead section. The mobile floor sits above the rank-2 size on purpose, so the
  two ranks never collapse into each other on a phone, and never exceed the `h1` above.
- **Title** (600, 1.5rem, 1.15): a rank-2 section heading, and the contact band's heading.
- **Subtitle** (600, 1.25rem, 1.2): `h3` — repo titles, role titles, card titles. The
  serif runs this far down so a flagship repo name reads with a heading's authority.
- **Body** (400, 1.0625rem, 1.65): prose, capped at 66ch (`measure-prose`); hero subhead
  and page deks at 56ch (`measure-body`); the `h1` is held to 22ch (`measure-tight`) so
  the name breaks where it should. MONO prose has its own step, 68ch
  (`measure-mono`), because `ch` is the element's own "0": at 66ch the sans body renders
  54–60 characters per line, while a mono box renders exactly its ch count, so one number
  cannot serve both families. It binds the two mono reading blocks — the plate footnote
  strips and the coursework line — which ran unbounded at 113–131ch (a measured
  117-character line at 1440) because both declared `max-width: none`.
- **Label** (400, 0.8125rem, 0.08em, uppercase, mono): kickers, provenance lines, chips,
  the skills rails, callouts. The 13px mono step is the same rank as an axis label.
- **Footnote** (400, 0.875rem, 1.6, mono): plate footnote strips and the coursework line.
  14px is a floor, not a default — `ink-3` earns AA only at or above it. Leading is 1.6, not
  the 1.5 that shipped through 2026-08-01: light `ink-3` on a near-black plate wants
  compensating leading like the body face does, and 1.5 was the last explicit line-height on
  the page set below the sans body's — on the longest-measure prose on the site.

The scale is ten steps (`--fs-100` 11px through `--fs-900` 2.6rem plus `--fs-display`),
replacing fifteen literal font sizes. Weights are three: 400 body, 600 headings, 700
display.

### Named Rules
**The Fourteen-Pixel Floor Rule.** Nothing set in `ink-3` goes below 14px. Tick labels at
11px and plate labels at 12px are set in `ink-2` or brighter.

**The Rank Rule.** A section declares its rank and the heading size moves with the gap
above it. Five identically-sized headings over five identical pads is the generated-page
fingerprint; rank-1 opens a page, everything supporting it is rank-2. A page gets exactly
ONE rank-1, and it is the section that carries the page's argument — never a preamble that
merely happens to come first. Corollary, and the reason the rule is stated this sharply:
ORDER carries emphasis of a different kind than SIZE does, so a section may lead the page
and still be rank-2. Home does exactly that — the hobbies come first by owner call and sit
at rank-2, while "Featured engineering work" keeps the page's biggest type.

**The Tabular Rule.** Any element that shows a measured number carries the mono family
and `font-variant-numeric: tabular-nums`. Numbers in this world line up.

**The Break-Before-The-Page Rule** (2026-08-02). Two declarations, both added because
`text-wrap: balance` balances the lines it is GIVEN and cannot break a word wider than
its column, which is exactly what the display serif produces at a raised root font size:
- `overflow-wrap: break-word` on `h1`/`h2`/`h3`. Under text-only zoom at 320px,
  "Programming" measured 193.6px inside a 140px timeline column and "Experience" 357.6px
  inside a 288px page-head, painting 10px (20px root) and 42px (24px root) of horizontal
  DOCUMENT scroll — WCAG 1.4.4 failing on the role titles a recruiter reads. `break-word`
  and not `anywhere`: it breaks a word only when there is no other option, so min-content
  sizing and the balanced result are unchanged at every width where the heading fits
  (measured identical at a 16px root).
- `flex-wrap: wrap` on `.cta-text-link`. An `inline-flex` row holds its items on one
  line, so a label allowed to wrap inside a row that is not still measured its max-content
  width and painted 384.7px into a 320px viewport at a 20px root. The wrap is what lets
  the label above actually break, which is why the two travel together.

## Layout

A 1120px container with 24px gutters (16px below 480px). One vertical rhythm token,
`--section-gap`, owns section separation: 96px on desktop, 64px below 768px, and 48px
below 640px. Every section-level block carries its gap *above* itself and nothing carries
a gap below, so the four stacked verticals that used to compound (section padding, main
padding, contact-band margin, footer margin) resolve to a single value and need no patch
rule.

Space is a nine-step ladder (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px). Plate padding is
24px, tightening to 16px below 640px — a 24px frame on a 390px screen spends an eighth of
the width on air. That step belongs to the primitive under BOTH its names, `.plate` AND
`.card`, in one rule (corrected 2026-08-02): only `.plate` carried it, so one object
rendered three paddings at 390w — 16px on a plate, 24px on every `.card` / `.edu-card` /
`.role-card` with no mobile step at all, and a raw off-ladder 20px on `.system-feature`
below 479px that also ran BACKWARDS, giving a narrower screen a wider frame than the
480-639px one. The 20px literal is deleted; there is one mobile pad for every plate-shaped
surface, and the recovered measure took the phone pages down 133 / 517 / 381px (home /
experience / projects at 320-390w).

Responsive behaviour, as built:
- **Hero**: three named grid areas — `lead` (kicker, name, bio, the availability chip),
  `rail` (the three-repo readout), `tail` (the AWS sentence, the CTAs, the contact line).
  Single column until 1024px in that DOM order, then `"lead rail" / "tail rail"` at
  56 / 44. The right column is a text rail, which needs ~360px — not the plot, which needed
  ~640px and is what the old 1200px breakpoint was sized for. 1024px is the breakpoint the
  system plates, the hobby grid and the education card already declare, so the page steps
  once instead of at four different widths. Below 1024 the rail stacks between the identity
  and the tail, capped at 34rem so its hairline rows end where its content does.
  The three-area split exists for two measured reasons, and NO `order` property is used to
  achieve either: (a) with the rail authored last, its first row closed at y=1070 on a
  390×844 phone — 226px below the fold, so a phone screener met the bio and no evidence;
  (b) at 1440 the tab order ran down the copy to y=595 and then jumped 407px back up to the
  rail. Areas fix both at once, because DOM order is the reading order at every width.
- **System plates**: single column until 1024px, then copy 1.2fr / evidence 0.8fr with the
  evidence column separated by a left hairline instead of a top one. The 900px breakpoint
  was measured and abandoned — the evidence column could not hold its own figure there.
- **Timeline**: left-rail single column on mobile, centre-spine true interleaving from
  900px (88px column gap, 44px each side of the spine).
- **Hobby grid**: one column below 1024px; three columns above it, where the grid declares
  three named rows (heading / paragraph / figure) and each cell `subgrid`s onto them. That
  is the only way three independent columns share a horizontal edge — authored as three flex
  columns, each figure started wherever its own paragraph happened to stop (tops 1181 /
  1258 / 1155 at 1440, 103px of scatter). `align-self: start` on each figure is
  load-bearing: a subgrid row stretches its item, which would pull the 264px key tester to
  the topo's height and distort a drawing. A browser without subgrid falls back to the flex
  column, which is what shipped before, so it degrades to no-change. The grid closes on a
  1px `--grid` hairline at every width, like the hero band and every plate footnote.
- **Card grids**: one column, two from 768px, three for the `-3` variant.
- **The Sweep's cap lives on the PLATE, not the drawing** (revised 2026-07-31, superseding
  "the plate is never capped"; handoff width corrected 2026-08-01). `.systems-sweep` caps at
  950px from **998px** up, and `.sweep-plot`'s own 900px cap lifts there. The cap has to
  exist somewhere — the 680-unit viewBox scaled 1.503x at a full 1072px plate renders the
  plot's 10px axis type at 15px, above the page's 13px mono label rank; at 950px it is
  1.324x and ~13.2px, at rank. But capping only the drawing inside an uncapped plate left
  the SVG ending 147px short of the plate's inner right edge at 1440 (unbounded past it)
  while the footnote strip's hairline still ruled the plate's full width — the
  empty-ruled-line signature of unfinished, one level in. On the plate, the plot, the gloss
  and the footnote all end on one right edge.
  998px is where the handoff has to happen, and the original 1120px was wrong: the plate's
  interior reaches 900px — the width at which `.sweep-plot`'s own cap starts binding — when
  the container's inner measure hits 950px, i.e. at a 998px viewport. Handing over at 1120
  left the 1000-1119px band with NEITHER cap in force: the plate grew on the full container
  measure while the drawing stayed frozen at 900px, so the footnote hairline ruled a measured
  2px past the last gridline at vw=1000, 26px at 1024, 82px at 1080 and 121px at 1119 — the
  very defect this bullet was written to record as fixed, and in a band (landscape iPad, a
  half-width 2560 monitor, small laptop windows) that none of the three verify viewports
  samples. Below 998px the container is already narrower than the cap, so `.sweep-plot`'s
  900px is what holds type rank there. Exactly one cap is active at any width, and the plot's
  right edge meets the footnote's from 320px to 2560px.
- **Nav**: fixed 64px height at every width. The wordmark hides below 640px and the whole
  brand hides below 360px; tab padding and gap tighten in three steps so the last tab
  keeps a ≥12px gutter at 320px rather than the brand reappearing.
- **Touch**: 44px minimum in both axes on every interactive primitive; card and repo
  titles get padding-plus-negative-margin below 768px so a 20px line box hit-tests at
  44px without changing the page's height budget.
- **Mobile budget**: the phone page is held to ~6,000px. Supplementary illustration is
  dropped rather than shrunk — the box diagrams hide below 640px because the readout and
  the artifact links are the proof, and the diagram was ~200px per plate. Known overrun:
  the home page measures ~9,300px at 390w, which predates and survives the spine pass.

### Named Rules
**The One-Left-Spine Rule.** The page has exactly one alignment spine: the container's
inner left edge (x = 184 / 147 / 104 / 64 / 24 / 16 by width, which is the nav brand's own
edge). Every block starts on it — the nav brand, the hero, every section head, every plate,
the hobby grid, the skills rows, the contact band. The only thing permitted to leave that
edge is the interior of a figure's own drawing, and even there the drawing is pinned to the
plate's padding edge rather than allowed to float (see the `direction: rtl` note in
Sweep.css). A centred band on a left-aligned page reads as a second document pasted on top,
which is what the 2026-07-27 centered hero produced and what this rule supersedes —
deliberately, as a decision, not as drift. `verify.mjs` gates both the hero kicker and the
first section head against the nav anchor at every viewport, so re-centring anything fails
the build rather than shipping.

The box diagram inside a system plate obeys this rule too (corrected 2026-08-02). It shipped
`justify-content: center`, which is the "allowed to float" case the paragraph above rules
out: below 1024px the evidence column is the plate's full measure, so the drawing sat a
measured 191.8 / 224.8 / 257.8 / 307.8 / 319.3px off the spine at 768 / 834 / 900 / 1000 /
1023w — the largest single left-edge miss on the site, inside a plate whose label, readout
and footnote strip all start on that edge. `flex-start` pins it to the plate's padding edge
(deadLeft 0.0 at every width from 640 to 2560), and the caption drops its `text-align:
center` for the same reason: a centred caption under a left-pinned drawing puts one figure's
two halves on two different edges. The dead field moves to the drawing's right, where a
figure is entitled to end before its plate does.

## Elevation & Depth

There is no elevation. No blur, no ambient shadow, no gradient wash, no glow. Depth comes
from three things: a few points of surface luminance between `ground`, `plate`, and
`plate-2`; a 1px `grid` boundary; and a 1px lift on hover. A surface that wants more
presence gets a brighter border, never a softer edge.

`box-shadow` survives in exactly three roles, all of them hairlines drawing a shape CSS
has no other way to draw: the halo around a sample point and a route hold
(`0 0 0 1px var(--grid)`), the amber tick under the current nav tab
(`inset 0 -1px 0 var(--series-2)`), and the concentric ring on the topo's finish hold.

### Named Rules
**The Hairline-Only Rule.** The only shadow in this system is a hairline. If a
`box-shadow` has a blur radius or an alpha, it does not belong here.

**The Border-Not-Blur Rule.** State is signalled by the boundary going amber plus a 1px
translate, at most. Cards move 2px, buttons 1px, and pressing removes the lift entirely.

## Shapes

One radius: 2px (`--r-xs`) on everything rectangular — plates, cards, buttons, tick
labels, `<kbd>`, the modal panel, the logo chip, the site mark. It reads as a drawn frame
rather than a soft object. The single exception is the pill radius (`--r-chip`, 999px) on
non-interactive chips and the timeline group label, which is what keeps a chip visually
distinct from a button at the same size.

Circles are reserved for sample points (7px on the page, r=4 in the plot), timeline nodes
(12px), the status dot on a proof chip (6px), and the topo's wall bolts. Route holds are
the one organic silhouette in the system — asymmetric border-radius blobs in four
size/shape variants (jug, edge, start, top) — and they are contained inside FIG. 00.

Gradients appear only as machinery, never as decoration: a repeating `linear-gradient`
generates the axis rule's four ticks and the progress rail's quarter-mark ticks, because a
repeating tile is the cheapest way to draw evenly spaced hairlines. No gradient ever fills
a surface.

## Components

### Buttons
- **Shape:** drawn frame (2px radius), 1px `grid` border, 44px minimum in both axes,
  10px / 16px padding, 600 weight at 16px.
- **Default:** `plate` fill, `ink` label. The hairline is the affordance.
- **Primary:** amber fill, `ground` label. One per page.
- **Current (nav / current page):** `plate-2` fill, `ink-3` boundary, and an inset amber
  hairline under the label like the active tick on an axis. Three signals, none of them
  colour alone. It never lifts.
- **Hover / Focus:** border goes amber, the plate lifts by a `--btn-lift` custom property
  (1px; 0px on the current tab and under reduced motion). Written **once**, for every
  variant, at one specificity — the label colour is restated from the variant's own
  property so no ancestor link rule can repaint it. `:active` removes the lift.
- **Copy-email variant:** the same primitive as a `<button>`, with an explicit pointer
  cursor and a polite live region announcing the result. The address always renders beside
  it, so a blocked clipboard degrades to reading it.

### Chips
- **Style:** `plate` fill, 1px `grid` hairline, pill radius, 13px mono, `ink` text,
  4px / 12px padding. Non-interactive by design; the hover state is a barely-warmer border
  and nothing else, because a tag that answers the pointer and does nothing on click is a
  false affordance.
- **Proof chip:** the same tag plus a mandatory 6px teal status dot. The dot is what
  separates a checked number from a tech tag, so it is not an option the caller can drop.
  It rides the FIRST line of its label, not the centre of the chip. `align-items: center` is
  right while a chip is one line — all eleven single-line proof chips measure 0.22px off
  their line's centre — but the hero availability chip wraps (two lines from 640px up, three
  at 390), and centring on its 54.8px box put the dot 11.9px below the first line's centre
  at 1440 and 23.1px at 390: a status dot floating in the gutter *between* two lines of the
  string it qualifies. `flex-start` plus `margin-top: calc((1lh - 6px) / 2)` is
  arithmetically identical to `center` on one line, so nothing that already read correctly
  moved (0.22px before and after), and `1lh` lets the 13px chip and the 16px hero chip each
  derive their own offset. Both declarations live inside one `@supports (margin-top: 1lh)`
  block, and must stay there: without the guard a non-supporting engine would keep
  `flex-start` and drop the offset, riding every dot to the line box's top edge.

### Cards / Containers
- **Corner Style:** 2px.
- **Background:** `plate` on `ground`.
- **Shadow Strategy:** none. See Elevation & Depth.
- **Border:** 1px `grid`; brightens to `ink-3` on hover for non-link cards, to amber for
  link-bearing ones.
- **Internal Padding:** 24px, 16px below 640px — one step, one rule, both names. The
  `20px below 480px on system plates` that used to be recorded here is deleted (2026-08-02):
  see the space-ladder paragraph under Layout.
- A card is a plate that has not been named yet: same fill, same hairline, same radius,
  same padding. Link-bearing cards add a 2px lift on `:hover` and `:focus-within` and
  thicken the title underline; cards with nothing to click brighten their boundary and do
  not move.

### Navigation
Sticky 64px header on a 97%-opacity `plate` with a saturating backdrop blur (and a solid
fallback where `backdrop-filter` is unsupported), closed by a `grid` hairline. Left: the
figure mark plus a serif wordmark. Right: four label-button tabs, the current one in the
`btn-current` state with `aria-current="page"`. A skip link is the first focusable element
on every page.

The nav's geometry is frozen: 64px height, and the progress rail pinned at
`bottom: -3px; height: 7px`. Restyle its appearance; do not move its box.

**The tab row PANS, it never pushes the page** (2026-08-02). `.nav-tabs` is an
`overflow-x: auto` scroll container with `min-width: 0` — the same answer
`.sweep-scroll` gives a plot too wide for its plate, applied to the one component
every page depends on. Under text-only zoom (the reader raises the root font size
and the viewport stays at 320px) the four tabs outgrow the nav's measure, and as a
flex item at its default `min-width: auto` the row could not shrink, so it drove the
whole DOCUMENT into horizontal scroll: 30px of page overflow at 320w with the root at
18px, 47px at 19px, 65px at 20px, with the Contact tab's right edge 1.7 / 15.5 /
29.3px outside the viewport. Measured after: 0px of document overflow at every root
size to 24px, where the row itself pans 6px instead. The frozen box is untouched —
64px at every root size tested, rail delta 2.0.

Two details are load-bearing, and the reason this rule is recorded here rather than
left in the stylesheet is that both look like removable noise:
- **The `padding-block: 5px` / `margin-block: -5px` pair cancels out**, so the box is
  the size it always was — but the padding is what puts a focused tab's 2px ring plus
  2px offset INSIDE the scroll container's clip box. Delete it and every tab's ring is
  clipped 4px top and bottom. 5px rather than exactly 4 leaves 1px of slack (measured
  slackTop 1.0 / slackBot 1.0 at 320 / 390 / 1366w) so a sub-pixel layout cannot shave
  the ring's last row. The current tab's inset amber tick stays inside the clip box at
  every width and root size measured.
- **The scrollbar is hidden**, because a classic horizontal scrollbar drawn inside a
  64px bar whose height is gate-asserted would break that assertion. Focusing a tab
  scrolls it into view and every tab is still a real link in the tab order.

### The Sweep (signature)
One inspectable measured figure, on the homepage, once. A 680×360 inline SVG of
lodestone's committed recall-vs-throughput curve: log x-axis with five ticks, recall
y-axis in decimals, a dashed `ink-3` 0.90 reference line, two series with every measured
sample point and its per-point label, the oracle marker, a legend, and an amber knee
callout with leader line.

Its rules, all load-bearing:
- The figure is **complete in the markup**. Every label, the legend, and the default knee
  callout are server-rendered, so the no-JS, prerendered, reduced-motion render is the
  same evidence. Nothing that constitutes proof lives behind a pointer.
- The crosshair is two CSS custom properties (`--sweep-x`, `--sweep-y`) on the `<figure>`,
  defaulting to the knee, plus a `textContent` swap on nodes that already exist. No
  canvas, no layout measurement, no animation loop, no dependency.
- Keyboard-operable (`tabIndex=0`, arrow keys, Home/End) with a real 2px amber focus ring
  and a polite live region.
- Below its floor width the plate **pans** rather than scaling labels into illegibility,
  and the pan starts at the annotated end (`direction: rtl` on the scroller, restored on
  the child) so the default state is never behind a gesture.
- **The pan is a named control, and its tab stop is the UA's, not ours.** `.sweep-scroll`
  carries `role="group"` plus an `aria-label` naming the job it does — panning, not
  measuring — because Chromium makes a scrolling box a tab stop by itself, and it did so
  silently as an unnamed DIV whose name computed from its own contents. **No `tabIndex`
  is set, deliberately**: the UA heuristic grants the stop exactly when the box scrolls
  and withholds it when it does not (measured pan 326 / 256 / 38px at 320 / 390 / 640w
  with the stop present, 0px and no stop at 680 / 998 / 1366), so writing `tabIndex={0}`
  would ADD a dead stop at every desktop width — the mirror of the defect being fixed.
  The stop is not removable either: with JavaScript blocked, Home on the `<figure>` pans
  0px because there is no crosshair to move, while ArrowLeft here pans 80px, making this
  the only keyboard route to the plot's left half on the no-JS render the proof story
  rests on. The `<figure>` still owns the sample-stepping contract.
- **A visually-hidden transcription table carries the same ten samples as text**, server-
  rendered, immediately after the drawing. It is the accessible copy of the evidence: the
  drawing pans its per-point labels out of the window at 400% zoom, and to a screen reader
  the SVG is one `role="img"` summary plus a single live line. Hidden rather than shown
  because the drawing IS the figure wherever the drawing is legible, and a second visible
  copy of ten rows is the duplicated-legend defect this figure already fixed once.
  Two rules hold it up:
  - **`.visually-hidden` goes on a WRAPPER, never on the `<table>`.** Not a style
    preference: the primitive's `width: 1px` is a MINIMUM for a CSS table, which sizes to
    its columns' min-content regardless. Measured by moving the class onto the table in
    the live page — the table renders 573.5px wide and the home page takes **285px of
    horizontal document overflow at 320w**, against 0px with the wrapper. A block wrapper
    honours the 1px and `overflow: hidden` clips the table inside it, so the transcription
    costs zero layout at every width (wrapper 1.0px at 1366 / 390 / 320).
  - **The caption states an ordering, so the row order must BE that ordering.** Both the
    caption and the arrow keys claim throughput-ascending, and `enhance.ts` sorts the
    samples on `data-sweep-x`, so the `SAMPLES` array is authored in true x-ascending
    order — which interleaves the two series (`ef=256` at ~8.9K sits between `nprobe=4`
    and `nprobe=1` at ~9.8K). Grouping the rows by series is the obvious tidy-up and it
    silently falsifies the caption for the one reader who has no drawing to cross-check
    against: it shipped that way and the table put `ef=256` sixth while the keys visited
    it fifth. Verified in the browser: the ten rows and a Home-then-ArrowRight walk now
    read the same sequence.
- Coordinates are literal `d="…"` path attributes and axis labels are decimals, never
  percentages — the repo's fact gate masks path data before its numeric tripwires run, so
  a coordinate run can never be read as a claim.

### The Plate (signature primitive)
Three parts in one order: a small-caps mono label naming the figure
(`FIG. 02 · parallax-kv`), the body, and a footnote strip under a hairline. The footnote
is the structural point — a limitation set as a footnote is a footnote; the same sentence
set as the card's last paragraph is a closing argument against yourself. Provenance
(`50,000 x 128-d · k=10 · single core · Xeon 8488C`) and the scope note share that strip,
and the strip carries `overflow-wrap: anywhere` because artifact filenames are long
unbroken tokens.

The strip is prose (the † limits note is two sentences), so it is bound by `measure-mono`
like any other reading block — but the cap is spent on `padding-right`, never on
`max-width`, and that distinction is load-bearing. This element's `border-top` IS the
plate's internal divider, so narrowing the box narrows the rule: measured at 1440 with
`max-width: 68ch` the box fell 1022px → 607px and the hairline stopped 415px short of the
plate's inner right edge, and on the Sweep it broke the stated contract that the plot, the
gloss and the footnote all end on one right edge (footnote right 1109 → 816 against an
unmoved plot). Padding leaves the border box on the plate's full measure and shortens only
the line box, and a `max()` floor of 0 keeps every narrow render byte-identical.

### The Readout
Value / label on one left-aligned baseline, in tabular figures, with as many rows
as the project actually measured. Explicitly **not** a fixed-column grid: three cards with
exactly three metrics each is a schema, and a schema reads as filled in rather than
measured.

A row whose label is an *axis* label rather than English carries a `plain` gloss under it —
sans against the row's mono, at the 14px `ink-3` floor — on the same contract the hero
rail's gloss carries: it NAMES WHAT THE METRIC IS and may never assert a second measurement
or introduce a number. "fdatasync p50" and "recall@10" reuse the rail's already-approved
wording verbatim so one piece of jargon is never translated two ways on one page. Rows whose
label is already English ("client operations checked", "durable writes", "queries/sec ·
1 core") get none — glossing all of them would be the filled-in schema this primitive
exists to avoid, which is why 4 of the 7 plate rows carry one. The hero variant is a three-row rail of hairline-separated rows — repo name as
the amber link, value in `ink`, unit in `ink-3` — and it lives in the hero's right column,
which is what makes the first screen a figure rather than a decorated résumé header. It
must read and click with everything else ignored entirely. Its value and unit tracks are
fixed widths, not content-sized: three auto-sized rows put the three figures on three
different edges, which is the Tabular Rule failing in the one place a reader checks it.
Those fixed tracks need 220px plus the name, so below 412px the row **stacks** to one column
in DOM order and the three values share the container's left spine — which satisfies the
Tabular Rule rather than breaking it. The ceiling is 412 and not 380 because between them
the tracks stopped overlapping without starting to fit: the name track computed to 80-111px
against mono anchors needing 92.7-101.2px, so `parallax-kv` and `accretion-db` wrapped
mid-token with the hyphen dangling. A repo name broken over two lines is not a name a reader
can recognise or retype, and it is the fold's clickable route into the evidence — so on this
rail a whole unbroken name outranks a compact row.

### The Axis Rule
A 1px `grid` line carrying four 5px `axis` ticks, opening every section the way an axis
opens a plot. It is the only decorative line on the site, it is `aria-hidden`, and it is
never a heading's substitute.

### The Sample Point
7px filled dot with a 1px `grid` halo — `series-1` by default, amber when annotated,
`ink-3` when off-route. One atom serving chart points, timeline nodes, route holds, and
the scroll-progress scrub marker, which is what makes four pages read as one document.

### The Callout
Leader line plus label: a horizontal amber hairline and a 13px amber mono string. The
site's only annotation style, and the mechanism of the signature.

### The Data Table
Hairline row rules, `plate-2` stripes on even rows, mono uppercase 12px headers in
`ink-2`, tabular figures, no vertical borders. A figure-world native for tabular or
demoted content.

### The Legend Modal (`.kbd-help`)
The site's one dialog — the `?` legend-and-shortcuts panel, injected by `enhance.ts`.
It is a plate that happens to be modal: hairline boundary, flat fill, and the backdrop
is what separates it from the page rather than a blur under its own edge. The `?`
affordance is a fixed button, hidden on touch and below 640px.

Its name and its geometry both carry rules (2026-08-02):
- **`aria-labelledby` pointing at the `<h2 id="kbd-help-title">` it already renders**,
  not a hand-written `aria-label`. Two strings for one name can drift; one cannot. The
  title is a real `<h2>` — a rank under the page `<h1>` — instead of a `<p>` styled to
  look like a heading, so the panel exists in the document outline. Measured accessible
  name: "Legend & shortcuts" at 320×256, 1024×300 and 1366×900. Every id and class in
  the injected markup is asserted by `verify.mjs`.
- **The overlay SCROLLS, and both halves of that fix are load-bearing.** A centred flex
  item taller than its container overflows both ends equally, and a centred item's TOP
  overflow is not scrollable — at 320×256 the 444px card sat at y −86..358, putting the
  dialog's name 61.5px above the screen and its only visible exit 77.5px below it, with
  no way to reach either; 13.1px above and 29.1px below at 1024×300. Both are ordinary
  viewports (400% zoom on a laptop, a short window). So: `overflow: auto` on the
  overlay, `align-items: start` plus `margin: auto` on the card — the auto margin
  absorbs free space when there is any and collapses to zero when there is not, which
  is what keeps the centred rest state at full height while letting a too-tall card grow
  past the container. Measured after: the card is fully on-screen at 24..232 (320×256)
  and 24..276 (1024×300), its own content scrolls 235 / 137px, and the title and the
  Close button are both reachable. `cardMargin` computes 0px on the short viewports and
  231.4px at 1366×900 — the same rule doing both jobs.
- **The backdrop is `fixed`, not `absolute`.** An absolutely positioned child of a
  scroll container is laid out at the scroll origin and then scrolls with the content,
  so on a short screen the backdrop slid off the top and left raw page showing above the
  card. Anchored to the viewport it covers the screen at every scroll offset and stays
  the click-to-close target `verify.mjs` asserts.

### The Static Fallback (`.static-fallback`)
Not a visual primitive — a contract, recorded here because it owns two CSS rules that
each read as redundant on their own. Every page root is wrapped in an `ErrorBoundary`
(`src/components/ErrorBoundary.tsx`) whose fallback is not an apology but **the
prerendered page**: it snapshots `#root`'s markup at module evaluation, before
`createRoot` replaces it, and on a caught error re-renders that snapshot and strips the
root `.js` class. The design argument is that this site already ships a complete static
render of every page and PRODUCT.md requires the no-JS page to carry everything that
constitutes proof, so the correct fallback for a broken interactive layer is the no-JS
page. There is deliberately **no visible banner** — reporting a failed layer the reader
cannot see is a defect with no user-facing consequence and no action available; the
failure is announced to `console.error` and as a `data-static-fallback` attribute.

The two rules, both mandatory:
- **`.static-fallback { display: contents }`.** The wrapper exists only to hold a
  snapshot. With a box of its own it becomes the single flex item of `#root`, and Nav /
  main / Footer stop being flex items at all — the footer would float mid-viewport on
  the 404.
- **The paired `#root > .static-fallback > main` selector beside `#root > main`.** Not
  redundant: `display: contents` removes the BOX, never the element, so a `>` selector
  still does not match through it, and without the pair the restored `<main>` loses its
  `flex: 1 0 auto`.

## Do's and Don'ts

### Do:
- **Do** keep `series-1` inside figures and make every clickable, focusable, or scrubbable
  thing `series-2`.
- **Do** put a `ground` label on any amber fill.
- **Do** wrap a measured claim in a plate, with its conditions and its limits in the
  footnote strip.
- **Do** number a figure only when the object genuinely is one. The build ships five:
  FIG. 00 (boulder topo), FIG. 01 (the Sweep), FIG. 02–04 (the three system plates), plus
  FIG. 404 on the not-found page. About, Education, and Skills get typographic rank
  instead — five FIG. labels are a system, nine are a costume.
- **Do** vary the number of readout rows with the evidence (3 / 2 / 2 as shipped).
- **Do** state a section's rank so the heading size and the gap above it move together.
- **Do** use `--section-gap` for section separation and the 4→96px ladder for everything
  else.
- **Do** set every measured number in mono with tabular figures, and keep footnotes at
  14px or larger.
- **Do** write a hover state once, at one specificity, with the label colour restated from
  the variant's own custom property.
- **Do** keep proof in the markup. If it only exists after a pointermove, a hover, a
  scroll, or a bundle load, it is not proof.
- **Do** remap the palette to paper under `@media print` — white surfaces, `#10161d` ink,
  `#0b3a6b` links, and dark-ochre `#8a5a00` in place of amber. Print overrides for the
  button primitive use fixed values, not tokens, so no later `:root` remap can
  re-introduce a low-contrast collision; the hero collapses to one column and injected
  chrome (progress rail, legend swatch, modal, figures) is hidden.
  **A collapsed grid must re-declare its gap.** `display: block` on `.hero-layout` discards
  the 32px row gap and `block` has no gap primitive, so on a cold print load (`emulateMedia`
  set BEFORE navigation — the case a hot reload hides) the identity, the evidence rail and
  the AWS-plus-CTA block butted at a measured 0px / 0px at both 1440 and 794px, printing as
  one undifferentiated column. The two blocks that FOLLOW one carry `margin-top: 32px` in
  print — the same value the screen grid spends — and `.hero-lead`, being first, carries
  none, so the band never opens on dead air. Measured after: 32 / 32 at both widths, with
  the print CTA still at 11.46:1.
- **Do** let a figure pan on narrow screens rather than shrinking its labels below
  legibility, and start the pan at the annotated end.
- **Do** treat the build gates as part of the design system: the fact gate
  (`scripts/check-facts.mjs`, run on every build), and `verify.mjs`'s checks —
  including the dark-surface luminance ceiling, the caption/figure non-overlap assertion,
  and the primary-CTA contrast assertion at rest *and* hovered. A visual rule that cannot
  survive them is not shipped.
- **Do** prove a new gate by reverting the defect it claims to catch. A gate nobody has
  seen fail is a comment. All three geometry gates on the hero rail and the reveal
  contract were re-proved this way on 2026-08-02, and the exercise is recorded because
  each revert also measured *which* gates stayed silent:
  - **Reveal / parked offset** — `useReveal`'s threshold back to a bare `0.15` (from
    `[0, 0.15]`): 5 failures across `/`, `/experience/` and `/projects/`. The
    pre-existing full-scroll reveal gate stayed green throughout, because it always
    walks from y=0 and every block enters the root from below.
  - **Rail overlap** — the `@media (max-width: 411px)` stacking block disabled entirely,
    which is the state at `c49cdf6`: 10.4 / 38.1 / 20.0px of glyph overlap at 320w,
    reproducing the recorded figures exactly. Only the rail gate fired; the other
    eleven checks passed at the same viewport.
  - **Rail mid-token wrap** (added 2026-08-02) — the ceiling back to the shipped `379px`
    (`c108bcf`): `parallax-kv` and `accretion-db` break across two lines at 380 / 385 /
    390 and `accretion-db` alone at 400, clean from 402. This is the gate the other two
    could not cover, and the reason it exists is that **verify reported all twelve
    combos PASS with the defect live at its own 390px mobile viewport** — the boxes do
    not intersect, so the overlap gate is silent by construction, and there is no
    document overflow to catch. Counting line boxes per painted text node is what
    separates "fits" from "merely no longer colliding"; the assertion is written
    against 1 line rather than against a width, so re-tuning the breakpoint cannot
    quietly retire it.

### Don't:
- **Don't** give `series-1` an interactive role, or give amber a data role.
- **Don't** put `ink` on an amber fill (1.98:1).
- **Don't** set `ink-3` below 14px.
- **Don't** add a blurred or alpha `box-shadow`. The only shadow is a hairline; the three
  existing `box-shadow` uses are hairline halos, rings, and the active-tab tick.
- **Don't** use a gradient to fill a surface. Gradients here generate evenly spaced
  hairline ticks and nothing else.
- **Don't** introduce a second radius. 2px for everything rectangular, the pill only for
  non-interactive chips and the timeline group label.
- **Don't** add a second `:hover` rule for the label button, and don't qualify one with
  `:not()` — that is the exact shape of the invisible-CTA defect this system was rebuilt
  around.
- **Don't** add an entrance animation or a keyframe. The stylesheet declares no keyframes
  at all; the site is entitled to one animated moment and the crosshair has it. The
  scroll-reveal fade is permitted machinery, gated on both the `.js` root class and
  `prefers-reduced-motion: no-preference`, and the built CSS must keep both the
  `reduce` and `no-preference` queries.
- **Don't** let anything revealable start hidden under `prefers-reduced-motion: reduce`,
  and don't place a revealable element inside a `display:none` container.
- **Don't** put a figure number on About, Education, Skills, or the contact band.
- **Don't** build a fixed-column metric grid to hold varying evidence. The `.metric-grid`
  rule that contradicted this shipped unrendered for weeks and was deleted 2026-08-02, along
  with a `.readout-unit` track no caller ever populated.
- **Don't** colour metadata — coursework, skills, tech tags — to compete with evidence.
- **Don't** set `padding` shorthand on `.hero`, `.page-head`, or `.not-found`: they share
  their element with `.container`, and a shorthand zeroes the page's horizontal gutter.
- **Don't** change the nav's 64px height or the progress rail's box, and don't un-hide the
  brand below 360px — the tab row's left edge is an alignment anchor there.
