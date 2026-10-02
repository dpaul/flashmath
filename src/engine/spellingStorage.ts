import { SPELLING_LEVELS } from '../data/spellingLevels';

export const MOST_MISSED_LEVEL_ID = 'most-missed';

export interface SpellingRunRecord {
  id?: string;
  timestamp: string; // ISO 8601
  durationSeconds: number;
  correctCount: number;
  totalWords: number;
  bestStreak: number;
  accuracyPercentage: number; // 0 to 100
  missedWords?: string[];
}

export interface WordMistakeStats {
  word: string;
  attempts: number;
  misses: number;
  lastMissedAt?: string;
}

export interface RankedWordMistake {
  word: string;
  misses: number;
  attempts: number;
  errorRate: number; // percentage 0 to 100
  lastMissedAt?: string;
}

export interface SpellingAccuracyDataPoint {
  timestamp: string;
  accuracyPercentage: number;
  correctCount: number;
  totalWords: number;
  durationSeconds: number;
  runIndex: number;
}

export interface SpellingLevelStats {
  levelId: string;
  totalAttempts: number;
  correctCount: number;
  bestStreak: number;
  bestTimeSeconds?: number;
  lastDurationSeconds?: number;
  lastScore?: { correct: number; total: number };
  missedWords: string[];
  wordStats?: Record<string, WordMistakeStats>;
  lastPracticedAt: string; // ISO 8601
  runs?: SpellingRunRecord[];
}

export const SPELLING_STORAGE_PREFIX = 'flashmath_spelling_stats_';

export function getStorageKeyForLevel(levelId: string): string {
  return `${SPELLING_STORAGE_PREFIX}${levelId}`;
}

export function loadLevelStats(levelId: string): SpellingLevelStats {
  try {
    let raw = localStorage.getItem(getStorageKeyForLevel(levelId));
    if (!raw && levelId === '2026-09-12') {
      raw = localStorage.getItem(getStorageKeyForLevel('level-1'));
    }
    if (!raw) {
      return {
        levelId,
        totalAttempts: 0,
        correctCount: 0,
        bestStreak: 0,
        missedWords: [],
        wordStats: {},
        lastPracticedAt: '',
        runs: [],
      };
    }
    const parsed = JSON.parse(raw);

    const runs: SpellingRunRecord[] = Array.isArray(parsed.runs)
      ? parsed.runs.map((r: any, idx: number) => ({
          id: r.id || `run_${idx}_${r.timestamp}`,
          timestamp: r.timestamp || new Date().toISOString(),
          durationSeconds: r.durationSeconds ?? 0,
          correctCount: r.correctCount ?? 0,
          totalWords: r.totalWords ?? 0,
          bestStreak: r.bestStreak ?? 0,
          accuracyPercentage:
            r.accuracyPercentage !== undefined
              ? r.accuracyPercentage
              : Math.round(((r.correctCount || 0) / Math.max(1, r.totalWords || 1)) * 100),
          missedWords: Array.isArray(r.missedWords) ? r.missedWords : [],
        }))
      : [];

    const wordStats: Record<string, WordMistakeStats> =
      parsed.wordStats && typeof parsed.wordStats === 'object'
        ? { ...parsed.wordStats }
        : {};

    const missedWords: string[] = Array.isArray(parsed.missedWords)
      ? parsed.missedWords
      : [];

    // Backward compatibility: If parsed has missedWords but wordStats is empty, initialize wordStats
    for (const w of missedWords) {
      const lower = w.trim().toLowerCase();
      if (!wordStats[lower]) {
        wordStats[lower] = {
          word: w,
          attempts: 1,
          misses: 1,
          lastMissedAt: parsed.lastPracticedAt,
        };
      }
    }

    return {
      levelId,
      totalAttempts: parsed.totalAttempts ?? 0,
      correctCount: parsed.correctCount ?? 0,
      bestStreak: parsed.bestStreak ?? 0,
      bestTimeSeconds: parsed.bestTimeSeconds,
      lastDurationSeconds: parsed.lastDurationSeconds,
      lastScore: parsed.lastScore,
      missedWords,
      wordStats,
      lastPracticedAt: parsed.lastPracticedAt ?? '',
      runs,
    };
  } catch {
    return {
      levelId,
      totalAttempts: 0,
      correctCount: 0,
      bestStreak: 0,
      missedWords: [],
      wordStats: {},
      lastPracticedAt: '',
      runs: [],
    };
  }
}

