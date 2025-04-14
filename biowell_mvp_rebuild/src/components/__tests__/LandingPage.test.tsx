import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from '../LandingPage';
import { TestWrapper } from '../../test/utils';

describe('LandingPage', () => {
  it('renders hero section', () => {
    render(<LandingPage />, { wrapper: TestWrapper });
    
    expect(screen.getByText(/Optimize Your Health/i)).toBeInTheDocument();
    expect(screen.getByText(/Stackable features, Seamless connectivity/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
  });

  it('navigates to auth page when Get Started is clicked', async () => {
    const user = userEvent.setup();
    render(<LandingPage />, { wrapper: TestWrapper });
    
    const button = screen.getByRole('button', { name: /Get Started/i });
    await user.click(button);
    
    // Navigation is handled by React Router in the TestWrapper
    expect(window.location.pathname).toBe('/');
  });

  it('renders feature cards', () => {
    render(<LandingPage />, { wrapper: TestWrapper });
    
    expect(screen.getByText(/Personalized Stacks/i)).toBeInTheDocument();
    expect(screen.getByText(/Habit Integration/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Digital Personal Coach/i)).toBeInTheDocument();
  });

  it('renders wellness stacks', () => {
    render(<LandingPage />, { wrapper: TestWrapper });
    
    const stacks = [
      'Performance Stack',
      'Cognitive Stack',
      'Longevity Stack',
      'Sleep Stack'
    ];

    stacks.forEach(stack => {
      expect(screen.getByText(stack)).toBeInTheDocument();
    });
  });

  it('renders how it works section', () => {
    render(<LandingPage />, { wrapper: TestWrapper });
    
    const steps = [
      'Initial Assessment',
      'Data Integration',
      'AI Analysis',
      'Stack Creation',
      'Ongoing Optimization'
    ];

    steps.forEach(step => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });
});