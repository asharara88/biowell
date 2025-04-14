import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Info, Settings, Moon } from 'lucide-react';
import { useHealthTracking } from '../../hooks/useHealthTracking';
import { fetchFromDB } from '../../utils/database';
import BreathingVisualizer from './BreathingVisualizer';
import TimerControls from './TimerControls';
import ProgressIndicator from './ProgressIndicator';

interface MeditationSessionProps {
  userId: string;
  onComplete?: (duration: number) => void;
}

export type SessionPhase = 'preparation' | 'meditation' | 'completion';

export default function MeditationSession({ userId, onComplete }: MeditationSessionProps) {
  const [phase, setPhase] = useState<SessionPhase>('preparation');
  const [duration, setDuration] = useState(10); // minutes
  const [elapsed, setElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { initialized } = useHealthTracking();

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await fetchFromDB({
        table: 'user_preferences',
        filters: { user_id: userId },
        single: true
      });
      if (prefs) {
        setDuration(prefs.meditation_duration || 10);
      }
    };
    loadPreferences();
  }, [userId]);

  // Timer logic
  useEffect(() => {
    let interval: number;
    
    if (isActive && phase === 'meditation') {
      interval = window.setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (next >= duration * 60) {
            setPhase('completion');
            setIsActive(false);
            onComplete?.(duration);
            return prev;
          }
          return next;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, duration, onComplete]);

  const handleStart = useCallback(() => {
    setPhase('meditation');
    setIsActive(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleReset = useCallback(() => {
    setPhase('preparation');
    setIsActive(false);
    setElapsed(0);
  }, []);

  const handleDurationChange = useCallback((newDuration: number) => {
    if (phase === 'preparation') {
      setDuration(newDuration);
    }
  }, [phase]);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-400/10 rounded-lg flex items-center justify-center">
            <Moon className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Meditation Session</h2>
            <p className="text-sm text-gray-400">
              {phase === 'preparation' ? 'Ready to begin' :
               phase === 'meditation' ? 'In progress' :
               'Session complete'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
            disabled={isActive}
          >
            <Settings className="w-5 h-5" />
          </button>
          <Timer className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">
            {Math.floor((duration * 60 - elapsed) / 60)}:
            {String(Math.floor((duration * 60 - elapsed) % 60)).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <TimerControls
              duration={duration}
              onDurationChange={handleDurationChange}
              disabled={isActive}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visualization */}
      <div className="relative aspect-square max-w-md mx-auto mb-8">
        <BreathingVisualizer
          isActive={isActive}
          phase={phase}
          progress={elapsed / (duration * 60)}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-2"
            disabled={!initialized}
          >
            <Play className="w-5 h-5" />
            {phase === 'preparation' ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors flex items-center gap-2"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          disabled={!elapsed}
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8">
        <ProgressIndicator
          progress={elapsed / (duration * 60)}
          phase={phase}
        />
      </div>
    </div>
  );
}