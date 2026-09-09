import { PersonalBests } from './types';

export const STORAGE_KEY = 'flashmath_personal_bests_v1';

export const defaultPersonalBests: PersonalBests = {
  highScore: 0,
  bestStreak: 0,
  totalGamesPlayed: 0,
};

/**
 * Loads personal best records from localStorage with fallback for errors/disabled storage.
 */
export function loadPersonalBests(): PersonalBests {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultPersonalBests };
    const parsed = JSON.parse(raw);
    return {
      highScore: typeof parsed.highScore === 'number' ? parsed.highScore : 0,
      bestStreak: typeof parsed.bestStreak === 'number' ? parsed.bestStreak : 0,
      totalGamesPlayed: typeof parsed.totalGamesPlayed === 'number' ? parsed.totalGamesPlayed : 0,
      lastPlayed: parsed.lastPlayed,
    };
  } catch {
    return { ...defaultPersonalBests };
  }
}

/**
 * Updates and saves personal best records to localStorage.
 */
export function savePersonalBests(updates: Partial<PersonalBests>): PersonalBests {
  const current = loadPersonalBests();
  const next: PersonalBests = {
    ...current,
    ...updates,
    lastPlayed: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Graceful degradation when localStorage is quota-exceeded or blocked
  }

  return next;
}
