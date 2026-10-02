import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Flame,
  RotateCcw,
  Trophy,
  Target,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { MultiplicationProblem, evaluateAnswer } from '../engine/math';
import {
  getMostMissedMathProblems,
  recordMathProblemAttempt,
  createProblemFromRanked,
  RankedMathProblem,
} from '../engine/mathMistakesStorage';
import { MissedProblem } from '../engine/types';
import { Flashcard } from './Flashcard';
import { AnswerInput } from './AnswerInput';
import { Keypad } from './Keypad';

export interface MathPracticeViewProps {
  onBackToMath: () => void;
  onBackToHome: () => void;
  onOpenHistory?: () => void;
}

export const MathPracticeView: React.FC<MathPracticeViewProps> = ({
  onBackToMath,
  onBackToHome,
  onOpenHistory,
}) => {
  const [troubleProblems, setTroubleProblems] = useState<MultiplicationProblem[]>([]);
  const [initialRankedCount, setInitialRankedCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [missedInSession, setMissedInSession] = useState<MissedProblem[]>([]);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [isRevealingAnswer, setIsRevealingAnswer] = useState<boolean>(false);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState<string>('');

  const initializeSession = useCallback(() => {
    const ranked = getMostMissedMathProblems(20);
    setInitialRankedCount(ranked.length);
    if (ranked.length === 0) {
      setTroubleProblems([]);
      setIsComplete(true);
      return;
    }

    // Shuffle problems for variety
    const shuffled: RankedMathProblem[] = [...ranked].sort(() => Math.random() - 0.5);
    const problems = shuffled.map(createProblemFromRanked);

    setTroubleProblems(problems);
    setCurrentIndex(0);
    setInputValue('');
    setCorrectCount(0);
    setTotalAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setIsComplete(false);
    setMissedInSession([]);
    setLastAnswerCorrect(null);
    setIsRevealingAnswer(false);
    setLastSubmittedAnswer('');
  }, []);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const currentProblem: MultiplicationProblem | undefined = troubleProblems[currentIndex];

  const handleAdvanceToNext = useCallback(() => {
    setIsRevealingAnswer(false);
    setLastAnswerCorrect(null);
    setInputValue('');

    if (currentIndex + 1 >= troubleProblems.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, troubleProblems.length]);

  const handleSubmit = useCallback(
    (answer: string) => {
      if (!currentProblem || isComplete || isRevealingAnswer) return;

      const isCorrect = answer !== '' && evaluateAnswer(currentProblem, answer);
      setLastSubmittedAnswer(answer);
      setLastAnswerCorrect(isCorrect);
      setTotalAttempts((prev) => prev + 1);

      // Record mistake / practice stats without touching sprint history
      recordMathProblemAttempt(currentProblem.factorA, currentProblem.factorB, isCorrect);

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
        setStreak((prev) => {
          const next = prev + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });

        // Advance to next problem or finish
        if (currentIndex + 1 >= troubleProblems.length) {
          setIsComplete(true);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setInputValue('');
        }
      } else {
        setStreak(0);
        setMissedInSession((prev) => [
          ...prev,
          {
            problem: currentProblem,
            submittedAnswer: answer || 'Skipped',
            correctAnswer: currentProblem.product,
          },
        ]);
        setIsRevealingAnswer(true);
      }
    },
    [currentProblem, isComplete, isRevealingAnswer, currentIndex, troubleProblems.length]
  );

  const handleSkip = useCallback(() => {
    if (!currentProblem || isComplete || isRevealingAnswer) return;
    handleSubmit('');
  }, [currentProblem, isComplete, isRevealingAnswer, handleSubmit]);

  // Global keyboard shortcuts
  useEffect(() => {
    if (isComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRevealingAnswer) {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleAdvanceToNext();
        }
      } else {
        if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          handleSkip();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setIsComplete(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete, isRevealingAnswer, handleAdvanceToNext, handleSkip]);

  // Keypad actions
  const handleKeypadDigit = (digit: string) => {
    if (isRevealingAnswer) return;
    setInputValue((prev) => prev + digit);
  };

  const handleKeypadBackspace = () => {
    if (isRevealingAnswer) return;
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleKeypadSubmit = () => {
    if (isRevealingAnswer) {
      handleAdvanceToNext();
    } else {
      handleSubmit(inputValue);
    }
  };

  // 1. Empty state when no problems qualify
  if (troubleProblems.length === 0 && initialRankedCount === 0) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center p-6 sm:p-8 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d] flex items-center justify-center mb-4 shadow-sm">
          <Target className="w-8 h-8" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-zen-base03 dark:text-[#eceff1] mb-2">
          No Trouble Facts Recorded!
        </h2>
        <p className="text-sm text-zen-base00 dark:text-[#94a3b8] mb-8 max-w-md">
          You don't have any multiplication problems missed more than once yet. As you play 3-minute sprints, problems you miss more than once will automatically gather here for focused practice.
        </p>

        <button
          type="button"
          onClick={onBackToMath}
          aria-label="Back to Math Sprint"
          className="h-12 px-6 rounded-2xl bg-[#cb4b16] hover:bg-[#b83e0f] text-white font-bold text-sm cursor-pointer shadow-sm transition-all"
        >
          Back to Math Sprint
        </button>
      </div>
    );
  }

  // 2. Completion screen
  if (isComplete) {
    const totalAnswered = totalAttempts;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center p-6 sm:p-8 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-[#2aa198]/10 dark:bg-[#7ec7b8]/15 text-[#2aa198] dark:text-[#7ec7b8] flex items-center justify-center mb-4 shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#eee8d5] dark:bg-[#24292e] text-[#586e75] dark:text-[#94a3b8] mb-2 border border-transparent dark:border-[#353c43]">
          Trouble Facts Drill
        </span>

        <h2 className="text-4xl font-black text-zen-base03 dark:text-[#eceff1] mb-2">
          Drill Complete!
        </h2>
        <p className="text-sm text-zen-base00 dark:text-[#94a3b8] mb-6 max-w-sm">
          You finished practicing your most missed multiplication facts.
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] flex flex-col items-center">
            <span className="text-xs text-[#93a1a1] dark:text-[#718093] font-bold uppercase tracking-wider mb-1">
              Solved
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-zen-base03 dark:text-[#eceff1]">
              {correctCount}/{totalAnswered}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] flex flex-col items-center">
            <span className="text-xs text-[#93a1a1] dark:text-[#718093] font-bold uppercase tracking-wider mb-1">
              Accuracy
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#2aa198] dark:text-[#7ec7b8]">
              {accuracy}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#24292e] tactile-card border border-[#ede5d0] dark:border-[#353c43] flex flex-col items-center">
            <span className="text-xs text-[#93a1a1] dark:text-[#718093] font-bold uppercase tracking-wider mb-1">
              Best Streak
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#b58900] dark:text-[#eed082]">
              {bestStreak}
            </span>
          </div>
        </div>

        {/* Missed in this session list */}
        {missedInSession.length > 0 && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-[#f7f0e0]/70 dark:bg-[#181b1e] border border-[#ede5d0] dark:border-[#353c43] text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#cb4b16] dark:text-[#eb937d] mb-3">
              Missed During This Drill ({missedInSession.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {missedInSession.map((m, idx) => (
                <div
                  key={`${m.problem.id}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#24292e] border border-[#eee4ce] dark:border-[#353c43] text-sm"
                >
                  <span className="font-mono font-bold text-[#073642] dark:text-[#eceff1]">
                    {m.problem.factorA} × {m.problem.factorB}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-zen-red dark:text-[#ef837b] line-through">
                      {m.submittedAnswer}
                    </span>
                    <span className="text-zen-green dark:text-[#7ec7b8] font-bold">
                      {m.correctAnswer}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            type="button"
            onClick={initializeSession}
            className="flex-1 w-full h-12 inline-flex items-center justify-center gap-2 bg-[#cb4b16] hover:bg-[#b83e0f] text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>

          <button
            type="button"
            onClick={onBackToMath}
            className="flex-1 w-full h-12 inline-flex items-center justify-center gap-2 bg-white dark:bg-[#24292e] hover:bg-[#eee8d5] dark:hover:bg-[#2d353c] text-[#073642] dark:text-[#eceff1] font-semibold text-sm rounded-xl border border-[#ede5d0] dark:border-[#353c43] transition cursor-pointer"
          >
            <span>Back to Math Sprint</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-xs">
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="inline-flex items-center gap-1 font-semibold text-[#cb4b16] dark:text-[#eb937d] hover:underline cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>View Math History</span>
            </button>
          )}
          <button
            type="button"
            onClick={onBackToHome}
            className="font-semibold text-[#586e75] dark:text-[#94a3b8] hover:underline cursor-pointer"
          >
            Switch Modes
          </button>
        </div>
      </div>
    );
  }

  // 3. Active practice drill
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-fadeIn gap-3">
      {/* Top Header Navigation Bar */}
      <div className="w-full flex items-center justify-between px-2 mb-2">
        <button
          type="button"
          onClick={onBackToMath}
          aria-label="Back to Math Sprint"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-[#24292e]/80 border border-[#ede5d0] dark:border-[#353c43] text-xs font-semibold text-[#586e75] dark:text-[#94a3b8] hover:text-[#073642] dark:hover:text-[#eceff1] cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Drill</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#cb4b16]/10 dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d]">
            Fact {currentIndex + 1} of {troubleProblems.length}
          </span>
          <span className="text-xs text-[#93a1a1] dark:text-[#718093] font-medium hidden sm:inline">
            Untimed Practice
          </span>
        </div>

        {streak > 0 ? (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fdf5e2] dark:bg-[#eed082]/10 border border-[#f0dfb3] dark:border-[#eed082]/30 text-xs font-bold text-[#b58900] dark:text-[#eed082]">
            <Flame className="w-3.5 h-3.5 fill-[#b58900] dark:fill-[#eed082]" />
            <span>{streak}</span>
          </div>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Hero Flashcard */}
      {currentProblem && (
        <Flashcard
          problem={currentProblem}
          streak={streak}
          lastAnswerCorrect={lastAnswerCorrect}
          submissionCount={totalAttempts}
          cardNumber={currentIndex + 1}
        >
          {!isRevealingAnswer && (
            <AnswerInput
              onSubmit={handleSubmit}
              onSkip={handleSkip}
              onEscape={() => setIsComplete(true)}
              externalValue={inputValue}
              onValueChange={setInputValue}
              autoFocus={true}
              disabled={isRevealingAnswer}
            />
          )}
        </Flashcard>
      )}

      {/* Answer reveal card when incorrect / skipped */}
      {isRevealingAnswer && currentProblem && (
        <div className="w-full max-w-md sm:max-w-xl mx-auto p-5 rounded-3xl bg-[#fdf2eb] dark:bg-[#2c2220] border-2 border-[#cb4b16]/30 dark:border-[#eb937d]/40 text-center animate-fadeIn shadow-sm">
          <p className="text-xs text-[#93a1a1] dark:text-[#94a3b8] mb-1 font-bold uppercase tracking-wider">
            Correct Fact
          </p>
          <p className="font-mono text-3xl sm:text-4xl font-black text-[#073642] dark:text-[#eceff1] mb-1">
            {currentProblem.factorA} × {currentProblem.factorB} ={' '}
            <span className="text-[#2aa198] dark:text-[#7ec7b8]">{currentProblem.product}</span>
          </p>
          <p className="text-xs text-[#cb4b16] dark:text-[#eb937d] mb-4">
            You answered: <strong className="font-mono">{lastSubmittedAnswer || 'Skipped'}</strong>
          </p>

          <button
            type="button"
            onClick={handleAdvanceToNext}
            autoFocus
            className="h-12 px-6 inline-flex items-center justify-center gap-2 bg-[#cb4b16] hover:bg-[#b83e0f] text-white font-bold text-sm rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <span>{currentIndex + 1 >= troubleProblems.length ? 'Finish Drill' : 'Next Fact'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="block text-[11px] text-[#93a1a1] dark:text-[#718093] mt-2">
            Press <kbd className="font-mono px-1 py-0.5 rounded bg-white dark:bg-[#181b1e]">Enter</kbd> to continue
          </span>
        </div>
      )}

      {/* Mobile Touch Keypad */}
      {!isRevealingAnswer && (
        <div className="mt-2 w-full sm:hidden">
          <Keypad
            onDigit={handleKeypadDigit}
            onBackspace={handleKeypadBackspace}
            onSubmit={handleKeypadSubmit}
          />
        </div>
      )}

      {/* Footer hint */}
      <div className="w-full max-w-md sm:max-w-xl flex items-center justify-between text-xs text-[#93a1a1] dark:text-[#718093] pt-2 px-1">
        <span>Doesn't affect sprint history records</span>
        <div className="flex items-center gap-2">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#eee8d5] dark:bg-[#181b1e] font-mono text-[10px]">
              Space
            </kbd>{' '}
            Skip
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#eee8d5] dark:bg-[#181b1e] font-mono text-[10px]">
              Esc
            </kbd>{' '}
            Exit
          </span>
        </div>
      </div>
    </div>
  );
};
