import ApprovedImage from './ApprovedImage'
import { farmContent, getProduceItems, categoryCopy } from '../content/farm'
const Categories = () => {
  const items = getProduceItems()
  const categories = [...new Set(items.map(product => product.category).filter(Boolean))]
  return <section id="categories" className="section-shell section-space"><div className="section-heading"><div><p className="eyebrow">Fruit, vegetables & herbs</p><h2>Choose a starting point</h2></div><a className="text-link" href="/shop.html">Browse the produce guide <span aria-hidden="true">→</span></a></div>
    {!farmContent.products.length && <p className="catalogue-note">These groups organize the produce shown in our enquiry guide. They do not confirm current stock or the farm’s crop list.</p>}
    <div className="topic-grid">{categories.map(category => {
      const image = farmContent.categoryImages[category] || items.find(item => item.category === category)?.image
      return <a className="topic-card" href={`/shop.html?category=${encodeURIComponent(category)}`} key={category}><div className="topic-illustration">{image?.approved ? <ApprovedImage image={image} /> : <span className="little-leaf" aria-hidden="true" />}</div><h3>{category}<span aria-hidden="true">→</span></h3><p>{categoryCopy[category] || 'Explore the relevant listings and send us your questions about availability.'}</p></a>
    })}</div>
  </section>
}
export default Categories
