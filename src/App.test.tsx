import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByRole('button', { name: /level 1 words/i })).toBeInTheDocument();

    // Select Level 1 Words
    fireEvent.click(screen.getByRole('button', { name: /level 1 words/i }));

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
});
