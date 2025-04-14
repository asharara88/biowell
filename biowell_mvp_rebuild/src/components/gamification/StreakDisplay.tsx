import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star, Calendar } from 'lucide-react';
import StreakBadge from './StreakBadge';
import type { Streak } from '../../types/gamification';

interface StreakDisplayProps {
  streakData: Streak;
  className?: string;
}

export default function StreakDisplay({ streakData, className = '' }: StreakDisplayProps) {
  const {
    currentStreak,
    bestStreak,
    weeklyStreak,
    milestones
  } = streakData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-400/10 rounded-lg flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Streak Stats</h2>
            <p className="text-sm text-gray-400">Keep up your momentum!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-gray-400">Current</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {currentStreak}
            <span className="text-sm text-gray-400 ml-1">days</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400">Best</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {bestStreak}
            <span className="text-sm text-gray-400 ml-1">days</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400">Weekly</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {weeklyStreak}
            <span className="text-sm text-gray-400 ml-1">days</span>
          </div>
        </div>
      </div>

      {milestones.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400">Milestones</h3>
          <div className="flex flex-wrap gap-2">
            {milestones.map((milestone) => (
              <StreakBadge
                key={milestone}
                streak={milestone}
                type="milestone"
                size="sm"
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}