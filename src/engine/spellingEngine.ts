import { SPELLING_LEVELS, SpellingLevel } from '../data/spellingLevels';

export { SPELLING_LEVELS };
export type { SpellingLevel };

export interface SpellingSession {
  levelId: string;
  currentWord: string;
  totalAttempts: number;
  correctCount: number;
  currentStreak: number;
  bestStreak: number;
  missedWords: string[];
  lastAttemptWasCorrect?: boolean;
  isComplete: boolean;
}

export function getSpellingLevelById(levelId: string): SpellingLevel | undefined {
  return SPELLING_LEVELS.find((lvl) => lvl.id === levelId);
}

export function evaluateSpellingAnswer(userInput: string, targetWord: string): boolean {
  return userInput.trim().toLowerCase() === targetWord.trim().toLowerCase();
}

export function getRandomWordForLevel(levelId: string, excludeWord?: string): string {
  const level = getSpellingLevelById(levelId);
  if (!level || level.words.length === 0) {
    throw new Error(`Spelling level '${levelId}' not found or has no words.`);
  }

  const eligibleWords =
    level.words.length > 1 && excludeWord
      ? level.words.filter((w) => w.toLowerCase() !== excludeWord.toLowerCase())
      : level.words;

  const randomIndex = Math.floor(Math.random() * eligibleWords.length);
  return eligibleWords[randomIndex];
}

export function createSpellingSession(levelId: string): SpellingSession {
  const initialWord = getRandomWordForLevel(levelId);
  return {
    levelId,
    currentWord: initialWord,
    totalAttempts: 0,
    correctCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    missedWords: [],
    isComplete: false,
  };
}

export function submitSpellingAttempt(
  session: SpellingSession,
  userInput: string
): SpellingSession {
  const isCorrect = evaluateSpellingAnswer(userInput, session.currentWord);
  const totalAttempts = session.totalAttempts + 1;
  const correctCount = session.correctCount + (isCorrect ? 1 : 0);
  const currentStreak = isCorrect ? session.currentStreak + 1 : 0;
  const bestStreak = Math.max(session.bestStreak, currentStreak);

  const missedWords = isCorrect
    ? session.missedWords
    : session.missedWords.includes(session.currentWord)
      ? session.missedWords
      : [...session.missedWords, session.currentWord];

  return {
    ...session,
    totalAttempts,
    correctCount,
    currentStreak,
    bestStreak,
    missedWords,
    lastAttemptWasCorrect: isCorrect,
  };
}

export function advanceToNextWord(session: SpellingSession): SpellingSession {
  const nextWord = getRandomWordForLevel(session.levelId, session.currentWord);
  return {
    ...session,
    currentWord: nextWord,
    lastAttemptWasCorrect: undefined,
  };
}
