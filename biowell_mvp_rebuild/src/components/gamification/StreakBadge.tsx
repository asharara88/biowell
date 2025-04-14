import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  type?: 'daily' | 'weekly' | 'milestone';
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  className?: string;
}

export default function StreakBadge({
  streak,
  type = 'daily',
  size = 'md',
  showAnimation = true,
  className = ''
}: StreakBadgeProps) {
  const sizes = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg'
  };

  const icons = {
    daily: Flame,
    weekly: Star,
    milestone: Trophy
  };

  const colors = {
    daily: 'bg-orange-400/10 text-orange-400',
    weekly: 'bg-purple-400/10 text-purple-400',
    milestone: 'bg-yellow-400/10 text-yellow-400'
  };

  const Icon = icons[type];

  const badge = (
    <div
      className={`
        flex items-center gap-2 rounded-lg font-medium
        ${sizes[size]}
        ${colors[type]}
        ${className}
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{streak}</span>
      {type === 'daily' && <span>days</span>}
      {type === 'weekly' && <span>weeks</span>}
    </div>
  );

  if (!showAnimation) return badge;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {badge}
    </motion.div>
  );
}