export interface SprintRunRecord {
  id: string;
  timestamp: string; // ISO 8601
  score: number;
  totalAttempted: number;
  accuracyPercentage: number;
  problemsPerMinute: number;
  bestStreak: number;
  missedCount: number;
  durationSeconds: number;
  accuracy?: number;
  totalAnswered?: number;
  correctCount?: number;
}

export const HISTORY_STORAGE_KEY = 'flashmath_run_history_v1';
export const MAX_HISTORY_ENTRIES = 100;

/**
 * Loads the list of previous sprint runs from localStorage.
 * Filters out 0/0 scores so abandoned or empty runs are not counted in history.
 */
export function loadRunHistory(): SprintRunRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => {
      const attempts = r.totalAttempted ?? r.totalAnswered ?? 0;
      const score = r.score ?? r.correctCount ?? 0;
      return attempts > 0 || score > 0;
    });
  } catch {
    return [];
  }
}

/**
 * Records a new sprint run, applying a FIFO cap at MAX_HISTORY_ENTRIES (100).
 * Prevents duplicates from duplicate IDs or rapid successive invocations (e.g. React StrictMode).
 * Rejects 0/0 scores from being recorded into history.
 */
export function recordSprintRun(
  run: Omit<SprintRunRecord, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): SprintRunRecord | null {
  const attempts = run.totalAttempted ?? run.totalAnswered ?? 0;
  const score = run.score ?? run.correctCount ?? 0;

  // Filter out 0/0 scores - abandoned runs with 0 attempts should not be counted
  if (attempts <= 0 && score <= 0) {
    return null;
  }

  const current = loadRunHistory();
  const id = run.id || `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = run.timestamp || new Date().toISOString();

  // If a record with this exact ID already exists, do not duplicate
  const existingRecord = current.find((r) => r.id === id);
  if (existingRecord) {
    return existingRecord;
  }

  // Deduplicate identical rapid recording (protect against StrictMode double-reducer execution)
  const lastRecord = current[current.length - 1];
  if (
    lastRecord &&
    lastRecord.score === run.score &&
    lastRecord.totalAttempted === run.totalAttempted &&
    lastRecord.accuracyPercentage === run.accuracyPercentage &&
    Date.now() - new Date(lastRecord.timestamp).getTime() < 3000
  ) {
    return lastRecord;
  }

  const newRecord: SprintRunRecord = {
    ...run,
    id,
    timestamp,
  };

  const updated = [...current, newRecord];
  if (updated.length > MAX_HISTORY_ENTRIES) {
    // Keep the most recent 100 entries (remove oldest from start)
    updated.splice(0, updated.length - MAX_HISTORY_ENTRIES);
  }

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Gracefully handle storage quota or privacy restrictions
  }

  return newRecord;
}

/**
 * Clears all stored sprint runs from localStorage.
 */
export function clearRunHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // Graceful handling
  }
}
