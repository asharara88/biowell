import React from 'react';
import { motion } from 'framer-motion';
import DashboardTabs from './DashboardTabs';
import WellnessScoreWidget from './widgets/WellnessScoreWidget';
import SleepWidget from './widgets/SleepWidget';
import NutritionWidget from './widgets/NutritionWidget';
import MoodWidget from './widgets/MoodWidget';
import { Brain, Activity, Heart } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black pt-16 px-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Wellness Dashboard</h1>
            <p className="text-gray-400">Track and optimize your daily wellness metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-white">
              <Activity className="w-4 h-4 text-biowellGreen" />
              <span>Today's Score: 85</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <WellnessScoreWidget />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DashboardTabs />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SleepWidget />
            </motion.div>
          </div>

          {/* Right Column - Additional Metrics */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NutritionWidget />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MoodWidget />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-gray-400">Recovery</span>
                </div>
                <div className="text-2xl font-bold text-white">85%</div>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400">Focus</span>
                </div>
                <div className="text-2xl font-bold text-white">92%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}