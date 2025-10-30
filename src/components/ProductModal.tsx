import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Product, ProductOption } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, customizations: Record<string, ProductOption[]>, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, ProductOption[]>>({});
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleCustomizationChange = (customizationId: string, option: ProductOption, checked: boolean) => {
    setSelectedCustomizations(prev => {
      const current = prev[customizationId] || [];
      
      if (checked) {
        return {
          ...prev,
          [customizationId]: [...current, option]
        };
      } else {
        return {
          ...prev,
          [customizationId]: current.filter(opt => opt.id !== option.id)
        };
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = product.price * quantity;
    
    Object.values(selectedCustomizations).forEach(options => {
      options.forEach(option => {
        total += option.price * quantity;
      });
    });
    
    return total;
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedCustomizations, quantity);
    onClose();
    setQuantity(1);
    setSelectedCustomizations({});
  };

  const resetModal = () => {
    setQuantity(1);
    setSelectedCustomizations({});
    onClose();
  };

  const getCustomizationIcon = (type: string) => {
    switch (type) {
      case 'size': return '📏';
      case 'extra': return '➕';
      case 'removal': return '➖';
      case 'side-dish': return '🍽️';
      case 'protein': return '🥩';
      default: return '⚙️';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetModal}
        >
            <motion.div
              className="bg-white rounded-xl w-full max-h-[90vh] overflow-y-auto mx-2 max-w-[calc(100vw-16px)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
                <button
                  onClick={resetModal}
                  className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="pr-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h2>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <div className="mt-1 text-base font-bold text-orange-600">
                    R$ {product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Product Image */}
              {product.image && (
                <div className="p-4 pb-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Detailed Description */}
              {product.detailedDescription && (
                <div className="p-4 pt-3">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">Descrição Detalhada</h3>
                  <p className="text-gray-600 text-sm">{product.detailedDescription}</p>
                </div>
              )}

              {/* Preparation Time */}
              {product.preparationTime && (
                <div className="px-4 pb-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Tempo de preparo: {product.preparationTime}</span>
                  </div>
                </div>
              )}

              {/* Allergens */}
              {product.allergens && product.allergens.length > 0 && (
                <div className="px-4 pb-3">
                  <div className="flex items-start text-xs text-orange-600">
                    <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Contém: {product.allergens.join(', ')}</span>
                  </div>
                </div>
              )}

            {/* Customizations */}
            {product.customizations && product.customizations.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Personalize seu pedido</h3>
                </div>
                
                <div className="space-y-4">
                  {product.customizations.map((customization) => (
                    <div key={customization.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{getCustomizationIcon(customization.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {customization.name}
                            {customization.required && <span className="text-red-500 ml-1">*</span>}
                          </h4>
                          {customization.description && (
                            <p className="text-xs text-gray-600">{customization.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {customization.options.map((option) => (
                          <label
                            key={option.id}
                            className="flex items-center justify-between p-2 bg-white border rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center">
                              <input
                                type={customization.type === 'size' || customization.type === 'protein' ? 'radio' : 'checkbox'}
                                name={customization.id}
                                value={option.id}
                                onChange={(e) => handleCustomizationChange(
                                  customization.id,
                                  option,
                                  e.target.checked
                                )}
                                className="mr-2 w-3 h-3 text-orange-600"
                              />
                              <div>
                                <span className="text-gray-800 font-medium text-sm">{option.name}</span>
                                {option.description && (
                                  <p className="text-xs text-gray-600">{option.description}</p>
                                )}
                              </div>
                            </div>
                            {option.price > 0 && (
                              <span className="text-orange-600 font-bold text-sm">
                                +R$ {option.price.toFixed(2)}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-800">Quantidade</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-orange-600">
                  R$ {calculateTotalPrice().toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
