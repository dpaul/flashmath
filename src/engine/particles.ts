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
  '#859900', // solarized green
  '#2aa198', // solarized cyan
  '#268bd2', // solarized blue
  '#35b5a8', // soft solarized teal
  '#788a00', // olive green
  '#97aa1e', // light olive
  '#b58900', // solarized amber / gold
  '#20948b', // deep solarized cyan
];

export const INCORRECT_PALETTE = [
  '#dc322f', // solarized red
  '#cb4b16', // solarized terracotta
  '#d33682', // solarized magenta
  '#e04638', // warm coral red
  '#b83418', // deep terracotta
];

export const AMBIENT_PALETTE = CORRECT_PALETTE;

/**
 * Calculates number of burst particles based on streak.
 * Incorrect answers reset to baseline puff; correct answers scale with streak.
 * Doubled for an amorphous, continuous glowing cloud effect.
 */
export function calculateParticleCount(type: ParticleType, streak = 0): number {
  if (type === 'incorrect') {
    return 28; // Subtle reset / error puff
  }
  // Scales with streak: streak 0 = 32, streak 3 = 56, streak 8+ = up to 96
  return Math.min(32 + streak * 8, 96);
}

/**
 * Calculates number of continuous ambient smoke clouds based on current streak.
 * Guarantees clouds on all 4 sides of the box (multiples of 4).
 */
export function calculateAmbientCount(streak = 0): number {
  if (streak === 0) return 16; // 4 on each of the 4 sides
  return Math.min(16 + streak * 4, 40);
}

/**
 * Returns a point along one of the 4 rectangular boundaries and an outward direction vector.
 * Using edgeIndex guarantees particles emanate from all 4 sides of the box.
 */
function getEdgeSpawn(edgeIndex: number, halfW = 205, halfH = 110, pushDistance = 55) {
  const edge = Math.abs(edgeIndex) % 4;
  let startX = 0;
  let startY = 0;
  let dirX = 0;
  let dirY = 0;

  if (edge === 0) {
    // Top edge: spawns along top border, billows UPWARDS outside
    startX = (Math.random() - 0.5) * (halfW * 1.85);
    startY = -halfH - 8;
    dirX = (Math.random() - 0.5) * 60;
    dirY = -(pushDistance + Math.random() * 65);
  } else if (edge === 1) {
    // Right edge: spawns along right border, billows RIGHTWARDS outside
    startX = halfW + 8;
    startY = (Math.random() - 0.5) * (halfH * 1.6);
    dirX = pushDistance + Math.random() * 65;
    dirY = (Math.random() - 0.5) * 60;
  } else if (edge === 2) {
    // Bottom edge: spawns along bottom border, billows DOWNWARDS outside
    startX = (Math.random() - 0.5) * (halfW * 1.85);
    startY = halfH + 8;
    dirX = (Math.random() - 0.5) * 60;
    dirY = pushDistance + Math.random() * 65;
  } else {
    // Left edge: spawns along left border, billows LEFTWARDS outside
    startX = -halfW - 8;
    startY = (Math.random() - 0.5) * (halfH * 1.6);
    dirX = -(pushDistance + Math.random() * 65);
    dirY = (Math.random() - 0.5) * 60;
  }

  return { startX, startY, dirX, dirY };
}

/**
 * Generates large, dense, amorphous fuzzy smoke glow billowing outward from all 4 box edges.
 */
export function createFuzzyParticles(
  type: ParticleType,
  count?: number,
  streak = 0
): FuzzyParticle[] {
  const actualCount = count !== undefined ? count : calculateParticleCount(type, streak);
  const palette = type === 'correct' ? CORRECT_PALETTE : INCORRECT_PALETTE;
  const particles: FuzzyParticle[] = [];
  const pushDist = type === 'correct' ? 65 : 40;

  for (let i = 0; i < actualCount; i++) {
    const { startX, startY, dirX, dirY } = getEdgeSpawn(i, 205, 110, pushDist);
    const size = Math.round(85 + Math.random() * 95); // 85px to 180px large overlapping puffs
    const blur = Math.round(30 + Math.random() * 30); // 30px to 60px heavy fuzzy blur
    const color = palette[Math.floor(Math.random() * palette.length)];
    const durationMs = Math.round(800 + Math.random() * 350); // 800 to 1150ms
    const delayMs = Math.round(Math.random() * 60);
    const opacity = 0.08 + Math.random() * 0.08; // 0.08 to 0.16 whisper-soft watercolor wash

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
 * Generates continuous ambient fuzzy smoke clouds hovering along all 4 edges.
 * Uses soft Solarized green/cyan palette until problem is wrong, then switches to warning palette.
 */
export function createAmbientSmoke(
  count?: number,
  streak = 0,
  status: ParticleType = 'correct'
): AmbientSmokeOrb[] {
  const actualCount = count !== undefined ? count : calculateAmbientCount(streak);
  const palette = status === 'correct' ? CORRECT_PALETTE : INCORRECT_PALETTE;
  const orbs: AmbientSmokeOrb[] = [];

  for (let i = 0; i < actualCount; i++) {
    const { startX, startY, dirX, dirY } = getEdgeSpawn(i, 210, 115, 25);
    const size = Math.round(100 + Math.random() * 80); // 100 to 180px
    const blur = Math.round(32 + Math.random() * 25); // 32 to 57px
    const color = palette[i % palette.length];
    const durationSeconds = 3.2 + Math.random() * 2.5; // 3.2 to 5.7s gentle breathing cycle
    const delaySeconds = -(Math.random() * 3); // randomized phase offset
    const opacity = 0.04 + Math.min(streak * 0.005, 0.04) + Math.random() * 0.03; // 0.04 to 0.11 delicate ambient aura

    orbs.push({
      id: `ambient-${i}-${streak}-${status}`,
      startX,
      startY,
      dirX: Math.round(dirX * 0.6),
      dirY: Math.round(dirY * 0.6),
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
