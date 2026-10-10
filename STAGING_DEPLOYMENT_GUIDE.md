> Repository update: node_modules has now been removed from the staging Git index without deleting local copies. Earlier tracked-dependency counts below describe the prior audit state.

# Fresh Farm — first protected staging deployment

Status: repository prepared for a controlled staging trial, **not approved for public launch**. No deployment, domain purchase or live provider verification was performed.

## Provider and architecture

**Use Netlify**, preferably a dedicated client-owned staging project. This is the closest fit to the actual repository:

- React 18 / Vite 5 builds eight separate HTML entries with normal links, not an SPA catch-all.
- `src/services/contact.js` POSTs to same-origin `/api/contact`.
- `netlify.toml` rewrites that endpoint to `/.netlify/functions/contact`.
- `netlify/functions/contact.mjs` is already a Netlify serverless handler with Netlify rate-limit configuration. It validates requests, calls Turnstile and sends/checks email through Resend.
- **No separate backend host or database is required.** Netlify serves the frontend and function together. Resend and Cloudflare Turnstile remain external service accounts.
- Vercel or Cloudflare Pages could serve the frontend but would require adapting the function, routing and platform rate-limit configuration. There is no benefit to that migration for this first staging pass.

Use one stable staging hostname, not changing preview URLs, for delivery acceptance: the function checks one exact SITE_ORIGIN and challenge hostname. A dedicated staging project's main deploy is called the **Production context by Netlify**, even though it is only staging for this client. Keep that context private too.

## Prepared hosting files and exact settings

| Setting | Value |
|---|---|
| Repository base directory | Directory containing package.json and netlify.toml; blank if repository root |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |
| Node | `22` in netlify.toml and new .nvmrc |
| Local verification | `npm run lint`, `npm run build`, then `npm test` |
| Dependency installation | Netlify installs from package-lock.json; verify install logs. For clean local/CI verification use `npm ci`. Build dependencies must be installed. |

netlify.toml already contains the API rewrite and security headers. This pass adds `X-Robots-Tag: noindex, nofollow, noarchive` for static responses. Existing HTML noindex/nofollow and 404 noindex remain. Do not add an SPA rewrite. Do not deploy by uploading dist alone: that omits the contact function.

The robots file deliberately allows crawling so crawlers can see noindex. **Neither robots nor noindex is access protection.** The headers apply according to Netlify's static header processing; verify API responses independently, rather than assuming static rules cover Functions.

## Protect access before the first deployment

First, as the client's Netlify Team Owner, go to **Team settings > General > Visitor access > Default project visibility**, and select **Private for new projects**. This prevents the initial repository-import deploy from becoming public. Then verify the new project's **Project configuration > General > Visitor access > Project visibility** protects **production and previews**, not previews alone.

Current credit-based plans support private visibility; Free/Personal restrict viewing to the owner, while Pro supports additional reviewers/team members. Shared-password protection requires a supporting plan. Legacy/Enterprise UI differs: use its equivalent all-deploy password/team-login protection. Check actual account capability; do not buy anything automatically or publish unprotected as a workaround.

Official sources: [project visibility](https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/) and [password protection](https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/). Access policy is an account setting, not a secret to commit to netlify.toml. No application password wall was added.

## Environment variables

Enter values in the **staging project** dashboard. Limit credentials to the context used for this trusted staging project; do not expose them to arbitrary pull-request/Deploy Preview builds. Scope secrets to Functions, not Builds. If the selected plan does not permit scope controls, understand that all-scope secrets are available to builds: allow only trusted branches/build code and restrict project access.

| Variable | Needed for | Scope | Value to supply |
|---|---|---|---|
| VITE_TURNSTILE_SITE_KEY | Enabled contact UI | Builds, intentionally public | Real widget site key for stable staging hostname |
| SITE_ORIGIN | API origin and hostname validation | Functions | Exact HTTPS staging origin, no path/query/credentials |
| RESEND_API_KEY | Sending and retrieving status | Functions, secret | Staging/client key authorized for both operations |
| CONTACT_FROM | Sender | Functions | Plain email on the verified sending domain |
| CONTACT_TO | Destination | Functions | Monitored, authorized staging test inbox |
| CONTACT_RECEIPT_SECRET | Signing delivery receipts | Functions, secret | Unique random secret at least 32 characters |
| TURNSTILE_SECRET_KEY | Server challenge validation | Functions, secret | Secret matching staging widget |
| PUBLIC_SITE_URL | Optional canonical/OG/sitemap test | Builds, public | Leave blank initially; optionally use the actual stable staging HTTPS origin to test generation. Do not guess a future public domain. |
| NODE_VERSION | Build runtime | Already in netlify.toml | 22; no separate secret |

