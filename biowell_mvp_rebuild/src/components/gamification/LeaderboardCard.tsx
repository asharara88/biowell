import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import type { LeaderboardEntry } from '../../types/gamification';

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
  title?: string;
  className?: string;
}

export default function LeaderboardCard({ 
  entries, 
  currentUserId,
  title = 'Leaderboard',
  className = '' 
}: LeaderboardCardProps) {
  // Sort entries by score (descending)
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);
  
  // Find current user's position
  const currentUserEntry = sortedEntries.find(entry => entry.userId === currentUserId);
  const currentUserRank = currentUserEntry?.rank || 0;

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-400/10 rounded-lg mr-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        
        <div className="flex items-center text-sm text-gray-400">
          <Users className="w-4 h-4 mr-1" />
          {entries.length} participants
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No participants yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEntries.slice(0, 10).map((entry, index) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center p-3 rounded-lg
                ${entry.userId === currentUserId 
                  ? 'bg-biowellGreen/10 border border-biowellGreen/30' 
                  : 'bg-gray-800'}
              `}
            >
              <div className="w-8 text-center font-bold">
                {index === 0 && <Trophy className="w-5 h-5 text-yellow-400 mx-auto" />}
                {index === 1 && <Medal className="w-5 h-5 text-gray-400 mx-auto" />}
                {index === 2 && <Award className="w-5 h-5 text-amber-700 mx-auto" />}
                {index > 2 && <span className="text-gray-400">{index + 1}</span>}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  {entry.avatar ? (
                    <img 
                      src={entry.avatar} 
                      alt={entry.username} 
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-700 mr-2" />
                  )}
                  <span className={`font-medium ${
                    entry.userId === currentUserId ? 'text-biowellGreen' : 'text-white'
                  }`}>
                    {entry.username}
                    {entry.userId === currentUserId && ' (You)'}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-white">{entry.score}</div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {entries.length > 10 && currentUserRank > 10 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-3 rounded-lg bg-biowellGreen/10 border border-biowellGreen/30"
          >
            <div className="w-8 text-center">
              <span className="text-gray-400">{currentUserRank}</span>
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                {currentUserEntry?.avatar ? (
                  <img 
                    src={currentUserEntry.avatar} 
                    alt={currentUserEntry.username} 
                    className="w-6 h-6 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-700 mr-2" />
                )}
                <span className="font-medium text-biowellGreen">
                  {currentUserEntry?.username} (You)
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-white">{currentUserEntry?.score}</div>
              <div className="text-xs text-gray-400">points</div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}