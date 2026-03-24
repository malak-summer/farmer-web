import { motion } from 'framer-motion'

const ProductCard = ({ name, description, image }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(78, 52, 46, 0.15)' }}
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-hover overflow-hidden cursor-pointer border border-white/50 hover:border-primary-olive/50 transition-all duration-500 max-w-sm mx-auto"
    >
      {/* Image */}
      <div className="relative mb-6 h-64 overflow-hidden rounded-2xl">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          whileHover={{ scale: 1.1 }}
        />
        <div className="blob absolute top-4 right-4 w-16 h-16 opacity-20 group-hover:opacity-30 transition-opacity" />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-2xl font-playfair font-semibold text-primary-brown mb-3 group-hover:text-primary-terracotta transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6 opacity-90">
          {description}
        </p>
        <motion.div
          className="w-full h-1 bg-gradient-to-r from-primary-brown to-primary-terracotta rounded-full origin-left group-hover:scale-x-110 transition-transform duration-300"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
        />
      </div>
    </motion.div>
  )
}

export default ProductCard

