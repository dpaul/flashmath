import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModeSelector } from './ModeSelector';

describe('ModeSelector Component', () => {
  it('renders Math Sprint and Spelling Practice cards', () => {
    const handleSelect = vi.fn();
    render(
      <ModeSelector
        onSelectMode={handleSelect}
        mathHighScore={42}
        mathBestStreak={15}
      />
    );

    expect(screen.getByText(/Math Sprint/i)).toBeInTheDocument();
    expect(screen.getByText(/Spelling Practice/i)).toBeInTheDocument();
    expect(screen.getByText(/3-Minute Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Untimed Speech Practice/i)).toBeInTheDocument();
  });

  it('calls onSelectMode with "math" when clicking Math Sprint', () => {
    const handleSelect = vi.fn();
    render(
      <ModeSelector
        onSelectMode={handleSelect}
        mathHighScore={42}
        mathBestStreak={15}
      />
    );

    const mathCard = screen.getByRole('button', { name: /start math sprint/i });
    fireEvent.click(mathCard);
    expect(handleSelect).toHaveBeenCalledWith('math');
  });

  it('calls onSelectMode with "spelling" when clicking Spelling Practice', () => {
    const handleSelect = vi.fn();
    render(
      <ModeSelector
        onSelectMode={handleSelect}
        mathHighScore={42}
        mathBestStreak={15}
      />
    );

    const spellingCard = screen.getByRole('button', { name: /start spelling practice/i });
    fireEvent.click(spellingCard);
    expect(handleSelect).toHaveBeenCalledWith('spelling');
  });
});
