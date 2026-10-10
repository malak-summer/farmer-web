import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CategoriesPage from './pages/CategoriesPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import ContactPage from './pages/ContactPage'
import ArticlePage from './pages/ArticlePage'
import { currentPage } from './content/navigation'
import { articles } from './content/articles'

const pageComponents = { home: HomePage, shop: ShopPage, categories: CategoriesPage, about: AboutPage, blog: BlogPage, contact: ContactPage }
function App() {
  const pathname = window.location.pathname
  const page = currentPage(pathname)
  const article = articles.find(item => item.href === pathname)
  const Page = pageComponents[page?.key]
  if (!Page && !article) return <main id="main" className="not-found section-shell"><h1>Page not found</h1><p>This page does not exist at Fresh Farm.</p><a href="/" className="button">Return home</a></main>
  return <MotionConfig reducedMotion="user"><div className="site-layout"><a href="#main" className="skip-link">Skip to content</a><Navbar activePage={article ? 'blog' : page.key} /><main id="main" tabIndex={-1}>{article ? <ArticlePage article={article} /> : <Page />}</main><Footer /></div></MotionConfig>
}
export default App
