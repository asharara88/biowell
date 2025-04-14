import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function FloatingActionButton({
  onClick,
  className = '',
  disabled = false
}: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14
        bg-biowellGreen
        rounded-full
        text-black
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <MessageCircle className="w-6 h-6" />
    </motion.button>
  );
}