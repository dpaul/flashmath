import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSprintTimer } from './useSprintTimer';

describe('useSprintTimer hook', () => {
  it('ticks every second when isRunning is true', () => {
    vi.useFakeTimers();
    const onTick = vi.fn();

    renderHook(() => useSprintTimer({ isRunning: true, onTick }));

    expect(onTick).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(2000);
    expect(onTick).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });

  it('does not tick when isRunning is false', () => {
    vi.useFakeTimers();
    const onTick = vi.fn();

    renderHook(() => useSprintTimer({ isRunning: false, onTick }));

    vi.advanceTimersByTime(3000);
    expect(onTick).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
