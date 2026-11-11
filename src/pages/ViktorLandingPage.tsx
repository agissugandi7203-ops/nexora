import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { InfiniteMarquee } from '../components/InfiniteMarquee';
import { TestimonialSection } from '../components/TestimonialSection';
import { PricingSection } from '../components/PricingSection';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import { ProjectsSection } from '../components/ProjectsSection';
import { PartnerSection } from '../components/PartnerSection';
import { Footer } from '../components/Footer';
import { CopyrightBar } from '../components/CopyrightBar';
import { BottomNav } from '../components/BottomNav';

/**
 * ViktorLandingPage
 * Standalone pure Viktor Oddy Creative Studio landing page
 * containing all 10 sections exactly as specified.
 */
export const ViktorLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[#051A24] font-neue selection:bg-[#051A24] selection:text-white antialiased relative">
      {/* 1. HERO SECTION (centered, max-w-[440px]) */}
      <HeroSection />

      {/* 2. INFINITE MARQUEE */}
      <InfiniteMarquee />

      {/* 3. TESTIMONIAL QUOTE SECTION (with Parallax) */}
      <TestimonialSection />

      {/* 4. PRICING SECTION */}
      <PricingSection />

      {/* 5. TESTIMONIAL CAROUSEL */}
      <TestimonialCarousel />

      {/* 6. PROJECTS SECTION */}
      <ProjectsSection />

      {/* 7. PARTNER SECTION */}
      <PartnerSection />

      {/* 8. FOOTER */}
      <Footer />

      {/* 9. COPYRIGHT BAR */}
      <CopyrightBar />

      {/* 10. FIXED BOTTOM NAV */}
      <BottomNav />
    </div>
  );
};

export default ViktorLandingPage;
