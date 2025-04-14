import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Gift, 
  Palette, 
  BookOpen, 
  Key, 
  Percent,
  Lock,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import type { Reward } from '../../types/gamification';

interface RewardCardProps {
  reward: Reward;
  onClaim?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function RewardCard({ 
  reward, 
  onClaim, 
  disabled = false,
  className = '' 
}: RewardCardProps) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award className="w-6 h-6" />;
      case 'gift': return <Gift className="w-6 h-6" />;
      case 'palette': return <Palette className="w-6 h-6" />;
      case 'book-open': return <BookOpen className="w-6 h-6" />;
      case 'key': return <Key className="w-6 h-6" />;
      case 'percent': return <Percent className="w-6 h-6" />;
      default: return <Gift className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: Reward['type']) => {
    switch (type) {
      case 'badge': return 'from-yellow-400 to-amber-600';
      case 'feature': return 'from-blue-400 to-indigo-600';
      case 'discount': return 'from-green-400 to-emerald-600';
      case 'content': return 'from-purple-400 to-fuchsia-600';
      case 'virtual': return 'from-pink-400 to-rose-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`
        bg-gray-800 rounded-lg overflow-hidden border border-gray-700
        ${className}
      `}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            bg-gradient-to-br ${getTypeColor(reward.type)}
          `}>
            {React.cloneElement(getIconComponent(reward.icon), { className: 'text-white' })}
          </div>
          <div className="ml-3">
            <h3 className="text-white font-medium">{reward.title}</h3>
            <p className="text-xs text-gray-400">
              {reward.type.charAt(0).toUpperCase() + reward.type.slice(1)} Reward
            </p>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4">{reward.description}</p>

        {reward.claimed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-400 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Claimed
            </div>
            
            {reward.claimedAt && (
              <div className="text-xs text-gray-400">
                {format(new Date(reward.claimedAt), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onClaim}
            disabled={disabled}
            className={`
              w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2
              ${disabled 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-biowellGreen text-black hover:bg-opacity-90 transition-colors'}
            `}
          >
            {disabled ? (
              <>
                <Lock className="w-4 h-4" />
                Locked
              </>
            ) : (
              <>
                <Gift className="w-4 h-4" />
                Claim Reward
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}