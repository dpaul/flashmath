# FlashMath ⚡

A fast-paced, 3-minute multiplication sprint challenge web application built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vitest**.

Practice multiplication tables from **2 to 12**, build streaks, review missed problems, and track your speed and accuracy over time with responsive score trend analytics.

---

## ✨ Features

- **3-Minute Countdown Sprint**: Test your multiplication fluency under a continuous 3-minute timer with visual urgency indicators.
- **Tables 2 through 12**: Randomly sampled multiplication problems covering single and double-digit fundamentals.
- **Instant Feedback & Streaks**: Immediate visual signals for correct/incorrect inputs and real-time multiplier streaks.
- **Dual Input Modes**: Seamless typing via keyboard or an accessible touch-friendly on-screen numeric keypad for mobile.
- **End-of-Round Analytics**:
  - Total problems solved correctly
  - Accuracy percentage
  - Problems Per Minute (PPM) speed rate
  - Best streak of the round
  - Missed problems review with submitted vs. correct answers
- **Score Trend Graph & History**:
  - Pure SVG line chart showing score progression across sprints with zero charting library dependencies
  - Average score benchmark line
  - Interactive tooltips with keyboard and hover focus
  - Chronological sprint log with "Personal Best" badges
  - LocalStorage persistence capped at the 100 most recent runs with confirmation modal for clearing history

---

## 🛠 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library (with v8 coverage)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone repository
git clone https://github.com/dpaul/flashmath.git
cd flashmath

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Tests

```bash
# Run tests once
npm run test

# Run tests with code coverage
npm run test:coverage
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License

MIT
