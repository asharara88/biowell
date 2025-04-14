import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { useSupplementStore } from '../../store/supplementStore';
import { toast } from 'react-toastify';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useSupplementStore();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    if (checkoutStep < 3) {
      setCheckoutStep(checkoutStep + 1);
    } else {
      // Process payment and order
      toast.success('Order placed successfully!');
      clearCart();
      onClose();
      setCheckoutStep(1);
    }
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900 z-50 shadow-xl border-l border-gray-800"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {checkoutStep === 1 ? 'Your Cart' : 
                   checkoutStep === 2 ? 'Shipping Information' : 
                   'Payment Information'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {checkoutStep === 1 && (
                  <>
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-2">Your cart is empty</p>
                        <button
                          onClick={onClose}
                          className="text-biowellGreen hover:underline"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex gap-4 bg-gray-800 p-3 rounded-lg border border-gray-700"
                          >
                            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-contain p-2"
                                />
                              ) : (
                                <Pill className="w-8 h-8 text-biowellGreen opacity-50" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="text-white font-medium">{item.name}</h3>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-gray-400 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <p className="text-gray-400 text-sm mb-2">${item.price.toFixed(2)}</p>
                              
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className="p-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                                >
                                  <Minus className="w-4 h-4 text-gray-300" />
                                </button>
                                <span className="mx-3 text-white">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                  className="p-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                                >
                                  <Plus className="w-4 h-4 text-gray-300" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {checkoutStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleShippingChange}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="123 Main St"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-gray-300 text-sm">City</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingChange}
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                          placeholder="New York"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-gray-300 text-sm">Zip Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleShippingChange}
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="United States"
                      />
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-gray-300 text-sm">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          value={paymentInfo.expiry}
                          onChange={handlePaymentChange}
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                          placeholder="MM/YY"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-gray-300 text-sm">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-biowellGreen focus:outline-none"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mt-6">
                      <h3 className="text-white font-medium mb-2">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping</span>
                          <span className="text-white">${shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-700">
                          <span className="text-gray-300 font-medium">Total</span>
                          <span className="text-white font-bold">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-800">
                {checkoutStep === 1 && (
                  <>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shipping</span>
                        <span className="text-white">${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-700">
                        <span className="text-gray-300 font-medium">Total</span>
                        <span className="text-white font-bold">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                      className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
                        cart.length === 0
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-biowellGreen text-black hover:bg-opacity-90 transition-colors'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      Checkout
                    </button>
                  </>
                )}
                
                {checkoutStep > 1 && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCheckoutStep(checkoutStep - 1)}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    
                    <button
                      onClick={handleCheckout}
                      className="px-6 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                    >
                      {checkoutStep === 3 ? (
                        <>
                          Complete Order
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}