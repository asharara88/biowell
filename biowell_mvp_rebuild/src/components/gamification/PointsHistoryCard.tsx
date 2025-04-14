import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Calendar,
  Flame,
  Target,
  Award,
  Gift,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import type { PointsTransaction } from '../../types/gamification';

interface PointsHistoryCardProps {
  transactions: PointsTransaction[];
  className?: string;
}

export default function PointsHistoryCard({ transactions, className = '' }: PointsHistoryCardProps) {
  const getSourceIcon = (source: PointsTransaction['source']) => {
    switch (source) {
      case 'habit': return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'streak': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'challenge': return <Target className="w-4 h-4 text-green-400" />;
      case 'achievement': return <Award className="w-4 h-4 text-yellow-400" />;
      case 'reward': return <Gift className="w-4 h-4 text-pink-400" />;
      case 'system': return <Settings className="w-4 h-4 text-blue-400" />;
      default: return <Settings className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: PointsTransaction['type']) => {
    switch (type) {
      case 'earned': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'spent': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'bonus': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'expired': return <TrendingDown className="w-4 h-4 text-gray-400" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Points History</h3>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-500">Complete activities to earn points</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 10).map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-700 rounded-lg mr-3">
                  {getSourceIcon(transaction.source)}
                </div>
                <div>
                  <p className="text-white text-sm">{transaction.description}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(new Date(transaction.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                {getTypeIcon(transaction.type)}
                <span className={`ml-1 font-medium ${
                  transaction.type === 'earned' || transaction.type === 'bonus'
                    ? 'text-green-400'
                    : transaction.type === 'spent'
                      ? 'text-red-400'
                      : 'text-gray-400'
                }`}>
                  {transaction.type === 'earned' || transaction.type === 'bonus' ? '+' : ''}
                  {transaction.amount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {transactions.length > 10 && (
        <button className="w-full mt-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm hover:bg-gray-700 transition-colors">
          View All Transactions
        </button>
      )}
    </div>
  );
}