import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MathPracticeView } from './MathPracticeView';
import * as mathMistakesStorage from '../engine/mathMistakesStorage';
import * as historyStorage from '../engine/historyStorage';

describe('MathPracticeView Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders graceful empty state when no trouble facts have been missed more than once', () => {
    render(
      <MathPracticeView
        onBackToMath={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    expect(screen.getByText(/No Trouble Facts Recorded!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to math sprint/i })).toBeInTheDocument();
  });

  it('runs practice drill for trouble facts and updates attempt stats without touching sprint history', () => {
    // Record 7x8 missed twice so it qualifies
    mathMistakesStorage.recordMathProblemAttempt(7, 8, false);
    mathMistakesStorage.recordMathProblemAttempt(7, 8, false);

    const recordAttemptSpy = vi.spyOn(mathMistakesStorage, 'recordMathProblemAttempt');
    const recordSprintRunSpy = vi.spyOn(historyStorage, 'recordSprintRun');

    render(
      <MathPracticeView
        onBackToMath={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    expect(screen.getByText(/Untimed Practice/i)).toBeInTheDocument();
    expect(screen.getByText(/Fact 1 of 1/i)).toBeInTheDocument();

    const input = screen.getByLabelText(/your calculation answer/i);
    // Correct answer for 7 * 8 is 56
    fireEvent.change(input, { target: { value: '56' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Attempt is recorded in mathMistakesStorage
    expect(recordAttemptSpy).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      true
    );

    // CRITICAL: Must NOT count towards sprint run history
    expect(recordSprintRunSpy).not.toHaveBeenCalled();

    // Reaches completion screen
    expect(screen.getByText(/Drill Complete!/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /practice again/i })).toBeInTheDocument();
  });

  it('reveals correct answer when an incorrect answer is submitted', () => {
    mathMistakesStorage.recordMathProblemAttempt(6, 7, false);
    mathMistakesStorage.recordMathProblemAttempt(6, 7, false);

    render(
      <MathPracticeView
        onBackToMath={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/your calculation answer/i);
    // Submit wrong answer
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText(/Correct Fact/i)).toBeInTheDocument();
    expect(screen.getByText(/42/i)).toBeInTheDocument();
    expect(screen.getByText(/You answered:/i)).toBeInTheDocument();

    const finishBtn = screen.getByRole('button', { name: /finish drill/i });
    fireEvent.click(finishBtn);

    expect(screen.getByText(/Drill Complete!/i)).toBeInTheDocument();
    expect(screen.getByText(/Missed During This Drill/i)).toBeInTheDocument();
  });
});
