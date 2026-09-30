import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpellingHistoryPage } from './SpellingHistoryPage';
import * as spellingStorage from '../engine/spellingStorage';
import * as speechService from '../services/speechSynthesis';

vi.mock('../services/speechSynthesis', () => ({
  speakWord: vi.fn(),
  speakSentence: vi.fn(),
  cancelSpeech: vi.fn(),
  isSpeechSynthesisSupported: vi.fn(() => true),
}));

describe('SpellingHistoryPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders word set overview, trouble words empty state, and navigates back', () => {
    const handleBack = vi.fn();
    render(<SpellingHistoryPage onBack={handleBack} />);

    expect(screen.getByText(/Spelling Word Set History/i)).toBeInTheDocument();
    expect(screen.getAllByText(/September 12, 2026/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/No Missed Words Recorded/i)).toBeInTheDocument();

    const backBtn = screen.getByRole('button', { name: /back to levels/i });
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('displays ranked trouble words and calls speakWord when listening', () => {
    // Save stats with missed words for September 28
    spellingStorage.saveLevelStats({
      levelId: '2026-09-28',
      totalAttempts: 15,
      correctCount: 10,
      bestStreak: 6,
      missedWords: ['unpredictable', 'dictator'],
      wordStats: {
        unpredictable: {
          word: 'unpredictable',
          attempts: 4,
          misses: 3,
        },
        dictator: {
          word: 'dictator',
          attempts: 2,
          misses: 1,
        },
      },
      lastPracticedAt: new Date().toISOString(),
      runs: [
        {
          timestamp: new Date().toISOString(),
          durationSeconds: 90,
          correctCount: 19,
          totalWords: 22,
          bestStreak: 6,
          accuracyPercentage: 86,
          missedWords: ['unpredictable', 'dictator'],
        },
      ],
    });

    render(<SpellingHistoryPage initialLevelId="2026-09-28" onBack={vi.fn()} />);

    // Should display ranked trouble words
    expect(screen.getByText(/Words Gotten Wrong Most/i)).toBeInTheDocument();
    expect(screen.getAllByText(/unpredictable/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/3 misses/i)).toBeInTheDocument();
    expect(screen.getAllByText(/dictator/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/1 miss/i)).toBeInTheDocument();

    // Click listen button for 'unpredictable'
    const listenBtn = screen.getByRole('button', { name: /listen to unpredictable/i });
    fireEvent.click(listenBtn);
    expect(speechService.speakWord).toHaveBeenCalledWith('unpredictable');
  });

  it('switches between word sets when clicking level tabs', () => {
    render(<SpellingHistoryPage onBack={vi.fn()} />);

    // Click 'September 28, 2026' tab
    const sep28Tab = screen.getByRole('button', { name: 'September 28, 2026' });
    fireEvent.click(sep28Tab);

    expect(screen.getByText(/Latin roots \(dict, aud, vis\)/i)).toBeInTheDocument();
    expect(screen.getByText(/22 words/i)).toBeInTheDocument();
  });

  it('supports clearing history for the selected word set', () => {
    spellingStorage.saveLevelStats({
      levelId: '2026-09-12',
      totalAttempts: 10,
      correctCount: 8,
      bestStreak: 4,
      missedWords: ['fruit'],
      lastPracticedAt: new Date().toISOString(),
      runs: [
        {
          timestamp: new Date().toISOString(),
          durationSeconds: 40,
          correctCount: 8,
          totalWords: 10,
          bestStreak: 4,
          accuracyPercentage: 80,
        },
      ],
    });

    render(<SpellingHistoryPage initialLevelId="2026-09-12" onBack={vi.fn()} />);

    const clearBtn = screen.getByRole('button', { name: /clear set history/i });
    fireEvent.click(clearBtn);

    // Confirmation prompt appears
    expect(screen.getByText(/Clear history for this word set\?/i)).toBeInTheDocument();

    const confirmClearBtn = screen.getByRole('button', { name: /yes, clear/i });
    fireEvent.click(confirmClearBtn);

    expect(spellingStorage.loadLevelStats('2026-09-12').totalAttempts).toBe(0);
  });
});
