import { describe, it, expect } from 'vitest';
import {
  validateHealthData,
  aggregateHealthData,
  initializeHealthTracking,
  type HealthData
} from '../health-integration';

describe('Health Integration Utils', () => {
  describe('initializeHealthTracking', () => {
    it('initializes health tracking', async () => {
      const result = await initializeHealthTracking();
      expect(result).toBe(true);
    });
  });

  describe('validateHealthData', () => {
    it('validates valid health data', () => {
      const validData: HealthData = {
        steps: 10000,
        heartRate: 75,
        sleepHours: 8,
        activeEnergyBurned: 500,
        workoutMinutes: 60,
        dietaryEnergy: 2000,
        dietaryProtein: 80,
        weight: 70,
        height: 175
      };
      expect(validateHealthData(validData)).toBe(true);
    });

    it('invalidates negative steps', () => {
      const invalidData: HealthData = {
        steps: -100
      };
      expect(validateHealthData(invalidData)).toBe(false);
    });

    it('invalidates unrealistic heart rate', () => {
      const invalidData: HealthData = {
        heartRate: 250
      };
      expect(validateHealthData(invalidData)).toBe(false);
    });

    it('invalidates impossible sleep hours', () => {
      const invalidData: HealthData = {
        sleepHours: 25
      };
      expect(validateHealthData(invalidData)).toBe(false);
    });

    it('invalidates unrealistic weight', () => {
      const invalidData: HealthData = {
        weight: 1000
      };
      expect(validateHealthData(invalidData)).toBe(false);
    });

    it('invalidates unrealistic height', () => {
      const invalidData: HealthData = {
        height: 400
      };
      expect(validateHealthData(invalidData)).toBe(false);
    });
  });

  describe('aggregateHealthData', () => {
    it('aggregates multiple data points', () => {
      const dataPoints: HealthData[] = [
        {
          steps: 10000,
          heartRate: 70,
          sleepHours: 7,
          activeEnergyBurned: 400,
          workoutMinutes: 45,
          dietaryEnergy: 2000,
          dietaryProtein: 80,
          weight: 70,
          height: 175
        },
        {
          steps: 8000,
          heartRate: 75,
          sleepHours: 8,
          activeEnergyBurned: 350,
          workoutMinutes: 30,
          dietaryEnergy: 2200,
          dietaryProtein: 85,
          weight: 70,
          height: 175
        }
      ];

      const result = aggregateHealthData(dataPoints);
      expect(result.steps).toBe(9000);
      expect(result.heartRate).toBe(73);
      expect(result.sleepHours).toBe(7.5);
      expect(result.activeEnergyBurned).toBe(375);
      expect(result.workoutMinutes).toBe(38);
      expect(result.dietaryEnergy).toBe(2100);
      expect(result.dietaryProtein).toBe(83);
      expect(result.weight).toBe(70);
      expect(result.height).toBe(175);
    });

    it('handles empty array', () => {
      const result = aggregateHealthData([]);
      expect(result).toEqual({});
    });

    it('filters out invalid data points', () => {
      const dataPoints: HealthData[] = [
        {
          steps: 10000,
          heartRate: 70,
          weight: 70
        },
        {
          steps: -1000, // invalid
          heartRate: 75,
          weight: 1000 // invalid
        }
      ];

      const result = aggregateHealthData(dataPoints);
      expect(result.steps).toBe(10000);
      expect(result.heartRate).toBe(73);
      expect(result.weight).toBe(70);
    });
  });
});