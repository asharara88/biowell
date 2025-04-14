import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Moon, Clock, Zap } from 'lucide-react';

interface SleepScoreProps {
  score?: number;
  duration?: number;
  quality?: number;
  efficiency?: number;
}

export default function SleepScore({
  score = 85,
  duration = 7.5,
  quality = 90,
  efficiency = 95
}: SleepScoreProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Moon className="w-5 h-5 text-blue-400 mr-2" />
        Sleep Score
      </h2>

      <div className="flex items-center justify-between mb-8">
        <div className="w-32 h-32">
          <CircularProgressbar
            value={score}
            text={`${score}`}
            maxValue={100}
            styles={buildStyles({
              textSize: '24px',
              pathColor: `rgba(96, 165, 250, ${score / 100})`,
              textColor: '#ffffff',
              trailColor: '#1f2937',
              pathTransitionDuration: 0.5,
            })}
          />
        </div>
        
        <div className="flex-1 ml-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                Duration
              </div>
              <span className="text-white font-semibold">{duration}hrs</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-400">
                <Moon className="w-4 h-4 mr-2" />
                Quality
              </div>
              <span className="text-white font-semibold">{quality}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-400">
                <Zap className="w-4 h-4 mr-2" />
                Efficiency
              </div>
              <span className="text-white font-semibold">{efficiency}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Sleep Insights</h3>
        <p className="text-white text-sm">
          Your sleep score indicates excellent rest quality. Maintain your current sleep schedule for optimal recovery.
        </p>
      </div>
    </div>
  );
}