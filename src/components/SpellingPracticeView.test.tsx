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
        levelId="level-1"
        onBackToLevels={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    expect(screen.getByText(/Level 1 Words/i)).toBeInTheDocument();
    expect(speechService.speakWord).toHaveBeenCalled();

    const replayBtn = screen.getByRole('button', { name: /repeat word|listen to word/i });
    fireEvent.click(replayBtn);
    expect(speechService.speakWord).toHaveBeenCalledTimes(2);
  });

  it('handles correct answer submission and updates session stats', async () => {
    const updateStatsSpy = vi.spyOn(spellingStorage, 'updateLevelStatsFromSession');

    render(
      <SpellingPracticeView
        levelId="level-1"
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
        'level-1',
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
        levelId="level-1"
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

  it('completes the session when all words in the list are completed and displays completion recap with time and score', async () => {
    const recordRunSpy = vi.spyOn(spellingStorage, 'recordCompletedSpellingRun');

    render(
      <SpellingPracticeView
        levelId="level-1"
        onBackToLevels={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    // Practice all 24 words in Level 1
    for (let i = 0; i < 24; i++) {
      const input = screen.getByLabelText(/type spelling/i);
      const spokenWord = vi.mocked(speechService.speakWord).mock.calls[i][0];
      fireEvent.change(input, { target: { value: spokenWord } });
      fireEvent.keyDown(input, { key: 'Enter' });
    }

    // Expect completion screen to be visible
    expect(await screen.findByText(/Level Complete!/i)).toBeInTheDocument();
    expect(screen.getByText(/24 \/ 24/i)).toBeInTheDocument();
    expect(screen.getByText(/Time:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /practice again/i })).toBeInTheDocument();

    expect(recordRunSpy).toHaveBeenCalledWith(
      'level-1',
      expect.objectContaining({
        correctCount: 24,
        totalWords: 24,
      })
    );
  });
});
