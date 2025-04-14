import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

export default function PricingCard({ title, price, features, recommended = false }: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative rounded-2xl p-8 ${
        recommended 
          ? 'bg-gradient-to-b from-biowellGreen/20 to-gray-900 border-2 border-biowellGreen'
          : 'bg-gray-900 border border-gray-800'
      }`}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-biowellGreen text-black text-sm font-semibold px-4 py-1 rounded-full">
            Recommended
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-center justify-center">
          <span className="text-3xl font-bold text-white">${price}</span>
          <span className="text-gray-400 ml-2">/month</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <Check className={`w-5 h-5 mr-3 ${recommended ? 'text-biowellGreen' : 'text-biowellBlue'}`} />
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          recommended
            ? 'bg-biowellGreen text-black hover:bg-opacity-90'
            : 'bg-gray-800 text-white hover:bg-gray-700'
        }`}
      >
        Get Started
      </button>
    </motion.div>
  );
}