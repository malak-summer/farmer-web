import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import SecurityCheck from './SecurityCheck'
import { requestContact } from '../services/contact'

const Contact = ({ siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: ''
  })

  const [status, setStatus] = useState('')

  const [busy, setBusy] = useState(false)
  const sending = useRef(false)
  const [token, setToken] = useState('')
  const [receipt, setReceipt] = useState('')
  const [resetKey, setResetKey] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending.current) return
    if (!receipt && (!formData.name.trim() || !formData.message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))) {
      setStatus('Please enter your name, a valid email address, and a message using more than spaces.')
      return
    }
    if (!receipt && (!siteKey || !token)) {
      setStatus(siteKey ? 'Please complete the security check.' : 'Online contact is temporarily unavailable. Your input has been kept.')
      return
    }
    sending.current = true
    setBusy(true)
    setStatus(receipt ? 'Checking delivery status...' : 'Submitting your message...')
    try {
      const result = await requestContact(receipt ? { receipt } : { ...formData, token })
      if (result.status === 'delivered' && receipt) {
        setStatus("Your message was delivered to the farm's mail server. Thank you for getting in touch.")
      } else if (result.status === 'failed') {
        setStatus('Delivery failed. Your input is preserved. Please contact the farm by another confirmed channel.')
      } else if (result.status === 'pending' && (receipt || result.receipt)) {
        if (result.receipt) setReceipt(result.receipt)
        setStatus('Your message has been accepted for delivery, but delivery is not confirmed yet. Use Check delivery status in a moment. Your input is kept below.')
      } else throw new Error('The service returned an unexpected result. Delivery is not confirmed.')
    } catch (error) {
      setStatus(error.name === 'TimeoutError' || error.name === 'TypeError' ? 'The connection failed or timed out. Delivery is not confirmed. Your input has been kept; please try again later.' : error.message)
    } finally {
      if (!receipt) { setToken(''); setResetKey(value => value + 1) }
      setBusy(false)
      sending.current = false
    }
  }

  const updateField = (name, value) => {
    setStatus('')
    setReceipt('')
    setFormData(current => ({ ...current, [name]: value }))
  }

  return (
    <section id="contact" className="contact-section">
      <div className="section-shell">
        <div className="contact-layout">

          {/* Contact Info */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="contact-copy"
          >
            <p className="eyebrow">Get in touch</p><h2>
              Send your enquiry
            </h2>

            <div className="contact-intro">
              <p>For produce enquiries, include the item or variety, approximate quantity and preferred timing. If you can consider alternatives, let us know.</p>
              <p>For business enquiries, include your organisation and the purpose of your request. This form starts a discussion; it does not confirm an order or a service. Use an email address where you can receive a reply.</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="contact-copy"
          >
            <div className="contact-card">
              <form onSubmit={handleSubmit} aria-describedby="contact-form-note" aria-busy={busy} className="contact-form">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Leave this field blank</label>
                  <input id="contact-website" name="website" autoComplete="off" tabIndex={-1} value={formData.website} onChange={(e) => updateField('website', e.target.value)} />
                </div>
                <h3 className="form-heading">Your enquiry</h3><p id="contact-form-note" className="form-note">Your name, email and message will be shared with the farm to handle your enquiry. Please do not include sensitive information. Reloading this page clears your input.</p>
                {!siteKey && <p role="status" className="form-unavailable">Online contact is temporarily unavailable. Your input will stay on this page until you reload it.</p>}
                <div>
                  <label htmlFor="contact-name" >Full Name</label>
                  <input
                    type="text"
                    required
                    id="contact-name" name="name" maxLength={100} autoComplete="name" value={formData.name}
                    disabled={busy} onChange={(e) => updateField('name', e.target.value)}

                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" >Email</label>
                  <input
                    type="email"
                    required
                    id="contact-email" name="email" maxLength={254} autoComplete="email" value={formData.email}
                    disabled={busy} onChange={(e) => updateField('email', e.target.value)}

                    placeholder="visitor@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" >Message</label>
                  <textarea
                    rows="5"
                    required
                    id="contact-message" name="message" maxLength={5000}  value={formData.message}
                    disabled={busy} onChange={(e) => updateField('message', e.target.value)}

                    placeholder="Which produce or farm question can we help with?"
                  ></textarea>
                </div>

                <SecurityCheck siteKey={siteKey} onToken={setToken} resetKey={resetKey} />
                <p role="status" aria-live="polite" className="contact-status">{status}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" disabled={busy || (!siteKey && !receipt)}
                  className="button contact-submit"
                >
                  {busy ? 'Please wait...' : receipt ? 'Check delivery status' : 'Send message'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
