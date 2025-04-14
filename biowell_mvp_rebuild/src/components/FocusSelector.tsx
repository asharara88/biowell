import React from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, Battery, Heart, Dumbbell, Moon, Zap, Scale } from 'lucide-react';

interface FocusArea {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface FocusSelectorProps {
  selectedFocus?: string;
  onFocusChange?: (focus: string) => void;
}

const focusAreas: FocusArea[] = [
  {
    id: 'sleep',
    name: 'Sleep',
    icon: <Moon className="w-5 h-5" />,
    description: 'Optimize your sleep quality',
    color: 'text-blue-400 bg-blue-400/10'
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: <Zap className="w-5 h-5" />,
    description: 'Boost daily energy levels',
    color: 'text-yellow-400 bg-yellow-400/10'
  },
  {
    id: 'mood',
    name: 'Mood',
    icon: <Brain className="w-5 h-5" />,
    description: 'Enhance mental wellbeing',
    color: 'text-purple-400 bg-purple-400/10'
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: <Dumbbell className="w-5 h-5" />,
    description: 'Improve physical performance',
    color: 'text-green-400 bg-green-400/10'
  },
  {
    id: 'recovery',
    name: 'Recovery',
    icon: <Heart className="w-5 h-5" />,
    description: 'Optimize rest and recovery',
    color: 'text-red-400 bg-red-400/10'
  },
  {
    id: 'vitality',
    name: 'Vitality',
    icon: <Battery className="w-5 h-5" />,
    description: 'Enhance overall wellness',
    color: 'text-emerald-400 bg-emerald-400/10'
  }
];

export default function FocusSelector({ selectedFocus = 'sleep', onFocusChange }: FocusSelectorProps) {
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
            <Target className="w-5 h-5 text-biowellGreen" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-white">Focus Areas</h2>
            <p className="text-sm text-gray-400">Select your wellness priority</p>
          </div>
        </div>
        <div className="flex items-center">
          <Scale className="w-4 h-4 text-biowellGreen mr-2" />
          <span className="text-sm text-gray-400">Personalized tracking</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {focusAreas.map((focus) => (
          <motion.button
            key={focus.id}
            variants={item}
            onClick={() => onFocusChange?.(focus.id)}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
              selectedFocus === focus.id
                ? `${focus.color} border-current`
                : 'bg-gray-800 border-transparent hover:border-gray-700'
            }`}
          >
            <div className={`mb-3 ${selectedFocus === focus.id ? focus.color : ''}`}>
              {focus.icon}
            </div>
            <h3 className="text-white font-medium mb-1">{focus.name}</h3>
            <p className="text-xs text-gray-400 text-center">
              {focus.description}
            </p>
            {selectedFocus === focus.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-2 h-2 rounded-full mt-2 ${focus.color.replace('text-', 'bg-').replace('/10', '')}`}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}