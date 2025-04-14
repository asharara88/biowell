import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  code?: string;
  show: boolean;
  onClose: () => void;
}

export function ErrorAlert({ message, code, show, onClose }: ErrorAlertProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-white"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-300" />
            </div>
            <div className="ml-3 flex-1">
              {code && (
                <p className="text-sm font-medium text-red-300 mb-1">
                  Error Code: {code}
                </p>
              )}
              <p className="text-sm">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-red-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}