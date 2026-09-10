export type ParticleType = 'correct' | 'incorrect';

export interface FuzzyParticle {
  id: string;
  startX: number; // Starting X coordinate along the card edge
  startY: number; // Starting Y coordinate along the card edge
  dirX: number;   // Outward drift distance X (billowing outside the box)
  dirY: number;   // Outward drift distance Y (billowing outside the box)
  size: number;   // Diameter (45 to 115px)
  blur: number;   // Blur filter (12 to 28px)
  color: string;
  durationMs: number; // Animation length (700 to 1100ms)
  delayMs: number;
  opacity: number;
}

export interface AmbientSmokeOrb {
  id: string;
  startX: number;
  startY: number;
  dirX: number;
  dirY: number;
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
  '#10b981', // emerald-500
];

/**
 * Calculates number of burst particles based on streak.
 * Incorrect answers reset to baseline puff; correct answers scale with streak.
 */
export function calculateParticleCount(type: ParticleType, streak = 0): number {
  if (type === 'incorrect') {
    return 14; // Reset / error puff
  }
  // Scales with streak: streak 0 = 16, streak 5 = 36, streak 8+ = up to 48
  return Math.min(16 + streak * 4, 48);
}

/**
 * Calculates number of continuous ambient smoke clouds based on current streak.
 */
export function calculateAmbientCount(streak = 0): number {
  if (streak === 0) return 6;
  // Ambient smoke thickens as streak builds up
  return Math.min(6 + streak * 2, 18);
}

/**
 * Returns a point along the rectangular boundary of the card and an outward direction vector.
 */
function getEdgeSpawn(halfW = 185, halfH = 115, pushDistance = 75) {
  const edge = Math.floor(Math.random() * 4);
  let startX = 0;
  let startY = 0;
  let dirX = 0;
  let dirY = 0;

  if (edge === 0) {
    // Top edge: spawns slightly above top border, billows UPWARDS outside
    startX = (Math.random() - 0.5) * (halfW * 2);
    startY = -halfH - 12;
    dirX = (Math.random() - 0.5) * 60;
    dirY = -(pushDistance + Math.random() * 80);
  } else if (edge === 1) {
    // Right edge: spawns slightly right of border, billows RIGHTWARDS outside
    startX = halfW + 12;
    startY = (Math.random() - 0.5) * (halfH * 2);
    dirX = pushDistance + Math.random() * 80;
    dirY = (Math.random() - 0.5) * 60;
  } else if (edge === 2) {
    // Bottom edge: spawns slightly below bottom border, billows DOWNWARDS outside
    startX = (Math.random() - 0.5) * (halfW * 2);
    startY = halfH + 12;
    dirX = (Math.random() - 0.5) * 60;
    dirY = pushDistance + Math.random() * 80;
  } else {
    // Left edge: spawns slightly left of border, billows LEFTWARDS outside
    startX = -halfW - 12;
    startY = (Math.random() - 0.5) * (halfH * 2);
    dirX = -(pushDistance + Math.random() * 80);
    dirY = (Math.random() - 0.5) * 60;
  }

  return { startX, startY, dirX, dirY };
}

/**
 * Generates large, dense, volumetric fuzzy smoke particles billowing outward from the 4 box edges.
 */
export function createFuzzyParticles(
  type: ParticleType,
  count?: number,
  streak = 0
): FuzzyParticle[] {
  const actualCount = count !== undefined ? count : calculateParticleCount(type, streak);
  const palette = type === 'correct' ? CORRECT_PALETTE : INCORRECT_PALETTE;
  const particles: FuzzyParticle[] = [];
  const pushDist = type === 'correct' ? 85 : 50;

  for (let i = 0; i < actualCount; i++) {
    const { startX, startY, dirX, dirY } = getEdgeSpawn(185, 115, pushDist);
    const size = Math.round(45 + Math.random() * 70); // 45px to 115px large puffs
    const blur = Math.round(14 + Math.random() * 14); // 14px to 28px fuzzy blur
    const color = palette[Math.floor(Math.random() * palette.length)];
    const durationMs = Math.round(750 + Math.random() * 350); // 750 to 1100ms
    const delayMs = Math.round(Math.random() * 80);
    const opacity = 0.5 + Math.random() * 0.35; // 0.5 to 0.85 soft smoke opacity

    particles.push({
      id: `smoke-${i}-${Math.random().toString(36).substring(2, 6)}`,
      startX,
      startY,
      dirX,
      dirY,
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
 * Generates continuous ambient fuzzy smoke clouds hovering along and outside the card edges.
 */
export function createAmbientSmoke(count?: number, streak = 0): AmbientSmokeOrb[] {
  const actualCount = count !== undefined ? count : calculateAmbientCount(streak);
  const orbs: AmbientSmokeOrb[] = [];

  for (let i = 0; i < actualCount; i++) {
    const { startX, startY, dirX, dirY } = getEdgeSpawn(195, 125, 30);
    const size = Math.round(75 + Math.random() * 65); // 75 to 140px
    const blur = Math.round(20 + Math.random() * 14); // 20 to 34px
    const color = AMBIENT_PALETTE[i % AMBIENT_PALETTE.length];
    const durationSeconds = 4.5 + Math.random() * 3.5; // 4.5 to 8s gentle cycle
    const delaySeconds = -(Math.random() * 4); // randomized phase offset
    const opacity = 0.2 + Math.min(streak * 0.02, 0.15) + Math.random() * 0.1; // scales with streak

    orbs.push({
      id: `ambient-${i}-${streak}`,
      startX,
      startY,
      dirX: Math.round(dirX * 0.5),
      dirY: Math.round(dirY * 0.5),
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
