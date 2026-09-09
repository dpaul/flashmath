export interface MultiplicationProblem {
  id: string;
  factorA: number;
  factorB: number;
  product: number;
}

/**
 * Returns a random integer between min and max inclusive.
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a multiplication problem with factors between minFactor and maxFactor (default 2..12).
 * Avoids immediate identical consecutive problems when previousProblem is provided.
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
    factorA === previousProblem.factorA &&
    factorB === previousProblem.factorB &&
    attempts < 20
  );

  const product = factorA * factorB;
  const id = `${factorA}x${factorB}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    factorA,
    factorB,
    product,
  };
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
