import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary-brown to-primary-olive/90 text-cream py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-12 lg:mb-16">
          
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="text-3xl lg:text-4xl font-playfair font-bold mb-4 bg-gradient-to-r from-cream to-white bg-clip-text text-transparent">
              FreshFarm
            </div>
            <p className="text-cream/90 text-lg font-light leading-relaxed max-w-md mx-auto lg:mx-0">
              Bringing farm-fresh organic produce from our fields to your table, with love and tradition.
            </p>
          </motion.div>

          {/* Quick Links */}
          <div className="text-center lg:text-right">
            <h4 className="text-2xl font-bold font-playfair mb-8 text-cream bg-gradient-to-r from-cream/50 to-transparent bg-clip-text">
              Explore
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Products', href: '#products' },
                { name: 'About', href: '#about' },
                { name: 'Why Us', href: '#whyus' },
                { name: 'Contact', href: '#contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-cream/90 hover:text-cream transition-colors duration-300 font-medium hover:translate-x-2 transition-transform block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="text-center">
            <h4 className="text-2xl font-bold font-playfair mb-8 text-cream bg-gradient-to-r from-cream/50 to-transparent bg-clip-text">
              Stay Connected
            </h4>
            <div className="flex flex-wrap justify-center lg:justify-end space-x-6 lg:space-x-8 mb-6">
              {[
                { icon: '📸', label: 'Instagram', href: 'https://instagram.com/yourfarm' },
                { icon: '📘', label: 'Facebook', href: 'https://facebook.com/yourfarm' },
                { icon: '💬', label: 'WhatsApp', href: 'https://wa.me/1234567890' }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -5 }}
                  className="text-3xl p-3 bg-white/20 backdrop-blur rounded-2xl hover:bg-white/40 transition-all duration-300 text-cream hover:text-primary-brown"
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <p className="text-cream/80 text-sm">
              hello@freshfarm.com | +1 (234) 567-890
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/30 pt-8 mt-16">
          <div className="text-center text-cream/70 text-sm lg:text-base font-medium">
            © 2024 FreshFarm. All rights reserved. Made with ❤️ from our farm to your table.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

