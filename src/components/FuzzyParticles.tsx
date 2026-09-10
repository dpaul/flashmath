import React, { useState, useEffect } from 'react';
import {
  createFuzzyParticles,
  createAmbientSmoke,
  ParticleType,
} from '../engine/particles';

interface FuzzyParticlesProps {
  type: ParticleType;
  count?: number;
  streak?: number;
  onComplete?: () => void;
}

interface AmbientSmokeProps {
  streak?: number;
  status?: ParticleType;
}

/**
 * High-energy fuzzy smoke burst emanating outward from the edges of the box on answer submission.
 */
export const FuzzyParticles: React.FC<FuzzyParticlesProps> = ({
  type,
  count,
  streak = 0,
  onComplete,
}) => {
  const [particles] = useState(() => createFuzzyParticles(type, count, streak));
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Find longest duration among all particles
    const maxDuration = particles.reduce(
      (max, p) => Math.max(max, p.durationMs + p.delayMs),
      850
    );

    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, maxDuration + 30);

    return () => clearTimeout(timer);
  }, [particles, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      data-testid="fuzzy-particles-container"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible flex items-center justify-center z-10 select-none"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          data-testid="fuzzy-particle"
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate3d(calc(-50% + ${p.startX}px), calc(-50% + ${p.startY}px), 0)`,
          }}
        >
          <span
            className="fuzzy-particle-item block rounded-full pointer-events-none will-change-transform mix-blend-screen"
            style={
              {
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                filter: `blur(${p.blur}px)`,
                boxShadow: `0 0 ${Math.round(p.size * 0.9)}px ${p.color}`,
                opacity: p.opacity,
                '--tx': `${p.dirX}px`,
                '--ty': `${p.dirY}px`,
                animation: `fuzzyBurst ${p.durationMs}ms cubic-bezier(0.12, 0.8, 0.25, 1) ${p.delayMs}ms forwards`,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Continuous ambient drifting smoke clouds along and outside all 4 edges.
 */
export const AmbientSmoke: React.FC<AmbientSmokeProps> = ({
  streak = 0,
  status = 'correct',
}) => {
  const [orbs, setOrbs] = useState(() => createAmbientSmoke(undefined, streak, status));

  useEffect(() => {
    setOrbs(createAmbientSmoke(undefined, streak, status));
  }, [streak, status]);

  return (
    <div
      data-testid="ambient-smoke-container"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible flex items-center justify-center z-0 select-none"
    >
      {orbs.map((orb) => (
        <div
          key={orb.id}
          data-testid="ambient-smoke-orb"
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate3d(calc(-50% + ${orb.startX}px), calc(-50% + ${orb.startY}px), 0)`,
          }}
        >
          <span
            className="ambient-smoke-orb block rounded-full pointer-events-none will-change-transform mix-blend-screen"
            style={
              {
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                backgroundColor: orb.color,
                filter: `blur(${orb.blur}px)`,
                boxShadow: `0 0 ${orb.size}px ${orb.color}`,
                opacity: orb.opacity,
                '--drift-x': `${orb.dirX}px`,
                '--drift-y': `${orb.dirY}px`,
                animation: `ambientDrift ${orb.durationSeconds}s ease-in-out ${orb.delaySeconds}s infinite alternate`,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
};
