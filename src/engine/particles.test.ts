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
      expect(p.size).toBeGreaterThanOrEqual(80);
      expect(p.size).toBeLessThanOrEqual(185);
      expect(p.blur).toBeGreaterThanOrEqual(28);
      expect(p.blur).toBeLessThanOrEqual(62);
      expect(p.durationMs).toBeGreaterThanOrEqual(750);
      expect(p.durationMs).toBeLessThanOrEqual(1200);
      expect(CORRECT_PALETTE).toContain(p.color);
    });
  });

  it('generates particles with incorrect palette and muted puff spread for incorrect answers', () => {
    const particles = createFuzzyParticles('incorrect', 28);
    expect(particles).toHaveLength(28);

    particles.forEach((p) => {
      expect(INCORRECT_PALETTE).toContain(p.color);
      const outwardDist = Math.sqrt(p.dirX * p.dirX + p.dirY * p.dirY);
      expect(outwardDist).toBeGreaterThan(0);
    });
  });

  it('scales particle count with streak on correct answers and resets on mistakes', () => {
    // Streak 0
    expect(calculateParticleCount('correct', 0)).toBe(32);
    // Streak 3
    expect(calculateParticleCount('correct', 3)).toBe(56);
    // Streak 8
    expect(calculateParticleCount('correct', 8)).toBe(96);
    // High streak cap
    expect(calculateParticleCount('correct', 20)).toBe(96);
    // Mistake resets to minimal baseline
    expect(calculateParticleCount('incorrect', 10)).toBe(28);
  });

  it('scales ambient smoke count with streak across all 4 sides', () => {
    expect(calculateAmbientCount(0)).toBe(16);
    expect(calculateAmbientCount(3)).toBe(28);
    expect(calculateAmbientCount(10)).toBe(40);
  });

  it('generates ambient smoke orbs for continuous perimeter aura with dynamic motion', () => {
    const ambientOrbs = createAmbientSmoke(16, 0, 'correct');
    expect(ambientOrbs).toHaveLength(16);

    ambientOrbs.forEach((orb) => {
      expect(orb.id).toBeTruthy();
      expect(orb.size).toBeGreaterThanOrEqual(95);
      expect(orb.size).toBeLessThanOrEqual(185);
      expect(orb.blur).toBeGreaterThanOrEqual(30);
      expect(orb.blur).toBeLessThanOrEqual(60);
      expect(orb.durationSeconds).toBeGreaterThanOrEqual(3.0);
      expect(CORRECT_PALETTE).toContain(orb.color);
    });

    const incorrectOrbs = createAmbientSmoke(8, 0, 'incorrect');
    incorrectOrbs.forEach((orb) => {
      expect(INCORRECT_PALETTE).toContain(orb.color);
    });
  });
});
