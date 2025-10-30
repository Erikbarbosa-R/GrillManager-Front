import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Category, Product } from '../types';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  category: Category;
  onProductClick: (product: Product) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({ category, onProductClick }) => {
  return (
    <motion.section
      id={category.id}
      className="py-8 px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
            {category.description && (
              <p className="text-gray-600">{category.description}</p>
            )}
          </div>
          <motion.button
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            whileHover={{ x: 5 }}
          >
            <span className="text-sm">Ver mais</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.button>
        </motion.div>

        {/* Products Grid */}
        <div className="grid gap-4 px-4 sm:px-6 md:px-8 lg:px-12">
          {category.products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard 
                product={product} 
                onProductClick={onProductClick}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ProductSection;
