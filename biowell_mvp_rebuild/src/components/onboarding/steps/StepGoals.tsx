import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Moon, Zap, Dumbbell, Leaf } from 'lucide-react';

interface StepGoalsProps {
  next: () => void;
  formData: Record<string, unknown>;
  updateFormData: (data: Record<string, unknown>) => void;
}

const goals = [
  {
    id: 'sleep',
    title: 'Improve Sleep',
    description: 'Optimize sleep quality and duration',
    icon: <Moon className="w-6 h-6" />,
    color: 'text-blue-400 bg-blue-400/10'
  },
  {
    id: 'energy',
    title: 'Boost Energy',
    description: 'Enhance daily vitality and focus',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-yellow-400 bg-yellow-400/10'
  },
  {
    id: 'cognitive',
    title: 'Mental Clarity',
    description: 'Improve focus and cognitive function',
    icon: <Brain className="w-6 h-6" />,
    color: 'text-purple-400 bg-purple-400/10'
  },
  {
    id: 'fitness',
    title: 'Physical Performance',
    description: 'Enhance strength and endurance',
    icon: <Dumbbell className="w-6 h-6" />,
    color: 'text-green-400 bg-green-400/10'
  },
  {
    id: 'wellness',
    title: 'Overall Wellness',
    description: 'Optimize general health and vitality',
    icon: <Heart className="w-6 h-6" />,
    color: 'text-red-400 bg-red-400/10'
  },
  {
    id: 'longevity',
    title: 'Longevity',
    description: 'Support healthy aging and vitality',
    icon: <Leaf className="w-6 h-6" />,
    color: 'text-emerald-400 bg-emerald-400/10'
  }
];

export default function StepGoals({ next, formData, updateFormData }: StepGoalsProps) {
  const handleGoalSelect = (goalId: string) => {
    updateFormData({ goal: goalId });
    next();
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
        What's your primary wellness goal?
      </h2>
      <p className="text-gray-400 mb-8">
        Select your main focus area for personalized recommendations
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {goals.map((goal) => (
          <motion.button
            key={goal.id}
            variants={item}
            onClick={() => handleGoalSelect(goal.id)}
            className={`flex items-start p-4 rounded-xl border-2 transition-all ${
              formData.goal === goal.id
                ? `${goal.color} border-current`
                : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className={`p-3 rounded-lg ${goal.color} mr-4`}>
              {goal.icon}
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white mb-1">
                {goal.title}
              </h3>
              <p className="text-sm text-gray-400">{goal.description}</p>
            </div>
            {formData.goal === goal.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-2 h-2 rounded-full ml-auto mt-2 ${goal.color.replace('text-', 'bg-').replace('/10', '')}`}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}