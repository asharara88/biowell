import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'react-toastify';
import { supabase } from '../api/client';

// Sample conversation data
const initialMessages = [
  { 
    id: '1', 
    role: 'coach', 
    content: 'Hello! I\'m your Health Consultant. How can I help you today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  }
];

// Sample quick questions
const quickQuestions = [
  "What supplements should I take?",
  "How can I improve my sleep?",
  "Analyze my health metrics",
  "Recommend a morning routine"
];

// Demo user ID
const DEMO_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function PersonalCoachChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();

  // Load conversation history on mount
  useEffect(() => {
    const loadConversation = async () => {
      try {
        const { data, error } = await supabase
          .from('coach_messages')
          .select('*')
          .eq('user_id', DEMO_USER_ID)
          .order('created_at', { ascending: true })
          .limit(20);
        
        if (error) {
          console.error('Error loading conversation:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setMessages(data.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.created_at
          })));
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    };
    
    loadConversation();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to database
      const { error: userMsgError } = await supabase
        .from('coach_messages')
        .insert({
          user_id: DEMO_USER_ID,
          content: userMessage.content,
          role: 'user',
          created_at: userMessage.timestamp
        });
      
      if (userMsgError) {
        console.error('Error saving user message:', userMsgError);
      }
      
      // Call the health coach function
      console.log('Calling health-coach function with:', {
        userId: DEMO_USER_ID,
        message: userMessage.content,
        language
      });
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-coach`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'x-openai-key': import.meta.env.VITE_OPENAI_API_KEY || ''
        },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          message: userMessage.content,
          language
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', response.status, errorData);
        throw new Error(`API error: ${response.status}`);
      }
      
      const coachResponse = await response.json();
      console.log('Received coach response:', coachResponse);
      
      // Add coach response to messages
      setMessages(prev => [...prev, {
        id: coachResponse.id,
        role: coachResponse.role,
        content: coachResponse.content,
        timestamp: new Date().toISOString()
      }]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response. Using fallback response.');
      
      // Add fallback coach response if API fails
      const fallbackResponse = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: getCoachResponse(input),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    if (isLoading) return;
    
    // Set the input and submit the form
    setInput(question);
    
    // Use setTimeout to ensure the input is set before submitting
    setTimeout(() => {
      const form = document.getElementById('chat-form') as HTMLFormElement;
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 0);
  };

  // Simple response generator based on input keywords (fallback for demo)
  const getCoachResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('supplement') || lowerInput.includes('take')) {
      return "Based on your profile, I recommend a daily regimen of:\n\n• Magnesium Glycinate (300mg before bed)\n• Vitamin D3 (5000 IU with breakfast)\n• Omega-3 (2g with meals)\n\nThese supplements support your sleep quality and overall wellness goals.";
    }
    
    if (lowerInput.includes('sleep') || lowerInput.includes('insomnia')) {
      return "To improve your sleep quality, I recommend:\n\n1. Maintain a consistent sleep schedule\n2. Avoid blue light 2 hours before bed\n3. Keep your bedroom cool (65-68°F)\n4. Consider magnesium glycinate supplementation\n5. Practice a 10-minute relaxation routine before bed";
    }
    
    if (lowerInput.includes('metrics') || lowerInput.includes('analyze')) {
      return "Based on your recent metrics:\n\n• Your sleep efficiency has improved by 12%\n• HRV is trending upward, indicating good recovery\n• Glucose stability has improved since implementing post-meal walks\n• Activity levels are consistent but could benefit from more variety\n\nOverall, your wellness score is 82/100, showing positive progress.";
    }
    
    if (lowerInput.includes('morning') || lowerInput.includes('routine')) {
      return "Here's an optimal morning routine based on your goals:\n\n1. 5-minute meditation upon waking\n2. 16oz water with electrolytes\n3. 10-minute light movement or stretching\n4. Protein-focused breakfast\n5. 15-minute outdoor exposure for circadian rhythm regulation\n\nThis routine will support your energy levels throughout the day.";
    }
    
    return "I'd be happy to help with that. Could you provide more details about your specific goals or concerns so I can give you personalized recommendations?";
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg overflow-hidden h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <Sparkles className="w-5 h-5 text-biowellGreen mr-2" />
        <h2 className="text-lg font-semibold text-white">Health Consultant</h2>
      </div>
      
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
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-biowellGreen text-black ml-auto'
                    : 'bg-gray-800 text-white'
                }`}
              >
                {message.role === 'coach' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-biowellGreen" />
                    <span className="text-sm font-semibold text-biowellGreen">
                      Health Consultant
                    </span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="text-right mt-1">
                  <span className={`text-xs ${message.role === 'user' ? 'text-black/70' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-gray-400 p-3 bg-gray-800 rounded-lg max-w-[80%]"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Health consultant is thinking...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
                className="text-left px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="line-clamp-1">{question}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <form id="chat-form" onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('coach.inputPlaceholder') || 'Ask your health consultant...'}
            disabled={isLoading}
            className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-biowellGreen disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-biowellGreen hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
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