import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Flashcard } from './Flashcard';

describe('Flashcard Component', () => {
  const sampleProblem = { id: 'p1', factorA: 6, factorB: 7, product: 42 };

  it('renders problem factors, card number, and question mark', () => {
    render(
      <Flashcard
        problem={sampleProblem}
        streak={0}
        lastAnswerCorrect={null}
        submissionCount={0}
      />
    );
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();

    // Verify particle containers are NOT rendered
    expect(screen.queryByTestId('ambient-smoke-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('fuzzy-particles-container')).not.toBeInTheDocument();
  });

  it('renders streak indicator and correct feedback border without particles when answer is correct', () => {
    render(
      <Flashcard
        problem={sampleProblem}
        streak={5}
        lastAnswerCorrect={true}
        submissionCount={1}
      />
    );
    expect(screen.getByText('5 Streak')).toBeInTheDocument();

    const region = screen.getByRole('region');
    expect(region.className).toContain('border-[#2aa198]/25');

    // Verify particle containers are NOT rendered
    expect(screen.queryByTestId('fuzzy-particles-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ambient-smoke-container')).not.toBeInTheDocument();
  });

  it('renders incorrect feedback border with shake animation without particles when answer is incorrect', () => {
    render(
      <Flashcard
        problem={sampleProblem}
        streak={0}
        lastAnswerCorrect={false}
        submissionCount={2}
      />
    );
    const region = screen.getByRole('region');
    expect(region.className).toContain('border-[#cb4b16]/25');
    expect(region.className).toContain('animate-shake');

    // Verify particle containers are NOT rendered
    expect(screen.queryByTestId('fuzzy-particles-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ambient-smoke-container')).not.toBeInTheDocument();
  });
});
