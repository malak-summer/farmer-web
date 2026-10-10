# Fresh Farm

React 18 and Vite multi-page farm website, prepared for protected staging. This is an enquiry website, not an online store. Public launch remains blocked by client approval, live contact acceptance, browser QA and development-tool dependency findings.

## Run and verify

Node 22 is selected in .nvmrc and netlify.toml.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm test
npm run preview
```

Build before testing: the tests inspect dist and run HTTP production-preview checks. On Windows PowerShell, use npm.cmd if npm.ps1 is restricted. Vite preview serves static files only; it does not run the Netlify contact function.

## Pages and structure

Home, Shop, Categories, About Us, Blog and Contact each have their own HTML entry and page component. Two individual journal articles live under blog/. Unknown paths return 404.

- src/pages: page layouts and article rendering
- src/components: navigation, farmer logo, accessible images, catalogue and contact form
- src/content: business configuration, educational articles and approved image metadata
- src/services/contact.js: same-origin API transport
- src/styles: shared layout, responsive styles and editorial theme
- public/brand: farmer SVG variants, favicon and social card
- public/media: supplied photos and lossless optimized farmer image
- netlify/functions/contact.mjs: validated contact API using Resend and Turnstile
- scripts: domain-driven SEO build plugin and reproducible image optimization
- tests: backend, components, content, SEO, assets and HTTP route checks

## Content and identity

Fresh Farm is the confirmed name. The farmer logo replaces the former tree symbol. Actual catalogue products, public contact details and farm methods must be confirmed in src/content/farm.js. Until then, photo-based enquiry topics are explicitly labelled as a guide, not stock. Articles are general educational content, not claims about this farm. No cart, payment, account or subscription controls are published. Watermarked previews and local reference archives are excluded.

## Contact and configuration

Copy .env.example for local configuration; never commit real credentials. Only VITE_TURNSTILE_SITE_KEY is a public browser setting. PUBLIC_SITE_URL optionally generates canonical/OG/sitemap metadata from an approved HTTPS origin. Provider credentials and receipt secrets belong only in the Functions environment. Missing configuration fails closed; a pending email is never reported as delivered.

Netlify is the intended host: npm run build, publish dist, Functions under netlify/functions. No separate backend host or database is required. The /api/contact rewrite and real 404 routing are already configured. Keep HTML and header noindex until explicit public-launch approval. Use Netlify access protection for staging; noindex is not authentication.

## Current handoff

- [Staging deployment guide](STAGING_DEPLOYMENT_GUIDE.md): protected project creation, environment variables and real delivery test procedure.
- [Readiness report](DEPLOYMENT_READINESS_REPORT.md): verified results, changes and remaining risks.
- [Client launch requirements](CLIENT-LAUNCH-REQUIREMENTS.md) and [missing client information](CLIENT_INFORMATION_NEEDED.md).
- audit-current.json and audit-runtime.json: recorded dependency audit evidence. Nine development/build findings remain; production-only audit reports zero. These are recorded results, not a guarantee against future advisories.

No deployment has been performed. Local backups, generated dist and node_modules are excluded from version control; their local copies are preserved. Older commits may still contain previously tracked dependencies and unapproved preview assets; history has not been rewritten.
