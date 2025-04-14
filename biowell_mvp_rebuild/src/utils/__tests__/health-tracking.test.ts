import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initializeHealthMonitoring, saveWeightSample, saveProteinSample } from '../health-tracking';
import { initializeHealthTracking, writeHealthData } from '../health-integration';

// Mock health-integration module
vi.mock('../health-integration', () => ({
  initializeHealthTracking: vi.fn().mockResolvedValue(true),
  writeHealthData: vi.fn().mockResolvedValue(true),
  validateHealthData: vi.fn().mockReturnValue(true)
}));

describe('Health Tracking', () => {
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

  describe('initializeHealthMonitoring', () => {
    it('initializes with default config', async () => {
      const result = await initializeHealthMonitoring();
      expect(result).toBe(true);
      expect(initializeHealthTracking).toHaveBeenCalled();
    });

    it('sets up auto sync with default interval', async () => {
      await initializeHealthMonitoring();
      expect(window._healthSyncInterval).toBeDefined();
      
      // Fast-forward time and check if sync was triggered
      vi.advanceTimersByTime(300000); // 5 minutes
      expect(initializeHealthTracking).toHaveBeenCalledTimes(2);
    });

    it('uses custom sync interval', async () => {
      await initializeHealthMonitoring({
        autoSync: true,
        syncInterval: 60000 // 1 minute
      });
      
      vi.advanceTimersByTime(60000);
      expect(initializeHealthTracking).toHaveBeenCalledTimes(2);
    });

    it('disables auto sync when configured', async () => {
      await initializeHealthMonitoring({
        autoSync: false
      });
      
      expect(window._healthSyncInterval).toBeUndefined();
      vi.advanceTimersByTime(300000);
      expect(initializeHealthTracking).toHaveBeenCalledTimes(1);
    });

    it('handles initialization failure', async () => {
      vi.mocked(initializeHealthTracking).mockResolvedValueOnce(false);
      const result = await initializeHealthMonitoring();
      expect(result).toBe(false);
    });
  });

  describe('saveWeightSample', () => {
    it('saves valid weight data', async () => {
      const result = await saveWeightSample(70);
      expect(result).toBe(true);
      expect(writeHealthData).toHaveBeenCalledWith(expect.objectContaining({
        weight: 70
      }));
    });

    it('rejects invalid weight value', async () => {
      const result = await saveWeightSample(-1);
      expect(result).toBe(false);
    });
  });

  describe('saveProteinSample', () => {
    it('saves valid protein data', async () => {
      const result = await saveProteinSample(30);
      expect(result).toBe(true);
      expect(writeHealthData).toHaveBeenCalledWith(expect.objectContaining({
        dietaryProtein: 30
      }));
    });

    it('rejects negative protein value', async () => {
      const result = await saveProteinSample(-5);
      expect(result).toBe(false);
    });
  });
});