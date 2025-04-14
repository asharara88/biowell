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

interface DashboardGoalWidgetProps {
  userId?: string;
  className?: string;
}

const DashboardGoalWidget: React.FC<DashboardGoalWidgetProps> = ({ 
  userId = '550e8400-e29b-41d4-a716-446655440000',
  className = ''
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define the available wellness goals
  const wellnessGoals = [
    {
      id: 'sleep',
      title: 'Improve Sleep',
      description: 'Optimize sleep quality and duration',
      icon: <Moon className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-400/10',
      metrics: ['Sleep Duration', 'Deep Sleep', 'Sleep Efficiency', 'Bedtime Consistency'],
      progress: [85, 72, 90, 65]
    },
    {
      id: 'energy',
      title: 'Boost Energy',
      description: 'Enhance daily vitality and focus',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-yellow-400 bg-yellow-400/10',
      metrics: ['Energy Levels', 'Glucose Stability', 'HRV', 'Activity'],
      progress: [75, 82, 68, 80]
    },
    {
      id: 'cognitive',
      title: 'Mental Clarity',
      description: 'Improve focus and cognitive function',
      icon: <Brain className="w-6 h-6" />,
      color: 'text-purple-400 bg-purple-400/10',
      metrics: ['Focus Duration', 'Cognitive Performance', 'Stress Levels', 'Sleep Quality'],
      progress: [70, 75, 65, 80]
    },
    {
      id: 'fitness',
      title: 'Physical Performance',
      description: 'Enhance strength and endurance',
      icon: <Dumbbell className="w-6 h-6" />,
      color: 'text-green-400 bg-green-400/10',
      metrics: ['Workout Intensity', 'Recovery Rate', 'Strength Progress', 'Endurance'],
      progress: [85, 70, 75, 80]
    },
    {
      id: 'wellness',
      title: 'Overall Wellness',
      description: 'Optimize general health and vitality',
      icon: <Heart className="w-6 h-6" />,
      color: 'text-red-400 bg-red-400/10',
      metrics: ['Sleep Quality', 'Activity Levels', 'Stress Management', 'Nutrition'],
      progress: [80, 75, 70, 85]
    },
    {
      id: 'longevity',
      title: 'Longevity',
      description: 'Support healthy aging and vitality',
      icon: <Leaf className="w-6 h-6" />,
      color: 'text-emerald-400 bg-emerald-400/10',
      metrics: ['Metabolic Health', 'Inflammation', 'Stress Resilience', 'Sleep Quality'],
      progress: [75, 70, 80, 85]
    },
    {
      id: 'stress',
      title: 'Stress Management',
      description: 'Reduce stress and improve resilience',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-orange-400 bg-orange-400/10',
      metrics: ['Stress Levels', 'HRV', 'Sleep Quality', 'Mindfulness Practice'],
      progress: [65, 70, 80, 60]
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

  // Get primary goal (first in the list)
  const primaryGoal = selectedGoals.length > 0 ? getGoalById(selectedGoals[0]) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-biowellGreen/20 rounded-lg mr-3">
            <Target className="w-5 h-5 text-biowellGreen" />
          </div>
          <h3 className="text-xl font-semibold text-white">Your Wellness Goals</h3>
        </div>
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
        <div className="space-y-6">
          {/* Primary Goal with Metrics */}
          {primaryGoal && (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${primaryGoal.color} mr-4`}>
                  {primaryGoal.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Primary: {primaryGoal.title}</h4>
                  <p className="text-sm text-gray-400">{primaryGoal.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {primaryGoal.metrics.map((metric, index) => (
                  <div key={metric} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <h5 className="text-white font-medium text-sm mb-1">{metric}</h5>
                    <div className="flex justify-between items-center">
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-biowellGreen h-1.5 rounded-full"
                          style={{ width: `${primaryGoal.progress[index]}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs ml-3">{primaryGoal.progress[index]}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Secondary Goals */}
          {selectedGoals.length > 1 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Additional Goals:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedGoals.slice(1).map(goalId => {
                  const goal = getGoalById(goalId);
                  if (!goal) return null;
                  
                  return (
                    <div 
                      key={goalId}
                      className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className={`p-2 rounded-lg ${goal.color} mr-3`}>
                        {goal.icon}
                      </div>
                      <div>
                        <h5 className="text-white font-medium">{goal.title}</h5>
                        <p className="text-xs text-gray-400">{goal.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
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

export default DashboardGoalWidget;