# Specification: FlashMath MVP - 3-Minute Multiplication Challenge

## 1. Overview
The FlashMath MVP is a fast-paced, client-side web application designed to build mental calculation fluency. The MVP provides a dedicated 3-minute (180-second) sprint challenge focused exclusively on multiplication tables 2 through 12, featuring explicit Enter-key answer submission, real-time visual feedback, and comprehensive post-round performance analytics.

## 2. Functional Requirements

### 2.1 Game Loop & Sprint Timer
- **Duration:** 180-second countdown timer.
- **Sprint Controls:**
  - Clear "Start Challenge" action (clickable button and keyboard trigger).
  - Active countdown timer prominently displayed with visual warning state during the final 30 seconds.
  - Ability to restart or abort mid-sprint.
- **Sprint Completion:** Automatically locks input and transitions to the Results screen when the timer reaches 0:00.

### 2.2 Problem Generation
- Generates multiplication problems $A \times B$ where both $A$ and $B$ are randomly selected integers from $2$ to $12$ inclusive ($[2, 12]$).
- Fixed full mix across all tables (2 through 12).
- Prevents immediate consecutive identical problems.

### 2.3 Input & User Experience
- Dedicated numeric input field auto-focused upon sprint start and kept focused between problems.
- Explicit submission: Submissions occur when the user presses **Enter** or taps the on-screen **Submit** button.
- On-screen touch keypad provided for mobile and tablet devices.
- Rapid input reset: Clears input instantly after submission without losing focus.
- Micro-feedback: Brief, non-intrusive visual cue (green pulse for correct, subtle red accent for incorrect) that does not interrupt rapid typing.

### 2.4 Performance Analytics & Review
- Real-time in-sprint counters: Correct count, total attempted, and current consecutive streak.
- Post-round Summary Screen:
  - Total correct answers.
  - Final accuracy percentage: $\frac{\text{Correct}}{\text{Attempted}} \times 100$.
  - Problems Per Minute (PPM): $\frac{\text{Correct}}{3.0}$.
  - Personal Best banner when high score or longest streak record is broken.
  - Missed Problems Review: Itemized list showing each missed problem, the user's submitted answer, and the correct product.
  - "Play Again" button and keyboard shortcut to restart instantly.

### 2.5 Local Persistence
- High score (max correct in 3 minutes) and best streak stored in browser `localStorage`.
- Persistence across reloads with schema versioning and fallback for private browsing.

## 3. Non-Functional Requirements
- **Performance:** Instant UI updates (<16ms) with zero frame drops during input and problem generation.
- **Accessibility & Ergonomics:** High contrast ratios (WCAG AAA), legible tabular monospace fonts, and full keyboard navigability.
- **Zero Backend Dependency:** Fully functional client-side SPA.

## 4. Out of Scope for MVP
- Other arithmetic operations (addition, subtraction, division).
- Individual table filtering/selection (fixed full 2–12 mix for MVP).
- Cloud accounts, multi-device sync, and global leaderboards.
- Audio synthesis/sound effects (reserved for subsequent iterations).

## 5. Acceptance Criteria
- [ ] Clicking "Start" initiates a 180-second countdown and focuses the numeric input.
- [ ] Every generated problem consists of factors between 2 and 12 ($2 \le A, B \le 12$).
- [ ] Submitting via Enter or Submit button immediately evaluates the answer and presents the next question.
- [ ] At 0:00, the round ends and displays total correct, accuracy %, PPM, and any missed problems.
- [ ] Personal best scores persist across browser refreshes.
- [ ] Responsive across desktop, tablet, and mobile viewports.
