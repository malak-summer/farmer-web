> **Content update (2026-10-05):** All existing pages now have completed editorial copy. Shop uses an explicitly labelled enquiry guide until actual products are confirmed. See [DEPLOYMENT_READINESS_REPORT.md](DEPLOYMENT_READINESS_REPORT.md) for changes, passing checks and remaining launch blockers.

> **Photo update (2026-10-05):** Six user-supplied photos are now placed on the site; the two watermarked files remain excluded. See [CLIENT_INFORMATION_NEEDED.md](CLIENT_INFORMATION_NEEDED.md). Earlier photo-free statements below describe the previous version.

# Client information and access required before launch

The user confirmed the public business name **Fresh Farm** on 2026-09-27. It is now used in navigation, page titles, metadata and footer. The old sample products remain unapproved and unpublished. This draft must not be launched until the remaining items below are resolved.

## Business content to obtain

- Public trading name confirmed: Fresh Farm. Still required: legal operator name if different, approved logo and brand-use permission.
- Production domain and canonical URL; who controls its DNS and the Netlify site/team.
- Public address and map location **only if visitors should be directed there**; otherwise the approved service area. Whether visits are allowed, appointment requirements, opening hours and seasonal closures.
- Public telephone number in international format, whether calls/WhatsApp are accepted, public email if wanted, and the private recipient mailbox for enquiries. Do not assume these are the same inbox.
- Exact owned social profile URLs and confirmation that the client wants each linked. Leave omitted profiles unpublished.
- Actual product list: names/varieties, descriptions, seasonal availability, units/prices if shown, and whether each is produced on-site or sourced elsewhere. Confirm ordering, collection, delivery and payment arrangements before mentioning them.
- Approved farm/about text. Evidence and permission for any founding date, family history, named worker, organic certification, sustainability claim, delivery promise, testimonial or response-time promise.
- Client-approved contact/privacy notice: operator contact, purposes, retention period, who can access enquiries, and approval of the email/security providers. No marketing consent is inferred from a contact enquiry.
- Final approval of page titles, descriptions, selected photos, and public copy. Only then remove the temporary `noindex, nofollow` from all eight HTML entry pages.

Store approved public content in `src/content/farm.js` and update the metadata in all eight HTML entry pages. Its empty fields deliberately suppress unconfirmed names, products and social links. Product cards use approved `name`, `description`, optional `category`, `priceLabel` and approved `image` metadata; legacy `icon` and `tone` fields are not rendered by the text-first redesign. Social links use approved `name` and `href`; legacy decorative fields are optional and unused. Preserve the React/Vite component architecture and contact safeguards. Update contact details only after approval. See DEPLOYMENT_READINESS_REPORT.md for the current visual design and verification status.

## Contact delivery: Netlify Functions + Resend + Turnstile

No accounts were created and no message was sent during implementation. Supply account access through invitations or enter secrets directly in the provider/Netlify dashboards; do not paste credentials into source files or commit them.

1. Provide access to the intended Netlify project. `netlify.toml` publishes `dist`, packages `netlify/functions`, and rewrites only `/api/contact` to the contact function. Node 22 is selected. A static folder upload alone cannot provide the function; the eventual deployment must include the Netlify configuration/functions.
2. Use a client-owned Resend account. Verify the sending domain using the DNS records Resend supplies. Provide a sender mailbox/address on that verified domain and the recipient mailbox the client monitors.
3. Create/store a server-only Resend API key with permission to **send and retrieve sent emails** (a sending-only key cannot support the delivery-status lookup). Validate the selected key's permissions in that account before launch. Review account quotas and billing with the client.
4. Create a client-owned Cloudflare Turnstile widget for the actual website hostname(s). Set the public site key at build time and its secret only in Functions. Use matching hostname configuration; this function permits the single exact `SITE_ORIGIN` and validates the challenge's `contact` action and hostname. Separate staging environments need their own matching configuration.
5. Generate a strong random signing secret (at least 32 characters) in a password manager and put it only in the Functions environment. It signs short-lived delivery receipts; no user message or email address is included in the receipt. Do not reuse an unrelated credential.
6. Have the client configure retention/access for Resend logs and the receiving inbox, approve the published privacy wording, and test spam handling. The function declares a Netlify rate limit of 30 requests per 60 seconds grouped by IP/domain (including status checks). Verify that the selected Netlify plan enforces it and adjust only after agreeing expected traffic; local handler tests do not enforce platform limits. The security challenge is not a substitute for monitoring.

