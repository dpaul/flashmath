import { SPELLING_LEVELS, SpellingLevel, getExampleSentence } from '../data/spellingLevels';
import { getAllMostMissedWords } from './spellingStorage';

export { SPELLING_LEVELS, getExampleSentence };
export type { SpellingLevel };

export const MOST_MISSED_LEVEL_ID = 'most-missed';

export function getMostMissedSpellingLevel(limit = 20): SpellingLevel {
  const ranked = getAllMostMissedWords(limit);
  const words = ranked.map((r) => r.word);

  const sentences: Record<string, string> = {};
  for (const w of words) {
    const s = getExampleSentence(w);
    if (s) {
      sentences[w.toLowerCase()] = s;
    }
  }

  return {
    id: MOST_MISSED_LEVEL_ID,
    name: 'Most Missed Words',
    description: 'Targeted drill focusing on the spelling words you have missed most often.',
    difficultyLabel: 'Trouble Words',
    words,
    sentences,
  };
}

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
  if (levelId === MOST_MISSED_LEVEL_ID) {
    return getMostMissedSpellingLevel();
  }
  if (levelId === 'level-1') return SPELLING_LEVELS[0];
  if (levelId === 'level-2') return SPELLING_LEVELS[1];
  if (levelId === 'level-3' || levelId === 'rptt' || levelId === 'roots') return SPELLING_LEVELS[2];
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

export function createSpellingSession(levelId: string, customWords?: string[]): SpellingSession {
  const level = getSpellingLevelById(levelId);
  const wordList = customWords && customWords.length > 0 ? customWords : (level?.words || []);

  if (wordList.length === 0) {
    return {
      levelId,
      words: [],
      currentIndex: 0,
      currentWord: '',
      totalAttempts: 0,
      correctCount: 0,
      currentStreak: 0,
      bestStreak: 0,
      missedWords: [],
      isComplete: true,
      startTime: Date.now(),
      elapsedSeconds: 0,
    };
  }

  const shuffledWords = shuffleArray(wordList);

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
