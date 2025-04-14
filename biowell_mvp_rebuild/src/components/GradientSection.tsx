import React from 'react';
import { motion } from 'framer-motion';

export interface GradientSectionProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'custom';
  customGradient?: string;
  className?: string;
  animate?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function GradientSection({
  children,
  variant = 'primary',
  customGradient,
  className = '',
  animate = true,
  rounded = 'lg',
  padding = 'lg',
  shadow = 'xl'
}: GradientSectionProps) {
  const gradients = {
    primary: 'bg-gradient-to-r from-blue-400 via-biowellBlue to-indigo-700',
    secondary: 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900',
    success: 'bg-gradient-to-r from-green-400 via-biowellGreen to-emerald-600',
    info: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600',
    custom: customGradient
  };

  const roundedStyles = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseStyles = `
    relative
    overflow-hidden
    text-white
    ${gradients[variant]}
    ${roundedStyles[rounded]}
    ${paddingStyles[padding]}
    ${shadowStyles[shadow]}
    ${className}
  `;

  const content = (
    <div className={baseStyles}>
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
      
      {/* Animated background shapes */}
      {animate && (
        <>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse delay-700" />
        </>
      )}
      
      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  );

  return animate ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {content}
    </motion.div>
  ) : (
    content
  );
}