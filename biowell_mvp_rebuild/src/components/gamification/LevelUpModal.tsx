import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Gift, Sparkles } from 'lucide-react';
import type { Level } from '../../types/gamification';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: Level;
  onClaimRewards?: (rewardIds: string[]) => void;
}

export default function LevelUpModal({ 
  isOpen, 
  onClose, 
  level,
  onClaimRewards
}: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      
      // Load and run confetti
      const loadConfetti = async () => {
        try {
          const ConfettiJS = (await import('confetti-js')).default;
          const confettiSettings = { 
            target: 'level-up-confetti',
            max: 200,
            size: 1.5,
            animate: true,
            props: ['circle', 'square', 'triangle', 'line'],
            colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
            clock: 25,
            rotate: true,
            start_from_edge: true,
            respawn: true
          };
          
          const confetti = new ConfettiJS(confettiSettings);
          confetti.render();
          
          // Stop confetti after 5 seconds
          setTimeout(() => {
            confetti.clear();
            setShowConfetti(false);
          }, 5000);
        } catch (error) {
          console.error('Failed to load confetti:', error);
          setShowConfetti(false);
        }
      };
      
      loadConfetti();
    }
  }, [isOpen]);

  const handleClaimRewards = () => {
    if (onClaimRewards) {
      onClaimRewards(level.rewards.map(r => r.id));
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          {/* Confetti canvas */}
          {showConfetti && (
            <canvas 
              id="level-up-confetti" 
              className="absolute inset-0 pointer-events-none"
            />
          )}
          
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
            
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-biowellGreen/20 to-transparent" />
            
            <div className="relative p-6 pt-12 text-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-12 h-12 text-biowellGreen mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Level Up!</h2>
                <p className="text-xl text-biowellGreen mb-6">You've reached Level {level.level}</p>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{level.title}</h3>
                  <p className="text-gray-400">
                    Congratulations on your progress! Keep up the great work on your wellness journey.
                  </p>
                </div>
                
                {level.rewards.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-biowellGreen mr-2" />
                      Rewards Unlocked
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {level.rewards.map(reward => (
                        <div 
                          key={reward.id}
                          className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                        >
                          <div className="flex items-center mb-2">
                            <Award className="w-5 h-5 text-biowellGreen mr-2" />
                            <h5 className="text-white font-medium">{reward.title}</h5>
                          </div>
                          <p className="text-xs text-gray-400">{reward.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClaimRewards}
                  className="px-6 py-3 bg-biowellGreen text-black rounded-lg font-medium"
                >
                  Claim Rewards & Continue
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}