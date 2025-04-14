import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { syncHealthDataToBackend, startPeriodicSync, getLastSyncDate } from '../health-sync';
import { supabase } from '../../api/client';
import { fetchHealthData } from '../health-integration';

// Mock dependencies
vi.mock('../../api/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(() => ({
                data: { metric_date: '2025-04-12T00:00:00Z' },
                error: null
              }))
            }))
          }))
        })),
        insert: vi.fn(() => ({ error: null }))
      }))
    }))
  }
}));

vi.mock('../health-integration', () => ({
  fetchHealthData: vi.fn(() => Promise.resolve({
    steps: 10000,
    heartRate: 75,
    sleepHours: 8
  }))
}));

describe('Health Sync', () => {
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
    if (window._healthSyncInterval) {
      clearInterval(window._healthSyncInterval);
      delete window._healthSyncInterval;
    }
  });

  describe('syncHealthDataToBackend', () => {
    it('successfully syncs health data', async () => {
      const progressCallback = vi.fn();
      const result = await syncHealthDataToBackend({
        userId: mockUserId,
        onProgress: progressCallback
      });

      expect(result).toBe(true);
      expect(progressCallback).toHaveBeenCalledWith(100);
      expect(fetchHealthData).toHaveBeenCalled();
    });

    it('handles sync failure gracefully', async () => {
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                single: vi.fn(() => ({ error: new Error('Sync failed') }))
              }))
            }))
          }))
        })),
        insert: vi.fn()
      }));

      const result = await syncHealthDataToBackend({ userId: mockUserId });
      expect(result).toBe(false);
    });
  });

  describe('startPeriodicSync', () => {
    it('starts periodic sync with default interval', () => {
      const cleanup = startPeriodicSync({ userId: mockUserId });
      
      expect(window._healthSyncInterval).toBeDefined();
      expect(fetchHealthData).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(300000); // 5 minutes
      expect(fetchHealthData).toHaveBeenCalledTimes(2);

      cleanup();
      expect(window._healthSyncInterval).toBeUndefined();
    });

    it('uses custom sync interval', () => {
      const cleanup = startPeriodicSync({
        userId: mockUserId,
        syncInterval: 60000 // 1 minute
      });

      vi.advanceTimersByTime(60000);
      expect(fetchHealthData).toHaveBeenCalledTimes(2);

      cleanup();
    });
  });

  describe('getLastSyncDate', () => {
    it('returns last sync date', async () => {
      const date = await getLastSyncDate(mockUserId);
      expect(date).toBeInstanceOf(Date);
      expect(date?.toISOString()).toBe('2025-04-12T00:00:00.000Z');
    });

    it('handles no sync history', async () => {
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                single: vi.fn(() => ({ data: null, error: null }))
              }))
            }))
          }))
        }))
      }));

      const date = await getLastSyncDate(mockUserId);
      expect(date).toBeNull();
    });
  });
});