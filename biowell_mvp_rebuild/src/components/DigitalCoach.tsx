import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Send } from 'lucide-react';

export default function DigitalCoach() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'coach', content: 'Hello! I\'m your Health Consultant. How can I assist you with your wellness journey today?' },
    { role: 'user', content: 'What\'s my focus for today?' },
    { role: 'coach', content: 'Based on your recent metrics and sleep patterns, I recommend focusing on your Recovery Stack today. Your HRV indicates you might benefit from active recovery rather than intense training.' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setConversation(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'coach', content: 'I\'m analyzing your data and personalizing recommendations for you...' }
    ]);
    setMessage('');
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-biowellGreen" />
        <h2 className="text-xl font-bold text-white">Your Health Consultant</h2>
      </div>

      <div className="h-[400px] overflow-y-auto mb-6 space-y-4">
        {conversation.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-biowellGreen text-black ml-auto'
                  : 'bg-gray-800 text-white'
              }`}
            >
              {msg.role === 'coach' && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-biowellLightBlue" />
                  <span className="text-sm font-semibold text-biowellLightBlue">Health Consultant</span>
                </div>
              )}
              <p>{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your Health Consultant..."
          className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-biowellGreen"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-biowellGreen hover:text-biowellLightBlue transition-colors"
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}