| Setting | Location | Required value |
| --- | --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Netlify build environment; intentionally public | Real widget site key |
| `SITE_ORIGIN` | Functions environment | Exact HTTPS origin, e.g. the client's scheme + hostname, without path |
| `RESEND_API_KEY` | Functions secret | Key permitted to send and retrieve email status |
| `CONTACT_FROM` | Functions environment | Plain verified sender email, not a display-name string |
| `CONTACT_TO` | Functions environment | One plain client recipient email |
| `CONTACT_RECEIPT_SECRET` | Functions secret | Random signing secret, at least 32 characters |
| `TURNSTILE_SECRET_KEY` | Functions secret | Secret for the matching widget |

`.env.example` contains empty variable names only. `.env` and `.env.*` are ignored except that example. Never prefix a private value with `VITE_`: those values are bundled for the browser. Restart/rebuild after changing build-time settings. Missing settings fail closed; the current unconfigured form cannot deliver.

The function uses a fixed server-side sender and recipient, puts the visitor's address in `reply_to`, and sends plain text. It validates input and the Turnstile response, checks the request origin, bounds payload size, times out provider requests, and does not log personal message content. No cross-origin CORS permission is enabled. Identical normalized submissions use an idempotency key to avoid duplicates on retries during Resend's 24-hour deduplication window.

An accepted email is shown as **pending**, not as delivered. The visitor can select **Check delivery status**; only Resend's `last_event: delivered` returns a delivery confirmation. This means acceptance by the recipient's mail server, not proof the farmer read it or that it landed outside spam. `sent`, `delivery_delayed`, `opened`, `clicked`, and unknown events remain pending; `bounced`, `failed`, `suppressed`, and `canceled` are failures. A malformed status response, timeout, or retrieval failure is an error, not evidence of either delivery or non-delivery. Keep open/click tracking disabled for this contact stream so later tracking events do not replace the delivered status. Receipts expire after 24 hours. All input remains on the page on pending, failure and success; reload clears it. Editing a field starts a new submission, so avoid editing/resubmitting a pending message solely to check its status.

