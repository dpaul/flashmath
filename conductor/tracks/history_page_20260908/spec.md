# Specification: History Page & Score-Over-Time Graph

## 1. Overview
This feature introduces a dedicated History view to FlashMath, allowing users to track their mental arithmetic progression over time. It records completed sprint runs, displays an interactive, zero-dependency SVG score trend graph, and presents an itemized history log of previous runs with speed (PPM), accuracy, and streak analytics.

## 2. Functional Requirements

### 2.1 Run History Data Model & Storage
- **Data Structure (`SprintRunRecord`):**
  - `id: string` (unique identifier)
  - `timestamp: string` (ISO 8601 date string)
  - `score: number` (total correct problems solved)
  - `totalAttempted: number`
  - `accuracyPercentage: number`
  - `problemsPerMinute: number`
  - `bestStreak: number`
  - `missedCount: number`
  - `durationSeconds: number`
- **Persistence:**
  - Persisted in browser `localStorage` under `flashmath_run_history_v1`.
  - Cap storage at the most recent 100 runs (FIFO pruning to prevent storage bloat).
  - Automatically appended whenever a sprint is concluded (timer expiration or "Finish Early").
- **Clear History:**
  - "Clear History" button that prompts a confirmation dialog before purging historical records.

### 2.2 Score Trend Graph (`ScoreTrendChart`)
- **Rendering:** Responsive, zero-dependency SVG line chart.
- **Axes & Scale:**
  - X-axis: Chronological run progression (oldest to newest).
  - Y-axis: Problems solved (score), dynamically scaled based on the max score.
  - Subtle horizontal reference gridlines.
  - Average score horizontal dashed benchmark line.
- **Interactivity:**
  - Interactive data points with hover and focus states.
  - Tooltip displaying run date/time, score, accuracy %, and PPM.
- **Empty State:** Clean, encouraging message displayed when fewer than 2 runs have been completed.

### 2.3 Run History Log (`RunHistoryList`)
- Displays an itemized table/card list of completed runs sorted from newest to oldest.
- Columns/Cards: Date & Time, Score, Accuracy %, Speed (PPM), Best Streak, and Missed Count.
- Special highlight badge on the user's all-time highest scoring run.

### 2.4 Navigation & App Integration
- **Header Navigation:**
  - Add "History" button with icon in top navigation header (available on Start and Results screens).
  - Active state indicator when viewing the History page.
- **Back Navigation:**
  - Clear "Back to Challenge" button to return to the Start Screen.
- **Results Screen Link:**
  - Optional quick link on the Results screen: "View Full History & Trends".

## 3. Non-Functional Requirements
- **Performance:** Lightweight pure SVG, no heavy external charting bundles.
- **Responsiveness:** Fluid scaling on mobile screens, tablets, and wide desktop displays.
- **Accessibility:** Semantic table markup, ARIA labels on chart markers, and keyboard-focusable data points.

## 4. Out of Scope
- Backend cloud syncing / user accounts.
- Exporting CSV/PDF reports (reserved for future enhancement).

## 5. Acceptance Criteria
- [ ] Finishing a sprint saves the run to `localStorage` without affecting game loop performance.
- [ ] Clicking "History" navigates to the dedicated History view.
- [ ] SVG graph renders chronological score points, line connectors, and average baseline.
- [ ] Hovering or tapping a data point displays a tooltip with run details.
- [ ] History list accurately itemizes previous sprints with score, accuracy %, and PPM.
- [ ] "Clear History" prompts for confirmation, wipes stored runs, and updates the view instantly.
- [ ] All unit and integration tests pass with >70% coverage.
