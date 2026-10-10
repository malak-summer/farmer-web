import { useState } from 'react'
import ProductCard from './ProductCard'
import { farmContent, getProduceItems } from '../content/farm'
const Products = ({ filterable = false }) => {
  const items = getProduceItems()
  const enquiryGuide = !farmContent.products.length
  const categories = [...new Set(items.map(product => product.category).filter(Boolean))]
  const requested = typeof window === 'undefined' ? '' : new globalThis.URLSearchParams(window.location.search).get('category')
  const [category, setCategory] = useState(categories.includes(requested) ? requested : '')
  const [query, setQuery] = useState('')
  const products = items.filter(product => !filterable || ((!category || product.category === category) && [product.name, product.description, product.category].join(' ').toLowerCase().includes(query.trim().toLowerCase())))
  return <section id="products" className="products-section section-space"><div className="section-shell"><div className="section-heading"><div><p className="eyebrow">Fresh Farm / Produce</p><h2>{enquiryGuide ? 'Find the right produce question' : 'Explore our produce'}</h2></div><a className="text-link" href="/contact.html">Ask about availability <span aria-hidden="true">→</span></a></div>
    <p className="catalogue-note">{enquiryGuide ? 'Use these photo-based examples to shape your enquiry. They are a produce guide, not a live stock list or confirmation that Fresh Farm grows or sells each item. ' : ''}Availability may vary by season. Contact Fresh Farm for current availability.</p>
    {filterable && categories.length > 0 && <div className="catalogue-filter"><div className="catalogue-field"><label htmlFor="produce-search">Search produce</label><input id="produce-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try apples or herbs" /></div><div className="catalogue-field"><label htmlFor="product-category">Produce category</label><select id="product-category" value={category} onChange={event => setCategory(event.target.value)}><option value="">All categories</option>{categories.map(name => <option key={name}>{name}</option>)}</select></div><p role="status" aria-live="polite">{products.length} {enquiryGuide ? (products.length === 1 ? 'enquiry topic' : 'enquiry topics') : (products.length === 1 ? 'product' : 'products')}</p></div>}
    {products.length === 0 && <div className="catalogue-empty"><h3>No matching produce</h3><p>Try a broader search or choose another category.</p><button type="button" className="button" onClick={() => { setQuery(''); setCategory('') }}>Clear filters</button></div>}<div className="product-grid">{products.map(product => <ProductCard key={product.name} {...product} enquiryGuide={enquiryGuide} />)}</div>
  </div></section>
}
export default Products
