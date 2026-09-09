# Implementation Plan: FlashMath MVP - 3-Minute Multiplication Challenge

## Phase 1: Project Scaffolding & Environment Setup [checkpoint: 9dad477]
- [x] Task: Initialize Vite React TypeScript project and configure build tooling 9dad477
  - [x] Initialize Vite project structure with React and TypeScript
  - [x] Configure Tailwind CSS for styling and typography
  - [x] Configure Vitest, jsdom, and React Testing Library
  - [x] Install Lucide React for UI iconography
  - [x] Verify baseline test and development server build
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 9dad477

## Phase 2: Core Math Engine & Problem Generation (TDD) [checkpoint: 2b0c0b3]
- [x] Task: Write unit tests for problem generator and answer evaluation (Red Phase) e98d035
  - [x] Test problem generator produces factors in range [2, 12]
  - [x] Test problem generator avoids immediate identical consecutive problems
  - [x] Test answer validation logic for correct and incorrect answers
- [x] Task: Implement core math engine (Green & Refactor Phase) 2b0c0b3
  - [x] Implement `generateProblem` and `evaluateAnswer` utilities
  - [x] Verify all tests pass with >70% code coverage
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 2b0c0b3

## Phase 3: Sprint Timer & State Management (TDD) [checkpoint: 498d3b5]
- [x] Task: Write unit tests for sprint timer and scoring state (Red Phase) a7b3c83
  - [x] Test 180-second countdown timer hook and expiration triggers
  - [x] Test scoring metrics calculation (accuracy %, PPM, consecutive streak)
  - [x] Test missed problems logging (storing problem, submitted answer, correct answer)
  - [x] Test local storage adapter for saving and loading personal best records
- [x] Task: Implement timer hook and game state store (Green & Refactor Phase) 498d3b5
  - [x] Implement `useSprintTimer` hook with pause, reset, and tick handlers
  - [x] Implement `useGameStore` / state reducer managing challenge lifecycle
  - [x] Implement `storage` utility with schema fallback for high score persistence
  - [x] Verify all tests pass with >70% code coverage
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 498d3b5

## Phase 4: User Interface & Interaction Flow [checkpoint: 587f8e0]
- [x] Task: Implement flashcard display and input components afca07d
  - [x] Build `Flashcard` component with large tabular monospace numerals and progress indicator
  - [x] Build `AnswerInput` component with autofocus, Enter key submission, and micro-feedback pulse
  - [x] Build responsive on-screen numeric keypad for mobile/tablet input
- [x] Task: Implement start screen and post-sprint analytics screen daebac9
  - [x] Build `StartScreen` with challenge rules and current personal best stats
  - [x] Build `ResultsScreen` displaying total correct, accuracy %, PPM, and personal best banner
  - [x] Build `MissedProblemsReview` component detailing incorrect attempts with correct solutions
  - [x] Implement instant restart controls (Space / Enter hotkey and button)
- [x] Task: End-to-end component integration tests 587f8e0
  - [x] Write integration test simulating full sprint flow from start to results screen
  - [x] Verify keyboard interactions and autofocus behavior
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 587f8e0

## Phase 5: Final Polish, Accessibility & Quality Gate
- [x] Task: Visual polish, accessibility audit, and theme styling f601aa9
  - [x] Verify WCAG AAA color contrast and responsive viewport layouts (mobile, tablet, desktop)
  - [x] Audit keyboard accessibility and ARIA live regions for countdown and score announcements
- [x] Task: Full verification and coverage report f601aa9
  - [x] Run full test suite and verify coverage meets >70% target
  - [x] Run TypeScript typecheck and ESLint static analysis with zero errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
