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

## Phase 2: Game Screen Integration & Trigger Wiring (TDD) [checkpoint: 7f64a5f]
- [x] Task: Write integration tests for answer submission triggers (Red Phase) b9ebaa1
  - [x] Test particle emission on correct answer submission with emerald/cyan theme
  - [x] Test particle emission on incorrect answer submission with rose/amber theme
- [x] Task: Wire particle emission to sprint view (Green & Refactor Phase) 7f64a5f
  - [x] Integrate `FuzzyParticles` into `Flashcard.tsx` or `App.tsx` relative to card center
  - [x] Ensure `pointer-events-none` and zero layout shifting
  - [x] Verify all tests pass with >70% code coverage
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) 7f64a5f

## Phase 3: Visual Polish, Performance & Browser Verification [checkpoint: ac7429c]
- [x] Task: Mobile responsiveness, CSS keyframe fine-tuning, and quality verification d19616b
  - [x] Audit blur and gradient styling across dark backgrounds
  - [x] Verify full test suite passes with >70% coverage
  - [x] Run TypeScript typecheck and build with zero errors
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md) ac7429c
