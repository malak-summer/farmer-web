import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { act, create } from 'react-test-renderer'
import 'framer-motion'
import { createServer } from 'vite'
let server
let App, Products, Categories, Navbar, ApprovedImage, farmContent
const routes = ['/', '/shop.html', '/categories.html', '/about.html', '/blog.html', '/contact.html', '/blog/plan-a-produce-week.html', '/blog/before-a-farm-visit.html']
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false, preTransformRequests: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
  App = (await server.ssrLoadModule('/src/App.jsx')).default
  ApprovedImage = (await server.ssrLoadModule('/src/components/ApprovedImage.jsx')).default
  Products = (await server.ssrLoadModule('/src/components/Products.jsx')).default
  Categories = (await server.ssrLoadModule('/src/components/Categories.jsx')).default
  Navbar = (await server.ssrLoadModule('/src/components/Navbar.jsx')).default
  farmContent = (await server.ssrLoadModule('/src/content/farm.js')).farmContent
})
after(async () => { await server?.close() })

test('all eight pages retain honest content, valid links and accessible structure', () => {
  try {
    for (const pathname of routes) {
      globalThis.window = { location: { pathname, search: '' } }
      const html = renderToStaticMarkup(React.createElement(App))
      assert.match(html, /Fresh Farm/)
      assert.doesNotMatch(html, /lorem ipsum|\bTODO\b|coming soon|not published yet|not yet published|full story is not published/i)
      for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) assert.match(tag, /alt="[^"]+"/)
      const levels = [...html.matchAll(/<h([1-6])\b/g)].map(match => Number(match[1]))
      for (let index = 1; index < levels.length; index++) assert.ok(levels[index] <= levels[index - 1] + 1, `Heading level skipped on ${pathname}`)
      assert.doesNotMatch(html, /Rivora|demo|portfolio|fictional|FreshFarm|Carrots/i)
      assert.doesNotMatch(html, /Add to cart|Checkout|Subscribe|Sign in|100% organic|4\.8k|yourfarm|1234567890|hello@freshfarm|Sunny Valley|Since 1950/i)
      assert.doesNotMatch(html, /\/images\/|href="(?:tel:|mailto:|https?:)/)
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
      assert.equal(ids.length, new Set(ids).size, pathname)
      for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
        if (href.startsWith('#')) assert.ok(ids.includes(href.slice(1)), `Missing anchor ${href} on ${pathname}`)
        else assert.ok(routes.includes(href.split('?')[0]), `Unknown link ${href}`)
      }
      assert.equal((html.match(/<h1\b/g) || []).length, 1, pathname)
      assert.equal((html.match(/aria-current="page"/g) || []).length, 1)
      if (pathname === '/contact.html') {
        for (const field of ['name', 'email', 'message']) assert.ok(html.includes(`for="contact-${field}"`))
      } else assert.doesNotMatch(html, /<form\b/)
      if (pathname === '/shop.html') assert.match(html, /Online ordering is not currently available/)
      if (pathname === '/blog.html') assert.match(html, /General guides, not farm announcements/)
    }
    window.location.pathname = '/not-a-page'
    assert.match(renderToStaticMarkup(React.createElement(App)), /Page not found/)
  } finally { delete globalThis.window }
})

test('approved catalogue categories deep-link and filter products without purchase controls', () => {
  const original = farmContent.products
  let component
  try {
    // Test-only fixtures, never stored in public content or production assets.
    farmContent.products = [
      { name: 'Fixture One', description: 'First fixture', category: 'Group A' },
      { name: 'Fixture Two', description: 'Second fixture', category: 'Group B' },
    ]
    globalThis.window = { location: { search: '?category=Group%20B' } }
    const categories = renderToStaticMarkup(React.createElement(Categories))
    assert.match(categories, /\/shop.html\?category=Group%20B/)
    act(() => { component = create(React.createElement(Products, { filterable: true })) })
    assert.deepEqual(component.root.findAllByType('h3').map(node => node.children.join('')), ['Fixture Two'])
    act(() => component.root.findByType('select').props.onChange({ target: { value: '' } }))
    assert.equal(component.root.findAllByType('article').length, 2)
    assert.equal(component.root.findAllByType('button').length, 0)
  } finally { if (component) act(() => component.unmount()); farmContent.products = original; delete globalThis.window }
})

