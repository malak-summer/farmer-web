import test from 'node:test'
import assert from 'node:assert/strict'
import { productionOrigin, seoPlugin } from '../scripts/seo.mjs'
import { requestContact } from '../src/services/contact.js'
test('SEO requires a real HTTPS origin and preserves noindex', () => {
  assert.equal(productionOrigin(), '')
  for (const value of ['http://example.com', 'https://example.com/path', 'https://user@example.com']) assert.throws(() => productionOrigin(value))
  const plugin = seoPlugin(productionOrigin('https://example.com/'), ['index', 'contact'])
  const html = plugin.transformIndexHtml('<meta name="robots" content="noindex, nofollow"></head>', { path: '/index.html' })
  assert.match(html, /noindex, nofollow/)
  assert.match(html, /canonical" href="https:\/\/example.com\/"/)
  const assets = []
  plugin.generateBundle.call({ emitFile: item => assets.push(item) })
  assert.match(assets.find(item => item.fileName === 'sitemap.xml').source, /contact.html/)
  assert.doesNotMatch(seoPlugin('', []).transformIndexHtml('</head>', { path: '/' }), /canonical/)
})
test('malformed contact payloads never become success or raw parser errors', async () => {
  const original = globalThis.fetch
  try {
    for (const body of ['null', '[]', '{invalid']) {
      globalThis.fetch = async () => new Response(body, { headers: { 'Content-Type': 'application/json' } })
      await assert.rejects(requestContact({}), /Delivery is not confirmed/)
    }
  } finally { globalThis.fetch = original }
})
