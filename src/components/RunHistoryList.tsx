import React from 'react';
import { SprintRunRecord } from '../engine/types';

interface RunHistoryListProps {
  runs: SprintRunRecord[];
  onClearRequest?: () => void;
}

export const RunHistoryList: React.FC<RunHistoryListProps> = ({ runs, onClearRequest }) => {
  if (runs.length === 0) {
    return (
      <div className="bg-white tactile-card border border-[#ede5d0] rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zen-base2 flex items-center justify-center text-zen-base01">
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
        <h3 className="text-xl font-bold text-zen-base03 mb-2">No sprint history yet</h3>
        <p className="text-zen-base00 max-w-sm mx-auto text-sm leading-relaxed">
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
        <h3 className="text-lg font-bold text-zen-base03 flex items-center gap-2">
          <span>Sprint History</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zen-base2 text-zen-base02 font-medium">
            {runs.length} {runs.length === 1 ? 'run' : 'runs'}
          </span>
        </h3>
        {onClearRequest && (
          <button
            type="button"
            onClick={onClearRequest}
            className="text-xs font-semibold text-zen-red hover:text-zen-red/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-zen-red/10 border border-transparent hover:border-zen-red/30 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-zen-red cursor-pointer"
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
              className={`relative bg-white tactile-card border rounded-xl p-4 transition-all duration-200 hover:bg-[#faf6ed] flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isPersonalBest
                  ? 'border-zen-amber/50 bg-gradient-to-r from-zen-amber/10 via-white to-white'
                  : 'border-[#ede5d0]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#f7f0e0] border border-[#eee4ce] flex flex-col items-center justify-center shrink-0">
                  <span className="text-xl font-black text-zen-terracotta leading-none">
                    {run.score}
                  </span>{' '}
                  <span className="text-[10px] uppercase font-bold text-zen-base01 mt-1">
                    pts
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-zen-base03">
                      {formatRunDate(run.timestamp)}
                    </span>
                    {isPersonalBest && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-zen-amber/15 text-zen-amber border border-zen-amber/30">
                        <svg
                          className="w-3 h-3 text-zen-amber"
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
                  <div className="text-xs text-zen-base01 mt-1 flex items-center gap-3">
                    <span>Duration: 3m 00s</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#eee4ce]">
                <div className="text-left sm:text-right">
                  <div className="text-xs text-zen-base01 uppercase font-semibold">Accuracy</div>
                  <div className="text-sm font-bold text-zen-base03">{formattedAccuracy}</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-zen-base01 uppercase font-semibold">Solved</div>
                  <div className="text-sm font-bold text-zen-cyan">
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
