import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface AlertProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message?: string | React.ReactNode;
  show?: boolean;
  onClose?: () => void;
  className?: string;
  duration?: number;
  variant?: 'filled' | 'outlined' | 'light';
  icon?: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  show = true,
  onClose,
  className = '',
  duration,
  variant = 'light',
  icon,
  action,
  dismissible = true,
}) => {
  React.useEffect(() => {
    if (duration && show && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, show, onClose]);

  const variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const styles = {
    success: {
      filled: 'bg-green-500 text-white',
      outlined: 'border-2 border-green-500 text-green-700 bg-transparent',
      light: 'bg-green-50 text-green-800 border border-green-100',
      icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      filled: 'bg-red-500 text-white',
      outlined: 'border-2 border-red-500 text-red-700 bg-transparent',
      light: 'bg-red-50 text-red-800 border border-red-100',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    warning: {
      filled: 'bg-yellow-500 text-white',
      outlined: 'border-2 border-yellow-500 text-yellow-700 bg-transparent',
      light: 'bg-yellow-50 text-yellow-800 border border-yellow-100',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    info: {
      filled: 'bg-blue-500 text-white',
      outlined: 'border-2 border-blue-500 text-blue-700 bg-transparent',
      light: 'bg-blue-50 text-blue-800 border border-blue-100',
      icon: <Info className="w-5 h-5" />,
    },
  };

  const selectedStyle = styles[type][variant];
  const selectedIcon = icon || styles[type].icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="alert"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.2 }}
          className={`
            flex items-start gap-3 p-4 rounded-lg shadow-sm
            ${selectedStyle}
            ${className}
          `}
        >
          <div className="shrink-0">{selectedIcon}</div>
          
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="font-medium mb-1">
                {title}
              </h3>
            )}
            {message && (
              <div className="text-sm">
                {message}
              </div>
            )}
            {action && (
              <div className="mt-3">
                {action}
              </div>
            )}
          </div>

          {dismissible && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 hover:opacity-75 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
              aria-label="Close alert"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;