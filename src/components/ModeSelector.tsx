import React from 'react';
import { Calculator, Volume2, Sparkles, ArrowRight, Zap, Trophy } from 'lucide-react';

export interface ModeSelectorProps {
  onSelectMode: (mode: 'math' | 'spelling') => void;
  mathHighScore: number;
  mathBestStreak: number;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  onSelectMode,
  mathHighScore,
  mathBestStreak,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center p-4 sm:p-8 animate-fadeIn">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-zen-amber/15 text-zen-amber text-xs font-bold uppercase tracking-wider border border-zen-amber/30">
        <Sparkles className="w-4 h-4" />
        <span>FlashMath Learning Hub</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zen-base03 mb-3">
        Flash<span className="text-zen-terracotta">Math</span>
      </h1>

      <p className="text-base sm:text-lg text-zen-base00 max-w-md mb-8">
        Sharpen your mental reflexes. Choose a drill mode to get started:
      </p>

      {/* Mode Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-6">
        {/* Math Sprint Card */}
        <button
          type="button"
          onClick={() => onSelectMode('math')}
          aria-label="Start Math Sprint"
          className="group relative flex flex-col text-left p-6 rounded-3xl bg-white tactile-card border border-[#ede5d0] hover:border-zen-terracotta/40 transition-all cursor-pointer hover:shadow-lg active:scale-[0.98]"
        >
          <div className="flex items-center justify-between w-full mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#cb4b16]/10 text-zen-terracotta flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#eee8d5] text-[#586e75]">
              3-Minute Challenge
            </span>
          </div>

          <h2 className="text-2xl font-bold text-zen-base03 mb-1">
            Math Sprint
          </h2>
          <p className="text-xs sm:text-sm text-zen-base00 mb-5 leading-relaxed">
            Fast-paced multiplication sprint covering times tables 2 through 12 against the clock.
          </p>

          {/* Quick Best Stats */}
          <div className="mt-auto pt-4 border-t border-[#eee8d5]/80 flex items-center justify-between text-xs text-[#586e75]">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-zen-amber" />
              <span>High: <strong>{mathHighScore}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-zen-terracotta" />
              <span>Streak: <strong>{mathBestStreak}</strong></span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-zen-terracotta group-hover:translate-x-1 transition-transform">
            <span>Play Sprint</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Spelling Practice Card */}
        <button
          type="button"
          onClick={() => onSelectMode('spelling')}
          aria-label="Start Spelling Practice"
          className="group relative flex flex-col text-left p-6 rounded-3xl bg-white tactile-card border border-[#ede5d0] hover:border-zen-cyan/40 transition-all cursor-pointer hover:shadow-lg active:scale-[0.98]"
        >
          <div className="flex items-center justify-between w-full mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2aa198]/10 text-zen-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
              <Volume2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#eee8d5] text-[#586e75]">
              Untimed Speech Practice
            </span>
          </div>

          <h2 className="text-2xl font-bold text-zen-base03 mb-1">
            Spelling Practice
          </h2>
          <p className="text-xs sm:text-sm text-zen-base00 mb-5 leading-relaxed">
            Listen to words spoken aloud via speech synthesis and test your phonetic spelling accuracy.
          </p>

          <div className="mt-auto pt-4 border-t border-[#eee8d5]/80 flex items-center justify-between text-xs text-[#586e75]">
            <span>Speech Synthesis</span>
            <span className="text-[#2aa198] font-bold">Untimed Drill</span>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#2aa198] group-hover:translate-x-1 transition-transform">
            <span>Practice Spelling</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
