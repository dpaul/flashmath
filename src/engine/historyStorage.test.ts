import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadRunHistory,
  recordSprintRun,
  clearRunHistory,
  HISTORY_STORAGE_KEY,
  MAX_HISTORY_ENTRIES,
} from './historyStorage';

describe('History Storage Module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty array when history storage is empty or invalid', () => {
    expect(loadRunHistory()).toEqual([]);

    localStorage.setItem(HISTORY_STORAGE_KEY, 'invalid-json');
    expect(loadRunHistory()).toEqual([]);
  });

  it('records a new sprint run with generated id and ISO timestamp', () => {
    const record = recordSprintRun({
      score: 25,
      totalAttempted: 28,
      accuracyPercentage: 89.3,
      problemsPerMinute: 8.3,
      bestStreak: 11,
      missedCount: 3,
      durationSeconds: 180,
    });

    expect(record.id).toBeTruthy();
    expect(record.timestamp).toBeTruthy();
    expect(record.score).toBe(25);

    const loaded = loadRunHistory();
    expect(loaded.length).toBe(1);
    expect(loaded[0].score).toBe(25);
  });

  it('enforces 100-run FIFO cap when recording runs', () => {
    for (let i = 1; i <= MAX_HISTORY_ENTRIES + 10; i++) {
      recordSprintRun({
        score: i,
        totalAttempted: i,
        accuracyPercentage: 100,
        problemsPerMinute: i / 3,
        bestStreak: i,
        missedCount: 0,
        durationSeconds: 180,
      });
    }

    const loaded = loadRunHistory();
    expect(loaded.length).toBe(MAX_HISTORY_ENTRIES);
    // Oldest (1 through 10) pruned, earliest remaining is 11
    expect(loaded[0].score).toBe(11);
    // Newest is 110
    expect(loaded[loaded.length - 1].score).toBe(110);
  });

  it('purges all stored runs when clearRunHistory is called', () => {
    recordSprintRun({
      score: 20,
      totalAttempted: 20,
      accuracyPercentage: 100,
      problemsPerMinute: 6.7,
      bestStreak: 20,
      missedCount: 0,
      durationSeconds: 180,
    });
    expect(loadRunHistory().length).toBe(1);

    clearRunHistory();
    expect(loadRunHistory()).toEqual([]);
  });
});
