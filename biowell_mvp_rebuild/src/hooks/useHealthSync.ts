import { useState, useEffect, useCallback } from 'react';
import { syncHealthDataToBackend, startPeriodicSync, getLastSyncDate } from '../utils/health-sync';

interface UseHealthSyncOptions {
  userId: string;
  syncInterval?: number;
  autoSync?: boolean;
}

export function useHealthSync({ userId, syncInterval, autoSync = true }: UseHealthSyncOptions) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch last sync date on mount
  useEffect(() => {
    getLastSyncDate(userId).then(setLastSync);
  }, [userId]);

  // Handle manual sync
  const sync = useCallback(async () => {
    if (syncing) return;

    try {
      setSyncing(true);
      setError(null);

      const success = await syncHealthDataToBackend({
        userId,
        onProgress: setSyncProgress
      });

      if (success) {
        const newLastSync = await getLastSyncDate(userId);
        setLastSync(newLastSync);
      } else {
        setError('Sync failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
      setSyncProgress(0);
    }
  }, [userId, syncing]);

  // Set up auto sync if enabled
  useEffect(() => {
    if (!autoSync) return;

    const cleanup = startPeriodicSync({
      userId,
      syncInterval,
      onProgress: setSyncProgress
    });

    return cleanup;
  }, [userId, syncInterval, autoSync]);

  return {
    sync,
    syncing,
    lastSync,
    syncProgress,
    error
  };
}