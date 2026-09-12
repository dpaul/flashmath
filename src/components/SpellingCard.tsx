import React, { useEffect } from 'react';
import { Flame, Volume2 } from 'lucide-react';
import { FuzzyParticles, AmbientSmoke } from './FuzzyParticles';

export interface SpellingCardProps {
  word: string;
  streak: number;
  lastAttemptCorrect: boolean | null;
  submissionCount?: number;
  cardNumber?: number;
  levelName: string;
  onSpeak: () => void;
  children?: React.ReactNode;
}

export const SpellingCard: React.FC<SpellingCardProps> = ({
  streak,
  lastAttemptCorrect,
  submissionCount = 0,
  cardNumber = 1,
  levelName,
  onSpeak,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Space hotkey to replay word if not typing in an input or textarea
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      if (e.key === ' ' && !isInput) {
        e.preventDefault();
        onSpeak();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSpeak]);

  const getFeedbackBorder = () => {
    if (lastAttemptCorrect === true) {
      return 'border-[#2aa198]/25 ring-1 ring-[#2aa198]/10';
    }
    if (lastAttemptCorrect === false) {
      return 'border-[#cb4b16]/25 ring-1 ring-[#cb4b16]/10 animate-shake';
    }
    return 'border-[rgba(7,54,66,0.06)]';
  };

  return (
    <div className="relative w-full max-w-md sm:max-w-xl mx-auto my-2 overflow-visible">
      {/* Ambient smoke */}
      <AmbientSmoke
        streak={streak}
        status={lastAttemptCorrect === false ? 'incorrect' : 'correct'}
      />

      {/* Burst particles on feedback */}
      {lastAttemptCorrect !== null && (
        <FuzzyParticles
          key={`burst-${submissionCount}-${lastAttemptCorrect}`}
          type={lastAttemptCorrect ? 'correct' : 'incorrect'}
          streak={streak}
        />
      )}

      {/* White tactile paper card */}
      <div
        role="region"
        aria-label={`Spelling card for level ${levelName}`}
        className={`relative z-20 w-full tactile-card rounded-3xl p-6 sm:p-10 transition-all duration-200 overflow-visible ${getFeedbackBorder()}`}
      >
        {/* Top Card Meta */}
        <div className="relative z-20 flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium tracking-wide text-[#93a1a1]">
              Word #{cardNumber}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#eee8d5] text-[#586e75] font-semibold">
              {levelName}
            </span>
          </div>

          {streak > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fdf5e2] text-[#b58900] text-xs font-bold border border-[#f0dfb3]">
              <Flame className="w-3.5 h-3.5 text-[#b58900] fill-[#b58900]" />
              <span>{streak} Streak</span>
            </div>
          )}
        </div>

        {/* Central Audio Prompter Area */}
        <div className="relative z-20 flex flex-col items-center justify-center py-4">
          <button
            type="button"
            onClick={onSpeak}
            aria-label="Repeat word pronunciation"
            className="group relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#eee8d5]/70 hover:bg-[#eee8d5] text-[#073642] font-semibold text-lg border border-[#e4d9c7] shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-6 h-6 text-[#2aa198] group-hover:scale-110 transition-transform" />
            <span>Listen to Word</span>
          </button>
          <span className="mt-2 text-xs text-[#93a1a1]">Click or press replay anytime</span>
        </div>

        {/* Input well area */}
        <div className="relative z-20 mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};
