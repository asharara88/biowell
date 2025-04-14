import React from 'react';
import { Heart, Activity, Moon, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthMetrics {
  glucose?: number;
  heartRate?: number;
  steps?: number;
  sleep?: {
    duration: number;
    quality: number;
  };
  stress?: number;
  energy?: number;
}

interface Props {
  metrics: HealthMetrics;
}

export default function HealthMetricsDisplay({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {metrics.heartRate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="text-red-400 w-5 h-5" />
            <span className="text-gray-300">Heart Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics.heartRate} <span className="text-sm text-gray-400">bpm</span>
          </div>
        </motion.div>
      )}

      {metrics.steps && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-green-400 w-5 h-5" />
            <span className="text-gray-300">Steps</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics.steps.toLocaleString()}
          </div>
        </motion.div>
      )}

      {metrics.sleep && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Moon className="text-blue-400 w-5 h-5" />
            <span className="text-gray-300">Sleep</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics.sleep.duration} <span className="text-sm text-gray-400">hrs</span>
          </div>
          <div className="text-sm text-gray-400">
            Quality: {metrics.sleep.quality}/10
          </div>
        </motion.div>
      )}

      {metrics.stress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="text-purple-400 w-5 h-5" />
            <span className="text-gray-300">Stress Level</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics.stress}/10
          </div>
        </motion.div>
      )}
    </div>
  );
}