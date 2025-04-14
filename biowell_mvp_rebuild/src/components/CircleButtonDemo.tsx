import React from 'react';
import CircleButton from './CircleButton';
import { MessageCircle, Heart, Star, Bell } from 'lucide-react';

export default function CircleButtonDemo() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Circle Button Examples</h2>

        {/* Size Variations */}
        <div className="flex items-center gap-4">
          <CircleButton
            size="sm"
            icon={<MessageCircle className="w-5 h-5 text-cyan-400" />}
          />
          <CircleButton
            size="md"
            icon={<Heart className="w-6 h-6 text-pink-400" />}
            gradientFrom="from-pink-400"
            gradientTo="to-rose-600"
          />
          <CircleButton
            size="lg"
            icon={<Star className="w-8 h-8 text-yellow-400" />}
            gradientFrom="from-yellow-400"
            gradientTo="to-orange-600"
          />
        </div>

        {/* Color Variations */}
        <div className="flex items-center gap-4">
          <CircleButton
            icon={<Bell className="w-6 h-6 text-emerald-400" />}
            gradientFrom="from-emerald-400"
            gradientTo="to-green-600"
          />
          <CircleButton
            icon={<Star className="w-6 h-6 text-purple-400" />}
            gradientFrom="from-purple-400"
            gradientTo="to-indigo-600"
          />
          <CircleButton
            icon={<Heart className="w-6 h-6 text-red-400" />}
            gradientFrom="from-red-400"
            gradientTo="to-rose-600"
          />
        </div>

        {/* Disabled State */}
        <div className="flex items-center gap-4">
          <CircleButton
            icon={<MessageCircle className="w-6 h-6 text-gray-400" />}
            disabled
          />
        </div>
      </div>
    </div>
  );
}