import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Flashcard } from './Flashcard';
import { AnswerInput } from './AnswerInput';
import { Keypad } from './Keypad';
import { TimerBar } from './TimerBar';

describe('Flashcard Component', () => {
  it('renders factors and streak correctly', () => {
    const problem = { id: 'p1', factorA: 8, factorB: 7, product: 56 };
    render(<Flashcard problem={problem} streak={5} lastAnswerCorrect={true} />);

    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText(/5 Streak/i)).toBeInTheDocument();
  });
});

describe('AnswerInput Component', () => {
  it('calls onSubmit on Enter key press and clears input', () => {
    const onSubmit = vi.fn();
    render(<AnswerInput onSubmit={onSubmit} autoFocus={true} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '42' } });
    expect(input.value).toBe('42');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSubmit).toHaveBeenCalledWith('42');
    expect(input.value).toBe('');
  });

  it('submits on clicking the submit button', () => {
    const onSubmit = vi.fn();
    render(<AnswerInput onSubmit={onSubmit} autoFocus={true} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '56' } });

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith('56');
  });
});

describe('Keypad Component', () => {
  it('handles digit and action button clicks', () => {
    const onDigit = vi.fn();
    const onBackspace = vi.fn();
    const onSubmit = vi.fn();

    render(<Keypad onDigit={onDigit} onBackspace={onBackspace} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: '7' }));
    expect(onDigit).toHaveBeenCalledWith('7');

    fireEvent.click(screen.getByRole('button', { name: /backspace/i }));
    expect(onBackspace).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(onSubmit).toHaveBeenCalled();
  });
});

describe('TimerBar Component', () => {
  it('renders time formatted MM:SS and progress bar', () => {
    const { rerender } = render(<TimerBar timeRemaining={180} />);
    expect(screen.getByText('3:00')).toBeInTheDocument();

    rerender(<TimerBar timeRemaining={25} />);
    expect(screen.getByText('0:25')).toBeInTheDocument();
  });
});
