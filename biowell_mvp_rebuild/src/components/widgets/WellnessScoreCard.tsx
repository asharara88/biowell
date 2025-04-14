import React, { useMemo } from 'react';

interface WellnessScoreCardProps {
  sleepScore: number;
  nutritionScore: number;
  moodScore: number;
  previousScore?: number;
}

export default function WellnessScoreCard({
  sleepScore,
  nutritionScore,
  moodScore,
  previousScore = 0
}: WellnessScoreCardProps) {
  const score = useMemo(() => {
    const total = sleepScore + nutritionScore + moodScore;
    return Math.round(total / 3);
  }, [sleepScore, nutritionScore, moodScore]);

  const trend = score > previousScore ? '↑' : score < previousScore ? '↓' : '→';
  const color = score >= 80 ? 'bg-green-100 text-green-700' :
                score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700';

  return (
    <div className={`p-4 rounded shadow ${color}`}>
      <h3 className="text-lg font-semibold mb-1">Daily Wellness Score</h3>
      <div className="flex items-center justify-between">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xl font-bold">{trend}</span>
      </div>
      <p className="text-sm mt-2">Based on today's sleep, nutrition, and mood inputs.</p>
    </div>
  );
}