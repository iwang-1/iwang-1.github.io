// Multi-page verification: serves the built dist/ with `vite preview` and drives every page in headless
// Chromium at desktop (1366x900) and mobile (390x844) viewports.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { chromium } from "playwright";

const PORT = 4173;
const ORIGIN = `http://localhost:${PORT}`;

// `facts` are strings that must render on this page.
const PAGES = [
  {
    path: "/",
    shot: "home",
    title: "Ivan Wang · Software Engineer · UMD CS · AWS SDE Intern",
    canonical: "https://iwang-1.github.io/",
    noindex: false,
    activeTab: "/",
    // "Secretary of the UMD Climbing Club" was retired 2026-07-27 by owner request.
    /* "bouldering", not "rock climbing": the hero bio was reworded 2026-08-07 at the owner's request and the
       drawing is a boulder problem, so this tracks the words that actually render. */
    facts: ["May 2027", "mechanical keyboards", "bouldering", "Departmental Honors", "2.9M"],
    absent: ["Hong Kong", "74.2%", "67.7%", "64,000", "1,400", "2,640"],
  },
  {
    path: "/experience/",
    shot: "experience",
    title: "Experience · Ivan Wang",
    canonical: "https://iwang-1.github.io/experience/",
    noindex: false,
    activeTab: "/experience/",
    facts: ["7 agent-migrated tests", "3,000+ students", "50,000+ records"],
    absent: ["Hong Kong"],
  },
  {
    path: "/projects/",
    shot: "projects",
    title: "Projects · Ivan Wang",
    canonical: "https://iwang-1.github.io/projects/",
    noindex: false,
    activeTab: "/projects/",
    facts: ["Unsupervised Domain Adaptation", "Four-person research project", "This site", "2.9 million"],
    absent: ["Hong Kong", "star-catalog", "star-spectral", "sky map", "74.2%", "67.7%", "95%", "1,400", "2,640"],
  },
  {
    path: "/404.html",
    shot: "404",
    title: "Page not found · Ivan Wang",
    canonical: null,
    noindex: true,
    activeTab: null,
    facts: [],
    absent: [],
  },
];

const VIEWPORTS = [
  { width: 1366, height: 900, name: "desktop" },
  // Tablet, added 2026-08-06 because its absence hid a real defect for months.
  { width: 768, height: 1024, name: "tablet" },
  { width: 390, height: 844, name: "mobile" },
  { width: 320, height: 700, name: "narrow" },
];

mkdirSync("docs", { recursive: true });

// --- serve dist/ -------------------------------------------------------------
/* `ignore`, not `pipe`, on the child's stdout/stderr. This spawned `vite preview` with both piped and then
   never read either stream. */
const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: ["ignore", "ignore", "ignore"],
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
/* Nothing IN this file may hang forever. */
const HARD_LIMIT_MS = 12 * 60 * 1000;
const hardLimit = setTimeout(() => {
  console.error(
    `\nVERIFY FAILED: exceeded the ${HARD_LIMIT_MS / 60000}-minute hard limit — something is hanging, not merely slow.`,
  );
  /* Kill the preview child explicitly: `--strictPort` means an orphan holding 4173
     makes every subsequent run fail on startup instead of on the real problem. */
  try {
    server.kill("SIGKILL");
  } catch {
    /* already gone */
  }
  process.exit(1);
}, HARD_LIMIT_MS);
hardLimit.unref?.();
const problems = [];
const checkedLinks = new Map(); // href -> ok

// build-artifact gates: the motion contract must survive the CSS build.
const cssFile = readdirSync("dist/assets").find((f) => f.endsWith(".css"));
const builtCss = readFileSync(`dist/assets/${cssFile}`, "utf8");
if (!/prefers-reduced-motion:\s*reduce/.test(builtCss))
  problems.push("built CSS missing prefers-reduced-motion: reduce block");
if (!/prefers-reduced-motion:\s*no-preference/.test(builtCss))
  problems.push("built CSS missing no-preference gate around .reveal hidden state");

// Prerender gate: every dist HTML shell must carry full static #root markup (the site stays readable when
// the JS bundle is blocked or fails), and the static HTML must not pre-bake the .js class — the.
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
// NO published RÉSUMÉ file, as a build artifact.
{
  const docFiles = readdirSync("dist", { recursive: true })
    .map(String)
    .filter((f) => /\.(pdf|docx?|rtf|odt|pages)$/i.test(f));
  if (docFiles.length)
    problems.push(
      `dist: document file(s) deployed (${docFiles.join(", ")}) — no résumé/CV file is published (PRODUCT.md); the site says "Resume on request" instead`,
    );
}

