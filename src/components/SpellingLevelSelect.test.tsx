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

    expect(screen.getByText(/Level 1 Words/i)).toBeInTheDocument();
    expect(screen.getByText(/24 words/i)).toBeInTheDocument();
  });

  it('displays persistent level stats when available', () => {
    spellingStorage.saveLevelStats({
      levelId: 'level-1',
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

    const levelBtn = screen.getByRole('button', { name: /level 1 words/i });
    fireEvent.click(levelBtn);

    expect(handleSelect).toHaveBeenCalledWith('level-1');
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
});
