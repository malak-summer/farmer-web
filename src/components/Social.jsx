import { motion } from 'framer-motion'

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/yourfarm',
    icon: '📸',
    color: 'from-pink-500 to-purple-500'
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/yourfarm',
    icon: '📘',
    color: 'from-blue-500 to-blue-700'
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/1234567890',
    icon: '💬',
    color: 'from-green-400 to-emerald-600'
  }
]

const Social = () => {
  return (
    <section id="social" className="py-32 bg-gradient-to-b from-primary-brown/5 to-primary-olive/5 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl lg:text-6xl font-playfair font-bold bg-gradient-to-r from-primary-terracotta via-primary-olive to-primary-brown bg-clip-text text-transparent mb-8 leading-tight">
            Follow Our Farm Journey
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-700 mb-16 lg:mb-20 font-light max-w-2xl mx-auto leading-relaxed">
            See behind-the-scenes of farm life, fresh harvest updates, 
            and seasonal specials every day.
          </p>

          {/* Social Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.05,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
                }}
                className="group relative block p-10 lg:p-12 rounded-3xl bg-white shadow-soft hover:shadow-[0_35px_70px_rgba(78,52,46,0.15)] backdrop-blur-sm border border-white/30 hover:border-primary-olive/50 transition-all duration-500 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`blob absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity w-full h-full rounded-3xl bg-gradient-to-r ${social.color}`} />
                
                {/* Icon */}
                <div className={`text-6xl lg:text-7xl mb-6 mx-auto transform group-hover:rotate-12 transition-transform duration-700`}>
                  {social.icon}
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-primary-brown mb-2 group-hover:text-primary-terracotta transition-colors font-playfair">
                    {social.name}
                  </h3>
                  <p className="text-gray-600 font-medium group-hover:text-primary-brown transition-colors">
                    Follow Now
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Social

