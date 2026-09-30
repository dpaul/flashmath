import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SpellingInput } from './SpellingInput';

describe('SpellingInput Component', () => {
  it('renders input field, submits typed word on Enter or submit button', () => {
    const handleSubmit = vi.fn();
    const handleNext = vi.fn();

    render(
      <SpellingInput
        targetWord="calendar"
        onSubmit={handleSubmit}
        onNextWord={handleNext}
        lastAttemptCorrect={null}
        isRevealingWord={false}
      />
    );

    const input = screen.getByLabelText(/type spelling/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'calendar' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleSubmit).toHaveBeenCalledWith('calendar');
  });

  it('displays the revealed correct word and next button when isRevealingWord is true', () => {
    const handleSubmit = vi.fn();
    const handleNext = vi.fn();

    render(
      <SpellingInput
        targetWord="calendar"
        onSubmit={handleSubmit}
        onNextWord={handleNext}
        lastAttemptCorrect={false}
        isRevealingWord={true}
      />
    );

    expect(screen.getByText(/correct spelling:/i)).toBeInTheDocument();
    expect(screen.getByText(/calendar/i)).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /next word/i });
    expect(nextBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('shows both the misspelled word and correct spelling with error highlighting', () => {
    const handleSubmit = vi.fn();
    const handleNext = vi.fn();

    render(
      <SpellingInput
        targetWord="dictator"
        onSubmit={handleSubmit}
        onNextWord={handleNext}
        lastAttemptCorrect={false}
        isRevealingWord={true}
        lastSubmittedAnswer="dictater"
      />
    );

    expect(screen.getByText(/correct spelling:/i)).toBeInTheDocument();
    expect(screen.getByText(/dictator/i)).toBeInTheDocument();
    expect(screen.getByText(/you typed:/i)).toBeInTheDocument();
    expect(screen.getByText(/changed/i)).toBeInTheDocument();
    expect(screen.getByText('Transformed')).toBeInTheDocument();
  });
});