References checked during implementation: [Resend send API](https://resend.com/docs/api-reference/emails/send-email), [retrieve API](https://resend.com/docs/api-reference/emails/retrieve-email), [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Netlify Functions API](https://docs.netlify.com/build/functions/api/).

## Required end-to-end delivery acceptance

With the client's configuration, use Netlify's function-capable local/staging environment and client-authorized test data. Submit one enquiry, verify it reaches the correct inbox, verify Reply targets the visitor, and observe the delivered status in both the provider and the form. Check invalid/expired security tokens, provider rejection, offline/timeout behavior and retained input. Verify no duplicate on an unchanged retry and no false success on a pending/bounced email. Verify the API key and private recipient are absent from browser assets. Live sending, DNS, real challenge completion and client mailbox receipt are launch blockers until this is done. Do not use a plain Vite preview to claim Functions are working.

## Photo permission inventory

The table below records the original permission audit. Six user-supplied images now appear publicly as documented in CLIENT_INFORMATION_NEEDED.md; the watermarked farm and carrot previews remain excluded. Final client rights confirmation and accurate business/product association are still required. Images alone do not establish the actual crop list.

| File | Former appearance | Permission/content confirmation needed before any reuse |
| --- | --- | --- |
| `farm.jpg` | Hero background | Watermarked stock preview: obtain a licensed, unwatermarked original and web/commercial-use permission. Confirm whether the scene may represent this farm. Never remove its watermark. |
| `carrots.jpg` | Carrot product card | Watermarked stock preview: licensed, unwatermarked original and web/commercial-use permission; confirm carrots are an actual approved product. |
| `farmer.jpg` | About panel | Photographer ownership/license covering commercial website use, crop/edit and attribution requirements; permission/release for the identifiable person where needed; accurate identity and relationship to this farm. |
| `apples.jpg` | Red apple card, previously mislabeled Golden Apples | Ownership/license and allowed crop/edit/attribution; confirmation of the actual apple product/variety. The image depicts red apples. |
| `basil.jpg` | Basil card | Ownership/license and crop/edit/attribution terms; confirm the depicted plant and actual product. |
| `spinach.jpg` | Spinach card | Ownership/license and crop/edit/attribution terms; confirm actual product and accurate depiction. |
| `strawberries.jpg` | Strawberry card | Ownership/license and crop/edit/attribution terms; confirm actual product and accurate depiction. |
| `tomatoes.jpg` | Tomato card | Ownership/license and crop/edit/attribution terms; confirm actual product and accurate depiction. |

For every approved photo obtain the source, owner/licensor, written permission or license receipt, permitted channels, duration/territory restrictions, attribution requirements, and confirmation that the client may authorize this site's use. Do not publish the reference archive itself.



## Page structure and optional services

Fresh Farm now has real static HTML entry pages: /, /shop.html, /categories.html, /about.html, /blog.html and /contact.html. Vite builds them using the existing React application. The API redirect, security headers and function configuration remain intact; no catch-all SPA redirect is used.

Shop is an availability/enquiry page, not a transactional store. Approved product entries use name, description and optional category; categories are derived from actual approved entries. Category links pass a query parameter to the working Shop filter. No sample entries are included in the public data. Blog contains two original general educational guides, each with an individual article page and clear separation from claims about Fresh Farm. Client editorial approval remains required. Home is intentionally concise; full catalogue and contact form appear only on their dedicated pages. No newsletter signup is published.

Before adding commerce, provide the actual catalogue/SKUs, variants, stock rules, prices/currency/taxes, order acceptance process, fulfilment zones and charges, collection arrangements, returns/refunds/cancellations policies and approved terms. Provide client-owned commerce/payment accounts via invitations and define who handles orders and support. Cart and checkout must be implemented and tested for stock, totals, payment success/failure, webhooks, refunds and confirmation before any purchase control is exposed. No such controls are currently published.

Accounts are omitted. Establish a real customer need, authentication provider, privacy/security rules, recovery and account deletion flows before implementing them. Newsletter signup is omitted until the client supplies the mailing-list provider/account, sender/domain, approved consent/privacy wording, double-opt-in decision, unsubscribe process and content plan, followed by end-to-end subscription/unsubscription testing. Never treat contact-form submissions as marketing consent.

For Blog, supply approved article text, titles, author attribution, accurate dates and licensed images. Two general guides have been drafted as requested; they carry no invented author identities or dates and make no claims about this farm. Review their copy before launch.

## Original photos to upload

- Hero: an original scene of the actual farm or harvest, ideally at least 2400 px wide, with room for responsive cropping. See PHOTO-REQUEST.md for all exact slots.
- Categories: one accurate, consistent square image per approved category, ideally at least 1000 x 1000 px.
- Products: one accurate square image per actual product/variety, ideally at least 1200 x 1200 px, showing the item customers would enquire about.
- Farm story: a landscape image of the real farm and/or its actual team, ideally at least 1800 px wide, with identity and person-release permission where needed.
- Blog: landscape originals illustrating each approved article, ideally at least 1600 px wide.

For each, provide source/photographer, written commercial-web permission or license receipt, permitted edits/crops, attribution and any release. These dimensions are preparation guidance, not proof of rights. Do not crop the flattened design reference into separate photo assets. The existing photo archive has no confirmed approval; farm.jpg and carrots.jpg are documented as watermarked previews and must not be reused. The design-reference.jpg file is visual guidance only and stays outside public/dist.


The code is now split into src/pages, src/components, src/content, src/services and src/styles. Business facts live in src/content/farm.js; the short home summary is distinct from the full story/methods/values. Photo slots are recorded in src/content/media.js and PHOTO-REQUEST.md. Two additional HTML entries are /blog/plan-a-produce-week.html and /blog/before-a-farm-visit.html. All eight pages retain noindex pending client approval and acceptance.
