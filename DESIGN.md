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
    lineHeight: 1.5
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
- **Series Teal** (`series-3`): the second measured series (IVF-PQ), plus the status dot
  on a proof chip. Present so a two-series plot can be read; never used for emphasis.

### Neutral
- **Ground** (`ground`): the page, and every section body. Measured luminance 0.0036
  against the dark-theme gate's 0.05 ceiling. The hero and page-head bands are the one
  exception: they sit on `plate`, so the first screen reads as one wide plate on ground.
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
  the name breaks where it should.
- **Label** (400, 0.8125rem, 0.08em, uppercase, mono): kickers, provenance lines, chips,
  the skills rails, callouts. The 13px mono step is the same rank as an axis label.
- **Footnote** (400, 0.875rem, 1.5, mono): plate footnote strips and readout units. 14px
  is a floor, not a default — `ink-3` earns AA only at or above it.

The scale is ten steps (`--fs-100` 11px through `--fs-900` 2.6rem plus `--fs-display`),
replacing fifteen literal font sizes. Weights are three: 400 body, 600 headings, 700
display.

### Named Rules
**The Fourteen-Pixel Floor Rule.** Nothing set in `ink-3` goes below 14px. Tick labels at
11px and plate labels at 12px are set in `ink-2` or brighter.

**The Rank Rule.** A section declares its rank and the heading size moves with the gap
above it. Five identically-sized headings over five identical pads is the generated-page
fingerprint; rank-1 opens a page, everything supporting it is rank-2.

**The Tabular Rule.** Any element that shows a measured number carries the mono family
and `font-variant-numeric: tabular-nums`. Numbers in this world line up.

## Layout

A 1120px container with 24px gutters (16px below 480px). One vertical rhythm token,
`--section-gap`, owns section separation: 96px on desktop, 64px below 768px, and 48px
below 640px. Every section-level block carries its gap *above* itself and nothing carries
a gap below, so the four stacked verticals that used to compound (section padding, main
padding, contact-band margin, footer margin) resolve to a single value and need no patch
rule.

Space is a nine-step ladder (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px). Plate padding is
24px, tightening to 16px below 640px — a 24px frame on a 390px screen spends an eighth of
the width on air.

Responsive behaviour, as built:
- **Hero**: single column until 1200px, then 46 / 54 identity-to-figure. The figure column
  waits for 1200px because the plot needs ~640px to render unpanned; below that it stacks
  under the copy and stays fully labelled.
- **System plates**: single column until 1024px, then copy 1.2fr / evidence 0.8fr with the
  evidence column separated by a left hairline instead of a top one. The 900px breakpoint
  was measured and abandoned — the evidence column could not hold its own figure there.
- **Timeline**: left-rail single column on mobile, centre-spine true interleaving from
  900px (88px column gap, 44px each side of the spine).
- **Card grids**: one column, two from 768px, three for the `-3` variant.
- **Nav**: fixed 64px height at every width. The wordmark hides below 640px and the whole
  brand hides below 360px; tab padding and gap tighten in three steps so the last tab
  keeps a ≥12px gutter at 320px rather than the brand reappearing.
- **Touch**: 44px minimum in both axes on every interactive primitive; card and repo
  titles get padding-plus-negative-margin below 768px so a 20px line box hit-tests at
  44px without changing the page's height budget.
- **Mobile budget**: the phone page is held to ~6,000px. Supplementary illustration is
  dropped rather than shrunk — the box diagrams hide below 640px because the readout and
  the artifact links are the proof, and the diagram was ~200px per plate.

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

### Cards / Containers
- **Corner Style:** 2px.
- **Background:** `plate` on `ground`.
- **Shadow Strategy:** none. See Elevation & Depth.
- **Border:** 1px `grid`; brightens to `ink-3` on hover for non-link cards, to amber for
  link-bearing ones.
- **Internal Padding:** 24px (20px below 480px on system plates).
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

### The Readout
Value / unit / label on one left-aligned baseline, in tabular figures, with as many rows
as the project actually measured. Explicitly **not** a fixed-column grid: three cards with
exactly three metrics each is a schema, and a schema reads as filled in rather than
measured. The hero variant is a three-row rail of hairline-separated rows — repo name as
the amber link, value in `ink`, unit in `ink-3` — and it must read and click with the
figure ignored entirely.

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
- **Do** let a figure pan on narrow screens rather than shrinking its labels below
  legibility, and start the pan at the annotated end.
- **Do** treat the build gates as part of the design system: the fact gate
  (`scripts/check-facts.mjs`, run on every build), and `verify.mjs`'s twelve checks —
  including the dark-surface luminance ceiling, the caption/figure non-overlap assertion,
  and the primary-CTA contrast assertion at rest *and* hovered. A visual rule that cannot
  survive them is not shipped.

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
- **Don't** build a fixed-column metric grid to hold varying evidence.
- **Don't** colour metadata — coursework, skills, tech tags — to compete with evidence.
- **Don't** set `padding` shorthand on `.hero`, `.page-head`, or `.not-found`: they share
  their element with `.container`, and a shorthand zeroes the page's horizontal gutter.
- **Don't** change the nav's 64px height or the progress rail's box, and don't un-hide the
  brand below 360px — the tab row's left edge is an alignment anchor there.