export function saveLevelStats(stats: SpellingLevelStats): void {
  try {
    localStorage.setItem(getStorageKeyForLevel(stats.levelId), JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save spelling level stats to localStorage:', error);
  }
}

export function updateLevelStatsFromSession(
  levelId: string,
  sessionResult: {
    attempts: number;
    correct: number;
    streak: number;
    missed: string[];
    word?: string;
  }
): SpellingLevelStats {
  const current = loadLevelStats(levelId);

  // Combine and deduplicate missed words
  const missedSet = new Set([...current.missedWords, ...sessionResult.missed]);

  const wordStats: Record<string, WordMistakeStats> = { ...(current.wordStats || {}) };

  // Track specific word if provided, otherwise words in missed array
  const targetWords = sessionResult.word
    ? [sessionResult.word]
    : sessionResult.missed;

  for (const w of targetWords) {
    const lower = w.trim().toLowerCase();
    const existing = wordStats[lower] || {
      word: w,
      attempts: 0,
      misses: 0,
    };

    const isMissed = sessionResult.missed.some(
      (m) => m.trim().toLowerCase() === lower
    );

    wordStats[lower] = {
      word: existing.word || w,
      attempts: existing.attempts + sessionResult.attempts,
      misses: existing.misses + (isMissed ? 1 : 0),
      lastMissedAt: isMissed ? new Date().toISOString() : existing.lastMissedAt,
    };
  }

  const updated: SpellingLevelStats = {
    ...current,
    levelId,
    totalAttempts: current.totalAttempts + sessionResult.attempts,
    correctCount: current.correctCount + sessionResult.correct,
    bestStreak: Math.max(current.bestStreak, sessionResult.streak),
    missedWords: Array.from(missedSet),
    wordStats,
    lastPracticedAt: new Date().toISOString(),
  };

  saveLevelStats(updated);
  return updated;
}

export function recordCompletedSpellingRun(
  levelId: string,
  run: {
    durationSeconds: number;
    correctCount: number;
    totalWords: number;
    bestStreak: number;
    missedWords?: string[];
  }
): SpellingLevelStats {
  const current = loadLevelStats(levelId);
  const runs = current.runs ? [...current.runs] : [];
  const accuracyPercentage = Math.round(
    (run.correctCount / Math.max(1, run.totalWords)) * 100
  );

  const newRunRecord: SpellingRunRecord = {
    id: `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    durationSeconds: run.durationSeconds,
    correctCount: run.correctCount,
    totalWords: run.totalWords,
    bestStreak: run.bestStreak,
    accuracyPercentage,
    missedWords: run.missedWords ? [...run.missedWords] : [],
  };
  runs.push(newRunRecord);
  if (runs.length > 100) {
    runs.splice(0, runs.length - 100);
  }

  // Ensure wordStats contains all missed words from this completed run
  const wordStats: Record<string, WordMistakeStats> = { ...(current.wordStats || {}) };
  if (run.missedWords && run.missedWords.length > 0) {
    for (const w of run.missedWords) {
      const lower = w.trim().toLowerCase();
      if (!wordStats[lower]) {
        wordStats[lower] = {
          word: w,
          attempts: 1,
          misses: 1,
          lastMissedAt: newRunRecord.timestamp,
        };
      }
    }
  }

  const bestTimeSeconds =
    current.bestTimeSeconds && current.bestTimeSeconds > 0
      ? Math.min(current.bestTimeSeconds, run.durationSeconds)
      : run.durationSeconds;

  const updated: SpellingLevelStats = {
    ...current,
    lastDurationSeconds: run.durationSeconds,
    bestTimeSeconds,
    lastScore: { correct: run.correctCount, total: run.totalWords },
    lastPracticedAt: new Date().toISOString(),
    runs,
    wordStats,
  };

  saveLevelStats(updated);
  return updated;
}

export function getMostMissedWordsForLevel(levelId: string): RankedWordMistake[] {
  const stats = loadLevelStats(levelId);
  const wordStats = stats.wordStats || {};
  const result: RankedWordMistake[] = [];

  for (const [rawWord, data] of Object.entries(wordStats)) {
    if (data.misses > 0) {
      result.push({
        word: data.word || rawWord,
        misses: data.misses,
        attempts: Math.max(data.attempts, data.misses),
        errorRate: Math.round((data.misses / Math.max(1, data.attempts, data.misses)) * 100),
        lastMissedAt: data.lastMissedAt,
      });
    }
  }

  // Fallback for legacy stats that only had missedWords list
  if (stats.missedWords && stats.missedWords.length > 0) {
    for (const w of stats.missedWords) {
      const lower = w.trim().toLowerCase();
      if (!result.some((r) => r.word.toLowerCase() === lower)) {
        result.push({
          word: w,
          misses: 1,
          attempts: 1,
          errorRate: 100,
          lastMissedAt: stats.lastPracticedAt,
        });
      }
    }
  }

  return result.sort((a, b) => {
    if (b.misses !== a.misses) return b.misses - a.misses;
    if (b.errorRate !== a.errorRate) return b.errorRate - a.errorRate;
    return a.word.localeCompare(b.word);
  });
}

export function getAccuracyTrendForLevel(levelId: string): SpellingAccuracyDataPoint[] {
  const stats = loadLevelStats(levelId);
  const runs = stats.runs || [];
  return runs.map((r, idx) => ({
    timestamp: r.timestamp,
    accuracyPercentage:
      r.accuracyPercentage !== undefined
        ? r.accuracyPercentage
        : Math.round((r.correctCount / Math.max(1, r.totalWords)) * 100),
    correctCount: r.correctCount,
    totalWords: r.totalWords,
    durationSeconds: r.durationSeconds,
    runIndex: idx + 1,
  }));
}

export function clearLevelStats(levelId: string): void {
  try {
    localStorage.removeItem(getStorageKeyForLevel(levelId));
  } catch (error) {
    console.warn('Failed to clear spelling level stats from localStorage:', error);
  }
}

export function getAllSpellingStats(): Record<string, SpellingLevelStats> {
  const result: Record<string, SpellingLevelStats> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SPELLING_STORAGE_PREFIX)) {
        const levelId = key.replace(SPELLING_STORAGE_PREFIX, '');
        if (levelId === MOST_MISSED_LEVEL_ID) {
          continue;
        }
        result[levelId] = loadLevelStats(levelId);
      }
    }
  } catch {
    // Graceful handling
  }
  return result;
}

export function clearAllSpellingStats(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SPELLING_STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Graceful handling
  }
}

export function findLevelIdForWord(word: string): string | undefined {
  if (!word) return undefined;
  const normalized = word.trim().toLowerCase();
  for (const level of SPELLING_LEVELS) {
    if (level.words.some((w) => w.trim().toLowerCase() === normalized)) {
      return level.id;
    }
  }
  return undefined;
}

export function getAllMostMissedWords(limit?: number, minMisses = 2): RankedWordMistake[] {
  const allStats = getAllSpellingStats();
  const aggregated: Record<
    string,
    {
      word: string;
      misses: number;
      attempts: number;
      lastMissedAt?: string;
    }
  > = {};

  for (const [lvlId, stats] of Object.entries(allStats)) {
    if (lvlId === MOST_MISSED_LEVEL_ID) continue;

    // 1. Process wordStats
    if (stats.wordStats) {
      for (const [rawWord, data] of Object.entries(stats.wordStats)) {
        if (data.misses > 0) {
          const lower = rawWord.trim().toLowerCase();
          const wordText = data.word || rawWord;
          if (!aggregated[lower]) {
            aggregated[lower] = {
              word: wordText,
              misses: data.misses,
              attempts: Math.max(data.attempts, data.misses),
              lastMissedAt: data.lastMissedAt,
            };
          } else {
            aggregated[lower].misses += data.misses;
            aggregated[lower].attempts += Math.max(data.attempts, data.misses);
            if (data.lastMissedAt) {
              if (
                !aggregated[lower].lastMissedAt ||
                new Date(data.lastMissedAt).getTime() >
                  new Date(aggregated[lower].lastMissedAt!).getTime()
              ) {
                aggregated[lower].lastMissedAt = data.lastMissedAt;
              }
            }
          }
        }
      }
    }

    // 2. Process legacy missedWords
    if (stats.missedWords && stats.missedWords.length > 0) {
      for (const w of stats.missedWords) {
        const lower = w.trim().toLowerCase();
        if (!aggregated[lower]) {
          aggregated[lower] = {
            word: w,
            misses: 1,
            attempts: 1,
            lastMissedAt: stats.lastPracticedAt,
          };
        }
      }
    }
  }

  const result: RankedWordMistake[] = Object.values(aggregated)
    .filter((data) => data.misses >= minMisses)
    .map((data) => ({
      word: data.word,
      misses: data.misses,
      attempts: data.attempts,
      errorRate: Math.round((data.misses / Math.max(1, data.attempts)) * 100),
      lastMissedAt: data.lastMissedAt,
    }));

  result.sort((a, b) => {
    if (b.misses !== a.misses) return b.misses - a.misses;
    if (b.errorRate !== a.errorRate) return b.errorRate - a.errorRate;
    if (a.lastMissedAt && b.lastMissedAt) {
      return new Date(b.lastMissedAt).getTime() - new Date(a.lastMissedAt).getTime();
    }
    return a.word.localeCompare(b.word);
  });

  return typeof limit === 'number' && limit > 0 ? result.slice(0, limit) : result;
}
