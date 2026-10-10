import PageHeader from '../components/PageHeader'
import ApprovedImage from '../components/ApprovedImage'
import { articles } from '../content/articles'
import { media } from '../content/media'
const BlogPage = () => <><PageHeader title="The Fresh Farm journal" eyebrow="Fresh Farm / Blog" description="Practical reading on planning with produce and approaching farm visits thoughtfully. Start with a useful question, a flexible plan and a little curiosity." />
  <section className="section-shell section-space"><p className="editorial-disclosure">General guides, not farm announcements. These articles do not describe Fresh Farm’s products, methods or visitor arrangements.</p><div className="article-grid">{articles.map((article, index) => <article className="article-card" key={article.slug}><a href={article.href} className="article-card-link">
    <div className={'article-art article-art-' + index}>{media[article.imageKey]?.approved ? <ApprovedImage image={media[article.imageKey]} /> : <div className="journal-art" aria-hidden="true"><span className="little-leaf" /><span /><span /><span /></div>}</div>
    <div className="article-card-copy"><p className="eyebrow">{article.category} · General guide</p><h2>{article.title}</h2><p>{article.summary}</p><span className="text-link">Read the guide <span aria-hidden="true">→</span></span></div>
  </a></article>)}</div></section></>
export default BlogPage
