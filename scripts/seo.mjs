// Public domain configuration only. Never consumes contact-provider secrets.
export function productionOrigin(value = '') {
  if (!value.trim()) return ''
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('PUBLIC_SITE_URL must be a plain HTTPS origin.')
  return url.origin
}
export function seoPlugin(origin, pages) {
  return {
    name: 'fresh-farm-production-seo',
    transformIndexHtml(html, context) {
      if (!origin) return html
      const route = context.path === '/index.html' ? '/' : context.path
      const canonical = new URL(route, origin).href
      const escaped = canonical.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
      return html.replace('</head>', `<link rel="canonical" href="${escaped}" />\n<meta property="og:url" content="${escaped}" />\n<meta property="og:image" content="${origin}/brand/social-card.png" />\n<meta property="og:image:alt" content="Fresh Farm farmer and field logo" />\n</head>`)
    },
    generateBundle() {
      // Do not disallow crawling: crawlers must be able to see the noindex tags.
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}` })
      if (origin) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${origin}${page === 'index' ? '/' : '/' + page + '.html'}</loc></url>`).join('')}</urlset>` })
    },
  }
}
