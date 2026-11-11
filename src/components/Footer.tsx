import React from 'react';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import { motion } from 'motion/react';

// Component 1: LogoIcon
export const LogoIcon: React.FC = () => {
  return (
    <div className="w-8 h-8 bg-[#051A24] rounded-[8px] flex items-center justify-center shadow-sm flex-shrink-0">
      <svg
        className="w-4 h-4 fill-white"
        viewBox="0 0 256 256"
        aria-hidden="true"
      >
        <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
      </svg>
    </div>
  );
};

// Component 2: FooterCard
export const FooterCard: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/smkmarhas', label: 'Instagram' },
  ];

  const productLinks = [
    { label: 'Fitur Utama', href: '#projects' },
    { label: 'Portofolio', href: '#projects' },
    { label: 'Ulasan Pengguna', href: '#testimonials' },
    { label: 'Paket & Biaya', href: '#pricing' },
  ];

  const portalLinks = [
    { label: 'Portal Siswa', href: '/login-siswa' },
    { label: 'Portal Guru & Staf', href: '/login-admin' },
    { label: 'Modul Belajar', href: '/login-siswa' },
    { label: 'Bank Soal CBT', href: '/login-siswa' },
  ];

  const companyLinks = [
    { label: 'Profil SMK Marhas', href: '#about' },
    { label: 'WhatsApp Hub', href: 'https://wa.me/6282240487638', external: true },
    { label: 'Founder & Pengajar', href: '#about' },
    { label: 'Pusat Bantuan', href: '#contact' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Outer Gray Body */}
      <div className="bg-[#E9EBEE] rounded-[36px] sm:rounded-[48px] border border-slate-200 shadow-sm overflow-hidden">
        {/* Inner White Box */}
        <div className="bg-white rounded-[28px] sm:rounded-[40px] m-2 shadow-sm">
          {/* Content Grid Space */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Info (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="flex items-center gap-2.5">
                <LogoIcon />
                {/* On mobile: only logo icon is shown; text hidden on mobile, visible on sm+ */}
                <span className="hidden sm:inline text-[24px] sm:text-[26px] font-bold tracking-tight text-[#0F172A]">
                  Marhas LMS
                </span>
              </div>

              <p className="text-[#64748B] leading-relaxed text-[15px] sm:text-[16px] font-normal max-w-[340px]">
                Platform pembelajaran digital modern & ekosistem inovasi pendidikan terpadu SMK Marhas Margahayu.
              </p>

              {/* Socials Group */}
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-[44px] h-[44px] flex items-center justify-center rounded-xl border border-slate-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-slate-50 transition-all active:scale-95 group"
                  >
                    <Icon className="w-5 h-5 text-slate-800 group-hover:text-[#31A8FF] transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-[14px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Eksplorasi
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Science / Portal Column */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-[14px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Portal LMS
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                {portalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-[14px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Institusi
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-[15px] font-medium text-[#1E293B] hover:text-[#31A8FF] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar (Inside Gray Outer Wrap, OUTSIDE of White Box) */}
        <div className="px-6 sm:px-12 md:px-16 lg:px-20 py-5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-[14px] sm:text-[15px]">
          <p className="text-[#64748B] font-medium text-center md:text-left">
            &copy; {currentYear} Marhas LMS. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-[#64748B] font-medium">
            <a
              href="https://wa.me/6282240487638"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1E293B] transition-colors flex items-center gap-1.5"
            >
              <span>Margahayu, Bandung</span>
              <span aria-label="Indonesia">🇮🇩</span>
            </a>
            <div className="w-[1px] h-4 bg-slate-300 hidden sm:block" />
            <a
              href="#hero"
              className="hover:text-[#1E293B] transition-colors flex items-center gap-1"
            >
              <span>Kembali ke atas</span>
              <span aria-hidden="true">&uarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component 3: GlassText with Handcrafted SVG Filter
export const GlassText: React.FC = () => {
  return (
    <div className="relative w-full flex items-center justify-center select-none pt-4 pb-12 sm:pb-16 overflow-hidden">
      {/* Invisible SVG filter definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" result="outer-shadow" />
            <feComponentTransfer in="SourceAlpha" result="alpha">
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
            <feOffset in="alpha" dx="0" dy="4" result="offset-white" />
            <feGaussianBlur in="offset-white" stdDeviation="4" result="blur-white" />
            <feComposite in="alpha" in2="blur-white" operator="out" result="inner-white-mask" />
            <feFlood floodColor="#ffffff" floodOpacity="0.25" result="white-fill" />
            <feComposite in="white-fill" in2="inner-white-mask" operator="in" result="inner-white-final" />
            <feGaussianBlur in="alpha" stdDeviation="6" result="blur-black" />
            <feComposite in="alpha" in2="blur-black" operator="out" result="inner-black-mask" />
            <feFlood floodColor="#000000" floodOpacity="0.25" result="black-fill" />
            <feComposite in="black-fill" in2="inner-black-mask" operator="in" result="inner-black-final" />
            <feMerge>
              <feMergeNode in="outer-shadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="inner-white-final" />
              <feMergeNode in="inner-black-final" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Motion text element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="relative"
      >
        <h1
          className="text-[min(20vw,260px)] font-bold tracking-tight leading-none select-none text-white px-4 text-center pointer-events-none"
          style={{ filter: 'url(#glass-effect)' }}
        >
          Marhas LMS
        </h1>
      </motion.div>
    </div>
  );
};

// Final Default Export
export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F0F1F3] pt-16 sm:pt-20 flex flex-col items-center gap-2 border-t border-slate-200/60 overflow-hidden">
      <FooterCard />
      <GlassText />
    </footer>
  );
};

export default Footer;
