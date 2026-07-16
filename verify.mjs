// Multi-page verification: serves the built dist/ with `vite preview` and
// drives every page in headless Chromium at desktop (1366x900) and mobile
// (390x844) viewports. Fails on any console/page error, any failed or 4xx/5xx
// same-origin request, wrong head metadata, wrong nav state, a dead internal
// link, a missing locked fact, or an a11y-gate breach. Refreshes the README
// screenshots in docs/ (commit them when they change meaningfully).
//
//   npm run build && npm run verify
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { chromium } from "playwright";

const PORT = 4173;
const ORIGIN = `http://localhost:${PORT}`;

const PAGES = [
  {
    path: "/",
    shot: "home",
    title: "Ivan Wang — Software Engineer · UMD CS B.S./M.S. · AWS SDE Intern, Summer 2026",
    canonical: "https://iwang-1.github.io/",
    noindex: false,
    activeTab: "/",
    facts: ["May 2027", "Secretary of the UMD Climbing Club", "Departmental Honors", "2.9 million"],
    absent: ["Hong Kong", "Now — SDE Intern", "74.2%", "67.7%", "64,000", "1,400", "2,640", "Résumé"],
  },
  {
    path: "/experience/",
    shot: "experience",
    title: "Experience — Ivan Wang",
    canonical: "https://iwang-1.github.io/experience/",
    noindex: false,
    activeTab: "/experience/",
    facts: ["7 agent-migrated tests", "3,000+ students", "50,000+ records"],
    absent: ["Hong Kong", "1M+ customers", "4 upstream PRs", "Résumé"],
  },
  {
    path: "/projects/",
    shot: "projects",
    title: "Projects — Ivan Wang",
    canonical: "https://iwang-1.github.io/projects/",
    noindex: false,
    activeTab: "/projects/",
    facts: ["Unsupervised Domain Adaptation", "Four-person research project", "This site", "2.9 million"],
    absent: ["Hong Kong", "star-catalog", "star-spectral", "sky map", "74.2%", "67.7%", "95%", "1,400", "2,640", "4 upstream PRs", "Résumé"],
  },
  {
    path: "/404.html",
    shot: "404",
    title: "Page not found — Ivan Wang",
    canonical: null,
    noindex: true,
    activeTab: null,
    facts: [],
    absent: ["Résumé"],
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
if (existsSync("dist/Ivan-Wang-Resume.pdf"))
  problems.push("dist: stale public résumé PDF must not be deployed");

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
  // dark-theme gate: body background luminance must be dark (#0B1220 ≈ 0.007)
  const lum = await page.evaluate(() => {
    const [r, g, b] = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  });
  if (lum > 0.05) problems.push(`${tag}: body background not dark (luminance ${lum.toFixed(3)})`);

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
  const contactTab = await page
    .locator('nav[aria-label="Primary"] a[href="/#contact"]')
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

  // The progress rail stays attached to the sticky header, without the old
  // unexplained yellow hold markers, and its marker moves as the page scrolls.
  const rail = page.locator("#progress-rail");
  if ((await rail.count()) !== 1) {
    problems.push(`${tag}: expected exactly one progress rail inside the nav`);
  } else {
    const navContainsRail = await page.locator("header.nav #progress-rail").count();
    if (navContainsRail !== 1)
      problems.push(`${tag}: progress rail is not a child of the sticky header`);
    const holdMarkers = await page.locator(".route-progress-hold").count();
    if (holdMarkers !== 0)
      problems.push(`${tag}: obsolete yellow progress holds still render (${holdMarkers})`);
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

  // container-padding regression gate: navy-band headline content must share
  // the nav brand's left edge. (.hero/.page-head/.not-found sit on the same
  // element as .container — a restated padding SHORTHAND there zeroes the
  // container's horizontal padding and the band renders flush left.)
  const alignSel = {
    "/": ".hero .kicker",
    "/experience/": ".page-head h1",
    "/projects/": ".page-head h1",
    "/404.html": ".not-found h1",
  }[spec.path];
  if (alignSel) {
    const navAnchor = viewport.width <= 359 ? ".nav-tabs" : ".nav-brand";
    const brand = await page.locator(navAnchor).boundingBox();
    const band = await page.locator(alignSel).first().boundingBox();
    if (!brand || !band || Math.abs(brand.x - band.x) > 1)
      problems.push(
        `${tag}: ${alignSel} left edge (${band?.x}) != nav anchor left edge (${brand?.x}) — .container padding lost`,
      );
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

    const routeHolds = await page.locator(".climb-hold-route").count();
    const secondaryHolds = await page.locator(".climb-hold-off-route").count();
    if (routeHolds < 8 || secondaryHolds < 6)
      problems.push(`${tag}: climbing wall lacks a complete route (${routeHolds}/${secondaryHolds})`);
    for (const label of ["START", "TOP", "BOULDER / SET 01"])
      if (!(await page.locator(".climbing-route", { hasText: label }).count()))
        problems.push(`${tag}: climbing route label missing: ${label}`);
  }
  if (spec.path === "/experience/") {
    // timeline structural gate: 7 role cards; alternating L/R on desktop,
    // single left column on mobile; Community & Teaching label on the spine.
    const items = page.locator(".alt-timeline-item");
    if ((await items.count()) !== 7)
      problems.push(`${tag}: expected 7 timeline items, got ${await items.count()}`);
    // Each role shows its employer's logo: a real mark (img with alt) or a
    // lettermark tile (role="img" with aria-label). Expect 7 total.
    const roleLogos = page.locator('.role-logo img[alt], .role-logo-mark[role="img"]');
    if ((await roleLogos.count()) !== 7)
      problems.push(`${tag}: expected 7 role logos, got ${await roleLogos.count()}`);
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

  // footer contact links + mailto on every page
  for (const needle of ["github.com/iwang-1", "linkedin.com/in/ivanwang1"]) {
    const n = await page.locator(`footer a[href*="${needle}"]`).count();
    if (n === 0) problems.push(`${tag}: footer link missing: ${needle}`);
  }
  if ((await page.locator('a[href^="mailto:ivanwang8989@gmail.com"]').count()) === 0)
    problems.push(`${tag}: mailto link missing`);
  if ((await page.locator('a[href*="Ivan-Wang-Resume"], a[href$=".pdf"]').count()) !== 0)
    problems.push(`${tag}: public résumé/PDF link must not be present`);
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
