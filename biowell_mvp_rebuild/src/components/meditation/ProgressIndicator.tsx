```typescript
import React from 'react';
import { motion } from 'framer-motion';
import type { SessionPhase } from './MeditationSession';

interface ProgressIndicatorProps {
  progress: number;
  phase: SessionPhase;
}

export default function ProgressIndicator({
  progress,
  phase
}: ProgressIndicatorProps) {
  return (
    <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 bg-purple-400"
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.3 }}
      />
      
      {phase === 'meditation' && (
        <motion.div
          className="absolute inset-y-0 left-0 bg-purple-400/50 w-full"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
    </div>
  );
}
```