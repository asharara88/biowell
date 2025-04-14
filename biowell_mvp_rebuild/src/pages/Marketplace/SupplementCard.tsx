import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Info, ShoppingCart, Check, X, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Supplement } from '../../types/supplement';

interface SupplementCardProps {
  supplement: Supplement;
  onAddToCart: () => void;
}

export default function SupplementCard({ supplement, onAddToCart }: SupplementCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleAddToCart = () => {
    onAddToCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex flex-col"
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {supplement.image ? (
          <img 
            src={supplement.image} 
            alt={supplement.name} 
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Pill className="w-16 h-16 text-biowellGreen opacity-50" />
          </div>
        )}
        
        {supplement.recommended && (
          <div className="absolute top-2 left-2 bg-biowellGreen text-black text-xs font-bold px-2 py-1 rounded">
            Recommended
          </div>
        )}
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="absolute top-2 right-2 p-1.5 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Info className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{supplement.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-gray-300 ml-1">{supplement.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-3 flex-1">{supplement.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {supplement.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {supplement.tags.length > 3 && (
            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
              +{supplement.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">${supplement.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`p-2 rounded-lg ${
              isAdded 
                ? 'bg-green-600 text-white' 
                : 'bg-biowellGreen text-black hover:bg-opacity-90'
            } transition-colors`}
          >
            {isAdded ? (
              <Check className="w-5 h-5" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Info Overlay */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/95 p-4 overflow-y-auto"
        >
          <button
            onClick={() => setShowInfo(false)}
            className="absolute top-2 right-2 p-1.5 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-300" />
          </button>
          
          <h3 className="text-lg font-semibold text-white mb-2">{supplement.name}</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-biowellGreen font-medium mb-1">Benefits</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                {supplement.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-biowellGreen mr-2 shrink-0 mt-0.5" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-biowellGreen font-medium mb-1">Ingredients</h4>
              <p className="text-gray-300 text-sm">{supplement.ingredients}</p>
            </div>
            
            <div>
              <h4 className="text-biowellGreen font-medium mb-1">Suggested Use</h4>
              <p className="text-gray-300 text-sm">{supplement.suggestedUse}</p>
            </div>
            
            {supplement.recommended && (
              <div className="bg-biowellGreen/10 border border-biowellGreen/20 rounded-lg p-3">
                <h4 className="text-biowellGreen font-medium mb-1">Why We Recommend This</h4>
                <p className="text-gray-300 text-sm">{supplement.recommendationReason}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Link 
              to={`/marketplace/product/${supplement.id}`}
              className="text-biowellGreen hover:underline text-sm"
            >
              View Full Details
            </Link>
            <button
              onClick={() => {
                handleAddToCart();
                setShowInfo(false);
              }}
              className="bg-biowellGreen text-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}