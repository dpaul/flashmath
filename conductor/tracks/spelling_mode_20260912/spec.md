# Specification: Spelling Practice Mode

## Overview
FlashMath expands beyond arithmetic into language arts with a dedicated, untimed **Spelling Practice Mode**. Learners can practice spelling at their own pace using automated speech synthesis to hear words spoken aloud, submit their spellings through an interactive input field, receive instant visual feedback, and track level-specific accuracy and mastery statistics saved securely in `localStorage`.

---

## Functional Requirements

1. **Dedicated Mode Selector & Navigation:**
   - **Landing Page Mode Selector:** Present distinct cards on the start screen allowing the user to select either **Math Sprint (3-Minute Challenge)** or **Spelling Practice**.
   - Header navigation allows quick return to the Home/Selector screen or switching between modes.

2. **Configurable Spelling Levels:**
   - Modular, easily extensible configuration file (e.g. `src/data/spellingLevels.ts`) defining levels and their word collections:
     ```ts
     export interface SpellingLevel {
       id: string;
       name: string;
       description: string;
       words: string[];
     }
     ```
   - **MVP Level Setup:** Defaults to a starter Level (e.g., *Grade 4*) containing ~10 fourth-grade level words (such as *calendar, definite, describe, grammar, island, library, mystery, opposite, remember, separate*), designed so custom word lists can easily be dropped in.
   - **Level Selection UI:** Allows learners to choose which spelling level they want to practice.

3. **Speech Synthesis Engine:**
   - Utilizes the browser's native **Web Speech API** (`window.speechSynthesis`, `SpeechSynthesisUtterance`).
   - Automatically pronounces the current word when a new card is presented.
   - Includes a prominent **"Repeat Word"** button and keyboard hotkey (e.g., `Space` or `Ctrl+R`) to re-listen at any time.
   - Includes fallback / graceful alert if speech synthesis is blocked or unavailable in the environment.

4. **Spelling Interaction & Instant Feedback:**
   - **Untimed Drill:** No countdown timer—learners focus on spelling accuracy and phonetics without time pressure.
   - **Input:** Auto-focused, accessible text input with case-insensitive matching and whitespace trimming.
   - **Submission:** Submits on `Enter` key or "Check" button.
   - **Feedback & Error Handling:**
     - *Correct:* Instant green visual confirmation, streak counter increment, and smooth transition to the next random word.
     - *Incorrect:* Red visual cues, reveals the correct spelling, offers an option to re-type or proceed, and logs the word as missed for that session.

5. **Level-Specific Local Storage History:**
   - Each level tracks its own persistent stats in `localStorage`:
     - Total words attempted, correct count, accuracy percentage.
     - Current streak and best streak for that level.
     - List of missed words for review.
   - Session summary screen showing round stats with option to continue or return to level select.
   - Reset stats option for each level.

---

## Non-Functional Requirements
- **Design System Alignment:** Matches FlashMath's "Zen Focus Flow" dark/light theme, typography, and card aesthetics.
- **Offline-First:** All assets and audio synthesis run 100% locally in the browser with zero cloud dependencies.
- **Testing:** Unit and component test coverage (>70%) using Vitest and React Testing Library.

---

## Acceptance Criteria
- [ ] Users can navigate between Math Sprint and Spelling Practice from the landing screen.
- [ ] Users can pick a spelling level from the level selection screen.
- [ ] Words are chosen randomly from the selected level's word list.
- [ ] The app automatically pronounces the word upon presentation via Web Speech API.
- [ ] The "Repeat Word" button and hotkey replay the audio on demand.
- [ ] Submitting a correct answer increments the streak and loads the next word.
- [ ] Submitting an incorrect answer displays the correct spelling and allows moving forward.
- [ ] Each level records its stats independently in `localStorage`.
- [ ] The level configuration is modular, typed, and allows adding new words/levels with minimal effort.

---

## Out of Scope
- Timed sprint for spelling (mode is intentionally untimed).
- Custom voice audio file uploads (uses standard Web Speech API).
- Cloud backend syncing or user authentication.
