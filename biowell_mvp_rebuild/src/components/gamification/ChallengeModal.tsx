import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Target, 
  Calendar, 
  Clock, 
  Award, 
  Users,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import type { Challenge } from '../../types/gamification';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
  onStart?: () => void;
  onContinue?: () => void;
}

export default function ChallengeModal({ 
  isOpen, 
  onClose, 
  challenge,
  onStart,
  onContinue
}: ChallengeModalProps) {
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const isActive = new Date(challenge.startDate) <= new Date() && new Date(challenge.endDate) >= new Date();
  const isExpired = new Date(challenge.endDate) < new Date();
  const progressPercentage = Math.min(100, (challenge.progress / challenge.maxProgress) * 100);

  // Sample leaderboard data with Arabic and Western names
  const sampleLeaderboard = [
    { userId: '1', username: 'محمد الحسن', rank: 1, score: 95 },
    { userId: '2', username: 'Emma Wilson', rank: 2, score: 87 },
    { userId: '3', username: 'أحمد خالد', rank: 3, score: 82 },
    { userId: '4', username: 'Sarah Johnson', rank: 4, score: 78 },
    { userId: '5', username: 'ياسمين علي', rank: 5, score: 75 }
  ];

  // Use sample leaderboard if challenge doesn't have one
  const leaderboard = challenge.leaderboard || sampleLeaderboard;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-gray-900 rounded-xl max-w-md w-full border border-gray-800 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-biowellGreen/20 rounded-lg mr-3">
                  <Target className="w-6 h-6 text-biowellGreen" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-400">
                      {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)} Challenge
                    </span>
                    <span className={`ml-3 text-sm ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">{challenge.description}</p>
              
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-300">Time Remaining</span>
                  </div>
                  
                  {isExpired ? (
                    <span className="text-red-400">Expired</span>
                  ) : (
                    <span className="text-white">
                      {format(new Date(challenge.endDate), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-gray-300">Reward</span>
                  </div>
                  <span className="text-biowellGreen font-medium">+{challenge.points} points</span>
                </div>
                
                {challenge.participants && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-gray-300">Participants</span>
                    </div>
                    <span className="text-white">{challenge.participants}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-white">{challenge.progress}/{challenge.maxProgress}</span>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-biowellGreen"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              
              {leaderboard && leaderboard.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 text-biowellGreen mr-2" />
                    Leaderboard
                  </h3>
                  
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    {leaderboard.slice(0, 5).map((entry, index) => (
                      <div 
                        key={entry.userId}
                        className={`flex items-center justify-between p-3 ${
                          index < leaderboard.length - 1 ? 'border-b border-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-6 text-center font-bold text-gray-400 mr-2">
                            {entry.rank}
                          </div>
                          <span className="text-white">{entry.username}</span>
                        </div>
                        <span className="text-biowellGreen font-medium">{entry.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {challenge.completed ? (
                <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="text-white font-medium">Challenge Completed!</h4>
                  <p className="text-sm text-gray-400">You've earned {challenge.points} points</p>
                </div>
              ) : isExpired ? (
                <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 text-center">
                  <h4 className="text-white font-medium">Challenge Expired</h4>
                  <p className="text-sm text-gray-400">This challenge is no longer available</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  
                  {isActive && (
                    <button
                      onClick={challenge.progress > 0 ? onContinue : onStart}
                      className="flex-1 py-3 bg-biowellGreen text-black rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      {challenge.progress > 0 ? 'Continue' : 'Start Challenge'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}