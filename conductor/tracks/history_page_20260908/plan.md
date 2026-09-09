# Implementation Plan: History Page & Score-Over-Time Graph

## Phase 1: History Data Storage & Run Recording (TDD) [checkpoint: 15d64e4]
- [x] Task: Write unit tests for run history persistence and recording (Red Phase) 30536e5
  - [x] Test `loadRunHistory` returns empty array by default and handles corrupted data safely
  - [x] Test `recordSprintRun` appends new runs and enforces 100-run FIFO cap
  - [x] Test `clearRunHistory` purges stored records
  - [x] Test sprint completion dispatches run recording automatically
- [x] Task: Implement history storage adapter and game reducer integration (Green & Refactor Phase) 15d64e4
  - [x] Implement `src/engine/historyStorage.ts` with typed storage utilities
  - [x] Update `gameReducer.ts` to record completed runs upon sprint end
  - [x] Verify all tests pass with >70% code coverage
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 15d64e4

## Phase 2: Score Trend SVG Chart Component (TDD)
- [x] Task: Write unit tests for `ScoreTrendChart` (Red Phase) 8e74447
  - [x] Test empty state rendering when fewer than 2 runs exist
  - [x] Test SVG coordinates, polyline path math, and average score benchmark line
  - [x] Test hover/focus interactions and tooltip data rendering
- [~] Task: Implement `ScoreTrendChart` component (Green & Refactor Phase)
  - [ ] Build pure SVG line chart with dynamic viewBox, gridlines, and gradient fill
  - [ ] Implement interactive data points with keyboard focus and floating tooltip
  - [ ] Verify all tests pass with >70% code coverage
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Run History List & Clear Confirmation Modal (TDD)
- [ ] Task: Write unit tests for `RunHistoryList` and `ClearHistoryModal` (Red Phase)
  - [ ] Test history list rendering sorted newest-to-oldest with high-score badge
  - [ ] Test clear history confirmation modal cancel and confirm flows
- [ ] Task: Implement `RunHistoryList` and `ClearHistoryModal` components (Green & Refactor Phase)
  - [ ] Build `RunHistoryList` component with responsive cards and stats breakdown
  - [ ] Build `ClearHistoryModal` component with backdrop and confirmation dialog
  - [ ] Verify all tests pass with >70% code coverage
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: History Page View & App Navigation Integration
- [ ] Task: Implement `HistoryPage` container view
  - [ ] Build `HistoryPage` component assembling chart, summary statistics, and history log
  - [ ] Add quick "Back to Sprint" button
- [ ] Task: Integrate navigation into `App.tsx` and header
  - [ ] Add "History" button with icon in top navigation header
  - [ ] Add "View History & Trends" shortcut on Results screen
  - [ ] Wire active view state ('game' | 'history')
- [ ] Task: End-to-end integration tests for History view
  - [ ] Test full journey: completing sprint -> navigating to history -> viewing score point -> clearing history
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 5: Final Polish, Accessibility & Quality Gate
- [ ] Task: Responsive styling audit, ARIA accessibility, and quality verification
  - [ ] Verify SVG chart scaling and touch responsiveness on mobile viewports
  - [ ] Ensure full test suite passes with >70% coverage
  - [ ] Run TypeScript typecheck and build with zero errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
