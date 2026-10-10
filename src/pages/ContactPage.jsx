import PageHeader from '../components/PageHeader'
import Contact from '../components/Contact'
import { farmContent } from '../content/farm'
const ContactPage = () => <><PageHeader title="Contact Fresh Farm" eyebrow="Talk to Fresh Farm" description="Ask about produce availability, discuss a business requirement or send a question about the farm. Share the details that matter to you so the conversation starts in the right place." />
  {(farmContent.contact.email || farmContent.contact.phone || farmContent.contact.address) && <section className="section-shell contact-details" aria-label="Contact details">{farmContent.contact.email && <a href={'mailto:' + farmContent.contact.email}>{farmContent.contact.email}</a>}{farmContent.contact.phone && <a href={'tel:' + farmContent.contact.phone}>{farmContent.contact.phone}</a>}{farmContent.contact.address && <p>{farmContent.contact.address}</p>}</section>}
  <Contact />
</>
export default ContactPage
