# Implementation Plan: Spelling Practice Mode

## Phase 1: Spelling Data Architecture, Speech Engine & Storage
- [x] Task: Level Configuration & Spelling Engine Models (TDD) [1a080dd]
  - [x] Write unit tests for spelling level configs, word picker, normalization, and validation
  - [x] Implement `src/data/spellingLevels.ts` with extensible schema and 4th grade default word list (~10 words)
  - [x] Implement `src/engine/spellingEngine.ts` to manage word randomization, case-insensitive comparison, and session progress
- [x] Task: Speech Synthesis Wrapper Service (TDD) [8790fcc]
  - [x] Write unit tests mocking Web Speech API (`SpeechSynthesisUtterance`, `window.speechSynthesis`)
  - [x] Implement `src/services/speechSynthesis.ts` with safe browser checking, cancellation, rate control, and speech triggers
- [x] Task: Level-Specific History Storage (TDD) [7f330ee]
  - [x] Write unit tests for level history storage schema and persistence logic
  - [x] Implement typed `localStorage` helper in `src/engine/spellingStorage.ts` to track attempts, accuracy, streaks, and missed words per level
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Spelling Practice Components & User Interaction
- [ ] Task: Spelling Card & Audio Controls Component (TDD)
  - [ ] Write component tests for word pronunciation trigger, "Repeat Word" button, and audio replay keyboard shortcut
  - [ ] Implement `SpellingCard.tsx` with clean audio trigger, status indicator, and Zen aesthetic
- [ ] Task: Spelling Answer Input & Feedback Component (TDD)
  - [ ] Write component tests for input auto-focus, submission on Enter, correct feedback, and incorrect reveal state
  - [ ] Implement `SpellingInput.tsx` supporting case-insensitive checking, trim, visual feedback, and reveal view on incorrect attempt
- [ ] Task: Spelling Practice Container & Session Loop (TDD)
  - [ ] Write component tests for complete drill loop (fetch random word, submit answer, update level stats, next word)
  - [ ] Implement `SpellingPracticeView.tsx` orchestrating card, input, audio replay, streak counter, and exit button
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Mode Selection, Navigation, Level Selector & Integration
- [ ] Task: Landing Screen Mode Selector (TDD)
  - [ ] Write component tests for selecting between Math Sprint and Spelling Practice on the landing view
  - [ ] Update `StartScreen.tsx` or create `ModeSelector.tsx` to clearly separate Math and Spelling modes
- [ ] Task: Level Selection Screen (TDD)
  - [ ] Write component tests for rendering configured levels and their stats (accuracy, best streak)
  - [ ] Implement `SpellingLevelSelect.tsx` showing level cards and summary stats from `localStorage`
- [ ] Task: Main App Integration & Route/Mode Orchestration (TDD)
  - [ ] Update `App.test.tsx` to verify seamless navigation between Mode Selection, Math Sprint, Spelling Level Select, and Spelling Practice
  - [ ] Integrate Spelling modes and history into `App.tsx`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
