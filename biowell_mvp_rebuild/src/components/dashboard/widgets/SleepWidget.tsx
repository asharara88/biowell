import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Clock, TrendingUp, Brain, Activity, Heart } from 'lucide-react';

interface SleepMetric {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  change?: number;
}

export default function SleepWidget({ view = 'today' }) {
  const metrics: SleepMetric[] = [
    {
      label: 'Duration',
      value: '7.5',
      unit: 'hrs',
      icon: <Clock />,
      color: 'text-blue-400',
      change: 5
    },
    {
      label: 'Deep Sleep',
      value: '2.3',
      unit: 'hrs',
      icon: <Brain />,
      color: 'text-purple-400',
      change: 8
    },
    {
      label: 'REM',
      value: '1.8',
      unit: 'hrs',
      icon: <Activity />,
      color: 'text-green-400',
      change: -3
    },
    {
      label: 'Recovery',
      value: '92',
      unit: '%',
      icon: <Heart />,
      color: 'text-red-400',
      change: 12
    }
  ];

  const weeklyData = [
    { day: 'Mon', duration: 6.75, quality: 82 },
    { day: 'Tue', duration: 7.5, quality: 88 },
    { day: 'Wed', duration: 7.25, quality: 85 },
    { day: 'Thu', duration: 8, quality: 90 },
    { day: 'Fri', duration: 7, quality: 84 },
    { day: 'Sat', duration: 7.75, quality: 89 },
    { day: 'Sun', duration: 7.5, quality: 87 }
  ];

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-400/10 rounded-lg flex items-center justify-center">
            <Moon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-semibold text-white">Sleep Analysis</h2>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>Last night's data</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
          <span className="text-gray-400">+8% this week</span>
        </div>
      </div>

      {view === 'today' ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              variants={item}
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {React.cloneElement(metric.icon as React.ReactElement, {
                  className: `w-4 h-4 ${metric.color}`
                })}
                <span className="text-gray-400">{metric.label}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-white">
                  {metric.value}
                  <span className="text-sm text-gray-400 ml-1">{metric.unit}</span>
                </div>
                {metric.change && (
                  <div className={`flex items-center text-sm ${
                    metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      metric.change < 0 ? 'transform rotate-180' : ''
                    }`} />
                    {Math.abs(metric.change)}%
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-12">{day.day}</span>
                <div className="flex-1">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: `${(day.duration / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white">{day.duration}hrs</span>
                <div className={`px-2 py-1 rounded text-sm ${
                  day.quality >= 85 ? 'bg-green-400/20 text-green-400' :
                  day.quality >= 75 ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-red-400/20 text-red-400'
                }`}>
                  {day.quality}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Sleep Insight</h3>
        <p className="text-white text-sm">
          Your sleep quality has improved significantly. Maintaining consistent sleep and wake times is contributing to better recovery.
        </p>
      </div>
    </motion.div>
  );
}