`PUBLIC_SITE_URL` is optional; the seven contact variables above are required for real delivery testing. Setting PUBLIC_SITE_URL does not remove noindex. Private values must never use a VITE_ prefix. NODE_ENV must not be set to omit development dependencies during installation.

Function environment variables must be supplied through Netlify UI/CLI/API, not netlify.toml. Redeploy after configuration changes so the build and Functions use the intended values. References: [Functions environment variables](https://docs.netlify.com/build/functions/environment-variables/) and [scopes and deploy contexts](https://docs.netlify.com/build/environment-variables/overview/).

## Contact service setup

1. Use client-controlled Resend and Turnstile accounts with a separate staging recipient and signing secret where possible.
2. Verify a sender domain/subdomain the client already controls in Resend. DNS access is needed; a new domain need not be purchased. If none is available, real external delivery remains blocked—do not pretend it works.
3. Select an authorized inbox and confirm who will check it. Configure the sender and recipient only server-side. Validate key permissions for sending **and retrieving** email status.
4. Create a Turnstile widget allowing the exact stable staging hostname. The browser sets action `contact`; the server checks action and hostname. Provider test keys may exercise integration mechanics but do not establish real anti-spam acceptance.
5. Configure the variables, rebuild/redeploy the staging project and inspect function logs for errors without logging message bodies or secrets. Verify platform rate limiting is available/enforced for this project.
6. Keep email tracking disabled for this stream as described in CLIENT-LAUNCH-REQUIREMENTS.md. The implementation treats only the provider's delivered event as recipient-server acceptance, not proof of reading or inbox placement.

## Step-by-step deployment — actions for the owner, not executed here

1. **Set private-by-default for new projects first**, as described above. Confirm plan/reviewer access before importing the repository.
2. Review and push the prepared code to a client-controlled repository. Never include real .env files. Existing tracked node_modules are repository debt: arrange a reviewed index cleanup and verify clean install; do not manually delete client work to get a deployment through.
3. Import the repository into a dedicated Netlify staging project. Confirm repository base, Node 22, command `npm run build`, publish `dist` and Functions directory. Use a trusted branch; keep untrusted previews without secrets.
4. Leave initial contact variables absent if the final staging hostname is not known yet. The private initial build will show the honest unavailable form. After creation choose/record a stable Netlify-provided HTTPS hostname. No domain purchase is needed.
5. Confirm this project is private for both main and preview deploys. Open the hostname in a signed-out/incognito window: access must be denied/login-gated before any review links are shared. Check static assets, `/api/contact`, direct `/.netlify/functions/contact` and deploy-specific aliases too. Fail closed if protection is not effective.
6. Configure the service accounts and environment variables for that hostname. Add PUBLIC_SITE_URL only when intentionally testing its domain-driven metadata. Redeploy from the trusted branch; do not reuse a deploy URL with a different origin for email testing.
7. Verify deploy logs show eight HTML entries and packaged contact function. Confirm unknown paths return HTTP 404. Confirm logged-in browser requests to /api/contact are routed to the function, not HTML.
8. Run the contact acceptance below, then the browser matrix. Keep the project private. Roll back to a known-good deploy if needed; if sending is unsafe or misconfigured, disable the staging contact configuration until corrected.
9. Record results and obtain client sign-off. Public release is a separate decision: remove meta/header noindex only then, set the real public origin, and reconfigure public hostname/provider settings before launch.

Private access does not prevent this design's server-to-server outbound Resend/Turnstile requests. It needs no inbound webhook for delivery status. Authenticated-browser operation and provider calls still require real acceptance testing.

## Real contact acceptance record

Use authorized synthetic test content and an inbox you control. Never paste API keys into a browser console or report.

| Check | Expected result | Record |
|---|---|---|
| Blank/space-only name, bad email, blank/overlong message | Rejected; no mail sent | Pending |
| Valid fields, absent/expired challenge | No provider send; useful error | Pending |
| Valid submission after real challenge | API returns pending, not fake delivered | Pending |
| Intended inbox + provider event | Correct recipient/sender; Reply-To is test visitor | Pending |
| Check delivery status | Delivered only after provider confirmation; input retained | Pending |
| Unchanged retry | No duplicate within provider idempotency window | Pending |
| Offline/timeout/provider failure | Delivery unconfirmed, input retained | Pending |
| Failed/bounced event using approved test mechanism | Failure, never success | Pending |
| Authenticated API vs signed-out API | Works for reviewer; access protection blocks outsiders | Pending |

Record timestamp, deploy ID, provider message ID and result; exclude secrets and personal message bodies. Existing automated mocked tests are not evidence of real inbox delivery. Contact input is held in page memory and clears on reload; warn testers before refreshing.

## Browser matrix

Test `/`, `/shop.html`, `/categories.html`, `/about.html`, `/blog.html`, `/contact.html`, `/blog/plan-a-produce-week.html`, `/blog/before-a-farm-visit.html`, plus 404 recovery, at **1440, 1024, 768, 390 and 320px**.

- No overflow or clipped controls; readable text and expected photo crops.
- Header horizontal/mobile symbol, dark footer logo, favicon and social card load.
- Navigation, article anchors, search/category combinations, no-results reset and contact links work.
- Keyboard-only: skip link, visible focus, menu toggle/Escape focus return, labels and form status feedback. Repeat with reduced motion enabled.
- Real Turnstile fits small screens and completes while logged in to staging protection.
- No console errors, failed assets or API requests; inspect missing-route status and noindex/header behavior.
- Test mobile browser and desktop browser; assess contrast and screen-reader labels. Record browser/version and screenshots. No browser results are claimed here.

## Nine development/build findings

Reviewed the existing machine-readable audits; no fresh registry audit was required for this staging-only preparation. Recorded full audit: six high, three moderate. Production-only audit: zero.

| Packages | Severity | Practical risk |
|---|---|---|
| braces, chokidar, fast-glob, micromatch, tailwindcss | High | Build/watch file-pattern processing, potential exhaustion through malicious inputs; several are inherited dependency findings. |
| vite | High | Development-server/path handling exposure, including Windows cases. Do not expose Vite dev/preview servers. |
| esbuild | Moderate | Development-server request/response exposure. |
| postcss-nested, postcss-selector-parser | Moderate | Build-time CSS parsing complexity/denial of service. |

These are not part of the deployed static application runtime or the current contact function's Node crypto dependency graph. Netlify's isolated build still executes build tools: approve the commit, avoid untrusted build input and keep Function secrets out of build scope. The nine findings are not fixed by hosting or access protection. Compatible fixes were exhausted in the previous pass; major migrations remain separate tested work. Review the risk before staging; no claim of zero total vulnerabilities.

## Secrets and verification boundaries

A scoped source/public secret-signature scan found zero common embedded-key/private-key matches. Build regression tests check that server secret variable names do not appear in browser output. Configuration contains empty placeholders, not credential values. Only the Turnstile public site key and optional public domain should enter browser metadata/bundles. This is not a Git-history audit or inspection of external dashboards, and cannot prove that external credentials have never been exposed.

This pass changes only netlify.toml (staging noindex header), .nvmrc, a configuration assertion in tests/demo.test.mjs and this guide. Existing frontend design, logo, API behavior and routing are preserved.

## Results and remaining gates

Build/lint/test results are recorded below after execution. No hosting account was accessed and no domain was purchased.

Before a protected staging trial: confirm access controls, trusted branch/build and account access. Before real delivery acceptance: configure providers/variables and monitored inbox. Before public launch: complete live delivery and browser matrix, approve client facts/photos/privacy, resolve or explicitly review tooling risks and repository cleanup, configure public domain, and approve removal of noindex. Public launch is not authorized by this guide.

### Executed checks for this staging preparation

- `npm run lint`: passed, zero warnings.
- `npm run build`: passed, eight HTML entries plus robots/assets; CSS 36.74 KB (8.47 KB gzip), JS 293.38 KB (94.44 KB gzip).
- `npm test`: **22 passed, 0 failed, 0 skipped**. Includes the staging-header assertion, production HTTP routes/assets/404, logo files, contact mocks, filters and navigation behavior.
- Scoped secret-signature scan: zero matches; no secret values printed. Tests verified no server secret identifiers in generated browser assets.
- Build/tests executed with elevated filesystem access because this environment's Vite configuration loader requires it. No deployment executed.
- Netlify access protection, headers, rate limiting, environment injection, real Turnstile, real Resend delivery and browser matrix: **not verified** until protected staging exists.
