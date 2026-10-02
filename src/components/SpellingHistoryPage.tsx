import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  AlertTriangle,
  Calendar,
  Clock,
  Flame,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import { SPELLING_LEVELS, SpellingLevel, getExampleSentence } from '../data/spellingLevels';
import {
  loadLevelStats,
  clearLevelStats,
  getMostMissedWordsForLevel,
  getAllMostMissedWords,
  SpellingRunRecord,
} from '../engine/spellingStorage';
import { speakWord } from '../services/speechSynthesis';
import { SpellingAccuracyChart } from './SpellingAccuracyChart';

export interface SpellingHistoryPageProps {
  initialLevelId?: string;
  onBack: () => void;
  onPracticeLevel?: (levelId: string) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

export const SpellingHistoryPage: React.FC<SpellingHistoryPageProps> = ({
  initialLevelId,
  onBack,
  onPracticeLevel,
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<string>(
    initialLevelId || SPELLING_LEVELS[0]?.id || '2026-09-12'
  );
  const [isConfirmingClear, setIsConfirmingClear] = useState<boolean>(false);
  const [expandedSentenceWord, setExpandedSentenceWord] = useState<string | null>(null);

  const selectedLevel: SpellingLevel =
    SPELLING_LEVELS.find((lvl) => lvl.id === selectedLevelId) || SPELLING_LEVELS[0];

  const stats = loadLevelStats(selectedLevelId);
  const mostMissedWords = getMostMissedWordsForLevel(selectedLevelId);
  const qualifyingTroubleWords = getAllMostMissedWords();
  const runs: SpellingRunRecord[] = stats.runs || [];

  const totalRuns = runs.length;
  const bestAccuracy =
    totalRuns > 0 ? Math.max(...runs.map((r) => r.accuracyPercentage)) : 0;
  const lifetimeAccuracy =
    stats.totalAttempts > 0
      ? Math.round((stats.correctCount / stats.totalAttempts) * 100)
      : 0;

  const handleClearHistory = () => {
    clearLevelStats(selectedLevelId);
    setIsConfirmingClear(false);
  };

  const handlePronounce = (word: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    speakWord(word);
  };

  const toggleSentence = (word: string) => {
    setExpandedSentenceWord((prev) => (prev === word ? null : word));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#24292e] hover:bg-[#eee8d5] dark:hover:bg-[#2d353c] text-[#073642] dark:text-[#eceff1] text-sm font-semibold transition border border-[#ede5d0] dark:border-[#353c43] shadow-sm cursor-pointer"
          aria-label="Back to Levels"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Levels</span>
        </button>

        {totalRuns > 0 && !isConfirmingClear && (
          <button
            type="button"
            onClick={() => setIsConfirmingClear(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#ef837b] hover:bg-[#ef837b]/10 transition cursor-pointer border border-transparent hover:border-[#ef837b]/20"
            aria-label="Clear Set History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Set History</span>
          </button>
        )}

        {isConfirmingClear && (
          <div className="flex items-center gap-2 bg-[#ef837b]/10 border border-[#ef837b]/30 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[#ef837b] font-medium">Clear history for this word set?</span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="px-2.5 py-1 rounded-lg bg-[#ef837b] text-white font-bold text-xs cursor-pointer hover:bg-[#d96c64]"
            >
              Yes, Clear
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingClear(false)}
              className="px-2.5 py-1 rounded-lg bg-[#eee8d5] dark:bg-[#24292e] text-[#586e75] dark:text-[#94a3b8] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Page Title & Word Set Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zen-base03 dark:text-[#eceff1] tracking-tight">
            Spelling Word Set History
          </h2>
          <p className="text-sm text-zen-base00 dark:text-[#94a3b8] mt-0.5">
            Review accuracy progression and target your most missed words.
          </p>
        </div>

        {onPracticeLevel && (
          <button
            type="button"
            onClick={() => onPracticeLevel(selectedLevelId)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2aa198] dark:bg-[#7ec7b8] hover:bg-[#258b83] dark:hover:bg-[#6eb2a3] text-white dark:text-[#1a1d20] font-bold text-sm shadow-sm cursor-pointer active:scale-95 transition-all"
            aria-label={`Practice ${selectedLevel.name}`}
          >
            <Play className="w-4 h-4 fill-white dark:fill-[#1a1d20]" />
            <span>Practice This Set</span>
          </button>
        )}
      </div>

      {/* Word Set Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#eee8d5]/50 dark:bg-[#181b1e] border border-[#ede5d0] dark:border-[#353c43]">
        {SPELLING_LEVELS.map((lvl) => {
          const isSelected = lvl.id === selectedLevelId;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => {
                setSelectedLevelId(lvl.id);
                setIsConfirmingClear(false);
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
                isSelected
                  ? 'bg-white dark:bg-[#24292e] text-[#073642] dark:text-[#eceff1] shadow-sm border border-[#ede5d0] dark:border-[#353c43]'
                  : 'text-[#586e75] dark:text-[#94a3b8] hover:text-[#073642] dark:hover:text-[#eceff1]'
              }`}
            >
              {lvl.name}
            </button>
          );
        })}
      </div>

      {/* Word Set Overview Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2aa198] dark:bg-[#7ec7b8]" />
            <h3 className="text-lg font-bold text-[#073642] dark:text-[#eceff1]">
              {selectedLevel.name}
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eee8d5] dark:bg-[#181b1e] text-[#586e75] dark:text-[#94a3b8] font-semibold">
              {selectedLevel.words.length} words
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#586e75] dark:text-[#94a3b8]">
            {selectedLevel.description}
          </p>
        </div>

        {/* Lifetime Stats Pills */}
        <div className="flex items-center gap-3 sm:gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex flex-col items-center px-3 py-2 rounded-2xl bg-[#fcf9f2] dark:bg-[#181b1e] border border-[#ede5d0] dark:border-[#353c43] min-w-20">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#93a1a1] dark:text-[#718093]">
              Sessions
            </span>
            <span className="font-mono text-xl font-black text-[#073642] dark:text-[#eceff1]">
              {totalRuns}
            </span>
          </div>

          <div className="flex flex-col items-center px-3 py-2 rounded-2xl bg-[#fcf9f2] dark:bg-[#181b1e] border border-[#ede5d0] dark:border-[#353c43] min-w-20">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#93a1a1] dark:text-[#718093]">
              Accuracy
            </span>
            <span className="font-mono text-xl font-black text-[#2aa198] dark:text-[#7ec7b8]">
              {stats.totalAttempts > 0 ? `${lifetimeAccuracy}%` : '—'}
            </span>
          </div>

          <div className="flex flex-col items-center px-3 py-2 rounded-2xl bg-[#fcf9f2] dark:bg-[#181b1e] border border-[#ede5d0] dark:border-[#353c43] min-w-20">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#93a1a1] dark:text-[#718093]">
              Best Run
            </span>
            <span className="font-mono text-xl font-black text-[#cb4b16] dark:text-[#eb937d]">
              {totalRuns > 0 ? `${bestAccuracy}%` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* 1. MOST MISSED WORDS SECTION (Highlighted feature) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zen-base03 dark:text-[#eceff1]">
                Words Gotten Wrong Most
              </h3>
              <p className="text-xs text-zen-base00 dark:text-[#94a3b8]">
                Ranked by mistake frequency. Click the audio icon to listen or review example sentences.
              </p>
            </div>
          </div>

          {mostMissedWords.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d]">
                {mostMissedWords.length} trouble word{mostMissedWords.length === 1 ? '' : 's'}
              </span>
              {onPracticeLevel && qualifyingTroubleWords.length > 0 && (
                <button
                  type="button"
                  onClick={() => onPracticeLevel('most-missed')}
                  aria-label="Practice Most Missed Words"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#cb4b16] hover:bg-[#b83e0f] text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Practice Most Missed</span>
                </button>
              )}
            </div>
          )}
        </div>

        {mostMissedWords.length === 0 ? (
          <div className="w-full p-8 rounded-3xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#2aa198]/10 dark:bg-[#7ec7b8]/15 text-[#2aa198] dark:text-[#7ec7b8] flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#073642] dark:text-[#eceff1]">
              No Missed Words Recorded
            </h4>
            <p className="text-sm text-[#586e75] dark:text-[#94a3b8] mt-1 max-w-md">
              {totalRuns === 0
                ? 'Practice this word set to start tracking trouble words and see which spellings need extra focus!'
                : 'Outstanding work! You have spelled every word correctly with zero mistakes recorded for this collection.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mostMissedWords.map((item, index) => {
              const sentence = getExampleSentence(item.word, selectedLevelId);
              const isExpanded = expandedSentenceWord === item.word;
              const isTopTrouble = index < 3;

              return (
                <div
                  key={item.word}
                  className={`p-4 rounded-2xl bg-white dark:bg-[#24292e] tactile-card border transition-all ${
                    isTopTrouble
                      ? 'border-[#cb4b16]/30 dark:border-[#eb937d]/40 shadow-xs'
                      : 'border-[#ede5d0] dark:border-[#353c43]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Rank Badge */}
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                          index === 0
                            ? 'bg-[#cb4b16] text-white shadow-xs'
                            : index === 1
                            ? 'bg-[#cb4b16]/80 text-white'
                            : index === 2
                            ? 'bg-[#cb4b16]/60 text-white'
                            : 'bg-[#eee8d5] dark:bg-[#181b1e] text-[#586e75] dark:text-[#94a3b8]'
                        }`}
                      >
                        #{index + 1}
                      </span>

                      {/* Word Title & Audio Button */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold font-mono text-[#073642] dark:text-[#eceff1] tracking-wide">
                          {item.word}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handlePronounce(item.word, e)}
                          title={`Listen to "${item.word}"`}
                          aria-label={`Listen to ${item.word}`}
                          className="p-1.5 rounded-lg text-[#586e75] dark:text-[#94a3b8] hover:text-[#2aa198] dark:hover:text-[#7ec7b8] hover:bg-[#eee8d5] dark:hover:bg-[#181b1e] transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Miss Count Badge */}
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d] border border-[#cb4b16]/20 dark:border-[#eb937d]/30">
                        {item.misses} {item.misses === 1 ? 'miss' : 'misses'}
                      </span>
                    </div>
                  </div>

                  {/* Error Rate Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#93a1a1] dark:text-[#718093] mb-1">
                      <span>Error rate</span>
                      <span>
                        {item.errorRate}% ({item.misses}/{item.attempts} attempts)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#eee8d5] dark:bg-[#181b1e] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#cb4b16] dark:bg-[#eb937d] transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(10, item.errorRate))}%` }}
                      />
                    </div>
                  </div>

                  {/* Context sentence toggle */}
                  {sentence && (
                    <div className="mt-3 pt-2.5 border-t border-[#ede5d0]/60 dark:border-[#353c43]/60">
                      <button
                        type="button"
                        onClick={() => toggleSentence(item.word)}
                        className="w-full flex items-center justify-between text-xs text-[#586e75] dark:text-[#94a3b8] hover:text-[#073642] dark:hover:text-[#eceff1] cursor-pointer"
                      >
                        <span className="italic truncate pr-2">
                          "{sentence}"
                        </span>
                        <span className="text-[10px] font-medium text-[#2aa198] dark:text-[#7ec7b8] shrink-0">
                          {isExpanded ? 'Hide' : 'Example'}
                        </span>
                      </button>

                      {isExpanded && (
                        <p className="mt-1.5 text-xs text-[#073642] dark:text-[#eceff1] bg-[#fcf9f2] dark:bg-[#181b1e] p-2.5 rounded-xl border border-[#ede5d0] dark:border-[#353c43] leading-relaxed">
                          {sentence}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. % CORRECT OVER TIME GRAPH */}
      <section className="space-y-3">
        <SpellingAccuracyChart runs={runs} />
      </section>

      {/* 3. SESSION RUN LOG */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2aa198]/10 dark:bg-[#7ec7b8]/15 text-[#2aa198] dark:text-[#7ec7b8] flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zen-base03 dark:text-[#eceff1]">
                Session Run Log
              </h3>
              <p className="text-xs text-zen-base00 dark:text-[#94a3b8]">
                Every completed attempt recorded for this word set.
              </p>
            </div>
          </div>

          <span className="text-xs text-[#93a1a1] dark:text-[#718093] font-mono">
            {runs.length} runs recorded
          </span>
        </div>

        {runs.length === 0 ? (
          <div className="w-full p-6 rounded-3xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] text-center text-sm text-[#93a1a1] dark:text-[#718093] italic">
            No completed sessions recorded yet. Complete a session to see your run log!
          </div>
        ) : (
          <div className="space-y-2">
            {[...runs].reverse().map((run, idx) => {
              const runNumber = runs.length - idx;
              const hasMisses = run.missedWords && run.missedWords.length > 0;
              const isHighMastery = run.accuracyPercentage >= 90;

              return (
                <div
                  key={run.id || run.timestamp}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#eee8d5]/80 dark:bg-[#181b1e] flex items-center justify-center font-mono font-bold text-xs text-[#586e75] dark:text-[#94a3b8]">
                      #{runNumber}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#073642] dark:text-[#eceff1]">
                          {run.correctCount} of {run.totalWords} correct
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                            isHighMastery
                              ? 'bg-[#2aa198]/10 dark:bg-[#7ec7b8]/15 text-[#2aa198] dark:text-[#7ec7b8]'
                              : run.accuracyPercentage >= 70
                              ? 'bg-[#b58900]/10 dark:bg-[#eed082]/15 text-[#b58900] dark:text-[#eed082]'
                              : 'bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d]'
                          }`}
                        >
                          {run.accuracyPercentage}%
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#93a1a1] dark:text-[#718093] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(run.timestamp).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(run.durationSeconds)}</span>
                        </span>
                        {run.bestStreak > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#b58900] dark:text-[#eed082]">
                              <Flame className="w-3 h-3 fill-current" />
                              <span>{run.bestStreak} streak</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Missed words chips if any */}
                  {hasMisses && (
                    <div className="flex items-center gap-1.5 flex-wrap self-stretch sm:self-auto justify-end">
                      <span className="text-[11px] text-[#93a1a1] dark:text-[#718093]">
                        Missed:
                      </span>
                      {run.missedWords!.map((word) => (
                        <button
                          key={word}
                          type="button"
                          onClick={() => speakWord(word)}
                          title={`Listen to "${word}"`}
                          className="px-2 py-0.5 rounded-lg bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d] font-mono text-xs border border-[#cb4b16]/20 dark:border-[#eb937d]/30 hover:bg-[#cb4b16]/20 cursor-pointer flex items-center gap-1"
                        >
                          <span>{word}</span>
                          <Volume2 className="w-2.5 h-2.5 opacity-70" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
