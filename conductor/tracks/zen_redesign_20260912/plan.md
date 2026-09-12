# Implementation Plan: Redesign FlashMath to match Stitch "Zen Focus Flow"

## Phase 1: Solarized Theme Foundation & Global Styling [checkpoint: ]
- [ ] Task: Set up Solarized Light design tokens, Google fonts, and background ambient shadows (Red Phase: Verify styling tests fail or need updates)
  - [ ] Configure `Plus Jakarta Sans` and `JetBrains Mono` fonts in `index.html` and Tailwind
  - [ ] Add Solarized Light palette colors, `tactile-card` shadow utility, and background glow blurs in `index.css`
  - [ ] Ensure particle effects blend naturally on light warm paper canvas
- [ ] Task: Implement theme tokens and verify foundation (Green & Refactor Phase)
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Zen Focus Flow Sprint Screen & Hero Flashcard [checkpoint: ]
- [ ] Task: Write integration tests for Zen Focus Flow UI elements (Red Phase)
  - [ ] Test header branding with stage pill and best score display
  - [ ] Test status bar with timer, streak badge, and score
  - [ ] Test Flashcard equation layout, card counter, and recessed answer input with blinking cursor
  - [ ] Test Zen footer with accuracy and pace metrics
- [ ] Task: Implement Zen Focus Flow sprint layout and components (Green & Refactor Phase)
  - [ ] Update `Header` in `App.tsx` to match Zen Focus Flow layout
  - [ ] Refactor `TimerBar.tsx` into compact timer + progress bar dock
  - [ ] Create `RecentProblemStream.tsx` for completed equation ribbon
  - [ ] Refactor `Flashcard.tsx` and `AnswerInput.tsx` into the white tactile paper card with recessed answer well
  - [ ] Style `Keypad.tsx` with warm tactile 3D bevel tiles
  - [ ] Add Zen footer with real-time stats and shortcuts
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Start Screen, Results Screen, History Page & End-to-End Verification [checkpoint: ]
- [ ] Task: Update StartScreen, ResultsScreen, and HistoryPage to Solarized Light stationery aesthetic (Red Phase)
- [ ] Task: Implement styling updates across remaining screens (Green & Refactor Phase)
- [ ] Task: End-to-end quality, test coverage (>70%), build check, and interactive verification
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
