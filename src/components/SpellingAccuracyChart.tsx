import React, { useState } from 'react';
import { TrendingUp, LineChart } from 'lucide-react';
import { SpellingRunRecord } from '../engine/spellingStorage';

interface SpellingAccuracyChartProps {
  runs: SpellingRunRecord[];
}

export const SpellingAccuracyChart: React.FC<SpellingAccuracyChartProps> = ({ runs }) => {
  const [activeRunIndex, setActiveRunIndex] = useState<number | null>(null);

  if (runs.length < 2) {
    const singleRun = runs.length === 1 ? runs[0] : null;
    return (
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#2aa198]/15 dark:bg-[#7ec7b8]/15 text-[#2aa198] dark:text-[#7ec7b8] flex items-center justify-center mb-3 border border-[#2aa198]/30 dark:border-[#7ec7b8]/30">
          <LineChart className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-zen-base03 dark:text-[#eceff1]">
          Accuracy Progression Trend
        </h3>
        <p className="text-sm text-zen-base00 dark:text-[#94a3b8] mt-1 max-w-sm">
          Complete at least 2 practice sessions on this word set to visualize your % correct over time!
        </p>
        {singleRun && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-[#eee8d5]/60 dark:bg-[#181b1e] border border-[#e4d9c7] dark:border-[#353c43] flex items-center gap-3 text-xs font-mono">
            <span className="text-[#586e75] dark:text-[#94a3b8]">Session 1:</span>
            <span className="font-bold text-[#2aa198] dark:text-[#7ec7b8] text-sm">
              {singleRun.accuracyPercentage}% correct
            </span>
            <span className="text-[#93a1a1] dark:text-[#718093]">
              ({singleRun.correctCount}/{singleRun.totalWords} words)
            </span>
          </div>
        )}
      </div>
    );
  }

  // Sort chronologically
  const sorted = [...runs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const accuracies = sorted.map((r) => r.accuracyPercentage);
  const avgAccuracy = Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 35;

  const usableWidth = svgWidth - padLeft - padRight;
  const usableHeight = svgHeight - padTop - padBottom;

  const coords = sorted.map((run, idx) => {
    const x = padLeft + (idx / (sorted.length - 1)) * usableWidth;
    // Map accuracy from 0-100% to usableHeight
    const y = padTop + usableHeight - (run.accuracyPercentage / 100) * usableHeight;
    return { x, y, run, idx };
  });

  const pathPoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaPath = `M ${coords[0].x.toFixed(1)},${(padTop + usableHeight).toFixed(1)} L ${coords
    .map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' L ')} L ${coords[coords.length - 1].x.toFixed(1)},${(padTop + usableHeight).toFixed(1)} Z`;

  const avgY = padTop + usableHeight - (avgAccuracy / 100) * usableHeight;
  const activeCoord = activeRunIndex !== null ? coords[activeRunIndex] : null;

  return (
    <div className="w-full p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] flex flex-col space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#2aa198]/10 dark:bg-[#7ec7b8]/15 text-[#2aa198] dark:text-[#7ec7b8] flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zen-base03 dark:text-[#eceff1]">
              % Correct Over Time
            </h3>
            <span className="text-xs text-[#93a1a1] dark:text-[#94a3b8]">
              {sorted.length} completed sessions
            </span>
          </div>
        </div>

        {/* Average Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#eee8d5]/60 dark:bg-[#181b1e] border border-[#e4d9c7] dark:border-[#353c43] text-xs font-mono">
          <span className="text-[#586e75] dark:text-[#94a3b8]">Average:</span>
          <span className="font-bold text-[#2aa198] dark:text-[#7ec7b8] text-sm">
            {avgAccuracy}%
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label="Spelling accuracy trend graph over time"
        >
          <defs>
            <linearGradient id="spellingAccuracyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2aa198" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#2aa198" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="spellingAccuracyGradientDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7ec7b8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7ec7b8" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines (0%, 25%, 50%, 75%, 100%) */}
          {[0, 25, 50, 75, 100].map((pct) => {
            const y = padTop + usableHeight - (pct / 100) * usableHeight;
            return (
              <g key={pct}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-[#e4d9c7]/60 dark:text-[#353c43]/60"
                  strokeWidth="1"
                  strokeDasharray={pct === 0 || pct === 100 ? 'none' : '3,3'}
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-[#93a1a1] dark:fill-[#718093] text-[10px] font-mono select-none"
                >
                  {pct}%
                </text>
              </g>
            );
          })}

          {/* Average Guideline */}
          <line
            x1={padLeft}
            y1={avgY}
            x2={svgWidth - padRight}
            y2={avgY}
            stroke="#2aa198"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            className="opacity-70 dark:opacity-80"
          />

          {/* Shaded Area Under Curve */}
          <path
            d={areaPath}
            className="fill-[url(#spellingAccuracyGradient)] dark:fill-[url(#spellingAccuracyGradientDark)] transition-all duration-300"
          />

          {/* Main Trend Line */}
          <polyline
            fill="none"
            stroke="#2aa198"
            className="dark:stroke-[#7ec7b8]"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pathPoints}
          />

          {/* Data Points */}
          {coords.map((c) => {
            const isHovered = activeRunIndex === c.idx;
            return (
              <g
                key={c.idx}
                className="cursor-pointer group"
                onMouseEnter={() => setActiveRunIndex(c.idx)}
                onMouseLeave={() => setActiveRunIndex(null)}
                onClick={() => setActiveRunIndex(c.idx === activeRunIndex ? null : c.idx)}
              >
                {/* Invisible larger hit target */}
                <circle cx={c.x} cy={c.y} r="16" fill="transparent" />

                {/* Point ring */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 6 : 4}
                  className="fill-[#2aa198] dark:fill-[#7ec7b8] stroke-white dark:stroke-[#1a1d20] transition-all duration-150"
                  strokeWidth={isHovered ? 2.5 : 2}
                />
              </g>
            );
          })}

          {/* X-axis Session Labels (First and Last) */}
          {coords.length > 0 && (
            <>
              <text
                x={coords[0].x}
                y={svgHeight - 12}
                textAnchor="start"
                className="fill-[#93a1a1] dark:fill-[#718093] text-[10px] font-mono"
              >
                Session 1
              </text>
              <text
                x={coords[coords.length - 1].x}
                y={svgHeight - 12}
                textAnchor="end"
                className="fill-[#93a1a1] dark:fill-[#718093] text-[10px] font-mono"
              >
                Session {coords.length}
              </text>
            </>
          )}
        </svg>

        {/* Hover/Tap Tooltip Details Card */}
        {activeCoord && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-xl bg-zen-base03 dark:bg-[#181b1e] text-white dark:text-[#eceff1] text-xs shadow-lg border border-transparent dark:border-[#353c43] flex flex-col items-center gap-0.5 animate-fadeIn"
            style={{
              left: `${(activeCoord.x / svgWidth) * 100}%`,
              top: `${Math.max(10, (activeCoord.y / svgHeight) * 100 - 8)}%`,
            }}
          >
            <div className="font-bold text-[#7ec7b8] font-mono text-sm">
              {activeCoord.run.accuracyPercentage}% Correct
            </div>
            <div className="text-[11px] text-gray-300 dark:text-[#94a3b8] font-mono">
              Score: {activeCoord.run.correctCount} / {activeCoord.run.totalWords}
            </div>
            <div className="text-[10px] text-gray-400 dark:text-[#718093]">
              {new Date(activeCoord.run.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#93a1a1] dark:text-[#718093] pt-1 border-t border-[#ede5d0]/50 dark:border-[#353c43]/50">
        <span>Hover or tap data points for session breakdown</span>
        <span className="font-mono">Goal: 100% Mastery</span>
      </div>
    </div>
  );
};
