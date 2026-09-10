export type ParticleType = 'correct' | 'incorrect';

export interface FuzzyParticle {
  id: string;
  x: number; // delta X in px
  y: number; // delta Y in px
  size: number; // diameter in px (8 to 26)
  blur: number; // blur filter in px (2 to 6)
  color: string;
  durationMs: number; // animation length (450 to 800ms)
  delayMs: number;
  opacity: number;
}

export const CORRECT_PALETTE = [
  '#10b981', // emerald-500
  '#06b6d4', // cyan-500
  '#14b8a6', // teal-500
  '#34d399', // emerald-400
  '#22c55e', // green-500
  '#38bdf8', // sky-400
];

export const INCORRECT_PALETTE = [
  '#f43f5e', // rose-500
  '#f59e0b', // amber-500
  '#fb923c', // orange-400
  '#ef4444', // red-500
];

/**
 * Generates an array of fuzzy particle descriptors radiating outward from the origin.
 */
export function createFuzzyParticles(
  type: ParticleType,
  count = 16
): FuzzyParticle[] {
  const palette = type === 'correct' ? CORRECT_PALETTE : INCORRECT_PALETTE;
  const particles: FuzzyParticle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    // Correct has wide energetic burst, incorrect has a tighter puff
    const minDistance = type === 'correct' ? 45 : 20;
    const maxDistance = type === 'correct' ? 125 : 75;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);

    const x = Math.round(Math.cos(angle) * distance);
    const y = Math.round(Math.sin(angle) * distance);
    const size = Math.round(8 + Math.random() * 18); // 8 to 26
    const blur = Math.round(2 + Math.random() * 4); // 2 to 6
    const color = palette[Math.floor(Math.random() * palette.length)];
    const durationMs = Math.round(450 + Math.random() * 350); // 450 to 800
    const delayMs = Math.round(Math.random() * 60);
    const opacity = 0.75 + Math.random() * 0.25;

    particles.push({
      id: `p-${i}-${Math.random().toString(36).substring(2, 6)}`,
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
