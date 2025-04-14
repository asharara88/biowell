import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
  success?: string;
  onSubmit: (e: React.FormEvent) => void;
  actions?: React.ReactNode;
  variant?: 'default' | 'floating';
}

export const Form: React.FC<FormProps> = ({
  title,
  subtitle,
  loading = false,
  error,
  success,
  onSubmit,
  actions,
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={onSubmit}
      className={`space-y-6 ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-xl font-semibold text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-400 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg text-sm"
        >
          {success}
        </motion.div>
      )}

      <div className="space-y-4">
        {children}
      </div>

      {actions && (
        <div className="flex justify-end gap-4 pt-2">
          {actions}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-biowellGreen" />
        </div>
      )}
    </motion.form>
  );
};

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  helper?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  required,
  helper
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {(error || helper) && (
        <p className={`text-sm ${error ? 'text-red-400' : 'text-gray-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
};

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-medium text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
        {children}
      </div>
    </div>
  );
};