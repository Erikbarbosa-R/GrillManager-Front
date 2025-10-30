import React from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../types';

interface CategoryNavigationProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryClick 
}) => {
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    onCategoryClick(categoryId);
  };

  return (
    <motion.div 
      className="bg-gray-50 py-4 px-4 sticky top-0 z-40 shadow-sm"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryNavigation;
