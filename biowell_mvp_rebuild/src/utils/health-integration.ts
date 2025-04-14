import { supabase } from '../api/client';
import { handleError } from './error-handling';

export interface HealthData {
  steps?: number;
  heartRate?: number;
  sleepHours?: number;
  activeEnergyBurned?: number;
  workoutMinutes?: number;
  hrv?: number;
  glucose?: number;
  dietaryEnergy?: number;
  dietaryProtein?: number;
  weight?: number;
  height?: number;
}

export interface HealthPermissions {
  steps: boolean;
  heartRate: boolean;
  sleep: boolean;
  activity: boolean;
  nutrition: boolean;
  bodyMeasurements: boolean;
}

export async function requestHealthPermissions(): Promise<HealthPermissions> {
  try {
    // For web, we'll use device motion/orientation permissions as a proxy
    const motionPermission = await navigator.permissions.query({ name: 'accelerometer' as PermissionName });
    
    return {
      steps: motionPermission.state === 'granted',
      heartRate: true, // Simulated for web
      sleep: true, // Simulated for web
      activity: motionPermission.state === 'granted',
      nutrition: true, // Simulated for web
      bodyMeasurements: true // Simulated for web
    };
  } catch (error) {
    console.warn('Permission API not supported, defaulting to true');
    return {
      steps: true,
      heartRate: true,
      sleep: true,
      activity: true,
      nutrition: true,
      bodyMeasurements: true
    };
  }
}

export async function initializeHealthTracking(): Promise<boolean> {
  try {
    const permissions = await requestHealthPermissions();
    return Object.values(permissions).some(permission => permission === true);
  } catch (error) {
    handleError(error, 'initializeHealthTracking');
    return false;
  }
}

export async function fetchHealthData(
  startDate: Date,
  endDate: Date = new Date()
): Promise<HealthData> {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .gte('metric_date', startDate.toISOString())
      .lte('metric_date', endDate.toISOString())
      .order('metric_date', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    if (!data) {
      return generateMockHealthData();
    }

    return {
      steps: data.steps_count,
      heartRate: data.heart_rate,
      sleepHours: data.sleep_hours,
      activeEnergyBurned: data.calories_burned,
      workoutMinutes: data.workout_minutes,
      hrv: data.hrv_avg,
      glucose: data.avg_glucose,
      dietaryEnergy: data.dietary_energy,
      dietaryProtein: data.dietary_protein,
      weight: data.weight,
      height: data.height
    };
  } catch (error) {
    handleError(error, 'fetchHealthData');
    return generateMockHealthData();
  }
}

function generateMockHealthData(): HealthData {
  return {
    steps: Math.floor(Math.random() * 5000) + 5000,
    heartRate: Math.floor(Math.random() * 20) + 60,
    sleepHours: Math.random() * 2 + 6,
    activeEnergyBurned: Math.floor(Math.random() * 300) + 200,
    workoutMinutes: Math.floor(Math.random() * 30) + 30,
    hrv: Math.floor(Math.random() * 30) + 40,
    glucose: Math.floor(Math.random() * 20) + 80,
    dietaryEnergy: Math.floor(Math.random() * 500) + 1500,
    dietaryProtein: Math.floor(Math.random() * 30) + 60,
    weight: Math.floor(Math.random() * 20) + 60,
    height: Math.floor(Math.random() * 30) + 160
  };
}

export async function writeHealthData(data: Partial<HealthData>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('health_metrics')
      .insert([{
        steps_count: data.steps,
        heart_rate: data.heartRate,
        sleep_hours: data.sleepHours,
        calories_burned: data.activeEnergyBurned,
        workout_minutes: data.workoutMinutes,
        hrv_avg: data.hrv,
        avg_glucose: data.glucose,
        dietary_energy: data.dietaryEnergy,
        dietary_protein: data.dietaryProtein,
        weight: data.weight,
        height: data.height,
        metric_date: new Date().toISOString()
      }]);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'writeHealthData');
    return false;
  }
}

export function validateHealthData(data: Partial<HealthData>): boolean {
  if (data.steps !== undefined && data.steps < 0) return false;
  if (data.heartRate !== undefined && (data.heartRate < 30 || data.heartRate > 220)) return false;
  if (data.sleepHours !== undefined && (data.sleepHours < 0 || data.sleepHours > 24)) return false;
  if (data.activeEnergyBurned !== undefined && data.activeEnergyBurned < 0) return false;
  if (data.workoutMinutes !== undefined && data.workoutMinutes < 0) return false;
  if (data.hrv !== undefined && data.hrv < 0) return false;
  if (data.glucose !== undefined && data.glucose < 0) return false;
  if (data.dietaryEnergy !== undefined && data.dietaryEnergy < 0) return false;
  if (data.dietaryProtein !== undefined && data.dietaryProtein < 0) return false;
  if (data.weight !== undefined && (data.weight < 20 || data.weight > 500)) return false;
  if (data.height !== undefined && (data.height < 50 || data.height > 300)) return false;
  return true;
}

export function aggregateHealthData(dataPoints: HealthData[]): HealthData {
  const validData = dataPoints.filter(validateHealthData);
  
  if (validData.length === 0) return {};

  return {
    steps: Math.round(
      validData.reduce((sum, dp) => sum + (dp.steps || 0), 0) / validData.length
    ),
    heartRate: Math.round(
      validData.reduce((sum, dp) => sum + (dp.heartRate || 0), 0) / validData.length
    ),
    sleepHours: Number(
      (validData.reduce((sum, dp) => sum + (dp.sleepHours || 0), 0) / validData.length).toFixed(1)
    ),
    activeEnergyBurned: Math.round(
      validData.reduce((sum, dp) => sum + (dp.activeEnergyBurned || 0), 0) / validData.length
    ),
    workoutMinutes: Math.round(
      validData.reduce((sum, dp) => sum + (dp.workoutMinutes || 0), 0) / validData.length
    ),
    hrv: Math.round(
      validData.reduce((sum, dp) => sum + (dp.hrv || 0), 0) / validData.length
    ),
    glucose: Math.round(
      validData.reduce((sum, dp) => sum + (dp.glucose || 0), 0) / validData.length
    ),
    dietaryEnergy: Math.round(
      validData.reduce((sum, dp) => sum + (dp.dietaryEnergy || 0), 0) / validData.length
    ),
    dietaryProtein: Math.round(
      validData.reduce((sum, dp) => sum + (dp.dietaryProtein || 0), 0) / validData.length
    ),
    weight: Number(
      (validData.reduce((sum, dp) => sum + (dp.weight || 0), 0) / validData.length).toFixed(1)
    ),
    height: Number(
      (validData.reduce((sum, dp) => sum + (dp.height || 0), 0) / validData.length).toFixed(1)
    )
  };
}