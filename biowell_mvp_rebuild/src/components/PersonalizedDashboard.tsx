import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Moon, 
  Dumbbell, 
  Heart, 
  Zap, 
  Activity, 
  Target, 
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import WellnessDeviceHub from './WellnessDeviceHub';
import { toast } from 'react-toastify';

interface PersonalizedDashboardProps {
  className?: string;
}

const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({ className = '' }) => {
  const { goals, isLoading } = useUser();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  
  // Get the goal icon and color based on the primary goal
  const getGoalDetails = () => {
    switch (goals) {
      case 'sleep':
        return { 
          icon: <Moon className="w-6 h-6" />, 
          color: 'text-blue-400 bg-blue-400/10',
          title: 'Improve Sleep',
          metrics: ['Sleep Duration', 'Deep Sleep', 'Sleep Efficiency', 'Bedtime Consistency']
        };
      case 'energy':
        return { 
          icon: <Zap className="w-6 h-6" />, 
          color: 'text-yellow-400 bg-yellow-400/10',
          title: 'Boost Energy',
          metrics: ['Energy Levels', 'Glucose Stability', 'HRV', 'Activity']
        };
      case 'cognitive':
        return { 
          icon: <Brain className="w-6 h-6" />, 
          color: 'text-purple-400 bg-purple-400/10',
          title: 'Mental Clarity',
          metrics: ['Focus Duration', 'Cognitive Performance', 'Stress Levels', 'Sleep Quality']
        };
      case 'fitness':
        return { 
          icon: <Dumbbell className="w-6 h-6" />, 
          color: 'text-green-400 bg-green-400/10',
          title: 'Physical Performance',
          metrics: ['Workout Intensity', 'Recovery Rate', 'Strength Progress', 'Endurance']
        };
      case 'wellness':
      default:
        return { 
          icon: <Heart className="w-6 h-6" />, 
          color: 'text-red-400 bg-red-400/10',
          title: 'Overall Wellness',
          metrics: ['Sleep Quality', 'Activity Levels', 'Stress Management', 'Nutrition']
        };
    }
  };
  
  const goalDetails = getGoalDetails();
  
  const handleGenerateInsights = () => {
    setIsGeneratingInsights(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingInsights(false);
      toast.success('New insights generated based on your data');
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 flex items-center justify-center ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-biowellGreen" />
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Goal Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-xl p-6 border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${goalDetails.color} mr-4`}>
              {goalDetails.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Primary Goal: {goalDetails.title}</h2>
              <p className="text-gray-400">Personalized dashboard based on your wellness priorities</p>
            </div>
          </div>
          
          <Link
            to="/goals"
            className="text-biowellGreen hover:text-biowellGreen/80 transition-colors text-sm flex items-center"
          >
            Manage Goals
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goalDetails.metrics.map((metric, index) => (
            <div key={metric} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-1">{metric}</h3>
              <div className="flex justify-between items-center">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-biowellGreen h-2 rounded-full"
                    style={{ width: `${65 + (index * 5)}%` }}
                  />
                </div>
                <span className="text-gray-400 text-sm ml-3">{65 + (index * 5)}%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-400">
            <Sparkles className="w-4 h-4 text-biowellGreen mr-1" />
            <span>Last updated: Today at 9:45 AM</span>
          </div>
          
          <button
            onClick={handleGenerateInsights}
            disabled={isGeneratingInsights}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGeneratingInsights ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Generate New Insights
              </>
            )}
          </button>
        </div>
      </motion.div>
      
      {/* Device Connection Hub */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <WellnessDeviceHub />
      </motion.div>
      
      {/* Personalized Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-xl p-6 border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-biowellGreen/10 mr-4">
              <Sparkles className="w-6 h-6 text-biowellGreen" />
            </div>
            <h2 className="text-xl font-bold text-white">Personalized Recommendations</h2>
          </div>
          
          <Link
            to="/coach"
            className="text-biowellGreen hover:text-biowellGreen/80 transition-colors text-sm flex items-center"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10 mr-2">
                <Moon className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-white font-medium">Sleep Optimization</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Based on your sleep patterns, consider taking magnesium glycinate (300mg) 1 hour before bed.
            </p>
            <Link
              to="/coach"
              className="text-biowellGreen hover:text-biowellGreen/80 transition-colors text-sm flex items-center"
            >
              Learn more
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-green-500/10 mr-2">
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <h3 className="text-white font-medium">Movement Pattern</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Try incorporating 5-minute movement breaks every hour during your afternoon work sessions.
            </p>
            <Link
              to="/coach"
              className="text-biowellGreen hover:text-biowellGreen/80 transition-colors text-sm flex items-center"
            >
              Learn more
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 mr-2">
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <h3 className="text-white font-medium">Energy Enhancement</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Your energy dips around 3pm. Consider a B-complex supplement with your lunch.
            </p>
            <Link
              to="/coach"
              className="text-biowellGreen hover:text-biowellGreen/80 transition-colors text-sm flex items-center"
            >
              Learn more
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalizedDashboard;