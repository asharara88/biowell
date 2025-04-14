import { useState, useEffect } from 'react';
import { initializeHealthMonitoring, type HealthTrackingConfig } from '../utils/health-tracking';

export function useHealthTracking(config?: HealthTrackingConfig) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const success = await initializeHealthMonitoring(config);
        setInitialized(success);
        if (!success) {
          setError('Failed to initialize health tracking');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setInitialized(false);
      }
    }

    initialize();

    // Cleanup function
    return () => {
      if (window._healthSyncInterval) {
        clearInterval(window._healthSyncInterval);
        delete window._healthSyncInterval;
      }
    };
  }, []);

  return { initialized, error };
}