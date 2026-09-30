import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadLevelStats,
  saveLevelStats,
  updateLevelStatsFromSession,
  recordCompletedSpellingRun,
  clearLevelStats,
  clearAllSpellingStats,
  getAllSpellingStats,
  getAccuracyTrendForLevel,
  getMostMissedWordsForLevel,
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

  it('records completed runs tracking time elapsed, correct count, and runs list', () => {
    const updated = recordCompletedSpellingRun('grade-4', {
      durationSeconds: 45,
      correctCount: 10,
      totalWords: 12,
      bestStreak: 8,
    });

    expect(updated.lastDurationSeconds).toBe(45);
    expect(updated.bestTimeSeconds).toBe(45);
    expect(updated.lastScore).toEqual({ correct: 10, total: 12 });
    expect(updated.runs).toHaveLength(1);
    expect(updated.runs?.[0].durationSeconds).toBe(45);

    // Faster subsequent run
    const updated2 = recordCompletedSpellingRun('grade-4', {
      durationSeconds: 38,
      correctCount: 12,
      totalWords: 12,
      bestStreak: 12,
    });
    expect(updated2.bestTimeSeconds).toBe(38);
    expect(updated2.runs).toHaveLength(2);
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

  it('tracks % correct over time across multiple runs and provides accuracy trend data', () => {
    // Run 1: 8/10 = 80%
    recordCompletedSpellingRun('test-level', {
      durationSeconds: 60,
      correctCount: 8,
      totalWords: 10,
      bestStreak: 5,
      missedWords: ['dictate', 'vision'],
    });

    // Run 2: 10/10 = 100%
    recordCompletedSpellingRun('test-level', {
      durationSeconds: 45,
      correctCount: 10,
      totalWords: 10,
      bestStreak: 10,
      missedWords: [],
    });

    // Run 3: 9/10 = 90%
    recordCompletedSpellingRun('test-level', {
      durationSeconds: 50,
      correctCount: 9,
      totalWords: 10,
      bestStreak: 7,
      missedWords: ['dictate'],
    });

    const stats = loadLevelStats('test-level');
    expect(stats.runs).toHaveLength(3);
    expect(stats.runs?.[0].accuracyPercentage).toBe(80);
    expect(stats.runs?.[1].accuracyPercentage).toBe(100);
    expect(stats.runs?.[2].accuracyPercentage).toBe(90);

    const trend = getAccuracyTrendForLevel('test-level');
    expect(trend).toHaveLength(3);
    expect(trend[0].accuracyPercentage).toBe(80);
    expect(trend[1].accuracyPercentage).toBe(100);
    expect(trend[2].accuracyPercentage).toBe(90);
  });

  it('tracks and ranks the words that have been gotten wrong the most', () => {
    // Miss 'contradict' 3 times
    updateLevelStatsFromSession('roots', {
      attempts: 1,
      correct: 0,
      streak: 0,
      missed: ['contradict'],
      word: 'contradict',
    });
    updateLevelStatsFromSession('roots', {
      attempts: 1,
      correct: 0,
      streak: 0,
      missed: ['contradict'],
      word: 'contradict',
    });
    updateLevelStatsFromSession('roots', {
      attempts: 1,
      correct: 0,
      streak: 0,
      missed: ['contradict'],
      word: 'contradict',
    });

    // Miss 'dictate' 1 time out of 2 attempts
    updateLevelStatsFromSession('roots', {
      attempts: 1,
      correct: 0,
      streak: 0,
      missed: ['dictate'],
      word: 'dictate',
    });
    updateLevelStatsFromSession('roots', {
      attempts: 1,
      correct: 1,
      streak: 1,
      missed: [],
      word: 'dictate',
    });

    // Spell 'vision' correctly 2 times (0 misses)
    updateLevelStatsFromSession('roots', {
      attempts: 2,
      correct: 2,
      streak: 2,
      missed: [],
      word: 'vision',
    });

    const mostMissed = getMostMissedWordsForLevel('roots');
    expect(mostMissed).toHaveLength(2);
    // #1 most missed: 'contradict' with 3 misses
    expect(mostMissed[0].word).toBe('contradict');
    expect(mostMissed[0].misses).toBe(3);
    expect(mostMissed[0].attempts).toBe(3);
    expect(mostMissed[0].errorRate).toBe(100);

    // #2 most missed: 'dictate' with 1 miss
    expect(mostMissed[1].word).toBe('dictate');
    expect(mostMissed[1].misses).toBe(1);
    expect(mostMissed[1].attempts).toBe(2);
    expect(mostMissed[1].errorRate).toBe(50);
  });
});
