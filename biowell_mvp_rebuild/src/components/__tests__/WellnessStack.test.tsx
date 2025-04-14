import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WellnessStack from '../WellnessStack';
import { TestWrapper } from '../../test/utils';

describe('WellnessStack', () => {
  const mockProps = {
    title: 'Performance Stack',
    supplements: ['Creatine', 'Beta-Alanine', 'L-Citrulline'],
    habits: ['Progressive Overload', 'Recovery Protocol', 'Nutrition Timing'],
    coachingFocus: ['Performance Tracking', 'Training Optimization', 'Recovery Management']
  };

  it('renders stack title', () => {
    render(<WellnessStack {...mockProps} />, { wrapper: TestWrapper });
    expect(screen.getByText('Performance Stack')).toBeInTheDocument();
  });

  it('renders all supplements', () => {
    render(<WellnessStack {...mockProps} />, { wrapper: TestWrapper });
    mockProps.supplements.forEach(supplement => {
      expect(screen.getByText(supplement)).toBeInTheDocument();
    });
  });

  it('renders all habits', () => {
    render(<WellnessStack {...mockProps} />, { wrapper: TestWrapper });
    mockProps.habits.forEach(habit => {
      expect(screen.getByText(habit)).toBeInTheDocument();
    });
  });

  it('renders all coaching focus points', () => {
    render(<WellnessStack {...mockProps} />, { wrapper: TestWrapper });
    mockProps.coachingFocus.forEach(focus => {
      expect(screen.getByText(focus)).toBeInTheDocument();
    });
  });

  it('renders learn more button', () => {
    render(<WellnessStack {...mockProps} />, { wrapper: TestWrapper });
    expect(screen.getByRole('button')).toHaveTextContent(/learn more/i);
  });

  it('applies custom className', () => {
    const { container } = render(
      <WellnessStack {...mockProps} className="custom-class" />,
      { wrapper: TestWrapper }
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});