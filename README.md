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
npm run check      # fact/framing gate (also runs as prebuild)
npm run build      # tsc -b && vite build  → dist/
npm run verify     # serves dist/ + headless-Chromium smoke test + screenshots
npm run lint
```

`npm run verify` requires the Playwright Chromium browser
(`npx playwright install chromium` once, if it is not already cached). It
refreshes `docs/screenshot.png` and `docs/screenshot-mobile.png` from the
built site; the PNG bytes are not deterministic, so commit them when they
change meaningfully and otherwise `git checkout -- docs` to keep the tree
clean.

The publish script additionally runs a private pre-push scan (kept outside
this repo on purpose) before anything is pushed.

## Launch flags (`src/content.ts`)

Both flags are currently `true` (repos and the demo were verified live on
2026-07-13). Flip one back to `false` if the corresponding target ever goes
away — the site then renders plain text instead of dead links:

- `flags.repoLinksEnabled` — gates every `github.com/iwang-1/<repo>` link
  (project names, the classifier repo link, the site-source link).
- `flags.showLiveDemo` — gates the live-demo link to
  `https://iwang-1.github.io/star-catalog-web/`.

`npm run verify` reads the flags and asserts the matching link state either
way. Publish order: project repos → star-catalog-web Pages deploy → flip both
flags → push this site.

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

- [x] Fill `person.email` in `src/content.ts` (`ivanwang8989@gmail.com`).
- [x] Resume PDF at `public/Ivan-Wang-Resume.pdf`, linked via
      `person.resumeUrl` (Résumé button in the masthead + footer). Note: the
      PDF carries a phone number — replace the file to change what is public.
- [x] Experience/education/projects/leadership populated from the resume +
      LinkedIn (2026-07-13).
- [x] Publish the project repos, then flip `flags.repoLinksEnabled` and
      `flags.showLiveDemo` (verified live and flipped 2026-07-13).
- [ ] Publish this site: `bash ../publish-site.sh` (sibling of this repo —
      runs the private pre-push scan, creates the GitHub repo, pushes `main`,
      enables Pages, waits for the deploy, curl-checks the live URL).
