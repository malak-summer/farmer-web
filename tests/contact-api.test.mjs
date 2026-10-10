import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createContactHandler } from '../netlify/functions/contact.mjs'

// Synthetic fixtures only. All outbound requests are mocked; no mail is sent.
const env = {
  SITE_ORIGIN: 'https://farm.example', RESEND_API_KEY: 'test-only',
  CONTACT_FROM: 'website@farm.example', CONTACT_TO: 'owner@farm.example',
  CONTACT_RECEIPT_SECRET: 'test-only-signing-string-not-a-live-secret', TURNSTILE_SECRET_KEY: 'test-only',
}
const input = { name: 'Test Visitor', email: 'visitor@example.com', message: 'An enquiry', token: 'test-token' }
const request = (body, origin = env.SITE_ORIGIN) => new Request(`${env.SITE_ORIGIN}/api/contact`, {
  method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
})
function mockProvider(event = 'delivered') {
  const calls = []
  return {
    calls,
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      if (url.includes('siteverify')) return Response.json({ success: true, hostname: 'farm.example', action: 'contact' })
      if (options.method === 'POST') return Response.json({ id: 'test-email-id' })
      return Response.json({ last_event: event })
    },
  }
}

test('contact fails closed without configuration and rejects cross-origin or wrong methods', async () => {
  const missing = createContactHandler({ env: {}, fetchImpl: () => { throw new Error('Unexpected outbound request') } })
  assert.equal((await missing(request(input))).status, 503)
  const handler = createContactHandler({ env })
  assert.equal((await handler(request(input, 'https://other.example'))).status, 403)
  assert.equal((await handler(new Request('https://farm.example/api/contact'))).status, 405)
  for (const origin of ['https://farm.example/wrong-path', 'https://user:pass@farm.example', 'http://farm.example']) {
    assert.equal((await createContactHandler({ env: { ...env, SITE_ORIGIN: origin } })(request(input))).status, 503)
  }
})

test('validation, size limits, and honeypot reject bad input without sending', async () => {
  let outbound = 0
  const handler = createContactHandler({ env, fetchImpl: () => { outbound++; throw new Error('No send expected') } })
  for (const body of [null, [], { ...input, name: ' ' }, { ...input, name: 'Injected\nheader' }, { ...input, email: 'invalid' }, { ...input, message: ' ' }, { ...input, message: 'a'.repeat(5001) }, { ...input, website: 'spam' }, { ...input, token: '' }]) {
    assert.equal((await handler(request(body))).status, 400)
  }
  assert.equal((await handler(request({ message: 'a'.repeat(16001) }))).status, 413)
  assert.equal(outbound, 0)
})

test('failed or wrong-host security challenge never reaches email provider', async () => {
  for (const data of [{ success: false, 'error-codes': ['timeout-or-duplicate'] }, { success: true, hostname: 'other.example', action: 'contact' }, { success: true, hostname: 'farm.example', action: 'login' }]) {
    let calls = 0
    const handler = createContactHandler({ env, fetchImpl: async url => {
      calls++; assert.ok(url.includes('siteverify')); return Response.json(data)
    } })
    assert.equal((await handler(request(input))).status, 400)
    assert.equal(calls, 1)
  }
})

test('accepted email returns pending receipt, recipient fixed on server, retries idempotent', async () => {
  const provider = mockProvider()
  const handler = createContactHandler({ env, ...provider })
  const response = await handler(request({ ...input, to: 'attacker@example.com' }))
  assert.equal(response.status, 202)
  const data = await response.json()
  assert.equal(data.status, 'pending')
  assert.ok(data.receipt)
  const sent = JSON.parse(provider.calls[1].options.body)
  assert.deepEqual(sent.to, [env.CONTACT_TO])
  assert.equal(sent.from, env.CONTACT_FROM)
  assert.equal(sent.reply_to, input.email)
  assert.equal(sent.text, `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`)
  assert.equal(sent.html, undefined)
  await handler(request(input))
  assert.equal(provider.calls[1].options.headers['Idempotency-Key'], provider.calls[3].options.headers['Idempotency-Key'])
  const confirmed = await handler(request({ receipt: data.receipt }))
  assert.deepEqual(await confirmed.json(), { status: 'delivered' })
})

test('sent/delayed never count as delivered; bounce is a failure', async () => {
  for (const [event, expected] of [['sent', 'pending'], ['delivery_delayed', 'pending'], ['bounced', 'failed'], ['failed', 'failed'], ['suppressed', 'failed'], ['canceled', 'failed'], ['opened', 'pending'], ['clicked', 'pending'], ['unknown', 'pending']]) {
    const handler = createContactHandler({ env, ...mockProvider(event) })
    const accepted = await (await handler(request(input))).json()
    assert.deepEqual(await (await handler(request({ receipt: accepted.receipt }))).json(), { status: expected })
  }
})

test('tampered and expired receipts cannot retrieve provider email data', async () => {
  let time = 10000
  const provider = mockProvider()
  const handler = createContactHandler({ env, ...provider, now: () => time })
  const accepted = await (await handler(request(input))).json()
  assert.equal((await handler(request({ receipt: `${accepted.receipt}bad` }))).status, 403)
  assert.equal((await handler(request({ receipt: `${accepted.receipt.split('.')[0]}.${'é'.repeat(43)}` }))).status, 403)
  time += 86400001
  assert.equal((await handler(request({ receipt: accepted.receipt }))).status, 410)
  assert.equal(provider.calls.length, 2)
})

test('status lookup rejection and malformed provider status never imply delivery', async () => {
  for (const failure of [() => new Response('', { status: 403 }), () => Response.json({}), () => { throw new Error('Provider unavailable') }]) {
    const provider = mockProvider()
    const handler = createContactHandler({ env, fetchImpl: (url, options) => options.method === 'POST' ? provider.fetchImpl(url, options) : failure() })
    const accepted = await (await handler(request(input))).json()
    const response = await handler(request({ receipt: accepted.receipt }))
    assert.equal(response.status, 502)
    assert.ok((await response.json()).error)
  }
})

test('security service timeout fails closed before any email request', async () => {
  let calls = 0
  const handler = createContactHandler({ env, fetchImpl: async (url, options) => {
    calls++
    assert.ok(url.includes('siteverify'))
    assert.ok(options.signal instanceof AbortSignal)
    const error = new Error('Simulated timeout')
    error.name = 'TimeoutError'
    throw error
  } })
  assert.equal((await handler(request(input))).status, 502)
  assert.equal(calls, 1)
})

test('provider rejection, malformed response and timeout never return success', async () => {
  for (const fail of [async () => new Response('', { status: 429 }), async () => Response.json({}), async () => { throw new Error('Timeout') }]) {
    const handler = createContactHandler({ env, fetchImpl: (url, options) => url.includes('siteverify') ? Promise.resolve(Response.json({ success: true, hostname: 'farm.example', action: 'contact' })) : fail(url, options) })
    const response = await handler(request(input))
    assert.equal(response.status, 502)
    assert.ok((await response.json()).error)
  }
})

test('oversized streamed bodies are cancelled before parsing or provider calls', async () => {
  let cancelled = false
  const body = new globalThis.ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(16001)) },
    cancel() { cancelled = true },
  })
  const req = new Request('https://farm.example/api/contact', {
    method: 'POST', headers: { origin: env.SITE_ORIGIN, 'Content-Type': 'application/json' }, body, duplex: 'half',
  })
  const handler = createContactHandler({ env, fetchImpl: () => { throw new Error('Must not call provider') } })
  assert.equal((await handler(req)).status, 413)
  assert.equal(cancelled, true)
})
