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

  it('navigates to History view from header and back to sprint', () => {
    render(<App />);

    // Click History in header
    const historyBtn = screen.getByRole('button', { name: /view history/i });
    fireEvent.click(historyBtn);

    // Verify History page rendered
    expect(screen.getByText(/Sprint History & Trends/i)).toBeInTheDocument();
    expect(screen.getByText(/no sprint history yet/i)).toBeInTheDocument();

    // Click Back to Sprint in header or page
    const backBtn = screen.getAllByRole('button', { name: /back to sprint/i })[0];
    fireEvent.click(backBtn);

    // Back on start screen
    expect(screen.getByText('Start Challenge')).toBeInTheDocument();
  });

  it('navigates to History view from Results screen and allows clearing history', () => {
    render(<App />);

    // Start sprint
    fireEvent.click(screen.getByRole('button', { name: /start challenge/i }));

    // Abort/finish sprint early
    fireEvent.click(screen.getByRole('button', { name: /end sprint/i }));

    // On Results screen, shortcut button should exist
    const viewHistoryShortcut = screen.getByRole('button', { name: /view history & trends/i });
    expect(viewHistoryShortcut).toBeInTheDocument();
    fireEvent.click(viewHistoryShortcut);

    // Now on History page, we should have 1 run recorded
    expect(screen.getByText(/Sprint History & Trends/i)).toBeInTheDocument();
    expect(screen.getByText(/1 run/i)).toBeInTheDocument();

    // Clear history flow
    const clearBtn = screen.getByRole('button', { name: /clear sprint history/i });
    fireEvent.click(clearBtn);

    // Modal dialog pops up
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/clear sprint history\?/i)).toBeInTheDocument();

    // Confirm clear
    const confirmBtn = screen.getByRole('button', { name: /clear all history/i });
    fireEvent.click(confirmBtn);

    // Dialog closed and empty state shown
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/no sprint history yet/i)).toBeInTheDocument();
  });
});
