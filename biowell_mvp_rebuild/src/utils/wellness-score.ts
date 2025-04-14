import { handleError } from './error-handling';

export interface WellnessMetrics {
  sleepScore: number;
  nutritionScore: number;
  moodScore: number;
  steps_count?: number;
  calories_burned?: number;
  workout_minutes?: number;
  hrv_avg?: number;
  avg_glucose?: number;
}

interface WeightConfig {
  sleep: number;
  nutrition: number;
  mood: number;
  movement: number;
  HRV: number;
  CGM: number;
}

const DEFAULT_WEIGHTS: WeightConfig = {
  sleep: 0.25,
  nutrition: 0.20,
  mood: 0.10,
  movement: 0.15,
  HRV: 0.15,
  CGM: 0.15
};

const TARGETS = {
  steps: 10000,
  calories: 500,
  workoutMinutes: 30,
  hrvMax: 100,
  glucoseIdealMin: 70,
  glucoseIdealMax: 100
};

export function validateMetrics(metrics: WellnessMetrics): void {
  const requiredScores = ['sleepScore', 'nutritionScore', 'moodScore'];
  
  for (const score of requiredScores) {
    if (typeof metrics[score as keyof WellnessMetrics] !== 'number' || 
        metrics[score as keyof WellnessMetrics] < 0 || 
        metrics[score as keyof WellnessMetrics] > 100) {
      throw new Error(`Invalid ${score}: must be a number between 0 and 100`);
    }
  }

  // Validate optional metrics if present
  if (metrics.steps_count !== undefined && (metrics.steps_count < 0)) {
    throw new Error('Steps count cannot be negative');
  }
  if (metrics.calories_burned !== undefined && (metrics.calories_burned < 0)) {
    throw new Error('Calories burned cannot be negative');
  }
  if (metrics.workout_minutes !== undefined && (metrics.workout_minutes < 0)) {
    throw new Error('Workout minutes cannot be negative');
  }
  if (metrics.hrv_avg !== undefined && (metrics.hrv_avg < 0)) {
    throw new Error('HRV average cannot be negative');
  }
  if (metrics.avg_glucose !== undefined && (metrics.avg_glucose < 0)) {
    throw new Error('Average glucose cannot be negative');
  }
}

export function calculateMovementScore(metrics: WellnessMetrics): number {
  const { steps_count = 0, calories_burned = 0, workout_minutes = 0 } = metrics;
  
  const stepsScore = Math.min(steps_count / TARGETS.steps, 1);
  const caloriesScore = Math.min(calories_burned / TARGETS.calories, 1);
  const workoutScore = Math.min(workout_minutes / TARGETS.workoutMinutes, 1);
  
  return (stepsScore + caloriesScore + workoutScore) / 3;
}

export function calculateHRVScore(hrv_avg: number | undefined): number {
  if (!hrv_avg) return 0;
  return Math.min(hrv_avg / TARGETS.hrvMax, 1);
}

export function calculateGlucoseScore(avg_glucose: number | undefined): number {
  if (!avg_glucose) return 0;
  
  // Penalize glucose levels outside the ideal range
  if (avg_glucose < TARGETS.glucoseIdealMin) {
    return Math.max(1 - (TARGETS.glucoseIdealMin - avg_glucose) / TARGETS.glucoseIdealMin, 0);
  } else {
    return Math.max(1 - (avg_glucose - TARGETS.glucoseIdealMin) / TARGETS.glucoseIdealMin, 0);
  }
}

export function calculateWellnessScore(
  metrics: WellnessMetrics,
  weights: WeightConfig = DEFAULT_WEIGHTS
): number {
  try {
    validateMetrics(metrics);
    
    const {
      sleepScore,
      nutritionScore,
      moodScore,
      hrv_avg,
      avg_glucose
    } = metrics;

    const movementScore = calculateMovementScore(metrics);
    const hrvScore = calculateHRVScore(hrv_avg);
    const glucoseScore = calculateGlucoseScore(avg_glucose);

    const weightedScore =
      (sleepScore * weights.sleep) +
      (nutritionScore * weights.nutrition) +
      (moodScore * weights.mood) +
      (movementScore * weights.movement) +
      (hrvScore * weights.HRV) +
      (glucoseScore * weights.CGM);

    // Ensure final score is between 0 and 100
    return Math.round(Math.max(0, Math.min(100, weightedScore * 100)));
  } catch (error) {
    handleError(error, 'calculateWellnessScore');
    return 0;
  }
}

export function getScoreCategory(score: number): {
  category: string;
  color: string;
  description: string;
} {
  if (score >= 90) {
    return {
      category: 'Excellent',
      color: 'text-green-400',
      description: 'Outstanding wellness achievement'
    };
  } else if (score >= 80) {
    return {
      category: 'Very Good',
      color: 'text-blue-400',
      description: 'Strong wellness performance'
    };
  } else if (score >= 70) {
    return {
      category: 'Good',
      color: 'text-yellow-400',
      description: 'Solid wellness foundation'
    };
  } else if (score >= 60) {
    return {
      category: 'Fair',
      color: 'text-orange-400',
      description: 'Room for improvement'
    };
  } else {
    return {
      category: 'Needs Attention',
      color: 'text-red-400',
      description: 'Focus on wellness basics'
    };
  }
}