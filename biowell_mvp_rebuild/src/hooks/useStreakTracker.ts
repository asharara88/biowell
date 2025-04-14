import { useState, useEffect } from 'react';
import { supabase } from '../api/client';

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastLoggedDate: string | null;
  streakStartDate: string | null;
  streakHistory: {
    date: string;
    count: number;
  }[];
}

export function useStreakTracker(lastLoggedDate: string | null) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    bestStreak: 0,
    lastLoggedDate: null,
    streakStartDate: null,
    streakHistory: []
  });

  useEffect(() => {
    if (!lastLoggedDate) {
      setStreakData(prev => ({
        ...prev,
        currentStreak: 1,
        lastLoggedDate: new Date().toISOString(),
        streakStartDate: new Date().toISOString(),
        streakHistory: [{ date: new Date().toISOString(), count: 1 }]
      }));
      return;
    }

    const today = new Date();
    const lastDate = new Date(lastLoggedDate);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Convert dates to start of day for accurate comparison
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const lastDateStart = new Date(lastDate.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));

    // Calculate days difference
    const daysDiff = Math.floor((todayStart.getTime() - lastDateStart.getTime()) / (1000 * 60 * 60 * 24));

    setStreakData(prev => {
      // If logged today, maintain current streak
      if (daysDiff === 0) {
        return prev;
      }

      // If logged yesterday, increment streak
      if (daysDiff === 1) {
        const newStreak = prev.currentStreak + 1;
        return {
          ...prev,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          lastLoggedDate: today.toISOString(),
          streakHistory: [
            ...prev.streakHistory,
            { date: today.toISOString(), count: newStreak }
          ]
        };
      }

      // If streak broken, reset to 1
      return {
        ...prev,
        currentStreak: 1,
        lastLoggedDate: today.toISOString(),
        streakStartDate: today.toISOString(),
        streakHistory: [
          ...prev.streakHistory,
          { date: today.toISOString(), count: 1 }
        ]
      };
    });
  }, [lastLoggedDate]);

  const getStreakStatus = () => {
    if (!streakData.lastLoggedDate) return 'first-time';
    
    const today = new Date();
    const lastDate = new Date(streakData.lastLoggedDate);
    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) return 'completed';
    if (daysDiff === 1) return 'maintain';
    return 'broken';
  };

  const getStreakMessage = () => {
    const status = getStreakStatus();
    const streak = streakData.currentStreak;

    switch (status) {
      case 'first-time':
        return "Start your streak today!";
      case 'completed':
        return "You've already logged today. Keep it up!";
      case 'maintain':
        return `Log today to maintain your ${streak} day streak!`;
      case 'broken':
        return "Start a new streak today!";
      default:
        return "";
    }
  };

  return {
    ...streakData,
    getStreakStatus,
    getStreakMessage,
    isActive: streakData.currentStreak > 0,
    canLogToday: getStreakStatus() !== 'completed'
  };
}