export interface MultiplicationProblem {
  id: string;
  factorA: number;
  factorB: number;
  product: number;
}

export interface ProblemPair {
  factorA: number;
  factorB: number;
}

/**
 * Returns a random integer between min and max inclusive.
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Checks if two problem pairs are identical in factor values.
 */
export function isExactSame(p1: ProblemPair, p2: ProblemPair): boolean {
  return p1.factorA === p2.factorA && p1.factorB === p2.factorB;
}

/**
 * Checks if two problem pairs are identical or commutative pairs (e.g. 7×8 and 8×7).
 */
export function isSameOrCommutative(p1: ProblemPair, p2: ProblemPair): boolean {
  return (
    (p1.factorA === p2.factorA && p1.factorB === p2.factorB) ||
    (p1.factorA === p2.factorB && p1.factorB === p2.factorA)
  );
}

/**
 * Generates all possible multiplication pairs between minFactor and maxFactor.
 * For default 2..12, generates 11 * 11 = 121 pairs.
 */
export function generateAllProblemPairs(
  minFactor: number = 2,
  maxFactor: number = 12
): ProblemPair[] {
  const pairs: ProblemPair[] = [];
  for (let a = minFactor; a <= maxFactor; a++) {
    for (let b = minFactor; b <= maxFactor; b++) {
      pairs.push({ factorA: a, factorB: b });
    }
  }
  return pairs;
}

/**
 * Fisher-Yates array shuffle.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Creates a shuffled deck of all possible problem pairs.
 * If recentPairs are provided, pairs matching recent questions are shifted away
 * from the front of the deck so recently answered questions won't immediately reappear.
 * In addition, adjacent commutative pairs (e.g. 7×8 immediately followed by 8×7) are separated.
 */
export function createShuffledProblemDeck(
  minFactor: number = 2,
  maxFactor: number = 12,
  recentPairs: ProblemPair[] = []
): ProblemPair[] {
  const allPairs = generateAllProblemPairs(minFactor, maxFactor);
  const deck = shuffleArray(allPairs);

  // If we have recent problems from the previous round/session, push any of them
  // that appear in the beginning of the deck towards the middle/back of the deck.
  if (recentPairs.length > 0 && deck.length > 20) {
    const bufferSize = Math.min(15, Math.floor(deck.length / 4));
    for (let i = 0; i < bufferSize; i++) {
      const isRecent = recentPairs.some((recent) => isSameOrCommutative(deck[i], recent));
      if (isRecent) {
        // Find a candidate further back that is NOT recent to swap with
        for (let j = bufferSize; j < deck.length; j++) {
          const candidateIsRecent = recentPairs.some((recent) => isSameOrCommutative(deck[j], recent));
          if (!candidateIsRecent) {
            const temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
            break;
          }
        }
      }
    }
  }

  // Ensure no adjacent cards are identical or commutative pairs (e.g. 7×8 and 8×7)
  for (let i = 1; i < deck.length; i++) {
    if (isSameOrCommutative(deck[i], deck[i - 1])) {
      // Find another card a few positions ahead to swap with
      for (let j = i + 1; j < Math.min(i + 10, deck.length); j++) {
        if (!isSameOrCommutative(deck[j], deck[i - 1])) {
          const temp = deck[i];
          deck[i] = deck[j];
          deck[j] = temp;
          break;
        }
      }
    }
  }

  return deck;
}

/**
 * Converts a ProblemPair into a MultiplicationProblem with a unique id and calculated product.
 */
export function createMultiplicationProblem(
  pair: ProblemPair
): MultiplicationProblem {
  return {
    id: `${pair.factorA}x${pair.factorB}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    factorA: pair.factorA,
    factorB: pair.factorB,
    product: pair.factorA * pair.factorB,
  };
}

/**
 * Draws the next problem from the deck.
 * If the deck is empty, automatically generates and shuffles a fresh deck while
 * avoiding recent problems at the start.
 * Guarantees that the drawn problem is never identical or commutative with the immediate previous problem.
 */
export function drawProblemFromDeck(
  deck: ProblemPair[] = [],
  recentProblems: ProblemPair[] = [],
  minFactor: number = 2,
  maxFactor: number = 12
): {
  problem: MultiplicationProblem;
  remainingDeck: ProblemPair[];
  recentProblems: ProblemPair[];
} {
  let currentDeck = deck && deck.length > 0 ? [...deck] : [];
  if (currentDeck.length === 0) {
    currentDeck = createShuffledProblemDeck(minFactor, maxFactor, recentProblems);
  }

  const lastProblem = recentProblems[recentProblems.length - 1];
  if (lastProblem && currentDeck.length > 1 && isSameOrCommutative(currentDeck[0], lastProblem)) {
    // Swap top card with a card further down so we never get the same or reverse problem twice in a row
    const swapTarget = Math.min(3, currentDeck.length - 1);
    const temp = currentDeck[0];
    currentDeck[0] = currentDeck[swapTarget];
    currentDeck[swapTarget] = temp;
  }

  const topCard = currentDeck.shift()!;
  const problem = createMultiplicationProblem(topCard);

  // Keep a sliding history of the last 20 questions
  const updatedRecent = [...recentProblems.slice(-20), topCard];

  return {
    problem,
    remainingDeck: currentDeck,
    recentProblems: updatedRecent,
  };
}

/**
 * Generates a multiplication problem with factors between minFactor and maxFactor (default 2..12).
 * Avoids immediate identical or commutative consecutive problems when previousProblem is provided.
 */
export function generateProblem(
  previousProblem?: MultiplicationProblem | null,
  minFactor: number = 2,
  maxFactor: number = 12
): MultiplicationProblem {
  let factorA: number;
  let factorB: number;

  let attempts = 0;
  do {
    factorA = getRandomInt(minFactor, maxFactor);
    factorB = getRandomInt(minFactor, maxFactor);
    attempts++;
  } while (
    previousProblem &&
    (
      (factorA === previousProblem.factorA && factorB === previousProblem.factorB) ||
      (factorA === previousProblem.factorB && factorB === previousProblem.factorA)
    ) &&
    attempts < 50
  );

  return createMultiplicationProblem({ factorA, factorB });
}

/**
 * Evaluates whether a user's answer matches the correct product.
 */
export function evaluateAnswer(
  problem: MultiplicationProblem,
  userInput: string | number
): boolean {
  if (typeof userInput === 'number') {
    return Number.isFinite(userInput) && userInput === problem.product;
  }
  const trimmed = userInput.trim();
  if (trimmed === '') {
    return false;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return false;
  }
  return parsed === problem.product;
}

/**
 * Formats a problem for display e.g. "7 × 8".
 */
export function formatProblem(problem: MultiplicationProblem): string {
  return `${problem.factorA} × ${problem.factorB}`;
}
