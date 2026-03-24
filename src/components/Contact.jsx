import { motion } from 'framer-motion'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    alert('Thank you for your message! We\'ll get back to you soon. 🌱')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="py-32 bg-gradient-to-b from-cream/90 to-white relative">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h2 className="text-4xl lg:text-6xl font-playfair font-bold bg-gradient-to-r from-primary-brown to-primary-terracotta bg-clip-text text-transparent mb-12 leading-tight">
              Get In Touch
            </h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-4 p-6 bg-white/70 backdrop-blur rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-olive to-primary-terracotta rounded-xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 mt-1">
                  📍
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-primary-brown mb-1">Visit Us</h4>
                  <p className="text-gray-600">Sunny Valley Farm<br/>Green Hills, CA 90210</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white/70 backdrop-blur rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-terracotta to-primary-brown rounded-xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 mt-1">
                  📞
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-primary-brown mb-1">Call Us</h4>
                  <p className="text-gray-600">
                    <a href="tel:+1234567890" className="hover:text-primary-terracotta transition-colors">+1 (234) 567-890</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white/70 backdrop-blur rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-brown to-primary-olive rounded-xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 mt-1">
                  ✉️
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-primary-brown mb-1">Email</h4>
                  <p className="text-gray-600">
                    <a href="mailto:hello@freshfarm.com" className="hover:text-primary-terracotta transition-colors">
                      hello@freshfarm.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-10 lg:p-12 shadow-2xl border border-white/40 hover:shadow-hover transition-all duration-500">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-primary-brown mb-3">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-5 lg:p-6 rounded-2xl border-2 border-primary-cream/50 bg-white/50 backdrop-blur-sm focus:border-primary-olive focus:outline-none focus:ring-4 focus:ring-primary-olive/20 transition-all duration-300 text-lg placeholder-gray-500"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-primary-brown mb-3">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-5 lg:p-6 rounded-2xl border-2 border-primary-cream/50 bg-white/50 backdrop-blur-sm focus:border-primary-olive focus:outline-none focus:ring-4 focus:ring-primary-olive/20 transition-all duration-300 text-lg placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-primary-brown mb-3">Message</label>
                  <textarea
                    rows="5"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-5 lg:p-6 rounded-2xl border-2 border-primary-cream/50 bg-white/50 backdrop-blur-sm focus:border-primary-olive focus:outline-none focus:ring-4 focus:ring-primary-olive/20 transition-all duration-300 text-lg resize-vertical placeholder-gray-500"
                    placeholder="Tell us about your inquiry..."
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-brown via-primary-terracotta to-primary-olive text-cream py-6 lg:py-7 rounded-2xl text-xl lg:text-2xl font-semibold shadow-2xl hover:shadow-[0_20px_40px_rgba(78,52,46,0.3)] transition-all duration-300 font-inter tracking-wide uppercase"
                >
                  Send Message
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

