import { describe, it, expect } from 'vitest';
import { generateProblem, evaluateAnswer, formatProblem, MultiplicationProblem } from './math';

describe('Math Engine - Problem Generation', () => {
  it('generates factors within the default range of 2 through 12', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateProblem();
      expect(problem.factorA).toBeGreaterThanOrEqual(2);
      expect(problem.factorA).toBeLessThanOrEqual(12);
      expect(problem.factorB).toBeGreaterThanOrEqual(2);
      expect(problem.factorB).toBeLessThanOrEqual(12);
      expect(problem.product).toBe(problem.factorA * problem.factorB);
      expect(problem.id).toBeTruthy();
    }
  });

  it('avoids immediate consecutive identical problems', () => {
    let prev: MultiplicationProblem | null = null;
    for (let i = 0; i < 50; i++) {
      const current = generateProblem(prev);
      if (prev) {
        const isIdentical = current.factorA === prev.factorA && current.factorB === prev.factorB;
        expect(isIdentical).toBe(false);
      }
      prev = current;
    }
  });

  it('formats problem display string correctly with multiplication sign', () => {
    const problem: MultiplicationProblem = {
      id: 'test-1',
      factorA: 7,
      factorB: 8,
      product: 56,
    };
    expect(formatProblem(problem)).toBe('7 × 8');
  });
});

describe('Math Engine - Answer Evaluation', () => {
  const problem: MultiplicationProblem = {
    id: 'test-eval',
    factorA: 6,
    factorB: 9,
    product: 54,
  };

  it('correctly validates accurate numeric and string answers', () => {
    expect(evaluateAnswer(problem, 54)).toBe(true);
    expect(evaluateAnswer(problem, '54')).toBe(true);
    expect(evaluateAnswer(problem, ' 54 ')).toBe(true);
  });

  it('rejects incorrect answers', () => {
    expect(evaluateAnswer(problem, 53)).toBe(false);
    expect(evaluateAnswer(problem, 55)).toBe(false);
    expect(evaluateAnswer(problem, '45')).toBe(false);
    expect(evaluateAnswer(problem, '')).toBe(false);
    expect(evaluateAnswer(problem, 'abc')).toBe(false);
  });
});
