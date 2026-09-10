export type ParticleType = 'correct' | 'incorrect';

export interface FuzzyParticle {
  id: string;
  x: number; // delta X in px
  y: number; // delta Y in px
  size: number; // diameter in px (large smoke puff: 40 to 110px)
  blur: number; // heavy blur for fuzzy smoke look (12 to 26px)
  color: string;
  durationMs: number; // animation length (700 to 1100ms)
  delayMs: number;
  opacity: number;
}

export interface AmbientSmokeOrb {
  id: string;
  x: number;
  y: number;
  size: number;
  blur: number;
  color: string;
  durationSeconds: number;
  delaySeconds: number;
  opacity: number;
}

export const CORRECT_PALETTE = [
  '#10b981', // emerald-500
  '#06b6d4', // cyan-500
  '#14b8a6', // teal-500
  '#34d399', // emerald-400
  '#22c55e', // green-500
  '#38bdf8', // sky-400
  '#6ee7b7', // mint-300
];

export const INCORRECT_PALETTE = [
  '#f43f5e', // rose-500
  '#f59e0b', // amber-500
  '#fb923c', // orange-400
  '#ef4444', // red-500
  '#fda4af', // rose-300
];

export const AMBIENT_PALETTE = [
  '#6366f1', // indigo-500
  '#818cf8', // indigo-400
  '#a855f7', // purple-500
  '#38bdf8', // sky-400
  '#4f46e5', // indigo-600
];

/**
 * Generates large, dense, volumetric fuzzy smoke particles billowing far outside the card.
 */
export function createFuzzyParticles(
  type: ParticleType,
  count = 24
): FuzzyParticle[] {
  const palette = type === 'correct' ? CORRECT_PALETTE : INCORRECT_PALETTE;
  const particles: FuzzyParticle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    // Disperse far outside the card (120px to 290px for correct, 80px to 200px for incorrect)
    const minDistance = type === 'correct' ? 120 : 80;
    const maxDistance = type === 'correct' ? 290 : 200;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);

    const x = Math.round(Math.cos(angle) * distance);
    const y = Math.round(Math.sin(angle) * distance);
    const size = Math.round(40 + Math.random() * 70); // 40px to 110px large puffs
    const blur = Math.round(12 + Math.random() * 14); // 12px to 26px fuzzy blur
    const color = palette[Math.floor(Math.random() * palette.length)];
    const durationMs = Math.round(700 + Math.random() * 400); // 700 to 1100ms
    const delayMs = Math.round(Math.random() * 80);
    const opacity = 0.5 + Math.random() * 0.35; // 0.5 to 0.85 soft smoke opacity

    particles.push({
      id: `smoke-${i}-${Math.random().toString(36).substring(2, 6)}`,
      x,
      y,
      size,
      blur,
      color,
      durationMs,
      delayMs,
      opacity,
    });
  }

  return particles;
}

/**
 * Generates a ring of continuous ambient fuzzy smoke clouds hovering around the card perimeter.
 */
export function createAmbientSmoke(count = 8): AmbientSmokeOrb[] {
  const orbs: AmbientSmokeOrb[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
    const distance = 140 + Math.random() * 70; // 140px to 210px from center
    const x = Math.round(Math.cos(angle) * distance);
    const y = Math.round(Math.sin(angle) * distance * 0.85);
    const size = Math.round(80 + Math.random() * 60); // 80 to 140px
    const blur = Math.round(20 + Math.random() * 12); // 20 to 32px
    const color = AMBIENT_PALETTE[i % AMBIENT_PALETTE.length];
    const durationSeconds = 5 + Math.random() * 4; // 5 to 9s gentle cycle
    const delaySeconds = -(Math.random() * 5); // randomized phase offset
    const opacity = 0.18 + Math.random() * 0.15; // 0.18 to 0.33 subtle ambient glow

    orbs.push({
      id: `ambient-${i}`,
      x,
      y,
      size,
      blur,
      color,
      durationSeconds,
      delaySeconds,
      opacity,
    });
  }

  return orbs;
}
