import { describe, it, expect } from 'vitest';
import {
  createFuzzyParticles,
  createAmbientSmoke,
  calculateParticleCount,
  calculateAmbientCount,
  CORRECT_PALETTE,
  INCORRECT_PALETTE,
} from './particles';

describe('Particle Generator Module', () => {
  it('generates dense smoke particles emanating from box edges with outward drift vectors', () => {
    const particles = createFuzzyParticles('correct', 24);
    expect(particles).toHaveLength(24);

    particles.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(typeof p.startX).toBe('number');
      expect(typeof p.startY).toBe('number');
      expect(typeof p.dirX).toBe('number');
      expect(typeof p.dirY).toBe('number');
      expect(p.size).toBeGreaterThanOrEqual(45);
      expect(p.size).toBeLessThanOrEqual(115);
      expect(p.blur).toBeGreaterThanOrEqual(14);
      expect(p.blur).toBeLessThanOrEqual(28);
      expect(p.durationMs).toBeGreaterThanOrEqual(750);
      expect(p.durationMs).toBeLessThanOrEqual(1100);
      expect(CORRECT_PALETTE).toContain(p.color);
    });
  });

  it('generates particles with incorrect palette and muted puff spread for incorrect answers', () => {
    const particles = createFuzzyParticles('incorrect', 14);
    expect(particles).toHaveLength(14);

    particles.forEach((p) => {
      expect(INCORRECT_PALETTE).toContain(p.color);
      const outwardDist = Math.sqrt(p.dirX * p.dirX + p.dirY * p.dirY);
      expect(outwardDist).toBeGreaterThan(0);
    });
  });

  it('scales particle count with streak on correct answers and resets on mistakes', () => {
    // Streak 0
    expect(calculateParticleCount('correct', 0)).toBe(16);
    // Streak 3
    expect(calculateParticleCount('correct', 3)).toBe(28);
    // Streak 8
    expect(calculateParticleCount('correct', 8)).toBe(48);
    // High streak cap
    expect(calculateParticleCount('correct', 20)).toBe(48);
    // Mistake resets to minimal baseline
    expect(calculateParticleCount('incorrect', 10)).toBe(14);
  });

  it('scales ambient smoke count with streak', () => {
    expect(calculateAmbientCount(0)).toBe(6);
    expect(calculateAmbientCount(3)).toBe(12);
    expect(calculateAmbientCount(10)).toBe(18);
  });

  it('generates ambient smoke orbs for continuous subtle perimeter aura', () => {
    const ambientOrbs = createAmbientSmoke(8);
    expect(ambientOrbs).toHaveLength(8);

    ambientOrbs.forEach((orb) => {
      expect(orb.id).toBeTruthy();
      expect(orb.size).toBeGreaterThanOrEqual(75);
      expect(orb.size).toBeLessThanOrEqual(140);
      expect(orb.blur).toBeGreaterThanOrEqual(20);
      expect(orb.blur).toBeLessThanOrEqual(34);
      expect(orb.durationSeconds).toBeGreaterThanOrEqual(4.5);
    });
  });
});
