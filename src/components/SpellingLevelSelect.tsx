import React from 'react';
import { ArrowLeft, BookOpen, Flame, CheckCircle2, ChevronRight, Clock, TrendingUp, BarChart3, Target } from 'lucide-react';
import { SPELLING_LEVELS, SpellingLevel } from '../data/spellingLevels';
import { loadLevelStats, getAllMostMissedWords } from '../engine/spellingStorage';
import { MOST_MISSED_LEVEL_ID } from '../engine/spellingEngine';

export interface SpellingLevelSelectProps {
  onSelectLevel: (levelId: string) => void;
  onBackToHome: () => void;
  onOpenHistory?: (levelId?: string) => void;
}

export const SpellingLevelSelect: React.FC<SpellingLevelSelectProps> = ({
  onSelectLevel,
  onBackToHome,
  onOpenHistory,
}) => {
  const mostMissedWords = getAllMostMissedWords();
  const missedCount = mostMissedWords.length;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center p-4 sm:p-8 animate-fadeIn">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={onBackToHome}
          aria-label="Back to modes"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#586e75] dark:text-[#94a3b8] hover:text-[#073642] dark:hover:text-[#eceff1] px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#24292e]/80 border border-[#ede5d0] dark:border-[#353c43] hover:bg-white dark:hover:bg-[#24292e] transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Modes</span>
        </button>

        {onOpenHistory && (
          <button
            type="button"
            onClick={() => onOpenHistory()}
            aria-label="View Spelling History"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2aa198] dark:text-[#7ec7b8] hover:text-[#258b83] dark:hover:text-[#6eb2a3] px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#24292e]/80 border border-[#ede5d0] dark:border-[#353c43] hover:bg-white dark:hover:bg-[#24292e] transition-all cursor-pointer shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Spelling History</span>
          </button>
        )}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-zen-base03 dark:text-[#eceff1] mb-2">
          Spelling Levels
        </h2>
        <p className="text-sm text-zen-base00 dark:text-[#94a3b8] max-w-md">
          Choose a vocabulary collection or target your most missed words. All practice is untimed with speech synthesis.
        </p>
      </div>

      {/* Most Missed Words Mode Card */}
      <div className="w-full mb-6">
        <div
          className={`flex flex-col rounded-3xl tactile-card border transition-all overflow-hidden ${
            missedCount > 0
              ? 'bg-gradient-to-br from-white via-white to-[#fdf4ee] dark:from-[#24292e] dark:via-[#24292e] dark:to-[#2c2220] border-[#cb4b16]/30 dark:border-[#eb937d]/40 shadow-sm hover:border-[#cb4b16]/60 dark:hover:border-[#eb937d]/60 hover:shadow-md'
              : 'bg-white dark:bg-[#24292e] border-[#ede5d0] dark:border-[#353c43] opacity-75'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (missedCount > 0) {
                onSelectLevel(MOST_MISSED_LEVEL_ID);
              }
            }}
            disabled={missedCount === 0}
            aria-label="Practice Most Missed Words"
            className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 text-left w-full ${
              missedCount > 0 ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                  missedCount > 0
                    ? 'bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d] group-hover:scale-110'
                    : 'bg-[#eee8d5] dark:bg-[#181b1e] text-[#93a1a1] dark:text-[#718093]'
                }`}
              >
                <Target className="w-6 h-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-zen-base03 dark:text-[#eceff1]">
                    Most Missed Words
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      missedCount > 0
                        ? 'bg-[#cb4b16]/15 text-[#cb4b16] dark:text-[#eb937d] dark:bg-[#eb937d]/20'
                        : 'bg-[#eee8d5] dark:bg-[#181b1e] text-[#93a1a1] dark:text-[#718093]'
                    }`}
                  >
                    {missedCount === 1 ? '1 trouble word' : `${missedCount} trouble words`}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zen-base00 dark:text-[#94a3b8] max-w-md">
                  {missedCount > 0
                    ? `Targeted drill focusing on ${missedCount === 1 ? 'the 1 word' : `the ${missedCount} words`} you have missed more than once.`
                    : 'Words you miss more than once will automatically appear here for focused review.'}
                </p>
              </div>
            </div>

            {/* Action pill / arrow */}
            <div className="mt-4 sm:mt-0 flex items-center gap-3 self-end sm:self-center">
              {missedCount > 0 ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#cb4b16] dark:bg-[#eb937d] text-white dark:text-[#1a1d20] font-bold text-xs shadow-xs group-hover:bg-[#b83e0f] dark:group-hover:bg-[#f0a693] transition-colors">
                  <span>Practice Missed Words</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              ) : (
                <span className="text-xs text-[#93a1a1] dark:text-[#718093] italic px-2 py-1">
                  No repeated misses yet
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="w-full flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#586e75] dark:text-[#94a3b8]">
          Word Collections
        </h3>
        <span className="text-xs text-[#93a1a1] dark:text-[#718093]">
          {SPELLING_LEVELS.length} lists
        </span>
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
            <div
              key={level.id}
              className="flex flex-col rounded-3xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] hover:border-zen-cyan/50 dark:hover:border-[#7ec7b8]/50 transition-all hover:shadow-md overflow-hidden"
            >
              <button
                type="button"
                onClick={() => onSelectLevel(level.id)}
                aria-label={level.name}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 cursor-pointer text-left w-full"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#2aa198]/10 dark:bg-[#7ec7b8]/15 text-zen-cyan dark:text-[#7ec7b8] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-zen-base03 dark:text-[#eceff1]">
                        {level.name}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eee8d5] dark:bg-[#181b1e] text-[#586e75] dark:text-[#94a3b8] font-semibold">
                        {level.words.length} words
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zen-base00 dark:text-[#94a3b8] max-w-sm">
                      {level.description}
                    </p>
                  </div>
                </div>

                {/* Stats pill & Arrow */}
                <div className="mt-4 sm:mt-0 flex items-center gap-4 self-end sm:self-center">
                  {hasPlayed ? (
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div className="flex items-center gap-1 text-[#2aa198] dark:text-[#7ec7b8]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{accuracyPct}%</span>
                      </div>
                      {stats.lastScore && stats.lastScore.total > 0 && (
                        <div className="hidden sm:flex items-center gap-1 text-[#586e75] dark:text-[#94a3b8]">
                          <span>Last: {stats.lastScore.correct}/{stats.lastScore.total}</span>
                        </div>
                      )}
                      {stats.bestTimeSeconds && (
                        <div className="hidden sm:flex items-center gap-1 text-[#cb4b16] dark:text-[#eb937d]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{stats.bestTimeSeconds}s</span>
                        </div>
                      )}
                      {stats.bestStreak > 0 && (
                        <div className="flex items-center gap-1 text-[#b58900] dark:text-[#eed082]">
                          <Flame className="w-3.5 h-3.5 fill-[#b58900] dark:fill-[#eed082]" />
                          <span>{stats.bestStreak} Streak</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-[#93a1a1] dark:text-[#718093] italic">Not practiced yet</span>
                  )}

                  <div className="w-8 h-8 rounded-full bg-[#eee8d5]/60 dark:bg-[#181b1e] flex items-center justify-center text-[#586e75] dark:text-[#94a3b8] group-hover:bg-[#2aa198] dark:group-hover:bg-[#7ec7b8] group-hover:text-white dark:group-hover:text-[#1a1d20] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Footer bar with direct history action */}
              {onOpenHistory && (
                <div className="px-6 py-2.5 bg-[#fcf9f2] dark:bg-[#181b1e]/60 border-t border-[#ede5d0]/70 dark:border-[#353c43]/70 flex items-center justify-between text-xs">
                  <span className="text-[#93a1a1] dark:text-[#718093]">
                    {hasPlayed ? `${stats.runs?.length || 0} sessions recorded` : 'Ready to start'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenHistory(level.id);
                    }}
                    aria-label={`View stats for ${level.difficultyLabel}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#2aa198] dark:text-[#7ec7b8] hover:text-[#258b83] dark:hover:text-[#6eb2a3] cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>View Word Set History</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
