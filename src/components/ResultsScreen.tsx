import React, { useEffect } from 'react';
import { RotateCcw, Trophy, Flame, Target, Gauge, Award, TrendingUp } from 'lucide-react';
import { GameStats, PersonalBests } from '../engine/types';
import { MissedProblemsReview } from './MissedProblemsReview';

interface ResultsScreenProps {
  stats: GameStats;
  personalBests: PersonalBests;
  isNewHighScore: boolean;
  isNewBestStreak: boolean;
  onRestart: () => void;
  onViewHistory?: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  stats,
  personalBests,
  isNewHighScore,
  isNewBestStreak,
  onRestart,
  onViewHistory,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        if (document.activeElement?.tagName !== 'BUTTON') {
          e.preventDefault();
          onRestart();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center p-6 sm:p-8">
      {/* Celebration Banner */}
      {(isNewHighScore || isNewBestStreak) && (
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-zen-amber/15 text-zen-amber font-bold text-sm border border-zen-amber/30 animate-bounce">
          <Award className="w-5 h-5 text-zen-amber" />
          <span>New Personal Best Recorded!</span>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl font-black text-zen-base03 mb-2">Sprint Completed!</h2>
      <p className="text-zen-base00 text-sm mb-6">Here is how you performed in 3 minutes:</p>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6">
        {/* Solved */}
        <div className="p-4 rounded-2xl bg-white tactile-card border border-[#ede5d0] flex flex-col items-center">
          <div className="flex items-center gap-1 text-zen-terracotta text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Solved</span>
          </div>
          <span className="text-3xl font-mono font-black text-zen-base03">{stats.correctCount}</span>
          <span className="text-xs text-zen-base01 mt-0.5">correct</span>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-white tactile-card border border-[#ede5d0] flex flex-col items-center">
          <div className="flex items-center gap-1 text-zen-green text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Accuracy</span>
          </div>
          <span className="text-3xl font-mono font-black text-zen-base03">{stats.accuracyPercentage}%</span>
          <span className="text-xs text-zen-base01 mt-0.5">{stats.totalAttempted} attempts</span>
        </div>

        {/* Speed (PPM) */}
        <div className="p-4 rounded-2xl bg-white tactile-card border border-[#ede5d0] flex flex-col items-center">
          <div className="flex items-center gap-1 text-zen-cyan text-xs font-bold uppercase tracking-wider mb-1">
            <Gauge className="w-3.5 h-3.5" />
            <span>Speed</span>
          </div>
          <span className="text-3xl font-mono font-black text-zen-base03">{stats.problemsPerMinute}</span>
          <span className="text-xs text-zen-base01 mt-0.5">problems/min</span>
        </div>

        {/* Best Streak */}
        <div className="p-4 rounded-2xl bg-white tactile-card border border-[#ede5d0] flex flex-col items-center">
          <div className="flex items-center gap-1 text-zen-amber text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Best Streak</span>
          </div>
          <span className="text-3xl font-mono font-black text-zen-base03">{stats.bestStreak}</span>
          <span className="text-xs text-zen-base01 mt-0.5">in this round</span>
        </div>
      </div>

      {/* Historical Best Reference */}
      <div className="w-full p-4 rounded-2xl bg-[#f7f0e0]/80 border border-[#eee4ce] text-xs text-zen-base00 flex justify-around">
        <div>
          All-Time High Score: <strong className="text-zen-base03 font-mono text-sm ml-1">{personalBests.highScore}</strong>
        </div>
        <div>
          All-Time Best Streak: <strong className="text-zen-base03 font-mono text-sm ml-1">{personalBests.bestStreak}</strong>
        </div>
      </div>

      {/* Missed Problems Review */}
      <MissedProblemsReview missedProblems={stats.missedProblems} />

      {/* Restart Button */}
      <div className="w-full mt-8">
        <button
          type="button"
          onClick={onRestart}
          className="w-full max-w-md h-16 inline-flex items-center justify-center gap-3 bg-zen-terracotta hover:bg-[#b84213] active:translate-y-0.5 text-white font-black text-xl rounded-2xl transition shadow-[0_4px_0_#9c340d] active:shadow-[0_2px_0_#9c340d] cursor-pointer"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Play Again</span>
        </button>

        <span className="block text-xs text-zen-base01 mt-2 font-medium">
          or press <kbd className="px-1.5 py-0.5 rounded bg-zen-base2 border border-[#dcd3b6] text-zen-base02 font-mono">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-zen-base2 border border-[#dcd3b6] text-zen-base02 font-mono">Enter</kbd>
        </span>

        {onViewHistory && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onViewHistory}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zen-base2 text-zen-base02 border border-[#ede5d0] shadow-sm font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-zen-terracotta cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-zen-terracotta" />
              <span>View History & Trends</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
