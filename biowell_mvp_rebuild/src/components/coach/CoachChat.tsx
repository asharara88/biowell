import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Sparkles, Target, Loader2, AlertCircle } from 'lucide-react';
import { useCoachChat } from '../../hooks/useCoachChat';
import { useLanguageStore } from '../../store/languageStore';
import { useTranslation } from '../../hooks/useTranslation';

const DEMO_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

const presetQuestions = [
  {
    id: 'goals',
    question: 'What are my recommended health goals?',
    goal: 'Health Assessment'
  },
  {
    id: 'supplements',
    question: 'What supplements should I take?',
    goal: 'Supplement Recommendations'
  },
  {
    id: 'sleep',
    question: 'How can I improve my sleep quality?',
    goal: 'Sleep Optimization'
  },
  {
    id: 'metrics',
    question: 'Analyze my current health metrics',
    goal: 'Biometric Analysis'
  }
];

export default function CoachChat() {
  const { messages, isLoading, error, sendMessage, clearError } = useCoachChat(DEMO_USER_ID);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguageStore();
  const { t } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    try {
      setIsTyping(true);
      await sendMessage({
        content: input,
        options: {
          goal: selectedGoal,
          language
        }
      });
      setInput('');
      setSelectedGoal(null);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionSelect = async (question: typeof presetQuestions[0]) => {
    if (isTyping) return;
    setSelectedGoal(question.goal);
    setInput(question.question);
    
    try {
      setIsTyping(true);
      await sendMessage({
        content: question.question,
        options: {
          goal: question.goal,
          language
        }
      });
      setSelectedGoal(null);
    } catch (err) {
      console.error('Failed to send preset question:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[600px] flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-biowellGreen text-black ml-auto'
                    : 'bg-gray-800 text-white'
                }`}
              >
                {message.role === 'coach' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-biowellGreen" />
                    <span className="text-sm font-semibold text-biowellGreen">
                      {t('coach.label') || 'Health Consultant'}
                    </span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role === 'coach' && message.metadata?.goal && (
                  <div className="mt-2 flex items-center gap-2">
                    <Target className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{message.metadata.goal}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-gray-400 p-4"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('coach.typing') || 'Health consultant is typing...'}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-red-400 p-4 bg-red-900/20 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-gray-800">
        {!selectedGoal && messages.length < 2 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {presetQuestions.map((question) => (
              <button
                key={question.id}
                onClick={() => handleQuestionSelect(question)}
                disabled={isTyping}
                className="text-left px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Target className="w-4 h-4 shrink-0" />
                <span className="line-clamp-2">{question.question}</span>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('coach.inputPlaceholder') || 'Ask your health consultant...'}
            disabled={isTyping}
            className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-biowellGreen disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-biowellGreen hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}