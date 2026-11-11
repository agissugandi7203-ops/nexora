import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MARQUEE_IMAGES } from './InfiniteMarquee';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  image: string;
  createdAt: number;
}

export const PartnerSection: React.FC = () => {
  const { ref: sectionRef, isInView } = useInViewAnimation<HTMLElement>(0.1, true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const imageIndexRef = useRef<number>(0);

  // Spawning GIF thumbnails at cursor position with 80ms throttle
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const now = Date.now();
    if (now - lastSpawnRef.current < 80) return;
    lastSpawnRef.current = now;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotation = Math.random() * 20 - 10; // -10 to +10 deg
    const image = MARQUEE_IMAGES[imageIndexRef.current % MARQUEE_IMAGES.length];
    imageIndexRef.current += 1;

    const newParticle: Particle = {
      id: now + Math.random(),
      x,
      y,
      rotation,
      image,
      createdAt: now,
    };

    setParticles((prev) => [...prev.slice(-15), newParticle]);
  }, []);

  // RequestAnimationFrame cleanup of particles older than 1000ms
  useEffect(() => {
    let animId: number;

    const cleanLoop = () => {
      const now = Date.now();
      setParticles((prev) => {
        const active = prev.filter((p) => now - p.createdAt < 1000);
        return active.length !== prev.length ? active : prev;
      });
      animId = requestAnimationFrame(cleanLoop);
    };

    animId = requestAnimationFrame(cleanLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-12 px-6">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`max-w-7xl mx-auto py-28 md:py-48 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-100 bg-white relative overflow-hidden flex flex-col items-center justify-center text-center cursor-default select-none ${
          isInView ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        {/* Interactive Spawning GIF Thumbnails */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((p) => {
            const age = Date.now() - p.createdAt;
            const progress = Math.min(1, Math.max(0, age / 1000));
            const opacity = 1 - progress;
            const scale = 1 - progress * 0.35;

            return (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${scale})`,
                  opacity,
                  transition: 'opacity 0.2s linear, transform 0.2s linear',
                }}
                className="w-28 h-20 md:w-36 md:h-24 rounded-xl overflow-hidden shadow-2xl border-2 border-white pointer-events-none z-0"
              >
                <img
                  src={p.image}
                  alt="interactive thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* Content layer above cursor particles */}
        <div className="relative z-10 px-6 max-w-3xl">
          <h2 className="font-mondwest text-[48px] md:text-[64px] lg:text-[80px] leading-[1.05] text-[#0D212C] tracking-tight mb-12">
            Partner with us
          </h2>

          <a
            href="https://wa.me/6282240487638"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-[#051A24] text-white rounded-full pl-3 pr-7 py-2.5 shadow-btn-primary hover:bg-[#092634] transition-all duration-200 active:scale-95 group"
          >
            <img
              src="/ilham-avatar.jpg"
              alt="Ilham Lesmana"
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
            <span className="font-medium text-sm md:text-base tracking-tight">
              Start chat with Ilham Lesmana
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
