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

  it('adjusts tooltip transform at left and right edges so it renders within the graph', () => {
    const mockRuns: SprintRunRecord[] = [
      {
        id: 'r1',
        timestamp: '2026-09-08T10:00:00.000Z',
        score: 10,
        totalAttempted: 15,
        accuracyPercentage: 66.7,
        problemsPerMinute: 3.3,
        bestStreak: 4,
        missedCount: 5,
        durationSeconds: 180,
      },
      {
        id: 'r2',
        timestamp: '2026-09-08T11:00:00.000Z',
        score: 20,
        totalAttempted: 22,
        accuracyPercentage: 90.9,
        problemsPerMinute: 6.7,
        bestStreak: 10,
        missedCount: 2,
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

    render(<ScoreTrendChart runs={mockRuns} />);

    // Hover leftmost point (Run 1)
    const point1 = screen.getByRole('button', { name: /run 1: 10 correct/i });
    fireEvent.mouseEnter(point1);

    const tooltip1 = screen.getByTestId('score-trend-tooltip');
    expect(tooltip1).toBeInTheDocument();
    // Left edge point: x=40/600 = 6.67%
    expect(tooltip1.style.left).toMatch(/6\.67%/);
    expect(tooltip1.style.transform).toMatch(/translate\(-6\.67%/);

    // Hover rightmost point (Run 3)
    const point3 = screen.getByRole('button', { name: /run 3: 30 correct/i });
    fireEvent.mouseEnter(point3);

    const tooltip3 = screen.getByTestId('score-trend-tooltip');
    expect(tooltip3.style.left).toMatch(/95/);
    expect(tooltip3.style.transform).toMatch(/translate\(-95/);
  });

  it('renders tooltip below point when near the top edge and above point when near bottom', () => {
    const mockRuns: SprintRunRecord[] = [
      {
        id: 'r1',
        timestamp: '2026-09-08T10:00:00.000Z',
        score: 2,
        totalAttempted: 10,
        accuracyPercentage: 20,
        problemsPerMinute: 1,
        bestStreak: 1,
        missedCount: 8,
        durationSeconds: 180,
      },
      {
        id: 'r2',
        timestamp: '2026-09-08T11:00:00.000Z',
        score: 35,
        totalAttempted: 35,
        accuracyPercentage: 100,
        problemsPerMinute: 11.6,
        bestStreak: 35,
        missedCount: 0,
        durationSeconds: 180,
      },
    ];

    render(<ScoreTrendChart runs={mockRuns} />);

    // High score point (Run 2) is near the top edge -> renders BELOW point to prevent cutoff
    const pointTop = screen.getByRole('button', { name: /run 2: 35 correct/i });
    fireEvent.mouseEnter(pointTop);

    const tooltipTop = screen.getByTestId('score-trend-tooltip');
    expect(tooltipTop.style.marginTop).toBe('12px');
    expect(tooltipTop.style.transform).toContain('0%)');

    // Low score point (Run 1) is near the bottom -> renders ABOVE point
    const pointBottom = screen.getByRole('button', { name: /run 1: 2 correct/i });
    fireEvent.mouseEnter(pointBottom);

    const tooltipBottom = screen.getByTestId('score-trend-tooltip');
    expect(tooltipBottom.style.marginTop).toBe('-12px');
    expect(tooltipBottom.style.transform).toContain('-100%)');
  });

  it('supports tap/click to toggle point inspection on touch devices', () => {
    const mockRuns: SprintRunRecord[] = [
      {
        id: 'r1',
        timestamp: '2026-09-08T10:00:00.000Z',
        score: 15,
        totalAttempted: 20,
        accuracyPercentage: 75,
        problemsPerMinute: 5,
        bestStreak: 5,
        missedCount: 5,
        durationSeconds: 180,
      },
      {
        id: 'r2',
        timestamp: '2026-09-08T11:00:00.000Z',
        score: 25,
        totalAttempted: 25,
        accuracyPercentage: 100,
        problemsPerMinute: 8.3,
        bestStreak: 25,
        missedCount: 0,
        durationSeconds: 180,
      },
    ];

    render(<ScoreTrendChart runs={mockRuns} />);

    const point1 = screen.getByRole('button', { name: /run 1: 15 correct/i });
    // Click to activate
    fireEvent.click(point1);
    expect(screen.getByTestId('score-trend-tooltip')).toBeInTheDocument();

    // Click again to deactivate
    fireEvent.click(point1);
    expect(screen.queryByTestId('score-trend-tooltip')).not.toBeInTheDocument();
  });

  it('does not clip the chart canvas with overflow-hidden', () => {
    const mockRuns: SprintRunRecord[] = [
      {
        id: 'r1',
        timestamp: '2026-09-08T10:00:00.000Z',
        score: 15,
        totalAttempted: 20,
        accuracyPercentage: 75,
        problemsPerMinute: 5,
        bestStreak: 5,
        missedCount: 5,
        durationSeconds: 180,
      },
      {
        id: 'r2',
        timestamp: '2026-09-08T11:00:00.000Z',
        score: 25,
        totalAttempted: 25,
        accuracyPercentage: 100,
        problemsPerMinute: 8.3,
        bestStreak: 25,
        missedCount: 0,
        durationSeconds: 180,
      },
    ];

    const { container } = render(<ScoreTrendChart runs={mockRuns} />);
    const canvasWrapper = container.querySelector('svg')?.parentElement;
    expect(canvasWrapper).not.toHaveClass('overflow-hidden');
  });
});
