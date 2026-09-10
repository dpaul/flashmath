# Specification: Fuzzy Particle Effects on Answer Submission

## 1. Overview
Introduce dynamic, lightweight "fuzzy" particle explosion effects when users answer a multiplication problem during the active 3-minute sprint. Correct answers generate a vibrant burst of emerald/cyan glowing fuzzy orbs, while incorrect answers emit a soft rose/amber puff. This provides immediate, rewarding tactile and visual feedback without distracting or degrading rendering performance.

## 2. Functional Requirements
- **Trigger Points**:
  - Emitted immediately when `SUBMIT_ANSWER` is handled for both correct and incorrect submissions.
- **Particle System Mechanics**:
  - Spawns 14–18 fuzzy particles radiating from the flashcard center.
  - Particles possess randomized velocities, angles, sizes (8px to 24px), and depth blur (`filter: blur(2px)` to `blur(5px)`) for a distinct fuzzy, organic orb look.
  - Correct burst: Emerald, cyan, teal, and lime palette with soft luminous glow.
  - Incorrect burst: Muted rose, amber, and orange palette with a gentler, shorter puff.
- **Lifecycle & Cleanup**:
  - GPU-accelerated CSS animations (`translate3d`, `scale`, `opacity`) lasting ~650ms.
  - Automatic DOM removal after animation completion to prevent memory leaks or node bloat.
  - Container and particles have `pointer-events-none` to guarantee zero interference with input focus or clicks.
- **Accessibility & Motion Preference**:
  - Respects `prefers-reduced-motion`: When reduced motion is requested, particles are either suppressed or reduced to a static subtle opacity flash.

## 3. Acceptance Criteria
- [ ] Submitting a correct answer generates an emerald/cyan fuzzy particle burst.
- [ ] Submitting an incorrect answer generates a rose/amber fuzzy puff.
- [ ] Particles automatically unmount from the DOM upon animation completion (~650ms).
- [ ] No pointer-events interference with user input or buttons.
- [ ] Respects `prefers-reduced-motion` settings.
- [ ] Automated test suite verifies particle generator logic, component rendering, and cleanup.
- [ ] Code coverage remains >70% across the codebase.

## 4. Out of Scope
- Heavy physics engines (e.g. Matter.js, Three.js).
- Sound effects (separate audio track).
