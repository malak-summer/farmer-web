import { motion } from 'framer-motion'

const About = () => {
  return (
    <section id="about" className="py-32 bg-white/50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob absolute top-20 left-10 w-64 h-64 lg:w-96 lg:h-96 opacity-10" />
      <div className="blob absolute -bottom-32 right-20 w-72 h-72 lg:w-[400px] lg:h-[400px] opacity-5" />

      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative bg-gradient-to-br from-primary-cream to-primary-olive/20 p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/30 backdrop-blur-sm max-w-md mx-auto lg:mx-0">
              <img 
                src="/images/farmer.jpg" 
                alt="Farmer John" 
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-terracotta rounded-2xl opacity-20" />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <h2 className="text-4xl lg:text-6xl font-playfair font-bold bg-gradient-to-r from-primary-brown to-primary-terracotta bg-clip-text text-transparent mb-8 leading-tight">
              Our Family Farm Story
            </h2>
            
            <div className="prose prose-lg lg:prose-xl max-w-none mb-12 text-gray-700 leading-relaxed">
              <p className="text-xl mb-8 font-light">
                For three generations, our family has nurtured this land with dedication and love. 
                Every sunrise finds us in the fields, tending to our crops with the same care we'd give our own children.
              </p>
              <p className="text-xl font-light">
                We believe in sustainable farming practices that respect the earth. No chemicals, no shortcuts—just pure, 
                organic goodness that you can taste in every bite. When you choose our produce, you're choosing 
                a legacy of quality and tradition.
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center space-x-4 pt-4"
            >
              <div className="w-3 h-3 bg-primary-olive rounded-full" />
              <span className="text-2xl font-semibold text-primary-brown">
                Family Owned Since 1950
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About

