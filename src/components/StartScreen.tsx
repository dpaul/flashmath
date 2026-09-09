import React, { useEffect } from 'react';
import { Sparkles, Trophy, Zap, Play, CheckCircle2 } from 'lucide-react';
import { PersonalBests } from '../engine/types';

interface StartScreenProps {
  personalBests: PersonalBests;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ personalBests, onStart }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        // Prevent default only if not focused on another interactive control
        if (document.activeElement?.tagName !== 'BUTTON') {
          e.preventDefault();
          onStart();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center p-6 sm:p-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold border border-indigo-500/20">
        <Sparkles className="w-4 h-4" />
        <span>3-Minute Challenge</span>
      </div>

      {/* Main Title */}
      <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-3">
        Flash<span className="text-indigo-400">Math</span>
      </h1>

      <p className="text-lg text-slate-300 max-w-md mb-8">
        Fast-paced mental arithmetic sprint. Solve as many multiplication problems (tables 2–12) as you can in 3 minutes!
      </p>

      {/* High Score / Best Streak Cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>High Score</span>
          </div>
          <span className="text-3xl sm:text-4xl font-mono font-black text-white">
            {personalBests.highScore}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">problems solved</span>
        </div>

        <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Best Streak</span>
          </div>
          <span className="text-3xl sm:text-4xl font-mono font-black text-white">
            {personalBests.bestStreak}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">consecutive correct</span>
        </div>
      </div>

      {/* Quick Rules */}
      <div className="w-full max-w-md p-4 mb-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-left text-sm text-slate-300 space-y-2">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <span>Multiplication tables from 2×2 up to 12×12.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <span>Press <strong>Enter</strong> or click Submit after typing each answer.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <span>Full review of any missed calculations at the end.</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={onStart}
        className="w-full max-w-md h-16 inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black text-xl rounded-2xl transition shadow-xl hover:shadow-indigo-500/25 active:scale-98 cursor-pointer"
      >
        <Play className="w-6 h-6 fill-white" />
        <span>Start Challenge</span>
      </button>

      <span className="text-xs text-slate-500 mt-3 font-medium">
        or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Enter</kbd>
      </span>
    </div>
  );
};
