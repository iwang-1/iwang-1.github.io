// Multi-page verification: serves the built dist/ with `vite preview` and
// drives every page in headless Chromium at desktop (1366x900) and mobile
// (390x844) viewports. Fails on any console/page error, any failed or 4xx/5xx
// same-origin request, wrong head metadata, wrong nav state, a dead internal
// link, a missing locked fact, or an a11y-gate breach. Refreshes the README
// screenshots in docs/ (commit them when they change meaningfully).
//
//   npm run build && npm run verify
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { chromium } from "playwright";

const PORT = 4173;
const ORIGIN = `http://localhost:${PORT}`;

// `facts` are strings that MUST render on this page. `absent` are strings that
// must NOT — and that list needs reading carefully, because everything on it is
// vacuous TODAY BY DESIGN: each string was grepped across src/, public/ and the
// four HTML entries (2026-08-05) and no source can produce it. So an `absent`
// entry is a REGRESSION TRIPWIRE for something deliberately removed, never
// coverage of current copy. Do not read a passing run as evidence that these
// strings were checked against anything live.
//
// The bar for staying on the list is that the string would be UNTRUE, not merely
// old, if it came back:
//   "Hong Kong"            HKU was cut from education (b237ed5). check-facts
//                          forbids it in SOURCE; this is the rendered-DOM half,
//                          and on "/" it is re-checked against page HTML below
//                          so JSON-LD cannot smuggle it past innerText.
//   74.2% / 67.7% / 64,000 DANN report figures with no reproducible committed
//                          evidence (FACTS.md: un-renderable by design).
//   95%                    the retired RAG QA figure, same reason.
//   1,400 / 2,640          résumé soak counts; the site quotes the operation
//                          count instead. THIS LIST IS THEIR ONLY GATE —
//                          check-facts has no pattern for either — so unlike the
//                          rest of these they are not duplicated anywhere.
//   star-catalog / star-spectral / sky map
//                          the removed three-repo system. The GitHub repos are
//                          DELETED, so re-rendering any of these would advertise
//                          work that no longer exists. FACTS.md names this trio
//                          as verify's job by name; they travel together.
//
// DROPPED 2026-08-05, and the distinction is the point: a retired DESIGN is not
// a falsehood, and freezing one is not a truth gate.
//   "Now — SDE Intern"     the deleted hero now-strip (703544a). A future
//                          Now/Next strip would be a design choice, not a lie.
//                          Note the framing rule it gestured at — FACTS.md's
//                          "always date-anchored, never 'currently'" — was never
//                          what this literal checked, and is still ungated.
//   "1M+ customers"        cut when the AWS bullets were rewritten (9eb1023),
//                          but FACTS.md explicitly still sanctions it as a
//                          résumé claim Ivan stands behind.
//   "4 upstream PRs"       a WORDING that was replaced, not a claim that was
//                          withdrawn: the same claim renders today as the chip
//                          "4 merged PRs" (content.ts). Forbidding the dead
//                          spelling while the live one ships reads as coverage
//                          of a claim nobody is checking.
//   "Résumé"               accent-only, so it was satisfied by a spelling
//                          choice — see the accent-blind resume-affordance gate
//                          in checkPage, which asserts the risk that actually
//                          matters.
const PAGES = [
  {
    path: "/",
    shot: "home",
    title: "Ivan Wang — Software Engineer · UMD CS · AWS SDE Intern",
    canonical: "https://iwang-1.github.io/",
    noindex: false,
    activeTab: "/",
    // "Secretary of the UMD Climbing Club" was retired 2026-07-27 by owner
    // request — the hobby section deliberately carries no leadership claims.
    // The hobby anchors below keep the section gate-visible instead.
    // "2.9M", not "2.9 million": the spelled-out form lived in the proof
    // paragraph that the home page's PREVIEW variant no longer renders (the full
    // sentence is on /projects/, which locks it there). The readout still carries
    // the figure, so the fact is still gated on this page — in the form this page
    // prints. Both spellings trace to the same content.ts record.
    facts: ["May 2027", "mechanical keyboards", "rock climbing", "Departmental Honors", "2.9M"],
    absent: ["Hong Kong", "74.2%", "67.7%", "64,000", "1,400", "2,640"],
  },
  {
    path: "/experience/",
    shot: "experience",
    title: "Experience — Ivan Wang",
    canonical: "https://iwang-1.github.io/experience/",
    noindex: false,
    activeTab: "/experience/",
    facts: ["7 agent-migrated tests", "3,000+ students", "50,000+ records"],
    absent: ["Hong Kong"],
  },
  {
    path: "/projects/",
    shot: "projects",
    title: "Projects — Ivan Wang",
    canonical: "https://iwang-1.github.io/projects/",
    noindex: false,
    activeTab: "/projects/",
    facts: ["Unsupervised Domain Adaptation", "Four-person research project", "This site", "2.9 million"],
    absent: ["Hong Kong", "star-catalog", "star-spectral", "sky map", "74.2%", "67.7%", "95%", "1,400", "2,640"],
  },
  {
    path: "/404.html",
    shot: "404",
    title: "Page not found — Ivan Wang",
    canonical: null,
    noindex: true,
    activeTab: null,
    facts: [],
    absent: [],
  },
];

const VIEWPORTS = [
  { width: 1366, height: 900, name: "desktop" },
  { width: 390, height: 844, name: "mobile" },
  { width: 320, height: 700, name: "narrow" },
];

mkdirSync("docs", { recursive: true });

// --- serve dist/ -------------------------------------------------------------
const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: ["ignore", "pipe", "pipe"],
});
const kill = () => server.kill("SIGTERM");
process.on("exit", kill);

let up = false;
for (let i = 0; i < 50 && !up; i++) {
  await new Promise((r) => setTimeout(r, 200));
  try {
    up = (await fetch(ORIGIN + "/")).ok;
  } catch {
    /* not up yet */
  }
}
if (!up) {
  console.error("VERIFY FAILED: vite preview never came up on " + ORIGIN);
  process.exit(1);
}

const browser = await chromium.launch();
const problems = [];
const checkedLinks = new Map(); // href -> ok

// build-artifact gates: the motion contract must survive the CSS build.
const cssFile = readdirSync("dist/assets").find((f) => f.endsWith(".css"));
const builtCss = readFileSync(`dist/assets/${cssFile}`, "utf8");
if (!/prefers-reduced-motion:\s*reduce/.test(builtCss))
  problems.push("built CSS missing prefers-reduced-motion: reduce block");
if (!/prefers-reduced-motion:\s*no-preference/.test(builtCss))
  problems.push("built CSS missing no-preference gate around .reveal hidden state");

// prerender gate: every dist HTML shell must carry full static #root markup
// (the site stays readable when the JS bundle is blocked or fails), and the
// static HTML must NOT pre-bake the .js class — the reveal-hiding contract
// may only activate when the bundle actually executes (src/js-flag.ts).
for (const f of [
  "dist/index.html",
  "dist/experience/index.html",
  "dist/projects/index.html",
  "dist/404.html",
]) {
  const html = readFileSync(f, "utf8");
  if (!html.includes("</main>") || !html.includes("</footer>"))
    problems.push(`${f}: no prerendered #root content — blocked-bundle fallback missing`);
  if (/<html[^>]*class="[^"]*\bjs\b/.test(html))
    problems.push(`${f}: .js class baked into static HTML — content would hide without the bundle`);
}
// NO PUBLISHED RÉSUMÉ FILE, as a build artifact. PRODUCT.md: "No resume PDF is
// published. verify.mjs enforces the absence." WIDENED 2026-08-05 from
// `existsSync("dist/Ivan-Wang-Resume.pdf")` — one hardcoded filename, which any
// other name (`resume.pdf`, `Ivan_Wang_CV.pdf`, `resume.docx`) walks past. The
// deployed tree is small and fully enumerable, so the check is now "no document
// file of any name is deployed" rather than "not that one file". Measured on this
// build: 30 files, extensions png/js/woff2/txt/html/css/xml/jpg — zero documents,
// so the allowed set costs nothing and a new one has to be argued for here.
{
  const docFiles = readdirSync("dist", { recursive: true })
    .map(String)
    .filter((f) => /\.(pdf|docx?|rtf|odt|pages)$/i.test(f));
  if (docFiles.length)
    problems.push(
      `dist: document file(s) deployed (${docFiles.join(", ")}) — no résumé/CV file is published (PRODUCT.md); the site says "Resume on request" instead`,
    );
}

