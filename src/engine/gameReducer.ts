import { generateProblem, evaluateAnswer } from './math';
import { loadPersonalBests, savePersonalBests } from './storage';
import { recordSprintRun } from './historyStorage';
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
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const personalBests = loadPersonalBests();
      const firstProblem = generateProblem();
      const runId = `sprint-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      return {
        ...state,
        phase: 'running',
        timeRemaining: SPRINT_DURATION_SECONDS,
        currentProblem: firstProblem,
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

        const currentBests = state.personalBests;
        const isNewHighScore = state.stats.correctCount > currentBests.highScore;
        const isNewBestStreak = state.stats.bestStreak > currentBests.bestStreak;

        const updatedBests = savePersonalBests({
          highScore: Math.max(currentBests.highScore, state.stats.correctCount),
          bestStreak: Math.max(currentBests.bestStreak, state.stats.bestStreak),
          totalGamesPlayed: currentBests.totalGamesPlayed + 1,
        });

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

      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
      };
    }

    case 'SUBMIT_ANSWER': {
      if (state.phase !== 'running' || !state.currentProblem) return state;

      const isCorrect = evaluateAnswer(state.currentProblem, action.payload.answer);
      const totalAttempted = state.stats.totalAttempted + 1;
      const correctCount = isCorrect ? state.stats.correctCount + 1 : state.stats.correctCount;
      const incorrectCount = isCorrect ? state.stats.incorrectCount : state.stats.incorrectCount + 1;
      const streak = isCorrect ? state.stats.streak + 1 : 0;
      const bestStreak = Math.max(state.stats.bestStreak, streak);

      const missedProblems = isCorrect
        ? state.stats.missedProblems
        : [
            ...state.stats.missedProblems,
            {
              problem: state.currentProblem,
              submittedAnswer: action.payload.answer,
              correctAnswer: state.currentProblem.product,
            },
          ];

      const nextProblem = generateProblem(state.currentProblem);

      return {
        ...state,
        currentProblem: nextProblem,
        lastAnswerCorrect: isCorrect,
        stats: {
          ...state.stats,
          correctCount,
          incorrectCount,
          totalAttempted,
          streak,
          bestStreak,
          missedProblems,
        },
      };
    }

    case 'END_GAME': {
      const elapsed = SPRINT_DURATION_SECONDS - state.timeRemaining;
      const accuracy = calculateAccuracy(state.stats.correctCount, state.stats.totalAttempted);
      const ppm = calculatePPM(state.stats.correctCount, elapsed > 0 ? elapsed : SPRINT_DURATION_SECONDS);

      const currentBests = state.personalBests;
      const isNewHighScore = state.stats.correctCount > currentBests.highScore;
      const isNewBestStreak = state.stats.bestStreak > currentBests.bestStreak;

      const updatedBests = savePersonalBests({
        highScore: Math.max(currentBests.highScore, state.stats.correctCount),
        bestStreak: Math.max(currentBests.bestStreak, state.stats.bestStreak),
        totalGamesPlayed: currentBests.totalGamesPlayed + 1,
      });

      recordSprintRun({
        id: state.runId,
        score: state.stats.correctCount,
        totalAttempted: state.stats.totalAttempted,
        accuracyPercentage: accuracy,
        problemsPerMinute: ppm,
        bestStreak: state.stats.bestStreak,
        missedCount: state.stats.missedProblems.length,
        durationSeconds: elapsed > 0 ? elapsed : SPRINT_DURATION_SECONDS,
      });

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
