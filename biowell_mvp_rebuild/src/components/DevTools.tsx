import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, X, Database, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'queries' | 'cache'>('queries');
  const [showDevtools, setShowDevtools] = useState(false);
  const queryClient = useQueryClient();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const toggleDevtools = () => {
    setShowDevtools(!showDevtools);
    // This would toggle the React Query Devtools visibility
    // In a real implementation, you'd need to control the devtools component
  };

  const handleRefreshQueries = () => {
    queryClient.invalidateQueries();
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the entire cache?')) {
      queryClient.clear();
    }
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-gray-800 text-gray-300 hover:text-white shadow-lg"
        title="Developer Tools"
      >
        <Settings className="w-5 h-5" />
      </motion.button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-16 left-4 z-50 w-80 rounded-lg bg-gray-800 text-white shadow-lg border border-gray-700"
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <h3 className="font-medium">Developer Tools</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('queries')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'queries' 
                  ? 'text-biowellGreen border-b-2 border-biowellGreen' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Queries
            </button>
            <button
              onClick={() => setActiveTab('cache')}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'cache' 
                  ? 'text-biowellGreen border-b-2 border-biowellGreen' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Cache
            </button>
          </div>
          
          <div className="p-3">
            {activeTab === 'queries' && (
              <div className="space-y-3">
                <button
                  onClick={handleRefreshQueries}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh All Queries
                </button>
                
                <button
                  onClick={toggleDevtools}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                  {showDevtools ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide React Query Devtools
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show React Query Devtools
                    </>
                  )}
                </button>
              </div>
            )}
            
            {activeTab === 'cache' && (
              <div className="space-y-3">
                <button
                  onClick={handleClearCache}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-900/70 transition-colors text-sm"
                >
                  <Database className="w-4 h-4" />
                  Clear Query Cache
                </button>
                
                <div className="text-xs text-gray-400 p-2 bg-gray-700 rounded-md">
                  <p className="mb-1">Active Cache Keys:</p>
                  <pre className="overflow-auto max-h-32 text-xs">
                    {JSON.stringify(queryClient.getQueryCache().getAll().map(query => query.queryKey), null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}