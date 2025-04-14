import { supabase } from '../api/client';
import { handleError } from './error-handling';
import { fetchHealthData, type HealthData } from './health-integration';

interface SyncConfig {
  userId: string;
  syncInterval?: number;
  retryAttempts?: number;
  onProgress?: (progress: number) => void;
}

const DEFAULT_CONFIG = {
  syncInterval: 300000, // 5 minutes
  retryAttempts: 3
};

export async function syncHealthDataToBackend(config: SyncConfig): Promise<boolean> {
  const { userId, onProgress } = config;

  try {
    // Get last sync date
    const { data: lastSync } = await supabase
      .from('health_metrics')
      .select('metric_date')
      .eq('user_id', userId)
      .order('metric_date', { ascending: false })
      .limit(1)
      .single();

    const lastSyncDate = lastSync?.metric_date ? new Date(lastSync.metric_date) : new Date(0);
    const now = new Date();

    // Fetch health data
    onProgress?.(20);
    const healthData = await fetchHealthData(lastSyncDate, now);

    // Prepare metrics for storage
    const metrics = prepareMetricsForStorage(healthData, userId);
    
    onProgress?.(50);

    // Store in database
    const { error } = await supabase
      .from('health_metrics')
      .insert(metrics);

    if (error) throw error;

    onProgress?.(100);
    return true;
  } catch (error) {
    handleError(error, 'syncHealthDataToBackend');
    return false;
  }
}

function prepareMetricsForStorage(data: HealthData, userId: string) {
  return {
    user_id: userId,
    steps_count: data.steps,
    heart_rate: data.heartRate,
    sleep_hours: data.sleepHours,
    calories_burned: data.activeEnergyBurned,
    workout_minutes: data.workoutMinutes,
    hrv_avg: data.hrv,
    avg_glucose: data.glucose,
    dietary_energy: data.dietaryEnergy,
    dietary_protein: data.dietaryProtein,
    metric_date: new Date().toISOString()
  };
}

export function startPeriodicSync(config: SyncConfig): () => void {
  // Clear any existing sync interval
  if (window._healthSyncInterval) {
    clearInterval(window._healthSyncInterval);
  }

  // Initial sync
  syncHealthDataToBackend(config);

  // Set up periodic sync
  window._healthSyncInterval = setInterval(() => {
    syncHealthDataToBackend(config);
  }, config.syncInterval || DEFAULT_CONFIG.syncInterval);

  // Return cleanup function
  return () => {
    if (window._healthSyncInterval) {
      clearInterval(window._healthSyncInterval);
      delete window._healthSyncInterval;
    }
  };
}

export async function getLastSyncDate(userId: string): Promise<Date | null> {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('metric_date')
      .eq('user_id', userId)
      .order('metric_date', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data ? new Date(data.metric_date) : null;
  } catch (error) {
    handleError(error, 'getLastSyncDate');
    return null;
  }
}