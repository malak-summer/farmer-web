import { motion } from 'framer-motion'

const features = [
  {
    emoji: '🌿',
    title: '100% Organic',
    description: 'Certified organic farming with no synthetic pesticides or fertilizers.',
    color: 'from-green-400 to-emerald-500'
  },
  {
    emoji: '🚚',
    title: 'Locally Grown',
    description: 'Farm-to-table freshness. Sourced from our local fields daily.',
    color: 'from-orange-400 to-amber-500'
  },
  {
    emoji: '⏰',
    title: 'Fresh Daily',
    description: 'Harvested at peak ripeness every morning for maximum flavor.',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    emoji: '🛡️',
    title: 'No Chemicals',
    description: 'Pure, natural produce grown with sustainable practices.',
    color: 'from-purple-400 to-violet-500'
  }
]

const WhyUs = () => {
  return (
    <section id="whyus" className="py-32 bg-gradient-to-t from-primary-cream via-white/60 to-primary-cream relative">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl lg:text-6xl font-playfair font-bold bg-gradient-to-r from-primary-brown via-primary-terracotta to-primary-olive bg-clip-text text-transparent mb-6">
            Why Choose Us
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
            Experience the difference of farm-fresh quality and sustainable farming.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const emoji = feature.emoji
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative p-10 lg:p-12 rounded-3xl bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-hover hover:bg-white/90 border border-white/50 hover:border-primary-olive/30 transition-all duration-500 text-center"
              >
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} p-5 shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center text-4xl lg:text-5xl text-white shadow-2xl`}>
                    <span>{emoji}</span>
                  </div>
                  <div className="blob absolute -inset-2 opacity-0 group-hover:opacity-20 transition-opacity w-full h-full rounded-3xl bg-gradient-to-r from-primary-olive to-primary-terracotta" />
                </div>
                
                <h3 className="text-2xl lg:text-2xl font-playfair font-bold text-primary-brown mb-4 group-hover:text-primary-terracotta transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyUs

