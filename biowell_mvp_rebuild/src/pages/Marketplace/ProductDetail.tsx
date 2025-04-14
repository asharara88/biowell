import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ShoppingCart, 
  Star, 
  Check, 
  ArrowLeft, 
  Pill, 
  Clock, 
  Info, 
  Shield, 
  Leaf, 
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';
import { useSupplementStore } from '../../store/supplementStore';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { supplements, addToCart } = useSupplementStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage'>('description');
  const [isAdded, setIsAdded] = useState(false);

  const supplement = supplements.find(s => s.id === id);

  useEffect(() => {
    if (!supplement) {
      navigate('/marketplace');
    }
  }, [supplement, navigate]);

  if (!supplement) {
    return null;
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(supplement);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };

  return (
    <div className="min-h-screen bg-black pt-16 pb-16">
      <Helmet>
        <title>{supplement.name} | BIOWELL Marketplace</title>
        <meta name="description" content={supplement.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center text-biowellGreen mb-8 hover:text-biowellGreen/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl p-8 border border-gray-800 flex items-center justify-center"
          >
            {supplement.image ? (
              <img 
                src={supplement.image} 
                alt={supplement.name} 
                className="max-w-full max-h-80 object-contain"
              />
            ) : (
              <Pill className="w-32 h-32 text-biowellGreen opacity-30" />
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                  {supplement.category}
                </span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-300 ml-1">{supplement.rating}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{supplement.name}</h1>
              <p className="text-gray-400">{supplement.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {supplement.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {supplement.recommended && (
              <div className="bg-biowellGreen/10 border border-biowellGreen/20 rounded-lg p-4 flex items-start">
                <Sparkles className="w-5 h-5 text-biowellGreen mr-3 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-biowellGreen font-medium mb-1">Personalized Recommendation</h3>
                  <p className="text-gray-300 text-sm">{supplement.recommendationReason}</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-white">${supplement.price.toFixed(2)}</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 bg-gray-800 rounded-l-lg hover:bg-gray-700 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-300" />
                  </button>
                  <span className="px-4 py-2 bg-gray-800 text-white">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 bg-gray-800 rounded-r-lg hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  isAdded 
                    ? 'bg-green-600 text-white' 
                    : 'bg-biowellGreen text-black hover:bg-opacity-90'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'description'
                  ? 'text-biowellGreen border-b-2 border-biowellGreen'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'ingredients'
                  ? 'text-biowellGreen border-b-2 border-biowellGreen'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'usage'
                  ? 'text-biowellGreen border-b-2 border-biowellGreen'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              How to Use
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-300">{supplement.description}</p>
                
                <h3 className="text-white font-semibold mt-4">Key Benefits</h3>
                <ul className="space-y-2">
                  {supplement.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="w-5 h-5 text-biowellGreen mr-2" />
                      <h4 className="text-white font-medium">Quality Assured</h4>
                    </div>
                    <p className="text-gray-400 text-sm">Third-party tested for purity and potency</p>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Leaf className="w-5 h-5 text-biowellGreen mr-2" />
                      <h4 className="text-white font-medium">Clean Formula</h4>
                    </div>
                    <p className="text-gray-400 text-sm">No artificial fillers, colors, or preservatives</p>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Info className="w-5 h-5 text-biowellGreen mr-2" />
                      <h4 className="text-white font-medium">Science-Backed</h4>
                    </div>
                    <p className="text-gray-400 text-sm">Formulated based on clinical research</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ingredients' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-white font-semibold">Ingredients</h3>
                <p className="text-gray-300">{supplement.ingredients}</p>
                
                <div className="bg-gray-800 p-4 rounded-lg mt-4">
                  <h4 className="text-white font-medium mb-2">Allergen Information</h4>
                  <p className="text-gray-400 text-sm">
                    Manufactured in a facility that also processes milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, and soy.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Quality Standards</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">GMP Certified Manufacturing</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Third-Party Tested for Purity</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Non-GMO Ingredients</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Gluten-Free</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'usage' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-white font-semibold">Suggested Use</h3>
                <p className="text-gray-300">{supplement.suggestedUse}</p>
                
                <div className="bg-gray-800 p-4 rounded-lg mt-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-biowellGreen mr-2" />
                    <h4 className="text-white font-medium">Optimal Timing</h4>
                  </div>
                  <p className="text-gray-400 text-sm">
                    For best results, take this supplement as directed. Consistency is key for optimal benefits.
                  </p>
                </div>
                
                <div className="bg-yellow-900/20 border border-yellow-800/30 p-4 rounded-lg">
                  <h4 className="text-yellow-400 font-medium mb-2">Important Notes</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Store in a cool, dry place away from direct sunlight</li>
                    <li>• Keep out of reach of children</li>
                    <li>• Do not use if safety seal is broken or missing</li>
                    <li>• Consult with a healthcare professional before use if you are pregnant, nursing, have a medical condition, or are taking medications</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}