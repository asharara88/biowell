import React from 'react';
import { motion } from 'framer-motion';
import { ListChecks, ArrowRight, Timer, Target, Sparkles } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  category: 'wellness' | 'fitness' | 'nutrition' | 'mindfulness';
  duration?: string;
  impact: 'high' | 'medium' | 'low';
  completed?: boolean;
}

interface DailyRecommendationsProps {
  recommendations?: Recommendation[];
  onComplete?: (id: string) => void;
  onViewAll?: () => void;
}

const defaultRecommendations: Recommendation[] = [
  {
    id: '1',
    title: '15-min mindfulness meditation',
    category: 'mindfulness',
    duration: '15 min',
    impact: 'high'
  },
  {
    id: '2',
    title: 'Reduce screen time after 8 PM',
    category: 'wellness',
    impact: 'high'
  },
  {
    id: '3',
    title: 'Chamomile tea before bed',
    category: 'wellness',
    impact: 'medium'
  }
];

const categoryColors = {
  wellness: 'text-green-400',
  fitness: 'text-blue-400',
  nutrition: 'text-yellow-400',
  mindfulness: 'text-purple-400'
};

const impactColors = {
  high: 'bg-green-400',
  medium: 'bg-yellow-400',
  low: 'bg-gray-400'
};

export default function DailyRecommendations({
  recommendations = defaultRecommendations,
  onComplete,
  onViewAll
}: DailyRecommendationsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-biowellGreen bg-opacity-10 rounded-lg flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-biowellGreen" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-white">Today's Plan</h2>
            <div className="flex items-center text-sm text-gray-400">
              <Target className="w-4 h-4 mr-1" />
              <span>{recommendations.length} recommendations</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Sparkles className="w-4 h-4 text-biowellGreen mr-2" />
          <span className="text-sm text-gray-400">Personalized for you</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            variants={item}
            className={`flex items-center justify-between p-4 rounded-lg bg-gray-800 border border-gray-700 transition-colors ${
              rec.completed ? 'bg-opacity-50' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={rec.completed}
                onChange={() => onComplete?.(rec.id)}
                className="w-5 h-5 rounded border-gray-600 text-biowellGreen focus:ring-biowellGreen focus:ring-offset-gray-800"
              />
              <div>
                <h3 className={`text-white font-medium ${rec.completed ? 'line-through text-gray-400' : ''}`}>
                  {rec.title}
                </h3>
                <div className="flex items-center mt-1 space-x-3">
                  <span className={`text-sm ${categoryColors[rec.category]}`}>
                    {rec.category}
                  </span>
                  {rec.duration && (
                    <div className="flex items-center text-sm text-gray-400">
                      <Timer className="w-3 h-3 mr-1" />
                      {rec.duration}
                    </div>
                  )}
                  <div className={`w-2 h-2 rounded-full ${impactColors[rec.impact]}`} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <button
        onClick={onViewAll}
        className="w-full mt-6 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between group"
      >
        <span className="text-sm font-medium">View all recommendations</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}