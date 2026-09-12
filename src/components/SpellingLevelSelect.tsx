import React from 'react';
import { ArrowLeft, BookOpen, Flame, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { SPELLING_LEVELS, SpellingLevel } from '../data/spellingLevels';
import { loadLevelStats } from '../engine/spellingStorage';

export interface SpellingLevelSelectProps {
  onSelectLevel: (levelId: string) => void;
  onBackToHome: () => void;
}

export const SpellingLevelSelect: React.FC<SpellingLevelSelectProps> = ({
  onSelectLevel,
  onBackToHome,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center p-4 sm:p-8 animate-fadeIn">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={onBackToHome}
          aria-label="Back to modes"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#586e75] hover:text-[#073642] px-3.5 py-2 rounded-xl bg-white/70 border border-[#ede5d0] hover:bg-white transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Modes</span>
        </button>

        <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#93a1a1]">
          Select Level
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-zen-base03 mb-2">
          Spelling Levels
        </h2>
        <p className="text-sm text-zen-base00 max-w-md">
          Choose a vocabulary collection to practice. All practice is untimed with speech synthesis.
        </p>
      </div>

      {/* Levels List */}
      <div className="w-full flex flex-col gap-4">
        {SPELLING_LEVELS.map((level: SpellingLevel) => {
          const stats = loadLevelStats(level.id);
          const hasPlayed = stats.totalAttempts > 0;
          const accuracyPct = hasPlayed
            ? Math.round((stats.correctCount / stats.totalAttempts) * 100)
            : 0;

          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onSelectLevel(level.id)}
              aria-label={level.name}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-3xl bg-white tactile-card border border-[#ede5d0] hover:border-zen-cyan/50 transition-all cursor-pointer hover:shadow-md text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2aa198]/10 text-zen-cyan flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-zen-base03">
                      {level.name}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eee8d5] text-[#586e75] font-semibold">
                      {level.words.length} words
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zen-base00 max-w-sm">
                    {level.description}
                  </p>
                </div>
              </div>

              {/* Stats pill & Arrow */}
              <div className="mt-4 sm:mt-0 flex items-center gap-4 self-end sm:self-center">
                {hasPlayed ? (
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="flex items-center gap-1 text-[#2aa198]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{accuracyPct}%</span>
                    </div>
                    {stats.lastScore && (
                      <div className="hidden sm:flex items-center gap-1 text-[#586e75]">
                        <span>Last: {stats.lastScore.correct}/{stats.lastScore.total}</span>
                      </div>
                    )}
                    {stats.bestTimeSeconds && (
                      <div className="hidden sm:flex items-center gap-1 text-[#cb4b16]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{stats.bestTimeSeconds}s</span>
                      </div>
                    )}
                    {stats.bestStreak > 0 && (
                      <div className="flex items-center gap-1 text-[#b58900]">
                        <Flame className="w-3.5 h-3.5 fill-[#b58900]" />
                        <span>{stats.bestStreak} Streak</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-[#93a1a1] italic">Not practiced yet</span>
                )}

                <div className="w-8 h-8 rounded-full bg-[#eee8d5]/60 flex items-center justify-center text-[#586e75] group-hover:bg-[#2aa198] group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
