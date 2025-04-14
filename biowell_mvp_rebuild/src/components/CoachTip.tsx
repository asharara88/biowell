import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, ArrowRight } from 'lucide-react';

interface CoachTipProps {
  tip: string;
  category?: string;
  timing?: string;
  onActionClick?: () => void;
}

export default function CoachTip({
  tip = "Try reducing caffeine intake after 2 PM for better deep sleep tonight.",
  category = "Sleep Optimization",
  timing = "Evening",
  onActionClick
}: CoachTipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-biowellGreen bg-opacity-10 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-biowellGreen" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-white">Today's Health Tip</h2>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>{timing}</span>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 bg-gray-800 text-sm text-gray-300 rounded-full">
          {category}
        </span>
      </div>

      <p className="text-gray-300 mb-4 leading-relaxed">
        {tip}
      </p>

      <button
        onClick={onActionClick}
        className="w-full mt-2 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between group"
      >
        <span className="text-sm font-medium">Get personalized recommendations</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}