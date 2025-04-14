import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Check, Plus, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  category: 'fitness' | 'nutrition' | 'sleep' | 'wellness';
  completed: boolean;
}

export default function CoachGoals() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Increase daily step count',
      description: 'Reach 10,000 steps per day consistently',
      progress: 65,
      dueDate: '2025-05-15',
      category: 'fitness',
      completed: false
    },
    {
      id: '2',
      title: 'Improve sleep quality',
      description: 'Achieve 7+ hours of quality sleep per night',
      progress: 80,
      dueDate: '2025-05-20',
      category: 'sleep',
      completed: false
    },
    {
      id: '3',
      title: 'Optimize nutrition',
      description: 'Track macronutrients and maintain balanced diet',
      progress: 40,
      dueDate: '2025-05-30',
      category: 'nutrition',
      completed: false
    },
    {
      id: '4',
      title: 'Complete daily meditation',
      description: 'Practice 10 minutes of mindfulness daily',
      progress: 100,
      dueDate: '2025-04-30',
      category: 'wellness',
      completed: true
    }
  ]);

  const [showCompleted, setShowCompleted] = useState(false);

  const toggleGoalCompletion = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 } 
        : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'bg-green-400/20 text-green-400';
      case 'nutrition': return 'bg-blue-400/20 text-blue-400';
      case 'sleep': return 'bg-purple-400/20 text-purple-400';
      case 'wellness': return 'bg-yellow-400/20 text-yellow-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">{t('coach.goals.title') || 'Your Goals'}</h3>
          <button className="flex items-center gap-2 text-sm text-biowellGreen">
            <Plus className="w-4 h-4" />
            {t('coach.goals.add') || 'Add Goal'}
          </button>
        </div>

        {/* Active Goals */}
        <div className="space-y-4">
          {activeGoals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(goal.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-white font-medium">{goal.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleGoalCompletion(goal.id)}
                    className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    title="Mark as complete"
                  >
                    <Check className="w-4 h-4 text-gray-300" />
                  </button>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 rounded-full bg-gray-700 hover:bg-red-900/50 transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-3">{goal.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-biowellGreen h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Completed Goals Toggle */}
        {completedGoals.length > 0 && (
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium">{t('coach.goals.completed') || 'Completed Goals'} ({completedGoals.length})</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-90' : ''}`} />
          </button>
        )}

        {/* Completed Goals */}
        {showCompleted && (
          <div className="space-y-4 pt-2">
            {completedGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 opacity-70"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(goal.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-white font-medium line-through">{goal.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleGoalCompletion(goal.id)}
                      className="p-1.5 rounded-full bg-biowellGreen/20 transition-colors"
                      title="Mark as incomplete"
                    >
                      <Check className="w-4 h-4 text-biowellGreen" />
                    </button>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 rounded-full bg-gray-700 hover:bg-red-900/50 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">{goal.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Completed</span>
                    <span className="text-biowellGreen">100%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-biowellGreen h-2 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add New Goal Button */}
        <motion.button
          whileHover={{ y: -2 }}
          className="w-full p-4 rounded-lg border border-dashed border-gray-700 text-gray-400 hover:border-biowellGreen hover:text-biowellGreen transition-colors flex items-center justify-center gap-2"
        >
          <Target className="w-5 h-5" />
          {t('coach.goals.createNew') || 'Create New Goal'}
        </motion.button>
      </div>
    </div>
  );
}