export type EditType = 'match' | 'substitute' | 'insert' | 'delete';

export interface DiffSegment {
  type: EditType;
  /** Character typed by user, if present */
  userChar?: string;
  /** Character from target word, if present */
  targetChar?: string;
}

export interface AlignedChar {
  userChar: string | null;
  targetChar: string | null;
  type: EditType;
}

export interface DiffErrorItem {
  type: 'added' | 'removed' | 'transformed';
  userChar?: string;
  targetChar?: string;
  description: string;
}

export interface SpellingDiffSummary {
  matches: number;
  substitutions: number;
  insertions: number;
  deletions: number;
}

export interface SpellingDiffResult {
  userInput: string;
  targetWord: string;
  distance: number;
  hasErrors: boolean;
  segments: DiffSegment[];
  aligned: AlignedChar[];
  summary: SpellingDiffSummary;
  errors: DiffErrorItem[];
}

/**
 * Computes the optimal alignment between a user's typed spelling attempt
 * and the target correct word using the Wagner-Fischer dynamic programming algorithm.
 *
 * Classifies edits into:
 * - 'match': Character matches correctly
 * - 'substitute': User transformed/substituted a letter (typed wrong letter)
 * - 'insert': User added an extra letter (not in target)
 * - 'delete': User omitted/removed a letter (missing from attempt)
 */
export function computeSpellingDiff(rawUserInput: string, rawTargetWord: string): SpellingDiffResult {
  const userInput = rawUserInput.trim();
  const targetWord = rawTargetWord.trim();

  const uLen = userInput.length;
  const tLen = targetWord.length;

  // Initialize (uLen + 1) x (tLen + 1) DP matrix
  const dp: number[][] = Array.from({ length: uLen + 1 }, () =>
    new Array(tLen + 1).fill(0)
  );

  for (let i = 0; i <= uLen; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= tLen; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= uLen; i++) {
    const uChar = userInput[i - 1].toLowerCase();
    for (let j = 1; j <= tLen; j++) {
      const tChar = targetWord[j - 1].toLowerCase();
      if (uChar === tChar) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j - 1], // substitution (transformed letter)
          dp[i - 1][j],     // insertion into target (user added extra letter)
          dp[i][j - 1]      // deletion from target (user omitted/removed letter)
        );
      }
    }
  }

  const distance = dp[uLen][tLen];
  const segments: DiffSegment[] = [];

  // Trace back optimal path
  let i = uLen;
  let j = tLen;

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      userInput[i - 1].toLowerCase() === targetWord[j - 1].toLowerCase() &&
      dp[i][j] === dp[i - 1][j - 1]
    ) {
      segments.push({
        type: 'match',
        userChar: userInput[i - 1],
        targetChar: targetWord[j - 1],
      });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      // Transformed / substituted letter
      segments.push({
        type: 'substitute',
        userChar: userInput[i - 1],
        targetChar: targetWord[j - 1],
      });
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      // Added letter (user typed extra char)
      segments.push({
        type: 'insert',
        userChar: userInput[i - 1],
      });
      i--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      // Removed letter (user omitted target char)
      segments.push({
        type: 'delete',
        targetChar: targetWord[j - 1],
      });
      j--;
    } else {
      if (i > 0) {
        segments.push({ type: 'insert', userChar: userInput[i - 1] });
        i--;
      } else if (j > 0) {
        segments.push({ type: 'delete', targetChar: targetWord[j - 1] });
        j--;
      }
    }
  }

  segments.reverse();

  const aligned: AlignedChar[] = segments.map((seg) => ({
    userChar: seg.userChar ?? null,
    targetChar: seg.targetChar ?? null,
    type: seg.type,
  }));

  const summary: SpellingDiffSummary = {
    matches: 0,
    substitutions: 0,
    insertions: 0,
    deletions: 0,
  };

  const errors: DiffErrorItem[] = [];

  for (const seg of segments) {
    if (seg.type === 'match') {
      summary.matches++;
    } else if (seg.type === 'substitute') {
      summary.substitutions++;
      errors.push({
        type: 'transformed',
        userChar: seg.userChar,
        targetChar: seg.targetChar,
        description: `Transformed '${seg.userChar}' → should be '${seg.targetChar}'`,
      });
    } else if (seg.type === 'insert') {
      summary.insertions++;
      errors.push({
        type: 'added',
        userChar: seg.userChar,
        description: `Added extra '${seg.userChar}'`,
      });
    } else if (seg.type === 'delete') {
      summary.deletions++;
      errors.push({
        type: 'removed',
        targetChar: seg.targetChar,
        description: `Removed / missing '${seg.targetChar}'`,
      });
    }
  }

  return {
    userInput,
    targetWord,
    distance,
    hasErrors: distance > 0,
    segments,
    aligned,
    summary,
    errors,
  };
}
