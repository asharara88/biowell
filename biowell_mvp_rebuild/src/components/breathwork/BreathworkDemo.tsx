```tsx
import React from 'react';
import BreathworkProtocol from './BreathworkProtocol';

export default function BreathworkDemo() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Breathwork Practice</h2>
        <p className="text-gray-400">
          Select a breathing protocol and follow the guided instructions. Each protocol is designed 
          to help you achieve specific wellness goals through controlled breathing exercises.
        </p>
      </div>
      <BreathworkProtocol />
    </div>
  );
}
```