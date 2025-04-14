import React from 'react';
import { motion } from 'framer-motion';

interface ContentSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  align?: 'left' | 'center' | 'right';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export default function ContentSection({
  title,
  subtitle,
  children,
  variant = 'light',
  align = 'left',
  maxWidth = 'lg',
  className = ''
}: ContentSectionProps) {
  const baseStyles = 'space-y-6 leading-relaxed';
  
  const variantStyles = {
    light: 'text-gray-700 bg-white',
    dark: 'text-gray-300 bg-gray-900'
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const maxWidthStyles = {
    sm: 'max-w-2xl',
    md: 'max-w-3xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'w-full'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${alignStyles[align]}
        ${maxWidthStyles[maxWidth]}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="space-y-2 mb-8">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-2xl md:text-3xl font-bold ${
                variant === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-lg ${
                variant === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="prose prose-lg max-w-none"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}