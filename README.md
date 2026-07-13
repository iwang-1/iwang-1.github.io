# iwang-1.github.io

Ivan Wang's personal recruiting site — a single-page, dark "observing site"
ledger built with React + TypeScript + Vite and deployed to GitHub Pages at
<https://iwang-1.github.io/> (user site, so Vite `base: '/'`).

Every fact rendered on the page lives in one typed module,
[`src/content.ts`](src/content.ts), and is checked against the human checklist
in [`FACTS.md`](FACTS.md) by `scripts/check-facts.mjs` on every build.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run check      # fact/confidentiality gate (also runs as prebuild)
npm run build      # tsc -b && vite build  → dist/
npm run verify     # serves dist/ + headless-Chromium smoke test + screenshots
npm run lint
```

`npm run verify` requires the Playwright Chromium browser
(`npx playwright install chromium` once, if it is not already cached).

## Launch flags (`src/content.ts`)

- `flags.repoLinksEnabled` — `false` until the project repos are public. While
  false, project names and metric chips render as plain text: zero dead links.
- `flags.showLiveDemo` — `false` until the star-catalog-web Pages deploy is
  live at `https://iwang-1.github.io/star-catalog-web/`.

Publish order: project repos → star-catalog-web Pages deploy → flip both flags
→ push this site.

## Deploy

`.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on
every push to `main` (fact gate → build → `actions/deploy-pages`). One-time
repo setting: **Settings → Pages → Source = GitHub Actions** (the publish
script sets this via the API).

## Regenerating the masthead star band

`src/starfield-data.ts` is a committed, generated constant — the 150 brightest
stars of the HYG snapshot bundled with the sibling `star-catalog-web` repo. To
regenerate it (one-time dev task; CI never reads the sibling repo):

```bash
node scripts/generate-starfield.mjs [path/to/stars.json]
```

## Still to do (Ivan)

- [ ] Fill `person.email` in `src/content.ts` (the mail links render only once
      it is non-empty).
- [ ] Optionally add a resume PDF under `public/` and set `person.resumeUrl`.
- [ ] Paste any additional LinkedIn experience entries into the `experience`
      array in `src/content.ts`.
- [ ] Publish the project repos, then flip `flags.repoLinksEnabled` and
      `flags.showLiveDemo`.
- [ ] Publish this site: `bash ../publish-site.sh` (sibling of this repo —
      creates the GitHub repo, pushes `main`, enables Pages, waits for the
      deploy, curl-checks the live URL).
