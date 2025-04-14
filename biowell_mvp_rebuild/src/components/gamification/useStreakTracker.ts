import { useState, useEffect } from 'react';
import { supabase } from '../../api/client';

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedAt: string | null;
  milestones: number[];
  weeklyStreak: number;
}

export function useStreakTracker(userId: string, habitId?: string) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedAt: null,
    milestones: [],
    weeklyStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStreakData();
  }, [userId, habitId]);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get habit completions ordered by date
      const { data: completions, error: completionsError } = await supabase
        .from('habit_completions')
        .select('completed_at')
        .eq(habitId ? 'habit_id' : 'user_id', habitId || userId)
        .order('completed_at', { ascending: false });

      if (completionsError) throw completionsError;

      if (!completions?.length) {
        setStreakData({
          currentStreak: 0,
          bestStreak: 0,
          lastCompletedAt: null,
          milestones: [],
          weeklyStreak: 0
        });
        return;
      }

      // Calculate current streak
      let currentStreak = 0;
      let bestStreak = 0;
      let weeklyStreak = 0;
      const lastCompletedAt = completions[0].completed_at;
      const today = new Date();
      const lastCompleted = new Date(lastCompletedAt);

      // Check if the streak is still active (completed today or yesterday)
      const daysSinceLastCompletion = Math.floor(
        (today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastCompletion <= 1) {
        // Calculate current streak
        let previousDate = lastCompleted;
        for (const completion of completions) {
          const completionDate = new Date(completion.completed_at);
          const dayDifference = Math.floor(
            (previousDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (dayDifference <= 1) {
            currentStreak++;
            previousDate = completionDate;
          } else {
            break;
          }
        }
      }

      // Calculate best streak
      let tempStreak = 1;
      for (let i = 1; i < completions.length; i++) {
        const current = new Date(completions[i].completed_at);
        const previous = new Date(completions[i - 1].completed_at);
        const dayDifference = Math.floor(
          (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDifference <= 1) {
          tempStreak++;
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, currentStreak);

      // Calculate weekly streak
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekCompletions = completions.filter(
        completion => new Date(completion.completed_at) >= weekStart
      );
      weeklyStreak = weekCompletions.length;

      // Calculate milestones (3, 7, 14, 30, 60, 90, 180, 365 days)
      const milestones = [3, 7, 14, 30, 60, 90, 180, 365].filter(
        milestone => currentStreak >= milestone
      );

      setStreakData({
        currentStreak,
        bestStreak,
        lastCompletedAt,
        milestones,
        weeklyStreak
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch streak data');
      console.error('Error fetching streak data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async () => {
    await fetchStreakData();
  };

  return {
    ...streakData,
    loading,
    error,
    updateStreak
  };
}