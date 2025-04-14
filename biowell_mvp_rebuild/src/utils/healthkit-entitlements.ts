import { handleError } from './error-handling';

// HealthKit data types we want to read
export const READ_PERMISSIONS = [
  'steps',              // Step count
  'heartRate',          // Heart rate
  'sleepAnalysis',      // Sleep data
  'activeEnergyBurned', // Active calories
  'basalEnergyBurned',  // Resting calories
  'workoutType',        // Workout type
  'workoutDuration',    // Workout duration
  'hrv',                // Heart rate variability
  'bloodGlucose',       // Blood glucose
  'dietaryData'         // Nutrition data
] as const;

// HealthKit data types we want to write
export const WRITE_PERMISSIONS = [
  'steps',
  'activeEnergyBurned',
  'workoutType',
  'workoutDuration'
] as const;

export type ReadPermission = typeof READ_PERMISSIONS[number];
export type WritePermission = typeof WRITE_PERMISSIONS[number];

interface HealthKitConfig {
  readPermissions: ReadPermission[];
  writePermissions: WritePermission[];
}

export const healthKitConfig: HealthKitConfig = {
  readPermissions: [...READ_PERMISSIONS],
  writePermissions: [...WRITE_PERMISSIONS]
};

export async function requestHealthKitPermissions(): Promise<boolean> {
  try {
    // This would be replaced with actual HealthKit permission request
    // For web demo, simulate successful permission grant
    return true;
  } catch (error) {
    handleError(error, 'requestHealthKitPermissions');
    return false;
  }
}

export function checkHealthKitAvailability(): boolean {
  // This would check if HealthKit is available on the device
  // For web demo, return false
  return false;
}

export function getRequestedPermissions(): string[] {
  return [
    ...READ_PERMISSIONS,
    ...WRITE_PERMISSIONS
  ];
}

export function validatePermissions(permissions: string[]): boolean {
  const validPermissions = new Set([...READ_PERMISSIONS, ...WRITE_PERMISSIONS]);
  return permissions.every(permission => validPermissions.has(permission as ReadPermission | WritePermission));
}