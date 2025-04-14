import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Share, Sparkles } from 'lucide-react';
import type { Achievement } from '../../types/gamification';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement;
  onShare?: () => void;
}

export default function AchievementModal({ 
  isOpen, 
  onClose, 
  achievement,
  onShare
}: AchievementModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      
      // Load and run confetti
      const loadConfetti = async () => {
        try {
          const ConfettiJS = (await import('confetti-js')).default;
          const confettiSettings = { 
            target: 'achievement-confetti',
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
      };
      
      loadConfetti();
    }
  }, [isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          {/* Confetti canvas */}
          {showConfetti && (
            <canvas 
              id="achievement-confetti" 
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
            <div className={`absolute inset-0 bg-gradient-to-b ${getRarityColor(achievement.rarity)}/20 to-transparent`} />
            
            <div className="relative p-6 pt-12 text-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Achievement Unlocked!</h2>
                
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} mx-auto mb-4 flex items-center justify-center`}>
                  <Award className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-1">{achievement.title}</h3>
                <p className="text-gray-400 mb-2">{achievement.description}</p>
                
                <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-sm text-gray-300 mb-4">
                  {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <div className="text-2xl font-bold text-biowellGreen mb-1">+{achievement.points} points</div>
                  <p className="text-sm text-gray-400">Added to your total</p>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Continue
                  </motion.button>
                  
                  {onShare && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onShare();
                        onClose();
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-biowellGreen text-black rounded-lg font-medium"
                    >
                      <Share className="w-5 h-5" />
                      Share
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}