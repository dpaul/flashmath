import { describe, it, expect } from 'vitest';
import {
  SPELLING_LEVELS,
  getSpellingLevelById,
  evaluateSpellingAnswer,
  getRandomWordForLevel,
  createSpellingSession,
  submitSpellingAttempt,
} from './spellingEngine';

describe('Spelling Engine & Level Configuration', () => {
  it('defines at least one default level (e.g. 4th Grade) with ~10 words', () => {
    expect(SPELLING_LEVELS.length).toBeGreaterThan(0);
    const grade4 = getSpellingLevelById('grade-4');
    expect(grade4).toBeDefined();
    expect(grade4?.words.length).toBeGreaterThanOrEqual(10);
    // ensure words are lowercase or cleanly formatted strings
    grade4?.words.forEach((word) => {
      expect(typeof word).toBe('string');
      expect(word.trim().length).toBeGreaterThan(0);
    });
  });

  it('evaluates spelling answers with case-insensitivity and whitespace trimming', () => {
    expect(evaluateSpellingAnswer('calendar', 'calendar')).toBe(true);
    expect(evaluateSpellingAnswer(' Calendar ', 'calendar')).toBe(true);
    expect(evaluateSpellingAnswer('CALENDAR', 'calendar')).toBe(true);
    expect(evaluateSpellingAnswer('calender', 'calendar')).toBe(false);
    expect(evaluateSpellingAnswer('', 'calendar')).toBe(false);
  });

  it('selects random words from a given level', () => {
    const level = getSpellingLevelById('grade-4')!;
    const word = getRandomWordForLevel(level.id);
    expect(level.words).toContain(word);

    // If excluding last word, it avoids repeating unless word list is 1
    const nextWord = getRandomWordForLevel(level.id, word);
    if (level.words.length > 1) {
      expect(nextWord).not.toBe(word);
    }
  });

  it('initializes a clean spelling session', () => {
    const session = createSpellingSession('grade-4');
    expect(session.levelId).toBe('grade-4');
    expect(session.currentWord).toBeDefined();
    expect(session.totalAttempts).toBe(0);
    expect(session.correctCount).toBe(0);
    expect(session.currentStreak).toBe(0);
    expect(session.bestStreak).toBe(0);
    expect(session.missedWords).toEqual([]);
    expect(session.isComplete).toBe(false);
  });

  it('updates session accurately on correct answer submission', () => {
    const session = createSpellingSession('grade-4');
    const word = session.currentWord;
    const updated = submitSpellingAttempt(session, word);

    expect(updated.totalAttempts).toBe(1);
    expect(updated.correctCount).toBe(1);
    expect(updated.currentStreak).toBe(1);
    expect(updated.bestStreak).toBe(1);
    expect(updated.lastAttemptWasCorrect).toBe(true);
    expect(updated.missedWords).toHaveLength(0);
  });

  it('updates session accurately on incorrect answer submission and records missed word', () => {
    const session = createSpellingSession('grade-4');
    const updated = submitSpellingAttempt(session, 'wrong-spelling');

    expect(updated.totalAttempts).toBe(1);
    expect(updated.correctCount).toBe(0);
    expect(updated.currentStreak).toBe(0);
    expect(updated.bestStreak).toBe(0);
    expect(updated.lastAttemptWasCorrect).toBe(false);
    expect(updated.missedWords).toContain(session.currentWord);
  });
});
