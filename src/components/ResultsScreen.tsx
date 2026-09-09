import React, { useEffect } from 'react';
import { RotateCcw, Trophy, Flame, Target, Gauge, Award } from 'lucide-react';
import { GameStats, PersonalBests } from '../engine/types';
import { MissedProblemsReview } from './MissedProblemsReview';

interface ResultsScreenProps {
  stats: GameStats;
  personalBests: PersonalBests;
  isNewHighScore: boolean;
  isNewBestStreak: boolean;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  stats,
  personalBests,
  isNewHighScore,
  isNewBestStreak,
  onRestart,
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
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-sm border border-amber-500/40 animate-bounce">
          <Award className="w-5 h-5 text-amber-400" />
          <span>New Personal Best Recorded!</span>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Sprint Completed!</h2>
      <p className="text-slate-400 text-sm mb-6">Here is how you performed in 3 minutes:</p>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6">
        {/* Solved */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
          <div className="flex items-center gap-1 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Solved</span>
          </div>
          <span className="text-3xl font-mono font-black text-white">{stats.correctCount}</span>
          <span className="text-xs text-slate-500 mt-0.5">correct</span>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Accuracy</span>
          </div>
          <span className="text-3xl font-mono font-black text-white">{stats.accuracyPercentage}%</span>
          <span className="text-xs text-slate-500 mt-0.5">{stats.totalAttempted} attempts</span>
        </div>

        {/* Speed (PPM) */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
          <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Gauge className="w-3.5 h-3.5" />
            <span>Speed</span>
          </div>
          <span className="text-3xl font-mono font-black text-white">{stats.problemsPerMinute}</span>
          <span className="text-xs text-slate-500 mt-0.5">problems/min</span>
        </div>

        {/* Best Streak */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
          <div className="flex items-center gap-1 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Best Streak</span>
          </div>
          <span className="text-3xl font-mono font-black text-white">{stats.bestStreak}</span>
          <span className="text-xs text-slate-500 mt-0.5">in this round</span>
        </div>
      </div>

      {/* Historical Best Reference */}
      <div className="w-full p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex justify-around">
        <div>
          All-Time High Score: <strong className="text-white font-mono text-sm ml-1">{personalBests.highScore}</strong>
        </div>
        <div>
          All-Time Best Streak: <strong className="text-white font-mono text-sm ml-1">{personalBests.bestStreak}</strong>
        </div>
      </div>

      {/* Missed Problems Review */}
      <MissedProblemsReview missedProblems={stats.missedProblems} />

      {/* Restart Button */}
      <div className="w-full mt-8">
        <button
          type="button"
          onClick={onRestart}
          className="w-full max-w-md h-16 inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black text-xl rounded-2xl transition shadow-xl hover:shadow-indigo-500/25 active:scale-98 cursor-pointer"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Play Again</span>
        </button>

        <span className="block text-xs text-slate-500 mt-2 font-medium">
          or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Enter</kbd>
        </span>
      </div>
    </div>
  );
};
