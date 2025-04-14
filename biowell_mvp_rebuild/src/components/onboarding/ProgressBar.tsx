import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-biowellGreen via-biowellBlue to-biowellGreen bg-size-200"
        style={{ 
          backgroundPosition: "0% 0%",
          backgroundSize: "200% 100%"
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
          width: `${progress}%`
        }}
        transition={{ 
          backgroundPosition: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          },
          width: {
            duration: 0.5
          }
        }}
      />
    </div>
  );
}