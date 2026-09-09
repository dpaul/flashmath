import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadPersonalBests, savePersonalBests, STORAGE_KEY } from './storage';

describe('Storage Module', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('loads default personal bests when storage is empty', () => {
    const bests = loadPersonalBests();
    expect(bests.highScore).toBe(0);
    expect(bests.bestStreak).toBe(0);
    expect(bests.totalGamesPlayed).toBe(0);
  });

  it('saves and loads personal bests correctly', () => {
    savePersonalBests({
      highScore: 42,
      bestStreak: 15,
      totalGamesPlayed: 3,
    });

    const bests = loadPersonalBests();
    expect(bests.highScore).toBe(42);
    expect(bests.bestStreak).toBe(15);
    expect(bests.totalGamesPlayed).toBe(3);
  });

  it('handles invalid JSON in localStorage safely without throwing', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json');
    const bests = loadPersonalBests();
    expect(bests.highScore).toBe(0);
    expect(bests.bestStreak).toBe(0);
  });
});
