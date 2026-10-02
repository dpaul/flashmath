import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StartScreen } from './StartScreen';
import { ResultsScreen } from './ResultsScreen';
import { GameStats, PersonalBests } from '../engine/types';
import * as mathMistakesStorage from '../engine/mathMistakesStorage';

describe('StartScreen Component', () => {
  const bests: PersonalBests = {
    highScore: 35,
    bestStreak: 12,
    totalGamesPlayed: 5,
  };

  it('renders start screen and personal bests', () => {
    const onStart = vi.fn();
    render(<StartScreen personalBests={bests} onStart={onStart} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/FlashMath/i);
    expect(screen.getByText(/3-Minute Challenge/i)).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('problems solved')).toBeInTheDocument();
  });

  it('calls onStart when start button is clicked', () => {
    const onStart = vi.fn();
    render(<StartScreen personalBests={bests} onStart={onStart} />);

    const startBtn = screen.getByRole('button', { name: /start challenge/i });
    fireEvent.click(startBtn);
    expect(onStart).toHaveBeenCalled();
  });

  it('renders Most Missed Facts card with 0 trouble problems when none qualify', () => {
    localStorage.clear();
    render(<StartScreen personalBests={bests} onStart={vi.fn()} onPracticeMissed={vi.fn()} />);

    expect(screen.getByText('Most Missed Facts')).toBeInTheDocument();
    expect(screen.getByText(/0 trouble problems/i)).toBeInTheDocument();
    expect(screen.getByText(/No repeated misses/i)).toBeInTheDocument();

    const practiceBtn = screen.getByRole('button', {
      name: /practice most missed multiplication problems/i,
    });
    expect(practiceBtn).toBeDisabled();
  });

  it('renders active Most Missed Facts card showing count (without giving away facts) for facts missed more than once', () => {
    localStorage.clear();
    // 7x8 missed twice (qualifies)
    mathMistakesStorage.recordMathProblemAttempt(7, 8, false);
    mathMistakesStorage.recordMathProblemAttempt(7, 8, false);
    // 3x4 missed only once (does NOT qualify)
    mathMistakesStorage.recordMathProblemAttempt(3, 4, false);

    const onPracticeMissed = vi.fn();
    render(
      <StartScreen
        personalBests={bests}
        onStart={vi.fn()}
        onPracticeMissed={onPracticeMissed}
      />
    );

    expect(screen.getByText(/1 trouble problem/i)).toBeInTheDocument();
    // Crucial: Fact answers and equations must NOT be written down on the start screen
    expect(screen.queryByText('7 × 8')).not.toBeInTheDocument();
    expect(screen.queryByText('56')).not.toBeInTheDocument();

    const practiceBtn = screen.getByRole('button', {
      name: /practice most missed multiplication problems/i,
    });
    expect(practiceBtn).not.toBeDisabled();

    fireEvent.click(practiceBtn);
    expect(onPracticeMissed).toHaveBeenCalledTimes(1);
  });
});

describe('ResultsScreen Component', () => {
  const stats: GameStats = {
    correctCount: 28,
    incorrectCount: 2,
    totalAttempted: 30,
    streak: 0,
    bestStreak: 14,
    accuracyPercentage: 93.3,
    problemsPerMinute: 9.3,
    missedProblems: [
      {
        problem: { id: 'm1', factorA: 7, factorB: 8, product: 56 },
        submittedAnswer: '54',
        correctAnswer: 56,
      },
    ],
  };

  const bests: PersonalBests = {
    highScore: 40,
    bestStreak: 20,
    totalGamesPlayed: 1,
  };

  it('renders score metrics, missed problems, and restart button', () => {
    const onRestart = vi.fn();
    const onPracticeMissed = vi.fn();
    render(
      <ResultsScreen
        stats={stats}
        personalBests={bests}
        isNewHighScore={true}
        isNewBestStreak={true}
        onRestart={onRestart}
        onViewHistory={vi.fn()}
        onPracticeMissed={onPracticeMissed}
      />
    );

    expect(screen.getByText('28')).toBeInTheDocument(); // correct count
    expect(screen.getByText('93.3%')).toBeInTheDocument(); // accuracy
    expect(screen.getByText(/New Personal Best/i)).toBeInTheDocument();
    expect(screen.getByText('7 × 8')).toBeInTheDocument();
    expect(screen.getByText('54')).toBeInTheDocument();
    expect(screen.getByText('56')).toBeInTheDocument();

    const practiceTroubleBtn = screen.getByRole('button', { name: /practice trouble facts/i });
    expect(practiceTroubleBtn).toBeInTheDocument();
    fireEvent.click(practiceTroubleBtn);
    expect(onPracticeMissed).toHaveBeenCalledTimes(1);

    const restartBtn = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(restartBtn);
    expect(onRestart).toHaveBeenCalled();
  });
});
