> Repository update: node_modules has now been removed from the staging Git index without deleting local copies. Earlier tracked-dependency counts below describe the prior audit state.

# Fresh Farm — updated production readiness

Verdict: **NOT READY TO DEPLOY**. Repository hardening and automated verification have improved; real contact delivery, browser acceptance, client approval and outstanding development-tool advisories still prevent launch approval. Nothing was deployed and no live email was sent.

## Fixed issues

- Removed the unused @tailwindcss/typography plugin after confirming no prose classes are used. Generated CSS remains unchanged. No forced major upgrades or dependency overrides applied.
- Corrected development-only dependency classification; Sharp is a development tool. Runtime audit now reports zero findings. This is not a claim that all dependencies are vulnerability-free: full audit still reports nine.
- Server now reads contact bodies incrementally and cancels over 16,000 bytes, rather than buffering the entire incoming body first. Existing input validation, honeypot, origin checks, Turnstile hostname/action checks, fixed recipient, signed receipts and timeout/idempotency safeguards preserved.
- Malformed JSON, null or array responses produce clear delivery-not-confirmed feedback instead of raw parser errors. No fake success. Contact panels render visible immediately, avoiding initially hidden form content and entry movement for keyboard/reduced-motion users.
- Added PUBLIC_SITE_URL-driven canonical, og:url, og:image and sitemap generation. Invalid/non-HTTPS origins fail configuration; absent domain leaves canonical/sitemap absent rather than guessing. Every build emits robots.txt. All existing noindex tags remain; robots allows crawling so crawlers can read noindex.
- Generated and visually inspected a 1200x630 social card from the existing farmer SVG, preserving the identity. No invented business claims.
- Optimized farmer.jpg to lossless farmer.webp: 724,286 to 453,182 bytes (37.4% smaller). Decoded RGB buffers compare byte-for-byte equal, dimensions preserved. Original retained; active photo metadata uses WebP. Other photos are approximately 75–133 KB and were left unchanged. See image-optimization.json and reproducible scripts/optimize-images.mjs.
- Added X-Frame-Options DENY and Permissions-Policy disabling camera/microphone/geolocation; retained nosniff and referrer policy. Vite development/preview defaults now explicitly bind loopback. This reduces exposure, not a substitute for patching Vite.
- Extended route/asset tests for optimized photo, social card and robots, plus SEO validation, malformed contact responses and streamed-body cancellation.

## Investigation of all original ten dependency findings

Registry checks and compatible npm audit fix found no further in-range patches. Latest braces is 3.0.3 and remains affected. Latest Vite 5 is 5.4.21 and remains affected. PostCSS selector parser 7.1.6 fixes its advisory, but overriding dependencies that require parser 6 would be a major change; not forced.

| Affected package | Original severity | Exposure | Remediation/status |
|---|---|---|---|
| @tailwindcss/typography | Moderate | Build-only plugin; previously misclassified | Removed unused plugin; finding eliminated. |
| braces | High | Build/watch pattern parsing | No patched compatible release reported; migrate dependent toolchain with tests. |
| chokidar | High | Development file watcher, via braces | Requires parent-toolchain migration; retained. |
| fast-glob | High | Build file discovery, via micromatch | Requires upstream chain change; retained. |
| micromatch | High | Build pattern matching, via braces | No compatible chain fix reported; retained. |
| tailwindcss | High | CSS build/watch tool | npm proposes Tailwind 4; breaking migration deferred. |
| postcss-nested | Moderate | CSS build parser dependency | Parent/plugin-compatible parser fix unavailable; no forced parser override. |
| postcss-selector-parser | Moderate | CSS build parsing complexity | Fixed 7.1.6 is outside affected parser-6 dependencies; migration deferred. |
| esbuild | Moderate | Development server exposure | Fixed newer version outside Vite 5 dependency range; no override. |
| vite | High | Development server/Windows path handling | npm proposes Vite 8; breaking migration deferred. Default remains loopback-only. |

Final full audit: **9 findings: 6 high, 3 moderate** (audit-current.json). Final npm audit --omit=dev: **0** (audit-runtime.json). These tools are not executed by the static browser bundle or the Node-crypto-only contact function. Build/developer environments are still affected; avoid untrusted build inputs and exposed development servers. Do not treat classification changes as remediation of the nine remaining findings.

## Remaining code/repository issues

