import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Flashcard } from './Flashcard';

describe('Flashcard Component with Fuzzy Particles', () => {
  const sampleProblem = { id: 'p1', factorA: 6, factorB: 7, product: 42 };

  it('renders ambient smoke container continuously while suppressing burst initially', () => {
    render(
      <Flashcard
        problem={sampleProblem}
        streak={0}
        lastAnswerCorrect={null}
        submissionCount={0}
      />
    );
    expect(screen.getByTestId('ambient-smoke-container')).toBeInTheDocument();
    expect(screen.queryByTestId('fuzzy-particles-container')).not.toBeInTheDocument();
  });

  it('renders fuzzy particles when answer is submitted as correct', () => {
    render(
      <Flashcard
        problem={sampleProblem}
        streak={1}
        lastAnswerCorrect={true}
        submissionCount={1}
      />
    );
    const container = screen.getByTestId('fuzzy-particles-container');
    expect(container).toBeInTheDocument();

    const particles = screen.getAllByTestId('fuzzy-particle');
    expect(particles.length).toBeGreaterThan(0);
  });

  it('renders fuzzy particles when answer is submitted as incorrect', () => {
    render(
      <Flashcard
        problem={sampleProblem}
        streak={0}
        lastAnswerCorrect={false}
        submissionCount={2}
      />
    );
    const container = screen.getByTestId('fuzzy-particles-container');
    expect(container).toBeInTheDocument();
  });
});
