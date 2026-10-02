import { MultiplicationProblem } from './math';

export const MATH_MISTAKES_STORAGE_KEY = 'flashmath_math_problem_stats_v1';

export interface MathProblemStats {
  id: string; // Canonical key, e.g. "7x8" (smaller factor first)
  factorA: number;
  factorB: number;
  product: number;
  attempts: number;
  misses: number;
  correct: number;
  lastMissedAt?: string;
  lastPracticedAt?: string;
}

export interface RankedMathProblem {
  id: string;
  factorA: number;
  factorB: number;
  product: number;
  misses: number;
  attempts: number;
  correct: number;
  errorRate: number; // percentage 0 to 100
  lastMissedAt?: string;
}

/**
 * Returns canonical key for two factors with the smaller factor first (e.g. 7, 8 => "7x8").
 */
export function getProblemKey(factorA: number, factorB: number): string {
  const min = Math.min(factorA, factorB);
  const max = Math.max(factorA, factorB);
  return `${min}x${max}`;
}

/**
 * Loads all math problem mistake stats from localStorage.
 */
export function loadAllMathProblemStats(): Record<string, MathProblemStats> {
  try {
    const raw = localStorage.getItem(MATH_MISTAKES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Saves all math problem mistake stats to localStorage.
 */
export function saveAllMathProblemStats(stats: Record<string, MathProblemStats>): void {
  try {
    localStorage.setItem(MATH_MISTAKES_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Graceful handling
  }
}

/**
 * Records an attempt for a multiplication fact, updating total attempts, correct count,
 * misses, and timestamps.
 */
export function recordMathProblemAttempt(
  factorA: number,
  factorB: number,
  isCorrect: boolean
): MathProblemStats {
  const key = getProblemKey(factorA, factorB);
  const min = Math.min(factorA, factorB);
  const max = Math.max(factorA, factorB);
  const allStats = loadAllMathProblemStats();
  const existing = allStats[key] || {
    id: key,
    factorA: min,
    factorB: max,
    product: min * max,
    attempts: 0,
    misses: 0,
    correct: 0,
  };

  const now = new Date().toISOString();
  const updated: MathProblemStats = {
    ...existing,
    attempts: existing.attempts + 1,
    correct: existing.correct + (isCorrect ? 1 : 0),
    misses: existing.misses + (isCorrect ? 0 : 1),
    lastPracticedAt: now,
    lastMissedAt: isCorrect ? existing.lastMissedAt : now,
  };

  allStats[key] = updated;
  saveAllMathProblemStats(allStats);
  return updated;
}

/**
 * Returns ranked trouble problems that have been missed more than once (default minMisses = 2).
 * Sorted by misses count (descending), error rate (descending), and recency.
 */
export function getMostMissedMathProblems(
  limit?: number,
  minMisses = 2
): RankedMathProblem[] {
  const allStats = loadAllMathProblemStats();
  const result: RankedMathProblem[] = Object.values(allStats)
    .filter((item) => item.misses >= minMisses)
    .map((item) => ({
      id: item.id,
      factorA: item.factorA,
      factorB: item.factorB,
      product: item.product,
      misses: item.misses,
      attempts: item.attempts,
      correct: item.correct,
      errorRate: Math.round((item.misses / Math.max(1, item.attempts)) * 100),
      lastMissedAt: item.lastMissedAt,
    }));

  result.sort((a, b) => {
    if (b.misses !== a.misses) return b.misses - a.misses;
    if (b.errorRate !== a.errorRate) return b.errorRate - a.errorRate;
    if (a.lastMissedAt && b.lastMissedAt) {
      return new Date(b.lastMissedAt).getTime() - new Date(a.lastMissedAt).getTime();
    }
    return a.id.localeCompare(b.id);
  });

  return typeof limit === 'number' && limit > 0 ? result.slice(0, limit) : result;
}

/**
 * Clears all stored math problem mistake stats.
 */
export function clearMathProblemStats(): void {
  try {
    localStorage.removeItem(MATH_MISTAKES_STORAGE_KEY);
  } catch {
    // Graceful handling
  }
}

/**
 * Creates a playable MultiplicationProblem from a RankedMathProblem fact record.
 */
export function createProblemFromRanked(ranked: RankedMathProblem): MultiplicationProblem {
  const swap = Math.random() > 0.5;
  const factorA = swap ? ranked.factorB : ranked.factorA;
  const factorB = swap ? ranked.factorA : ranked.factorB;
  return {
    id: `missed-${ranked.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    factorA,
    factorB,
    product: factorA * factorB,
  };
}
