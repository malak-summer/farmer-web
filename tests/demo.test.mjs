import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import React from 'react'
import { act, create } from 'react-test-renderer'
import 'framer-motion'
import { createServer, preview } from 'vite'

let server
let Contact
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false, preTransformRequests: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
  Contact = (await server.ssrLoadModule('/src/components/Contact.jsx')).default
})
after(async () => { await server?.close() })

test('contact preserves input for errors/pending and confirms only delivered status', async () => {
  let component
  act(() => { component = create(React.createElement(Contact, { siteKey: 'test-site-key' })) })
  const root = component.root
  const field = name => root.findByProps({ id: `contact-${name}` })
  const change = (name, value) => act(() => field(name).props.onChange({ target: { value } }))
  const challenge = () => act(() => root.find(node => node.type?.name === 'SecurityCheck').props.onToken('test-token'))
  const submit = () => act(async () => { await root.findByType('form').props.onSubmit({ preventDefault() {} }) })
  const status = () => root.findByProps({ 'aria-live': 'polite' }).children.join('')
  const originalFetch = globalThis.fetch
  let calls = 0
  globalThis.fetch = async () => { calls++; return Response.json({ error: 'Service unavailable' }, { status: 503 }) }
  try {
    change('name', '   '); change('email', 'visitor@example.com'); change('message', 'Test enquiry')
    await submit()
    assert.match(status(), /more than spaces/)
    assert.equal(calls, 0)
    change('name', 'Test Visitor'); change('email', 'invalid')
    await submit(); assert.equal(calls, 0)
    change('email', 'visitor@example.com'); challenge(); await submit()
    assert.match(status(), /Service unavailable/)
    assert.equal(field('message').props.value, 'Test enquiry')
    globalThis.fetch = async () => { throw new TypeError('offline') }
    challenge(); await submit(); assert.match(status(), /connection failed/)
    globalThis.fetch = async () => { const error = new Error('Simulated timeout'); error.name = 'TimeoutError'; throw error }
    challenge(); await submit(); assert.match(status(), /timed out/)
    globalThis.fetch = async () => new Response('Rate limited', { status: 429 })
    challenge(); await submit(); assert.match(status(), /wait a minute/)
    globalThis.fetch = async () => new Response('<html>Bad gateway</html>', { status: 502 })
    challenge(); await submit(); assert.match(status(), /temporarily unavailable/)
    globalThis.fetch = async () => Response.json({ status: 'delivered' })
    challenge(); await submit(); assert.match(status(), /unexpected result/)
    globalThis.fetch = async () => Response.json({ status: 'pending', receipt: 'test-receipt' }, { status: 202 })
    challenge(); await submit()
    assert.match(status(), /delivery is not confirmed/)
    assert.equal(field('email').props.value, 'visitor@example.com')
    globalThis.fetch = async (url, options) => {
      assert.equal(url, '/api/contact')
      assert.deepEqual(JSON.parse(options.body), { receipt: 'test-receipt' })
      return Response.json({ status: 'delivered' })
    }
    await submit(); assert.match(status(), /delivered to the farm/)
    assert.equal(field('message').props.value, 'Test enquiry')
    globalThis.fetch = async () => Response.json({ status: 'failed' })
    await submit(); assert.match(status(), /Delivery failed/)
    assert.equal(field('name').props.value, 'Test Visitor')
  } finally { globalThis.fetch = originalFetch; act(() => component.unmount()) }
})

test('unconfigured contact form is disabled and cannot submit', async () => {
  let component
  act(() => { component = create(React.createElement(Contact, { siteKey: '' })) })
  try {
    const root = component.root
    assert.equal(root.findByProps({ type: 'submit' }).props.disabled, true)
    const field = name => root.findByProps({ id: `contact-${name}` })
    for (const [name, value] of [['name', 'Visitor'], ['email', 'visitor@example.com'], ['message', 'Enquiry']]) {
      act(() => field(name).props.onChange({ target: { value } }))
    }
    await act(async () => { await root.findByType('form').props.onSubmit({ preventDefault() {} }) })
    assert.match(root.findByProps({ 'aria-live': 'polite' }).children.join(''), /temporarily unavailable/)
    assert.equal(field('message').props.value, 'Enquiry')
  } finally { act(() => component.unmount()) }
})

