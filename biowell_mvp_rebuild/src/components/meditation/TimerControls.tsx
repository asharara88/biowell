```typescript
import React from 'react';
import { Timer } from 'lucide-react';

interface TimerControlsProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  disabled?: boolean;
}

const DURATION_OPTIONS = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' }
];

export default function TimerControls({
  duration,
  onDurationChange,
  disabled = false
}: TimerControlsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-medium text-white">Session Duration</h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {DURATION_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => onDurationChange(option.value)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-colors
              ${duration === option.value
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```