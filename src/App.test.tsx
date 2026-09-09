import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('FlashMath App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('navigates through start, active sprint, answer submission, and results', () => {
    render(<App />);

    // Start Screen
    expect(screen.getByText('Start Challenge')).toBeInTheDocument();
    expect(screen.getAllByText(/Tables 2–12/i)[0]).toBeInTheDocument();

    // Start sprint
    fireEvent.click(screen.getByRole('button', { name: /start challenge/i }));

    // Now in running phase
    expect(screen.getByText(/Time Remaining/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Answer.../i)).toBeInTheDocument();

    // Type an answer
    const input = screen.getByPlaceholderText(/Answer.../i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '42' } });
    expect(input.value).toBe('42');

    // Submit via Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(input.value).toBe('');

    // End sprint early to verify results transition
    const endSprintBtn = screen.getByRole('button', { name: /end sprint/i });
    fireEvent.click(endSprintBtn);

    // Results screen
    expect(screen.getByText(/Sprint Completed!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();

    // Restart game
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    expect(screen.getByRole('button', { name: /start challenge/i })).toBeInTheDocument();
  });

  it('supports on-screen keypad inputs when active', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start challenge/i }));

    const digit8Btn = screen.getByRole('button', { name: '8' });
    const digit4Btn = screen.getByRole('button', { name: '4' });
    const input = screen.getByPlaceholderText(/Answer.../i) as HTMLInputElement;

    fireEvent.click(digit8Btn);
    fireEvent.click(digit4Btn);
    expect(input.value).toBe('84');

    const backspaceBtn = screen.getByRole('button', { name: /backspace/i });
    fireEvent.click(backspaceBtn);
    expect(input.value).toBe('8');

    // Keypad submit
    const keypadSubmitBtn = screen.getAllByRole('button', { name: /enter/i })[1] || screen.getAllByRole('button', { name: /enter/i })[0];
    fireEvent.click(keypadSubmitBtn);
    expect(input.value).toBe('');
  });
});
