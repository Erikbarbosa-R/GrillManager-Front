import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface PopularSectionProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const PopularSection: React.FC<PopularSectionProps> = ({ products, onProductClick }) => {
  const popularProducts = products.filter(product => product.isPopular);

  if (popularProducts.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="py-8 px-4 bg-gradient-to-r from-orange-50 to-red-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Mais Pedidos</h2>
            <Star className="w-8 h-8 text-orange-500 ml-3" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Os pratos mais escolhidos pelos nossos clientes. Experimente essas delícias que fazem sucesso!
          </p>
        </motion.div>

        {/* Popular Products Grid */}
        <div className="grid gap-4 px-4 sm:px-6 md:px-8 lg:px-12">
          {popularProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Popular Badge */}
              <div className="absolute -top-2 -right-2 z-10">
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Mais Pedido
                </motion.div>
              </div>
              
              <ProductCard 
                product={product} 
                onProductClick={onProductClick}
              />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-4">
            Não perca essas delícias! Faça seu pedido agora mesmo.
          </p>
          <motion.button
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Todos os Produtos
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PopularSection;
