import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecentProblemStream, SolvedProblemRecord } from './RecentProblemStream';

describe('RecentProblemStream Component', () => {
  it('renders nothing when there are no recent problems', () => {
    const { container } = render(<RecentProblemStream recentProblems={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders up to 3 recent problems with correct math and status icons', () => {
    const records: SolvedProblemRecord[] = [
      { id: '1', problemText: '4 × 9', answer: 36, isCorrect: true, timeTakenSeconds: 1.4 },
      { id: '2', problemText: '9 × 4', answer: 36, isCorrect: true, timeTakenSeconds: 1.2 },
      { id: '3', problemText: '6 × 7', answer: 42, isCorrect: true, pointsEarned: 140 },
    ];

    render(<RecentProblemStream recentProblems={records} />);

    expect(screen.getByText(/4 × 9 = 36/)).toBeInTheDocument();
    expect(screen.getByText(/9 × 4 = 36/)).toBeInTheDocument();
    expect(screen.getByText(/6 × 7 = 42/)).toBeInTheDocument();
  });
});
