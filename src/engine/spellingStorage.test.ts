import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadLevelStats,
  saveLevelStats,
  updateLevelStatsFromSession,
  clearLevelStats,
  clearAllSpellingStats,
  getAllSpellingStats,
} from './spellingStorage';

describe('Spelling History Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default stats for an unplayed level', () => {
    const stats = loadLevelStats('grade-4');
    expect(stats.levelId).toBe('grade-4');
    expect(stats.totalAttempts).toBe(0);
    expect(stats.correctCount).toBe(0);
    expect(stats.bestStreak).toBe(0);
    expect(stats.missedWords).toEqual([]);
  });

  it('saves and loads stats for a specific level', () => {
    saveLevelStats({
      levelId: 'grade-4',
      totalAttempts: 15,
      correctCount: 12,
      bestStreak: 7,
      missedWords: ['grammar', 'calendar'],
      lastPracticedAt: '2026-09-12T16:00:00.000Z',
    });

    const stats = loadLevelStats('grade-4');
    expect(stats.totalAttempts).toBe(15);
    expect(stats.correctCount).toBe(12);
    expect(stats.bestStreak).toBe(7);
    expect(stats.missedWords).toEqual(['grammar', 'calendar']);
  });

  it('updates level stats cumulatively from a session and deduplicates missed words', () => {
    // Initial session
    updateLevelStatsFromSession('grade-4', {
      attempts: 5,
      correct: 4,
      streak: 4,
      missed: ['mystery'],
    });

    // Second session
    const updated = updateLevelStatsFromSession('grade-4', {
      attempts: 5,
      correct: 3,
      streak: 2,
      missed: ['mystery', 'island'],
    });

    expect(updated.totalAttempts).toBe(10);
    expect(updated.correctCount).toBe(7);
    expect(updated.bestStreak).toBe(4); // preserves highest streak
    expect(updated.missedWords).toEqual(['mystery', 'island']);
  });

  it('clears stats for a specific level without clearing other levels', () => {
    saveLevelStats({
      levelId: 'level-a',
      totalAttempts: 10,
      correctCount: 8,
      bestStreak: 5,
      missedWords: [],
      lastPracticedAt: new Date().toISOString(),
    });

    saveLevelStats({
      levelId: 'level-b',
      totalAttempts: 20,
      correctCount: 18,
      bestStreak: 12,
      missedWords: [],
      lastPracticedAt: new Date().toISOString(),
    });

    clearLevelStats('level-a');

    expect(loadLevelStats('level-a').totalAttempts).toBe(0);
    expect(loadLevelStats('level-b').totalAttempts).toBe(20);
  });

  it('clears all spelling stats across all levels', () => {
    saveLevelStats({
      levelId: 'level-a',
      totalAttempts: 10,
      correctCount: 8,
      bestStreak: 5,
      missedWords: [],
      lastPracticedAt: new Date().toISOString(),
    });

    clearAllSpellingStats();
    expect(getAllSpellingStats()).toEqual({});
  });
});
