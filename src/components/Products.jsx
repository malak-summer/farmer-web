import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

const products = [
  {
    name: 'Organic Tomatoes',
    description: 'Sun-ripened tomatoes bursting with flavor. Perfect for salads, sauces, and fresh eating.',
    image: '/images/tomatoes.jpg'
  },
  {
    name: 'Fresh Strawberries',
    description: 'Sweet, juicy strawberries picked at peak ripeness. Nature\'s candy from our fields.',
    image: '/images/strawberries.jpg'
  },
  {
    name: 'Heirloom Carrots',
    description: 'Colorful heirloom carrots with incredible sweetness and crunch. Straight from the earth.',
    image: '/images/carrots.jpg'
  },
  {
    name: 'Golden Apples',
    description: 'Crisp, golden apples with perfect balance of sweet and tart. Farm-fresh daily.',
    image: '/images/apples.jpg'
  },
  {
    name: 'Baby Spinach',
    description: 'Tender baby spinach leaves, nutrient-packed and ready for your favorite recipes.',
    image: '/images/spinach.jpg'
  },
  {
    name: 'Fresh Basil',
    description: 'Aromatic fresh basil with intense flavor. Perfect for pesto, pizza, and Mediterranean dishes.',
    image: '/images/basil.jpg'
  }
]

const Products = () => {
  return (
    <section id="products" className="py-32 bg-gradient-to-b from-cream to-white/50">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl lg:text-6xl font-playfair font-bold bg-gradient-to-r from-primary-brown via-primary-terracotta to-primary-olive bg-clip-text text-transparent mb-6">
            Our Harvest
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
            A selection of our finest organic produce, picked at perfection from our family farm.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Products

