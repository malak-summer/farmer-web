import { farmContent } from '../content/farm'
const Social = () => !farmContent.socialLinks.length ? null : <section id="social" className="section-shell social-section"><h2>Follow the farm</h2><div className="social-links">{farmContent.socialLinks.map(social => <a className="text-link" key={social.href} href={social.href} target="_blank" rel="noopener noreferrer">{social.name}<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a>)}</div></section>
export default Social
