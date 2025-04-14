import { initializeHealthTracking, writeHealthData, validateHealthData, type HealthData } from './health-integration';
import { handleError } from './error-handling';

export interface HealthTrackingConfig {
  autoSync?: boolean;
  syncInterval?: number;
  requiredPermissions?: string[];
}

const DEFAULT_CONFIG: HealthTrackingConfig = {
  autoSync: true,
  syncInterval: 300000, // 5 minutes
};

export async function initializeHealthMonitoring(config: HealthTrackingConfig = DEFAULT_CONFIG): Promise<boolean> {
  try {
    // Initialize health tracking
    const initialized = await initializeHealthTracking();
    if (!initialized) {
      throw new Error('Failed to initialize health tracking');
    }

    // Set up auto-sync if enabled
    if (config.autoSync) {
      startAutoSync(config.syncInterval || DEFAULT_CONFIG.syncInterval!);
    }

    console.log('Health monitoring initialized successfully');
    return true;
  } catch (error) {
    handleError(error, 'initializeHealthMonitoring');
    return false;
  }
}

export async function saveWeightSample(valueKg: number): Promise<boolean> {
  try {
    if (valueKg <= 0) {
      throw new Error('Weight value must be greater than 0');
    }

    const healthData: Partial<HealthData> = {
      weight: valueKg
    };

    if (!validateHealthData(healthData)) {
      throw new Error('Invalid weight data');
    }

    return await writeHealthData(healthData);
  } catch (error) {
    handleError(error, 'saveWeightSample');
    return false;
  }
}

export async function saveProteinSample(grams: number): Promise<boolean> {
  try {
    if (grams < 0) {
      throw new Error('Protein value cannot be negative');
    }

    const healthData: Partial<HealthData> = {
      dietaryProtein: grams
    };

    if (!validateHealthData(healthData)) {
      throw new Error('Invalid protein data');
    }

    return await writeHealthData(healthData);
  } catch (error) {
    handleError(error, 'saveProteinSample');
    return false;
  }
}

function startAutoSync(interval: number) {
  // Clear any existing sync interval
  if (window._healthSyncInterval) {
    clearInterval(window._healthSyncInterval);
  }

  // Set up new sync interval
  window._healthSyncInterval = setInterval(async () => {
    try {
      await initializeHealthTracking();
    } catch (error) {
      handleError(error, 'autoSync');
    }
  }, interval);

  // Clean up on page unload
  window.addEventListener('unload', () => {
    if (window._healthSyncInterval) {
      clearInterval(window._healthSyncInterval);
    }
  });
}

// Add type definition for window object
declare global {
  interface Window {
    _healthSyncInterval?: number;
  }
}