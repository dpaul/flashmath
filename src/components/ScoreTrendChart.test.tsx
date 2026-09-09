import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScoreTrendChart } from './ScoreTrendChart';
import { SprintRunRecord } from '../engine/historyStorage';

describe('ScoreTrendChart Component', () => {
  it('renders encouraging empty state message when fewer than 2 runs exist', () => {
    const { rerender } = render(<ScoreTrendChart runs={[]} />);
    expect(screen.getByText(/complete at least 2 challenges/i)).toBeInTheDocument();

    const singleRun: SprintRunRecord[] = [
      {
        id: 'r1',
        timestamp: '2026-09-08T12:00:00.000Z',
        score: 20,
        totalAttempted: 22,
        accuracyPercentage: 90.9,
        problemsPerMinute: 6.7,
        bestStreak: 8,
        missedCount: 2,
        durationSeconds: 180,
      },
    ];

    rerender(<ScoreTrendChart runs={singleRun} />);
    expect(screen.getByText(/complete at least 2 challenges/i)).toBeInTheDocument();
  });

  it('renders SVG chart with points, lines, and average benchmark when 2 or more runs exist', () => {
    const mockRuns: SprintRunRecord[] = [
      {
        id: 'r1',
        timestamp: '2026-09-08T10:00:00.000Z',
        score: 15,
        totalAttempted: 20,
        accuracyPercentage: 75,
        problemsPerMinute: 5,
        bestStreak: 6,
        missedCount: 5,
        durationSeconds: 180,
      },
      {
        id: 'r2',
        timestamp: '2026-09-08T11:00:00.000Z',
        score: 25,
        totalAttempted: 26,
        accuracyPercentage: 96.2,
        problemsPerMinute: 8.3,
        bestStreak: 12,
        missedCount: 1,
        durationSeconds: 180,
      },
      {
        id: 'r3',
        timestamp: '2026-09-08T12:00:00.000Z',
        score: 30,
        totalAttempted: 30,
        accuracyPercentage: 100,
        problemsPerMinute: 10,
        bestStreak: 30,
        missedCount: 0,
        durationSeconds: 180,
      },
    ];

    const { container } = render(<ScoreTrendChart runs={mockRuns} />);

    // SVG rendered
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Data points
    const points = screen.getAllByRole('button', { name: /run \d+:/i });
    expect(points.length).toBe(3);

    // Shows average label
    expect(screen.getByText(/avg/i)).toBeInTheDocument();
  });

  it('displays tooltip with run details when hovering or focusing a data point', () => {
    const mockRuns: SprintRunRecord[] = [
      {
        id: 'r1',
        timestamp: '2026-09-08T10:00:00.000Z',
        score: 18,
        totalAttempted: 20,
        accuracyPercentage: 90,
        problemsPerMinute: 6,
        bestStreak: 10,
        missedCount: 2,
        durationSeconds: 180,
      },
      {
        id: 'r2',
        timestamp: '2026-09-08T11:00:00.000Z',
        score: 28,
        totalAttempted: 30,
        accuracyPercentage: 93.3,
        problemsPerMinute: 9.3,
        bestStreak: 15,
        missedCount: 2,
        durationSeconds: 180,
      },
    ];

    render(<ScoreTrendChart runs={mockRuns} />);

    const point2 = screen.getByRole('button', { name: /run 2: 28 correct/i });
    fireEvent.mouseEnter(point2);

    expect(screen.getByText('28 solved')).toBeInTheDocument();
    expect(screen.getByText(/93.3% accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/9.3 PPM/i)).toBeInTheDocument();
  });
});
