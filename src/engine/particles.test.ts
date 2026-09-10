import { describe, it, expect } from 'vitest';
import { createFuzzyParticles, CORRECT_PALETTE, INCORRECT_PALETTE } from './particles';

describe('Particle Generator Module', () => {
  it('generates the expected number of particles with valid properties for correct answers', () => {
    const particles = createFuzzyParticles('correct', 16);
    expect(particles).toHaveLength(16);

    particles.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(typeof p.x).toBe('number');
      expect(typeof p.y).toBe('number');
      expect(p.size).toBeGreaterThanOrEqual(8);
      expect(p.size).toBeLessThanOrEqual(26);
      expect(p.blur).toBeGreaterThanOrEqual(2);
      expect(p.blur).toBeLessThanOrEqual(6);
      expect(p.durationMs).toBeGreaterThanOrEqual(450);
      expect(p.durationMs).toBeLessThanOrEqual(800);
      expect(CORRECT_PALETTE).toContain(p.color);
    });
  });

  it('generates particles with incorrect palette and muted puff spread for incorrect answers', () => {
    const particles = createFuzzyParticles('incorrect', 14);
    expect(particles).toHaveLength(14);

    particles.forEach((p) => {
      expect(INCORRECT_PALETTE).toContain(p.color);
      // Puff distance is tighter than correct blast
      const distance = Math.sqrt(p.x * p.x + p.y * p.y);
      expect(distance).toBeLessThanOrEqual(85);
    });
  });

  it('defaults count to 16 if unspecified', () => {
    const particles = createFuzzyParticles('correct');
    expect(particles).toHaveLength(16);
  });
});
