import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { TestWrapper } from '../../test/utils';
import * as integrations from '../../api/integrations';

vi.mock('../../api/integrations', () => ({
  WearableIntegration: {
    fetchWearableData: vi.fn(),
  },
  CGMIntegration: {
    getLatestReading: vi.fn(),
  }
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock implementations with proper Promise returns
    vi.mocked(integrations.WearableIntegration.fetchWearableData).mockResolvedValue(
      Promise.resolve({
        metrics: {},
        lastSync: new Date().toISOString()
      })
    );
    vi.mocked(integrations.CGMIntegration.getLatestReading).mockResolvedValue(
      Promise.resolve({
        glucose_level: 0,
        trend: 'stable'
      })
    );
  });

  it('renders loading state initially', () => {
    render(<Dashboard />, { wrapper: TestWrapper });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays health metrics when data is loaded', async () => {
    const mockWearableData = {
      metrics: {
        heartRate: 75,
        steps: 8000,
        energyLevel: 85,
        batteryLevel: 90
      },
      lastSync: new Date().toISOString()
    };

    const mockCGMData = {
      glucose_level: 95,
      trend: 'stable'
    };

    vi.mocked(integrations.WearableIntegration.fetchWearableData).mockResolvedValueOnce(
      Promise.resolve(mockWearableData)
    );
    vi.mocked(integrations.CGMIntegration.getLatestReading).mockResolvedValueOnce(
      Promise.resolve(mockCGMData)
    );

    render(<Dashboard />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('75')).toBeInTheDocument(); // Heart rate
      expect(screen.getByText('8,000')).toBeInTheDocument(); // Steps
      expect(screen.getByText('95')).toBeInTheDocument(); // Glucose
      expect(screen.getByText('stable')).toBeInTheDocument(); // Trend
    });
  });

  it('handles error state', async () => {
    vi.mocked(integrations.WearableIntegration.fetchWearableData).mockRejectedValueOnce(
      Promise.reject(new Error('API Error'))
    );
    vi.mocked(integrations.CGMIntegration.getLatestReading).mockRejectedValueOnce(
      Promise.reject(new Error('API Error'))
    );

    render(<Dashboard />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch health data/)).toBeInTheDocument();
    });
  });
});