import React, { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

export const TestimonialSection: React.FC = () => {
  const { ref: sectionRef, isInView } = useInViewAnimation<HTMLElement>(0.1, true);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const parallaxImageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;
    let isIntersecting = false;

    const target = imageContainerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(target);

    const handleScroll = () => {
      if (!isIntersecting || !target || !parallaxImageRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!parallaxImageRef.current || !target) {
            ticking = false;
            return;
          }
          const rect = target.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const diff = (elementCenter - viewportCenter) / (windowHeight / 2);

          // Max offset 120px, direct GPU style translation (NO React re-render)
          const offset = Math.max(-120, Math.min(120, diff * 80));
          parallaxImageRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full py-12 px-6 max-w-2xl mx-auto flex flex-col items-center text-center transform-gpu"
    >
      {/* Quote Icon */}
      <div
        style={{ animationDelay: '0.1s' }}
        className={`mb-6 text-slate-900 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <Quote className="w-6 h-6 text-slate-900 fill-slate-900/10" />
      </div>

      {/* Large Quote Text */}
      <blockquote
        style={{ animationDelay: '0.2s' }}
        className={`text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight font-medium ${
          isInView ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        &ldquo;I left{' '}
        <span className="font-mondwest italic font-normal text-[#051A24]">Apple</span> to build
        the studio I always wanted to work with&rdquo;
      </blockquote>

      {/* Author: Ilham Lesmana */}
      <p
        style={{ animationDelay: '0.3s' }}
        className={`italic text-sm text-[#273C46] mt-4 font-medium ${
          isInView ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        Ilham Lesmana
      </p>

      {/* Three company logos as text */}
      <div
        style={{ animationDelay: '0.4s' }}
        className={`flex items-center justify-center gap-8 md:gap-12 mt-8 text-slate-900 font-medium ${
          isInView ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <span className="w-[80px] text-[24px] tracking-tight text-center">Apple</span>
        <span className="w-[83px] text-[24px] tracking-widest text-center uppercase font-semibold">
          IDEO
        </span>
        <span className="w-[110px] text-[24px] tracking-tight text-center font-semibold">
          Polygon
        </span>
      </div>

      {/* Parallax Image: Profile Photo of Ilham Lesmana */}
      <div
        ref={imageContainerRef}
        style={{ animationDelay: '0.4s' }}
        className={`mt-12 w-full max-w-xs overflow-hidden rounded-2xl shadow-lg relative bg-slate-100 ${
          isInView ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <div
          ref={parallaxImageRef}
          style={{
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="w-full"
        >
          <img
            src="/ilham-lesmana.jpg"
            alt="Ilham Lesmana"
            className="w-full h-auto object-cover rounded-2xl block"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
