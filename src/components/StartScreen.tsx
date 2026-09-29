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
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-zen-amber/15 dark:bg-[#eed082]/15 text-zen-amber dark:text-[#eed082] text-xs font-bold uppercase tracking-wider border border-zen-amber/30 dark:border-[#eed082]/30">
        <Sparkles className="w-4 h-4" />
        <span>3-Minute Challenge</span>
      </div>

      {/* Main Title */}
      <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-zen-base03 dark:text-[#eceff1] mb-3">
        Flash<span className="text-zen-terracotta dark:text-[#eb937d]">Math</span>
      </h1>

      <p className="text-base sm:text-lg text-zen-base00 dark:text-[#94a3b8] max-w-md mb-8">
        Fast-paced mental arithmetic sprint. Solve as many multiplication problems (tables 2–12) as you can in 3 minutes!
      </p>

      {/* High Score / Best Streak Cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        <div className="flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43]">
          <div className="flex items-center gap-1.5 text-zen-amber dark:text-[#eed082] text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>High Score</span>
          </div>
          <span className="text-3xl sm:text-4xl font-mono font-black text-zen-base03 dark:text-[#eceff1]">
            {personalBests.highScore}
          </span>
          <span className="text-xs text-zen-base01 dark:text-[#94a3b8] mt-0.5">problems solved</span>
        </div>

        <div className="flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43]">
          <div className="flex items-center gap-1.5 text-zen-terracotta dark:text-[#eb937d] text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Best Streak</span>
          </div>
          <span className="text-3xl sm:text-4xl font-mono font-black text-zen-base03 dark:text-[#eceff1]">
            {personalBests.bestStreak}
          </span>
          <span className="text-xs text-zen-base01 dark:text-[#94a3b8] mt-0.5">consecutive correct</span>
        </div>
      </div>

      {/* Quick Rules */}
      <div className="w-full max-w-md p-4 mb-8 rounded-2xl bg-[#f7f0e0]/80 dark:bg-[#181b1e] border border-[#eee4ce] dark:border-[#353c43] text-left text-sm text-zen-base00 dark:text-[#94a3b8] space-y-2">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-zen-cyan dark:text-[#7ec7b8] mt-0.5 shrink-0" />
          <span>Multiplication tables from 2×2 up to 12×12.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-zen-cyan dark:text-[#7ec7b8] mt-0.5 shrink-0" />
          <span>Press <strong className="text-zen-base03 dark:text-[#eceff1]">Enter</strong> or click Submit after typing each answer.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-zen-cyan dark:text-[#7ec7b8] mt-0.5 shrink-0" />
          <span>Full review of any missed calculations at the end.</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={onStart}
        className="w-full max-w-md h-16 inline-flex items-center justify-center gap-3 bg-zen-terracotta dark:bg-[#eb937d] hover:bg-[#b84213] dark:hover:bg-[#df856e] active:translate-y-0.5 text-white dark:text-[#1a1d20] font-black text-xl rounded-2xl transition shadow-[0_4px_0_#9c340d] dark:shadow-[0_4px_0_#b86b58] active:shadow-[0_2px_0_#9c340d] dark:active:shadow-[0_2px_0_#b86b58] cursor-pointer"
      >
        <Play className="w-6 h-6 fill-white dark:fill-[#1a1d20]" />
        <span>Start Challenge</span>
      </button>

      <span className="text-xs text-zen-base01 dark:text-[#94a3b8] mt-3 font-medium">
        or press <kbd className="px-1.5 py-0.5 rounded bg-zen-base2 dark:bg-[#24292e] border border-[#dcd3b6] dark:border-[#353c43] text-zen-base02 dark:text-[#eceff1] font-mono">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-zen-base2 dark:bg-[#24292e] border border-[#dcd3b6] dark:border-[#353c43] text-zen-base02 dark:text-[#eceff1] font-mono">Enter</kbd>
      </span>
    </div>
  );
};
