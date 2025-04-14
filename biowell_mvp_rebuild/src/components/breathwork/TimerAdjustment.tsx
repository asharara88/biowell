```typescript
import React from 'react';
import { Timer, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimerAdjustmentProps {
  timings: {
    inhale: number;
    exhale: number;
    holdIn?: number;
    holdOut?: number;
  };
  ranges: {
    inhale: [number, number];
    exhale: [number, number];
    holdIn: [number, number];
    holdOut: [number, number];
  };
  onUpdate: (newTimings: typeof timings) => void;
  onSave?: () => void;
  disabled?: boolean;
}

export default function TimerAdjustment({
  timings,
  ranges,
  onUpdate,
  onSave,
  disabled = false
}: TimerAdjustmentProps) {
  const handleChange = (phase: keyof typeof timings, value: string) => {
    const numValue = parseFloat(value);
    const [min, max] = ranges[phase];
    
    if (numValue >= min && numValue <= max) {
      onUpdate({
        ...timings,
        [phase]: numValue
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-medium text-white">Adjust Timings</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Inhale ({ranges.inhale[0]}-{ranges.inhale[1]}s)
          </label>
          <input
            type="number"
            value={timings.inhale}
            onChange={(e) => handleChange('inhale', e.target.value)}
            min={ranges.inhale[0]}
            max={ranges.inhale[1]}
            step={0.5}
            disabled={disabled}
            className="w-full bg-gray-700 text-white rounded px-3 py-1.5 border border-gray-600 focus:border-blue-400 focus:outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Exhale ({ranges.exhale[0]}-{ranges.exhale[1]}s)
          </label>
          <input
            type="number"
            value={timings.exhale}
            onChange={(e) => handleChange('exhale', e.target.value)}
            min={ranges.exhale[0]}
            max={ranges.exhale[1]}
            step={0.5}
            disabled={disabled}
            className="w-full bg-gray-700 text-white rounded px-3 py-1.5 border border-gray-600 focus:border-blue-400 focus:outline-none disabled:opacity-50"
          />
        </div>

        {timings.holdIn !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Hold In ({ranges.holdIn[0]}-{ranges.holdIn[1]}s)
            </label>
            <input
              type="number"
              value={timings.holdIn}
              onChange={(e) => handleChange('holdIn', e.target.value)}
              min={ranges.holdIn[0]}
              max={ranges.holdIn[1]}
              step={0.5}
              disabled={disabled}
              className="w-full bg-gray-700 text-white rounded px-3 py-1.5 border border-gray-600 focus:border-blue-400 focus:outline-none disabled:opacity-50"
            />
          </div>
        )}

        {timings.holdOut !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Hold Out ({ranges.holdOut[0]}-{ranges.holdOut[1]}s)
            </label>
            <input
              type="number"
              value={timings.holdOut}
              onChange={(e) => handleChange('holdOut', e.target.value)}
              min={ranges.holdOut[0]}
              max={ranges.holdOut[1]}
              step={0.5}
              disabled={disabled}
              className="w-full bg-gray-700 text-white rounded px-3 py-1.5 border border-gray-600 focus:border-blue-400 focus:outline-none disabled:opacity-50"
            />
          </div>
        )}
      </div>

      {onSave && (
        <button
          onClick={onSave}
          disabled={disabled}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Save as Default
        </button>
      )}
    </motion.div>
  );
}
```