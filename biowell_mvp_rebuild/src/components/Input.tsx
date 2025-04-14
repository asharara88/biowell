import React, { forwardRef } from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  variant = 'default',
  size = 'md',
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'rounded-lg transition-all duration-200 focus:outline-none';
  
  const variants = {
    default: 'bg-white border border-gray-300 focus:ring-2 focus:ring-biowellBlue focus:border-transparent',
    filled: 'bg-gray-100 border-2 border-transparent focus:bg-white focus:ring-2 focus:ring-biowellBlue',
    outline: 'bg-transparent border-2 border-gray-300 focus:border-biowellBlue focus:ring-1 focus:ring-biowellBlue/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  const width = fullWidth ? 'w-full' : 'w-auto';
  const isDisabled = disabled;
  const hasError = !!error;
  const hasSuccess = success;

  const inputStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${width}
    ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
    ${hasError ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''}
    ${hasSuccess ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500' : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          disabled={isDisabled}
          className={inputStyles}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </span>
        )}
        {hasError && !rightIcon && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
        )}
        {hasSuccess && !rightIcon && !error && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;