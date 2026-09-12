import { SPELLING_LEVELS, SpellingLevel, getExampleSentence } from '../data/spellingLevels';

export { SPELLING_LEVELS, getExampleSentence };
export type { SpellingLevel };

export interface SpellingSession {
  levelId: string;
  words: string[];
  currentIndex: number;
  currentWord: string;
  totalAttempts: number;
  correctCount: number;
  currentStreak: number;
  bestStreak: number;
  missedWords: string[];
  lastAttemptWasCorrect?: boolean;
  isComplete: boolean;
  startTime: number;
  elapsedSeconds: number;
}

export function getSpellingLevelById(levelId: string): SpellingLevel | undefined {
  return SPELLING_LEVELS.find((lvl) => lvl.id === levelId) || SPELLING_LEVELS[0];
}

export function evaluateSpellingAnswer(userInput: string, targetWord: string): boolean {
  return userInput.trim().toLowerCase() === targetWord.trim().toLowerCase();
}

export function maskWordInSentence(sentence: string, word: string): string {
  if (!sentence || !word) return sentence;
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
  return sentence.replace(regex, '_____');
}


export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createSpellingSession(levelId: string): SpellingSession {
  const level = getSpellingLevelById(levelId);
  if (!level || level.words.length === 0) {
    throw new Error(`Spelling level '${levelId}' not found or has no words.`);
  }

  const shuffledWords = shuffleArray(level.words);

  return {
    levelId,
    words: shuffledWords,
    currentIndex: 0,
    currentWord: shuffledWords[0],
    totalAttempts: 0,
    correctCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    missedWords: [],
    isComplete: false,
    startTime: Date.now(),
    elapsedSeconds: 0,
  };
}

export function submitSpellingAttempt(
  session: SpellingSession,
  userInput: string
): SpellingSession {
  if (session.isComplete) {
    return session;
  }

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
  const nextIndex = session.currentIndex + 1;

  if (nextIndex >= session.words.length) {
    const now = Date.now();
    const elapsedSeconds = Math.max(1, Math.round((now - session.startTime) / 1000));
    return {
      ...session,
      currentIndex: nextIndex,
      isComplete: true,
      lastAttemptWasCorrect: undefined,
      elapsedSeconds,
    };
  }

  return {
    ...session,
    currentIndex: nextIndex,
    currentWord: session.words[nextIndex],
    lastAttemptWasCorrect: undefined,
  };
}
