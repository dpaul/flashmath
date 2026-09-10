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
      className="pointer-events-none absolute inset-0 overflow-visible flex items-center justify-center z-30 select-none"
    >
      {particles.map((p) => {
        const style: React.CSSProperties & { [key: string]: string | number } = {
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.color,
          filter: `blur(${p.blur}px)`,
          boxShadow: `0 0 ${p.size * 0.9}px ${p.color}`,
          opacity: p.opacity,
          left: '50%',
          top: '50%',
          transform: `translate3d(calc(-50% + ${p.startX}px), calc(-50% + ${p.startY}px), 0)`,
          '--tx': `${p.dirX}px`,
          '--ty': `${p.dirY}px`,
          animation: `fuzzyBurst ${p.durationMs}ms cubic-bezier(0.12, 0.8, 0.25, 1) ${p.delayMs}ms forwards`,
        };

        return (
          <span
            key={p.id}
            data-testid="fuzzy-particle"
            className="fuzzy-particle-item absolute rounded-full pointer-events-none will-change-transform mix-blend-screen"
            style={style}
          />
        );
      })}
    </div>
  );
};

/**
 * Continuous ambient drifting smoke clouds along and outside the card edges, scaling with streak.
 */
export const AmbientSmoke: React.FC<AmbientSmokeProps> = ({ streak = 0 }) => {
  const [orbs, setOrbs] = useState(() => createAmbientSmoke(undefined, streak));

  useEffect(() => {
    setOrbs(createAmbientSmoke(undefined, streak));
  }, [streak]);

  return (
    <div
      data-testid="ambient-smoke-container"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible flex items-center justify-center z-20 select-none"
    >
      {orbs.map((orb) => {
        const style: React.CSSProperties & { [key: string]: string | number } = {
          width: `${orb.size}px`,
          height: `${orb.size}px`,
          backgroundColor: orb.color,
          filter: `blur(${orb.blur}px)`,
          boxShadow: `0 0 ${orb.size}px ${orb.color}`,
          opacity: orb.opacity,
          left: '50%',
          top: '50%',
          transform: `translate3d(calc(-50% + ${orb.startX}px), calc(-50% + ${orb.startY}px), 0)`,
          animation: `ambientDrift ${orb.durationSeconds}s ease-in-out ${orb.delaySeconds}s infinite alternate`,
        };

        return (
          <span
            key={orb.id}
            data-testid="ambient-smoke-orb"
            className="ambient-smoke-orb absolute rounded-full pointer-events-none will-change-transform mix-blend-screen"
            style={style}
          />
        );
      })}
    </div>
  );
};
