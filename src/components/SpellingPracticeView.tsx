import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import {
  getSpellingLevelById,
  createSpellingSession,
  submitSpellingAttempt,
  advanceToNextWord,
  SpellingSession,
} from '../engine/spellingEngine';
import { updateLevelStatsFromSession } from '../engine/spellingStorage';
import { speakWord } from '../services/speechSynthesis';
import { SpellingCard } from './SpellingCard';
import { SpellingInput } from './SpellingInput';

export interface SpellingPracticeViewProps {
  levelId: string;
  onBackToLevels: () => void;
  onBackToHome: () => void;
}

export const SpellingPracticeView: React.FC<SpellingPracticeViewProps> = ({
  levelId,
  onBackToLevels,
}) => {
  const level = getSpellingLevelById(levelId);
  const [session, setSession] = useState<SpellingSession>(() => createSpellingSession(levelId));
  const [isRevealingWord, setIsRevealingWord] = useState(false);
  const [lastAttemptCorrect, setLastAttemptCorrect] = useState<boolean | null>(null);
  const [submissionCount, setSubmissionCount] = useState(0);

  const speakCurrent = useCallback(() => {
    if (session.currentWord) {
      speakWord(session.currentWord);
    }
  }, [session.currentWord]);

  // Pronounce word on initial mount and whenever current word changes (if not in reveal state)
  useEffect(() => {
    if (!isRevealingWord && session.currentWord) {
      speakCurrent();
    }
  }, [session.currentWord, isRevealingWord, speakCurrent]);

  const handleSubmit = (answer: string) => {
    if (!answer || isRevealingWord) return;

    const updated = submitSpellingAttempt(session, answer);
    const isCorrect = updated.lastAttemptWasCorrect ?? false;

    setSession(updated);
    setSubmissionCount((prev) => prev + 1);
    setLastAttemptCorrect(isCorrect);

    // Persist session attempt to localStorage
    updateLevelStatsFromSession(levelId, {
      attempts: 1,
      correct: isCorrect ? 1 : 0,
      streak: updated.bestStreak,
      missed: isCorrect ? [] : [session.currentWord],
    });

    if (isCorrect) {
      // Auto-advance to next word
      const next = advanceToNextWord(updated);
      setSession(next);
      setLastAttemptCorrect(true);
    } else {
      // Reveal correct spelling so user can review
      setIsRevealingWord(true);
    }
  };

  const handleNextWord = () => {
    setIsRevealingWord(false);
    setLastAttemptCorrect(null);
    const next = advanceToNextWord(session);
    setSession(next);
  };

  const accuracyPct =
    session.totalAttempts > 0
      ? Math.round((session.correctCount / session.totalAttempts) * 100)
      : 100;

  return (
    <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] py-2 sm:py-6 select-none animate-fadeIn">
      {/* Top Status & Navigation Bar */}
      <div className="w-full flex items-center justify-between px-4 sm:px-8 py-3 mb-2 rounded-2xl bg-white/60 border border-[rgba(7,54,66,0.06)] shadow-sm backdrop-blur-sm">
        <button
          type="button"
          onClick={onBackToLevels}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#586e75] hover:text-[#073642] px-3 py-1.5 rounded-xl hover:bg-[#eee8d5]/50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Levels</span>
        </button>

        {/* Live Session Metrics */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-[#2aa198]">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">{session.correctCount}</span>
            <span className="text-[#93a1a1]">/ {session.totalAttempts}</span>
          </div>

          <div className="hidden xs:flex items-center gap-1 text-[#586e75]">
            <span className="font-semibold">{accuracyPct}%</span>
            <span className="text-[#93a1a1]">acc</span>
          </div>
        </div>
      </div>

      {/* Hero Spelling Card */}
      <div className="w-full flex flex-col items-center justify-center my-auto">
        <SpellingCard
          word={session.currentWord}
          streak={session.currentStreak}
          lastAttemptCorrect={lastAttemptCorrect}
          submissionCount={submissionCount}
          cardNumber={session.totalAttempts + 1}
          levelName={level?.name || 'Spelling Level'}
          onSpeak={speakCurrent}
        >
          <SpellingInput
            targetWord={session.currentWord}
            onSubmit={handleSubmit}
            onNextWord={handleNextWord}
            lastAttemptCorrect={lastAttemptCorrect}
            isRevealingWord={isRevealingWord}
          />
        </SpellingCard>
      </div>

      {/* Untimed Mode Footer Hint */}
      <footer className="w-full text-center py-3 text-xs text-[#93a1a1] flex items-center justify-center gap-4">
        <span>Untimed Practice</span>
        <span>•</span>
        <button
          type="button"
          onClick={speakCurrent}
          className="hover:text-[#073642] underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Replay word
        </button>
      </footer>
    </main>
  );
};
