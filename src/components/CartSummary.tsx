import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CreditCard, Smartphone, Banknote, Eye, CheckCircle, Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem } from '../types';
import { generateOrderPDF } from '../utils/generatePDF';

interface CartSummaryProps {
  cart: CartItem[];
  onClearCart: () => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart, onClearCart, onUpdateQuantity }) => {
  const [showCartDetails, setShowCartDetails] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [cashAmount, setCashAmount] = useState<string>('');
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixOrderId, setPixOrderId] = useState<string>('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    street: '',
    number: '',
    neighborhood: '',
    whatsapp: '',
    complement: ''
  });

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      
      // Adiciona preços das customizações
      if (item.customizations) {
        Object.values(item.customizations).forEach(options => {
          options.forEach(option => {
            itemTotal += option.price * item.quantity;
          });
        });
      }
      
      return total + itemTotal;
    }, 0);
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'dinheiro': return <Banknote className="w-5 h-5" />;
      case 'pix': return <Smartphone className="w-5 h-5" />;
      case 'credito': return <CreditCard className="w-5 h-5" />;
      case 'debito': return <CreditCard className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const calculateChange = () => {
    const total = calculateTotal();
    const paid = parseFloat(cashAmount) || 0;
    return paid - total;
  };

  const calculateDeliveryFee = () => {
    // Endereço do comércio (coordenadas fixas)
    const storeAddress = {
      latitude: -23.5505, // Latitude do comércio (exemplo: São Paulo)
      longitude: -46.6333, // Longitude do comércio
      address: "Rua do Comércio, 123 - Centro"
    };

    // Simulação de coordenadas baseadas no bairro selecionado
    const neighborhoodCoordinates: { [key: string]: { lat: number, lng: number } } = {
      'centro': { lat: -23.5505, lng: -46.6333 },
      'centro histórico': { lat: -23.5500, lng: -46.6330 },
      'vila nova': { lat: -23.5600, lng: -46.6400 },
      'jardim das flores': { lat: -23.5700, lng: -46.6500 },
      'bela vista': { lat: -23.5550, lng: -46.6350 },
      'santa maria': { lat: -23.5800, lng: -46.6600 },
      'nova esperança': { lat: -23.5900, lng: -46.6700 }
    };

    const customerCoords = neighborhoodCoordinates[deliveryInfo.neighborhood.toLowerCase()];
    
    if (!customerCoords) {
      return 5.00; // Taxa padrão se bairro não encontrado
    }

    // Calcular distância usando fórmula de Haversine
    const distance = calculateDistance(
      storeAddress.latitude,
      storeAddress.longitude,
      customerCoords.lat,
      customerCoords.lng
    );

    // Calcular taxa baseada na distância real
    const baseFee = 5.00; // Taxa base
    const perKmFee = 2.00; // Taxa por km adicional
    
    if (distance <= 1) {
      return baseFee;
    } else {
      return baseFee + ((distance - 1) * perKmFee);
    }
  };

  // Função para calcular distância entre duas coordenadas (em km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const getDeliveryDistance = () => {
    // Endereço do comércio (coordenadas fixas)
    const storeAddress = {
      latitude: -23.5505,
      longitude: -46.6333,
      address: "Rua do Comércio, 123 - Centro"
    };

    // Simulação de coordenadas baseadas no bairro selecionado
    const neighborhoodCoordinates: { [key: string]: { lat: number, lng: number } } = {
      'centro': { lat: -23.5505, lng: -46.6333 },
      'centro histórico': { lat: -23.5500, lng: -46.6330 },
      'vila nova': { lat: -23.5600, lng: -46.6400 },
      'jardim das flores': { lat: -23.5700, lng: -46.6500 },
      'bela vista': { lat: -23.5550, lng: -46.6350 },
      'santa maria': { lat: -23.5800, lng: -46.6600 },
      'nova esperança': { lat: -23.5900, lng: -46.6700 }
    };

    const customerCoords = neighborhoodCoordinates[deliveryInfo.neighborhood.toLowerCase()];
    
    if (!customerCoords) {
      return 0;
    }

    return calculateDistance(
      storeAddress.latitude,
      storeAddress.longitude,
      customerCoords.lat,
      customerCoords.lng
    );
  };
  const isValidDeliveryInfo = () => {
    return deliveryInfo.street.trim() !== '' && 
           deliveryInfo.number.trim() !== '' && 
           deliveryInfo.neighborhood.trim() !== '' && 
           deliveryInfo.whatsapp.trim() !== '';
  };
  const generatePixOrderId = () => {
    return 'PIX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const isValidCashAmount = () => {
    const total = calculateTotal();
    const paid = parseFloat(cashAmount) || 0;
    return paid >= total && cashAmount !== '';
  };
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'dinheiro': return 'Dinheiro';
      case 'pix': return 'PIX';
      case 'credito': return 'Cartão de Crédito';
      case 'debito': return 'Cartão de Débito';
      default: return 'Método de Pagamento';
    }
  };

  const handleFinalizeOrder = () => {
    // Abrir modal de entrega primeiro
    setShowDeliveryModal(true);
  };

  const confirmOrder = () => {
    if (!selectedPaymentMethod) {
      console.log('Nenhum método de pagamento selecionado');
      return;
    }
    
    // Validação especial para dinheiro
    if (selectedPaymentMethod === 'dinheiro' && !isValidCashAmount()) {
      console.log('Valor pago insuficiente para dinheiro');
      return;
    }
    
    // Se for PIX, enviar automaticamente via WhatsApp
    if (selectedPaymentMethod === 'pix') {
      const orderId = generatePixOrderId();
      setPixOrderId(orderId);
      sendPixViaWhatsApp(orderId);
      return;
    }
    
    // Criar resumo do pedido para outros métodos
    const deliveryFee = calculateDeliveryFee();
    const subtotal = calculateTotal();
    const total = subtotal + deliveryFee;
    
    // Gerar ID único do pedido
    const orderId = 'PED-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const summary = {
      orderId: orderId,
      items: cart.map(item => {
        // Calcular preço total do item com customizações
        let itemTotal = item.price;
        if (item.customizations) {
          Object.values(item.customizations).forEach(options => {
            options.forEach((option: any) => {
              itemTotal += option.price;
            });
          });
        }
        
        return {
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: itemTotal * item.quantity,
          customizations: item.customizations
        };
      }),
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      paymentMethod: getPaymentMethodName(selectedPaymentMethod),
      timestamp: new Date().toLocaleString('pt-BR'),
      deliveryInfo: deliveryInfo,
      // Adicionar informações específicas do dinheiro
      ...(selectedPaymentMethod === 'dinheiro' && {
        cashAmount: parseFloat(cashAmount),
        change: parseFloat(cashAmount) - total
      })
    };

    // Gerar e baixar PDF automaticamente
    setTimeout(() => {
      generateOrderPDF(summary);
    }, 500);

    // Salvar resumo e mostrar modal
    setOrderSummary(summary);
    setShowOrderSummaryModal(true);
    
    // Fechar modal de pagamento
    setShowPaymentModal(false);
  };

  const confirmDelivery = () => {
    if (!isValidDeliveryInfo()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // Fechar modal de entrega e abrir modal de pagamento
    setShowDeliveryModal(false);
    setShowPaymentModal(true);
  };

  const cancelDelivery = () => {
    setShowDeliveryModal(false);
    // Limpar dados de entrega
    setDeliveryInfo({
      street: '',
      number: '',
      neighborhood: '',
      whatsapp: '',
      complement: ''
    });
  };
  const cancelPixPayment = () => {
    setShowPixModal(false);
    setPixOrderId('');
    setShowPaymentModal(true);
  };

  const sendPixViaWhatsApp = (orderId: string) => {
    const deliveryFee = calculateDeliveryFee();
    const subtotal = calculateTotal();
    const total = subtotal + deliveryFee;
    
    // Chave PIX da loja
    const pixKey = 'boteco.maminha@pix.com';
    
    // Criar lista detalhada de produtos com customizações
    const productsList = cart.map(item => {
      let itemText = `• ${item.quantity}x ${item.name}`;
      
      // Adicionar customizações se houver
      if (item.customizations) {
        const customizations = Object.values(item.customizations).flat();
        if (customizations.length > 0) {
          const customizationsText = customizations.map(c => c.name).join(', ');
          itemText += `\n  ↳ ${customizationsText}`;
        }
      }
      
      return itemText;
    }).join('\n');
    
    // Criar mensagem formatada para WhatsApp
    const message = `🎯 *PEDIDO PIX - ${orderId}*

🍽️ *Boteco da Maminha*

📦 *Resumo do Pedido:*
${productsList}

💰 *Valores:*
Subtotal: R$ ${subtotal.toFixed(2)}
Taxa de Entrega: R$ ${deliveryFee.toFixed(2)}
━━━━━━━━━━━━━━━━━
*Total: R$ ${total.toFixed(2)}*

📍 *Endereço de Entrega:*
${deliveryInfo.street}, ${deliveryInfo.number}
${deliveryInfo.neighborhood}${deliveryInfo.complement ? ` - ${deliveryInfo.complement}` : ''}
📱 WhatsApp: ${deliveryInfo.whatsapp}

━━━━━━━━━━━━━━━━━
💳 *PAGAMENTO PIX:*
━━━━━━━━━━━━━━━━━

🔑 *Chave PIX:*
${pixKey}

💰 *Valor:* R$ ${total.toFixed(2)}

📱 *ID do Pedido:* ${orderId}

━━━━━━━━━━━━━━━━━
📸 *INSTRUÇÕES:*
━━━━━━━━━━━━━━━━━
1. Copie a chave PIX acima
2. Abra seu app de banco
3. Faça o pagamento PIX
4. Envie o comprovante aqui

⏰ Seu pedido será confirmado após envio do comprovante!`;

    // Formatar WhatsApp (remover caracteres especiais)
    const whatsapp = deliveryInfo.whatsapp.replace(/\D/g, '');
    
    // Criar link do WhatsApp Web
    const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Fechar modal de pagamento e mostrar modal de aguardando aprovação
    setShowPaymentModal(false);
    setShowPixModal(true);
  };
  const closeOrderSummary = () => {
    // Limpa o carrinho após confirmação
    onClearCart();
    setShowOrderSummaryModal(false);
    setShowCartDetails(false);
    setSelectedPaymentMethod('');
    setOrderSummary(null);
    setCashAmount(''); // Limpar valor do dinheiro
    setPixOrderId(''); // Limpar ID do PIX
    setDeliveryInfo({ // Limpar dados de entrega
      street: '',
      number: '',
      neighborhood: '',
      whatsapp: '',
      complement: ''
    });
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      {/* Cart Summary Fixed Bottom */}
      <motion.div
        className="fixed bottom-4 right-2 left-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-40 max-w-full"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <ShoppingCart className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-gray-900 text-sm">Carrinho</span>
            </div>
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {getTotalQuantity()}
            </span>
          </div>
          
          <div className="text-xs text-gray-600 mb-2">
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold text-base text-orange-600">
                R$ {calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowCartDetails(true)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-2 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-xs"
            >
              <Eye className="w-3 h-3" />
              <span>Ver</span>
            </button>
            <button
              onClick={handleFinalizeOrder}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium px-2 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-xs"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Finalizar</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Cart Details Modal */}
      <AnimatePresence>
        {showCartDetails && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCartDetails(false)}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-h-[85vh] overflow-y-auto mx-2 max-w-[calc(100vw-16px)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Seu Carrinho</h2>
                  <button
                    onClick={() => setShowCartDetails(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start justify-between p-3 border rounded-lg bg-white"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex-1">
                        <div className="mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                        </div>
                        
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Personalizações:</p>
                            {Object.values(item.customizations).map((options, optIndex) => (
                              <div key={optIndex} className="text-xs text-gray-600">
                                {options.map(option => option.name).join(', ')}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">Qtd:</span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                              className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                              className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-2">
                        <p className="font-semibold text-orange-600 text-sm">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <p className="text-xs text-gray-500">
                            +R$ {Object.values(item.customizations).reduce((total, options) => 
                              total + options.reduce((optTotal, option) => optTotal + option.price, 0), 0
                            ).toFixed(2)} extras
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-orange-600">
                      R$ {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-600">Quantidade de itens:</span>
                    <span className="font-semibold text-gray-900 text-sm">{getTotalQuantity()}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowCartDetails(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        Continuar
                      </button>
                      <button
                        onClick={handleFinalizeOrder}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        Finalizar
                      </button>
                    </div>
                    {cart.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
                            onClearCart();
                            setShowCartDetails(false);
                          }
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Limpar Carrinho</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Method Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl w-full mx-2 max-w-[calc(100vw-16px)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
                <h2 className="text-lg font-bold text-gray-900">Método de Pagamento</h2>
              </div>

              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {['dinheiro', 'pix', 'credito', 'debito'].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPaymentMethod === method
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={selectedPaymentMethod === method}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(method)}
                        <span className="font-medium text-gray-900 text-sm">
                          {getPaymentMethodName(method)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Campo de valor pago para dinheiro */}
                {selectedPaymentMethod === 'dinheiro' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">Pagamento em Dinheiro</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor pago pelo cliente:
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          placeholder="0,00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      {cashAmount && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total do pedido:</span>
                            <span className="font-semibold">R$ {calculateTotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Valor pago:</span>
                            <span className="font-semibold">R$ {parseFloat(cashAmount || '0').toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t pt-1">
                            <span className="text-gray-600">Troco:</span>
                            <span className={`font-bold ${calculateChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              R$ {calculateChange().toFixed(2)}
                            </span>
                          </div>
                          {calculateChange() < 0 && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ Valor insuficiente! O cliente precisa pagar mais.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold text-gray-900">Subtotal:</span>
                    <span className="text-lg font-bold text-orange-600">
                      R$ {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold text-gray-900">Taxa de Entrega:</span>
                    <span className="text-lg font-bold text-orange-600">
                      R$ {calculateDeliveryFee().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold text-gray-900">Distância:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {getDeliveryDistance().toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3 border-t pt-2">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-orange-600">
                      R$ {(calculateTotal() + calculateDeliveryFee()).toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={confirmOrder}
                      disabled={!selectedPaymentMethod || (selectedPaymentMethod === 'dinheiro' && !isValidCashAmount())}
                      className={`w-full font-medium px-3 py-2 rounded-lg transition-colors text-sm ${
                        selectedPaymentMethod && !(selectedPaymentMethod === 'dinheiro' && !isValidCashAmount())
                          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Confirmar Pedido
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
          {/* Order Summary Modal */}
          <AnimatePresence>
            {showOrderSummaryModal && orderSummary && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => closeOrderSummary()}
              >
                <motion.div
                  className="bg-white rounded-xl w-full max-h-[90vh] overflow-y-auto mx-2 max-w-[calc(100vw-16px)]"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <h2 className="text-lg font-bold text-gray-900">Pedido Confirmado!</h2>
                      </div>
                      <button
                        onClick={closeOrderSummary}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Order Summary Content */}
                  <div className="p-4">
                    {/* Items List */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">Itens do Pedido:</h3>
                      <div className="space-y-2">
                        {orderSummary.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-start p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-600">Quantidade: {item.quantity}</p>
                              {item.customizations && Object.keys(item.customizations).length > 0 && (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500 mb-1">Personalizações:</p>
                                  {Object.values(item.customizations).map((options: any, optIndex: number) => (
                                    <div key={optIndex} className="text-xs text-gray-600">
                                      {options.map((option: any) => option.name).join(', ')}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right ml-2">
                              <p className="font-semibold text-orange-600 text-sm">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="border-t pt-3">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Método de Pagamento:</span>
                          <span className="font-semibold text-gray-900 text-sm">{orderSummary.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Data/Hora:</span>
                          <span className="font-semibold text-gray-900 text-sm">{orderSummary.timestamp}</span>
                        </div>
                        {orderSummary.deliveryInfo && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Endereço:</span>
                              <span className="font-semibold text-gray-900 text-sm">
                                {orderSummary.deliveryInfo.street}, {orderSummary.deliveryInfo.number}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Bairro:</span>
                              <span className="font-semibold text-gray-900 text-sm">{orderSummary.deliveryInfo.neighborhood}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">WhatsApp:</span>
                              <span className="font-semibold text-gray-900 text-sm">{orderSummary.deliveryInfo.whatsapp}</span>
                            </div>
                            {orderSummary.deliveryInfo.complement && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Complemento:</span>
                                <span className="font-semibold text-gray-900 text-sm">{orderSummary.deliveryInfo.complement}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Distância:</span>
                              <span className="font-semibold text-blue-600 text-sm">{getDeliveryDistance().toFixed(1)} km</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Taxa de Entrega:</span>
                              <span className="font-semibold text-orange-600 text-sm">R$ {orderSummary.deliveryFee?.toFixed(2) || calculateDeliveryFee().toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        {orderSummary.cashAmount && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Valor pago:</span>
                              <span className="font-semibold text-gray-900 text-sm">R$ {orderSummary.cashAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Troco:</span>
                              <span className="font-semibold text-green-600 text-sm">R$ {orderSummary.change.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        {orderSummary.pixOrderId && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">ID do Pedido PIX:</span>
                              <span className="font-semibold text-gray-900 text-sm">{orderSummary.pixOrderId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Status:</span>
                              <span className="font-semibold text-yellow-600 text-sm">{orderSummary.status}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="text-base font-semibold text-gray-900">Total:</span>
                          <span className="text-lg font-bold text-orange-600">
                            R$ {orderSummary.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Success Message */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <p className="text-sm text-green-800 font-medium">
                            Pedido realizado com sucesso!
                          </p>
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          Obrigado pela preferência! Seu pedido será preparado em breve.
                        </p>
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={closeOrderSummary}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delivery Modal */}
          <AnimatePresence>
            {showDeliveryModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[80]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => cancelDelivery()}
              >
                <motion.div
                  className="bg-white rounded-xl w-full max-h-[90vh] overflow-y-auto mx-2 max-w-[calc(100vw-16px)]"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-6 h-6 text-green-500" />
                        <h2 className="text-lg font-bold text-gray-900">Informações de Entrega</h2>
                      </div>
                      <button
                        onClick={cancelDelivery}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Delivery Content */}
                  <div className="p-4">
                    {/* Order Summary */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">Resumo do Pedido</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold text-gray-900">R$ {calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Taxa de Entrega:</span>
                          <span className="font-semibold text-orange-600">
                            {deliveryInfo.neighborhood ? `R$ ${calculateDeliveryFee().toFixed(2)}` : 'Selecione o bairro'}
                          </span>
                        </div>
                        {deliveryInfo.neighborhood && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Distância:</span>
                            <span className="font-semibold text-blue-600">{getDeliveryDistance().toFixed(1)} km</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm border-t pt-1">
                          <span className="text-gray-600 font-semibold">Total:</span>
                          <span className="font-bold text-orange-600">
                            R$ {(calculateTotal() + calculateDeliveryFee()).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Store Info */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2 text-sm">📍 Endereço do Comércio</h3>
                      <p className="text-sm text-blue-800">Rua do Comércio, 123 - Centro</p>
                      <p className="text-xs text-blue-700 mt-1">
                        A taxa de entrega é calculada baseada na distância real entre nosso estabelecimento e seu endereço.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rua/Avenida *
                        </label>
                        <input
                          type="text"
                          value={deliveryInfo.street}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, street: e.target.value})}
                          placeholder="Ex: Rua das Flores"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número *
                          </label>
                          <input
                            type="text"
                            value={deliveryInfo.number}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, number: e.target.value})}
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bairro *
                          </label>
                          <select
                            value={deliveryInfo.neighborhood}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, neighborhood: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="">Selecione o bairro</option>
                            <option value="Centro">Centro</option>
                            <option value="Centro Histórico">Centro Histórico</option>
                            <option value="Vila Nova">Vila Nova</option>
                            <option value="Jardim das Flores">Jardim das Flores</option>
                            <option value="Bela Vista">Bela Vista</option>
                            <option value="Santa Maria">Santa Maria</option>
                            <option value="Nova Esperança">Nova Esperança</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp *
                        </label>
                        <input
                          type="tel"
                          value={deliveryInfo.whatsapp}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, whatsapp: e.target.value})}
                          placeholder="(11) 99999-9999"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Complemento (opcional)
                        </label>
                        <input
                          type="text"
                          value={deliveryInfo.complement}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, complement: e.target.value})}
                          placeholder="Ex: Apartamento 101, Bloco A"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-2">
                      <button
                        onClick={confirmDelivery}
                        disabled={!isValidDeliveryInfo()}
                        className={`w-full font-medium px-4 py-2 rounded-lg transition-colors text-sm ${
                          isValidDeliveryInfo()
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Continuar para Pagamento
                      </button>
                      <button
                        onClick={cancelDelivery}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PIX Payment Modal */}
          <AnimatePresence>
            {showPixModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => cancelPixPayment()}
              >
                <motion.div
                  className="bg-white rounded-xl w-full max-h-[90vh] overflow-y-auto mx-2 max-w-[calc(100vw-16px)]"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-6 h-6 text-blue-500" />
                        <h2 className="text-lg font-bold text-gray-900">Pagamento PIX</h2>
                      </div>
                      <button
                        onClick={cancelPixPayment}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* PIX Content */}
                  <div className="p-4">
                    {/* Status de Aguardando */}
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-center">
                      <div className="mb-3">
                        <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-3xl">⏳</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-blue-900 mb-2">Aguardando Confirmação</h3>
                      <p className="text-sm text-blue-800">
                        Seus dados do PIX foram enviados para o WhatsApp!
                      </p>
                    </div>

                    {/* Order Info */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">Informações do Pedido</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">ID do Pedido:</span>
                          <span className="font-semibold text-gray-900">{pixOrderId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-orange-600">R$ {(calculateTotal() + calculateDeliveryFee()).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2 text-sm">📱 Próximos Passos:</h3>
                      <div className="space-y-2 text-sm text-green-800">
                        <p>✅ Dados PIX enviados para seu WhatsApp</p>
                        <p>✅ Verifique a mensagem recebida</p>
                        <p>✅ Faça o pagamento pelo app do banco</p>
                        <p>✅ Envie o comprovante</p>
                        <p>⏰ Aguarde a confirmação do comércio</p>
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Seu pedido só será confirmado após o pagamento ser aprovado pelo comércio.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={cancelPixPayment}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Entendi
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
    };

    export default CartSummary;
