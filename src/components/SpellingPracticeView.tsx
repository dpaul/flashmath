import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Clock,
  Trophy,
  Flame,
  Zap,
  BookOpen,
  Play,
  MessageSquareQuote,
} from 'lucide-react';
import {
  getSpellingLevelById,
  createSpellingSession,
  submitSpellingAttempt,
  advanceToNextWord,
  getExampleSentence,
  SpellingSession,
} from '../engine/spellingEngine';
import {
  updateLevelStatsFromSession,
  recordCompletedSpellingRun,
} from '../engine/spellingStorage';
import { speakWord, speakSentence } from '../services/speechSynthesis';
import { SpellingCard } from './SpellingCard';
import { SpellingInput } from './SpellingInput';

export interface SpellingPracticeViewProps {
  levelId: string;
  onBackToLevels: () => void;
  onBackToHome: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

export const SpellingPracticeView: React.FC<SpellingPracticeViewProps> = ({
  levelId,
  onBackToLevels,
  onBackToHome,
}) => {
  const level = getSpellingLevelById(levelId);
  const [session, setSession] = useState<SpellingSession>(() => createSpellingSession(levelId));
  const [isRevealingWord, setIsRevealingWord] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [lastAttemptCorrect, setLastAttemptCorrect] = useState<boolean | null>(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const hasRecordedCompletionRef = useRef(false);

  const currentSentence = useMemo(
    () => getExampleSentence(session.currentWord, session.levelId),
    [session.currentWord, session.levelId]
  );

  // Timer effect while session is active
  useEffect(() => {
    if (session.isComplete) return;

    startTimeRef.current = session.startTime;
    const interval = setInterval(() => {
      const elapsed = Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000));
      setLiveElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [session.isComplete, session.startTime]);

  const speakCurrent = useCallback(() => {
    if (!session.isComplete && session.currentWord) {
      speakWord(session.currentWord);
    }
  }, [session.isComplete, session.currentWord]);

  const speakCurrentSentence = useCallback(() => {
    if (!session.isComplete && currentSentence) {
      speakSentence(currentSentence);
      setShowSentence(true);
    }
  }, [session.isComplete, currentSentence]);

  // Pronounce word on initial load or whenever current word changes (if not complete and not revealing)
  useEffect(() => {
    if (!session.isComplete && !isRevealingWord && session.currentWord) {
      speakCurrent();
    }
  }, [session.isComplete, session.currentWord, isRevealingWord, speakCurrent]);

  const finishSession = useCallback(
    (completedSession: SpellingSession) => {
      if (hasRecordedCompletionRef.current) return;
      hasRecordedCompletionRef.current = true;

      const duration = Math.max(
        1,
        completedSession.elapsedSeconds ||
          Math.floor((Date.now() - completedSession.startTime) / 1000)
      );

      recordCompletedSpellingRun(levelId, {
        durationSeconds: duration,
        correctCount: completedSession.correctCount,
        totalWords: completedSession.words.length,
        bestStreak: completedSession.bestStreak,
      });
    },
    [levelId]
  );

  const handleSubmit = (answer: string) => {
    if (!answer || isRevealingWord || session.isComplete) return;

    const updated = submitSpellingAttempt(session, answer);
    const isCorrect = updated.lastAttemptWasCorrect ?? false;
    const isLastWord = session.currentIndex + 1 >= session.words.length;

    setSession(updated);
    setSubmissionCount((prev) => prev + 1);
    setLastAttemptCorrect(isCorrect);

    // Persist session attempt
    updateLevelStatsFromSession(levelId, {
      attempts: 1,
      correct: isCorrect ? 1 : 0,
      streak: updated.bestStreak,
      missed: isCorrect ? [] : [session.currentWord],
    });

    if (isCorrect) {
      setShowSentence(false);
      if (isLastWord) {
        const finalSession = advanceToNextWord(updated);
        setSession(finalSession);
        finishSession(finalSession);
      } else {
        const next = advanceToNextWord(updated);
        setSession(next);
        setLastAttemptCorrect(true);
      }
    } else {
      // Reveal correct spelling so user can review
      setIsRevealingWord(true);
    }
  };

  const handleNextWord = () => {
    const isLastWord = session.currentIndex + 1 >= session.words.length;
    setIsRevealingWord(false);
    setShowSentence(false);
    setLastAttemptCorrect(null);

    const next = advanceToNextWord(session);
    setSession(next);

    if (isLastWord) {
      finishSession(next);
    }
  };

  const handleRestart = () => {
    hasRecordedCompletionRef.current = false;
    const newSession = createSpellingSession(levelId);
    setSession(newSession);
    setIsRevealingWord(false);
    setShowSentence(false);
    setLastAttemptCorrect(null);
    setSubmissionCount(0);
    setLiveElapsedSeconds(0);
    startTimeRef.current = newSession.startTime;
  };

  // If level is complete, show the Results screen
  if (session.isComplete) {
    const finalDuration = session.elapsedSeconds || liveElapsedSeconds || 1;
    const totalWords = session.words.length;
    const accuracyPct = Math.round((session.correctCount / totalWords) * 100);

    return (
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 sm:p-8 animate-fadeIn text-center">
        {/* Celebration header */}
        <div className="w-16 h-16 rounded-3xl bg-[#2aa198]/10 text-[#2aa198] flex items-center justify-center mb-4 shadow-sm">
          <Trophy className="w-8 h-8 text-[#2aa198]" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#eee8d5] text-[#586e75] mb-2">
          {level?.name || 'Spelling Level'}
        </span>

        <h2 className="text-4xl sm:text-5xl font-black text-zen-base03 mb-2">
          Level Complete!
        </h2>
        <p className="text-sm text-zen-base00 mb-8 max-w-sm">
          You have completed all {totalWords} words in this level.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white tactile-card border border-[#ede5d0]">
            <div className="flex items-center gap-1 text-[#2aa198] text-xs font-bold uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Score</span>
            </div>
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#073642]">
              {session.correctCount} / {totalWords}
            </span>
            <span className="text-[11px] text-[#93a1a1] mt-0.5">correct</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-white tactile-card border border-[#ede5d0]">
            <div className="flex items-center gap-1 text-[#cb4b16] text-xs font-bold uppercase mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Time:</span>
            </div>
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#073642]">
              {formatDuration(finalDuration)}
            </span>
            <span className="text-[11px] text-[#93a1a1] mt-0.5">duration</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-white tactile-card border border-[#ede5d0]">
            <div className="flex items-center gap-1 text-[#586e75] text-xs font-bold uppercase mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Accuracy</span>
            </div>
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#073642]">
              {accuracyPct}%
            </span>
            <span className="text-[11px] text-[#93a1a1] mt-0.5">accuracy</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-white tactile-card border border-[#ede5d0]">
            <div className="flex items-center gap-1 text-[#b58900] text-xs font-bold uppercase mb-1">
              <Flame className="w-3.5 h-3.5 text-[#b58900] fill-[#b58900]" />
              <span>Streak</span>
            </div>
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#073642]">
              {session.bestStreak}
            </span>
            <span className="text-[11px] text-[#93a1a1] mt-0.5">best streak</span>
          </div>
        </div>

        {/* Missed Words Section */}
        {session.missedWords.length > 0 && (
          <div className="w-full p-4 mb-8 rounded-2xl bg-[#cb4b16]/5 border border-[#cb4b16]/20 text-left">
            <span className="block text-xs uppercase font-bold text-[#cb4b16] tracking-wider mb-2">
              Words to Review ({session.missedWords.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {session.missedWords.map((word) => (
                <span
                  key={word}
                  className="px-3 py-1 rounded-xl bg-white text-[#073642] font-mono font-semibold text-xs border border-[#cb4b16]/30 shadow-xs"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Practice Again"
            className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-[#2aa198] hover:bg-[#258b83] active:translate-y-0.5 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Practice Again</span>
          </button>

          <button
            type="button"
            onClick={onBackToLevels}
            aria-label="Choose Level"
            className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-[#eee8d5] hover:bg-[#e4d9c7] active:translate-y-0.5 text-[#073642] font-semibold text-base flex items-center justify-center gap-2 border border-[#e4d9c7] cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Choose Level</span>
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            aria-label="Home"
            className="w-full sm:w-auto h-13 px-5 rounded-2xl text-[#586e75] hover:text-[#073642] font-medium text-sm flex items-center justify-center cursor-pointer"
          >
            <span>Home</span>
          </button>
        </div>
      </main>
    );
  }

  const currentDisplayNumber = session.currentIndex + 1;
  const totalWords = session.words.length;

  return (
    <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] py-2 sm:py-6 select-none animate-fadeIn">
      {/* Top Status & Navigation Bar */}
      <div className="w-full flex items-center justify-between px-4 sm:px-8 py-3 mb-2 rounded-2xl bg-white/95 border border-[rgba(7,54,66,0.06)] shadow-sm">
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
          {/* Timer Display */}
          <div className="flex items-center gap-1.5 text-[#cb4b16] font-semibold">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(liveElapsedSeconds)}</span>
          </div>

          {/* Progress: e.g. Word 3 of 12 */}
          <div className="hidden sm:flex items-center gap-1 text-[#586e75]">
            <span className="text-[#93a1a1]">Word</span>
            <span className="font-bold text-[#073642]">{currentDisplayNumber}</span>
            <span className="text-[#93a1a1]">of {totalWords}</span>
          </div>

          {/* Correct Count */}
          <div className="flex items-center gap-1.5 text-[#2aa198]">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">{session.correctCount}</span>
            <span className="text-[#93a1a1]">correct</span>
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
          cardNumber={currentDisplayNumber}
          levelName={level?.name || 'Spelling Level'}
          onSpeak={speakCurrent}
          sentence={currentSentence}
          onSpeakSentence={speakCurrentSentence}
          showSentence={showSentence}
          isRevealingWord={isRevealingWord}
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
      <footer className="w-full text-center py-3 text-xs text-[#93a1a1] flex items-center justify-center gap-3">
        <span>Word {currentDisplayNumber} of {totalWords}</span>
        <span>•</span>
        <button
          type="button"
          onClick={speakCurrent}
          className="hover:text-[#073642] underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Replay word
        </button>
        {currentSentence && (
          <>
            <span>•</span>
            <button
              type="button"
              onClick={speakCurrentSentence}
              className="hover:text-[#073642] underline flex items-center gap-1 cursor-pointer"
            >
              <MessageSquareQuote className="w-3 h-3" />
              Use in sentence
            </button>
          </>
        )}
      </footer>
    </main>
  );
};
