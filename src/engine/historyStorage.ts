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
}

export const HISTORY_STORAGE_KEY = 'flashmath_run_history_v1';
export const MAX_HISTORY_ENTRIES = 100;

/**
 * Loads the list of previous sprint runs from localStorage.
 */
export function loadRunHistory(): SprintRunRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Records a new sprint run, applying a FIFO cap at MAX_HISTORY_ENTRIES (100).
 */
export function recordSprintRun(
  run: Omit<SprintRunRecord, 'id' | 'timestamp'>
): SprintRunRecord {
  const current = loadRunHistory();
  const id = `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const newRecord: SprintRunRecord = {
    id,
    timestamp,
    ...run,
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
