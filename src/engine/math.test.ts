import { describe, it, expect } from 'vitest';
import {
  generateProblem,
  evaluateAnswer,
  formatProblem,
  MultiplicationProblem,
  generateAllProblemPairs,
  createShuffledProblemDeck,
  drawProblemFromDeck,
  isSameOrCommutative,
} from './math';

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

  it('avoids immediate consecutive identical or commutative problems in generateProblem', () => {
    let prev: MultiplicationProblem | null = null;
    for (let i = 0; i < 50; i++) {
      const current = generateProblem(prev);
      if (prev) {
        const isIdentical = current.factorA === prev.factorA && current.factorB === prev.factorB;
        expect(isIdentical).toBe(false);
        const isCommutative = current.factorA === prev.factorB && current.factorB === prev.factorA;
        expect(isCommutative).toBe(false);
      }
      prev = current;
    }
  });

  it('generates all 121 problem pairs for multiplication tables 2 through 12', () => {
    const pairs = generateAllProblemPairs(2, 12);
    expect(pairs.length).toBe(121); // 11 * 11
    const keys = new Set(pairs.map((p) => `${p.factorA}x${p.factorB}`));
    expect(keys.size).toBe(121);
  });

  it('creates a shuffled deck containing all 121 unique pairs without adjacent commutative questions', () => {
    const deck = createShuffledProblemDeck(2, 12);
    expect(deck.length).toBe(121);
    const uniqueKeys = new Set(deck.map((p) => `${p.factorA}x${p.factorB}`));
    expect(uniqueKeys.size).toBe(121);

    // Verify no two adjacent cards are commutative
    for (let i = 1; i < deck.length; i++) {
      expect(isSameOrCommutative(deck[i], deck[i - 1])).toBe(false);
    }
  });

  it('draws 121 distinct problems in sequence without duplicates within a single deck round', () => {
    let deck = createShuffledProblemDeck(2, 12);
    let recent: { factorA: number; factorB: number }[] = [];
    const seenKeys = new Set<string>();

    for (let i = 0; i < 121; i++) {
      const result = drawProblemFromDeck(deck, recent);
      deck = result.remainingDeck;
      recent = result.recentProblems;

      const key = `${result.problem.factorA}x${result.problem.factorB}`;
      expect(seenKeys.has(key)).toBe(false);
      seenKeys.add(key);

      if (i > 0) {
        const prev = recent[recent.length - 2];
        expect(result.problem.factorA === prev.factorA && result.problem.factorB === prev.factorB).toBe(false);
        expect(result.problem.factorA === prev.factorB && result.problem.factorB === prev.factorA).toBe(false);
      }
    }

    expect(seenKeys.size).toBe(121);
    expect(deck.length).toBe(0);
  });

  it('defers recent questions when deck reshuffles to avoid getting recently answered questions soon after', () => {
    const recent = [
      { factorA: 7, factorB: 8 },
      { factorA: 9, factorB: 6 },
      { factorA: 12, factorB: 12 },
      { factorA: 4, factorB: 5 },
      { factorA: 3, factorB: 9 },
    ];

    const newDeck = createShuffledProblemDeck(2, 12, recent);
    const firstTen = newDeck.slice(0, 10);

    for (const r of recent) {
      const appearsInFirstTen = firstTen.some((card) => isSameOrCommutative(card, r));
      expect(appearsInFirstTen).toBe(false);
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
