import React from 'react';
import { Flame } from 'lucide-react';
import { MultiplicationProblem } from '../engine/math';

interface FlashcardProps {
  problem: MultiplicationProblem;
  streak: number;
  lastAnswerCorrect: boolean | null;
}

export const Flashcard: React.FC<FlashcardProps> = ({ problem, streak, lastAnswerCorrect }) => {
  const getFeedbackClass = () => {
    if (lastAnswerCorrect === true) {
      return 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.25)] bg-slate-900/90';
    }
    if (lastAnswerCorrect === false) {
      return 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.25)] bg-slate-900/90 animate-shake';
    }
    return 'border-slate-800 bg-slate-900/60 shadow-xl';
  };

  return (
    <div
      role="region"
      aria-label={`Problem: ${problem.factorA} times ${problem.factorB}`}
      aria-live="polite"
      className={`relative w-full max-w-sm sm:max-w-md mx-auto p-8 rounded-3xl border-2 backdrop-blur transition-all duration-200 ${getFeedbackClass()}`}
    >
      {/* Top Bar: Streak Indicator */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Multiplication 2–12
        </span>
        {streak > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/20 animate-pulse">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{streak} Streak</span>
          </div>
        )}
      </div>

      {/* Arithmetic Problem Display */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 py-6 font-mono font-extrabold text-6xl sm:text-7xl tracking-wider text-white select-none">
        <span className="tabular-nums">{problem.factorA}</span>
        <span className="text-indigo-400 font-sans font-light">×</span>
        <span className="tabular-nums">{problem.factorB}</span>
      </div>
    </div>
  );
};
