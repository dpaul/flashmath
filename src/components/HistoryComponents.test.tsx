import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RunHistoryList } from './RunHistoryList';
import { ClearHistoryModal } from './ClearHistoryModal';
import { SprintRunRecord } from '../engine/types';

describe('RunHistoryList Component', () => {
  it('renders an empty state message when runs list is empty', () => {
    render(<RunHistoryList runs={[]} />);
    expect(screen.getByText(/no sprint history yet/i)).toBeInTheDocument();
    expect(screen.getByText(/complete a 3-minute sprint/i)).toBeInTheDocument();
  });

  it('renders history cards in newest-to-oldest order with stats and Personal Best badge', () => {
    const mockRuns: SprintRunRecord[] = [
      {
        id: 'run-1',
        timestamp: '2026-09-08T10:00:00.000Z',
        score: 18,
        accuracy: 90,
        totalAnswered: 20,
        correctCount: 18,
        missedCount: 2,
        durationSeconds: 180,
      },
      {
        id: 'run-2',
        timestamp: '2026-09-08T11:00:00.000Z',
        score: 35,
        accuracy: 97.2,
        totalAnswered: 36,
        correctCount: 35,
        missedCount: 1,
        durationSeconds: 180,
      },
      {
        id: 'run-3',
        timestamp: '2026-09-08T12:00:00.000Z',
        score: 25,
        accuracy: 92.6,
        totalAnswered: 27,
        correctCount: 25,
        missedCount: 2,
        durationSeconds: 180,
      },
    ];

    render(<RunHistoryList runs={mockRuns} />);

    // Check all runs rendered
    const runCards = screen.getAllByTestId('history-run-card');
    expect(runCards).toHaveLength(3);

    // Newest run (run-3) should be rendered first
    expect(runCards[0]).toHaveTextContent('25 pts');
    // High score run (run-2) should have Personal Best badge
    expect(runCards[1]).toHaveTextContent('35 pts');
    expect(runCards[1]).toHaveTextContent(/personal best/i);
    // Oldest run (run-1) rendered last
    expect(runCards[2]).toHaveTextContent('18 pts');

    // Run cards display accuracy & correct/total stats
    expect(screen.getByText('97.2%')).toBeInTheDocument();
    expect(screen.getByText('35 / 36')).toBeInTheDocument();
  });

  it('triggers onClearRequest callback when clear button is clicked', () => {
    const onClearRequest = vi.fn();
    const mockRuns: SprintRunRecord[] = [
      {
        id: 'run-1',
        timestamp: '2026-09-08T10:00:00.000Z',
        score: 18,
        accuracy: 90,
        totalAnswered: 20,
        correctCount: 18,
        missedCount: 2,
        durationSeconds: 180,
      },
    ];

    render(<RunHistoryList runs={mockRuns} onClearRequest={onClearRequest} />);

    const clearBtn = screen.getByRole('button', { name: /clear sprint history/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    expect(onClearRequest).toHaveBeenCalledTimes(1);
  });
});

describe('ClearHistoryModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <ClearHistoryModal
        isOpen={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal dialog with accessible labels and handles confirm and cancel clicks', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ClearHistoryModal
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText(/clear sprint history/i)).toBeInTheDocument();
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();

    // Click Cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);

    // Click Confirm
    const confirmButton = screen.getByRole('button', { name: /clear all history/i });
    fireEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('handles Escape key press to cancel', () => {
    const onCancel = vi.fn();
    render(
      <ClearHistoryModal
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
