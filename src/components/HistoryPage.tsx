import React, { useState } from 'react';
import { ArrowLeft, Trophy, BarChart3, Target, Calendar, AlertCircle } from 'lucide-react';
import { loadRunHistory, clearRunHistory } from '../engine/historyStorage';
import {
  getMostMissedMathProblems,
  clearMathProblemStats,
  RankedMathProblem,
} from '../engine/mathMistakesStorage';
import { ScoreTrendChart } from './ScoreTrendChart';
import { RunHistoryList } from './RunHistoryList';
import { ClearHistoryModal } from './ClearHistoryModal';

export interface HistoryPageProps {
  onBack: () => void;
  onPracticeMissed?: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onBack, onPracticeMissed }) => {
  const [runs, setRuns] = useState(() => loadRunHistory());
  const [missedProblems, setMissedProblems] = useState<RankedMathProblem[]>(() =>
    getMostMissedMathProblems()
  );
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleClear = () => {
    clearRunHistory();
    clearMathProblemStats();
    setRuns([]);
    setMissedProblems([]);
    setIsClearModalOpen(false);
  };

  const totalRuns = runs.length;
  const highScore = totalRuns > 0 ? Math.max(...runs.map((r) => r.score)) : 0;
  const avgScore =
    totalRuns > 0
      ? (runs.reduce((sum, r) => sum + r.score, 0) / totalRuns).toFixed(1)
      : '0';
  const avgAccuracy =
    totalRuns > 0
      ? (
          runs.reduce(
            (sum, r) => sum + (r.accuracyPercentage ?? r.accuracy ?? 0),
            0
          ) / totalRuns
        ).toFixed(1)
      : '0';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#24292e] hover:bg-zen-base2 dark:hover:bg-[#2d353c] text-zen-base02 dark:text-[#eceff1] text-sm font-semibold transition border border-[#ede5d0] dark:border-[#353c43] shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-zen-terracotta"
          aria-label="Back to Sprint"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sprint</span>
        </button>

        <span className="text-xs text-zen-base01 dark:text-[#94a3b8] font-medium">
          Capped at 100 most recent runs
        </span>
      </div>

      {/* Page Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zen-base03 dark:text-[#eceff1] tracking-tight">
          Sprint History & Trends
        </h2>
        <p className="text-sm text-zen-base00 dark:text-[#94a3b8] mt-1">
          Track your multiplication speed, accuracy, and score improvements over time.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] rounded-2xl p-4 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-1.5 text-xs text-zen-cyan dark:text-[#92b6d5] font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Sprints</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-zen-base03 dark:text-[#eceff1]">
            {totalRuns}
          </span>
          <span className="text-xs text-zen-base01 dark:text-[#94a3b8] mt-0.5">completed</span>
        </div>

        <div className="bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] rounded-2xl p-4 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-1.5 text-xs text-zen-amber dark:text-[#eed082] font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>High Score</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-zen-base03 dark:text-[#eceff1]">
            {highScore}
          </span>
          <span className="text-xs text-zen-base01 dark:text-[#94a3b8] mt-0.5">all-time best</span>
        </div>

        <div className="bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] rounded-2xl p-4 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-1.5 text-xs text-zen-green dark:text-[#7ec7b8] font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Avg Score</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-zen-base03 dark:text-[#eceff1]">
            {avgScore}
          </span>
          <span className="text-xs text-zen-base01 dark:text-[#94a3b8] mt-0.5">points/sprint</span>
        </div>

        <div className="bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] rounded-2xl p-4 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-1.5 text-xs text-zen-terracotta dark:text-[#eb937d] font-bold uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Avg Accuracy</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-zen-base03 dark:text-[#eceff1]">
            {avgAccuracy}%
          </span>
          <span className="text-xs text-zen-base01 dark:text-[#94a3b8] mt-0.5">correct answers</span>
        </div>
      </div>

      {/* SVG Score Trend Chart */}
      <ScoreTrendChart runs={runs} />

      {/* Facts Gotten Wrong Most Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zen-base03 dark:text-[#eceff1]">
                Facts Gotten Wrong Most
              </h3>
              <p className="text-xs text-zen-base00 dark:text-[#94a3b8]">
                Multiplication facts missed more than once across your sprints.
              </p>
            </div>
          </div>

          {missedProblems.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d]">
                {missedProblems.length} trouble fact{missedProblems.length === 1 ? '' : 's'}
              </span>
              {onPracticeMissed && (
                <button
                  type="button"
                  onClick={onPracticeMissed}
                  aria-label="Practice Most Missed Multiplication Facts"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#cb4b16] hover:bg-[#b83e0f] text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Practice Most Missed</span>
                </button>
              )}
            </div>
          )}
        </div>

        {missedProblems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {missedProblems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-base text-[#073642] dark:text-[#eceff1]">
                    {item.factorA} × {item.factorB}
                  </span>
                  <span className="block text-[11px] text-[#93a1a1] dark:text-[#718093]">
                    = {item.product}
                  </span>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="text-[#cb4b16] dark:text-[#eb937d] font-bold block">
                    {item.misses} {item.misses === 1 ? 'miss' : 'misses'}
                  </span>
                  <span className="text-[10px] text-[#93a1a1] dark:text-[#718093]">
                    {item.errorRate}% err
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#24292e] border border-[#ede5d0] dark:border-[#353c43] text-center text-xs text-[#93a1a1] dark:text-[#718093]">
            No trouble facts recorded yet (requires missing a fact more than once).
          </div>
        )}
      </section>

      {/* Run History List */}
      <RunHistoryList
        runs={runs}
        onClearRequest={() => setIsClearModalOpen(true)}
      />

      {/* Clear Confirmation Modal */}
      <ClearHistoryModal
        isOpen={isClearModalOpen}
        onConfirm={handleClear}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
};
