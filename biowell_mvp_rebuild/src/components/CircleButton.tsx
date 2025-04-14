import React from 'react';
import { motion } from 'framer-motion';

interface CircleButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  disabled?: boolean;
}

export default function CircleButton({
  onClick,
  icon,
  size = 'md',
  gradientFrom = 'from-cyan-400',
  gradientTo = 'to-blue-600',
  className = '',
  disabled = false
}: CircleButtonProps) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative rounded-full
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Gradient border container */}
      <div className={`
        absolute inset-0 rounded-full
        bg-gradient-to-br ${gradientFrom} ${gradientTo}
        p-[2px]
      `}>
        {/* Inner button content */}
        <div className="
          w-full h-full rounded-full
          bg-black
          flex items-center justify-center
          transition-transform duration-200
          hover:bg-opacity-90
        ">
          {icon}
        </div>
      </div>
    </motion.button>
  );
}