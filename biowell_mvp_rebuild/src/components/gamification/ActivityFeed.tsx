import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  TrendingUp, 
  Target, 
  Flame, 
  Calendar, 
  Gift,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import type { ActivityLogEntry } from '../../types/gamification';

interface ActivityFeedProps {
  activities: ActivityLogEntry[];
  className?: string;
}

export default function ActivityFeed({ activities, className = '' }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityLogEntry['type']) => {
    switch (type) {
      case 'achievement': return <Award className="w-5 h-5 text-yellow-400" />;
      case 'level_up': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'challenge': return <Target className="w-5 h-5 text-green-400" />;
      case 'streak': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'habit': return <Calendar className="w-5 h-5 text-purple-400" />;
      case 'reward': return <Gift className="w-5 h-5 text-pink-400" />;
      default: return <Award className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return format(activityTime, 'MMM d');
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Activity Feed</h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No activities yet</p>
          <p className="text-sm text-gray-500">Complete tasks to see your activity here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg"
            >
              <div className="p-2 bg-gray-700 rounded-lg shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white">{activity.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {getTimeAgo(activity.timestamp)}
                </div>
              </div>
              
              {activity.points !== 0 && (
                <div className={`text-sm font-medium ${
                  activity.points > 0 ? 'text-biowellGreen' : 'text-red-400'
                }`}>
                  {activity.points > 0 ? '+' : ''}{activity.points} pts
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}