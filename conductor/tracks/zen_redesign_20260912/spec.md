# Specification: Redesign FlashMath to match Stitch "Zen Focus Flow"

## Overview & User Intent
The user requested a complete redesign of FlashMath to eliminate dark glowing "AI slop" cyber aesthetics in favor of a bright, friendly, warm, and tactile Japanese stationery aesthetic inspired by the "Zen Focus Flow" screen in Stitch.

## Key Visual & UX Requirements
1. **Solarized Light Palette & Ambient Background Shadows**:
   - Base canvas: Warm cream/paper background (`#fcf9f2` / `#fdf6e3`) with subtle ambient warm glow blurs (`#faecd0`, `#e3f4f1`, `#ffeedd`) providing soft organic depth.
   - Text & Inks: Deep solarized slate (`#073642`) for primary numbers and headings, body slate (`#586e75`), muted slate (`#93a1a1`).
   - Accents: Terracotta/coral (`#cb4b16`) for primary focus, highlights, and operators; sunny amber (`#b58900`) for streaks; gentle teal/sage (`#2aa198`) for accuracy and success.
2. **Typography**:
   - Primary headings and UI body: `Plus Jakarta Sans`.
   - Math equations, numerals, timers, and metrics: `JetBrains Mono` with tabular numbers (`tnum`).
3. **Sprint Arena Architecture ("Zen Focus Flow")**:
   - **Header**: FlashMath branding with golden lightning bolt badge, stage pill (`• ×1–12 Sprint`), personal best badge (`🏆 Best: {score}`), audio and history buttons.
   - **Sprint Status Bar**: Minimalist countdown timer (`02:18`) with compact rounded progress bar; streak flame pill (`🔥 {n} streak {combo}×`) and real-time score display (`{pts} pts`).
   - **Recent Solved Ribbon**: Upward-fading stream of recently completed problems floating above the card (e.g., `✓ 6 × 7 = 42 +140`).
   - **Hero Flashcard**: Pure white rounded-3xl paper card with warm dual-layer ambient shadows (`box-shadow: 0 20px 48px -12px rgba(7, 54, 66, 0.07), 0 4px 16px rgba(181, 137, 0, 0.04)`), card counter (`Card {n}`), large arithmetic prompt (`7 × 8 =`), recessed warm ivory answer well (`#f7f0e0`) with blinking terracotta cursor.
   - **Tactile Keypad**: Friendly rounded tactile buttons with 3D bottom bevels and spring press feel for mobile/touch users.
   - **Zen Footer**: Real-time accuracy (`93%`), pace (`1.9s`), and keyboard shortcut hints (`[Space] Skip`, `[Esc] Finish`).
4. **Start & Results Screens Alignment**:
   - Harmonize StartScreen, ResultsScreen, and HistoryPage into the warm stationery theme with consistent paper cards, warm badges, and zero dark cyber styling.
5. **Quality & Test Coverage**:
   - Maintain 100% functionality with >70% test coverage (aiming for >95%) across all test suites.
