export interface SpellingLevelStats {
  levelId: string;
  totalAttempts: number;
  correctCount: number;
  bestStreak: number;
  missedWords: string[];
  lastPracticedAt: string; // ISO 8601
}

export const SPELLING_STORAGE_PREFIX = 'flashmath_spelling_stats_';

export function getStorageKeyForLevel(levelId: string): string {
  return `${SPELLING_STORAGE_PREFIX}${levelId}`;
}

export function loadLevelStats(levelId: string): SpellingLevelStats {
  try {
    const raw = localStorage.getItem(getStorageKeyForLevel(levelId));
    if (!raw) {
      return {
        levelId,
        totalAttempts: 0,
        correctCount: 0,
        bestStreak: 0,
        missedWords: [],
        lastPracticedAt: '',
      };
    }
    const parsed = JSON.parse(raw);
    return {
      levelId,
      totalAttempts: parsed.totalAttempts ?? 0,
      correctCount: parsed.correctCount ?? 0,
      bestStreak: parsed.bestStreak ?? 0,
      missedWords: Array.isArray(parsed.missedWords) ? parsed.missedWords : [],
      lastPracticedAt: parsed.lastPracticedAt ?? '',
    };
  } catch {
    return {
      levelId,
      totalAttempts: 0,
      correctCount: 0,
      bestStreak: 0,
      missedWords: [],
      lastPracticedAt: '',
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
  }
): SpellingLevelStats {
  const current = loadLevelStats(levelId);

  // Combine and deduplicate missed words
  const missedSet = new Set([...current.missedWords, ...sessionResult.missed]);

  const updated: SpellingLevelStats = {
    levelId,
    totalAttempts: current.totalAttempts + sessionResult.attempts,
    correctCount: current.correctCount + sessionResult.correct,
    bestStreak: Math.max(current.bestStreak, sessionResult.streak),
    missedWords: Array.from(missedSet),
    lastPracticedAt: new Date().toISOString(),
  };

  saveLevelStats(updated);
  return updated;
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
