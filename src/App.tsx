import React, { useReducer, useState, useCallback, useEffect } from 'react';
import { initialGameState, gameReducer } from './engine/gameReducer';
import { useSprintTimer } from './engine/useSprintTimer';
import { evaluateAnswer } from './engine/math';
import { StartScreen } from './components/StartScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { Flashcard } from './components/Flashcard';
import { AnswerInput } from './components/AnswerInput';
import { Keypad } from './components/Keypad';
import { TimerBar } from './components/TimerBar';
import { HistoryPage } from './components/HistoryPage';
import { RecentProblemStream, SolvedProblemRecord } from './components/RecentProblemStream';
import { ModeSelector } from './components/ModeSelector';
import { MathPracticeView } from './components/MathPracticeView';
import { SpellingLevelSelect } from './components/SpellingLevelSelect';
import { SpellingPracticeView } from './components/SpellingPracticeView';
import { SpellingHistoryPage } from './components/SpellingHistoryPage';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { X, TrendingUp, Flame, LayoutGrid } from 'lucide-react';

export type ActiveAppView =
  | 'mode-select'
  | 'math'
  | 'math-practice'
  | 'history'
  | 'spelling-levels'
  | 'spelling-practice'
  | 'spelling-history';

export const AppContent: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [inputValue, setInputValue] = useState('');
  const [activeView, setActiveView] = useState<ActiveAppView>('mode-select');
  const [selectedSpellingLevelId, setSelectedSpellingLevelId] = useState<string>('2026-09-12');
  const [recentProblems, setRecentProblems] = useState<SolvedProblemRecord[]>([]);

  // Stable tick callback
  const handleTick = useCallback(() => {
    dispatch({ type: 'TICK' });
  }, []);

  // Timer loop
  useSprintTimer({
    isRunning: state.phase === 'running',
    onTick: handleTick,
  });

  const handleStart = () => {
    setInputValue('');
    setRecentProblems([]);
    setActiveView('math');
    dispatch({ type: 'START_GAME' });
  };

  const handleSubmit = (answer: string) => {
    if (!answer) return;

    if (state.currentProblem) {
      const isCorrect = evaluateAnswer(state.currentProblem, answer);
      const pointsEarned = isCorrect ? 70 : undefined;
      setRecentProblems((prev) => [
        ...prev,
        {
          id: `rec-${Date.now()}-${prev.length}`,
          problemText: `${state.currentProblem!.factorA} × ${state.currentProblem!.factorB}`,
          answer: state.currentProblem!.product,
          isCorrect,
          pointsEarned,
        },
      ]);
    }

    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer } });
    setInputValue('');
  };

  const handleRestart = () => {
    setInputValue('');
    setRecentProblems([]);
    setActiveView('math');
    dispatch({ type: 'RESET_GAME' });
  };

  const handleAbort = useCallback(() => {
    dispatch({ type: 'END_GAME' });
  }, []);

  const handleSkip = useCallback(() => {
    if (state.phase !== 'running' || !state.currentProblem) return;

    setRecentProblems((prev) => [
      ...prev,
      {
        id: `rec-${Date.now()}-${prev.length}`,
        problemText: `${state.currentProblem!.factorA} × ${state.currentProblem!.factorB}`,
        answer: state.currentProblem!.product,
        isCorrect: false,
      },
    ]);

    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer: '' } });
    setInputValue('');
  }, [state.phase, state.currentProblem]);

  // Global Space (skip) and Escape (finish) shortcut listeners while sprinting
  useEffect(() => {
    if (state.phase !== 'running' || activeView !== 'math') return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleAbort();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [state.phase, activeView, handleSkip, handleAbort]);

  // Keypad actions
  const handleKeypadDigit = (digit: string) => {
    setInputValue((prev) => prev + digit);
  };

  const handleKeypadBackspace = () => {
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleKeypadSubmit = () => {
    handleSubmit(inputValue);
  };

  const elapsedSeconds = 180 - state.timeRemaining;
  const paceSeconds =
    state.stats.totalAttempted > 0 && elapsedSeconds > 0
      ? (elapsedSeconds / state.stats.totalAttempted).toFixed(1)
      : '—';

  return (
    <div className="min-h-screen bg-[#fcf9f2] dark:bg-[#1a1d20] text-[#073642] dark:text-[#eceff1] flex flex-col justify-between selection:bg-amber-100 selection:text-[#cb4b16] dark:selection:bg-[#eed082]/25 dark:selection:text-[#eed082] antialiased relative overflow-x-hidden font-sans transition-colors duration-200">
      {/* Subtle Background Decor - Warm glows in light mode, fine matte texture in dark mode */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-24 -left-20 w-96 h-96 rounded-full dark:hidden opacity-30"
          style={{ background: 'radial-gradient(circle, #faecd0 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-24 w-[32rem] h-[32rem] rounded-full dark:hidden opacity-30"
          style={{ background: 'radial-gradient(circle, #e3f4f1 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 left-1/4 w-[28rem] h-[28rem] rounded-full dark:hidden opacity-30"
          style={{ background: 'radial-gradient(circle, #ffeedd 0%, transparent 70%)' }}
        />

        {/* Subtle mineral chalkboard texture overlay in dark mode */}
        <div className="hidden dark:block absolute inset-0 chalkboard-texture opacity-30 pointer-events-none" />
      </div>

      {/* Top Header */}
      <header className="w-full relative z-30 bg-[#fcf9f2] dark:bg-[#1a1d20] border-b border-[#e4d9c7]/70 dark:border-[#353c43] py-3.5 px-6 transition-colors duration-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveView('mode-select')}
            aria-label="FlashMath Home"
            className="flex items-center gap-2.5 cursor-pointer bg-transparent border-none text-left p-0"
          >
            <span className="w-8 h-8 rounded-xl bg-[#fbf3db] dark:bg-[#eed082]/15 border border-[#f0dfb3] dark:border-[#eed082]/30 flex items-center justify-center text-[#cb4b16] dark:text-[#eed082] shadow-sm font-black text-base">
              ⚡
            </span>
            <span className="font-extrabold text-xl tracking-tight text-[#073642] dark:text-[#eceff1]">
              Flash<span className="text-[#cb4b16] dark:text-[#eb937d]">Math</span>
            </span>
          </button>

          {/* Minimal Sprint Stage Pill or Mode Indicator */}
          {activeView === 'math' && state.phase === 'running' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece1] dark:bg-[#24292e] border border-[#e4d9c7] dark:border-[#353c43] text-[#073642] dark:text-[#eceff1] font-mono text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#cb4b16] dark:bg-[#eb937d] animate-ping" />
              <span>×1–12 Sprint</span>
            </div>
          )}

          {activeView === 'math' && state.phase === 'running' ? (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={handleAbort}
                aria-label="End Sprint"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#f4ece1] dark:bg-[#24292e] hover:bg-[#ebdccb] dark:hover:bg-[#2d353c] text-[#586e75] dark:text-[#94a3b8] hover:text-[#073642] dark:hover:text-[#eceff1] text-xs font-semibold transition border border-[#e4d9c7] dark:border-[#353c43] cursor-pointer shadow-sm active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                <span>Finish Early</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {activeView !== 'mode-select' && (
                <button
                  type="button"
                  onClick={() => setActiveView('mode-select')}
                  aria-label="Switch Modes"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eee8d5] dark:bg-[#24292e] hover:bg-[#e4d9c7] dark:hover:bg-[#2d353c] text-[#073642] dark:text-[#eceff1] text-xs font-semibold transition border border-[#e4d9c7] dark:border-[#353c43] cursor-pointer shadow-sm"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-[#586e75] dark:text-[#94a3b8]" />
                  <span>Modes</span>
                </button>
              )}

              {state.personalBests.highScore > 0 && activeView === 'math' && (
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fdf2eb] dark:bg-[#eb937d]/15 text-[#cb4b16] dark:text-[#eb937d] text-xs font-semibold border border-[#fbdcd0] dark:border-[#eb937d]/30">
                  <span>🏆 Best: {state.personalBests.highScore}</span>
                </div>
              )}

              {activeView === 'math-practice' ? (
                <button
                  type="button"
                  onClick={() => setActiveView('math')}
                  aria-label="Back to Sprint"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eee8d5] dark:bg-[#24292e] hover:bg-[#e4d9c7] dark:hover:bg-[#2d353c] text-[#073642] dark:text-[#eceff1] text-xs font-semibold transition border border-[#e4d9c7] dark:border-[#353c43] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/30"
                >
                  <span>Back to Sprint</span>
                </button>
              ) : activeView === 'history' ? (
                <button
                  type="button"
                  onClick={() => setActiveView('math')}
                  aria-label="Back to Sprint"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eee8d5] dark:bg-[#24292e] hover:bg-[#e4d9c7] dark:hover:bg-[#2d353c] text-[#073642] dark:text-[#eceff1] text-xs font-semibold transition border border-[#e4d9c7] dark:border-[#353c43] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/30"
                >
                  <span>Back to Sprint</span>
                </button>
              ) : activeView === 'spelling-history' ? (
                <button
                  type="button"
                  onClick={() => setActiveView('spelling-levels')}
                  aria-label="Back to Levels"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eee8d5] dark:bg-[#24292e] hover:bg-[#e4d9c7] dark:hover:bg-[#2d353c] text-[#073642] dark:text-[#eceff1] text-xs font-semibold transition border border-[#e4d9c7] dark:border-[#353c43] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2aa198]/30"
                >
                  <span>Back to Levels</span>
                </button>
              ) : activeView === 'math' ? (
                <button
                  type="button"
                  onClick={() => setActiveView('history')}
                  aria-label="View History"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eee8d5] dark:bg-[#24292e] hover:bg-[#e4d9c7] dark:hover:bg-[#2d353c] text-[#073642] dark:text-[#eceff1] text-xs font-semibold transition border border-[#e4d9c7] dark:border-[#353c43] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#cb4b16]/30 shadow-sm"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#cb4b16] dark:text-[#eb937d]" />
                  <span>History</span>
                </button>
              ) : activeView === 'spelling-levels' || activeView === 'spelling-practice' ? (
                <button
                  type="button"
                  onClick={() => setActiveView('spelling-history')}
                  aria-label="View Spelling History"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eee8d5] dark:bg-[#24292e] hover:bg-[#e4d9c7] dark:hover:bg-[#2d353c] text-[#073642] dark:text-[#eceff1] text-xs font-semibold transition border border-[#e4d9c7] dark:border-[#353c43] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2aa198]/30 shadow-sm"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#2aa198] dark:text-[#7ec7b8]" />
                  <span>Spelling History</span>
                </button>
              ) : null}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-3xl mx-auto relative z-10">
        {activeView === 'mode-select' && (
          <ModeSelector
            onSelectMode={(mode) => {
              if (mode === 'math') {
                setActiveView('math');
              } else {
                setActiveView('spelling-levels');
              }
            }}
            mathHighScore={state.personalBests.highScore}
            mathBestStreak={state.personalBests.bestStreak}
          />
        )}

        {activeView === 'spelling-levels' && (
          <SpellingLevelSelect
            onSelectLevel={(levelId) => {
              setSelectedSpellingLevelId(levelId);
              setActiveView('spelling-practice');
            }}
            onBackToHome={() => setActiveView('mode-select')}
            onOpenHistory={(levelId) => {
              if (levelId) setSelectedSpellingLevelId(levelId);
              setActiveView('spelling-history');
            }}
          />
        )}

        {activeView === 'spelling-practice' && (
          <SpellingPracticeView
            levelId={selectedSpellingLevelId}
            onBackToLevels={() => setActiveView('spelling-levels')}
            onBackToHome={() => setActiveView('mode-select')}
            onOpenHistory={(levelId) => {
              setSelectedSpellingLevelId(levelId);
              setActiveView('spelling-history');
            }}
          />
        )}

        {activeView === 'spelling-history' && (
          <SpellingHistoryPage
            initialLevelId={selectedSpellingLevelId}
            onBack={() => setActiveView('spelling-levels')}
            onPracticeLevel={(levelId) => {
              setSelectedSpellingLevelId(levelId);
              setActiveView('spelling-practice');
            }}
          />
        )}

        {activeView === 'history' && (
          <HistoryPage
            onBack={() => setActiveView('math')}
            onPracticeMissed={() => setActiveView('math-practice')}
          />
        )}

        {activeView === 'math-practice' && (
          <MathPracticeView
            onBackToMath={() => setActiveView('math')}
            onBackToHome={() => setActiveView('mode-select')}
            onOpenHistory={() => setActiveView('history')}
          />
        )}

        {activeView === 'math' && (
          <>
            {state.phase === 'idle' && (
              <StartScreen
                personalBests={state.personalBests}
                onStart={handleStart}
                onPracticeMissed={() => setActiveView('math-practice')}
              />
            )}

            {state.phase === 'running' && state.currentProblem && (
              <div className="w-full flex flex-col items-center animate-fadeIn gap-3">
                {/* 2. Minimalist Timer & Momentum Pill */}
                <section className="w-full flex items-center justify-between px-2 max-w-md sm:max-w-xl">
                  {/* Minimalist Sprint Clock & Subtle Bar */}
                  <TimerBar timeRemaining={state.timeRemaining} />

                  {/* Score & Streak Pill */}
                  <div className="flex items-center gap-3">
                    {state.stats.streak > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf5e2] dark:bg-[#eed082]/10 border border-[#f0dfb3] dark:border-[#eed082]/30 rounded-full text-[#b58900] dark:text-[#eed082] shadow-sm">
                        <Flame className="w-3.5 h-3.5 text-[#b58900] dark:text-[#eed082] fill-[#b58900] dark:fill-[#eed082]" />
                        <span className="text-xs font-bold">{state.stats.streak} streak</span>
                        {state.stats.streak >= 5 && (
                          <span className="text-[10px] font-mono font-semibold bg-[#b58900]/10 dark:bg-[#eed082]/20 text-[#b58900] dark:text-[#eed082] px-1.5 py-0.5 rounded-full">
                            2×
                          </span>
                        )}
                      </div>
                    )}
                    <div className="font-mono text-xl font-bold text-[#073642] dark:text-[#eceff1]">
                      {state.stats.correctCount * 70}{' '}
                      <span className="text-xs font-sans font-medium text-[#586e75] dark:text-[#94a3b8]">pts</span>
                    </div>
                  </div>
                </section>

                {/* 3. Upward-scrolling completed problem stream */}
                <RecentProblemStream recentProblems={recentProblems} />

                {/* 4. Hero Flashcard Arena */}
                <Flashcard
                  problem={state.currentProblem}
                  streak={state.stats.streak}
                  lastAnswerCorrect={state.lastAnswerCorrect}
                  submissionCount={state.stats.totalAttempted}
                  cardNumber={state.stats.totalAttempted + 1}
                >
                  <AnswerInput
                    onSubmit={handleSubmit}
                    onSkip={handleSkip}
                    onEscape={handleAbort}
                    externalValue={inputValue}
                    onValueChange={setInputValue}
                    autoFocus={true}
                  />
                </Flashcard>

                {/* 5. Mobile / Touch Keypad */}
                <div className="mt-2 w-full sm:hidden">
                  <Keypad
                    onDigit={handleKeypadDigit}
                    onBackspace={handleKeypadBackspace}
                    onSubmit={handleKeypadSubmit}
                  />
                </div>

                {/* 6. Zen Real-Time Footer Metrics */}
                <footer className="w-full max-w-md sm:max-w-xl flex items-center justify-between pt-4 pb-1 text-xs text-[#586e75] dark:text-[#94a3b8] border-t border-[#e4d9c7]/70 dark:border-[#353c43] mt-4 select-none">
                  <div className="flex items-center gap-4 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#93a1a1] dark:text-[#718093]">Accuracy</span>
                      <span className="font-mono font-bold text-[#073642] dark:text-[#eceff1]">
                        {state.stats.totalAttempted > 0 ? `${state.stats.accuracyPercentage}%` : '100%'}
                      </span>
                    </div>
                    <span className="text-[#e4d9c7] dark:text-[#353c43]">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#93a1a1] dark:text-[#718093]">Pace</span>
                      <span className="font-mono font-bold text-[#2aa198] dark:text-[#7ec7b8]">
                        {paceSeconds !== '—' ? `${paceSeconds}s` : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#93a1a1] dark:text-[#718093]">
                      <kbd className="px-1.5 py-0.5 rounded bg-[#eee8d5] dark:bg-[#181b1e] font-mono font-semibold text-[10px] text-[#073642] dark:text-[#eceff1] border border-[#e4d9c7] dark:border-[#353c43]">
                        Space
                      </kbd>{' '}
                      Skip
                    </span>
                    <span className="text-[11px] text-[#93a1a1] dark:text-[#718093]">
                      <kbd className="px-1.5 py-0.5 rounded bg-[#eee8d5] dark:bg-[#181b1e] font-mono font-semibold text-[10px] text-[#073642] dark:text-[#eceff1] border border-[#e4d9c7] dark:border-[#353c43]">
                        Esc
                      </kbd>{' '}
                      Finish
                    </span>
                  </div>
                </footer>
              </div>
            )}

            {state.phase === 'completed' && (
              <ResultsScreen
                stats={state.stats}
                personalBests={state.personalBests}
                isNewHighScore={state.isNewHighScore}
                isNewBestStreak={state.isNewBestStreak}
                onRestart={handleRestart}
                onViewHistory={() => setActiveView('history')}
                onPracticeMissed={() => setActiveView('math-practice')}
              />
            )}
          </>
        )}
      </main>

      {/* Global Bottom Footer */}
      <footer className="w-full py-3 text-center text-xs text-[#93a1a1] dark:text-[#718093] border-t border-[#e4d9c7]/60 dark:border-[#353c43] select-none relative z-20">
        FlashMath &bull; Mental Math Sprint & Spelling Practice
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