// Self-hosted font gates (double-shot, 2026-08-04).
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
  // Budget ceiling, not a target. The direction contract projected 21,440 B; the real subset measures
  // 21,516 B (the ofl copyright and licence-URL name records are preserved in every file, which is part of that).
  if (fontBytes > 24000)
    problems.push(`dist/fonts: ${fontBytes} B of font files exceeds the 24,000 B budget`);
}
// Font preload gate. Every page shell must preload both self-hosted faces.
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
  // Changed for double-shot (2026-08-04): this was the dark-theme gate (`lum > 0.05` → fail), asserting the
  // near-black #0B1220 ground of the outgoing "Figure One" world.
  const lum = await page.evaluate(() => {
    const [r, g, b] = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  });
  if (lum < 0.62 || lum > 0.93)
    problems.push(
      `${tag}: page surface luminance ${lum.toFixed(4)} outside the light-world band 0.62-0.93 (cap beige = 0.8022)`,
    );

  // No-italic gate (double-shot, 2026-08-04). the derived rule: there is no italic anywhere on this site,
  // because a keycap legend has no italic.
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
  // The Contact tab targets this page's own contact band ("#contact") on every page that has one, so the
  // tab scrolls instead of reloading the site; the 404 has no band and keeps the absolute "/#contact".
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
    // Was (until 2026-08-05): `.route-progress-hold` count must be 0.
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

  // One-left-spine gate (was: container-padding gate). Band headline content must share the nav brand's
  // left edge.
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

    // The boulder'S contract.
    const paths = page.locator(".boulder-path");
    if ((await paths.count()) !== 3)
      problems.push(`${tag}: boulder must show exactly 3 sequences, got ${await paths.count()}`);
    const onHolds = await page.locator(".boulder-hold-on").count();
    const offHolds = await page.locator(".boulder-hold-off").count();
    /* 14 on-route (start + 4 left + 3 centre + 4 right + rest + finish) and 6 off. */
    if (onHolds < 14 || offHolds < 6)
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
    // The label must agree with the drawing.
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
    // Each role shows its employer's real logo, one <img> per card. tightened 2026-08-05.
    const perCardLogos = await items.evaluateAll((cards) =>
      cards.map((card) => card.querySelectorAll(".role-logo img[alt]").length),
    );
    const wrongLogoCards = perCardLogos.filter((n) => n !== 1).length;
    if (wrongLogoCards)
      problems.push(
        `${tag}: ${wrongLogoCards} of ${perCardLogos.length} role cards do not carry exactly one real <img> logo (counts: ${perCardLogos.join(", ")})`,
      );
    // No stand-in marks. Asserted separately from the count above so the failure message says which thing
    // went wrong, and so a lettermark that replaces an <img> can't read as "still 7 logos".
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

  // Caption/figure non-overlap gate: the mobile caption collision (-20px into parallax's N3, -35px into
  // accretion's sst across 6 renders) shipped while all 12 checks passed.
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

  // Primary-cta contrast gate, at rest and hovered: the 1.21:1 invisible-cta hover bug (a later :hover
  // out-specifying the primary variant) was completely invisible to the other 12 checks.
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

    // ...and focused. The global :focus-visible ring is --series-2, which on the amber-filled primary drew
    // #e9a13b on #e9a13b — a measured 1.00:1 ring on the one control a keyboard screener is most likely to reach.
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

  // Hero readout rail overlap gate.
  if (spec.path === "/") {
    const railOverlaps = await page.evaluate(() => {
      const out = [];
      // Per-text-node rects, and only nodes that are actually painted.
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

  // Hero rail mid-token wrap gate.
  if (spec.path === "/") {
    const wrapped = await page.evaluate(() => {
      const out = [];
      for (const a of document.querySelectorAll(".hero-readout-repo")) {
        const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
        const tops = new Set();
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.nodeValue?.trim()) continue;
          // Same ancestry filter as the overlap gate: the ".visually-hidden" new-tab string is a second
          // text node inside this anchor and Range reports its full natural width, which would read as an extra line.
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

  // Mobile rhythm cascade gate (2026-08-03). Same lesson as the wrap gate above, for spacing: a mobile
  // override that loses the cascade renders a taller page, not a broken one, so nothing else here can see it.
  if (spec.path === "/" && viewport.width <= 640) {
    const EXPECTED = [
      [".hero", "paddingTop", "32px"],
      [".hero-layout", "rowGap", "24px"],
      [".hobby-grid", "rowGap", "24px"],
      [".sweep", "rowGap", "8px"], // cross-file: Sweep.css ships after index.css
      [".system-feature", "rowGap", "12px"],
      [".system-evidence", "rowGap", "12px"],
      // `.system-proof` and the system plate's `.plate-footnote` are not in this list any more: the home
      // page renders SystemFeature's preview variant, which has no proof paragraph and no provenance strip.
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

  // NO inert controls without javascript.
  if (viewport.name === "desktop") {
    const nojs = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      javaScriptEnabled: false,
    });
    await nojs.goto(ORIGIN + spec.path, { waitUntil: "load" });
    const dead = await nojs.evaluate(() =>
      [...document.querySelectorAll("button")]
        .filter((b) => b.offsetParent !== null && !b.closest(".kb"))
        .map((b) => (b.textContent || "").trim() || b.getAttribute("aria-label") || "?"),
    );
    await nojs.close();
    // The drawn keyboard's caps are excluded above and that is deliberate: they are a toy whose drawing is
    // the point, they carry no promise of action, and the figure states its own contract.
    if (dead.length)
      problems.push(
        `${tag}: ${dead.length} button(s) render visible but inert without JavaScript (${[...new Set(dead)].join(", ")}) — gate them on the .js class or remove them`,
      );
  }

  // Keycap legends must BE readable, and must not outrank the page. SVG text scales with the drawing, so a
  // font-size in viewBox units says nothing about what a reader sees.
  if (spec.path === "/") {
    const legend = await page.evaluate(() => {
      const svg = document.querySelector(".kb-svg");
      const el = document.querySelector(".kb-legend");
      const sub = document.querySelector(".kb-sub");
      if (!svg || !el) return null;
      const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      return {
        legend: parseFloat(getComputedStyle(el).fontSize) * scale,
        sub: sub ? parseFloat(getComputedStyle(sub).fontSize) * scale : null,
      };
    });
    if (!legend) {
      problems.push(`${tag}: the drawn keyboard's legends are missing — their size gates cannot run`);
    } else {
      // 6.5px floor: below it the glyphs stop resolving at this scale (5.35px was
      // measured illegible). Not a WCAG number — a legibility floor for a drawing.
      if (legend.legend < 6.5)
        problems.push(
          `${tag}: keycap legends render at ${legend.legend.toFixed(2)}px — below the 6.5px legibility floor for this drawing`,
        );
      if (legend.sub !== null && legend.sub < 5)
        problems.push(
          `${tag}: shifted keycap legends render at ${legend.sub.toFixed(2)}px — below the 5px floor`,
        );
      // 13px is the page's mono label rank; a figure's own type stays beneath it.
      if (legend.legend > 13)
        problems.push(
          `${tag}: keycap legends render at ${legend.legend.toFixed(2)}px — above the page's 13px mono label rank, so the drawing's type outranks the section labels`,
        );
    }
  }

  // Text-only zoom (WCAG 1.4.4): 200% text with no loss of content.
  if (viewport.name === "narrow") {
    for (const root of [20, 24, 32]) {
      await page.evaluate((r) => {
        document.documentElement.style.fontSize = `${r}px`;
      }, root);
      await page.waitForTimeout(200);
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (over > 1)
        problems.push(
          `${tag}: ${over}px of horizontal document overflow at a ${root}px root font-size (text-only zoom, WCAG 1.4.4) — text must break before the page does`,
        );
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "";
    });
    await page.waitForTimeout(150);
  }

  // Every measured sample must BE reachable BY pointer OR finger.
  if (spec.path === "/" && viewport.width <= 480) {
    const step = page.locator("[data-sweep-step]");
    if ((await step.count()) !== 2) {
      problems.push(
        `${tag}: expected 2 sweep steppers below 560px, found ${await step.count()} — two samples are otherwise unreachable by pointer`,
      );
    } else {
      const prev = page.locator('[data-sweep-step="-1"]');
      const next = page.locator('[data-sweep-step="1"]');
      const readNow = async () =>
        (await page.locator(".sweep-readout-value").first().innerText()).split("·")[0].trim();
      await page.locator("figure.sweep").scrollIntoViewIfNeeded();
      const seen = new Set([await readNow()]);
      /* 12 clicks each way covers a 10-sample run from any starting index, and each one carries an explicit 5s
         timeout. */
      for (const [btn, label] of [
        [prev, "previous"],
        [next, "next"],
      ]) {
        for (let i = 0; i < 12; i++) {
          try {
            await btn.click({ timeout: 5000 });
          } catch {
            problems.push(
              `${tag}: sweep "${label}" stepper was not clickable within 5s on press ${i + 1} — the control is obstructed or not interactive`,
            );
            break;
          }
          await page.waitForTimeout(35);
          seen.add(await readNow());
        }
      }
      const total = await page.locator(".sweep-table tbody tr").count();
      if (seen.size < total)
        problems.push(
          `${tag}: steppers reach only ${seen.size} of ${total} measured samples — every sample the figure plots must be reachable without a keyboard`,
        );
      // A stepper must be a real touch target, since it exists FOR touch.
      const box = await prev.boundingBox();
      if (box && (box.width < 44 || box.height < 44))
        problems.push(
          `${tag}: sweep stepper is ${Math.round(box.width)}x${Math.round(box.height)}px — below the 44px tap target it exists to serve`,
        );
      await page.goto(ORIGIN + spec.path, { waitUntil: "networkidle" });
    }
  }

  // A widget may not swallow keys for its descendants.
  if (spec.path === "/" && viewport.name === "desktop") {
    const docMax = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    // (a) End on a LINK inside the figure must still jump the document.
    const link = page.locator("a.sweep-source").first();
    if (await link.count()) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await link.focus();
      await page.keyboard.press("End");
      await page.waitForTimeout(350);
      const y = await page.evaluate(() => Math.round(window.scrollY));
      if (y < docMax - 50)
        problems.push(
          `${tag}: End on the link INSIDE the sweep figure left scrollY at ${y} (document max ${docMax}) — a widget may claim Home/End only while focus is on the widget itself, not its descendants`,
        );
    }
    // (a2) …and the widget itself must still own them, or the fix went too far.
    const fig = page.locator("figure.sweep").first();
    if (await fig.count()) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await fig.focus();
      const before = (await page.locator(".sweep-readout-value").first().innerText()).trim();
      await page.keyboard.press("End");
      await page.waitForTimeout(300);
      const after = (await page.locator(".sweep-readout-value").first().innerText()).trim();
      if (before === after)
        problems.push(
          `${tag}: End on the sweep figure itself no longer moves the readout (${before}) — the widget must keep the keys it advertises`,
        );
    }
    // (b) `?` over the armed key tester must not open the overlay…
    const kb = page.locator(".kb").first();
    const overlayOpen = () =>
      page.evaluate(() => {
        const d = document.querySelector(".kbd-help");
        return d ? !d.hidden && getComputedStyle(d).display !== "none" : false;
      });
    if (await kb.count()) {
      await kb.scrollIntoViewIfNeeded();
      await kb.hover();
      await page.waitForTimeout(120);
      await page.keyboard.press("?");
      await page.waitForTimeout(300);
      if (await overlayOpen())
        problems.push(
          `${tag}: "?" over the armed key tester opened the shortcut overlay — the figure prints ? on its slash cap and invites typing, so the truce must cover it`,
        );
      // …and must STILL open it everywhere else, or the shortcut is just broken.
      await page.mouse.move(4, 4);
      await page.waitForTimeout(250);
      await page.keyboard.press("?");
      await page.waitForTimeout(300);
      if (!(await overlayOpen()))
        problems.push(`${tag}: "?" no longer opens the shortcut overlay away from the keyboard`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
    }
    /* Leave NO focus behind. */
    await page.goto(ORIGIN + spec.path, { waitUntil: "networkidle" });
    await page.waitForTimeout(150);
  }

  // Figure-name agreement gate. A figure's accessible name must contain the same figure identifier its
  // visible label shows.
  if (spec.path === "/" && viewport.name === "desktop") {
    const figNames = await page.evaluate(() => {
      const out = [];
      for (const fig of document.querySelectorAll("figure[aria-label], [role='group'][aria-label]")) {
        const label = fig.getAttribute("aria-label") ?? "";
        const visible = fig.querySelector(".plate-label, figcaption")?.textContent ?? "";
        // Only figures whose VISIBLE label carries a FIG. number are in scope.
        const m = visible.match(/FIG\.\s*[\w]+(\s+DETAIL)?/i);
        if (!m) continue;
        out.push({ id: m[0].trim(), label, agrees: label.toUpperCase().includes(m[0].trim().toUpperCase()) });
      }
      return out;
    });
    for (const f of figNames)
      if (!f.agrees)
        problems.push(
          `${tag}: figure labelled "${f.id}" for sighted readers announces itself as ${JSON.stringify(f.label.slice(0, 60))} — the accessible name must carry the same figure identifier`,
        );
  }

  // Keyboard tab-budget + hit-alignment gate. Two defects, neither of which any existing check could see.
  if (spec.path === "/" && viewport.name === "desktop") {
    const kbA11y = await page.evaluate(() => {
      const fig = document.querySelector(".kb");
      if (!fig) return null;
      /* Real tab stops, which means checking each element's own tabIndex. */
      const stops = [...fig.querySelectorAll("a[href],button,input,select,textarea,[tabindex]")].filter(
        (el) =>
          el.tabIndex >= 0 &&
          !el.hasAttribute("disabled") &&
          (el.offsetParent !== null || el.getClientRects().length),
      );
      const caps = [...fig.querySelectorAll(".kb-key")];
      const btns = [...fig.querySelectorAll(".kb-hit-btn")];
      let worst = 0;
      let missed = 0;
      for (let i = 0; i < Math.min(caps.length, btns.length); i++) {
        const c = caps[i].getBoundingClientRect();
        const t = btns[i].getBoundingClientRect();
        worst = Math.max(worst, Math.abs(c.top + c.height / 2 - (t.top + t.height / 2)));
        if (!(t.left < c.right && c.left < t.right && t.top < c.bottom && c.top < t.bottom)) missed++;
      }
      const names = btns.map((b) => b.getAttribute("aria-label") || "");
      const dupes = names.filter((n, i) => n && names.indexOf(n) !== i);
      return { stops: stops.length, caps: caps.length, btns: btns.length, worst, missed, dupes };
    });
    if (!kbA11y) {
      problems.push(`${tag}: the drawn keyboard is missing — its a11y gates cannot run`);
    } else {
      if (kbA11y.stops > 2)
        problems.push(
          `${tag}: the keyboard figure owns ${kbA11y.stops} tab stops (max 2) — a keyboard user must not tab through every keycap to reach the page's evidence`,
        );
      if (kbA11y.caps !== kbA11y.btns)
        problems.push(
          `${tag}: ${kbA11y.caps} drawn caps but ${kbA11y.btns} hit targets — every cap must be operable and none may be phantom`,
        );
      if (kbA11y.missed)
        problems.push(
          `${tag}: ${kbA11y.missed} hit target(s) do not overlap the cap they name (worst centre offset ${kbA11y.worst.toFixed(1)}px) — the hit layer's box has diverged from the drawing's`,
        );
      if (kbA11y.dupes.length)
        problems.push(
          `${tag}: duplicated keycap accessible names (${[...new Set(kbA11y.dupes)].join(", ")}) — a screen-reader user cannot tell the doubled modifiers apart`,
        );
    }
  }

  // Keyboard-trap gate.
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

  // The two rhythm rules that moved to /projects/ with the full spec sheets.
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
  // NO RÉSUMÉ AS A file, in the rendered DOM.
  const resumeLinks = await page.$$eval("a", (anchors) => {
    // Nfd splits "é" into "e" + U+0301; stripping the combining range collapses every accented spelling
    // onto the plain one.
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

  // Reveal gate: full scroll must leave no .reveal without .is-in (instant scrolls — html has
  // scroll-behavior: smooth, and an animated scroll would leave the sticky nav mid-viewport in the screenshots)
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

  // Parked-offset reveal gate.
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
      // Bounded by the observer's own root, not the raw viewport: useReveal declares `rootMargin: 0px 0px
      // -10% 0px`, so the bottom 10% of the screen is an authored pre-roll strip where a block that has only just.
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

  // Mount-failure gate: a throw anywhere in the mount path must leave the prerendered HTML visible, never
  // blank the page.
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

  // Print-palette gate.
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

// Cross-page gate: the home page may not BE the projects page.
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
clearTimeout(hardLimit);
console.log("\nVERIFY OK — screenshots refreshed in docs/");
