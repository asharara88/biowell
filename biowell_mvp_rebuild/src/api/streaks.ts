import { supabase } from './client';
import { handleError } from '../utils/error-handling';

export async function updateStreak(userId: string) {
  try {
    // Get existing streak data
    const { data: existing } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    const today = new Date().toISOString().slice(0, 10);

    if (existing) {
      const lastUpdate = new Date(existing.last_updated);
      lastUpdate.setDate(lastUpdate.getDate() + 1);
      const isConsecutive = lastUpdate.toISOString().slice(0, 10) === today;

      // Calculate new streak value
      const newStreak = isConsecutive ? existing.current_streak + 1 : 1;
      const newBestStreak = Math.max(existing.best_streak || 0, newStreak);

      // Update streak record
      const { error } = await supabase
        .from('streaks')
        .update({
          current_streak: newStreak,
          best_streak: newBestStreak,
          last_updated: today,
          streak_start_date: isConsecutive ? existing.streak_start_date : today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return newStreak;
    } else {
      // Create new streak record
      const { error } = await supabase
        .from('streaks')
        .insert({
          user_id: userId,
          current_streak: 1,
          best_streak: 1,
          last_updated: today,
          streak_start_date: today
        });

      if (error) throw error;
      return 1;
    }
  } catch (error) {
    handleError(error, 'updateStreak');
    throw new Error('Failed to update streak');
  }
}

export async function getStreak(userId: string) {
  try {
    const { data, error } = await supabase
      .from('streaks')
      .select('current_streak, best_streak, last_updated, streak_start_date')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    // Check if streak is still valid (no more than 1 day gap)
    if (data) {
      const lastUpdate = new Date(data.last_updated);
      const today = new Date();
      const daysSinceUpdate = Math.floor((today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

      // If more than 1 day has passed, reset streak
      if (daysSinceUpdate > 1) {
        const { error: updateError } = await supabase
          .from('streaks')
          .update({
            current_streak: 0,
            last_updated: today.toISOString().slice(0, 10),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) throw updateError;
        return { current_streak: 0, best_streak: data.best_streak };
      }

      return data;
    }

    return { current_streak: 0, best_streak: 0 };
  } catch (error) {
    handleError(error, 'getStreak');
    throw new Error('Failed to get streak data');
  }
}