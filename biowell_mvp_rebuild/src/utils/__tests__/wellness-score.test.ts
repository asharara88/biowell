import { describe, it, expect } from 'vitest';
import {
  calculateWellnessScore,
  validateMetrics,
  calculateMovementScore,
  calculateHRVScore,
  calculateGlucoseScore,
  getScoreCategory,
  type WellnessMetrics
} from '../wellness-score';

describe('Wellness Score Calculations', () => {
  const validMetrics: WellnessMetrics = {
    sleepScore: 85,
    nutritionScore: 75,
    moodScore: 90,
    steps_count: 8000,
    calories_burned: 400,
    workout_minutes: 45,
    hrv_avg: 65,
    avg_glucose: 85
  };

  describe('validateMetrics', () => {
    it('accepts valid metrics', () => {
      expect(() => validateMetrics(validMetrics)).not.toThrow();
    });

    it('throws error for invalid scores', () => {
      const invalidMetrics = { ...validMetrics, sleepScore: -1 };
      expect(() => validateMetrics(invalidMetrics)).toThrow();
    });
  });

  describe('calculateMovementScore', () => {
    it('calculates movement score correctly', () => {
      const score = calculateMovementScore(validMetrics);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateHRVScore', () => {
    it('calculates HRV score correctly', () => {
      const score = calculateHRVScore(65);
      expect(score).toBe(0.65);
    });

    it('returns 0 for undefined HRV', () => {
      expect(calculateHRVScore(undefined)).toBe(0);
    });
  });

  describe('calculateGlucoseScore', () => {
    it('calculates glucose score correctly', () => {
      const score = calculateGlucoseScore(85);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('returns 0 for undefined glucose', () => {
      expect(calculateGlucoseScore(undefined)).toBe(0);
    });
  });

  describe('calculateWellnessScore', () => {
    it('calculates overall wellness score', () => {
      const score = calculateWellnessScore(validMetrics);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('handles missing optional metrics', () => {
      const basicMetrics = {
        sleepScore: 80,
        nutritionScore: 75,
        moodScore: 85
      };
      const score = calculateWellnessScore(basicMetrics);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('getScoreCategory', () => {
    it('returns correct category for excellent score', () => {
      const result = getScoreCategory(95);
      expect(result.category).toBe('Excellent');
    });

    it('returns correct category for poor score', () => {
      const result = getScoreCategory(55);
      expect(result.category).toBe('Needs Attention');
    });
  });
});