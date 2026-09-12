# Implementation Plan: Redesign FlashMath to match Stitch "Zen Focus Flow"

## Phase 1: Solarized Theme Foundation & Global Styling [checkpoint: 52b8ca0]
- [x] Task: Set up Solarized Light design tokens, Google fonts, and background ambient shadows 52b8ca0
  - [x] Configure `Plus Jakarta Sans` and `JetBrains Mono` fonts in `index.html` and Tailwind
  - [x] Add Solarized Light palette colors, `tactile-card` shadow utility, and background glow blurs in `index.css`
  - [x] Ensure particle effects blend naturally on light warm paper canvas
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 52b8ca0

## Phase 2: Zen Focus Flow Sprint Screen & Hero Flashcard [checkpoint: 116da45]
- [x] Task: Write integration tests for Zen Focus Flow UI elements (Red Phase) 116da45
  - [x] Test header branding with stage pill and best score display
  - [x] Test status bar with timer, streak badge, and score
  - [x] Test Flashcard equation layout, card counter, and recessed answer input with blinking cursor
  - [x] Test Zen footer with accuracy and pace metrics
- [x] Task: Implement Zen Focus Flow sprint layout and components (Green & Refactor Phase) 116da45
  - [x] Update `Header` in `App.tsx` to match Zen Focus Flow layout
  - [x] Refactor `TimerBar.tsx` into compact timer + progress bar dock
  - [x] Create `RecentProblemStream.tsx` for completed equation ribbon
  - [x] Refactor `Flashcard.tsx` and `AnswerInput.tsx` into the white tactile paper card with recessed answer well
  - [x] Style `Keypad.tsx` with warm tactile 3D bevel tiles
  - [x] Add Zen footer with real-time stats and shortcuts
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 116da45

## Phase 3: Start Screen, Results Screen, History Page & End-to-End Verification [checkpoint: 5500a30]
- [x] Task: Update StartScreen, ResultsScreen, and HistoryPage to Solarized Light stationery aesthetic (Red Phase) 5500a30
- [x] Task: Implement styling updates across remaining screens (Green & Refactor Phase) 5500a30
- [x] Task: End-to-end quality, test coverage (>70%), build check, and interactive verification 5500a30
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 5500a30
