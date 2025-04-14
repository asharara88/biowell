import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, X } from 'lucide-react';

export default function ReactQueryDevtoolsToggle() {
  const [showDevtools, setShowDevtools] = useState(false);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {!showDevtools && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowDevtools(true)}
          className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-gray-800 text-gray-300 hover:text-white shadow-lg"
          title="Show React Query Devtools"
        >
          <Database className="w-5 h-5" />
        </motion.button>
      )}
      
      {showDevtools && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white shadow-lg"
        >
          <button
            onClick={() => setShowDevtools(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            title="Close Devtools"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-xs text-gray-400 mb-1 mt-1 ml-1">React Query Devtools</div>
          <div className="hidden">
            {/* This is where the actual devtools would be rendered */}
            {/* They're hidden because we're using the built-in ReactQueryDevtools component */}
          </div>
        </motion.div>
      )}
    </>
  );
}