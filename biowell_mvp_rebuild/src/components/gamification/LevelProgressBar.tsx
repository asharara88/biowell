import React from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronRight, Sparkles } from 'lucide-react';
import type { Level } from '../../types/gamification';

interface LevelProgressBarProps {
  currentLevel: number;
  totalPoints: number;
  levels: Level[];
  className?: string;
}

export default function LevelProgressBar({ 
  currentLevel, 
  totalPoints, 
  levels,
  className = '' 
}: LevelProgressBarProps) {
  // Find current level details
  const currentLevelDetails = levels.find(l => l.level === currentLevel);
  if (!currentLevelDetails) return null;
  
  // Find next level details
  const nextLevelDetails = levels.find(l => l.level === currentLevel + 1);
  
  // Calculate progress percentage
  const pointsInCurrentLevel = totalPoints - currentLevelDetails.minPoints;
  const pointsRequiredForNextLevel = nextLevelDetails 
    ? nextLevelDetails.minPoints - currentLevelDetails.minPoints
    : 0;
  
  const progressPercentage = nextLevelDetails
    ? Math.min(100, (pointsInCurrentLevel / pointsRequiredForNextLevel) * 100)
    : 100;

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-biowellGreen/20 rounded-lg mr-3">
            <Sparkles className="w-5 h-5 text-biowellGreen" />
          </div>
          <div>
            <h3 className="text-white font-medium">Level Progress</h3>
            <p className="text-sm text-gray-400">{totalPoints} total points</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="p-2 bg-gray-800 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-biowellGreen" />
          </div>
          
          {nextLevelDetails && (
            <>
              <ChevronRight className="mx-2 text-gray-600" />
              <div className="p-2 bg-gray-800 rounded-lg opacity-50 flex items-center justify-center">
                <Award className="w-5 h-5 text-gray-400" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-white font-medium">Level {currentLevel}</span>
            <span className="text-gray-400 ml-2">{currentLevelDetails.title}</span>
          </div>
          
          {nextLevelDetails && (
            <div className="text-sm text-gray-400">
              {pointsRequiredForNextLevel - pointsInCurrentLevel} points to Level {currentLevel + 1}
            </div>
          )}
        </div>
        
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <motion.div 
            className="h-2.5 rounded-full bg-biowellGreen"
            style={{ width: `${progressPercentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <div>{currentLevelDetails.minPoints}</div>
        {nextLevelDetails ? (
          <div>{nextLevelDetails.minPoints}</div>
        ) : (
          <div>∞</div>
        )}
      </div>
    </div>
  );
}