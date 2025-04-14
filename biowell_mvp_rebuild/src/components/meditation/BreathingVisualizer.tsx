```typescript
import React from 'react';
import { motion } from 'framer-motion';
import type { SessionPhase } from './MeditationSession';

interface BreathingVisualizerProps {
  isActive: boolean;
  phase: SessionPhase;
  progress: number;
}

export default function BreathingVisualizer({
  isActive,
  phase,
  progress
}: BreathingVisualizerProps) {
  return (
    <div className="relative w-full h-full">
      {/* Background circles */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full bg-purple-400/5"
            animate={isActive ? {
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            } : {}}
            transition={{
              duration: 4,
              delay: i * 1.3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Main circle */}
      <motion.div
        className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-purple-400/20 backdrop-blur-xl"
        animate={isActive ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-400/30"
          animate={isActive ? {
            scale: [0.8, 1, 0.8],
            opacity: [0.3, 0.6, 0.3]
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>

      {/* Particles */}
      {isActive && phase === 'meditation' && (
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-400/50"
              style={{
                left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 40}%`,
                top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 40}%`
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}

      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          className="text-gray-800"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="45%"
          cx="50%"
          cy="50%"
        />
        <motion.circle
          className="text-purple-400"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="45%"
          cx="50%"
          cy="50%"
          style={{
            strokeDasharray: '283 283',
            strokeDashoffset: 283 - (progress * 283)
          }}
        />
      </svg>
    </div>
  );
}
```