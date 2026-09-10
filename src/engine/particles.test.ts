import { describe, it, expect } from 'vitest';
import {
  createFuzzyParticles,
  createAmbientSmoke,
  CORRECT_PALETTE,
  INCORRECT_PALETTE,
} from './particles';

describe('Particle Generator Module', () => {
  it('generates dense smoke particles with large size and heavy blur for correct answers', () => {
    const particles = createFuzzyParticles('correct', 24);
    expect(particles).toHaveLength(24);

    particles.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(typeof p.x).toBe('number');
      expect(typeof p.y).toBe('number');
      expect(p.size).toBeGreaterThanOrEqual(40);
      expect(p.size).toBeLessThanOrEqual(110);
      expect(p.blur).toBeGreaterThanOrEqual(12);
      expect(p.blur).toBeLessThanOrEqual(26);
      expect(p.durationMs).toBeGreaterThanOrEqual(700);
      expect(p.durationMs).toBeLessThanOrEqual(1100);
      expect(CORRECT_PALETTE).toContain(p.color);
    });
  });

  it('generates particles with incorrect palette and muted puff spread for incorrect answers', () => {
    const particles = createFuzzyParticles('incorrect', 16);
    expect(particles).toHaveLength(16);

    particles.forEach((p) => {
      expect(INCORRECT_PALETTE).toContain(p.color);
      const distance = Math.sqrt(p.x * p.x + p.y * p.y);
      expect(distance).toBeLessThanOrEqual(200);
    });
  });

  it('generates ambient smoke orbs for continuous subtle perimeter aura', () => {
    const ambientOrbs = createAmbientSmoke(8);
    expect(ambientOrbs).toHaveLength(8);

    ambientOrbs.forEach((orb) => {
      expect(orb.id).toBeTruthy();
      expect(orb.size).toBeGreaterThanOrEqual(80);
      expect(orb.size).toBeLessThanOrEqual(140);
      expect(orb.blur).toBeGreaterThanOrEqual(20);
      expect(orb.blur).toBeLessThanOrEqual(32);
      expect(orb.durationSeconds).toBeGreaterThanOrEqual(5);
    });
  });

  it('defaults count to 24 if unspecified', () => {
    const particles = createFuzzyParticles('correct');
    expect(particles).toHaveLength(24);
  });
});
