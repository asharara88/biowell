import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BreathingSphere from '../BreathingSphere';

describe('BreathingSphere', () => {
  it('renders with inhale phase', () => {
    const { container } = render(
      <BreathingSphere
        phase="inhale"
        progress={5.5}
        isActive={true}
      />
    );
    expect(container.querySelector('.bg-blue-400')).toBeInTheDocument();
  });

  it('renders with exhale phase', () => {
    const { container } = render(
      <BreathingSphere
        phase="exhale"
        progress={5.5}
        isActive={true}
      />
    );
    expect(container.querySelector('.bg-green-400')).toBeInTheDocument();
  });

  it('renders with hold phases', () => {
    const { container: holdInContainer } = render(
      <BreathingSphere
        phase="holdIn"
        progress={4}
        isActive={true}
      />
    );
    expect(holdInContainer.querySelector('.bg-purple-400')).toBeInTheDocument();

    const { container: holdOutContainer } = render(
      <BreathingSphere
        phase="holdOut"
        progress={4}
        isActive={true}
      />
    );
    expect(holdOutContainer.querySelector('.bg-orange-400')).toBeInTheDocument();
  });

  it('renders in inactive state', () => {
    const { container } = render(
      <BreathingSphere
        phase="inhale"
        progress={5.5}
        isActive={false}
      />
    );
    expect(container.querySelector('.opacity-5')).toBeInTheDocument();
  });
});