import React, { useState } from 'react';
import { TrendingUp, LineChart } from 'lucide-react';
import { SprintRunRecord } from '../engine/historyStorage';

interface ScoreTrendChartProps {
  runs: SprintRunRecord[];
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({ runs }) => {
  const [activeRunIndex, setActiveRunIndex] = useState<number | null>(null);

  if (runs.length < 2) {
    return (
      <div className="w-full p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20">
          <LineChart className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-200">Score Trend Graph</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-sm">
          Complete at least 2 challenges to visualize your arithmetic speed and score progression over time!
        </p>
      </div>
    );
  }

  // Sort chronological
  const sorted = [...runs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const scores = sorted.map((r) => r.score);
  const maxScore = Math.max(10, Math.ceil(Math.max(...scores) * 1.15));
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const padLeft = 40;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 35;

  const usableWidth = svgWidth - padLeft - padRight;
  const usableHeight = svgHeight - padTop - padBottom;

  const coords = sorted.map((run, idx) => {
    const x = padLeft + (idx / (sorted.length - 1)) * usableWidth;
    const y = padTop + usableHeight - (run.score / maxScore) * usableHeight;
    return { x, y, run, idx };
  });

  const pathPoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaPath = `M ${coords[0].x.toFixed(1)},${(padTop + usableHeight).toFixed(1)} L ${coords
    .map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' L ')} L ${coords[coords.length - 1].x.toFixed(1)},${(padTop + usableHeight).toFixed(1)} Z`;

  const avgY = padTop + usableHeight - (avgScore / maxScore) * usableHeight;

  const activeCoord = activeRunIndex !== null ? coords[activeRunIndex] : null;

  return (
    <div className="w-full p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col relative select-none">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>Score Progression</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">
            Avg: <strong className="text-indigo-300 font-bold">{avgScore}</strong>
          </span>
          <span className="text-slate-400">
            Peak: <strong className="text-emerald-300 font-bold">{Math.max(...scores)}</strong>
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label="Multiplication sprint score trend line chart"
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[0, 0.5, 1].map((pct) => {
            const y = padTop + usableHeight * (1 - pct);
            const val = Math.round(maxScore * pct);
            return (
              <g key={pct}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  className="text-[10px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Average Reference Line */}
          <line
            x1={padLeft}
            y1={avgY}
            x2={svgWidth - padRight}
            y2={avgY}
            stroke="#818cf8"
            strokeDasharray="2 2"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#scoreGradient)" />

          {/* Score Line */}
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pathPoints}
          />

          {/* Interactive Data Points */}
          {coords.map((c) => {
            const isSelected = activeRunIndex === c.idx;
            return (
              <g key={c.run.id}>
                {/* Hit target */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={12}
                  fill="transparent"
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Run ${c.idx + 1}: ${c.run.score} correct`}
                  onMouseEnter={() => setActiveRunIndex(c.idx)}
                  onFocus={() => setActiveRunIndex(c.idx)}
                  onMouseLeave={() => setActiveRunIndex(null)}
                  onBlur={() => setActiveRunIndex(null)}
                />
                {/* Visual Point */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isSelected ? 6 : 4}
                  className={`transition-all duration-150 ${
                    isSelected
                      ? 'fill-indigo-400 stroke-white stroke-2'
                      : 'fill-indigo-600 stroke-slate-900 stroke-2'
                  }`}
                  pointerEvents="none"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Floating Tooltip */}
        {activeCoord && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-2 rounded-xl bg-slate-950 border border-indigo-500/50 shadow-2xl text-xs font-mono text-white transition-all duration-100"
            style={{
              left: `${(activeCoord.x / svgWidth) * 100}%`,
              top: `${(activeCoord.y / svgHeight) * 100}%`,
              marginTop: '-10px',
            }}
          >
            <div className="font-bold text-indigo-300">
              {activeCoord.run.score} solved
            </div>
            <div className="text-[11px] text-slate-300">
              {activeCoord.run.accuracyPercentage}% accuracy &bull; {activeCoord.run.problemsPerMinute} PPM
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
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

      <div className="mt-2 text-center text-[11px] text-slate-500">
        Hover or tap points to inspect individual sprint details
      </div>
    </div>
  );
};
