import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Leaf, Fish, Wheat, Coffee, Wine, X, Check } from 'lucide-react';
import { useOnboarding } from '../../../context/OnboardingContext';

interface StepNutritionProps {
  next: () => void;
  back: () => void;
}

interface DietType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Restriction {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const dietTypes: DietType[] = [
  {
    id: 'omnivore',
    name: 'Omnivore',
    description: 'Includes both plant and animal foods',
    icon: <Utensils className="w-6 h-6" />
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'Plant-based with dairy and eggs',
    icon: <Leaf className="w-6 h-6" />
  },
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'Exclusively plant-based foods',
    icon: <Leaf className="w-6 h-6" />
  },
  {
    id: 'pescatarian',
    name: 'Pescatarian',
    description: 'Plant-based with seafood',
    icon: <Fish className="w-6 h-6" />
  },
  {
    id: 'keto',
    name: 'Keto',
    description: 'High-fat, low-carb approach',
    icon: <Utensils className="w-6 h-6" />
  },
  {
    id: 'paleo',
    name: 'Paleo',
    description: 'Based on foods available to our ancestors',
    icon: <Utensils className="w-6 h-6" />
  }
];

const restrictions: Restriction[] = [
  { id: 'gluten', name: 'Gluten-Free', icon: <Wheat className="w-5 h-5" /> },
  { id: 'dairy', name: 'Dairy-Free', icon: <X className="w-5 h-5" /> },
  { id: 'nuts', name: 'Nut-Free', icon: <X className="w-5 h-5" /> },
  { id: 'caffeine', name: 'Caffeine-Free', icon: <Coffee className="w-5 h-5" /> },
  { id: 'alcohol', name: 'Alcohol-Free', icon: <Wine className="w-5 h-5" /> }
];

export default function StepNutrition({ next, back }: StepNutritionProps) {
  const { data, setData } = useOnboarding();
  const [selectedDiet, setSelectedDiet] = useState(data.dietType || '');
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(data.dietaryRestrictions || []);
  const [mealFrequency, setMealFrequency] = useState(data.mealFrequency || '3');

  const toggleRestriction = (id: string) => {
    setSelectedRestrictions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setData({
      dietType: selectedDiet,
      dietaryRestrictions: selectedRestrictions,
      mealFrequency
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
        Your Nutrition Profile
      </h2>
      <p className="text-gray-400 mb-8">
        Tell us about your dietary preferences to help personalize your nutrition recommendations
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Diet Type Selection */}
        <motion.div variants={item}>
          <h3 className="text-lg font-semibold text-white mb-4">
            What type of diet do you follow?
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {dietTypes.map((diet) => (
              <button
                key={diet.id}
                onClick={() => setSelectedDiet(diet.id)}
                className={`flex items-start p-4 rounded-xl border-2 transition-all ${
                  selectedDiet === diet.id
                    ? 'border-biowellGreen bg-biowellGreen/5'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-gray-800 mr-3">
                  {diet.icon}
                </div>
                <div className="text-left">
                  <h4 className="text-white font-medium">{diet.name}</h4>
                  <p className="text-sm text-gray-400">{diet.description}</p>
                </div>
                {selectedDiet === diet.id && (
                  <div className="ml-auto">
                    <Check className="w-5 h-5 text-biowellGreen" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dietary Restrictions */}
        <motion.div variants={item}>
          <h3 className="text-lg font-semibold text-white mb-4">
            Do you have any dietary restrictions?
          </h3>
          <div className="flex flex-wrap gap-3">
            {restrictions.map((restriction) => (
              <button
                key={restriction.id}
                onClick={() => toggleRestriction(restriction.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  selectedRestrictions.includes(restriction.id)
                    ? 'border-biowellGreen bg-biowellGreen/5 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {restriction.icon}
                {restriction.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Meal Frequency */}
        <motion.div variants={item}>
          <h3 className="text-lg font-semibold text-white mb-4">
            How many meals do you typically eat per day?
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">2</span>
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={mealFrequency}
              onChange={(e) => setMealFrequency(e.target.value)}
              className="w-full mx-4 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-biowellGreen"
            />
            <span className="text-gray-400">6+</span>
          </div>
          <div className="text-center mt-2">
            <span className="text-white font-medium">{mealFrequency} meals</span>
          </div>
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