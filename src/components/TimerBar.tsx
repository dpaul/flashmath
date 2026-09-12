import React from 'react';
import { Timer } from 'lucide-react';
import { SPRINT_DURATION_SECONDS } from '../engine/gameReducer';

interface TimerBarProps {
  timeRemaining: number;
}

export const TimerBar: React.FC<TimerBarProps> = ({ timeRemaining }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const progressPercent = Math.max(0, (timeRemaining / SPRINT_DURATION_SECONDS) * 100);

  const isWarning = timeRemaining <= 30;
  const isUrgent = timeRemaining <= 10;

  return (
    <div
      role="timer"
      aria-label={`Time remaining: ${formatted}`}
      className="flex items-center gap-3 select-none"
    >
      <span className="sr-only">Time Remaining</span>
      <Timer
        className={`w-6 h-6 transition-colors ${
          isUrgent ? 'text-[#ba1a1a] animate-spin' : isWarning ? 'text-[#b58900]' : 'text-[#cb4b16]'
        }`}
      />
      <div>
        <div
          className={`font-mono text-xl sm:text-2xl font-bold text-[#073642] leading-none tabular-nums ${
            isUrgent ? 'text-[#ba1a1a] animate-pulse' : isWarning ? 'text-[#b58900]' : ''
          }`}
        >
          {formatted}
        </div>
        <div className="w-28 sm:w-36 h-1.5 bg-[#ebdccb] rounded-full overflow-hidden mt-1.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isUrgent ? 'bg-[#ba1a1a]' : isWarning ? 'bg-[#b58900]' : 'bg-[#cb4b16]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
