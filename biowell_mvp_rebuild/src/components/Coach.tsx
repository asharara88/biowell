import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import FocusSelector from './FocusSelector';
import MoodTracker from './MoodTracker';
import CoachTip from './CoachTip';
import DailyRecommendations from './DailyRecommendations';
import SleepScore from './SleepScore';

export default function Coach() {
  const [selectedFocus, setSelectedFocus] = useState('sleep');

  const handleFocusChange = (focus: string) => {
    setSelectedFocus(focus);
    // In a real app, this would trigger personalized recommendations
  };

  const handleMoodSelect = (mood: string) => {
    console.log('Mood selected:', mood);
    // In a real app, this would update the user's mood in the database
  };

  const handleRecommendationComplete = (id: string) => {
    console.log('Recommendation completed:', id);
    // In a real app, this would mark the recommendation as complete
  };

  return (
    <div className="min-h-screen bg-black pt-16 px-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Personal Health Consultant</h1>
            <p className="text-gray-400">Your AI-powered wellness companion</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Consultant</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FocusSelector
                selectedFocus={selectedFocus}
                onFocusChange={handleFocusChange}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DailyRecommendations
                onComplete={handleRecommendationComplete}
                onViewAll={() => console.log('View all recommendations')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SleepScore />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CoachTip
                tip="Based on your sleep patterns, try reducing screen time 2 hours before bed for better sleep quality."
                category="Sleep Optimization"
                timing="Evening"
                onActionClick={() => console.log('Health consultant tip action clicked')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MoodTracker onMoodSelect={handleMoodSelect} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}