test('production output excludes all archived photos and includes Netlify error page', async () => {
  const output = await readdir('dist', { recursive: true })
  const approvedPhotos = ['apples', 'basil', 'spinach', 'strawberries', 'tomatoes', 'farmer'].map(name => `media/${name}.jpg`)
  const publishedPhotos = output.filter(path => /\.(jpe?g|png|webp|avif)$/i.test(path)).map(path => path.replaceAll('\\', '/'))
  assert.deepEqual(publishedPhotos.sort(), [...approvedPhotos, 'media/farmer.webp', 'brand/social-card.png'].sort())
  assert.ok(!output.some(path => path.includes('reference-images')), 'Archive must not be published')
  for (const path of output.filter(path => /\.(js|css|html)$/i.test(path))) {
    assert.doesNotMatch(await readFile(`dist/${path}`, 'utf8'), /\/images\/(farm|carrots|apples|basil|farmer|spinach|strawberries|tomatoes)\.jpg/)
    assert.doesNotMatch(await readFile(`dist/${path}`, 'utf8'), /RESEND_API_KEY|CONTACT_RECEIPT_SECRET|TURNSTILE_SECRET_KEY/)
  }
  const errorPage = await readFile('dist/404.html', 'utf8')
  assert.match(errorPage, /Page not found/)
  assert.match(errorPage, /href="\/"/)
  assert.match(errorPage, /noindex/)
  const config = await readFile('netlify.toml', 'utf8')
  for (const page of ['index', 'shop', 'categories', 'about', 'blog', 'contact', 'blog/plan-a-produce-week', 'blog/before-a-farm-visit']) {
    const html = await readFile(`dist/${page}.html`, 'utf8')
    assert.match(html, /<title>[^<]*Fresh Farm[^<]*<\/title>/)
    assert.match(html, /noindex, nofollow/)
    assert.match(html, /property="og:title"/)
    assert.match(html, /href="\/brand\/favicon.svg"/)
  }
  assert.match(config, /publish = "dist"/)
  assert.match(config, /X-Robots-Tag = "noindex, nofollow, noarchive"/)
  assert.match(config, /from = "\/api\/contact"/ )
  assert.doesNotMatch(config, /from = "\/\*"/)
})

test('production preview serves assets, reloads, and HTTP 404 for unknown paths', async () => {
  const site = await preview({ preview: { host: '127.0.0.1', port: 0 } })
  const base = `http://127.0.0.1:${site.httpServer.address().port}`
  try {
    const response = await fetch(base)
    assert.equal(response.status, 200)
    const html = await response.text()
    for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
      assert.equal((await fetch(base + asset)).status, 200)
    }
    for (const path of ['/', '/index.html', '/shop.html', '/categories.html', '/about.html', '/blog.html', '/contact.html', '/blog/plan-a-produce-week.html', '/blog/before-a-farm-visit.html', '/shop.html?category=Unknown', '/#contact', '/#products', '/404.html']) {
      assert.equal((await fetch(base + path)).status, 200)
    }
    for (const name of ['apples', 'basil', 'spinach', 'strawberries', 'tomatoes', 'farmer']) {
      assert.equal((await fetch(base + '/media/' + name + '.jpg')).status, 200)
    }
    for (const name of ['fresh-farm-light', 'fresh-farm-dark', 'fresh-farm-symbol-light', 'fresh-farm-symbol-dark', 'favicon']) {
      const response = await fetch(base + '/brand/' + name + '.svg')
      assert.equal(response.status, 200)
      assert.match(await response.text(), /<svg[\s>]/)
    }
    for (const path of ['/media/farmer.webp', '/brand/social-card.png', '/robots.txt']) assert.equal((await fetch(base + path)).status, 200)
    const excludedPhotos = ['farm', 'carrots', 'apples', 'basil', 'farmer', 'spinach', 'strawberries', 'tomatoes']
    for (const path of ['/unknown', '/nested/unknown', '/missing-image.jpg', ...excludedPhotos.map(name => `/images/${name}.jpg`), '/reference-images/farmer.jpg', '/design-reference.jpg']) {
      assert.equal((await fetch(base + path)).status, 404, path)
    }
  } finally { await new Promise(resolve => site.httpServer.close(resolve)) }
})
