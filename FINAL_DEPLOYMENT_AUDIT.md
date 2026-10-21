# Fresh Farm — final pre-deployment audit

Date: 2026-10-21.

**Staging verdict: READY FOR STAGING WITH CONDITIONS.**
**Public-launch verdict: NOT READY TO DEPLOY.**

A private initial staging build can be used for acceptance testing. Confirm platform access protection BEFORE importing/deploying; the repository itself does not authenticate visitors. Leave contact disabled until real credentials are configured, then test delivery. No deployment or live email occurred during this audit.

## Changes and attribution review

- README begins with the requested Fresh Farm heading and React/Tailwind/Framer Motion description.
- Footer now says: © 2026 Fresh Farm. All rights reserved.
- Searches across tracked application/docs/HTML and local non-dependency text found no unwanted tool-promotional credits to remove. No fictitious developer attribution added.
- React, Tailwind and Framer Motion license files were reviewed; their MIT copyright/permission notices were left intact. No dependency license, bundled legal comment, contractual photo requirement or image creator metadata was removed. Image provenance is not a website promotional badge.
- Compatible npm audit fix refreshed the lockfile/dependency layout. No major upgrade was forced. It did not resolve the remaining advisories.

## Inspection and functional evidence

React/Vite remains an eight-entry multi-page application: Home, Shop, Categories, About, Blog, Contact and two article pages. Shared navigation/footer and separate page/content/service/style files remain. The former tree glyph is absent from active page markup. Horizontal light/dark farmer SVGs, compact mobile symbol, favicon and raster social card remain connected to the site.

Shop is explicitly an enquiry guide, with search and category filtering; there is no fake checkout. Photos do not imply confirmed crop availability. Educational articles are distinguished from farm claims. No new factual business assertions were introduced. Existing automated rendered-content checks cover headings, links, placeholder patterns, image metadata and absence of fake sales controls. The gallery is static photography, not an unfinished interactive control.

Contact uses same-origin POST /api/contact and the Netlify function. Reviewed validation, bounded streaming body reads, origin checks, honeypot, Turnstile action/hostname verification, fixed recipient, signed expiring status receipts, idempotency and retained input. Provider-accepted means pending; only a retrieved delivered event means recipient-server acceptance. All provider tests use mocks. Real inbox receipt, real challenge completion and platform rate-limit enforcement remain unverified and block public launch.

## Security and dependencies

Refreshed audit-current.json: **9 findings (6 high, 3 moderate)**. Refreshed audit-runtime.json: **0 production-only findings**.

| Package(s) | Severity | Exposure and disposition |
|---|---|---|
| braces, chokidar, fast-glob, micromatch, tailwindcss | High | Pattern/glob processing in build/watch tooling; inherited chain findings. Compatible fix did not clear them. |
| vite | High | Development-server/Windows path-handling risks. Keep loopback-only; do not serve production through Vite dev/preview. |
| esbuild | Moderate | Development-server response exposure; transitive Vite dependency. |
| postcss-nested, postcss-selector-parser | Moderate | Build-time parsing complexity. Compatible range still affected. |

These tools do not run in the static site's browser runtime or the current contact function's Node crypto graph. They still affect builders/developers and untrusted build inputs. Use reviewed commits and isolate provider secrets from build scope. A separately validated Vite/Tailwind migration remains needed; zero production audit findings does not mean zero total risk.

Scoped application/public scans found zero common credential/private-key signatures. .env.example contains placeholders; no actual .env is tracked. No node_modules or dist files are tracked. This is not an exhaustive historical secret scan or verification of provider dashboards.

## SEO, branding, accessibility and performance

Unique page metadata, one H1/heading hierarchy and alt metadata are covered by automated checks. PUBLIC_SITE_URL validates a plain HTTPS origin and generates canonical/OG/sitemap only when configured. robots.txt is generated; HTML noindex and Netlify X-Robots-Tag are retained. No real domain or structured business facts fabricated.

