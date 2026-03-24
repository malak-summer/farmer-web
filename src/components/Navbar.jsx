import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-cream/95 backdrop-blur-md shadow-soft py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-2xl lg:text-3xl font-playfair font-bold bg-gradient-to-r from-primary-brown to-primary-terracotta bg-clip-text text-transparent"
          >
            FreshFarm
          </motion.div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-8 text-lg font-medium">
            {[
              { name: 'Home', href: '#hero' },
              { name: 'About', href: '#about' },
              { name: 'Products', href: '#products' },
              { name: 'Why Us', href: '#whyus' },
              { name: 'Contact', href: '#contact' }
            ].map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href}
                  className="relative group text-gray-700 hover:text-primary-brown transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary-brown after:to-primary-terracotta after:transition-all after:duration-300 group-hover:after:w-full"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden z-50 p-2 relative"
onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 my-1 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
{isMenuOpen && (
          <motion.ul 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="lg:hidden absolute top-full left-0 right-0 bg-cream/95 backdrop-blur-md shadow-soft py-6 px-6 border-t border-primary-olive"
          >
            {[
              { name: 'Home', href: '#hero' },
              { name: 'About', href: '#about' },
              { name: 'Products', href: '#products' },
              { name: 'Why Us', href: '#whyus' },
              { name: 'Contact', href: '#contact' }
            ].map((item, index) => (
              <li key={item.name} className="py-2">
                <a 
                  href={item.href}
                  className="block text-xl font-medium text-gray-700 hover:text-primary-brown transition-colors"
onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar

