import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatTest() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-health-coach', {
        body: { message }
      });

      if (error) throw error;

      if (data.success) {
        // Simulate typing effect
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate thinking time
        setResponse(data.message);
        setMessage('');
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-xl shadow-xl border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">OpenAI API Test</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="mb-4 space-y-4">
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-gray-400 p-4 bg-gray-800/50 rounded-lg"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">AI is typing...</span>
            </motion.div>
          )}

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-800 rounded-lg"
            >
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Response:</h3>
              <p className="text-white">{response}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message to test the API..."
          className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-biowellGreen hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
}