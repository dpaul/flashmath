import React, { useReducer, useState, useCallback } from 'react';
import { initialGameState, gameReducer } from './engine/gameReducer';
import { useSprintTimer } from './engine/useSprintTimer';
import { StartScreen } from './components/StartScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { Flashcard } from './components/Flashcard';
import { AnswerInput } from './components/AnswerInput';
import { Keypad } from './components/Keypad';
import { TimerBar } from './components/TimerBar';
import { X, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [inputValue, setInputValue] = useState('');

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
    dispatch({ type: 'START_GAME' });
  };

  const handleSubmit = (answer: string) => {
    if (!answer) return;
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer } });
    setInputValue('');
  };

  const handleRestart = () => {
    setInputValue('');
    dispatch({ type: 'RESET_GAME' });
  };

  const handleAbort = () => {
    dispatch({ type: 'END_GAME' });
  };

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white antialiased">
      {/* Top Header */}
      <header className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-600/30">
            F
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Flash<span className="text-indigo-400">Math</span>
          </span>
        </div>

        {state.phase === 'running' ? (
          <button
            type="button"
            onClick={handleAbort}
            aria-label="End Sprint"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition border border-slate-700/50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Finish Early</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tables 2–12</span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-2xl mx-auto">
        {state.phase === 'idle' && (
          <StartScreen personalBests={state.personalBests} onStart={handleStart} />
        )}

        {state.phase === 'running' && state.currentProblem && (
          <div className="w-full flex flex-col items-center animate-fadeIn">
            <TimerBar timeRemaining={state.timeRemaining} />

            <Flashcard
              problem={state.currentProblem}
              streak={state.stats.streak}
              lastAnswerCorrect={state.lastAnswerCorrect}
            />

            <AnswerInput
              onSubmit={handleSubmit}
              externalValue={inputValue}
              onValueChange={setInputValue}
              autoFocus={true}
            />

            {/* Mobile / Touch Keypad */}
            <div className="mt-6 w-full sm:hidden">
              <Keypad
                onDigit={handleKeypadDigit}
                onBackspace={handleKeypadBackspace}
                onSubmit={handleKeypadSubmit}
              />
            </div>
          </div>
        )}

        {state.phase === 'completed' && (
          <ResultsScreen
            stats={state.stats}
            personalBests={state.personalBests}
            isNewHighScore={state.isNewHighScore}
            isNewBestStreak={state.isNewBestStreak}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-600 border-t border-slate-900 select-none">
        FlashMath &bull; 3-Minute Multiplication Challenge
      </footer>
    </div>
  );
};

export default App;
