import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Moon, 
  Dumbbell, 
  Heart, 
  Zap, 
  Leaf,
  Activity,
  ArrowRight,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../api/client';

interface GoalSelectionWidgetProps {
  userId?: string;
  className?: string;
  maxDisplay?: number;
}

const GoalSelectionWidget: React.FC<GoalSelectionWidgetProps> = ({ 
  userId = '550e8400-e29b-41d4-a716-446655440000',
  className = '',
  maxDisplay = 3
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define the available wellness goals
  const wellnessGoals = [
    {
      id: 'sleep',
      title: 'Improve Sleep',
      description: 'Optimize sleep quality and establish healthy sleep patterns',
      icon: <Moon className="w-5 h-5" />,
      color: 'text-blue-400 bg-blue-400/10'
    },
    {
      id: 'energy',
      title: 'Boost Energy',
      description: 'Increase daily vitality and maintain sustained energy levels',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-400 bg-yellow-400/10'
    },
    {
      id: 'cognitive',
      title: 'Mental Clarity',
      description: 'Enhance focus, memory, and cognitive performance',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-purple-400 bg-purple-400/10'
    },
    {
      id: 'fitness',
      title: 'Physical Performance',
      description: 'Build strength, endurance, and athletic capability',
      icon: <Dumbbell className="w-5 h-5" />,
      color: 'text-green-400 bg-green-400/10'
    },
    {
      id: 'wellness',
      title: 'Overall Wellness',
      description: 'Optimize general health, immunity, and daily vitality',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-red-400 bg-red-400/10'
    },
    {
      id: 'longevity',
      title: 'Longevity',
      description: 'Support healthy aging and long-term vitality',
      icon: <Leaf className="w-5 h-5" />,
      color: 'text-emerald-400 bg-emerald-400/10'
    },
    {
      id: 'stress',
      title: 'Stress Management',
      description: 'Reduce stress and improve resilience',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-orange-400 bg-orange-400/10'
    }
  ];

  // Load saved goals on component mount
  useEffect(() => {
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
            setSelectedGoals(parsedGoals.selectedGoals);
          }
        }
      } catch (error) {
        console.error('Error loading goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedGoals();
  }, [userId]);

  // Get goal details by ID
  const getGoalById = (goalId: string) => {
    return wellnessGoals.find(goal => goal.id === goalId);
  };

  // Display only the first maxDisplay goals
  const displayGoals = selectedGoals.slice(0, maxDisplay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Your Wellness Goals</h3>
        <Link 
          to="/settings/goals" 
          className="text-biowellGreen hover:text-biowellGreen/80 transition-colors text-sm flex items-center"
        >
          Manage Goals
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-biowellGreen"></div>
        </div>
      ) : selectedGoals.length > 0 ? (
        <div className="space-y-3">
          {displayGoals.map((goalId, index) => {
            const goal = getGoalById(goalId);
            if (!goal) return null;
            
            return (
              <div 
                key={goalId}
                className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-medium">{index + 1}</span>
                </div>
                <div className={`p-2 rounded-lg ${goal.color} mr-3`}>
                  {goal.icon}
                </div>
                <div>
                  <h4 className="text-white font-medium">{goal.title}</h4>
                  <p className="text-xs text-gray-400">{goal.description}</p>
                </div>
              </div>
            );
          })}
          
          {selectedGoals.length > maxDisplay && (
            <div className="text-center text-gray-400 text-sm pt-2">
              +{selectedGoals.length - maxDisplay} more goals
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400 mb-4">You haven't set any wellness goals yet.</p>
          <Link 
            to="/settings/goals" 
            className="inline-block px-4 py-2 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Set Your Goals
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default GoalSelectionWidget;