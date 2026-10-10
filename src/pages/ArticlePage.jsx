import PageHeader from '../components/PageHeader'
import ApprovedImage from '../components/ApprovedImage'
import { articles } from '../content/articles'
import { media } from '../content/media'
const ArticlePage = ({ article }) => <><PageHeader title={article.title} eyebrow={article.category + ' / General guide'} parent={{ name: 'Blog', href: '/blog.html' }} /><div className="section-shell article-layout">
  <aside className="article-sidebar"><p className="eyebrow">In this guide</p><nav aria-label="Article contents">{article.sections.map((section, index) => <a href={'#section-' + index} key={section.title}>{section.title}</a>)}</nav><a className="text-link" href="/blog.html">← All articles</a></aside>
  <article className="article-body"><p className="editorial-disclosure">General educational information. This is not a statement about Fresh Farm’s products, practices or visit policy.</p><ApprovedImage image={media[article.imageKey]} /><p className="article-lead">{article.intro}</p>{article.slug === "plan-a-produce-week" && <figure className="article-detail-photo"><ApprovedImage image={media.articlePlanningDetail} /><figcaption>A flowering herb with green and purple leaves. Ask about the exact type and intended use when choosing herbs.</figcaption></figure>}{article.sections.map((section, index) => <section id={'section-' + index} key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}<aside className="article-takeaway"><h2>Put the guide into practice</h2><p>{article.takeaway}</p></aside>
  <div className="article-next"><p className="eyebrow">Keep reading</p>{articles.filter(item => item.slug !== article.slug).map(item => <a href={item.href} className="text-link" key={item.slug}>{item.title} <span aria-hidden="true">→</span></a>)}</div></article>
</div></>
export default ArticlePage
