import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen relative overflow-hidden pt-20 lg:pt-32 flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/images/farm.jpg" alt="Farm" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div 
          className="absolute inset-0 bg-gradient-hero opacity-70"
          style={{
            background: 'linear-gradient(135deg, #4E342E 0%, #D84315 50%, #6D8B74 100%)'
          }}
        />
        <div className="blob absolute -top-40 -right-40 w-96 h-96 lg:w-[500px] lg:h-[500px] opacity-30 animate-pulse" />
        <div className="blob absolute -bottom-48 left-20 w-80 h-80 lg:w-[400px] lg:h-[400px] opacity-20" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 text-center relative z-10 text-cream">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl lg:text-7xl font-playfair font-bold leading-tight mb-6 lg:mb-8 drop-shadow-lg">
            Fresh From Our 
            <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-primary-cream to-white/80 bg-clip-text text-transparent">
              Farm to Your Table
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-10 lg:mb-12 font-light leading-relaxed max-w-2xl mx-auto opacity-90 drop-shadow-md">
            Discover the finest organic fruits and vegetables,{' '}
            <br className="hidden md:block" />
            handpicked daily with love from our family farm.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 255, 255, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary-cream text-primary-brown px-12 py-5 lg:py-6 lg:px-16 rounded-full text-xl lg:text-2xl font-semibold shadow-2xl hover:shadow-hover transition-all duration-300 font-inter tracking-wide uppercase"
          >
            Explore Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