- The nine tooling advisories above need a dedicated, validated migration outside the no-breaking-upgrade constraint.
- Git still tracks approximately 9,926 dependency files despite node_modules ignore rules. No destructive untracking/reset performed; review a separate cleanup and clean-room install in CI.
- npm ls resolves required direct packages; Sharp installation exposed optional extraneous wasm/runtime packages. No missing required package was reported. A clean-room npm ci remains unverified.
- No responsive photo derivatives/CWV measurements; the largest active photo is now losslessly reduced. No redesign or quality-changing recompression was introduced.
- Manual browser/assistive-technology verification remains necessary. Current browser inventory returned no surfaces. No claim of all-width visual acceptance, tab favicon appearance, real keyboard traversal or console cleanliness.

## External configuration requirements

Use Node 22, npm ci from the reviewed lockfile, npm run lint, npm run build, npm test. Netlify publishes dist and bundles netlify/functions. No database required. Preserve /api/contact -> /.netlify/functions/contact, the eight-entry multi-page build and real HTTP 404 handling; no SPA catch-all rewrite.

| Variable | Scope | Required configuration |
|---|---|---|
| PUBLIC_SITE_URL | Build, public | Approved plain HTTPS origin only, no path/query/credentials; generates canonical/OG/sitemap. Leave empty until confirmed. |
| VITE_TURNSTILE_SITE_KEY | Build, public | Client widget for actual hostname. |
| SITE_ORIGIN | Functions | Exact same approved HTTPS origin; validates incoming Origin and challenge hostname. |
| RESEND_API_KEY | Functions secret | Client key allowed to send and retrieve status. |
| CONTACT_FROM | Functions | Verified plain sender address. |
| CONTACT_TO | Functions | Monitored real recipient address. |
| CONTACT_RECEIPT_SECRET | Functions secret | Random secret at least 32 characters. |
| TURNSTILE_SECRET_KEY | Functions secret | Matching widget secret. |

Do not put private values in VITE_ variables or source. Real provider/dashboard configuration was not accessed. No real domain is fabricated. After setting PUBLIC_SITE_URL, rebuild and inspect canonical/OG URLs and sitemap; noindex remains until separately approved. robots.txt intentionally permits crawling while meta noindex prevents indexing. Social-card absolute URL derives from the approved origin.

Verify sender DNS, HTTPS/domain configuration, Turnstile hostname, Netlify rate limits and actual response headers on a function-capable staging deployment. Vite preview cannot validate Netlify Functions. Send a client-authorized test enquiry, check intended inbox and Reply-To, confirm pending vs recipient-server-delivered status, and exercise challenge failure, timeout, bounce and retry without duplicate mail. No such live acceptance was performed here. No configured alternative public contact channel exists yet.

## Client approvals needed

Approve public products/availability and any prices, actual farm story/location/methods, public contact channels, privacy/legal operator details, images/releases and final farmer identity/copy. Current produce guide remains explicitly illustrative; no unconfirmed stock, delivery, ratings or certifications added. See CLIENT_INFORMATION_NEEDED.md and CLIENT-LAUNCH-REQUIREMENTS.md for detailed provider setup and missing facts.

## Tests actually executed

- npm audit fix --ignore-scripts: no additional compatible security updates; removed unused typography separately. Full and omit-dev audit results above.
- npm run lint: passed.
- npm run build: passed, eight HTML entries plus robots and assets. CSS 36.74 KB / 8.47 KB gzip; JS 293.38 KB / 94.44 KB gzip.
- Final npm test: 22 passed, zero failures and zero skips, including streamed-body cancellation and the new SEO/transport tests.
- Routes/navigation, menu open/close and Escape focus return, search/filter recovery, logo SVGs, image files, robots, social card and missing-path 404 checked by automated tests. Contact provider interactions use mocks only.
- Domain configuration tests use example.com solely as a test fixture; no fabricated domain written into the production output. Unit checks cover HTTPS/origin validation, generated home canonical/sitemap and preservation of noindex.
- Image RGB equality check passed; social-card raster visually inspected. Sharp emitted font-cache warnings but generated the inspected card successfully.
- Browser inventory empty: 1440, 1024, 768, 390 and 320px visual/keyboard/console checks not executed. Existing reduced-motion CSS and MotionConfig retained, form initial hidden state removed; no simulated claim of browser behavior.
- No TypeScript/typecheck script configured. No clean installation, live mail, hosting dashboard, DNS or deployed-header check claimed.

## Files changed

package.json, package-lock.json, tailwind.config.js, vite.config.js, .env.example, netlify.toml; netlify/functions/contact.mjs; src/services/contact.js, src/components/Contact.jsx, src/content/media.js; scripts/seo.mjs, scripts/optimize-images.mjs; public/media/farmer.webp, public/brand/social-card.png; tests/demo.test.mjs, tests/readiness.test.mjs, tests/contact-api.test.mjs; audit-current.json, audit-runtime.json, image-optimization.json and this report. Generated dist and installed development dependencies also changed. Existing logo SVGs, originals, page content and premium theme preserved.
