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
      className="w-full max-w-sm sm:max-w-md mx-auto mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="inline-flex items-center gap-2 text-slate-300 font-medium text-sm">
          <Timer className={`w-4 h-4 ${isWarning ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
          <span>Time Remaining</span>
        </div>

        <div
          className={`font-mono text-2xl font-black tabular-nums transition-colors ${
            isUrgent ? 'text-rose-400 animate-pulse scale-110' : isWarning ? 'text-amber-400' : 'text-slate-100'
          }`}
        >
          {formatted}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isUrgent ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
