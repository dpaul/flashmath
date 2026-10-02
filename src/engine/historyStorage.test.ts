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

    expect(record).not.toBeNull();
    expect(record!.id).toBeTruthy();
    expect(record!.timestamp).toBeTruthy();
    expect(record!.score).toBe(25);

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

  it('deduplicates recording when given identical run id or rapid duplicate invocations', () => {
    const runData = {
      id: 'sprint-12345',
      score: 30,
      totalAttempted: 32,
      accuracyPercentage: 93.8,
      problemsPerMinute: 10,
      bestStreak: 12,
      missedCount: 2,
      durationSeconds: 180,
    };

    // First call records
    const record1 = recordSprintRun(runData);
    expect(record1).not.toBeNull();
    expect(loadRunHistory().length).toBe(1);

    // Second call with same id returns existing without appending
    const record2 = recordSprintRun(runData);
    expect(record2).not.toBeNull();
    expect(record2!.id).toBe(record1!.id);
    expect(loadRunHistory().length).toBe(1);

    // Third call without explicit id but identical data within 3 seconds
    const record3 = recordSprintRun({
      score: 30,
      totalAttempted: 32,
      accuracyPercentage: 93.8,
      problemsPerMinute: 10,
      bestStreak: 12,
      missedCount: 2,
      durationSeconds: 180,
    });
    expect(record3).not.toBeNull();
    expect(record3!.id).toBe(record1!.id);
    expect(loadRunHistory().length).toBe(1);
  });

  it('rejects recording 0/0 scores from sprint history', () => {
    const result = recordSprintRun({
      score: 0,
      totalAttempted: 0,
      accuracyPercentage: 0,
      problemsPerMinute: 0,
      bestStreak: 0,
      missedCount: 0,
      durationSeconds: 180,
    });

    expect(result).toBeNull();
    expect(loadRunHistory()).toHaveLength(0);
  });

  it('filters out legacy 0/0 runs when loading run history', () => {
    const legacyRuns = [
      {
        id: 'run-valid',
        timestamp: new Date().toISOString(),
        score: 15,
        totalAttempted: 16,
        accuracyPercentage: 93.8,
        problemsPerMinute: 5,
        bestStreak: 8,
        missedCount: 1,
        durationSeconds: 180,
      },
      {
        id: 'run-zero-zero',
        timestamp: new Date().toISOString(),
        score: 0,
        totalAttempted: 0,
        accuracyPercentage: 0,
        problemsPerMinute: 0,
        bestStreak: 0,
        missedCount: 0,
        durationSeconds: 180,
      },
      {
        id: 'run-zero-score-with-attempts',
        timestamp: new Date().toISOString(),
        score: 0,
        totalAttempted: 3,
        accuracyPercentage: 0,
        problemsPerMinute: 0,
        bestStreak: 0,
        missedCount: 3,
        durationSeconds: 180,
      },
    ];

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(legacyRuns));
    const loaded = loadRunHistory();

    expect(loaded).toHaveLength(2);
    expect(loaded.map((r) => r.id)).toEqual(['run-valid', 'run-zero-score-with-attempts']);
    expect(loaded.some((r) => r.id === 'run-zero-zero')).toBe(false);
  });
});
