import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Check, 
  Shield, 
  Leaf, 
  Clock, 
  ShoppingCart, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp,
  Pill
} from 'lucide-react';
import { Supplement } from '../../types/supplement';

interface SupplementDetailProps {
  supplement: Supplement;
  onAddToCart: () => void;
}

export default function SupplementDetail({ supplement, onAddToCart }: SupplementDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('benefits');
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="p-8 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          {supplement.image ? (
            <img 
              src={supplement.image} 
              alt={supplement.name} 
              className="max-w-full max-h-80 object-contain"
            />
          ) : (
            <Pill className="w-32 h-32 text-biowellGreen opacity-30" />
          )}
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-6">
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
            <h1 className="text-2xl font-bold text-white mb-2">{supplement.name}</h1>
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

          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold text-white">${supplement.price.toFixed(2)}</span>
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
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="border-t border-gray-800">
        <button
          onClick={() => toggleSection('benefits')}
          className="w-full flex items-center justify-between p-4 text-left border-b border-gray-800"
        >
          <span className="text-lg font-medium text-white">Benefits</span>
          {expandedSection === 'benefits' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSection === 'benefits' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 bg-gray-800"
          >
            <ul className="space-y-2">
              {supplement.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <button
          onClick={() => toggleSection('ingredients')}
          className="w-full flex items-center justify-between p-4 text-left border-b border-gray-800"
        >
          <span className="text-lg font-medium text-white">Ingredients</span>
          {expandedSection === 'ingredients' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSection === 'ingredients' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 bg-gray-800"
          >
            <p className="text-gray-300 mb-4">{supplement.ingredients}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-biowellGreen mr-2" />
                <span className="text-gray-300 text-sm">Third-party tested</span>
              </div>
              <div className="flex items-center">
                <Leaf className="w-5 h-5 text-biowellGreen mr-2" />
                <span className="text-gray-300 text-sm">Non-GMO</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-biowellGreen mr-2" />
                <span className="text-gray-300 text-sm">Gluten-free</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-biowellGreen mr-2" />
                <span className="text-gray-300 text-sm">Vegan-friendly</span>
              </div>
            </div>
          </motion.div>
        )}

        <button
          onClick={() => toggleSection('usage')}
          className="w-full flex items-center justify-between p-4 text-left border-b border-gray-800"
        >
          <span className="text-lg font-medium text-white">How to Use</span>
          {expandedSection === 'usage' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSection === 'usage' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 bg-gray-800"
          >
            <div className="flex items-start mb-4">
              <Clock className="w-5 h-5 text-biowellGreen mr-2 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-medium mb-1">Suggested Use</h4>
                <p className="text-gray-300 text-sm">{supplement.suggestedUse}</p>
              </div>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-800/30 p-3 rounded-lg">
              <h4 className="text-yellow-400 font-medium mb-1">Important Notes</h4>
              <p className="text-gray-300 text-sm">
                Consult with a healthcare professional before use if you are pregnant, nursing, have a medical condition, or are taking medications.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}