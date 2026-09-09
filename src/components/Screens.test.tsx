import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StartScreen } from './StartScreen';
import { ResultsScreen } from './ResultsScreen';
import { GameStats, PersonalBests } from '../engine/types';

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
    render(
      <ResultsScreen
        stats={stats}
        personalBests={bests}
        isNewHighScore={true}
        isNewBestStreak={true}
        onRestart={onRestart}
      />
    );

    expect(screen.getByText('28')).toBeInTheDocument(); // correct count
    expect(screen.getByText('93.3%')).toBeInTheDocument(); // accuracy
    expect(screen.getByText(/New Personal Best/i)).toBeInTheDocument();
    expect(screen.getByText('7 × 8')).toBeInTheDocument();
    expect(screen.getByText('54')).toBeInTheDocument();
    expect(screen.getByText('56')).toBeInTheDocument();

    const restartBtn = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(restartBtn);
    expect(onRestart).toHaveBeenCalled();
  });
});