// SELF-HOSTED FONT gates (DOUBLE-SHOT, 2026-08-04). Three build-artifact
// assertions, all about bytes rather than pixels:
//  1. the four subsetted faces are actually IN dist/ — the .woff2 files are
//     committed, not generated by `npm run build` (scripts/subset-fonts.mjs is
//     an offline tool and CI has no fontTools), so a missing file would ship a
//     site rendering entirely in fallback with a green build.
//  2. no @font-face references a remote origin. PRODUCT.md: no CDN fonts.
//  3. NOTHING depends on `font-variant-numeric`. Martian Mono ships no `tnum`
//     feature at all (verified against the binary's GSUB table); its columns
//     align because every glyph has the same 0.750 em advance. A rule asking
//     for tabular-nums here is a silent no-op that would read as a guarantee.
for (const f of [
  "dist/fonts/martian-mono-latin-400-700.woff2",
  "dist/fonts/martian-mono-sup-400-700.woff2",
  "dist/fonts/familjen-grotesk-latin-400-700.woff2",
  "dist/fonts/familjen-grotesk-sup-400-700.woff2",
]) {
  if (!existsSync(f)) problems.push(`${f}: subsetted font missing from dist — run node scripts/subset-fonts.mjs`);
}
{
  const fontBytes = [
    "dist/fonts/martian-mono-latin-400-700.woff2",
    "dist/fonts/martian-mono-sup-400-700.woff2",
    "dist/fonts/familjen-grotesk-latin-400-700.woff2",
    "dist/fonts/familjen-grotesk-sup-400-700.woff2",
  ]
    .filter((f) => existsSync(f))
    .reduce((n, f) => n + statSync(f).size, 0);
  // Budget ceiling, not a target. The direction contract projected 21,440 B;
  // the real subset measures 21,516 B (the OFL copyright and
  // licence-URL name records are preserved in every file, which is part of that). 24,000 B leaves room for a repertoire
  // addition without letting a full unsubsetted family (38,492 B for Martian
  // alone) in by accident.
  if (fontBytes > 24000)
    problems.push(`dist/fonts: ${fontBytes} B of font files exceeds the 24,000 B budget`);
}
// FONT PRELOAD gate. Every page shell must preload BOTH self-hosted faces.
// Measured on real builds over Fast 3G: without them the font swap costs a CLS
// of 0.0626 on the home page (0.0000 with fonts blocked, so the shift is
// entirely the swap), and the 404 — whose LCP element is an <h1> set in Martian
// — measured 1464ms against 804ms. With both preloaded, CLS is 0.0000 on all
// four pages. This asserts the tags because deleting them looks harmless: the
// page still renders, still passes every other check, and simply reflows.
for (const f of [
  "dist/index.html",
  "dist/experience/index.html",
  "dist/projects/index.html",
  "dist/404.html",
]) {
  const html = readFileSync(f, "utf8");
  for (const face of ["familjen-grotesk-latin-400-700", "martian-mono-latin-400-700"]) {
    const re = new RegExp(`<link[^>]*rel="preload"[^>]*${face}\\.woff2[^>]*as="font"[^>]*crossorigin`);
    if (!re.test(html)) problems.push(`${f}: missing <link rel="preload"> for ${face}.woff2`);
  }
}

