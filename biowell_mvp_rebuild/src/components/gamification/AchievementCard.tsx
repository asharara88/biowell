import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Lock, 
  Trophy, 
  Star, 
  Medal, 
  Crown, 
  Sparkles,
  Calendar,
  Flame,
  Target,
  Users,
  Footprints,
  Repeat,
  CalendarCheck,
  Compass,
  Pill,
  Activity,
  UserCheck,
  Flag,
  Share
} from 'lucide-react';
import type { Achievement } from '../../types/gamification';

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
  className?: string;
}

export default function AchievementCard({ achievement, onClick, className = '' }: AchievementCardProps) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award />;
      case 'trophy': return <Trophy />;
      case 'star': return <Star />;
      case 'medal': return <Medal />;
      case 'crown': return <Crown />;
      case 'sparkles': return <Sparkles />;
      case 'calendar': return <Calendar />;
      case 'flame': return <Flame />;
      case 'target': return <Target />;
      case 'users': return <Users />;
      case 'footprints': return <Footprints />;
      case 'repeat': return <Repeat />;
      case 'calendar-check': return <CalendarCheck />;
      case 'compass': return <Compass />;
      case 'pill': return <Pill />;
      case 'activity': return <Activity />;
      case 'user-check': return <UserCheck />;
      case 'flag': return <Flag />;
      case 'share': return <Share />;
      default: return <Award />;
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-green-400 to-green-600';
      case 'uncommon': return 'from-blue-400 to-blue-600';
      case 'rare': return 'from-purple-400 to-purple-600';
      case 'epic': return 'from-pink-400 to-pink-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityTextColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-green-400';
      case 'uncommon': return 'text-blue-400';
      case 'rare': return 'text-purple-400';
      case 'epic': return 'text-pink-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`
        relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700
        ${achievement.unlocked ? 'cursor-pointer' : 'opacity-70'}
        ${className}
      `}
    >
      {/* Rarity indicator */}
      <div className={`absolute top-0 right-0 w-0 h-0 
        border-t-[40px] border-r-[40px] 
        border-t-transparent 
        border-r-${getRarityColor(achievement.rarity)}`}
      />

      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${achievement.unlocked 
              ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}` 
              : 'bg-gray-700'}
          `}>
            {achievement.unlocked 
              ? React.cloneElement(getIconComponent(achievement.icon), { className: 'w-6 h-6 text-white' })
              : <Lock className="w-6 h-6 text-gray-500" />
            }
          </div>
          <div className="ml-3">
            <h3 className="text-white font-medium">{achievement.title}</h3>
            <p className={`text-xs ${getRarityTextColor(achievement.rarity)}`}>
              {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
            </p>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>

        <div className="flex justify-between items-center">
          <div className="text-biowellGreen font-medium">+{achievement.points} pts</div>
          
          {achievement.progress !== undefined && achievement.maxProgress !== undefined && !achievement.unlocked && (
            <div className="text-xs text-gray-400">
              {achievement.progress}/{achievement.maxProgress}
            </div>
          )}
          
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="text-xs text-gray-400">
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {achievement.progress !== undefined && achievement.maxProgress !== undefined && !achievement.unlocked && (
          <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
              style={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}