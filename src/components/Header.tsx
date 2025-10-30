import React from 'react';
import { motion } from 'framer-motion';
import { Star, Share2, MessageCircle } from 'lucide-react';
import type { Restaurant } from '../types';

interface HeaderProps {
  restaurant: Restaurant;
}

const Header: React.FC<HeaderProps> = ({ restaurant }) => {
  return (
    <motion.header 
      className="relative h-80 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Banner Image */}
      <div className="absolute inset-0">
        {restaurant.bannerImage ? (
          <img 
            src={restaurant.bannerImage} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Share Button */}
      <motion.button
        className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-opacity-30 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 size={20} />
      </motion.button>

      {/* Restaurant Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-end justify-between">
          <div className="flex items-end space-x-4">
            {/* Logo */}
            <motion.div
              className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {restaurant.logo ? (
                <img 
                  src={restaurant.logo} 
                  alt={`${restaurant.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">BM</span>
                </div>
              )}
            </motion.div>

            {/* Restaurant Details */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>({restaurant.rating})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <motion.button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Agendar Pedido
            </motion.button>
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
