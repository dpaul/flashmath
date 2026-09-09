import { useEffect, useRef } from 'react';

interface UseSprintTimerProps {
  isRunning: boolean;
  onTick: () => void;
}

/**
 * Custom hook to run a stable 1-second interval timer when isRunning is true.
 */
export function useSprintTimer({ isRunning, onTick }: UseSprintTimerProps) {
  const tickRef = useRef(onTick);
  tickRef.current = onTick;

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      tickRef.current();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);
}
