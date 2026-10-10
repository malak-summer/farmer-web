import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { productionOrigin, seoPlugin } from './scripts/seo.mjs'
const pages = ['index', 'shop', 'categories', 'about', 'blog', 'contact', 'blog/plan-a-produce-week', 'blog/before-a-farm-visit']
export default defineConfig(({ mode }) => {
  const origin = productionOrigin(loadEnv(mode, process.cwd(), 'PUBLIC_').PUBLIC_SITE_URL)
  return {
    appType: 'mpa',
    server: { host: '127.0.0.1' },
    preview: { host: '127.0.0.1' },
    plugins: [react(), seoPlugin(origin, pages)],
    build: { rollupOptions: { input: Object.fromEntries(pages.map(page => [page, fileURLToPath(new URL(`./${page}.html`, import.meta.url))])) } },
  }
})
