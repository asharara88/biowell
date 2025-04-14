import { describe, it, expect } from 'vitest';
import {
  READ_PERMISSIONS,
  WRITE_PERMISSIONS,
  healthKitConfig,
  validatePermissions,
  getRequestedPermissions,
  checkHealthKitAvailability
} from '../healthkit-entitlements';

describe('HealthKit Entitlements', () => {
  describe('Permission Configuration', () => {
    it('has required read permissions', () => {
      const requiredPermissions = [
        'steps',
        'heartRate',
        'sleepAnalysis',
        'activeEnergyBurned'
      ];

      requiredPermissions.forEach(permission => {
        expect(READ_PERMISSIONS).toContain(permission);
      });
    });

    it('has required write permissions', () => {
      const requiredPermissions = [
        'steps',
        'activeEnergyBurned',
        'workoutType',
        'workoutDuration'
      ];

      requiredPermissions.forEach(permission => {
        expect(WRITE_PERMISSIONS).toContain(permission);
      });
    });

    it('has valid healthKitConfig structure', () => {
      expect(healthKitConfig).toHaveProperty('readPermissions');
      expect(healthKitConfig).toHaveProperty('writePermissions');
      expect(Array.isArray(healthKitConfig.readPermissions)).toBe(true);
      expect(Array.isArray(healthKitConfig.writePermissions)).toBe(true);
    });
  });

  describe('validatePermissions', () => {
    it('validates correct permissions', () => {
      const validPermissions = ['steps', 'heartRate', 'sleepAnalysis'];
      expect(validatePermissions(validPermissions)).toBe(true);
    });

    it('invalidates incorrect permissions', () => {
      const invalidPermissions = ['steps', 'invalidPermission'];
      expect(validatePermissions(invalidPermissions)).toBe(false);
    });
  });

  describe('getRequestedPermissions', () => {
    it('returns combined permissions array', () => {
      const permissions = getRequestedPermissions();
      expect(permissions.length).toBe(READ_PERMISSIONS.length + WRITE_PERMISSIONS.length);
      expect(permissions).toContain('steps');
      expect(permissions).toContain('heartRate');
    });
  });

  describe('checkHealthKitAvailability', () => {
    it('returns false for web environment', () => {
      expect(checkHealthKitAvailability()).toBe(false);
    });
  });
});