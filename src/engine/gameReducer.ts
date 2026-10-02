import {
  evaluateAnswer,
  createShuffledProblemDeck,
  drawProblemFromDeck,
} from './math';
import { loadPersonalBests, savePersonalBests } from './storage';
import { recordSprintRun } from './historyStorage';
import { recordMathProblemAttempt } from './mathMistakesStorage';
import { GameState, GameAction, GameStats } from './types';

export const SPRINT_DURATION_SECONDS = 180;

export function calculateAccuracy(correct: number, attempted: number): number {
  if (attempted <= 0) return 0;
  const raw = (correct / attempted) * 100;
  return Math.round(raw * 10) / 10;
}

export function calculatePPM(correct: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correct <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const raw = correct / minutes;
  return Math.round(raw * 10) / 10;
}

const emptyStats: GameStats = {
  correctCount: 0,
  incorrectCount: 0,
  totalAttempted: 0,
  streak: 0,
  bestStreak: 0,
  accuracyPercentage: 0,
  problemsPerMinute: 0,
  missedProblems: [],
};

export const initialGameState: GameState = {
  phase: 'idle',
  timeRemaining: SPRINT_DURATION_SECONDS,
  currentProblem: null,
  stats: { ...emptyStats },
  personalBests: loadPersonalBests(),
  isNewHighScore: false,
  isNewBestStreak: false,
  lastAnswerCorrect: null,
  problemDeck: [],
  recentProblemPairs: [],
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const personalBests = loadPersonalBests();
      const initialDeck = createShuffledProblemDeck(2, 12);
      const {
        problem: firstProblem,
        remainingDeck,
        recentProblems,
      } = drawProblemFromDeck(initialDeck, []);
      const runId = `sprint-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      return {
        ...state,
        phase: 'running',
        timeRemaining: SPRINT_DURATION_SECONDS,
        currentProblem: firstProblem,
        problemDeck: remainingDeck,
        recentProblemPairs: recentProblems,
        runId,
        stats: {
          ...emptyStats,
          missedProblems: [],
        },
        personalBests,
        isNewHighScore: false,
        isNewBestStreak: false,
        lastAnswerCorrect: null,
      };
    }

    case 'TICK': {
      if (state.phase !== 'running') return state;

      if (state.timeRemaining <= 1) {
        // Time expired! Complete sprint
        const finalElapsed = SPRINT_DURATION_SECONDS;
        const accuracy = calculateAccuracy(state.stats.correctCount, state.stats.totalAttempted);
        const ppm = calculatePPM(state.stats.correctCount, finalElapsed);

        const hasActivity = state.stats.totalAttempted > 0 || state.stats.correctCount > 0;
        const currentBests = state.personalBests;
        const isNewHighScore = hasActivity && state.stats.correctCount > currentBests.highScore;
        const isNewBestStreak = hasActivity && state.stats.bestStreak > currentBests.bestStreak;

        const updatedBests = hasActivity
          ? savePersonalBests({
              highScore: Math.max(currentBests.highScore, state.stats.correctCount),
              bestStreak: Math.max(currentBests.bestStreak, state.stats.bestStreak),
              totalGamesPlayed: currentBests.totalGamesPlayed + 1,
            })
          : currentBests;

        if (hasActivity) {
          recordSprintRun({
            id: state.runId,
            score: state.stats.correctCount,
            totalAttempted: state.stats.totalAttempted,
            accuracyPercentage: accuracy,
            problemsPerMinute: ppm,
            bestStreak: state.stats.bestStreak,
            missedCount: state.stats.missedProblems.length,
            durationSeconds: SPRINT_DURATION_SECONDS,
          });
        }

        return {
          ...state,
          phase: 'completed',
          timeRemaining: 0,
          stats: {
            ...state.stats,
            accuracyPercentage: accuracy,
            problemsPerMinute: ppm,
          },
          personalBests: updatedBests,
          isNewHighScore,
          isNewBestStreak,
        };
      }

      const nextTimeRemaining = state.timeRemaining - 1;
      const elapsed = SPRINT_DURATION_SECONDS - nextTimeRemaining;
      const accuracy = calculateAccuracy(state.stats.correctCount, state.stats.totalAttempted);
      const ppm = calculatePPM(state.stats.correctCount, elapsed > 0 ? elapsed : 1);

      return {
        ...state,
        timeRemaining: nextTimeRemaining,
        stats: {
          ...state.stats,
          accuracyPercentage: accuracy,
          problemsPerMinute: ppm,
        },
      };
    }

    case 'SUBMIT_ANSWER': {
      if (state.phase !== 'running' || !state.currentProblem) return state;

      const answer = action.payload.answer;
      const isCorrect = answer !== '' && evaluateAnswer(state.currentProblem, answer);
      recordMathProblemAttempt(state.currentProblem.factorA, state.currentProblem.factorB, isCorrect);
      const totalAttempted = state.stats.totalAttempted + 1;
      const correctCount = isCorrect ? state.stats.correctCount + 1 : state.stats.correctCount;
      const incorrectCount = isCorrect ? state.stats.incorrectCount : state.stats.incorrectCount + 1;
      const streak = isCorrect ? state.stats.streak + 1 : 0;
      const bestStreak = Math.max(state.stats.bestStreak, streak);
      const elapsed = SPRINT_DURATION_SECONDS - state.timeRemaining;
      const accuracyPercentage = calculateAccuracy(correctCount, totalAttempted);
      const problemsPerMinute = calculatePPM(correctCount, elapsed > 0 ? elapsed : 1);

      const missedProblems = isCorrect
        ? state.stats.missedProblems
        : [
            ...state.stats.missedProblems,
            {
              problem: state.currentProblem,
              submittedAnswer: answer || 'Skipped',
              correctAnswer: state.currentProblem.product,
            },
          ];

      const previousPair = state.currentProblem
        ? { factorA: state.currentProblem.factorA, factorB: state.currentProblem.factorB }
        : undefined;
      const history = state.recentProblemPairs || (previousPair ? [previousPair] : []);

      const {
        problem: nextProblem,
        remainingDeck,
        recentProblems,
      } = drawProblemFromDeck(state.problemDeck || [], history);

      return {
        ...state,
        currentProblem: nextProblem,
        problemDeck: remainingDeck,
        recentProblemPairs: recentProblems,
        lastAnswerCorrect: isCorrect,
        stats: {
          ...state.stats,
          correctCount,
          incorrectCount,
          totalAttempted,
          streak,
          bestStreak,
          accuracyPercentage,
          problemsPerMinute,
          missedProblems,
        },
      };
    }

    case 'END_GAME': {
      const elapsed = SPRINT_DURATION_SECONDS - state.timeRemaining;
      const accuracy = calculateAccuracy(state.stats.correctCount, state.stats.totalAttempted);
      const ppm = calculatePPM(state.stats.correctCount, elapsed > 0 ? elapsed : SPRINT_DURATION_SECONDS);

      const hasActivity = state.stats.totalAttempted > 0 || state.stats.correctCount > 0;
      const currentBests = state.personalBests;
      const isNewHighScore = hasActivity && state.stats.correctCount > currentBests.highScore;
      const isNewBestStreak = hasActivity && state.stats.bestStreak > currentBests.bestStreak;

      const updatedBests = hasActivity
        ? savePersonalBests({
            highScore: Math.max(currentBests.highScore, state.stats.correctCount),
            bestStreak: Math.max(currentBests.bestStreak, state.stats.bestStreak),
            totalGamesPlayed: currentBests.totalGamesPlayed + 1,
          })
        : currentBests;

      if (hasActivity) {
        recordSprintRun({
          id: state.runId,
          score: state.stats.correctCount,
          totalAttempted: state.stats.totalAttempted,
          accuracyPercentage: accuracy,
          problemsPerMinute: ppm,
          bestStreak: state.stats.bestStreak,
          missedCount: state.stats.missedProblems.length,
          durationSeconds: elapsed > 0 ? elapsed : 1,
        });
      }

      return {
        ...state,
        phase: 'completed',
        stats: {
          ...state.stats,
          accuracyPercentage: accuracy,
          problemsPerMinute: ppm,
        },
        personalBests: updatedBests,
        isNewHighScore,
        isNewBestStreak,
      };
    }

    case 'RESET_GAME': {
      return {
        ...initialGameState,
        personalBests: loadPersonalBests(),
      };
    }

    case 'SET_PERSONAL_BESTS': {
      return {
        ...state,
        personalBests: action.payload,
      };
    }

    default:
      return state;
  }
}
