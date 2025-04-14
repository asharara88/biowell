import { useQuery } from '@tanstack/react-query';
import { supabase } from '../api/client';

interface ScoreData {
  id: string;
  user_id: string;
  score: number;
  metrics: {
    activity: number;
    stress: number;
    sleep: number;
    nutrition: number;
    steps_count?: number;
    calories_burned?: number;
    workout_minutes?: number;
    hrv_avg?: number;
    hrv_variability?: number;
    avg_glucose?: number;
    glucose_variability?: number;
  };
  created_at: string;
}

async function fetchScoreData(userId: string): Promise<ScoreData> {
  const { data, error } = await supabase
    .from('health_metrics')
    .select(`
      id,
      user_id,
      activity,
      stress,
      sleep,
      nutrition,
      steps_count,
      calories_burned,
      workout_minutes,
      hrv_avg,
      hrv_variability,
      avg_glucose,
      glucose_variability,
      created_at
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw new Error(`Failed to fetch score data: ${error.message}`);
  }

  // If no data exists, return default values
  if (!data) {
    return {
      id: 'default',
      user_id: userId,
      score: 85,
      metrics: {
        activity: 82,
        stress: 78,
        sleep: 88,
        nutrition: 85,
        steps_count: 0,
        calories_burned: 0,
        workout_minutes: 0,
        hrv_avg: 0,
        hrv_variability: 0,
        avg_glucose: 0,
        glucose_variability: 0
      },
      created_at: new Date().toISOString()
    };
  }

  // Calculate overall score based on available metrics
  const score = Math.round(
    (data.activity + data.stress + data.sleep + data.nutrition) / 4
  );

  return {
    id: data.id,
    user_id: data.user_id,
    score,
    metrics: {
      activity: data.activity,
      stress: data.stress,
      sleep: data.sleep,
      nutrition: data.nutrition,
      steps_count: data.steps_count || 0,
      calories_burned: data.calories_burned || 0,
      workout_minutes: data.workout_minutes || 0,
      hrv_avg: data.hrv_avg || 0,
      hrv_variability: data.hrv_variability || 0,
      avg_glucose: data.avg_glucose || 0,
      glucose_variability: data.glucose_variability || 0
    },
    created_at: data.created_at
  };
}

export function useScoreData(userId: string) {
  return useQuery({
    queryKey: ['scoreData', userId],
    queryFn: () => fetchScoreData(userId),
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
}