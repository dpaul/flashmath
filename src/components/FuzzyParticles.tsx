import React, { useState, useEffect } from 'react';
import { createFuzzyParticles, ParticleType } from '../engine/particles';

interface FuzzyParticlesProps {
  type: ParticleType;
  count?: number;
  onComplete?: () => void;
}

export const FuzzyParticles: React.FC<FuzzyParticlesProps> = ({
  type,
  count,
  onComplete,
}) => {
  const [particles] = useState(() => createFuzzyParticles(type, count));
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Find longest duration among all particles
    const maxDuration = particles.reduce(
      (max, p) => Math.max(max, p.durationMs + p.delayMs),
      650
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
          boxShadow: `0 0 ${p.size}px ${p.color}`,
          opacity: p.opacity,
          '--tx': `${p.x}px`,
          '--ty': `${p.y}px`,
          animation: `fuzzyBurst ${p.durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${p.delayMs}ms forwards`,
        };

        return (
          <span
            key={p.id}
            data-testid="fuzzy-particle"
            className="fuzzy-particle-item absolute rounded-full pointer-events-none will-change-transform"
            style={style}
          />
        );
      })}
    </div>
  );
};
