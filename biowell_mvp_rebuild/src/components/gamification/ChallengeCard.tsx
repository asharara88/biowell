import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Award, 
  Target, 
  Users,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import type { Challenge } from '../../types/gamification';

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: () => void;
  onView?: () => void;
  className?: string;
}

export default function ChallengeCard({ 
  challenge, 
  onStart, 
  onView,
  className = '' 
}: ChallengeCardProps) {
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: Challenge['category']) => {
    switch (category) {
      case 'daily': return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'weekly': return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'monthly': return <Calendar className="w-4 h-4 text-pink-400" />;
      case 'special': return <Award className="w-4 h-4 text-yellow-400" />;
      default: return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const isActive = new Date(challenge.startDate) <= new Date() && new Date(challenge.endDate) >= new Date();
  const isExpired = new Date(challenge.endDate) < new Date();
  const progressPercentage = Math.min(100, (challenge.progress / challenge.maxProgress) * 100);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`
        bg-gray-800 rounded-lg overflow-hidden border border-gray-700
        ${className}
      `}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="p-2 bg-gray-700 rounded-lg mr-3">
              <Target className="w-5 h-5 text-biowellGreen" />
            </div>
            <div>
              <h3 className="text-white font-medium">{challenge.title}</h3>
              <div className="flex items-center mt-1">
                {getCategoryIcon(challenge.category)}
                <span className="text-xs text-gray-400 ml-1">
                  {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                </span>
                <span className={`text-xs ml-3 ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          {challenge.completed && (
            <div className="bg-green-900/30 p-1 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            {isExpired 
              ? 'Expired' 
              : `Ends: ${format(new Date(challenge.endDate), 'MMM d, yyyy')}`
            }
          </div>
          <div className="text-biowellGreen font-medium">+{challenge.points} pts</div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div 
            className="h-2 rounded-full bg-biowellGreen"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            {challenge.progress}/{challenge.maxProgress} completed
          </div>
          
          {challenge.participants && (
            <div className="flex items-center text-xs text-gray-400">
              <Users className="w-3 h-3 mr-1" />
              {challenge.participants} participants
            </div>
          )}
        </div>

        {!challenge.completed && isActive && onStart && (
          <button
            onClick={onStart}
            className="mt-4 w-full py-2 bg-biowellGreen text-black rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            {challenge.progress > 0 ? 'Continue Challenge' : 'Start Challenge'}
          </button>
        )}

        {challenge.completed && onView && (
          <button
            onClick={onView}
            className="mt-4 w-full py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            View Details
          </button>
        )}

        {isExpired && !challenge.completed && (
          <div className="mt-4 w-full py-2 bg-gray-700 text-gray-400 rounded-lg font-medium text-center">
            Challenge Expired
          </div>
        )}
      </div>
    </motion.div>
  );
}