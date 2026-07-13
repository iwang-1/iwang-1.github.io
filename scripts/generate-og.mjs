// Generates public/og.png — a 1200×630 branded card for summary_large_image
// social embeds: warm --bg background, IW keycap monogram, name, one-line
// role. Consistent with the site's "Workbench" tokens (src/styles/tokens.css).
//
//   node scripts/generate-og.mjs
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "og.png");

const html = `<!doctype html>
<html>
<head>
<style>
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    background: #FAF7F2;
    color: #201B16;
    font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card { display: flex; align-items: center; gap: 56px; padding: 0 80px; }
  .keycap {
    width: 220px; height: 220px; flex: none;
    background: #FFFFFF;
    border: 2px solid #E7E0D6;
    border-radius: 36px;
    box-shadow: 0 10px 0 #D6CFC3;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif;
    font-size: 96px; font-weight: 700; letter-spacing: -0.01em;
  }
  h1 {
    font-family: 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif;
    font-size: 88px; font-weight: 700; letter-spacing: -0.01em;
    margin: 0 0 20px;
  }
  p {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace;
    font-size: 30px; color: #5C544B; margin: 0;
  }
  .rule { width: 96px; height: 4px; background: #C2410C; border-radius: 2px; margin-bottom: 24px; }
</style>
</head>
<body>
  <div class="card">
    <div class="keycap">IW</div>
    <div>
      <h1>Ivan Wang</h1>
      <div class="rule"></div>
      <p>Software Engineer · UMD CS B.S./M.S. · AWS SDE Intern</p>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.waitForLoadState("networkidle");
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out} (1200x630)`);
