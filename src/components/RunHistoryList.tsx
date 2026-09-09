import React from 'react';
import { SprintRunRecord } from '../engine/types';

interface RunHistoryListProps {
  runs: SprintRunRecord[];
  onClearRequest?: () => void;
}

export const RunHistoryList: React.FC<RunHistoryListProps> = ({ runs, onClearRequest }) => {
  if (runs.length === 0) {
    return (
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No sprint history yet</h3>
        <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
          Complete a 3-minute sprint to start tracking your progress, accuracy, and score trends!
        </p>
      </div>
    );
  }

  // Find personal best score (must be > 0)
  const maxScore = Math.max(...runs.map((r) => r.score), 0);

  // Sort runs newest to oldest
  const sortedRuns = [...runs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatRunDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Sprint History</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-700/80 text-slate-300 font-medium">
            {runs.length} {runs.length === 1 ? 'run' : 'runs'}
          </span>
        </h3>
        {onClearRequest && (
          <button
            type="button"
            onClick={onClearRequest}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
            aria-label="Clear sprint history"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Clear History</span>
          </button>
        )}
      </div>

      <div className="space-y-3" role="list" aria-label="Past sprint runs">
        {sortedRuns.map((run) => {
          const isPersonalBest = maxScore > 0 && run.score === maxScore;
          const accuracy = run.accuracyPercentage ?? run.accuracy ?? 0;
          const total = run.totalAttempted ?? run.totalAnswered ?? run.score;
          const correct = run.correctCount ?? run.score;
          const formattedAccuracy =
            accuracy % 1 === 0 ? `${accuracy}%` : `${accuracy.toFixed(1)}%`;

          return (
            <div
              key={run.id}
              data-testid="history-run-card"
              role="listitem"
              className={`relative bg-slate-800/90 border rounded-xl p-4 transition-all duration-200 hover:bg-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
                isPersonalBest
                  ? 'border-amber-500/50 shadow-amber-500/5 bg-gradient-to-r from-amber-500/5 via-slate-800/90 to-slate-800/90'
                  : 'border-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xl font-black text-emerald-400 leading-none">
                    {run.score}
                  </span>{' '}
                  <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                    pts
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">
                      {formatRunDate(run.timestamp)}
                    </span>
                    {isPersonalBest && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        <svg
                          className="w-3 h-3 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Personal Best
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>Duration: 3m 00s</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Accuracy</div>
                  <div className="text-sm font-bold text-white">{formattedAccuracy}</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Solved</div>
                  <div className="text-sm font-bold text-cyan-400">
                    {correct} / {total}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
