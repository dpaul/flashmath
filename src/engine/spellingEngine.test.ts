import { describe, it, expect } from 'vitest';
import {
  SPELLING_LEVELS,
  getSpellingLevelById,
  evaluateSpellingAnswer,
  shuffleArray,
  createSpellingSession,
  submitSpellingAttempt,
  advanceToNextWord,
} from './spellingEngine';

describe('Spelling Engine & Level Configuration', () => {
  it('defines at least one default level (e.g. 4th Grade) with ~10 words', () => {
    expect(SPELLING_LEVELS.length).toBeGreaterThan(0);
    const grade4 = getSpellingLevelById('grade-4');
    expect(grade4).toBeDefined();
    expect(grade4?.words.length).toBeGreaterThanOrEqual(10);
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

  it('shuffles arrays without mutating original array', () => {
    const original = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    const shuffled = shuffleArray(original);
    expect(shuffled).toHaveLength(original.length);
    expect(shuffled.slice().sort()).toEqual(original.slice().sort());
  });

  it('initializes a clean spelling session with shuffled level words', () => {
    const session = createSpellingSession('grade-4');
    const level = getSpellingLevelById('grade-4')!;

    expect(session.levelId).toBe('grade-4');
    expect(session.words).toHaveLength(level.words.length);
    expect(session.currentIndex).toBe(0);
    expect(session.currentWord).toBe(session.words[0]);
    expect(session.totalAttempts).toBe(0);
    expect(session.correctCount).toBe(0);
    expect(session.currentStreak).toBe(0);
    expect(session.bestStreak).toBe(0);
    expect(session.missedWords).toEqual([]);
    expect(session.isComplete).toBe(false);
    expect(session.startTime).toBeGreaterThan(0);
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

  it('progresses sequentially through shuffled words and marks complete when list is exhausted', () => {
    let session = createSpellingSession('grade-4');
    const totalWords = session.words.length;

    for (let i = 0; i < totalWords; i++) {
      expect(session.currentIndex).toBe(i);
      expect(session.currentWord).toBe(session.words[i]);
      expect(session.isComplete).toBe(false);

      session = submitSpellingAttempt(session, session.currentWord);
      session = advanceToNextWord(session);
    }

    expect(session.isComplete).toBe(true);
    expect(session.correctCount).toBe(totalWords);
    expect(session.totalAttempts).toBe(totalWords);
    expect(session.elapsedSeconds).toBeGreaterThanOrEqual(0);
  });
});