if (/@font-face[^}]*url\(\s*['"]?https?:/i.test(builtCss))
  problems.push("built CSS loads a remote font — this site is self-hosted only (PRODUCT.md)");
if (/font-variant-numeric\s*:\s*(tabular-nums|[^;}]*\btnum\b)/i.test(builtCss))
  problems.push(
    "built CSS asks for tabular-nums — Martian Mono ships no tnum feature; alignment comes from its fixed 0.750 em advance",
  );

async function linkOk(href) {
  if (checkedLinks.has(href)) return checkedLinks.get(href);
  let ok = false;
  try {
    const res = await fetch(ORIGIN + href, { method: "GET" });
    ok = res.status === 200;
  } catch {
    ok = false;
  }
  checkedLinks.set(href, ok);
  return ok;
}

async function checkPage(spec, viewport) {
  const tag = `${spec.path} @ ${viewport.name}`;
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const errors = [];
  const badRequests = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("requestfailed", (req) => {
    if (req.url().startsWith(ORIGIN)) badRequests.push(`failed: ${req.url()}`);
  });
  page.on("response", (res) => {
    if (res.url().startsWith(ORIGIN) && res.status() >= 400)
      badRequests.push(`${res.status()}: ${res.url()}`);
  });

  await page.goto(ORIGIN + spec.path, { waitUntil: "networkidle" });


  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (horizontalOverflow > 1)
    problems.push(`${tag}: horizontal overflow of ${horizontalOverflow}px`);
  // CHANGED for DOUBLE-SHOT (2026-08-04): this was the dark-theme gate
  // (`lum > 0.05` → fail), asserting the near-black #0B1220 ground of the
  // outgoing "Figure One" world. That world is replaced by a light one — cap
  // beige #EDE7DA, measured luminance 0.8022 — so the old assertion is not
  // weakened or deleted, it is INVERTED and kept exactly as strict: a two-sided
  // band on the page surface, so the world cannot silently drift back to dark
  // and cannot drift to paper white either.
  //
  // Both bounds are load-bearing:
  //   FLOOR 0.62 — anything dimmer is no longer a light reading surface. The
  //     figure fill (case grey, 0.6474) sits just above it deliberately: if the
  //     page ever computed the FIGURE's colour, that is a real defect (the page
  //     and its figures would be one flat field) and this catches it.
  //   CEILING 0.93 — pure white is 1.0. The palette's whole argument is a
  //     printed spec sheet on stock, not a browser default; a drift to #FFFFFF
  //     is the exact regression that would make it generic again.
  // Measured: 0.8022 on all four pages at all three viewports.
  const lum = await page.evaluate(() => {
    const [r, g, b] = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  });
  if (lum < 0.62 || lum > 0.93)
    problems.push(
      `${tag}: page surface luminance ${lum.toFixed(4)} outside the light-world band 0.62-0.93 (cap beige = 0.8022)`,
    );

  // NO-ITALIC gate (DOUBLE-SHOT, 2026-08-04). THE DERIVED RULE: there is no
  // italic anywhere on this site, because a keycap legend has no italic.
  // Emphasis is a shifted sublegend instead — small caps, +0.06em tracking, a
  // 0.08em underline at 0.1em offset (tokens.css).
  //
  // This is a TRUTH assertion about the shipped world, not a style preference,
  // and it is asserted rather than trusted for a mechanical reason: no italic
  // face is shipped in public/fonts/, so an italic that slipped in would not be
  // a designed italic — it would be a UA-SYNTHESISED slant of a display mono.
  // The stylesheet refuses that twice (font-synthesis-style: none at the root,
  // font-style: normal on em/i/cite/dfn/var/address/.em); this proves the
  // refusal held after the cascade, the build and the prerender.
  //
  // Walks EVERY element and reads the COMPUTED value, so it catches an italic
  // arriving from any direction — a UA default (em, i, cite, dfn, var, address
  // are all italic by default), a component stylesheet emitted after
  // index.css, an inline style, or an SVG <text> attribute. Elements with no
  // painted text are skipped: an italic that paints nothing is not a defect a
  // reader can see, and including them would fail on an empty <var> in markup
  // nobody renders.
  const italics = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("*")) {
      const style = getComputedStyle(el);
      if (!/^(italic|oblique)/.test(style.fontStyle)) continue;
      // Painted, and carrying its own text — not merely an inheriting ancestor.
      const rect = el.getBoundingClientRect();
      const ownText = [...el.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.nodeValue.trim())
        .join("");
      if (!ownText || !rect.width || !rect.height) continue;
      out.push(
        `<${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : ""}> computes font-style: ${style.fontStyle} — "${ownText.slice(0, 40)}"`,
      );
    }
    return out;
  });
  for (const i of new Set(italics)) problems.push(`${tag}: NO-ITALIC rule broken — ${i}`);

  // 3. head metadata
  const title = await page.title();
  if (title !== spec.title)
    problems.push(`${tag}: title ${JSON.stringify(title)} != ${JSON.stringify(spec.title)}`);
  const canonical = await page
    .locator('link[rel="canonical"]')
    .first()
    .getAttribute("href")
    .catch(() => null);
  if (spec.canonical) {
    if (canonical !== spec.canonical)
      problems.push(`${tag}: canonical ${JSON.stringify(canonical)} != ${spec.canonical}`);
  } else if (canonical) {
    problems.push(`${tag}: unexpected canonical ${canonical}`);
  }
  const robots = await page.locator('meta[name="robots"]').count();
  if (spec.noindex) {
    const content =
      robots > 0
        ? await page.locator('meta[name="robots"]').first().getAttribute("content")
        : null;
    if (!content || !content.includes("noindex")) problems.push(`${tag}: missing noindex`);
  } else if (robots > 0) {
    problems.push(`${tag}: unexpected meta robots on an indexed page`);
  }

  // 4. nav structure + active tab
  const tabs = await page.locator('nav[aria-label="Primary"] > a').count();
  if (tabs !== 4) problems.push(`${tag}: expected exactly 4 nav tabs, got ${tabs}`);
  // The Contact tab targets THIS page's own contact band ("#contact") on every
  // page that has one, so the tab scrolls instead of reloading the site; the
  // 404 has no band and keeps the absolute "/#contact". Both forms count, and
  // the band itself is asserted separately below.
  const contactTab = await page
    .locator('nav[aria-label="Primary"] a[href="#contact"], nav[aria-label="Primary"] a[href="/#contact"]')
    .count();
  if (contactTab !== 1) problems.push(`${tag}: expected one Contact tab, got ${contactTab}`);
  const current = page.locator('a[aria-current="page"]');
  const currentCount = await current.count();
  if (spec.activeTab) {
    if (currentCount !== 1) {
      problems.push(`${tag}: expected exactly one aria-current tab, got ${currentCount}`);
    } else {
      const href = await current.first().getAttribute("href");
      if (href !== spec.activeTab)
        problems.push(`${tag}: aria-current tab points at ${href}, expected ${spec.activeTab}`);
    }
  } else if (currentCount !== 0) {
    problems.push(`${tag}: 404 page must not mark any tab aria-current (got ${currentCount})`);
  }

  // The progress rail stays attached to the sticky header, carries nothing but
  // its two functional parts, and its marker moves as the page scrolls.
  const rail = page.locator("#progress-rail");
  if ((await rail.count()) !== 1) {
    problems.push(`${tag}: expected exactly one progress rail inside the nav`);
  } else {
    const navContainsRail = await page.locator("header.nav #progress-rail").count();
    if (navContainsRail !== 1)
      problems.push(`${tag}: progress rail is not a child of the sticky header`);
    // WAS (until 2026-08-05): `.route-progress-hold` count must be 0. That class
    // was deleted with the four decorative yellow climbing holds in 69b8709 and
    // NO component has emitted it since — grep src/ returns only this file — so
    // the assertion could only ever read 0. It named a real risk (the rail is a
    // 7px axis whose box is frozen to a ±2px measurement; decorative children
    // squatting in it is how that box drifts) but checked for it by one dead
    // class name, which a differently-named ornament walks straight past.
    //
    // So it is stated as the contract instead: the rail's ONLY children are the
    // scrub fill and the scrub marker. Whitelisted by class, so re-adding holds
    // under ANY name fails, and the assertion does not have to be re-taught every
    // time an ornament is invented. enhance.ts appends its overlay/FAB to
    // document.body, never here, so two is the count at every viewport.
    const railChildren = await rail.evaluate((el) =>
      [...el.children].map((c) => c.className || c.tagName.toLowerCase()),
    );
    const allowedRailChildren = ["route-progress-fill", "route-progress-marker"];
    const strayRailChildren = railChildren.filter((c) => !allowedRailChildren.includes(c));
    if (railChildren.length !== 2 || strayRailChildren.length)
      problems.push(
        `${tag}: progress rail carries ${railChildren.length} children [${railChildren.join(", ")}] — only the scrub fill and marker belong inside its frozen 7px box`,
      );
    if (spec.path === "/") {
      // enhance.ts initializes one animation frame after React settles.
      await page.waitForTimeout(200);
      const before = await page.locator(".route-progress-marker").boundingBox();
      const maxScroll = await page.evaluate(
        () => document.documentElement.scrollHeight - document.documentElement.clientHeight,
      );
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        Math.min(700, maxScroll),
      );
      await page.waitForTimeout(350);
      const progressValue = await rail.evaluate((element) =>
        Number(element.style.getPropertyValue("--scroll-progress")),
      );
      if (maxScroll > 0 && progressValue <= 0)
        problems.push(`${tag}: progress value did not update after scroll`);
      const navBox = await page.locator("header.nav").boundingBox();
      const railBox = await rail.boundingBox();
      const after = await page.locator(".route-progress-marker").boundingBox();
      if (!navBox || Math.abs(navBox.y) > 1)
        problems.push(`${tag}: sticky nav left the viewport after scroll (y=${navBox?.y})`);
      if (!navBox || !railBox || Math.abs(railBox.y - (navBox.y + navBox.height - 3)) > 2)
        problems.push(`${tag}: progress rail detached from sticky nav after scroll`);
      if (maxScroll > 0 && (!before || !after || after.x <= before.x))
        problems.push(`${tag}: progress marker did not advance after scroll`);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    }
  }

  // 5. every same-origin link resolves 200 (résumé PDF included)
  const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute("href")));
  for (const href of new Set(hrefs)) {
    const clean = href.split("#")[0] || "/";
    if (!(await linkOk(clean))) problems.push(`${tag}: internal link does not resolve 200: ${href}`);
  }

  // ONE-LEFT-SPINE gate (was: container-padding gate). Band headline content
  // must share the nav brand's left edge. (.hero/.page-head/.not-found sit on
  // the same element as .container — a restated padding SHORTHAND there zeroes
  // the container's horizontal padding and the band renders flush left.)
  //
  // Home checks TWO selectors, not one. The page has exactly one alignment
  // spine — the container's inner left edge — and the hero is on it (see the
  // one-left-spine Named Rule in DESIGN.md; supersedes the 2026-07-27 centered
  // hero, whose change came with a comment REMOVING the hero kicker as this
  // anchor). Checking only the section head cannot see a future pass re-centring
  // the hero, which is exactly how that clash got in. Measured delta = 0.00 for
  // both selectors at 1440/1366/1280/1200/1100/1024/1023/900/768/390/360/320.
  const alignSel = {
    "/": [".hero .kicker", ".section .section-head h2"],
    "/experience/": [".page-head h1"],
    "/projects/": [".page-head h1"],
    "/404.html": [".not-found h1"],
  }[spec.path];
  if (alignSel) {
    // .nav-brand is display:none below 360px (index.css:296-300), so the tabs
    // are the anchor there. Load-bearing fallback — do not "simplify" it away.
    const navAnchor = viewport.width <= 359 ? ".nav-tabs" : ".nav-brand";
    const brand = await page.locator(navAnchor).boundingBox();
    for (const sel of alignSel) {
      const band = await page.locator(sel).first().boundingBox();
      if (!brand || !band || Math.abs(brand.x - band.x) > 1)
        problems.push(
          `${tag}: ${sel} left edge (${band?.x}) != nav anchor left edge (${brand?.x}) — off the page's one left spine`,
        );
    }
  }

  // 6. locked facts rendered in the DOM
  const bodyText = await page.locator("body").innerText();
  for (const fact of spec.facts)
    if (!bodyText.includes(fact)) problems.push(`${tag}: locked fact missing from DOM: ${fact}`);
  for (const a of spec.absent ?? [])
    if (bodyText.includes(a)) problems.push(`${tag}: forbidden text rendered in DOM: ${a}`);
  if (spec.path === "/") {
    // page.content() catches JSON-LD, which innerText misses.
    const html = await page.content();
    if (/hong\s?kong/i.test(html))
      problems.push(`${tag}: "Hong Kong" present in page HTML (JSON-LD?)`);

    // THE BOULDER'S CONTRACT. The gate this replaces asserted the literals
    // "START", "TOP" and "BOULDER / SET 01" and a single 8-hold route — i.e. it
    // PINNED IN PLACE the invented problem and the one-correct-sequence framing
    // that contradicted Ivan's own paragraph 30px above the drawing. A gate that
    // locks a defect is worse than no gate, so what is asserted now is the thing
    // that must stay true: THREE sequences at equal weight, and no invented
    // problem identity.
    const paths = page.locator(".boulder-path");
    if ((await paths.count()) !== 3)
      problems.push(`${tag}: boulder must show exactly 3 sequences, got ${await paths.count()}`);
    const onHolds = await page.locator(".boulder-hold-on").count();
    const offHolds = await page.locator(".boulder-hold-off").count();
    if (onHolds < 12 || offHolds < 4)
      problems.push(`${tag}: boulder wall is not a wall (${onHolds} on / ${offHolds} off route)`);
    // Equal weight is the honesty rule, not a style preference: if one sequence
    // is heavier or a different colour, the drawing is asserting a correct beta.
    const weights = await paths.evaluateAll((els) =>
      els.map((el) => {
        const cs = getComputedStyle(el);
        return `${cs.stroke}|${cs.strokeWidth}|${cs.opacity}`;
      }),
    );
    if (new Set(weights).size !== 1)
      problems.push(`${tag}: boulder sequences are not equal weight: ${weights.join(" / ")}`);
    // The retired invention may not come back in any skin.
    for (const banned of ["SET 01", "BOULDER / SET", "top out at"])
      if (bodyText.includes(banned))
        problems.push(`${tag}: retired invented boulder identity rendered: ${banned}`);
    // THE LABEL MUST AGREE WITH THE DRAWING. The two counts above are LOWER
    // BOUNDS on purpose (a wall stays a wall at 13 or 20 holds), which left the
    // accessible name free to rot: it hardcoded the word "nineteen", so adding or
    // removing one hold redrew the figure, made the label false, and still passed
    // every one of the twelve combos. A wrong number inside an accessible name is
    // invisible to every sighted reviewer, so no amount of looking would catch it.
    // Boulder.tsx now derives the number from the hold data; this asserts the
    // agreement rather than trusting it, so re-hardcoding a stale literal fails
    // here too. Spelled-out numbers are rejected outright — a word cannot be
    // derived, so its presence IS the defect.
    const label = (await page.locator(".boulder-svg").getAttribute("aria-label")) ?? "";
    const painted = onHolds + offHolds;
    const stated = Number(label.match(/(\d+)\s+holds/)?.[1]);
    if (!Number.isFinite(stated))
      problems.push(
        `${tag}: boulder aria-label states no numeric hold count (must be derived from the data, not spelled out): ${JSON.stringify(label)}`,
      );
    else if (stated !== painted)
      problems.push(
        `${tag}: boulder aria-label says ${stated} holds but ${painted} are painted (${onHolds} on / ${offHolds} off route)`,
      );
  }
  if (spec.path === "/experience/") {
    // timeline structural gate: 7 role cards; alternating L/R on desktop,
    // single left column on mobile; Community & Teaching label on the spine.
    const items = page.locator(".alt-timeline-item");
    if ((await items.count()) !== 7)
      problems.push(`${tag}: expected 7 timeline items, got ${await items.count()}`);
    // Each role shows its employer's REAL logo, one <img> per card.
    //
    // TIGHTENED 2026-08-05. This accepted `.role-logo img[alt]` OR
    // `.role-logo-mark[role="img"]` — a lettermark-tile fallback that lived from
    // 6f39476 to 9eb1023 and whose CSS went in 17e6af0. Grep src/ for
    // `role-logo-mark`: only this file. So the gate was LOOSER than the code, and
    // in the one direction that matters on a recruiting page — content.ts says
    // "every one of the seven is a real vendor mark, so nothing on a recruiting
    // page is ever the WRONG company's logo", and the disjunction quietly
    // permitted a drawn initial standing in for a company's own mark. RoleLogo
    // has exactly one branch (an <img> from `logo.src`); the gate now says so.
    //
    // Counted PER CARD, not 7-in-total: a total is satisfied by one card carrying
    // two marks while another carries none, which is the worse defect of the two.
    // (Empty `alt=""` is caught by the site-wide img-alt gate near the end of this
    // function, which treats the empty string as missing.)
    const perCardLogos = await items.evaluateAll((cards) =>
      cards.map((card) => card.querySelectorAll(".role-logo img[alt]").length),
    );
    const wrongLogoCards = perCardLogos.filter((n) => n !== 1).length;
    if (wrongLogoCards)
      problems.push(
        `${tag}: ${wrongLogoCards} of ${perCardLogos.length} role cards do not carry exactly one real <img> logo (counts: ${perCardLogos.join(", ")})`,
      );
    // No stand-in marks. Asserted separately from the count above so the failure
    // message says WHICH thing went wrong, and so a lettermark that replaces an
    // <img> can't read as "still 7 logos".
    const lettermarks = await page.locator('[class*="role-logo"][role="img"], .role-logo svg').count();
    if (lettermarks)
      problems.push(
        `${tag}: ${lettermarks} drawn/lettermark role logo(s) — every role must show its employer's real mark, never a stand-in`,
      );
    const b1 = await items.nth(0).boundingBox();
    const b2 = await items.nth(1).boundingBox();
    if (viewport.name === "desktop") {
      if (!b1 || !b2 || b2.x <= b1.x + 100)
        problems.push(`${tag}: timeline not alternating on desktop (item2 x=${b2?.x} vs item1 x=${b1?.x})`);
      // TRUE interleaving: the right card must start before the left card
      // ends (grid row-packing), never in its own blank full-height row.
      if (b1 && b2 && b2.y >= b1.y + b1.height)
        problems.push(
          `${tag}: timeline not interleaving on desktop (item2 y=${b2.y} vs item1 bottom=${b1.y + b1.height})`,
        );
    } else if (!b1 || !b2 || Math.abs(b2.x - b1.x) > 2) {
      problems.push(`${tag}: mobile timeline must be a single left column`);
    }
    const label = await page.locator(".alt-timeline-label").first().innerText().catch(() => "");
    if (!/community & teaching/i.test(label))
      problems.push(`${tag}: Community & Teaching spine label missing`);
  }
  if (spec.path === "/404.html") {
    for (const href of ["/", "/experience/", "/projects/", "/#contact"])
      if (!hrefs.includes(href)) problems.push(`${tag}: 404 recovery link missing: ${href}`);
  }

  // caption/figure non-overlap gate: the mobile caption collision (-20px into
  // parallax's N3, -35px into accretion's SST across 6 renders) shipped while
  // all 12 checks passed. Bounding-box intersection between every figure
  // caption/footnote and its sibling figure elements must be zero.
  const overlaps = await page.evaluate(() => {
    const out = [];
    const intersects = (a, b) =>
      a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
    for (const cap of document.querySelectorAll(".diagram-caption, .plate-footnote")) {
      const parent = cap.closest(".system-diagram, .plate, figure");
      if (!parent) continue;
      const c = cap.getBoundingClientRect();
      if (!c.width || !c.height) continue;
      for (const el of parent.querySelectorAll(
        ".diagram-stage, .diagram-node, .diagram-sstables span, .sweep-plot, .boulder-svg",
      )) {
        if (cap.contains(el) || el.contains(cap)) continue;
        const e = el.getBoundingClientRect();
        if (!e.width || !e.height) continue;
        if (intersects(c, e))
          out.push(`${cap.className} overlaps ${el.className || el.tagName}`);
      }
    }
    return out;
  });
  for (const o of new Set(overlaps)) problems.push(`${tag}: caption/figure overlap — ${o}`);

  // primary-CTA contrast gate, at rest AND hovered: the 1.21:1 invisible-CTA
  // hover bug (a later :hover out-specifying the primary variant) was
  // completely invisible to the other 12 checks.
  const primaryCta = page.locator(".btn-primary").first();
  if (await primaryCta.count()) {
    const readRatio = () =>
      primaryCta.evaluate((el) => {
        const lum = (channel) => {
          const c = channel / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        const relLum = (rgb) => {
          const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).map(Number);
          return 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
        };
        const s = getComputedStyle(el);
        const L1 = relLum(s.color);
        const L2 = relLum(s.backgroundColor);
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      });
    const atRest = await readRatio();
    await primaryCta.hover();
    await page.waitForTimeout(200);
    const hovered = await readRatio();
    if (atRest < 4.5 || hovered < 4.5)
      problems.push(
        `${tag}: primary CTA label contrast below 4.5:1 (rest ${atRest.toFixed(2)}, hover ${hovered.toFixed(2)})`,
      );
    await page.mouse.move(0, 0);

    // ...and FOCUSED. The global :focus-visible ring is --series-2, which on the
    // amber-filled primary drew #E9A13B on #E9A13B — a measured 1.00:1 ring on
    // the one control a keyboard screener is most likely to reach. The ring must
    // not be the button's own fill.
    //
    // Read in a THROWAWAY page. Focusing the CTA in this one moves the document's
    // sequential-focus starting point, and the skip-link assertion further down
    // presses Tab from wherever focus last was — so measuring here would break a
    // gate that is testing something else entirely.
    const ringPage = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
    });
    await ringPage.goto(ORIGIN + spec.path, { waitUntil: "networkidle" });
    const ring = await ringPage.locator(".btn-primary").first().evaluate((el) => {
      el.focus();
      const s = getComputedStyle(el);
      return { outline: s.outlineColor, fill: s.backgroundColor, width: s.outlineWidth };
    });
    await ringPage.close();
    if (ring.outline === ring.fill)
      problems.push(
        `${tag}: primary CTA focus ring is its own background (${ring.outline}) — invisible focus`,
      );
    if (parseFloat(ring.width) < 1)
      problems.push(`${tag}: primary CTA focus ring has no width (${ring.width})`);
  }

  // HERO READOUT RAIL overlap gate. The rail's two fixed tracks plus two 16px
  // gaps claim 220px of a 288px content box at 320w, which collapsed the name
  // track to ~20px against a mono anchor whose min-content is 76-84px: the repo
  // link painted straight over its own measured value (parallax-kv 10.4px,
  // accretion-db 38.1px, lodestone 20.0px of glyph overlap at 320w; 18.1px at
  // 340; 3.1px at 355). The 'narrow' viewport was already 320x700 — the gate ran
  // at the failing width and simply had no rail check. Measured on TEXT rects
  // (Range), not element boxes, so a stacked layout with the value on its own row
  // passes and a same-row collision cannot hide behind whitespace.
  if (spec.path === "/") {
    const railOverlaps = await page.evaluate(() => {
      const out = [];
      // Per-TEXT-NODE rects, and only nodes that are actually painted. A Range
      // over the whole element also measures the ".visually-hidden" new-tab
      // string, which `clip: rect(0 0 0 0)` shrinks to a 1x1 box while Range
      // still reports its full 151.7px natural width — measured overlaps of
      // 22-100px against elements whose real boxes never touch. Filtering by
      // rect size cannot separate the two; ancestry can.
      const paintedRects = (root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const boxes = [];
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.nodeValue?.trim()) continue;
          if (n.parentElement?.closest(".visually-hidden")) continue;
          const r = document.createRange();
          r.selectNodeContents(n);
          for (const b of r.getClientRects()) if (b.width > 0 && b.height > 0) boxes.push(b);
        }
        return boxes;
      };
      for (const row of document.querySelectorAll(".hero-readout-row")) {
        const repo = row.querySelector(".hero-readout-repo");
        const value = row.querySelector(".hero-readout-value");
        if (!repo || !value) continue;
        const repoRects = paintedRects(repo);
        const valueRects = paintedRects(value);
        if (!repoRects.length || !valueRects.length) continue;
        const repoRight = Math.max(...repoRects.map((b) => b.right));
        const valueLeft = Math.min(...valueRects.map((b) => b.left));
        // Only a SAME-LINE collision is a defect: below 412px the row stacks by
        // design, and there the value sits on its own line at the same left edge.
        const sameLine = repoRects.some((a) =>
          valueRects.some((b) => a.top < b.bottom - 1 && b.top < a.bottom - 1),
        );
        if (sameLine && repoRight > valueLeft + 0.5)
          out.push(
            `${repo.textContent?.trim()} overlaps its value by ${(repoRight - valueLeft).toFixed(1)}px`,
          );
      }
      return out;
    });
    for (const o of railOverlaps) problems.push(`${tag}: hero readout — ${o}`);
  }

  // HERO RAIL MID-TOKEN WRAP gate. The overlap gate above is necessary and not
  // sufficient, and the project has shipped the gap between them: raising the
  // stacking ceiling 379 -> 411 (2026-08-01) fixed a state where the row had
  // STOPPED overlapping but had not started fitting. The name track computed to
  // 80-111px against mono anchors needing 92.7 / 101.2 / 75.9px, so
  // `parallax-kv` and `accretion-db` broke mid-token with the hyphen dangling at
  // 380 / 385 / 390 and accretion-db alone at 400, clean from 402. A repo name
  // split over two lines is not a name a reader can recognise or retype, and on
  // this rail it is the fold's only clickable route into the evidence — DESIGN.md
  // states the trade explicitly ("a whole unbroken name outranks a compact row").
  //
  // Re-measured 2026-08-02 by reverting the ceiling to 379: the defect returns at
  // exactly those widths INCLUDING 390, which is this file's own mobile viewport,
  // and all twelve page/viewport combos still reported PASS. Nothing here could
  // see it: the boxes do not intersect, so the overlap gate is silent by
  // construction; there is no document overflow; contrast, facts and spine are
  // untouched. Counting LINE BOXES per painted text node is the only signal that
  // distinguishes "fits" from "merely no longer colliding".
  //
  // Distinct rounded rect tops = distinct line boxes, and the count is compared
  // against 1 rather than against a width, so the assertion survives any future
  // re-tuning of the breakpoint: it states the contract (one line per name), not
  // the number that currently satisfies it.
  if (spec.path === "/") {
    const wrapped = await page.evaluate(() => {
      const out = [];
      for (const a of document.querySelectorAll(".hero-readout-repo")) {
        const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
        const tops = new Set();
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.nodeValue?.trim()) continue;
          // Same ancestry filter as the overlap gate: the ".visually-hidden"
          // new-tab string is a second text node inside this anchor and Range
          // reports its full natural width, which would read as an extra line.
          if (n.parentElement?.closest(".visually-hidden")) continue;
          const r = document.createRange();
          r.selectNodeContents(n);
          for (const b of r.getClientRects())
            if (b.width > 0 && b.height > 0) tops.add(Math.round(b.top));
        }
        if (tops.size > 1)
          out.push(
            `${a.textContent?.replace("(opens in new tab)", "").trim()} breaks across ${tops.size} lines (track ${a.parentElement?.getBoundingClientRect().width.toFixed(1)}px)`,
          );
      }
      return out;
    });
    for (const w of wrapped) problems.push(`${tag}: hero readout repo name — ${w}`);
  }

  // MOBILE RHYTHM CASCADE gate (2026-08-03). Same lesson as the wrap gate above,
  // for spacing: a mobile override that LOSES the cascade renders a taller page,
  // not a broken one, so nothing else here can see it. The 2026-08-03 phone-height
  // pass wrote its rules into one consolidated 639px block near the top of
  // index.css and EIGHT OF TEN silently computed the desktop value at 390w
  // (.contact-layout 48px, .footer 48px, .system-feature 16px, .skills-row 24px,
  // .contact-copy h2 16px) — build green, all twelve combos PASS. The file's
  // convention is that source order decides at equal specificity, and these rules
  // sat BEFORE the base rules they override.
  //
  // This asserts the COMPUTED value of the phone verticals that were most
  // expensive to get wrong, at the two phone viewports only. It states each
  // boundary's intended step, so re-tuning a value means updating one line here on
  // purpose rather than discovering months later that a rule never applied. It is
  // deliberately not a page-height assertion: a height total would drift with
  // every copy edit and would not say WHICH rule stopped applying.
  if (spec.path === "/" && viewport.width <= 640) {
    const EXPECTED = [
      [".hero", "paddingTop", "32px"],
      [".hero-layout", "rowGap", "24px"],
      [".hobby-grid", "rowGap", "24px"],
      [".sweep", "rowGap", "8px"], // cross-file: Sweep.css ships after index.css
      [".system-feature", "rowGap", "12px"],
      [".system-evidence", "rowGap", "12px"],
      // `.system-proof` and the system plate's `.plate-footnote` are NOT in this
      // list any more: the home page renders SystemFeature's preview variant,
      // which has no proof paragraph and no provenance strip. They are asserted
      // on /projects/ instead (the block below), where they actually render.
      // Watching a selector on a page that no longer has it turns a rhythm gate
      // into a "not found" gate for a rule that is fine.
      [".sweep-readout", "rowGap", "12px"],
      [".skills-row", "marginBottom", "16px"],
      [".skills-block", "paddingTop", "24px"],
      [".contact-layout", "paddingTop", "32px"],
      [".contact-copy h2", "marginBottom", "12px"],
      [".footer", "paddingTop", "32px"],
      [".footer-colophon", "marginTop", "24px"],
    ];
    const drift = await page.evaluate((expected) => {
      const out = [];
      for (const [sel, prop, want] of expected) {
        const el = document.querySelector(sel);
        if (!el) {
          out.push(`${sel} not found`);
          continue;
        }
        const got = getComputedStyle(el)[prop];
        if (got !== want) out.push(`${sel} { ${prop} } computed ${got}, expected ${want}`);
      }
      // The Last-Child Rule: these close their containers at EVERY width.
      for (const sel of [
        ".system-copy > .project-links:last-child",
        ".skills-block > .skills-row:last-child",
        ".hero-tail > .hero-email-plain:last-child",
      ])
        for (const el of document.querySelectorAll(sel)) {
          const mb = getComputedStyle(el).marginBottom;
          if (mb !== "0px") out.push(`${sel} carries a trailing margin-bottom of ${mb}`);
        }
      return out;
    }, EXPECTED);
    for (const d of drift) problems.push(`${tag}: mobile rhythm lost the cascade — ${d}`);
  }

  // KEYBOARD-TRAP GATE. The drawn keyboard invites "type while the pointer is
  // over it", and the page also binds a `g`-chord shortcut (g+e -> /experience/).
  // enhance.ts guards the chord by checking whether the key tester is armed —
  // but that guard queried `.keyboard-fig` after the component renamed its root
  // to `.kb`, so it silently returned false forever and the chord fired anyway:
  // measured / -> /experience/ with scrollY reset from 773 to 0, i.e. the reader
  // thrown off the page mid-read by accepting the figure's own invitation.
  // No other gate could see it — a class rename breaks no type and no build. So
  // this presses the real sequence over the real figure and asserts we stayed.
  if (spec.path === "/" && viewport.name === "desktop") {
    const kb = page.locator(".kb").first();
    if (await kb.count()) {
      await kb.scrollIntoViewIfNeeded();
      await kb.hover();
      await page.waitForTimeout(120);
      const urlBefore = page.url();
      for (const key of ["g", "e"]) {
        await page.keyboard.press(key);
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(400);
      if (page.url() !== urlBefore)
        problems.push(
          `${tag}: typing over the drawn keyboard navigated away (${urlBefore} -> ${page.url()}) — the g-chord guard is not matching the figure`,
        );
      // Restore state for any later check on this page object.
      if (page.url() !== urlBefore) await page.goto(urlBefore, { waitUntil: "networkidle" });
    }
  }

  // The two rhythm rules that MOVED to /projects/ with the full spec sheets.
  // `.system-proof` and the system plate's `.plate-footnote` used to be asserted
  // in the home-page block above; the home page now renders SystemFeature's
  // preview variant, which has neither. Rather than dropping the assertions with
  // the elements — which would have quietly retired two live rules — they are
  // re-asserted here, on the page that renders them.
  if (spec.path === "/projects/" && viewport.width <= 640) {
    const drift2 = await page.evaluate(() => {
      const out = [];
      for (const [sel, prop, want] of [
        [".system-proof", "marginTop", "12px"],
        [".plate-footnote", "paddingTop", "8px"],
      ]) {
        const el = document.querySelector(sel);
        if (!el) {
          out.push(`${sel} not found`);
          continue;
        }
        const got = getComputedStyle(el)[prop];
        if (got !== want) out.push(`${sel} { ${prop} } computed ${got}, expected ${want}`);
      }
      return out;
    });
    for (const d of drift2) problems.push(`${tag}: mobile rhythm lost the cascade — ${d}`);
  }

  // footer contact links + mailto on every page
  for (const needle of ["github.com/iwang-1", "linkedin.com/in/ivanwang1"]) {
    const n = await page.locator(`footer a[href*="${needle}"]`).count();
    if (n === 0) problems.push(`${tag}: footer link missing: ${needle}`);
  }
  if ((await page.locator('a[href^="mailto:ivanwang8989@gmail.com"]').count()) === 0)
    problems.push(`${tag}: mailto link missing`);
  // NO RÉSUMÉ AS A FILE, in the rendered DOM. This replaces the `"Résumé"`
  // entry that sat on every page's `absent` list, and the swap is the whole
  // point: that entry watched ONE ACCENTED SPELLING of a word, and content.ts
  // states in two places that the copy is written unaccented BECAUSE the gate
  // watches the accented form ("Unaccented 'Resume': the accented literal is on
  // the gate's absent list"). A gate whose subject can satisfy it by choosing a
  // spelling checks nothing — and the accent was never the risk. PRODUCT.md's
  // rule is that no résumé FILE is published; the sentence "Resume on request"
  // IS the affordance.
  //
  // So: the word may be spelled any way, in any case — and this reads BOTH
  // spellings accent-blind (NFD-strip, so "résumé", "Resumé", "RÉSUMÉ" and
  // "resume" are one thing) — but it may never be a download. Two directions,
  // because either alone is escapable: an href that fetches a document (any
  // name, any extension, any origin — the old check named one filename and
  // `.pdf`), and a link whose own text offers a résumé (which catches a Drive or
  // Dropbox URL that has no document extension at all).
  //
  // `.pdf` at the end of any href is still a failure on its own: this site
  // publishes no documents of any kind, so there is nothing legitimate to allow.
  const resumeLinks = await page.$$eval("a", (anchors) => {
    // NFD splits "é" into "e" + U+0301; stripping the combining range collapses
    // every accented spelling onto the plain one. Escapes, not literal combining
    // marks, so the source stays readable (a raw mark renders on top of the "[").
    const deaccent = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const out = [];
    for (const a of anchors) {
      const href = a.getAttribute("href") ?? "";
      const text = deaccent(a.textContent ?? "");
      const isDoc = /\.(pdf|docx?|rtf|odt|pages)(\?|#|$)/i.test(href);
      const offersResume = /\b(resume|cv)\b/.test(text) && /\b(download|pdf|view|open|my)\b/.test(text);
      const hasDownload = a.hasAttribute("download");
      if (isDoc || offersResume || hasDownload)
        out.push(`<a href="${href}" download=${hasDownload}> "${(a.textContent ?? "").trim().slice(0, 40)}"`);
    }
    return out;
  });
  for (const r of new Set(resumeLinks))
    problems.push(
      `${tag}: a résumé/document is offered as a file — no résumé file is published (PRODUCT.md); the site says "Resume on request": ${r}`,
    );
  if (spec.path !== "/404.html") {
    const contactBands = await page.locator(".contact-band").count();
    if (contactBands !== 1) problems.push(`${tag}: expected one contact band, got ${contactBands}`);
  }

  // reveal gate: full scroll must leave no .reveal without .is-in
  // (instant scrolls — html has scroll-behavior: smooth, and an animated
  // scroll would leave the sticky nav mid-viewport in the screenshots)
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(600); // let 450ms transitions finish
  const unrevealed = await page.$$eval(".reveal:not(.is-in)", (els) => els.length);
  if (unrevealed) problems.push(`${tag}: ${unrevealed} .reveal never gained .is-in after full scroll`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(100);

  // PARKED-OFFSET reveal gate. The gate above cannot see the defect this one
  // catches: it always steps from y=0 in 600px increments with 60ms dwell, so
  // every block enters the root from BELOW and satisfies the 0.15 threshold on
  // the way in. Landing directly on a deep offset — an anchor link, a restored
  // scroll position, a middle-click into the page — a block taller than ~6.7x
  // the 15% slice can sit fully on screen at a ratio under 0.15 and never fire.
  // Measured dead before the [0, 0.15] threshold fix: /projects/ at 390x844
  // parked at y=2000 (FIG. 04 lodestone, 1041px) and /experience/ at y=800
  // (869px timeline item), both opacity 0 after 3s stationary.
  // Assert on VISIBLE geometry, not on .is-in: what matters is that nothing the
  // reader can see is transparent.
  for (const parkY of [800, 2000, 4200]) {
    const parked = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
    });
    await parked.goto(ORIGIN + spec.path, { waitUntil: "networkidle" });
    const reachable = await parked.evaluate(
      (y) => y <= document.documentElement.scrollHeight - document.documentElement.clientHeight,
      parkY,
    );
    if (!reachable) {
      await parked.close();
      continue;
    }
    await parked.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), parkY);
    await parked.waitForTimeout(700); // past the 450ms transition
    const stuck = await parked.evaluate(() => {
      const out = [];
      // Bounded by the observer's OWN root, not the raw viewport: useReveal
      // declares `rootMargin: 0px 0px -10% 0px`, so the bottom 10% of the screen
      // is an authored pre-roll strip where a block that has only just peeked in
      // is SUPPOSED to still be faded — that is the fade reading as designed.
      // Measured: /projects/ at 390x844 parked at y=800 leaves FIG. 03's top at
      // 795.9 against a root bottom of 759.6, i.e. genuinely outside. Asserting
      // on the raw viewport would fail a correct render. A block big enough to
      // deadlock the threshold spans the whole root, so nothing is lost.
      const rootBottom = window.innerHeight * 0.9;
      for (const el of document.querySelectorAll(".reveal")) {
        const r = el.getBoundingClientRect();
        const inRoot = r.bottom > 0 && r.top < rootBottom && r.width && r.height;
        if (inRoot && getComputedStyle(el).opacity !== "1")
          out.push(el.className || el.tagName);
      }
      return out;
    });
    if (stuck.length)
      problems.push(
        `${tag}: ${stuck.length} on-screen .reveal still transparent when parked at y=${parkY} (${stuck.join(", ")})`,
      );
    await parked.close();
  }

  // MOUNT-FAILURE gate: a throw anywhere in the mount path must leave the
  // prerendered HTML VISIBLE, never blank the page. `.js` is what switches on
  // `.js .reveal { opacity: 0 }`, so it may only be set after render completes
  // (src/js-flag.ts). Deleting matchMedia is the cheapest real reproduction —
  // measured before the fix: #root rendered 0 children and 0 visible characters
  // on / and /projects/ while documentElement still carried `js`.
  const broken = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });
  await broken.addInitScript(() => {
    // @ts-expect-error deliberately removing a platform API
    delete window.matchMedia;
  });
  await broken.goto(ORIGIN + spec.path, { waitUntil: "networkidle" });
  const degraded = await broken.evaluate(() => ({
    children: document.getElementById("root")?.children.length ?? 0,
    text: (document.getElementById("root")?.innerText ?? "").trim().length,
  }));
  if (degraded.children === 0 || degraded.text === 0)
    problems.push(
      `${tag}: broken-mount render is blank (#root children ${degraded.children}, ${degraded.text} chars) — content must survive a throw in the mount path`,
    );
  await broken.close();

  // footer exemption: the footer must never reveal (always visible)
  if (await page.locator("footer .reveal").count())
    problems.push(`${tag}: footer must never reveal`);

  // reduced-motion gate: everything visible immediately, no hidden frame
  const rm = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });
  await rm.emulateMedia({ reducedMotion: "reduce" });
  await rm.goto(ORIGIN + spec.path, { waitUntil: "networkidle" });
  const hiddenRM = await rm.$$eval(".reveal, .hero > *, .page-head > *", (els) =>
    els.filter((e) => getComputedStyle(e).opacity !== "1").length);
  if (hiddenRM) problems.push(`${tag}: ${hiddenRM} element(s) hidden under reduced motion`);
  await rm.close();

  // PRINT-PALETTE GATE. Nothing in this file emulated `print` media before, and
  // that blind spot is how a real defect survived a whole rebuild: the print
  // block rebases the raw tokens to measured PAPER values, then hardcoded three
  // literals from the RETIRED dark palette over the top of them — #c4ccd4 sheet
  // borders, #6b7885 button hairlines, #0b3a6b link ink. Every printed sheet
  // border wore the old world's colour and no screen test could see it.
  //
  // WHAT THIS ASSERTS, and what it deliberately does NOT. A first version of
  // this gate failed everything cool and was WRONG: `--raw-slate` is a genuine
  // blue in the shipped palette (#33566e on screen, "data traces and links"),
  // so its darkened paper value #24405a is correct, not drift. Hue is therefore
  // not the test.
  // The test is that every printed value must be one the print block's own
  // rebase declares. Those nine values are the paper palette; anything else is a
  // literal someone left behind. This also keeps working if the palette changes,
  // because it reads the expected set out of the stylesheet rather than hardcoding
  // it here — and it does not force tokens, which the print block explains would
  // regress the printed primary button (a token let a later :root remap reach into
  // the print sheet and measured 1.59:1).
  if (viewport.name === "desktop") {
    // The paper palette, read out of the print block's own :root rebase.
    const printRoot = builtCss.match(/@media\s+print\s*\{[\s\S]*?:root\s*\{([^}]*)\}/);
    const allowed = new Set(
      [...(printRoot?.[1] ?? "").matchAll(/#([0-9a-f]{6})/gi)].map((m) => m[1].toLowerCase()),
    );
    if (allowed.size < 5) {
      problems.push(
        `${tag}: could not read the print block's :root rebase out of the built CSS — the print-palette gate must never silently pass`,
      );
    } else {
      const pr = await browser.newPage({ viewport: { width: 1024, height: 1400 } });
      await pr.emulateMedia({ media: "print" });
      await pr.goto(ORIGIN + spec.path, { waitUntil: "networkidle" });
      const printed = await pr.evaluate(() => {
        const grab = (sel, prop) => {
          const el = document.querySelector(sel);
          return el ? getComputedStyle(el)[prop] : null;
        };
        return {
          "body color": grab("body", "color"),
          "body background": grab("body", "backgroundColor"),
          "link color": grab("a", "color"),
          "sheet border": grab(".sheet-block", "borderTopColor"),
          "button ink": grab(".btn", "color"),
          "button border": grab(".btn", "borderTopColor"),
        };
      });
      await pr.close();
      const hex = (v) => {
        const m = v && v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return null;
        return [1, 2, 3].map((i) => Number(m[i]).toString(16).padStart(2, "0")).join("");
      };
      for (const [what, value] of Object.entries(printed)) {
        const h = hex(value);
        if (!h) continue;
        if (!allowed.has(h))
          problems.push(
            `${tag}: printed ${what} is #${h} (${value}), which is not one of the paper values the print block's own :root rebase declares (${[...allowed].map((c) => "#" + c).join(", ")}) — a leftover literal from a retired palette`,
          );
      }
    }
  }

  // 9. screenshot (before the skip-link focus test so it stays hidden; after
  //    the full-scroll reveal pass so docs/ shots show revealed content)
  const shot = `docs/${spec.shot}-${viewport.name}.png`;
  await page.screenshot({ path: shot, fullPage: true });

  // 8. a11y gates
  const h1Count = await page.locator("h1").count();
  if (h1Count !== 1) problems.push(`${tag}: expected exactly one h1, got ${h1Count}`);
  if (!(await page.locator("h1").first().isVisible())) problems.push(`${tag}: h1 not visible`);
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  if (firstFocus !== "Skip to content")
    problems.push(`${tag}: first focusable is ${JSON.stringify(firstFocus)}, not the skip link`);

  if (spec.path === "/" && viewport.name === "desktop") {
    const fab = page.locator("#kbd-fab");
    await fab.click();
    await page.waitForTimeout(50);
    const openState = await page.evaluate(() => {
      const overlay = document.getElementById("kbd-help");
      return {
        visible: Boolean(overlay && !overlay.hidden),
        rootInert: document.getElementById("root")?.hasAttribute("inert") ?? false,
        fabInert: document.getElementById("kbd-fab")?.hasAttribute("inert") ?? false,
        scrollLocked: document.body.classList.contains("modal-open"),
        focusInside: Boolean(overlay?.contains(document.activeElement)),
      };
    });
    for (const [name, value] of Object.entries(openState))
      if (!value) problems.push(`${tag}: command palette open-state check failed: ${name}`);

    await page.locator(".kbd-help-close").focus();
    await page.keyboard.press("Tab");
    const trapped = await page.evaluate(() =>
      document.getElementById("kbd-help")?.contains(document.activeElement),
    );
    if (!trapped) problems.push(`${tag}: command palette focus trap failed`);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const escapeState = await page.evaluate(() => ({
      hidden: document.getElementById("kbd-help")?.hidden ?? false,
      rootActive: !document.getElementById("root")?.hasAttribute("inert"),
      fabActive: !document.getElementById("kbd-fab")?.hasAttribute("inert"),
      scrollUnlocked: !document.body.classList.contains("modal-open"),
      focusRestored: document.activeElement?.id === "kbd-fab",
    }));
    for (const [name, value] of Object.entries(escapeState))
      if (!value) problems.push(`${tag}: command palette escape-state check failed: ${name}`);

    await fab.click();
    await page.waitForTimeout(50);
    await page.locator(".kbd-help-backdrop").click({ position: { x: 4, y: 4 } });
    await page.waitForTimeout(250);
    if (!(await page.locator("#kbd-help").evaluate((el) => el.hidden)))
      problems.push(`${tag}: backdrop click did not close command palette`);
  }
  const badAlts = await page.$$eval("img", (imgs) =>
    imgs.filter((i) => !i.getAttribute("alt")).length,
  );
  if (badAlts > 0) problems.push(`${tag}: ${badAlts} img(s) missing alt`);

  // landmarks
  for (const sel of ["nav", "main", "footer"])
    if ((await page.locator(sel).count()) === 0) problems.push(`${tag}: missing <${sel}>`);

  // 1 & 2. console errors and bad requests
  if (errors.length) problems.push(`${tag}: console errors: ${errors.join("; ")}`);
  if (badRequests.length) problems.push(`${tag}: bad requests: ${badRequests.join("; ")}`);

  await page.close();
}

const failCountAt = {};
for (const spec of PAGES) {
  for (const viewport of VIEWPORTS) {
    const preCount = problems.length;
    await checkPage(spec, viewport);
    failCountAt[`${spec.path} @ ${viewport.name}`] = problems.length - preCount;
  }
}

// ---------------------------------------------------------------------------
// CROSS-PAGE GATE: the home page may not BE the projects page.
//
// Every per-page gate above passed while `/` and `/projects/` rendered 13
// BYTE-IDENTICAL blocks of text — the same three project sheets, same diagrams,
// same numbers, same NOTES & LIMITS — because no single-page check can see a
// duplicate that lives on the other page. A cold recruiter reviewer ranked it
// first of five problems: the home page ran 6,400px to deliver three projects
// they were about to meet again.
//
// The home page now renders previews and /projects/ carries the full sheets, so
// the only text the two legitimately share is each project's one-sentence
// summary — an index entry and its full entry may open the same way. The
// threshold is 3 (one summary per featured project) with a message that names
// what leaked, so this fails loudly if a full sheet is ever pasted back onto the
// home page.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const textBlocks = async (path) => {
    await page.goto(ORIGIN + path, { waitUntil: "networkidle" });
    return page.evaluate(() =>
      Array.from(document.querySelectorAll(".system-feature"))
        .flatMap((el) => Array.from(el.querySelectorAll("p, li")))
        .map((el) => el.innerText.replace(/\s+/g, " ").trim())
        .filter((t) => t.length > 150),
    );
  };
  const home = await textBlocks("/");
  const projects = new Set(await textBlocks("/projects/"));
  const shared = home.filter((t) => projects.has(t));
  if (shared.length > 3)
    problems.push(
      `cross-page: / and /projects/ share ${shared.length} identical text blocks (max 3, one summary per project). First leak: ${JSON.stringify(shared[0].slice(0, 90))}`,
    );
  await page.close();
}

await browser.close();
kill();

// pass/fail table
console.log("\n page                 viewport   result");
console.log(" ------------------------------------------");
for (const [key, fails] of Object.entries(failCountAt)) {
  const [p, v] = key.split(" @ ");
  console.log(` ${p.padEnd(20)} ${v.padEnd(10)} ${fails === 0 ? "PASS" : `FAIL (${fails})`}`);
}

if (problems.length) {
  console.error("\nVERIFY FAILED:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log("\nVERIFY OK — screenshots refreshed in docs/");
