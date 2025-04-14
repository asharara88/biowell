import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BreathworkProtocol from '../BreathworkProtocol';

describe('BreathworkProtocol', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders protocol selector with all options', () => {
    render(<BreathworkProtocol />);
    const select = screen.getByRole('combobox');
    
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Nasal Breathing')).toBeInTheDocument();
    expect(screen.getByText('Box Breathing')).toBeInTheDocument();
    expect(screen.getByText('Resonant Slow Breathing')).toBeInTheDocument();
  });

  it('shows protocol information when info button is clicked', () => {
    render(<BreathworkProtocol />);
    
    const infoButton = screen.getByRole('button', { name: /info/i });
    fireEvent.click(infoButton);
    
    expect(screen.getByText(/benefits:/i)).toBeInTheDocument();
    expect(screen.getByText(/better oxygen absorption/i)).toBeInTheDocument();
  });

  it('updates protocol information when different protocol is selected', () => {
    render(<BreathworkProtocol />);
    
    const infoButton = screen.getByRole('button', { name: /info/i });
    fireEvent.click(infoButton);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Box Breathing' } });
    
    expect(screen.getByText(/equal duration for inhale/i)).toBeInTheDocument();
  });

  it('starts and stops breathing exercise', () => {
    render(<BreathworkProtocol />);
    
    // Initial state
    expect(screen.getByText('Start')).toBeInTheDocument();
    
    // Start exercise
    fireEvent.click(screen.getByText('Start'));
    expect(screen.getByText('Stop')).toBeInTheDocument();
    
    // Stop exercise
    fireEvent.click(screen.getByText('Stop'));
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  it('updates protocol when selected', () => {
    render(<BreathworkProtocol />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Box Breathing' } });
    
    expect(select).toHaveValue('Box Breathing');
  });

  it('shows correct phase timing', () => {
    render(<BreathworkProtocol />);
    
    fireEvent.click(screen.getByText('Start'));
    
    // Initial phase
    expect(screen.getByText('Inhale')).toBeInTheDocument();
    expect(screen.getByText('5.5s')).toBeInTheDocument();
    
    // Advance time
    act(() => {
      vi.advanceTimersByTime(5500);
    });
    
    // Next phase
    expect(screen.getByText('Exhale')).toBeInTheDocument();
  });

  it('handles cycle count', () => {
    render(<BreathworkProtocol />);
    
    const cycleInput = screen.getByPlaceholderText('Cycles');
    fireEvent.change(cycleInput, { target: { value: '3' } });
    
    expect(cycleInput).toHaveValue(3);
  });

  it('resets exercise', () => {
    render(<BreathworkProtocol />);
    
    fireEvent.click(screen.getByText('Start'));
    fireEvent.click(screen.getByText('Reset'));
    
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('0.0s')).toBeInTheDocument();
  });
});