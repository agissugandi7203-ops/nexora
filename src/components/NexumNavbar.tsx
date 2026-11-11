import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Reviews', href: '#testimonials' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact Me', href: '#contact' },
];

export const NexumNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Page title synchronization: regular dash without em-dash
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Marhas LMS - Modern Learning Platform';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // Scroll listener to detect when user scrolls past the hero
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock while mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleGetStarted = () => {
    navigate('/login-siswa');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const scrollToTop = () => {
    // Segera kembalikan overflow body jika menu mobile sedang terkunci
    document.body.style.overflow = '';
    closeMenu();

    // Jalankan smooth scrolling ke atas (hero / top)
    setTimeout(() => {
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        // Native fallback smooth scroll untuk mobile / HP kentang
        const heroEl = document.querySelector('#hero');
        if (heroEl) {
          heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    }, 60);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (href === '#hero' || href === '#') {
        scrollToTop();
        return;
      }

      document.body.style.overflow = '';
      closeMenu();

      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          const lenis = (window as any).__lenis;
          if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(target as HTMLElement, { offset: -70 });
          } else {
            const rect = target.getBoundingClientRect();
            const top = window.pageYOffset + rect.top - 70;
            window.scrollTo({
              top,
              behavior: 'smooth',
            });
          }
        }
      }, 60);
    }
  };

  return (
    <>
      {/* ====================================================================
          STICKY FLOATING NAVBAR (Root Level z-[100])
          Terdiri dari 3 kapsul terpisah (Logo kiri, Nav tengah, Aksi kanan)
          Menggunakan dark obsidian glass (bg-[#0B0C10]/90 backdrop-blur-2xl)
          sehingga 100% SELALU TERLIHAT & KONTRAS baik di video gelap maupun section putih!
         ==================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between pointer-events-none transition-all duration-300">
        {/* Left: Logo Capsule */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className={`flex items-center gap-2.5 rounded-full p-1 sm:px-4 sm:py-1.5 border transition-all duration-300 pointer-events-auto shadow-md group ${
            isScrolled
              ? 'bg-[#0B0C10]/95 backdrop-blur-2xl border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.4)]'
              : 'bg-[#0B0C10]/85 backdrop-blur-xl border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
          }`}
          aria-label="Marhas LMS Home"
        >
          <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <svg
              className="h-4.5 w-4.5 fill-white"
              viewBox="0 0 256 256"
              aria-hidden="true"
            >
              <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
            </svg>
          </div>
          <span className="hidden sm:inline text-base font-semibold tracking-tight text-white transition-colors duration-200">
            Marhas LMS
          </span>
        </a>

        {/* Center: Desktop Navigation Links Pill (5 items sesuai hierarki) */}
        <div
          className={`hidden md:flex items-center gap-1 rounded-full px-3 py-1.5 border transition-all duration-300 pointer-events-auto shadow-md ${
            isScrolled
              ? 'bg-[#0B0C10]/95 backdrop-blur-2xl border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.4)]'
              : 'bg-[#0B0C10]/85 backdrop-blur-xl border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
          }`}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium text-white/90 hover:text-white hover:bg-white/15 transition-all"
            >
              <span>{item.name}</span>
            </a>
          ))}
        </div>

        {/* Right: Action Capsule (Get started + Mobile Toggle) */}
        <div
          className={`flex items-center gap-2 rounded-full p-1 sm:px-2 sm:py-1 border transition-all duration-300 pointer-events-auto shadow-md ${
            isScrolled
              ? 'bg-[#0B0C10]/95 backdrop-blur-2xl border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.4)]'
              : 'bg-[#0B0C10]/85 backdrop-blur-xl border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
          }`}
        >
          <button
            type="button"
            onClick={handleGetStarted}
            className="hidden md:flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold text-black bg-white hover:bg-slate-100 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Get started
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-lg text-white border border-white/20 transition-all md:hidden focus:outline-none"
          >
            <Menu
              className={`absolute h-4 w-4 transition-all duration-300 ${
                isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              className={`absolute h-4 w-4 transition-all duration-300 ${
                isMenuOpen ? 'rotate-0 scale-100 opacity-100 text-white' : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </button>
        </div>
      </header>

      {/* ====================================================================
          MOBILE DRAWER & BACKDROP (z-[110] di atas segalanya)
          Header drawer menggunakan logo SVG asli dari navbar ("logo yang itu")
         ==================================================================== */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-[105] bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <div
        className={`fixed right-3 top-3 bottom-3 z-[110] flex w-[calc(100vw-24px)] max-w-xs flex-col rounded-[28px] border border-white/15 bg-[#0D0F14]/98 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-[115%]'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header dengan Logo SVG yang Sama ("Logo Yang Itu") */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            aria-label="Kembali ke atas (Hero)"
          >
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg
                className="h-4 w-4 fill-white"
                viewBox="0 0 256 256"
                aria-hidden="true"
              >
                <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight text-base block group-hover:text-emerald-400 transition-colors">
                Marhas LMS
              </span>
              <span className="text-[11px] text-white/50 block font-mono">
                SMK Marhas Margahayu
              </span>
            </div>
          </button>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links Sesuai Hierarki */}
        <div className="flex flex-col gap-1.5 pt-5">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10 hover:text-white transition-all active:scale-[0.99]"
            >
              <span>{item.name}</span>
              <ArrowRight className="h-4 w-4 text-white/30" aria-hidden="true" />
            </a>
          ))}
        </div>

        {/* Mobile Bottom Action Buttons */}
        <div className="mt-auto pt-5 border-t border-white/10 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate('/login-siswa');
            }}
            className="w-full rounded-full py-3.5 text-sm font-semibold text-black bg-white hover:bg-white/90 transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            Portal Siswa
          </button>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate('/login-admin');
            }}
            className="w-full rounded-full py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all active:scale-[0.98] cursor-pointer"
          >
            Portal Guru &amp; Staff
          </button>
        </div>
      </div>
    </>
  );
};

export default NexumNavbar;