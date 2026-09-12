import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpellingPracticeView } from './SpellingPracticeView';
import * as speechService from '../services/speechSynthesis';
import * as spellingStorage from '../engine/spellingStorage';

vi.mock('../services/speechSynthesis', () => ({
  speakWord: vi.fn(),
  cancelSpeech: vi.fn(),
  isSpeechSynthesisSupported: vi.fn(() => true),
}));

describe('SpellingPracticeView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders level info, automatically speaks word on mount, and allows manual replay', () => {
    render(
      <SpellingPracticeView
        levelId="grade-4"
        onBackToLevels={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    expect(screen.getByText(/4th Grade Words/i)).toBeInTheDocument();
    expect(speechService.speakWord).toHaveBeenCalled();

    const replayBtn = screen.getByRole('button', { name: /repeat word|listen to word/i });
    fireEvent.click(replayBtn);
    expect(speechService.speakWord).toHaveBeenCalledTimes(2);
  });

  it('handles correct answer submission and updates session stats', async () => {
    const updateStatsSpy = vi.spyOn(spellingStorage, 'updateLevelStatsFromSession');

    render(
      <SpellingPracticeView
        levelId="grade-4"
        onBackToLevels={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/type spelling/i);

    // Get the word that was spoken
    const targetWord = vi.mocked(speechService.speakWord).mock.calls[0][0];

    fireEvent.change(input, { target: { value: targetWord } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(updateStatsSpy).toHaveBeenCalledWith(
        'grade-4',
        expect.objectContaining({
          attempts: 1,
          correct: 1,
          streak: 1,
        })
      );
    });
  });

  it('handles incorrect answer by revealing the word and allowing advancement', async () => {
    render(
      <SpellingPracticeView
        levelId="grade-4"
        onBackToLevels={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/type spelling/i);
    fireEvent.change(input, { target: { value: 'definitelynotthewordxyz' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(await screen.findByText(/correct spelling:/i)).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /next word/i });
    fireEvent.click(nextBtn);

    // After advancing, input is visible again and next word is spoken
    await waitFor(() => {
      expect(screen.getByLabelText(/type spelling/i)).toBeInTheDocument();
      expect(speechService.speakWord).toHaveBeenCalledTimes(2);
    });
  });
});
