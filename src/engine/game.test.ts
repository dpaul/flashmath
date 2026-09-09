import { describe, it, expect, beforeEach } from 'vitest';
import {
  initialGameState,
  gameReducer,
  calculateAccuracy,
  calculatePPM,
  SPRINT_DURATION_SECONDS,
} from './gameReducer';

describe('Game Reducer & Calculations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('calculates accuracy percentage accurately', () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
    expect(calculateAccuracy(10, 10)).toBe(100);
    expect(calculateAccuracy(7, 10)).toBe(70);
    expect(calculateAccuracy(1, 3)).toBe(33.3);
  });

  it('calculates PPM (Problems Per Minute) accurately based on 3-minute sprint', () => {
    expect(calculatePPM(30, 180)).toBe(10);
    expect(calculatePPM(45, 180)).toBe(15);
    expect(calculatePPM(0, 180)).toBe(0);
    expect(calculatePPM(10, 60)).toBe(10);
  });

  it('starts game properly with 180 seconds countdown and generates first problem', () => {
    const state = gameReducer(initialGameState, { type: 'START_GAME' });
    expect(state.phase).toBe('running');
    expect(state.timeRemaining).toBe(SPRINT_DURATION_SECONDS);
    expect(state.currentProblem).not.toBeNull();
    expect(state.stats.totalAttempted).toBe(0);
    expect(state.stats.correctCount).toBe(0);
  });

  it('handles TICK action decrements timer and terminates round at 0', () => {
    let state = gameReducer(initialGameState, { type: 'START_GAME' });
    state = gameReducer(state, { type: 'TICK' });
    expect(state.timeRemaining).toBe(SPRINT_DURATION_SECONDS - 1);

    // Simulate timer reaching 1
    const almostDoneState = { ...state, timeRemaining: 1 };
    const finishedState = gameReducer(almostDoneState, { type: 'TICK' });
    expect(finishedState.timeRemaining).toBe(0);
    expect(finishedState.phase).toBe('completed');
  });

  it('handles correct answer submission updating stats and current problem', () => {
    let state = gameReducer(initialGameState, { type: 'START_GAME' });
    const initialProblem = state.currentProblem!;
    const correctAnswer = initialProblem.product;

    state = gameReducer(state, { type: 'SUBMIT_ANSWER', payload: { answer: String(correctAnswer) } });
    expect(state.stats.correctCount).toBe(1);
    expect(state.stats.totalAttempted).toBe(1);
    expect(state.stats.streak).toBe(1);
    expect(state.stats.bestStreak).toBe(1);
    expect(state.stats.missedProblems.length).toBe(0);
    expect(state.currentProblem).not.toBeNull();
    expect(state.lastAnswerCorrect).toBe(true);
  });

  it('handles incorrect answer submission recording missed problem and resetting streak', () => {
    let state = gameReducer(initialGameState, { type: 'START_GAME' });
    const initialProblem = state.currentProblem!;
    const wrongAnswer = initialProblem.product + 1;

    state = gameReducer(state, { type: 'SUBMIT_ANSWER', payload: { answer: String(wrongAnswer) } });
    expect(state.stats.correctCount).toBe(0);
    expect(state.stats.incorrectCount).toBe(1);
    expect(state.stats.totalAttempted).toBe(1);
    expect(state.stats.streak).toBe(0);
    expect(state.stats.missedProblems.length).toBe(1);
    expect(state.stats.missedProblems[0].problem.id).toBe(initialProblem.id);
    expect(state.stats.missedProblems[0].submittedAnswer).toBe(String(wrongAnswer));
    expect(state.stats.missedProblems[0].correctAnswer).toBe(initialProblem.product);
    expect(state.lastAnswerCorrect).toBe(false);
  });

  it('resets game to idle state when RESET_GAME is dispatched', () => {
    let state = gameReducer(initialGameState, { type: 'START_GAME' });
    state = gameReducer(state, { type: 'RESET_GAME' });
    expect(state.phase).toBe('idle');
    expect(state.timeRemaining).toBe(SPRINT_DURATION_SECONDS);
  });
});
