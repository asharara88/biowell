import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, TrendingUp, Clock, MessageCircle, Activity, Brain } from 'lucide-react';

interface MoodEntry {
  emoji: string;
  label: string;
  color: string;
  energyLevel: 'high' | 'medium' | 'low';
  description?: string;
}

const moods: MoodEntry[] = [
  { 
    emoji: '😊', 
    label: 'Great', 
    color: 'text-green-400',
    energyLevel: 'high',
    description: 'Feeling energetic and positive'
  },
  { 
    emoji: '🙂', 
    label: 'Good', 
    color: 'text-blue-400',
    energyLevel: 'medium',
    description: 'Balanced and content'
  },
  { 
    emoji: '😐', 
    label: 'Neutral', 
    color: 'text-yellow-400',
    energyLevel: 'medium',
    description: 'Neither high nor low'
  },
  { 
    emoji: '😔', 
    label: 'Low', 
    color: 'text-red-400',
    energyLevel: 'low',
    description: 'Could use a boost'
  }
];

interface MoodWidgetProps {
  view?: 'today' | 'trends';
  onMoodSelect?: (mood: MoodEntry) => void;
}

export default function MoodWidget({ view = 'today', onMoodSelect }: MoodWidgetProps) {
  const [selectedMood, setSelectedMood] = useState<MoodEntry | null>(null);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');

  const handleMoodSelect = (mood: MoodEntry) => {
    setSelectedMood(mood);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  const handleSubmit = () => {
    if (selectedMood) {
      console.log('Mood logged:', {
        mood: selectedMood.label,
        note,
        timestamp: new Date().toISOString()
      });
      setNote('');
      setShowNote(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center">
            <Smile className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-semibold text-white">Mood Tracking</h2>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
          <span className="text-gray-400">Positive trend</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {moods.map((mood) => (
          <motion.button
            key={mood.label}
            variants={item}
            onClick={() => handleMoodSelect(mood)}
            className={`flex flex-col items-center p-4 rounded-lg bg-gray-800 border-2 transition-colors ${
              selectedMood?.label === mood.label
                ? `border-${mood.color.split('-')[1]}`
                : 'border-transparent hover:border-gray-700'
            }`}
          >
            <span className="text-3xl mb-2">{mood.emoji}</span>
            <span className={`text-sm ${mood.color}`}>{mood.label}</span>
            {selectedMood?.label === mood.label && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-2 h-2 rounded-full mt-2 bg-${mood.color.split('-')[1]}`}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">Energy Level</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                selectedMood.energyLevel === 'high' ? 'bg-green-400/20 text-green-400' :
                selectedMood.energyLevel === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                'bg-red-400/20 text-red-400'
              }`}>
                {selectedMood.energyLevel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">{selectedMood.description}</span>
            </div>
          </div>

          {!showNote ? (
            <button
              onClick={() => setShowNote(true)}
              className="flex items-center justify-center w-full p-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Add a note
            </button>
          ) : (
            <div className="space-y-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How are you feeling? (optional)"
                className="w-full h-24 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-yellow-400 focus:outline-none resize-none"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNote(false)}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-medium hover:bg-opacity-90 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}