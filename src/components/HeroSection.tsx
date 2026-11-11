import React from 'react';
import { Button } from './Button';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

export const HeroSection: React.FC = () => {
  const { ref, isInView } = useInViewAnimation<HTMLDivElement>(0.1, true);

  return (
    <div
      ref={ref}
      id="hero-intro"
      className="w-full bg-white text-[#051A24] px-6"
    >
      <div className="max-w-[440px] mx-auto text-left">
        {/* Logo text */}
        <h2
          style={{ animationDelay: '0.1s' }}
          className={`font-mondwest text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-[#051A24] tracking-tight mb-4 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Marhas LMS
        </h2>

        {/* Tagline */}
        <p
          style={{ animationDelay: '0.2s' }}
          className={`font-mono text-xs md:text-sm text-[#051A24] mb-2 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          The creative digital platform of SMK Marhas &middot; Ilham Lesmana
        </p>

        {/* Main Heading */}
        <div
          style={{ animationDelay: '0.3s' }}
          className={`text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight whitespace-nowrap ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div>
            Build the <span className="font-mondwest italic font-normal">next wave</span>,
          </div>
          <div>
            the <span className="font-mondwest italic font-normal">bold way.</span>
          </div>
        </div>

        {/* Description */}
        <div
          style={{ animationDelay: '0.4s' }}
          className={`flex flex-col gap-6 text-sm md:text-base text-[#051A24] leading-relaxed mt-5 md:mt-6 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <p>
            I spent seven years crafting products used by millions of users. I built
            Marhas LMS to bring that same high-level thinking to education and modern learning.
          </p>
          <p>
            The studio is deliberately small. I guide the creative vision on every project, backed
            by a veteran design crew that moves fast without cutting corners.
          </p>
          <p className="font-medium text-[#051A24]">Projects start at $5,000 per month.</p>
        </div>

        {/* Action Buttons */}
        <div
          style={{ animationDelay: '0.5s' }}
          className={`flex flex-col sm:flex-row gap-3 md:gap-4 mt-5 md:mt-6 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <Button variant="primary" href="https://wa.me/6282240487638" target="_blank">
            Start a chat
          </Button>
          <Button variant="secondary" href="#projects">
            View projects
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ViktorHero = HeroSection;
export default HeroSection;
