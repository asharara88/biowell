import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, ArrowRight, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Supplement } from '../../types/supplement';

interface RecommendedSupplementsProps {
  onAddToCart: (supplement: Supplement) => void;
}

export default function RecommendedSupplements({ onAddToCart }: RecommendedSupplementsProps) {
  // These would come from the Health Consultant recommendations in a real app
  const personalizedRecommendations = [
    {
      id: 'rec1',
      name: 'Magnesium Glycinate',
      description: 'Supports sleep quality and stress reduction',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'sleep',
      rating: 4.8,
      tags: ['Sleep', 'Stress', 'Recovery'],
      recommended: true,
      recommendationReason: 'Based on your sleep patterns and stress levels, Magnesium Glycinate can help improve your sleep quality and reduce stress.',
      benefits: [
        'Improves sleep quality',
        'Reduces stress and anxiety',
        'Supports muscle recovery',
        'Promotes relaxation'
      ],
      ingredients: 'Magnesium Glycinate 400mg, Vegetable Cellulose (capsule)',
      suggestedUse: 'Take 1-2 capsules 30 minutes before bedtime with water.'
    },
    {
      id: 'rec2',
      name: 'Vitamin D3 + K2',
      description: 'Essential for immune function and bone health',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'immunity',
      rating: 4.9,
      tags: ['Immunity', 'Bone Health', 'Essential'],
      recommended: true,
      recommendationReason: 'Your health metrics indicate potential vitamin D deficiency, which is common in indoor lifestyles.',
      benefits: [
        'Supports immune system function',
        'Promotes bone health',
        'Enhances calcium absorption',
        'Supports cardiovascular health'
      ],
      ingredients: 'Vitamin D3 (Cholecalciferol) 5000 IU, Vitamin K2 (MK-7) 100mcg, MCT Oil, Vegetable Cellulose (capsule)',
      suggestedUse: 'Take 1 capsule daily with a meal containing fat for optimal absorption.'
    },
    {
      id: 'rec3',
      name: 'Omega-3 Fish Oil',
      description: 'High-potency EPA/DHA for brain and heart health',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'cognitive',
      rating: 4.7,
      tags: ['Brain Health', 'Heart Health', 'Anti-inflammatory'],
      recommended: true,
      recommendationReason: 'Based on your cognitive goals and dietary patterns, additional Omega-3 fatty acids would be beneficial.',
      benefits: [
        'Supports brain function and cognitive health',
        'Promotes cardiovascular health',
        'Reduces inflammation',
        'Supports mood regulation'
      ],
      ingredients: 'Fish Oil Concentrate 1200mg (EPA 400mg, DHA 200mg), Gelatin, Glycerin, Purified Water, Natural Lemon Flavor',
      suggestedUse: 'Take 2 softgels daily with meals.'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 mb-8 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-biowellGreen/20 rounded-lg mr-3">
            <Sparkles className="w-5 h-5 text-biowellGreen" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Personalized Recommendations</h2>
            <p className="text-gray-400 text-sm">Based on your health data and goals</p>
          </div>
        </div>
        <Link 
          to="/coach" 
          className="text-biowellGreen hover:text-biowellGreen/80 transition-colors flex items-center text-sm"
        >
          View All Recommendations
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personalizedRecommendations.map((supplement) => (
          <motion.div
            key={supplement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                {supplement.image ? (
                  <img 
                    src={supplement.image} 
                    alt={supplement.name} 
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Pill className="w-8 h-8 text-biowellGreen opacity-50" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-medium">{supplement.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{supplement.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">${supplement.price.toFixed(2)}</span>
                  <button
                    onClick={() => onAddToCart(supplement)}
                    className="p-1.5 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}