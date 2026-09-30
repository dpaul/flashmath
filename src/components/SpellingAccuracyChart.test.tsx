import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SpellingAccuracyChart } from './SpellingAccuracyChart';
import { SpellingRunRecord } from '../engine/spellingStorage';

describe('SpellingAccuracyChart Component', () => {
  it('renders a friendly placeholder message when fewer than 2 runs are completed', () => {
    const runs: SpellingRunRecord[] = [
      {
        timestamp: '2026-09-29T10:00:00.000Z',
        durationSeconds: 40,
        correctCount: 9,
        totalWords: 10,
        bestStreak: 6,
        accuracyPercentage: 90,
      },
    ];

    render(<SpellingAccuracyChart runs={runs} />);
    expect(screen.getByText(/Accuracy Progression Trend/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete at least 2 practice sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/90% correct/i)).toBeInTheDocument();
  });

  it('renders SVG graph with average pill when 2 or more runs are provided', () => {
    const runs: SpellingRunRecord[] = [
      {
        timestamp: '2026-09-29T10:00:00.000Z',
        durationSeconds: 50,
        correctCount: 8,
        totalWords: 10,
        bestStreak: 4,
        accuracyPercentage: 80,
      },
      {
        timestamp: '2026-09-29T11:00:00.000Z',
        durationSeconds: 40,
        correctCount: 10,
        totalWords: 10,
        bestStreak: 10,
        accuracyPercentage: 100,
      },
    ];

    render(<SpellingAccuracyChart runs={runs} />);
    expect(screen.getByText(/% Correct Over Time/i)).toBeInTheDocument();
    expect(screen.getByText(/2 completed sessions/i)).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument(); // (80 + 100) / 2 = 90%
    expect(screen.getByRole('img', { name: /spelling accuracy trend graph over time/i })).toBeInTheDocument();
  });
});
