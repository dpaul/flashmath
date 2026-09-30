import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SpellingDiffView } from './SpellingDiffView';

describe('SpellingDiffView Component', () => {
  it('renders correct target word and user typed word', () => {
    render(
      <SpellingDiffView
        userInput="dictater"
        targetWord="dictator"
      />
    );

    expect(screen.getByText(/correct spelling:/i)).toBeInTheDocument();
    expect(screen.getByText(/dictator/i)).toBeInTheDocument();
    expect(screen.getByText(/you typed:/i)).toBeInTheDocument();
  });

  it('highlights transformed / substituted letters with appropriate tags', () => {
    render(
      <SpellingDiffView
        userInput="dictater"
        targetWord="dictator"
      />
    );

    expect(screen.getByText(/changed/i)).toBeInTheDocument();
    expect(screen.getByText(/‘e’/i)).toBeInTheDocument();
    expect(screen.getByText(/‘o’/i)).toBeInTheDocument();
    expect(screen.getByText('Transformed')).toBeInTheDocument();
  });

  it('highlights extra added letters with added badge', () => {
    render(
      <SpellingDiffView
        userInput="auditiion"
        targetWord="audition"
      />
    );

    expect(screen.getByText(/extra letter/i)).toBeInTheDocument();
    expect(screen.getByText('Added')).toBeInTheDocument();
  });

  it('highlights missing removed letters with missing badge', () => {
    render(
      <SpellingDiffView
        userInput="visble"
        targetWord="visible"
      />
    );

    expect(screen.getByText(/missing letter/i)).toBeInTheDocument();
    expect(screen.getByText('Missing')).toBeInTheDocument();
  });

  it('handles empty user input gracefully', () => {
    render(
      <SpellingDiffView
        userInput=""
        targetWord="visible"
      />
    );

    expect(screen.getByText(/no answer typed/i)).toBeInTheDocument();
    expect(screen.getByText(/visible/i)).toBeInTheDocument();
  });
});
