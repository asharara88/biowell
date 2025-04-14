```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MeditationSession from '../MeditationSession';
import { useHealthTracking } from '../../../hooks/useHealthTracking';
import { fetchFromDB } from '../../../utils/database';

// Mock dependencies
vi.mock('../../../hooks/useHealthTracking', () => ({
  useHealthTracking: vi.fn(() => ({ initialized: true }))
}));

vi.mock('../../../utils/database', () => ({
  fetchFromDB: vi.fn(() => Promise.resolve({ meditation_duration: 15 }))
}));

describe('MeditationSession', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders initial state correctly', () => {
    render(<MeditationSession userId="test-user" />);
    
    expect(screen.getByText(/ready to begin/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('starts meditation session', () => {
    render(<MeditationSession userId="test-user" />);
    
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
  });

  it('pauses and resumes session', () => {
    render(<MeditationSession userId="test-user" />);
    
    // Start session
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    
    // Pause session
    fireEvent.click(screen.getByRole('button', { name: /pause/i }));
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
    
    // Resume session
    fireEvent.click(screen.getByRole('button', { name: /resume/i }));
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('completes session after duration', () => {
    const onComplete = vi.fn();
    render(<MeditationSession userId="test-user" onComplete={onComplete} />);
    
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    
    // Fast forward to end of session
    act(() => {
      vi.advanceTimersByTime(10 * 60 * 1000); // 10 minutes
    });
    
    expect(screen.getByText(/session complete/i)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledWith(10);
  });

  it('loads user preferences', () => {
    render(<MeditationSession userId="test-user" />);
    expect(fetchFromDB).toHaveBeenCalledWith(expect.objectContaining({
      table: 'user_preferences',
      filters: { user_id: 'test-user' }
    }));
  });

  it('updates duration through settings', () => {
    render(<MeditationSession userId="test-user" />);
    
    // Open settings
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    
    // Change duration
    fireEvent.click(screen.getByRole('button', { name: '20 min' }));
    
    expect(screen.getByText('20:00')).toBeInTheDocument();
  });
});
```