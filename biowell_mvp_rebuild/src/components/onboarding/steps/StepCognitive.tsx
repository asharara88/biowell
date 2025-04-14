import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Clock, BookOpen, Target, Check } from 'lucide-react';
import { useOnboarding } from '../../../context/OnboardingContext';

interface StepCognitiveProps {
  next: () => void;
  back: () => void;
}

interface CognitiveGoal {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const cognitiveGoals: CognitiveGoal[] = [
  {
    id: 'focus',
    title: 'Improve Focus',
    description: 'Enhance concentration and attention span',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'memory',
    title: 'Boost Memory',
    description: 'Enhance recall and retention abilities',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'productivity',
    title: 'Increase Productivity',
    description: 'Accomplish more with better mental efficiency',
    icon: <Clock className="w-6 h-6" />
  },
  {
    id: 'creativity',
    title: 'Enhance Creativity',
    description: 'Improve creative thinking and problem-solving',
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    id: 'energy',
    title: 'Mental Energy',
    description: 'Reduce mental fatigue and brain fog',
    icon: <Zap className="w-6 h-6" />
  }
];

export default function StepCognitive({ next, back }: StepCognitiveProps) {
  const { data, setData } = useOnboarding();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.cognitiveGoals || []);
  const [mentalChallenges, setMentalChallenges] = useState(data.mentalChallenges || '');

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setData({
      cognitiveGoals: selectedGoals,
      mentalChallenges
    });
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
        Cognitive Wellness Goals
      </h2>
      <p className="text-gray-400 mb-8">
        Select the cognitive areas you'd like to improve with personalized recommendations
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Cognitive Goals Selection */}
        <motion.div variants={item}>
          <h3 className="text-lg font-semibold text-white mb-4">
            Which cognitive areas would you like to enhance?
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {cognitiveGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                  selectedGoals.includes(goal.id)
                    ? 'border-biowellGreen bg-biowellGreen/5'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-gray-800 mr-3">
                  {goal.icon}
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-white font-medium">{goal.title}</h4>
                  <p className="text-sm text-gray-400">{goal.description}</p>
                </div>
                {selectedGoals.includes(goal.id) && (
                  <div className="ml-auto">
                    <Check className="w-5 h-5 text-biowellGreen" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mental Challenges */}
        <motion.div variants={item}>
          <h3 className="text-lg font-semibold text-white mb-4">
            Do you experience any specific mental challenges?
          </h3>
          <textarea
            value={mentalChallenges}
            onChange={(e) => setMentalChallenges(e.target.value)}
            placeholder="E.g., difficulty concentrating, brain fog after meals, afternoon energy crashes..."
            className="w-full h-32 bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-biowellGreen focus:outline-none resize-none"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={item} className="pt-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-biowellGreen text-black font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}