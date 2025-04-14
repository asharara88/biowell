import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Check, Clock, Flame, Gift, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useGamificationStore } from '../../store/gamificationStore';
import { toast } from 'react-toastify';

interface DailyCheckInCardProps {
  className?: string;
  onComplete?: () => void;
}

export default function DailyCheckInCard({ className = '', onComplete }: DailyCheckInCardProps) {
  const { userProgress, updateStreak } = useGamificationStore();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Check if already checked in today
  useEffect(() => {
    if (userProgress.streak.lastCompletedAt) {
      const lastCheckedIn = new Date(userProgress.streak.lastCompletedAt);
      const today = new Date();
      
      if (
        lastCheckedIn.getDate() === today.getDate() &&
        lastCheckedIn.getMonth() === today.getMonth() &&
        lastCheckedIn.getFullYear() === today.getFullYear()
      ) {
        setIsCheckedIn(true);
      }
    }
  }, [userProgress.streak.lastCompletedAt]);

  // Calculate time until next check-in
  useEffect(() => {
    if (isCheckedIn) {
      const updateTimeLeft = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diffMs = tomorrow.getTime() - now.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${diffHrs}h ${diffMins}m`);
      };
      
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [isCheckedIn]);

  const handleCheckIn = async () => {
    if (isCheckedIn) return;
    
    // Update streak
    updateStreak(true);
    setIsCheckedIn(true);
    setShowConfetti(true);
    
    toast.success('Daily check-in complete! +10 points');
    
    // Load and run confetti
    try {
      const ConfettiJS = (await import('confetti-js')).default;
      const confettiSettings = { 
        target: 'confetti-canvas',
        max: 150,
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
        clock: 25,
        rotate: true,
        start_from_edge: true,
        respawn: false
      };
      
      const confetti = new ConfettiJS(confettiSettings);
      confetti.render();
      
      // Stop confetti after 3 seconds
      setTimeout(() => {
        confetti.clear();
        setShowConfetti(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to load confetti:', error);
      setShowConfetti(false);
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className={`relative bg-gray-900 rounded-xl p-6 border border-gray-800 ${className}`}>
      {/* Confetti canvas */}
      {showConfetti && (
        <canvas 
          id="confetti-canvas" 
          className="absolute inset-0 pointer-events-none z-10"
        />
      )}
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-biowellGreen/20 rounded-lg mr-3">
            <Calendar className="w-5 h-5 text-biowellGreen" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Daily Check-In</h3>
            <p className="text-sm text-gray-400">{format(new Date(), 'EEEE, MMMM d')}</p>
          </div>
        </div>
        
        {userProgress.streak.currentStreak > 0 && (
          <div className="flex items-center bg-orange-400/10 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4 text-orange-400 mr-1" />
            <span className="text-sm text-orange-400">{userProgress.streak.currentStreak} day streak</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isCheckedIn ? (
          <motion.div
            key="checked-in"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-green-900/20 border border-green-900/30 rounded-lg p-4 text-center"
          >
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-lg font-medium text-white mb-1">Checked In Today!</h4>
            <p className="text-gray-300 mb-3">You've earned your daily points</p>
            
            <div className="flex items-center justify-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>Next check-in available in {timeLeft}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="check-in"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-biowellGreen/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-8 h-8 text-biowellGreen" />
              </div>
              <h4 className="text-lg font-medium text-white mb-1">Daily Rewards Await!</h4>
              <p className="text-gray-400 mb-3">Check in daily to earn points and maintain your streak</p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-4">
                <Sparkles className="w-4 h-4 text-biowellGreen" />
                <span>+10 points for checking in today</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckIn}
              className="px-6 py-3 bg-biowellGreen text-black rounded-lg font-medium"
            >
              Check In Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}