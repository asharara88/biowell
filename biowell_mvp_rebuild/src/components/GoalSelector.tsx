import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Moon, 
  Dumbbell, 
  Heart, 
  Zap, 
  ArrowUp, 
  ArrowDown, 
  CheckSquare, 
  Square, 
  AlertTriangle,
  X,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../api/client';

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface GoalSelectorProps {
  onGoalsChange?: (goals: string[]) => void;
  maxGoals?: number;
  userId?: string;
  className?: string;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({ 
  onGoalsChange, 
  maxGoals = 3,
  userId = '550e8400-e29b-41d4-a716-446655440000',
  className = '' 
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [goalPriorities, setGoalPriorities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showMaxGoalsWarning, setShowMaxGoalsWarning] = useState(false);

  // Define the available wellness goals
  const wellnessGoals: Goal[] = [
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
      icon: <Heart className="w-6 h-6" />,
      color: 'text-emerald-400 bg-emerald-400/10'
    },
    {
      id: 'stress',
      title: 'Stress Management',
      description: 'Reduce stress and improve resilience',
      icon: <Brain className="w-6 h-6" />,
      color: 'text-orange-400 bg-orange-400/10'
    }
  ];

  // Load saved goals on component mount
  useEffect(() => {
    loadSavedGoals();
  }, [userId]);

  // Notify parent component when goals change
  useEffect(() => {
    if (onGoalsChange) {
      onGoalsChange(selectedGoals);
    }
  }, [selectedGoals, onGoalsChange]);

  // Auto-hide max goals warning after 3 seconds
  useEffect(() => {
    if (showMaxGoalsWarning) {
      const timer = setTimeout(() => {
        setShowMaxGoalsWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMaxGoalsWarning]);

  const loadSavedGoals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('goals')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading goals:', error);
        return;
      }

      if (data?.goals) {
        let parsedGoals;
        if (typeof data.goals === 'string') {
          try {
            parsedGoals = JSON.parse(data.goals);
          } catch (e) {
            console.warn('Error parsing goals:', e);
            return;
          }
        } else {
          parsedGoals = data.goals;
        }

        if (parsedGoals.selectedGoals && Array.isArray(parsedGoals.selectedGoals)) {
          setSelectedGoals(parsedGoals.selectedGoals.slice(0, maxGoals));
        }

        if (parsedGoals.priorities && typeof parsedGoals.priorities === 'object') {
          setGoalPriorities(parsedGoals.priorities);
        }
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoals = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          goals: JSON.stringify({
            selectedGoals,
            priorities: goalPriorities,
            primary: selectedGoals[0] || null
          })
        });

      if (error) {
        throw error;
      }

      toast.success('Goals saved successfully');
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save goals');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      // If goal is already selected, remove it
      if (prev.includes(goalId)) {
        const newGoals = prev.filter(id => id !== goalId);
        
        // Update priorities when removing a goal
        const newPriorities = { ...goalPriorities };
        delete newPriorities[goalId];
        
        // Re-number remaining priorities
        Object.keys(newPriorities).forEach(key => {
          if (newPriorities[key] > goalPriorities[goalId]) {
            newPriorities[key] -= 1;
          }
        });
        
        setGoalPriorities(newPriorities);
        return newGoals;
      }
      
      // If adding a new goal
      if (prev.length >= maxGoals) {
        setShowMaxGoalsWarning(true);
        toast.warning(`You can select a maximum of ${maxGoals} goals`);
        return prev;
      }
      
      // Add the new goal
      const newGoals = [...prev, goalId];
      
      // Set priority for the new goal
      setGoalPriorities(priorities => ({
        ...priorities,
        [goalId]: newGoals.length
      }));
      
      return newGoals;
    });
  };

  const adjustPriority = (goalId: string, direction: 'up' | 'down') => {
    const currentPriority = goalPriorities[goalId];
    
    if (direction === 'up' && currentPriority > 1) {
      // Find the goal with priority - 1
      const goalToSwap = Object.keys(goalPriorities).find(
        id => goalPriorities[id] === currentPriority - 1
      );
      
      if (goalToSwap) {
        setGoalPriorities({
          ...goalPriorities,
          [goalId]: currentPriority - 1,
          [goalToSwap]: currentPriority
        });
      }
    } else if (direction === 'down' && currentPriority < selectedGoals.length) {
      // Find the goal with priority + 1
      const goalToSwap = Object.keys(goalPriorities).find(
        id => goalPriorities[id] === currentPriority + 1
      );
      
      if (goalToSwap) {
        setGoalPriorities({
          ...goalPriorities,
          [goalId]: currentPriority + 1,
          [goalToSwap]: currentPriority
        });
      }
    }
  };

  const clearAllGoals = () => {
    setSelectedGoals([]);
    setGoalPriorities({});
    toast.info('All goals cleared');
  };

  // Sort goals by priority for display
  const sortedSelectedGoals = [...selectedGoals].sort(
    (a, b) => (goalPriorities[a] || 999) - (goalPriorities[b] || 999)
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Select Your Goals:</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAllGoals}
            disabled={selectedGoals.length === 0 || isLoading}
            className="text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
          <button
            onClick={saveGoals}
            disabled={isLoading}
            className="text-sm bg-biowellGreen/20 text-biowellGreen px-3 py-1.5 rounded-lg hover:bg-biowellGreen/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckSquare className="w-4 h-4" />
            )}
            Save Goals
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg">
        <p className="text-gray-300 text-sm flex items-center">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
          Select up to {maxGoals} goals and prioritize them in order of importance
        </p>
      </div>

      <AnimatePresence>
        {showMaxGoalsWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-yellow-900/20 border border-yellow-800/30 p-3 rounded-lg"
          >
            <p className="text-yellow-400 text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              You can select a maximum of {maxGoals} goals
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Goals with Priority */}
      {selectedGoals.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-medium">Your Selected Goals:</h4>
          <div className="space-y-2">
            {sortedSelectedGoals.map(goalId => {
              const goal = wellnessGoals.find(g => g.id === goalId);
              if (!goal) return null;
              
              return (
                <div 
                  key={goalId}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${goal.color} mr-3`}>
                      {goal.icon}
                    </div>
                    <div>
                      <h5 className="text-white font-medium">{goal.title}</h5>
                      <p className="text-xs text-gray-400">{goal.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <button 
                        onClick={() => adjustPriority(goalId, 'up')}
                        disabled={goalPriorities[goalId] === 1 || isLoading}
                        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => adjustPriority(goalId, 'down')}
                        disabled={goalPriorities[goalId] === selectedGoals.length || isLoading}
                        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white font-medium">{goalPriorities[goalId]}</span>
                    </div>
                    
                    <button
                      onClick={() => toggleGoal(goalId)}
                      disabled={isLoading}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Goals */}
      <div className="space-y-2">
        <h4 className="text-white font-medium">Available Goals:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {wellnessGoals.map(goal => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              disabled={isLoading}
              className={`flex items-center p-3 rounded-lg transition-colors text-left ${
                selectedGoals.includes(goal.id)
                  ? 'bg-gray-700 border border-gray-600'
                  : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              {selectedGoals.includes(goal.id) ? (
                <CheckSquare className="w-5 h-5 text-biowellGreen mr-3" />
              ) : (
                <Square className="w-5 h-5 text-gray-400 mr-3" />
              )}
              
              <div className="flex items-center flex-1">
                <div className={`p-2 rounded-lg ${goal.color} mr-3`}>
                  {goal.icon}
                </div>
                <div>
                  <h5 className="text-white font-medium">{goal.title}</h5>
                  <p className="text-xs text-gray-400">{goal.description}</p>
                </div>
              </div>
              
              {selectedGoals.includes(goal.id) && (
                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center ml-2">
                  <span className="text-white text-xs">{goalPriorities[goal.id]}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveGoals}
          disabled={isLoading}
          className="px-4 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckSquare className="w-4 h-4" />
              Save Goals
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GoalSelector;