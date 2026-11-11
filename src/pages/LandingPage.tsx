import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { evaluateDevicePerformance } from '../utils/devicePerformance';
import { NexumNavbar } from '../components/NexumNavbar';
import { NexumHero } from '../components/NexumHero';
import { HeroSection } from '../components/HeroSection';
import { InfiniteMarquee } from '../components/InfiniteMarquee';
import { TestimonialSection } from '../components/TestimonialSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import { PricingSection } from '../components/PricingSection';
import { PartnerSection } from '../components/PartnerSection';
import { Footer } from '../components/Footer';
import { BottomNav } from '../components/BottomNav';

/**
 * LandingPage
 * Unified single-page experience:
 * 0. Sticky Floating Navbar (Root Level z-[100], 100% visible on dark & white)
 * 1. Hero (#hero)
 * 2. About (#about)
 * 3. Infinite Marquee
 * 4. Testimonial Quote with Pak Ilham Lesmana Studio Photo
 * 5. Projects (#projects)
 * 6. Reviews (#testimonials)
 * 7. Pricing (#pricing) with 3 Tiers including Rupiah (IDR)
 * 8. Contact Me (#contact)
 * 9. Layered Card & Glass Filter Footer
 * 10. Bottom Nav
 */
export const LandingPage: React.FC = () => {
  // LENIS Smooth Scrolling: Adaptif Berdasarkan Kemampuan Hardware Perangkat
  // - HP Kentang (Low-End / Mode Hemat Daya): Lenis OFF, scrolling native momentum 60fps tanpa lagging
  // - HP Bagus (Flagship) & Desktop/Laptop: Lenis ON dengan touchMultiplier yang disesuaikan
  useEffect(() => {
    const spec = evaluateDevicePerformance();

    // 1. HP Kentang / Perangkat Spesifikasi Terbatas: Fallback ke Smooth Scrolling Native
    if (!spec.canRunLenis) {
      const handleNativeAnchorClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('a');
        if (!target) return;
        const href = target.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          if (href === '#hero') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          const element = document.querySelector(href);
          if (element) {
            e.preventDefault();
            const rect = element.getBoundingClientRect();
            const top = window.pageYOffset + rect.top - 70;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      };

      document.addEventListener('click', handleNativeAnchorClick);
      return () => {
        document.removeEventListener('click', handleNativeAnchorClick);
      };
    }

    // 2. HP Flagship / Bagus & Desktop: Inisialisasi Lenis Smooth Scroll adaptif
    const lenis = new Lenis({
      duration: spec.isMobile ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: spec.isMobile ? 1.2 : 1.5,
    });

    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Smooth anchor navigation handling with Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        if (href === '#hero') {
          e.preventDefault();
          lenis.scrollTo(0, { offset: 0 });
          return;
        }
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, { offset: -70 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#051A24] font-neue selection:bg-[#051A24] selection:text-white antialiased relative">
      {/* 0. STICKY FLOATING NAVBAR (Mounted at Root Level z-[100]) */}
      <NexumNavbar />

      {/* 1. HERO SECTION */}
      <header id="hero" className="relative w-full">
        <NexumHero />
      </header>

      {/* 2. ABOUT SECTION */}
      <section
        id="about"
        className="relative bg-white pt-20 md:pt-28 pb-6 scroll-mt-20"
      >
        <HeroSection />
      </section>

      {/* 3. SHOWCASE & CONTENT FLOW */}
      <main className="relative bg-white">
        {/* Infinite Marquee strip with 8 GIFs (duplicated for 16, slowed 10%) */}
        <InfiniteMarquee />

        {/* Testimonial Quote Section with Apple serif & Parallax Photo of Pak Ilham */}
        <TestimonialSection />

        {/* 4. PROJECTS SECTION */}
        <div id="projects" className="scroll-mt-24">
          <ProjectsSection />
        </div>

        {/* 5. REVIEWS / CLIENT TESTIMONIALS CAROUSEL */}
        <div id="testimonials" className="scroll-mt-24">
          <TestimonialCarousel />
        </div>

        {/* 6. PRICING SECTION (3 Cards: 1 IDR + 2 USD) */}
        <div id="pricing" className="scroll-mt-24">
          <PricingSection />
        </div>

        {/* 7. CONTACT ME SECTION */}
        <div id="contact" className="scroll-mt-24">
          <PartnerSection />
        </div>
      </main>

      {/* 8. Layered Card & SVG Glass Text Footer */}
      <Footer />

      {/* 9. Fixed Floating Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default LandingPage;