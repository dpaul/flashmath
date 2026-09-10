# Implementation Plan: Fuzzy Particle Effects on Answer Submission

## Phase 1: Fuzzy Particle Component & Particle Generator Logic (TDD) [checkpoint: 2716b1c]
- [x] Task: Write unit tests for particle generation and component lifecycle (Red Phase) 832e965
  - [x] Test particle parameter generation (random velocities, colors, blur, sizes)
  - [x] Test `FuzzyParticles` rendering and auto-cleanup timeout
  - [x] Test `prefers-reduced-motion` suppression
- [x] Task: Implement particle physics generator and `FuzzyParticles` component (Green & Refactor Phase) 2716b1c
  - [x] Implement `src/engine/particles.ts` with particle model and palettes
  - [x] Build `src/components/FuzzyParticles.tsx` with GPU CSS animations and cleanup hook
  - [x] Verify all tests pass with >70% code coverage
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 2716b1c

## Phase 2: Game Screen Integration & Trigger Wiring (TDD)
- [x] Task: Write integration tests for answer submission triggers (Red Phase) b9ebaa1
  - [x] Test particle emission on correct answer submission with emerald/cyan theme
  - [x] Test particle emission on incorrect answer submission with rose/amber theme
- [ ] Task: Wire particle emission to sprint view (Green & Refactor Phase)
  - [ ] Integrate `FuzzyParticles` into `Flashcard.tsx` or `App.tsx` relative to card center
  - [ ] Ensure `pointer-events-none` and zero layout shifting
  - [ ] Verify all tests pass with >70% code coverage
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Visual Polish, Performance & Browser Verification
- [ ] Task: Mobile responsiveness, CSS keyframe fine-tuning, and quality verification
  - [ ] Audit blur and gradient styling across dark backgrounds
  - [ ] Verify full test suite passes with >70% coverage
  - [ ] Run TypeScript typecheck and build with zero errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
