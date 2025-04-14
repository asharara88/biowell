import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Moon, Sun, Activity, Leaf } from 'lucide-react';
import { useOnboarding } from '../../../context/OnboardingContext';

interface StepLifestyleProps {
  next: () => void;
  back: () => void;
}

const nutritionOptions = [
  {
    id: 'balanced',
    title: 'Balanced',
    description: 'Well-rounded nutrition with all food groups',
    icon: <Leaf className="w-6 h-6" />,
    color: 'text-green-400 bg-green-400/10'
  },
  {
    id: 'low-carb',
    title: 'Low-Carb',
    description: 'Reduced carbohydrate intake for metabolic health',
    icon: <Utensils className="w-6 h-6" />,
    color: 'text-blue-400 bg-blue-400/10'
  },
  {
    id: 'plant-based',
    title: 'Plant-Based',
    description: 'Focus on whole plant foods and vegetables',
    icon: <Activity className="w-6 h-6" />,
    color: 'text-purple-400 bg-purple-400/10'
  }
];

const sleepPatterns = [
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Early to bed, early to rise (9PM - 5AM)',
    icon: <Sun className="w-6 h-6" />,
    color: 'text-yellow-400 bg-yellow-400/10'
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Later sleep schedule (12AM - 8AM)',
    icon: <Moon className="w-6 h-6" />,
    color: 'text-indigo-400 bg-indigo-400/10'
  },
  {
    id: 'flexible',
    title: 'Flexible',
    description: 'Variable sleep schedule based on daily needs',
    icon: <Activity className="w-6 h-6" />,
    color: 'text-orange-400 bg-orange-400/10'
  }
];

export default function StepLifestyle({ next, back }: StepLifestyleProps) {
  const { data, setData } = useOnboarding();

  const handleSelect = (key: string, value: string) => {
    setData({ [key]: value });
  };

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
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">
        Tell us about your lifestyle
      </h2>
      <p className="text-gray-400 mb-8">
        Help us personalize your wellness recommendations
      </p>

      {/* Sleep Pattern Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          What's your sleep pattern?
        </h3>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4"
        >
          {sleepPatterns.map((pattern) => (
            <motion.button
              key={pattern.id}
              variants={item}
              onClick={() => handleSelect('sleepPattern', pattern.id)}
              className={`flex items-start p-4 rounded-xl border-2 transition-all ${
                data.sleepPattern === pattern.id
                  ? `${pattern.color} border-current`
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className={`p-3 rounded-lg ${pattern.color} mr-4`}>
                {pattern.icon}
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {pattern.title}
                </h3>
                <p className="text-sm text-gray-400">{pattern.description}</p>
              </div>
              {data.sleepPattern === pattern.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-2 h-2 rounded-full ml-2 mt-2 ${pattern.color.replace('text-', 'bg-').replace('/10', '')}`}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Nutrition Focus Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          What's your nutrition focus?
        </h3>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4"
        >
          {nutritionOptions.map((option) => (
            <motion.button
              key={option.id}
              variants={item}
              onClick={() => {
                handleSelect('nutritionFocus', option.id);
                next();
              }}
              className={`flex items-start p-4 rounded-xl border-2 transition-all ${
                data.nutritionFocus === option.id
                  ? `${option.color} border-current`
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className={`p-3 rounded-lg ${option.color} mr-4`}>
                {option.icon}
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>
              {data.nutritionFocus === option.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-2 h-2 rounded-full ml-2 mt-2 ${option.color.replace('text-', 'bg-').replace('/10', '')}`}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}