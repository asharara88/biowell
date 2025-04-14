import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimerAdjustment from '../TimerAdjustment';

describe('TimerAdjustment', () => {
  const defaultProps = {
    timings: {
      inhale: 4,
      exhale: 4,
      holdIn: 4,
      holdOut: 4
    },
    ranges: {
      inhale: [2, 10],
      exhale: [2, 15],
      holdIn: [0, 20],
      holdOut: [0, 120]
    },
    onUpdate: vi.fn(),
    onSave: vi.fn()
  };

  it('renders all timing inputs', () => {
    render(<TimerAdjustment {...defaultProps} />);
    
    expect(screen.getByLabelText(/inhale/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/exhale/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hold in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hold out/i)).toBeInTheDocument();
  });

  it('calls onUpdate with valid values', () => {
    render(<TimerAdjustment {...defaultProps} />);
    
    const inhaleInput = screen.getByLabelText(/inhale/i);
    fireEvent.change(inhaleInput, { target: { value: '5' } });
    
    expect(defaultProps.onUpdate).toHaveBeenCalledWith({
      ...defaultProps.timings,
      inhale: 5
    });
  });

  it('prevents values outside ranges', () => {
    render(<TimerAdjustment {...defaultProps} />);
    
    const inhaleInput = screen.getByLabelText(/inhale/i);
    fireEvent.change(inhaleInput, { target: { value: '1' } }); // Below min
    
    expect(defaultProps.onUpdate).not.toHaveBeenCalled();
  });

  it('disables inputs when disabled prop is true', () => {
    render(<TimerAdjustment {...defaultProps} disabled />);
    
    expect(screen.getByLabelText(/inhale/i)).toBeDisabled();
    expect(screen.getByLabelText(/exhale/i)).toBeDisabled();
    expect(screen.getByLabelText(/hold in/i)).toBeDisabled();
    expect(screen.getByLabelText(/hold out/i)).toBeDisabled();
  });

  it('calls onSave when save button is clicked', () => {
    render(<TimerAdjustment {...defaultProps} />);
    
    const saveButton = screen.getByText(/save as default/i);
    fireEvent.click(saveButton);
    
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('shows correct range values in labels', () => {
    render(<TimerAdjustment {...defaultProps} />);
    
    expect(screen.getByText(/2-10s/)).toBeInTheDocument(); // Inhale range
    expect(screen.getByText(/2-15s/)).toBeInTheDocument(); // Exhale range
    expect(screen.getByText(/0-20s/)).toBeInTheDocument(); // Hold In range
    expect(screen.getByText(/0-120s/)).toBeInTheDocument(); // Hold Out range
  });
});