import { MultiplicationProblem } from './math';
export type { SprintRunRecord } from './historyStorage';

export type GamePhase = 'idle' | 'running' | 'completed';

export interface MissedProblem {
  problem: MultiplicationProblem;
  submittedAnswer: string;
  correctAnswer: number;
}

export interface GameStats {
  correctCount: number;
  incorrectCount: number;
  totalAttempted: number;
  streak: number;
  bestStreak: number;
  accuracyPercentage: number;
  problemsPerMinute: number;
  missedProblems: MissedProblem[];
}

export interface PersonalBests {
  highScore: number;
  bestStreak: number;
  totalGamesPlayed: number;
  lastPlayed?: string;
}

export interface GameState {
  phase: GamePhase;
  timeRemaining: number;
  currentProblem: MultiplicationProblem | null;
  stats: GameStats;
  personalBests: PersonalBests;
  isNewHighScore: boolean;
  isNewBestStreak: boolean;
  lastAnswerCorrect: boolean | null;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'TICK' }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: string } }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_PERSONAL_BESTS'; payload: PersonalBests };
