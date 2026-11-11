import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const Navbar: React.FC = () => {
  const { siteSettings, supabaseStatus, supabaseError, retrySupabaseConnection } = useData();
  const { isAuthenticated, role, currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div
        className={`max-w-7xl mx-auto px-5 sm:px-6 py-3 pointer-events-auto rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 shadow-[0_10px_30px_-5px_rgba(5,26,36,0.1),0_0_0_1px_rgba(5,26,36,0.06)] backdrop-blur-md'
            : 'bg-white/80 shadow-[0_4px_20px_-2px_rgba(5,26,36,0.05),0_0_0_1px_rgba(5,26,36,0.04)] backdrop-blur-md'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group outline-none">
            <div className="w-9 h-9 rounded-xl bg-[#051A24] flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 256 256" aria-hidden="true">
                <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg sm:text-xl tracking-tight text-[#051A24]">
                Marhas LMS
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200">
                <School className="w-3 h-3" />
                SMK MARHAS
              </span>
            </div>
          </Link>

          {/* Database Live Status Pill */}
          <div className="hidden xl:flex items-center">
            <button
              onClick={() => retrySupabaseConnection()}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                supabaseStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : supabaseStatus === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={supabaseError || (supabaseStatus === 'connected' ? 'Terhubung ke Supabase' : 'Klik untuk tes koneksi ulang')}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  supabaseStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : supabaseStatus === 'error'
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`}
              />
              <span>
                {supabaseStatus === 'connected'
                  ? 'Cloud Sync Aktif'
                  : supabaseStatus === 'error'
                  ? 'Cek Koneksi Cloud'
                  : 'Mode Penyimpanan Lokal'}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#051A24]/80">
            <a href="#hero" className="hover:text-[#051A24] transition-colors">Hero</a>
            <a href="#studio-intro" className="hover:text-[#051A24] transition-colors">Marhas LMS</a>
            <a href="#modules" className="hover:text-[#051A24] transition-colors">Projects</a>
            <a href="#clientele" className="hover:text-[#051A24] transition-colors">Testimonials</a>
            <a href="#billing" className="hover:text-[#051A24] transition-colors">Pricing</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to={role === 'admin' ? '/admin' : '/student'}
                  className="px-4 py-2 rounded-full bg-[#051A24] text-white text-xs font-medium flex items-center gap-2 shadow-btn-primary hover:bg-[#092634] transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard {role === 'admin' ? 'Guru' : 'Siswa'}</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="text-xs text-slate-500 hover:text-rose-600 transition-colors font-medium px-2 py-1"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login-siswa"
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#051A24] text-xs font-medium transition-colors"
                >
                  Masuk Siswa
                </Link>
                <Link
                  to="/login-admin"
                  className="px-4 py-2 rounded-full bg-[#051A24] text-white text-xs font-medium shadow-btn-primary hover:bg-[#092634] transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Portal Guru</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto px-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <nav className="flex flex-col gap-2.5 text-sm font-medium text-[#051A24]">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Hero
              </a>
              <a
                href="#studio-intro"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Marhas LMS Studio
              </a>
              <a
                href="#modules"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Projects
              </a>
              <a
                href="#clientele"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#billing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Pricing
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login-siswa"
                className="w-full text-center py-2.5 rounded-full bg-slate-100 text-xs font-semibold text-[#051A24]"
              >
                Masuk Siswa
              </Link>
              <Link
                to="/login-admin"
                className="w-full text-center py-2.5 rounded-full bg-[#051A24] text-xs font-semibold text-white shadow-btn-primary"
              >
                Portal Guru
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
