# FlashMath Technology Stack

## Core Architecture
- **Paradigm:** Client-side Single-Page Application (SPA)
- **Deployment:** Static web asset (deployable to GitHub Pages, Cloudflare Pages, Vercel, or Netlify)
- **Offline / Persistence:** Browser Web Storage API (`localStorage`)

## Languages & Runtime
- **Primary Language:** TypeScript (strict mode enabled for type safety)
- **Runtime Environment:** Modern evergreen browsers (ES2022+)

## Frontend Framework & UI
- **UI Framework:** React 18+
- **Build Tool & Dev Server:** Vite (fast bundling, instant HMR, optimized production builds)
- **Styling:** Tailwind CSS (utility-first, zero runtime CSS overhead, dark mode support)
- **Icons & Visuals:** Lucide React (accessible, lightweight SVG icons)

## Testing & Quality Assurance
- **Unit & Logic Testing:** Vitest (fast native ESM test runner for math engine and timer logic)
- **Component Testing:** React Testing Library + jsdom
- **Linting & Formatting:** ESLint + Prettier

## State & Data Management
- **State Management:** React hooks / Zustand (lightweight, predictable game loop and countdown state)
- **Storage:** Typed `localStorage` wrapper with schema versioning for streak and high score records
