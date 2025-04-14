export interface HealthMetrics {
  id: string;
  user_id: string;
  metric_type: 'heart_rate' | 'steps' | 'glucose' | 'sleep' | 'energy' | 'stress';
  value: number;
  unit: string;
  timestamp: string;
  source: 'wearable' | 'cgm' | 'manual' | 'calculated';
  metadata?: Record<string, unknown>;
  created_at: string;
  
  // Additional fields from schema update
  metric_date?: string;
  steps_count?: number;
  calories_burned?: number;
  workout_minutes?: number;
  hrv_avg?: number;
  hrv_variability?: number;
  avg_glucose?: number;
  glucose_variability?: number;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastLoggedDate: string | null;
  streakStartDate: string | null;
  streakHistory: {
    date: string;
    count: number;
  }[];
  weeklyStreak: number;
  milestones: number[];
}

export interface WellnessScore {
  id: string;
  user_id: string;
  date: string;
  score: number;
  breakdown: {
    sleep?: number;
    nutrition?: number;
    activity?: number;
    stress?: number;
    mood?: number;
    recovery?: number;
  };
  created_at: string;
}