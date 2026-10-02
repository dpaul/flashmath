import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpellingLevelSelect } from './SpellingLevelSelect';
import * as spellingStorage from '../engine/spellingStorage';

describe('SpellingLevelSelect Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders available spelling levels and word counts', () => {
    const handleSelect = vi.fn();
    const handleBack = vi.fn();

    render(
      <SpellingLevelSelect
        onSelectLevel={handleSelect}
        onBackToHome={handleBack}
      />
    );

    expect(screen.getByText(/September 12, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/September 15, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/September 28, 2026/i)).toBeInTheDocument();
    expect(screen.getAllByText(/24 words/i)).toHaveLength(2);
    expect(screen.getByText(/22 words/i)).toBeInTheDocument();
  });

  it('displays persistent level stats when available', () => {
    spellingStorage.saveLevelStats({
      levelId: '2026-09-12',
      totalAttempts: 20,
      correctCount: 18,
      bestStreak: 12,
      missedWords: [],
      lastPracticedAt: new Date().toISOString(),
    });

    render(
      <SpellingLevelSelect
        onSelectLevel={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    expect(screen.getByText(/90%/i)).toBeInTheDocument(); // 18/20 = 90%
    expect(screen.getByText(/12 Streak/i)).toBeInTheDocument();
  });

  it('calls onSelectLevel when a level card is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <SpellingLevelSelect
        onSelectLevel={handleSelect}
        onBackToHome={vi.fn()}
      />
    );

    const levelBtn = screen.getByRole('button', { name: /September 12, 2026/i });
    fireEvent.click(levelBtn);

    expect(handleSelect).toHaveBeenCalledWith('2026-09-12');
  });

  it('calls onBackToHome when clicking the back button', () => {
    const handleBack = vi.fn();
    render(
      <SpellingLevelSelect
        onSelectLevel={vi.fn()}
        onBackToHome={handleBack}
      />
    );

    const backBtn = screen.getByRole('button', { name: /back to modes/i });
    fireEvent.click(backBtn);

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders Most Missed Words mode card with 0 trouble words when none are recorded', () => {
    render(
      <SpellingLevelSelect
        onSelectLevel={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    expect(screen.getByText('Most Missed Words')).toBeInTheDocument();
    expect(screen.getByText(/0 trouble words/i)).toBeInTheDocument();
    expect(screen.getByText(/No misses yet/i)).toBeInTheDocument();

    const missedBtn = screen.getByRole('button', { name: /practice most missed words/i });
    expect(missedBtn).toBeDisabled();
  });

  it('renders active Most Missed Words mode card with trouble words and launches session on click', () => {
    // Record mistakes
    spellingStorage.updateLevelStatsFromSession('2026-09-12', {
      attempts: 1,
      correct: 0,
      streak: 0,
      missed: ['fruit', 'climb'],
      word: 'fruit',
    });

    const handleSelect = vi.fn();
    render(
      <SpellingLevelSelect
        onSelectLevel={handleSelect}
        onBackToHome={vi.fn()}
      />
    );

    expect(screen.getByText('Most Missed Words')).toBeInTheDocument();
    expect(screen.getByText(/2 trouble words/i)).toBeInTheDocument();
    expect(screen.getByText('fruit')).toBeInTheDocument();
    expect(screen.getByText('climb')).toBeInTheDocument();

    const missedBtn = screen.getByRole('button', { name: /practice most missed words/i });
    expect(missedBtn).not.toBeDisabled();

    fireEvent.click(missedBtn);
    expect(handleSelect).toHaveBeenCalledWith('most-missed');
  });
});
