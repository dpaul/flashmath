import { describe, it, expect, beforeEach } from 'vitest';
import {
  getProblemKey,
  loadAllMathProblemStats,
  recordMathProblemAttempt,
  getMostMissedMathProblems,
  clearMathProblemStats,
  createProblemFromRanked,
} from './mathMistakesStorage';

describe('Math Mistakes Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates canonical keys regardless of factor order', () => {
    expect(getProblemKey(7, 8)).toBe('7x8');
    expect(getProblemKey(8, 7)).toBe('7x8');
    expect(getProblemKey(12, 4)).toBe('4x12');
  });

  it('records correct and incorrect attempts and aggregates them under the canonical key', () => {
    // Miss 7x8
    recordMathProblemAttempt(7, 8, false);
    // Miss 8x7 (same canonical fact)
    recordMathProblemAttempt(8, 7, false);
    // Answer 7x8 correctly
    recordMathProblemAttempt(7, 8, true);

    const stats = loadAllMathProblemStats();
    expect(stats['7x8']).toBeDefined();
    expect(stats['7x8'].attempts).toBe(3);
    expect(stats['7x8'].misses).toBe(2);
    expect(stats['7x8'].correct).toBe(1);
    expect(stats['7x8'].product).toBe(56);
  });

  it('filters by minMisses = 2 by default and ranks trouble problems', () => {
    // Problem 1: 6x7 missed 3 times
    recordMathProblemAttempt(6, 7, false);
    recordMathProblemAttempt(6, 7, false);
    recordMathProblemAttempt(6, 7, false);

    // Problem 2: 9x8 missed 2 times
    recordMathProblemAttempt(9, 8, false);
    recordMathProblemAttempt(9, 8, false);

    // Problem 3: 4x5 missed only 1 time (should NOT qualify by default)
    recordMathProblemAttempt(4, 5, false);

    const mostMissed = getMostMissedMathProblems();
    expect(mostMissed).toHaveLength(2);

    // #1 is 6x7 with 3 misses
    expect(mostMissed[0].id).toBe('6x7');
    expect(mostMissed[0].misses).toBe(3);
    expect(mostMissed[0].errorRate).toBe(100);

    // #2 is 8x9 with 2 misses
    expect(mostMissed[1].id).toBe('8x9');
    expect(mostMissed[1].misses).toBe(2);

    // 4x5 with 1 miss is excluded from the default query
    expect(mostMissed.some((p) => p.id === '4x5')).toBe(false);

    // If minMisses = 1, 4x5 is included
    const allWithSingleMiss = getMostMissedMathProblems(undefined, 1);
    expect(allWithSingleMiss).toHaveLength(3);
  });

  it('supports limit parameter', () => {
    recordMathProblemAttempt(3, 3, false);
    recordMathProblemAttempt(3, 3, false);

    recordMathProblemAttempt(4, 4, false);
    recordMathProblemAttempt(4, 4, false);

    const top1 = getMostMissedMathProblems(1);
    expect(top1).toHaveLength(1);
  });

  it('clears all problem stats', () => {
    recordMathProblemAttempt(6, 6, false);
    recordMathProblemAttempt(6, 6, false);
    expect(getMostMissedMathProblems()).toHaveLength(1);

    clearMathProblemStats();
    expect(getMostMissedMathProblems()).toHaveLength(0);
    expect(loadAllMathProblemStats()).toEqual({});
  });

  it('creates playable MultiplicationProblem from ranked record', () => {
    const ranked = {
      id: '7x8',
      factorA: 7,
      factorB: 8,
      product: 56,
      misses: 3,
      attempts: 4,
      correct: 1,
      errorRate: 75,
    };

    const problem = createProblemFromRanked(ranked);
    expect(problem.product).toBe(56);
    expect([7, 8]).toContain(problem.factorA);
    expect([7, 8]).toContain(problem.factorB);
    expect(problem.id).toContain('missed-7x8');
  });
});
