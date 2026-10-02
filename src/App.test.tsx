import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as speechService from './services/speechSynthesis';

vi.mock('./services/speechSynthesis', () => ({
  speakWord: vi.fn(),
  cancelSpeech: vi.fn(),
  isSpeechSynthesisSupported: vi.fn(() => true),
}));

describe('FlashMath App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    window.location.hash = '';
    window.history.replaceState(null, '', '/');
  });

  it('renders ModeSelector by default with Math and Spelling options', () => {
    render(<App />);
    expect(screen.getByText(/FlashMath Learning Hub/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start math sprint/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start spelling practice/i })).toBeInTheDocument();
  });

  it('navigates through Math start, active sprint, answer submission, and results', () => {
    render(<App />);

    // Click Math Sprint on landing page
    fireEvent.click(screen.getByRole('button', { name: /start math sprint/i }));

    // Start Screen
    expect(screen.getByText('Start Challenge')).toBeInTheDocument();
    expect(screen.getAllByText(/Tables 2–12/i)[0]).toBeInTheDocument();

    // Start sprint
    fireEvent.click(screen.getByRole('button', { name: /start challenge/i }));

    // Now in running phase
    expect(screen.getByText(/Time Remaining/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/calculation answer/i)).toBeInTheDocument();

    // Type an answer
    const input = screen.getByLabelText(/calculation answer/i) as HTMLInputElement;
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

  it('supports on-screen keypad inputs when active in math sprint', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start math sprint/i }));
    fireEvent.click(screen.getByRole('button', { name: /start challenge/i }));

    const digit8Btn = screen.getByRole('button', { name: '8' });
    const digit4Btn = screen.getByRole('button', { name: '4' });
    const input = screen.getByLabelText(/calculation answer/i) as HTMLInputElement;

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

  it('navigates to History view from math and back to sprint', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start math sprint/i }));

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

  it('navigates into Spelling Practice, selects level, drills word, and returns', async () => {
    render(<App />);

    // Click Spelling Practice on landing page
    fireEvent.click(screen.getByRole('button', { name: /start spelling practice/i }));

    // Level select screen
    expect(screen.getByText(/Spelling Levels/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /September 12, 2026/i })).toBeInTheDocument();

    // Select September 12, 2026 list
    fireEvent.click(screen.getByRole('button', { name: /September 12, 2026/i }));

    // Now in SpellingPracticeView
    expect(screen.getByText(/Word 1 of/i)).toBeInTheDocument();
    expect(speechService.speakWord).toHaveBeenCalled();

    // Submit an answer
    const input = screen.getByLabelText(/type spelling here/i);
    fireEvent.change(input, { target: { value: 'thank' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Navigate back to levels
    const levelsBtn = screen.getByRole('button', { name: /levels/i });
    fireEvent.click(levelsBtn);
    expect(screen.getByText(/Spelling Levels/i)).toBeInTheDocument();

    // Navigate back to modes
    const backModesBtn = screen.getByRole('button', { name: /back to modes/i });
    fireEvent.click(backModesBtn);
    expect(screen.getByText(/FlashMath Learning Hub/i)).toBeInTheDocument();
  });

  it('navigates to Spelling Word Set History from level select and supports level tab switching', () => {
    render(<App />);

    // Click Spelling Practice on landing page
    fireEvent.click(screen.getByRole('button', { name: /start spelling practice/i }));

    // Click Spelling History in header or top bar
    const historyBtn = screen.getAllByRole('button', { name: /spelling history/i })[0];
    fireEvent.click(historyBtn);

    // Verify Spelling History Page is displayed
    expect(screen.getByText(/Spelling Word Set History/i)).toBeInTheDocument();
    expect(screen.getByText(/Words Gotten Wrong Most/i)).toBeInTheDocument();
    expect(screen.getByText(/% Correct Over Time/i)).toBeInTheDocument();

    // Switch to September 28, 2026
    const sep28Tab = screen.getByRole('button', { name: 'September 28, 2026' });
    fireEvent.click(sep28Tab);
    expect(screen.getByText(/Latin roots \(dict, aud, vis\)/i)).toBeInTheDocument();

    // Back to levels
    const backBtn = screen.getAllByRole('button', { name: /back to levels/i })[0];
    fireEvent.click(backBtn);
    expect(screen.getByText(/Spelling Levels/i)).toBeInTheDocument();
  });

  it('supports Space to skip problem and Escape to finish early in math sprint', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start math sprint/i }));
    fireEvent.click(screen.getByRole('button', { name: /start challenge/i }));

    expect(screen.getByText('100%')).toBeInTheDocument();

    // Press Space to skip current problem
    const input = screen.getByLabelText(/calculation answer/i);
    fireEvent.keyDown(input, { key: ' ', code: 'Space' });

    expect(screen.getByText('0%')).toBeInTheDocument();

    // Escape to finish sprint early
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.getByText(/Sprint Completed!/i)).toBeInTheDocument();
  });

  it('toggles between light paper mode and chalkboard dark mode', () => {
    render(<App />);

    const themeToggleBtn = screen.getByRole('button', { name: /switch to chalkboard dark mode/i });
    expect(themeToggleBtn).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to dark mode
    fireEvent.click(themeToggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('flashmath_theme')).toBe('dark');
    expect(screen.getByRole('button', { name: /switch to paper light mode/i })).toBeInTheDocument();

    // Toggle back to light mode
    fireEvent.click(screen.getByRole('button', { name: /switch to paper light mode/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('flashmath_theme')).toBe('light');
    expect(screen.getByRole('button', { name: /switch to chalkboard dark mode/i })).toBeInTheDocument();
  });

  it('navigates to Most Missed math practice drill from StartScreen and returns without polluting history', () => {
    // Record 7x8 missed twice
    localStorage.setItem(
      'flashmath_math_problem_stats_v1',
      JSON.stringify({
        '7x8': {
          id: '7x8',
          factorA: 7,
          factorB: 8,
          product: 56,
          attempts: 2,
          misses: 2,
          correct: 0,
        },
      })
    );

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start math sprint/i }));

    // StartScreen shows 1 trouble problem
    expect(screen.getByText(/1 trouble problem/i)).toBeInTheDocument();
    const practiceBtn = screen.getByRole('button', {
      name: /practice most missed multiplication problems/i,
    });
    fireEvent.click(practiceBtn);

    // Active in untimed practice view
    expect(screen.getByText(/Untimed Practice/i)).toBeInTheDocument();
    expect(screen.getByText(/Fact 1 of 1/i)).toBeInTheDocument();

    // Answer correctly
    const input = screen.getByLabelText(/your calculation answer/i);
    fireEvent.change(input, { target: { value: '56' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Completed drill
    expect(screen.getByText(/Drill Complete!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to math sprint/i })).toBeInTheDocument();

    // Verify history was NOT polluted
    expect(localStorage.getItem('flashmath_run_history_v1')).toBeNull();

    // Click Back to Math Sprint
    fireEvent.click(screen.getByRole('button', { name: /back to math sprint/i }));
    expect(screen.getByRole('button', { name: /start challenge/i })).toBeInTheDocument();
  });

  it('updates the browser URL hash on navigation and supports browser back and forward button navigation', async () => {
    render(<App />);

    // Initially at mode select
    expect(screen.getByText(/FlashMath Learning Hub/i)).toBeInTheDocument();

    // Navigate to math sprint
    fireEvent.click(screen.getByRole('button', { name: /start math sprint/i }));
    expect(window.location.hash).toBe('#/math');
    expect(screen.getByRole('button', { name: /start challenge/i })).toBeInTheDocument();

    // Navigate to history from math
    fireEvent.click(screen.getByRole('button', { name: /view history/i }));
    expect(window.location.hash).toBe('#/math/history');
    expect(screen.getByText(/Sprint History & Trends/i)).toBeInTheDocument();

    // Simulate browser Back button: URL goes back to #/math
    window.location.hash = '#/math';
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start challenge/i })).toBeInTheDocument();
    });

    // Simulate browser Back button again: URL goes back to #/
    window.location.hash = '#/';
    await waitFor(() => {
      expect(screen.getByText(/FlashMath Learning Hub/i)).toBeInTheDocument();
    });

    // Simulate browser Forward button: URL goes forward to #/math
    window.location.hash = '#/math';
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start challenge/i })).toBeInTheDocument();
    });
  });

  it('supports deep linking directly to sub-views via URL hash on load', () => {
    window.location.hash = '#/spelling/practice?level=2026-09-12';
    render(<App />);

    expect(screen.getByText(/September 12, 2026/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type spelling here/i)).toBeInTheDocument();
  });
});

