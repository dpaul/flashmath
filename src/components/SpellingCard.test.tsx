import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SpellingCard } from './SpellingCard';

describe('SpellingCard Component', () => {
  it('renders card header, level name, and audio replay button', () => {
    const handleSpeak = vi.fn();
    render(
      <SpellingCard
        word="calendar"
        streak={3}
        lastAttemptCorrect={null}
        levelName="4th Grade Words"
        cardNumber={1}
        onSpeak={handleSpeak}
      >
        <input data-testid="test-input" />
      </SpellingCard>
    );

    expect(screen.getByText(/4th Grade Words/i)).toBeInTheDocument();
    expect(screen.getByText(/3 Streak/i)).toBeInTheDocument();
    expect(screen.getByTestId('test-input')).toBeInTheDocument();

    const replayButton = screen.getByRole('button', { name: /listen to word|repeat word/i });
    expect(replayButton).toBeInTheDocument();

    fireEvent.click(replayButton);
    expect(handleSpeak).toHaveBeenCalledTimes(1);
  });

  it('triggers onSpeak when Space hotkey is pressed on the window/card when not typing inside an input', () => {
    const handleSpeak = vi.fn();
    render(
      <SpellingCard
        word="calendar"
        streak={0}
        lastAttemptCorrect={null}
        levelName="4th Grade Words"
        cardNumber={1}
        onSpeak={handleSpeak}
      />
    );

    fireEvent.keyDown(window, { key: ' ' });
    expect(handleSpeak).toHaveBeenCalled();
  });

  it('renders "Use it in a sentence" button and invokes onSpeakSentence when clicked', () => {
    const handleSpeakSentence = vi.fn();
    render(
      <SpellingCard
        word="thank"
        streak={0}
        lastAttemptCorrect={null}
        levelName="September 12, 2026"
        cardNumber={1}
        onSpeak={vi.fn()}
        sentence="I want to thank you for helping me."
        onSpeakSentence={handleSpeakSentence}
      />
    );

    const sentenceBtn = screen.getByRole('button', { name: /use it in a sentence/i });
    expect(sentenceBtn).toBeInTheDocument();

    fireEvent.click(sentenceBtn);
    expect(handleSpeakSentence).toHaveBeenCalledTimes(1);
  });

  it('displays masked sentence when showSentence is true, and unmasked when isRevealingWord is true', () => {
    const { rerender } = render(
      <SpellingCard
        word="thank"
        streak={0}
        lastAttemptCorrect={null}
        levelName="September 12, 2026"
        cardNumber={1}
        onSpeak={vi.fn()}
        sentence="I want to thank you for helping me."
        onSpeakSentence={vi.fn()}
        showSentence={true}
        isRevealingWord={false}
      />
    );

    expect(screen.getByTestId('sentence-preview')).toHaveTextContent('I want to _____ you for helping me.');

    rerender(
      <SpellingCard
        word="thank"
        streak={0}
        lastAttemptCorrect={false}
        levelName="September 12, 2026"
        cardNumber={1}
        onSpeak={vi.fn()}
        sentence="I want to thank you for helping me."
        onSpeakSentence={vi.fn()}
        showSentence={true}
        isRevealingWord={true}
      />
    );

    expect(screen.getByTestId('sentence-preview')).toHaveTextContent('I want to thank you for helping me.');
  });
});

