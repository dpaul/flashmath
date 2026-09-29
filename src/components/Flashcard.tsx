import React, { memo } from 'react';
import { Flame } from 'lucide-react';
import { MultiplicationProblem } from '../engine/math';
import { FuzzyParticles, AmbientSmoke } from './FuzzyParticles';

interface FlashcardProps {
  problem: MultiplicationProblem;
  streak: number;
  lastAnswerCorrect: boolean | null;
  submissionCount?: number;
  cardNumber?: number;
  children?: React.ReactNode;
}

export const Flashcard: React.FC<FlashcardProps> = memo(({
  problem,
  streak,
  lastAnswerCorrect,
  submissionCount = 0,
  cardNumber,
  children,
}) => {
  const getFeedbackBorder = () => {
    if (lastAnswerCorrect === true) {
      return 'border-[#2aa198]/25 dark:border-[#7ec7b8]/40 ring-1 ring-[#2aa198]/10 dark:ring-[#7ec7b8]/20';
    }
    if (lastAnswerCorrect === false) {
      return 'border-[#cb4b16]/25 dark:border-[#eb937d]/40 ring-1 ring-[#cb4b16]/10 dark:ring-[#eb937d]/20 animate-shake';
    }
    return 'border-[rgba(7,54,66,0.06)] dark:border-[#353c43]';
  };

  const cardNumDisplay = cardNumber !== undefined ? cardNumber : submissionCount + 1;

  return (
    <div className="relative w-full max-w-md sm:max-w-xl mx-auto my-2 overflow-visible">
      {/* Continuous ambient smoke floating behind the card edges, scaling with streak */}
      <AmbientSmoke
        streak={streak}
        status={lastAnswerCorrect === false ? 'incorrect' : 'correct'}
      />

      {/* Dense fuzzy smoke pulse/burst billowing outward from behind the edges on answer submission */}
      {lastAnswerCorrect !== null && (
        <FuzzyParticles
          key={`burst-${submissionCount}-${lastAnswerCorrect}`}
          type={lastAnswerCorrect ? 'correct' : 'incorrect'}
          streak={streak}
        />
      )}

      {/* Chalkboard Slate Tactile Hero Card */}
      <div
        role="region"
        aria-label={`Problem: ${problem.factorA} times ${problem.factorB}`}
        aria-live="polite"
        className={`relative z-20 w-full tactile-card dark:bg-[#24292e] rounded-3xl p-6 sm:p-10 transition-colors duration-150 overflow-visible ${getFeedbackBorder()}`}
      >
        {/* Top Card Meta: Card Counter & Streak Indicator */}
        <div className="relative z-20 flex justify-between items-center mb-3">
          <span className="text-xs font-mono font-medium tracking-wide text-[#93a1a1] dark:text-[#94a3b8]">
            Card {cardNumDisplay}
          </span>
          {streak > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fdf5e2] dark:bg-[#eed082]/15 text-[#b58900] dark:text-[#eed082] text-xs font-bold border border-[#f0dfb3] dark:border-[#eed082]/30">
              <Flame className="w-3.5 h-3.5 text-[#b58900] dark:text-[#eed082] fill-[#b58900] dark:fill-[#eed082]" />
              <span>{streak} Streak</span>
            </div>
          )}
        </div>

        {/* Arithmetic Problem Row */}
        <div className="relative z-20 flex items-center justify-center gap-2.5 sm:gap-5 py-2 font-mono font-bold text-4xl sm:text-6xl tracking-tight text-[#073642] dark:text-[#eceff1] select-none">
          <span className="tabular-nums font-semibold">{problem.factorA}</span>
          <span className="text-[#cb4b16] dark:text-[#eb937d] font-light">×</span>
          <span className="tabular-nums font-semibold">{problem.factorB}</span>
          <span className="text-[#93a1a1] dark:text-[#94a3b8] font-light">=</span>

          {children ? (
            children
          ) : (
            <div className="w-24 sm:w-32 h-14 sm:h-20 px-3 rounded-2xl bg-[#f7f0e0] dark:bg-[#181b1e] border-2 border-[#cb4b16]/70 dark:border-[#eb937d]/70 flex items-center justify-center shadow-inner">
              <span className="text-[#93a1a1] dark:text-[#94a3b8] text-2xl font-light">?</span>
            </div>
          )}
        </div>

        {/* Subtle typing hint */}
        <div className="mt-4 text-center text-xs text-[#586e75] dark:text-[#94a3b8] font-medium">
          Type answer & press{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-[#eee8d5] dark:bg-[#181b1e] text-[#073642] dark:text-[#eceff1] font-mono font-bold text-xs border border-[#e4d9c7] dark:border-[#353c43]">
            Enter
          </kbd>
        </div>
      </div>
    </div>
  );
});

Flashcard.displayName = 'Flashcard';

