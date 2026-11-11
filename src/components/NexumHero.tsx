import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NexumHero: React.FC = () => {
  const navigate = useNavigate();

  // Page title synchronization: regular dash without em-dash
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Marhas LMS - Modern Learning Platform';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/login-siswa');
  };

  const handleLearnMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const lenis = (window as any).__lenis;
    const target = document.querySelector('#about');
    if (lenis && typeof lenis.scrollTo === 'function' && target) {
      lenis.scrollTo(target as HTMLElement, { offset: -70 });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen lg:h-screen w-full overflow-hidden font-geist antialiased select-none flex flex-col justify-between pt-28 pb-6">
      {/* Background Video: Full-bleed, continuous muted loop */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay for optimal text contrast */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* ====================================================================
          MAIN HERO CONTENT: BENER-BENER CENTER (2 Baris Besar & CTA Bebas)
         ==================================================================== */}
      <div className="relative z-10 my-auto w-full max-w-4xl mx-auto px-4 py-8 text-center flex flex-col items-center justify-center">
        {/* 2 Baris Besar Khas SaaS */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.65rem] font-semibold leading-[1.08] tracking-tight text-white text-center transition-colors duration-200">
          <span>Marhas LMS,</span>
          <br />
          <span className="font-mondwest italic font-normal text-white/95">
            Built for modern education.
          </span>
        </h1>

        {/* CTA: Get started + Learn more (Center Aligned) */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={handleGetStarted}
            className="rounded-full px-8 py-3.5 text-sm font-semibold text-black bg-white hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          >
            Get started
          </button>

          <a
            href="#about"
            onClick={handleLearnMore}
            className="rounded-full px-7 py-3.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all active:scale-95 flex items-center gap-2 group cursor-pointer"
          >
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* ====================================================================
          HERO BOTTOM CARDS (Left Stats + Right Testimonial)
         ==================================================================== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 pb-4 sm:pb-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Bottom: Stats Card */}
        <div className="flex flex-col justify-between rounded-2xl bg-white/10 p-5 backdrop-blur-lg w-full sm:w-64 border border-white/10 shadow-lg">
          <div
            style={{ fontFamily: "'Silkscreen', cursive" }}
            className="text-3xl font-normal tracking-tight text-white sm:text-4xl"
          >
            42,500+
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Teams run Marhas LMS to handle recurring ops daily.
          </p>
        </div>

        {/* Right Bottom: Testimonial Card */}
        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-lg w-full sm:w-64 flex flex-col justify-between border border-white/10 shadow-lg">
          <div>
            {/* Stratify Header Row */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black">
                <span className="text-xs font-bold text-white">S</span>
              </div>
              <span className="text-sm font-semibold text-white">
                Stratify
              </span>
            </div>

            {/* Quote */}
            <p className="text-sm leading-relaxed text-white/80">
              &ldquo;With Marhas LMS we went from managing tedious coursework ops to having a platform that handles everything.&rdquo;
            </p>
          </div>

          {/* Author Footer */}
          <div className="mt-4 flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
              alt="Sara Klein"
              className="h-9 w-9 rounded-full object-cover bg-white/20 border border-white/20"
              loading="lazy"
            />
            <div>
              <div className="text-sm font-semibold text-white">
                Sara Klein
              </div>
              <div className="text-xs text-white/60">
                Dir of Operations
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NexumHero;