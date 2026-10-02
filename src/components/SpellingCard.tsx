import React, { useEffect, memo } from 'react';
import { Flame, Volume2, MessageSquareQuote } from 'lucide-react';
import { maskWordInSentence } from '../engine/spellingEngine';

export interface SpellingCardProps {
  word: string;
  streak: number;
  lastAttemptCorrect: boolean | null;
  submissionCount?: number;
  cardNumber?: number;
  levelName: string;
  onSpeak: () => void;
  sentence?: string;
  onSpeakSentence?: () => void;
  showSentence?: boolean;
  isRevealingWord?: boolean;
  children?: React.ReactNode;
}

export const SpellingCard: React.FC<SpellingCardProps> = memo(({
  word,
  streak,
  lastAttemptCorrect,
  cardNumber = 1,
  levelName,
  onSpeak,
  sentence,
  onSpeakSentence,
  showSentence = false,
  isRevealingWord = false,
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
      return 'border-[#2aa198]/25 dark:border-[#7ec7b8]/40 ring-1 ring-[#2aa198]/10 dark:ring-[#7ec7b8]/20';
    }
    if (lastAttemptCorrect === false) {
      return 'border-[#cb4b16]/25 dark:border-[#eb937d]/40 ring-1 ring-[#cb4b16]/10 dark:ring-[#eb937d]/20 animate-shake';
    }
    return 'border-[rgba(7,54,66,0.06)] dark:border-[#353c43]';
  };

  return (
    <div className="relative w-full max-w-md sm:max-w-xl mx-auto my-2 overflow-visible">
      {/* Chalkboard Slate Tactile Card */}
      <div
        role="region"
        aria-label={`Spelling card for level ${levelName}`}
        className={`relative z-20 w-full tactile-card dark:bg-[#24292e] rounded-3xl p-6 sm:p-10 transition-colors duration-150 overflow-visible ${getFeedbackBorder()}`}
      >
        {/* Top Card Meta */}
        <div className="relative z-20 flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium tracking-wide text-[#93a1a1] dark:text-[#94a3b8]">
              Word #{cardNumber}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#eee8d5] dark:bg-[#181b1e] text-[#586e75] dark:text-[#94a3b8] font-semibold border border-transparent dark:border-[#353c43]">
              {levelName}
            </span>
          </div>

          {streak > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fdf5e2] dark:bg-[#eed082]/15 text-[#b58900] dark:text-[#eed082] text-xs font-bold border border-[#f0dfb3] dark:border-[#eed082]/30">
              <Flame className="w-3.5 h-3.5 text-[#b58900] dark:text-[#eed082] fill-[#b58900] dark:fill-[#eed082]" />
              <span>{streak} Streak</span>
            </div>
          )}
        </div>

        {/* Central Audio Prompter Area */}
        <div className="relative z-20 flex flex-col items-center justify-center py-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSpeak();
                const input = document.getElementById('spelling-word-input');
                input?.focus();
              }}
              aria-label="Listen to Word"
              className="group relative flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#eee8d5]/70 dark:bg-[#181b1e] hover:bg-[#eee8d5] dark:hover:bg-[#282e34] text-[#073642] dark:text-[#eceff1] font-semibold text-base border border-[#e4d9c7] dark:border-[#353c43] shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
            >
              <Volume2 className="w-5 h-5 text-[#2aa198] dark:text-[#7ec7b8] group-hover:scale-110 transition-transform" />
              <span>Listen to Word</span>
            </button>

            {sentence && onSpeakSentence && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSpeakSentence();
                  const input = document.getElementById('spelling-word-input');
                  input?.focus();
                }}
                aria-label="Use it in a sentence"
                className="group relative flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#eee8d5]/70 dark:bg-[#181b1e] hover:bg-[#eee8d5] dark:hover:bg-[#282e34] text-[#073642] dark:text-[#eceff1] font-semibold text-base border border-[#e4d9c7] dark:border-[#353c43] shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
              >
                <MessageSquareQuote className="w-5 h-5 text-[#268bd2] dark:text-[#92b6d5] group-hover:scale-110 transition-transform" />
                <span>Use it in a sentence</span>
              </button>
            )}
          </div>

          {showSentence && sentence && (
            <div
              data-testid="sentence-preview"
              className="mt-4 px-4 py-2.5 rounded-xl bg-[#eee8d5]/60 dark:bg-[#181b1e] border border-[#e4d9c7] dark:border-[#353c43] text-[#586e75] dark:text-[#94a3b8] text-sm text-center italic animate-fadeIn max-w-md shadow-xs"
            >
              &ldquo;{isRevealingWord ? sentence : maskWordInSentence(sentence, word)}&rdquo;
            </div>
          )}

          <span className="mt-2 text-xs text-[#93a1a1] dark:text-[#718093]">Click buttons or press spacebar anytime</span>
        </div>

        {/* Input well area */}
        <div className="relative z-20 mt-4">
          {children}
        </div>
      </div>
    </div>
  );
});

SpellingCard.displayName = 'SpellingCard';

