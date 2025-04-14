```tsx
import React from 'react';
import { motion } from 'framer-motion';

interface BreathingSphereProps {
  phase: 'inhale' | 'exhale' | 'holdIn' | 'holdOut';
  progress: number;
  isActive: boolean;
}

export default function BreathingSphere({ phase, progress, isActive }: BreathingSphereProps) {
  const getPhaseAnimation = () => {
    switch (phase) {
      case 'inhale':
        return {
          scale: [1, 1.5],
          opacity: [0.5, 0.8]
        };
      case 'exhale':
        return {
          scale: [1.5, 1],
          opacity: [0.8, 0.5]
        };
      case 'holdIn':
        return {
          scale: 1.5,
          opacity: 0.8
        };
      case 'holdOut':
        return {
          scale: 1,
          opacity: 0.5
        };
      default:
        return {
          scale: 1,
          opacity: 0.5
        };
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-400';
      case 'exhale':
        return 'bg-green-400';
      case 'holdIn':
        return 'bg-purple-400';
      case 'holdOut':
        return 'bg-orange-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Background rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-full h-full rounded-full opacity-5 ${getPhaseColor()}`} />
      </div>
      <div className="absolute inset-4 flex items-center justify-center">
        <div className={`w-full h-full rounded-full opacity-10 ${getPhaseColor()}`} />
      </div>
      <div className="absolute inset-8 flex items-center justify-center">
        <div className={`w-full h-full rounded-full opacity-15 ${getPhaseColor()}`} />
      </div>

      {/* Animated sphere */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={isActive ? getPhaseAnimation() : { scale: 1, opacity: 0.5 }}
        transition={{
          duration: progress,
          ease: phase === 'inhale' ? 'easeIn' : phase === 'exhale' ? 'easeOut' : 'linear'
        }}
      >
        <motion.div
          className={`w-32 h-32 rounded-full ${getPhaseColor()} shadow-lg backdrop-blur-xl`}
          style={{
            boxShadow: `0 0 60px 20px ${phase === 'inhale' ? '#60A5FA' : 
              phase === 'exhale' ? '#34D399' : 
              phase === 'holdIn' ? '#A78BFA' : 
              '#FB923C'}`
          }}
        />
      </motion.div>

      {/* Particle effects */}
      {isActive && (phase === 'inhale' || phase === 'exhale') && (
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${getPhaseColor()} opacity-50`}
              style={{
                left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 40}%`,
                top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 40}%`
              }}
              animate={{
                scale: phase === 'inhale' ? [0, 1] : [1, 0],
                opacity: phase === 'inhale' ? [0, 0.5] : [0.5, 0]
              }}
              transition={{
                duration: progress,
                ease: phase === 'inhale' ? 'easeIn' : 'easeOut',
                repeat: Infinity
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```