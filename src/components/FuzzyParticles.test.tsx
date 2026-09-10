import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FuzzyParticles } from './FuzzyParticles';

describe('FuzzyParticles Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders particles container with pointer-events-none and aria-hidden', () => {
    render(<FuzzyParticles type="correct" count={12} />);
    const container = screen.getByTestId('fuzzy-particles-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('aria-hidden', 'true');
    expect(container).toHaveClass('pointer-events-none');

    const particleElements = screen.getAllByTestId('fuzzy-particle');
    expect(particleElements).toHaveLength(12);
  });

  it('calls onComplete after animation duration elapsed and unmounts particles', () => {
    const onComplete = vi.fn();
    render(<FuzzyParticles type="correct" onComplete={onComplete} />);

    expect(screen.getByTestId('fuzzy-particles-container')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    // Fast-forward past max animation duration (850ms)
    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('fuzzy-particles-container')).not.toBeInTheDocument();
  });

  it('renders incorrect type particles with distinct styling attributes', () => {
    render(<FuzzyParticles type="incorrect" count={8} />);
    const particleElements = screen.getAllByTestId('fuzzy-particle');
    expect(particleElements).toHaveLength(8);
  });
});
