import React, { useState } from 'react';
import { ArrowLeft, Trophy, BarChart3, Target, Calendar } from 'lucide-react';
import { loadRunHistory, clearRunHistory } from '../engine/historyStorage';
import { ScoreTrendChart } from './ScoreTrendChart';
import { RunHistoryList } from './RunHistoryList';
import { ClearHistoryModal } from './ClearHistoryModal';

interface HistoryPageProps {
  onBack: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onBack }) => {
  const [runs, setRuns] = useState(() => loadRunHistory());
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleClear = () => {
    clearRunHistory();
    setRuns([]);
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
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zen-base2 text-zen-base02 text-sm font-semibold transition border border-[#ede5d0] shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-zen-terracotta"
          aria-label="Back to Sprint"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sprint</span>
        </button>

        <span className="text-xs text-zen-base01 font-medium">
          Capped at 100 most recent runs
        </span>
      </div>

      {/* Page Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-zen-base03 tracking-tight">
          Sprint History & Trends
        </h2>
        <p className="text-sm text-zen-base00 mt-1">
          Track your multiplication speed, accuracy, and score improvements over time.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white tactile-card border border-[#ede5d0] rounded-2xl p-4 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-1.5 text-xs text-zen-cyan font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Sprints</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-zen-base03">
            {totalRuns}
          </span>
          <span className="text-xs text-zen-base01 mt-0.5">completed</span>
        </div>

        <div className="bg-white tactile-card border border-[#ede5d0] rounded-2xl p-4 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-1.5 text-xs text-zen-amber font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>High Score</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-zen-base03">
            {highScore}
          </span>
          <span className="text-xs text-zen-base01 mt-0.5">all-time best</span>
        </div>

        <div className="bg-white tactile-card border border-[#ede5d0] rounded-2xl p-4 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-1.5 text-xs text-zen-green font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Avg Score</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-zen-base03">
            {avgScore}
          </span>
          <span className="text-xs text-zen-base01 mt-0.5">points/sprint</span>
        </div>

        <div className="bg-white tactile-card border border-[#ede5d0] rounded-2xl p-4 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-1.5 text-xs text-zen-terracotta font-bold uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Avg Accuracy</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-zen-base03">
            {avgAccuracy}%
          </span>
          <span className="text-xs text-zen-base01 mt-0.5">correct answers</span>
        </div>
      </div>

      {/* SVG Score Trend Chart */}
      <ScoreTrendChart runs={runs} />

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
