import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Clock, MessageCircle } from 'lucide-react';

interface Mood {
  emoji: string;
  label: string;
  color: string;
}

const moods: Mood[] = [
  { emoji: '😔', label: 'Low', color: 'bg-red-400' },
  { emoji: '😐', label: 'Neutral', color: 'bg-yellow-400' },
  { emoji: '🙂', label: 'Good', color: 'bg-green-400' },
  { emoji: '😄', label: 'Great', color: 'bg-blue-400' }
];

interface MoodTrackerProps {
  onMoodSelect?: (mood: string) => void;
}

export default function MoodTracker({ onMoodSelect }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    if (onMoodSelect) {
      onMoodSelect(mood.label);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-biowellGreen bg-opacity-10 rounded-lg flex items-center justify-center">
            <Smile className="w-5 h-5 text-biowellGreen" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-white">Mood Check</h2>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {moods.map((mood) => (
          <motion.button
            key={mood.emoji}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodSelect(mood)}
            className={`flex flex-col items-center p-4 rounded-lg bg-gray-800 border-2 transition-colors ${
              selectedMood?.emoji === mood.emoji
                ? 'border-biowellGreen'
                : 'border-transparent hover:border-gray-700'
            }`}
          >
            <span className="text-3xl mb-2">{mood.emoji}</span>
            <span className="text-sm text-gray-300">{mood.label}</span>
            {selectedMood?.emoji === mood.emoji && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-2 h-2 rounded-full mt-2 ${mood.color}`}
              />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedMood && !showNote && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => setShowNote(true)}
            className="flex items-center justify-center w-full p-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Add a note
          </motion.button>
        )}

        {showNote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling? (optional)"
              className="w-full h-24 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-biowellGreen focus:outline-none resize-none"
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
                className="px-4 py-2 rounded-lg bg-biowellGreen text-black font-medium hover:bg-opacity-90 transition-colors"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}