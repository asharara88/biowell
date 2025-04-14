import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Activity, Heart, Brain, TrendingUp, Clock } from 'lucide-react';
import { useScoreData } from '../../../hooks/useScoreData';

const DEMO_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  color: string;
}

function Metric({ icon, label, value, change, color }: MetricProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {React.cloneElement(icon as React.ReactElement, {
          className: `w-4 h-4 ${color}`
        })}
        <span className="text-gray-400">{label}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-white">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'transform rotate-180' : ''}`} />
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );
}

export default function WellnessScoreWidget() {
  const { data: scoreData, isLoading, error } = useScoreData(DEMO_USER_ID);

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse">
        <div className="h-32 bg-gray-800 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="text-red-400">Failed to load wellness score</div>
      </div>
    );
  }

  const metrics: MetricProps[] = [
    { 
      icon: <Activity />, 
      label: 'Activity', 
      value: `${scoreData?.metrics.activity}%`, 
      change: 8, 
      color: 'text-blue-400' 
    },
    { 
      icon: <Heart />, 
      label: 'Recovery', 
      value: `${scoreData?.metrics.stress}%`, 
      change: -3, 
      color: 'text-red-400' 
    },
    { 
      icon: <Brain />, 
      label: 'Focus', 
      value: '95%', 
      change: 12, 
      color: 'text-purple-400' 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-biowellGreen bg-opacity-10 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-biowellGreen" />
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-semibold text-white">Wellness Score</h2>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>Updated just now</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
          <span className="text-gray-400">+5% this week</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="w-32 h-32">
          <CircularProgressbar
            value={scoreData?.score || 0}
            text={`${scoreData?.score || 0}`}
            styles={buildStyles({
              textSize: '24px',
              pathColor: `rgba(76, 175, 80, ${(scoreData?.score || 0) / 100})`,
              textColor: '#ffffff',
              trailColor: '#1f2937',
              pathTransitionDuration: 0.5,
              strokeLinecap: 'round'
            })}
          />
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Metric {...metric} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Daily Insight</h3>
        <p className="text-white text-sm">
          Your wellness score indicates excellent progress. Keep maintaining your current routine for optimal results.
        </p>
      </div>
    </motion.div>
  );
}