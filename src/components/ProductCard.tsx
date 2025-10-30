import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  return (
    <motion.div
      className="card hover:shadow-lg transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      onClick={() => onProductClick(product)}
    >
      <div className="flex">
        {/* Product Image */}
        <div className="w-20 h-20 flex-shrink-0">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-l-xl"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-l-xl flex items-center justify-center">
              <span className="text-gray-500 text-xs font-medium">Sem foto</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-900 text-base">{product.name}</h3>
            {product.isPopular && (
              <div className="flex items-center text-yellow-500 text-xs">
                <Star className="w-3 h-3 fill-current mr-1" />
                <span>Popular</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-orange-600">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
              className="bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-3 h-3" />
              <span>Pedir</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
