import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Activity, Brain, CheckSquare, Square, ArrowUp, ArrowDown } from 'lucide-react';
import { useOnboarding } from '../../../context/OnboardingContext';

interface StepWellnessPrioritiesProps {
  next: () => void;
  back: () => void;
}

export default function StepWellnessPriorities({ next, back }: StepWellnessPrioritiesProps) {
  const { data, setData } = useOnboarding();
  const [priorities, setPriorities] = useState({
    sleep: data.sleepPriorities || [],
    physical: data.physicalPriorities || [],
    mental: data.mentalPriorities || []
  });
  
  // Track priority rankings
  const [rankings, setRankings] = useState<Record<string, number>>({});

  const handleTogglePriority = (category: 'sleep' | 'physical' | 'mental', value: string) => {
    setPriorities(prev => {
      const currentValues = prev[category];
      
      // If already selected, remove it
      if (currentValues.includes(value)) {
        const newValues = currentValues.filter(v => v !== value);
        
        // Remove from rankings
        const newRankings = { ...rankings };
        delete newRankings[`${category}-${value}`];
        
        // Re-number remaining rankings
        Object.keys(newRankings).forEach(key => {
          if (newRankings[key] > rankings[`${category}-${value}`]) {
            newRankings[key] -= 1;
          }
        });
        
        setRankings(newRankings);
        return { ...prev, [category]: newValues };
      } 
      
      // If not selected, add it (up to 3 total)
      const totalSelected = Object.values(prev).flat().length;
      if (totalSelected < 3) {
        const newValues = [...currentValues, value];
        
        // Add to rankings
        setRankings({
          ...rankings,
          [`${category}-${value}`]: totalSelected + 1
        });
        
        return { ...prev, [category]: newValues };
      }
      
      return prev;
    });
  };
  
  const adjustRanking = (category: 'sleep' | 'physical' | 'mental', value: string, direction: 'up' | 'down') => {
    const key = `${category}-${value}`;
    const currentRank = rankings[key];
    
    if (direction === 'up' && currentRank > 1) {
      // Find the item with rank - 1
      const keyToSwap = Object.keys(rankings).find(k => rankings[k] === currentRank - 1);
      if (keyToSwap) {
        setRankings({
          ...rankings,
          [key]: currentRank - 1,
          [keyToSwap]: currentRank
        });
      }
    } else if (direction === 'down' && currentRank < 3) {
      // Find the item with rank + 1
      const keyToSwap = Object.keys(rankings).find(k => rankings[k] === currentRank + 1);
      if (keyToSwap) {
        setRankings({
          ...rankings,
          [key]: currentRank + 1,
          [keyToSwap]: currentRank
        });
      }
    }
  };

  const handleSubmit = () => {
    // Convert rankings to ordered arrays
    const orderedPriorities = {
      sleepPriorities: priorities.sleep,
      physicalPriorities: priorities.physical,
      mentalPriorities: priorities.mental,
      priorityRankings: rankings
    };
    
    setData(orderedPriorities);
    next();
  };

  const renderCheckbox = (
    category: 'sleep' | 'physical' | 'mental',
    value: string,
    label: string
  ) => {
    const isChecked = priorities[category].includes(value);
    const rank = isChecked ? rankings[`${category}-${value}`] : null;
    
    return (
      <div className="flex items-center justify-between mb-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
        <button
          type="button"
          onClick={() => handleTogglePriority(category, value)}
          className="flex items-center focus:outline-none"
        >
          {isChecked ? (
            <CheckSquare className="w-5 h-5 text-biowellGreen mr-2" />
          ) : (
            <Square className="w-5 h-5 text-gray-400 mr-2" />
          )}
          <span className="text-gray-300">{label}</span>
        </button>
        
        {isChecked && (
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-biowellGreen/20 flex items-center justify-center mr-2">
              <span className="text-biowellGreen text-xs font-semibold">{rank}</span>
            </div>
            <div className="flex flex-col">
              <button 
                onClick={() => adjustRanking(category, value, 'up')}
                disabled={rank === 1}
                className={`text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-0.5`}
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button 
                onClick={() => adjustRanking(category, value, 'down')}
                disabled={rank === 3 || rank === Object.keys(rankings).length}
                className={`text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-0.5`}
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
  
  // Count total selected priorities
  const totalSelected = Object.values(priorities).flat().length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">
        Wellness Priorities
      </h2>
      <p className="text-gray-400 mb-2">
        Select up to 3 primary goals, ranking them in order of importance (1 = highest priority)
      </p>
      
      <div className="flex items-center mb-6 p-3 rounded-lg bg-biowellGreen/10 border border-biowellGreen/20">
        <span className="text-biowellGreen font-medium">{totalSelected}/3 priorities selected</span>
        {totalSelected === 3 && (
          <span className="ml-2 text-sm text-biowellGreen">✓ Now you can rank them by importance</span>
        )}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-6"
      >
        {/* Sleep Priorities */}
        <motion.div variants={item} className="bg-gray-800 p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <Moon className="w-5 h-5 text-blue-400 mr-2" />
            <h4 className="text-lg font-medium text-white">Sleep</h4>
          </div>
          
          {renderCheckbox('sleep', 'fall_asleep_faster', 'Fall asleep faster')}
          {renderCheckbox('sleep', 'improve_sleep_quality', 'Improve sleep quality')}
          {renderCheckbox('sleep', 'better_morning_energy', 'Better morning energy')}
          {renderCheckbox('sleep', 'consistent_sleep', 'Consistent sleep schedule')}
        </motion.div>
        
        {/* Physical Priorities */}
        <motion.div variants={item} className="bg-gray-800 p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-green-400 mr-2" />
            <h4 className="text-lg font-medium text-white">Physical</h4>
          </div>
          
          {renderCheckbox('physical', 'weight_management', 'Weight management')}
          {renderCheckbox('physical', 'muscle_building', 'Muscle building')}
          {renderCheckbox('physical', 'cardio_fitness', 'Cardio fitness')}
          {renderCheckbox('physical', 'strength_gains', 'Strength gains')}
          {renderCheckbox('physical', 'sports_performance', 'Sports performance')}
          {renderCheckbox('physical', 'flexibility', 'Flexibility/mobility')}
        </motion.div>
        
        {/* Mental Priorities */}
        <motion.div variants={item} className="bg-gray-800 p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <Brain className="w-5 h-5 text-purple-400 mr-2" />
            <h4 className="text-lg font-medium text-white">Mental</h4>
          </div>
          
          {renderCheckbox('mental', 'stress_reduction', 'Stress reduction')}
          {renderCheckbox('mental', 'enhanced_focus', 'Enhanced focus')}
          {renderCheckbox('mental', 'emotional_wellbeing', 'Emotional wellbeing')}
          {renderCheckbox('mental', 'less_anxiety', 'Less anxiety')}
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={totalSelected === 0}
          className={`w-full font-semibold py-3 rounded-lg transition-colors ${
            totalSelected > 0 
              ? 'bg-biowellGreen text-black hover:bg-opacity-90' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
        
        {totalSelected === 0 && (
          <p className="text-center text-sm text-gray-400 mt-2">
            Please select at least one priority to continue
          </p>
        )}
      </motion.div>
    </div>
  );
}