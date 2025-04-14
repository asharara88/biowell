```typescript
// Update the imports at the top of the file
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw, Timer, Info, Settings } from 'lucide-react';
import BreathingSphere from './BreathingSphere';
import TimerAdjustment from './TimerAdjustment';

// Add after the breathProtocols array
const adjustableRanges = {
  inhale: [2, 10],
  exhale: [2, 15],
  holdIn: [0, 20],
  holdOut: [0, 120]
};

// Add to the component's state declarations
const [showSettings, setShowSettings] = useState(false);
const [customTimings, setCustomTimings] = useState<typeof selectedProtocol.timings | null>(null);

// Add this function inside the component
const handleTimingsUpdate = (newTimings: typeof selectedProtocol.timings) => {
  setCustomTimings(newTimings);
};

const saveCustomTimings = () => {
  // In a real app, this would save to user preferences
  console.log('Saving custom timings:', customTimings);
};

// Update the protocol selector section to include the settings button
<div className="flex items-center gap-4">
  <button
    onClick={() => setShowInfo(!showInfo)}
    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
  >
    <Info className="w-5 h-5" />
  </button>
  <button
    onClick={() => setShowSettings(!showSettings)}
    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
    disabled={isActive}
  >
    <Settings className="w-5 h-5" />
  </button>
  <select
    value={selectedProtocol.name}
    onChange={(e) => {
      const protocol = breathProtocols.find(p => p.name === e.target.value);
      if (protocol) {
        setSelectedProtocol(protocol);
        setCustomTimings(null);
      }
    }}
    className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-400"
    disabled={isActive}
  >
    {breathProtocols.map(protocol => (
      <option key={protocol.name} value={protocol.name}>
        {protocol.name}
      </option>
    ))}
  </select>
</div>

// Add after the info section and before the breathing sphere
<AnimatePresence>
  {showSettings && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-8 overflow-hidden"
    >
      <TimerAdjustment
        timings={customTimings || selectedProtocol.timings}
        ranges={adjustableRanges}
        onUpdate={handleTimingsUpdate}
        onSave={saveCustomTimings}
        disabled={isActive}
      />
    </motion.div>
  )}
</AnimatePresence>

// Update the useEffect dependency array to include customTimings
}, [isActive, currentPhase, selectedProtocol, customTimings, currentCycle, totalCycles, getNextPhase]);

// Update the getNextPhase callback to use customTimings
const getNextPhase = useCallback((currentPhase: BreathPhase): BreathPhase => {
  const timings = customTimings || selectedProtocol.timings;
  const phases: BreathPhase[] = ['inhale'];
  
  if (timings.holdIn) phases.push('holdIn');
  phases.push('exhale');
  if (timings.holdOut) phases.push('holdOut');

  const currentIndex = phases.indexOf(currentPhase);
  return phases[(currentIndex + 1) % phases.length];
}, [selectedProtocol, customTimings]);
```