test('mobile navigation opens, closes on Escape with focus return, and closes on link selection', () => {
  let component, focused = false
  globalThis.window = { matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) }
  try {
    act(() => { component = create(React.createElement(Navbar), { createNodeMock: element => element.type === 'button' ? { focus: () => { focused = true } } : null }) })
    const button = () => component.root.findByType('button')
    act(() => button().props.onClick())
    assert.equal(button().props['aria-expanded'], true)
    assert.equal(component.root.findByProps({ id: 'mobile-menu' }).findAllByType('a').length, 6)
    act(() => component.root.findByType('nav').props.onKeyDown({ key: 'Escape' }))
    assert.equal(button().props['aria-expanded'], false)
    assert.equal(focused, true)
    act(() => button().props.onClick())
    act(() => component.root.findByProps({ id: 'mobile-menu' }).findAllByType('a')[1].props.onClick())
    assert.equal(button().props['aria-expanded'], false)
  } finally { if (component) act(() => component.unmount()); delete globalThis.window }
})



test('image rendering requires approval and accessible metadata; approved images retain sizing and loading hints', () => {
  const image = { src: '/media/test-only.webp', alt: 'Test-only image description', width: 1200, height: 800 }
  assert.equal(renderToStaticMarkup(React.createElement(ApprovedImage, { image })), '')
  assert.equal(renderToStaticMarkup(React.createElement(ApprovedImage, { image: { ...image, approved: true, alt: '' } })), '')
  const html = renderToStaticMarkup(React.createElement(ApprovedImage, { image: { ...image, approved: true } }))
  assert.match(html, /alt="Test-only image description"/)
  assert.match(html, /width="1200"/)
  assert.match(html, /height="800"/)
  assert.match(html, /loading="lazy"/)
  const hero = renderToStaticMarkup(React.createElement(ApprovedImage, { image: { ...image, approved: true }, priority: true }))
  assert.match(hero, /loading="eager"/)
})



test('photo-based enquiry guide fills produce pages without claiming confirmed stock', () => {
  let component
  globalThis.window = { location: { pathname: '/shop.html', search: '?category=Fruits' } }
  try {
    assert.equal(farmContent.products.length, 0, 'No confirmed products may be inferred from photos')
    const html = renderToStaticMarkup(React.createElement(App))
    assert.match(html, /not a live stock list/)
    assert.match(html, /Red apples/)
    assert.match(html, /Strawberries/)
    assert.doesNotMatch(html, /class="product-price"/)
    act(() => { component = create(React.createElement(Products, { filterable: true })) })
    assert.equal(component.root.findAllByType('article').length, 2)
    act(() => component.root.findByType('select').props.onChange({ target: { value: 'Herbs' } }))
    assert.equal(component.root.findAllByType('article').length, 1)
    assert.deepEqual(component.root.findAllByType('h3').map(node => node.children.join('')), ['Fresh herbs'])
  } finally { if (component) act(() => component.unmount()); delete globalThis.window }
})

 test('produce search combines with category selection and recovers from no results', () => {
  let component
  globalThis.window = { location: { search: '?category=Fruits' } }
  try {
    act(() => { component = create(React.createElement(Products, { filterable: true })) })
    const search = () => component.root.findByProps({ id: 'produce-search' })
    act(() => search().props.onChange({ target: { value: '  APPLES  ' } }))
    assert.deepEqual(component.root.findAllByType('h3').map(node => node.children.join('')), ['Red apples'])
    act(() => search().props.onChange({ target: { value: 'spinach' } }))
    assert.equal(component.root.findAllByType('article').length, 0)
    act(() => component.root.findByType('button').props.onClick())
    assert.equal(component.root.findAllByType('article').length, 5)
    assert.equal(search().props.value, '')
  } finally { if (component) act(() => component.unmount()); delete globalThis.window }
})
