import { createHmac, timingSafeEqual } from 'node:crypto'

const reply = (status, data) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
})
const sign = (value, secret) => createHmac('sha256', secret).update(value).digest('base64url')
const email = value => typeof value === 'string' && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value)

// Dependency injection permits tests without sending email or using real credentials.
export function createContactHandler({ env, fetchImpl = fetch, now = Date.now }) {
  return async request => {
    if (request.method !== 'POST') return reply(405, { error: 'Use POST.' })
    let site
    try {
      site = new URL(env.SITE_ORIGIN)
      if (site.username || site.password || site.pathname !== '/' || site.search || site.hash || (site.protocol !== 'https:' && !(site.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(site.hostname)))) throw new Error('Invalid site origin')
    } catch { return reply(503, { error: 'Contact is temporarily unavailable.' }) }
    if (request.headers.get('origin') !== site.origin) return reply(403, { error: 'Request not allowed.' })
    if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, { error: 'Use JSON.' })
    if (!env.RESEND_API_KEY || !email(env.CONTACT_FROM) || !email(env.CONTACT_TO) || !env.TURNSTILE_SECRET_KEY || env.CONTACT_RECEIPT_SECRET?.length < 32 || !env.CONTACT_RECEIPT_SECRET) {
      return reply(503, { error: 'Contact is temporarily unavailable. Your message has not been submitted.' })
    }
    let body
    try {
      const reader = request.body?.getReader()
      const chunks = []
      let size = 0
      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            size += value.byteLength
            if (size > 16000) { await reader.cancel(); return reply(413, { error: 'Message is too large.' }) }
            chunks.push(Buffer.from(value))
          }
        } finally { reader.releaseLock() }
      }
      const text = Buffer.concat(chunks).toString('utf8')
      if (Buffer.byteLength(text) > 16000) return reply(413, { error: 'Message is too large.' })
      body = JSON.parse(text)
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body')
    } catch { return reply(400, { error: 'Invalid request.' }) }
    const provider = (path, options = {}) => fetchImpl(`https://api.resend.com/emails${path}`, {
      ...options, headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', ...options.headers },
      signal: AbortSignal.timeout(8000),
    })
    try {
      if (body.receipt !== undefined) {
        if (typeof body.receipt !== 'string' || body.receipt.length > 1000) return reply(400, { error: 'Invalid delivery receipt.' })
        const [payload, signature, extra] = body.receipt.split('.')
        const expected = sign(payload || '', env.CONTACT_RECEIPT_SECRET)
        if (extra || !/^[A-Za-z0-9_-]{43}$/.test(signature || '') || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
          return reply(403, { error: 'Invalid delivery receipt.' })
        }
        let receipt
        try { receipt = JSON.parse(Buffer.from(payload, 'base64url').toString()) } catch { return reply(400, { error: 'Invalid delivery receipt.' }) }
        if (!/^[a-zA-Z0-9-]{1,100}$/.test(receipt.id) || !Number.isFinite(receipt.expires) || receipt.expires < now()) {
          return reply(410, { error: 'Delivery confirmation expired. Contact the farm before resubmitting to avoid duplicates.' })
        }
        const response = await provider(`/${encodeURIComponent(receipt.id)}`)
        if (!response.ok) return reply(502, { error: 'Delivery status is unavailable. Keep your message and check again.' })
        const data = await response.json()
        if (!data || typeof data.last_event !== 'string') return reply(502, { error: 'Delivery status could not be confirmed. Please check again later.' })
        // "sent" means handed off; only the provider's delivered event confirms recipient-server acceptance.
        const status = data.last_event === 'delivered' ? 'delivered' : ['bounced', 'failed', 'suppressed', 'canceled'].includes(data.last_event) ? 'failed' : 'pending'
        return reply(200, { status })
      }
      const { name, message, token, website } = body
      if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n\x00]/.test(name) || !email(body.email) || typeof message !== 'string' || !message.trim() || message.length > 5000 || message.includes('\0') || website) {
        return reply(400, { error: 'Enter a name, valid email address, and message within the stated limits.' })
      }
      if (typeof token !== 'string' || !token || token.length > 2048) return reply(400, { error: 'Complete the security check.' })
      const verification = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }), signal: AbortSignal.timeout(8000),
      })
      const challenge = verification.ok ? await verification.json() : null
      if (!challenge?.success || challenge.hostname !== site.hostname || challenge.action !== 'contact') {
        return reply(400, { error: 'Security check expired or failed. Please complete it again.' })
      }
      const outgoing = {
        from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: body.email.trim(),
        subject: 'Website enquiry', text: `Name: ${name.trim()}\nEmail: ${body.email.trim()}\n\n${message.trim()}`,
      }
      const response = await provider('', {
        method: 'POST', body: JSON.stringify(outgoing),
        headers: { 'Idempotency-Key': `contact-${sign(JSON.stringify(outgoing), env.CONTACT_RECEIPT_SECRET)}` },
      })
      if (!response.ok) return reply(502, { error: 'Submission could not be confirmed. Your input is preserved; please try again later.' })
      const data = await response.json()
      if (typeof data.id !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(data.id)) throw new Error('Missing provider receipt')
      const payload = Buffer.from(JSON.stringify({ id: data.id, expires: now() + 86400000 })).toString('base64url')
      return reply(202, { status: 'pending', receipt: `${payload}.${sign(payload, env.CONTACT_RECEIPT_SECRET)}` })
    } catch {
      return reply(502, { error: 'The service could not confirm the result. Your input is preserved. Please try again later.' })
    }
  }
}

export default request => createContactHandler({ env: process.env })(request)

export const config = {
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowLimit: 30, windowSize: 60 },
}
