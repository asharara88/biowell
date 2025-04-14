import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, Activity, Heart, Brain, Zap } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function CoachInsights() {
  const { t } = useTranslation();
  
  const insights = [
    {
      id: 'sleep',
      title: 'Sleep Quality Improving',
      description: 'Your sleep quality has improved by 15% over the past week. Continue your current sleep routine for optimal results.',
      metric: '7.5 hrs',
      change: '+15%',
      positive: true,
      icon: <Brain className="w-5 h-5 text-blue-400" />,
      timestamp: '2 hours ago'
    },
    {
      id: 'activity',
      title: 'Activity Level Decreasing',
      description: 'Your daily step count has decreased by 20% compared to last week. Consider adding a short walk to your daily routine.',
      metric: '6,500 steps',
      change: '-20%',
      positive: false,
      icon: <Activity className="w-5 h-5 text-green-400" />,
      timestamp: '1 day ago'
    },
    {
      id: 'recovery',
      title: 'Recovery Score Stable',
      description: 'Your recovery metrics remain consistent. Your current supplement stack appears to be supporting your recovery needs.',
      metric: '85%',
      change: '0%',
      positive: true,
      icon: <Heart className="w-5 h-5 text-red-400" />,
      timestamp: '3 days ago'
    }
  ];

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{t('coach.insights.title') || 'Recent Insights'}</h3>
          <div className="flex items-center text-sm text-gray-400">
            <Sparkles className="w-4 h-4 mr-1 text-biowellGreen" />
            <span>{t('coach.insights.personalized') || 'Personalized for you'}</span>
          </div>
        </div>

        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-5 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-gray-700 mr-3">
                  {insight.icon}
                </div>
                <h4 className="text-lg font-medium text-white">{insight.title}</h4>
              </div>
              <div className={`flex items-center text-sm ${
                insight.positive ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  !insight.positive ? 'transform rotate-180' : ''
                }`} />
                {insight.change}
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{insight.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {insight.timestamp}
              </div>
              <div className="text-biowellGreen font-medium">
                {insight.metric}
              </div>
            </div>
          </motion.div>
        ))}

        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-white">{t('coach.insights.weeklyTitle') || 'Weekly Summary'}</h4>
            <div className="text-sm text-gray-400">Apr 5 - Apr 11</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">{t('coach.insights.energy') || 'Energy'}</span>
              </div>
              <div className="text-xl font-semibold text-white">82%</div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{t('coach.insights.focus') || 'Focus'}</span>
              </div>
              <div className="text-xl font-semibold text-white">75%</div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">{t('coach.insights.recovery') || 'Recovery'}</span>
              </div>
              <div className="text-xl font-semibold text-white">88%</div>
            </div>
          </div>
          
          <p className="text-gray-300">
            {t('coach.insights.summary') || 'Your overall wellness score is trending positively. Focus on maintaining your sleep quality while increasing daily activity for optimal results.'}
          </p>
        </div>
      </div>
    </div>
  );
}