Farmer photo remains the lossless WebP derivative; original is retained. Dimensions, lazy loading and eager hero loading remain. No external font requests. Social card and logo assets are covered by HTTP checks; previous raster inspection is not claimed as a new browser check. No Core Web Vitals or Lighthouse measurement was possible.

Browser inventory returned no apps/browsers. **All-page visual review at 1440, 1024, 768, 390 and 320px is UNVERIFIED.** So are real keyboard traversal, screen-reader output, image cropping in the browser, tab favicon appearance, console errors and small-size logo recognition. Source retains visible focus, skip link, reduced-motion CSS and MotionConfig; menu Escape/focus-return behavior is component-tested. No visual compliance claim is made.

## GitHub and deployment configuration

Remote verified: https://github.com/malak-summer/farmer-web.git. Branch: staging. Fetch before changes showed 0 ahead/0 behind origin/staging. Changes are committed only to staging after checks; no main merge or force push. Final push confirmation is recorded in the handoff. Current .gitignore excludes dependencies, build output, credentials, caches and local reference/backup archives. The older history is preserved.

Netlify settings: Node 22, build npm run build, output dist, Functions netlify/functions. /api/contact redirects to /.netlify/functions/contact. No SPA catch-all. Static responses retain noindex, nosniff, frame denial, referrer and permissions policies. Verify actual platform responses after staging exists. No separate backend hosting or database needed.

Required real contact variables: VITE_TURNSTILE_SITE_KEY (public build); SITE_ORIGIN, RESEND_API_KEY, CONTACT_FROM, CONTACT_TO, CONTACT_RECEIPT_SECRET, TURNSTILE_SECRET_KEY (Functions). PUBLIC_SITE_URL is optional for the initial private preview. Use the actual stable staging hostname for origin/widget validation. See STAGING_DEPLOYMENT_GUIDE.md for scopes, setup, provider acceptance and rollback steps.

## Remaining conditions and client inputs

1. Confirm private access protection for all deploy aliases, static assets and API routes before sharing staging. Noindex is not authentication.
2. Configure client-controlled Resend/Turnstile and perform authorized delivery acceptance, including failure/retry/status checks; retain disabled form until then.
3. Complete browser matrix and accessibility review on protected staging.
4. Approve actual products, contacts, location, farm methods, privacy/operator details, photo rights/releases and final copy/logo. No fabricated values replace missing data.
5. Review remaining build-tool risk and plan the compatible-tested migration before public release. Clean-install reproducibility remains a CI acceptance item.
6. Confirm public domain, update origins and approve removal of noindex only for a separately authorized public launch.

## Exact next action

In the client's Netlify team, confirm **Private for new projects** under Team settings → General → Visitor access → Default project visibility BEFORE importing the repository. Then import the staging branch as a dedicated protected staging project and verify protection for its main and preview deploys. On accounts with different access controls, use the equivalent all-deploy protection; do not publish unprotected as a workaround. No account settings were changed here.

## Executed checks

Final command outcomes are recorded below after completion. No tests involving live service delivery or browser visual acceptance are counted as passed.

- npm run lint: passed, zero warnings.
- npm run build: passed, 419 modules and eight HTML entries. CSS 36.74 KB / 8.47 KB gzip; JS 293.40 KB / 94.46 KB gzip.
- npm test: 22 passed, zero failed, zero skipped. Includes rendered pages, headings/links, category/search, menu, contact mocked integrations, production preview routes/assets/404 and SEO tests.
- npm audit fix --ignore-scripts: completed compatible dependency layout refresh; still reports nine findings. Full and omit-dev audits refreshed; 9 and 0 respectively. Audit nonzero vulnerability result is recorded, not treated as a clean pass.
- Git fetch: succeeded; no local/remote divergence before changes. No tracked node_modules/dist; only empty .env.example is tracked among environment files.
- Browser inventory: empty; all visual/mobile acceptance unverified. No live contact provider or hosting protection test executed.
