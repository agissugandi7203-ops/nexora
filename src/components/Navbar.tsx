import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, LogIn, LayoutDashboard, GraduationCap, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import '../styles/landing.css';

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
        className={`max-w-7xl mx-auto px-4 sm:px-6 py-3 pointer-events-auto nexora-navbar-pill ${
          scrolled ? 'is-scrolled' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                {siteSettings.site_name || 'NEXORA'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-300 border-2 border-slate-900 text-[11px] font-extrabold text-slate-900">
                <School className="w-3 h-3" />
                SMK MARHAS
              </span>
            </div>
          </Link>

          {/* Database Live Status Pill */}
          <div className="hidden xl:flex items-center">
            <button
              onClick={() => retrySupabaseConnection()}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold border-2 border-slate-900 transition-transform hover:-translate-y-0.5 ${
                supabaseStatus === 'connected'
                  ? 'bg-emerald-300 text-slate-900'
                  : supabaseStatus === 'error'
                  ? 'bg-rose-300 text-slate-900'
                  : 'bg-amber-200 text-slate-900'
              }`}
              title={supabaseError || (supabaseStatus === 'connected' ? 'Terhubung ke Supabase' : 'Klik untuk tes koneksi ulang')}
            >
              <span
                className={`w-2 h-2 rounded-full border border-slate-900 ${
                  supabaseStatus === 'connected'
                    ? 'bg-emerald-600 animate-pulse'
                    : supabaseStatus === 'error'
                    ? 'bg-rose-600'
                    : 'bg-amber-600'
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-extrabold text-slate-700">
            <a href="#beranda" className="hover:text-blue-600 transition-colors">Beranda</a>
            <a href="#tentang" className="hover:text-blue-600 transition-colors">Alur Belajar</a>
            <a href="#mata-pelajaran" className="hover:text-blue-600 transition-colors">Mata Pelajaran</a>
            <a href="#pengajar" className="hover:text-blue-600 transition-colors">Pengajar</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to={role === 'admin' ? '/admin' : '/student'}
                  className="nexora-btn-primary px-4 py-2 text-xs flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard {role === 'admin' ? 'Guru' : 'Siswa'} ({currentUser?.full_name?.split(' ')[0]})</span>
                </Link>

                <button
                  onClick={logout}
                  className="px-3.5 py-2 rounded-xl bg-rose-100 border-2 border-slate-900 text-slate-900 hover:bg-rose-200 text-xs font-extrabold transition-colors"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login-siswa"
                  className="nexora-btn-yellow px-4 py-2 text-xs flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Login Siswa</span>
                </Link>
                <Link
                  to="/login-admin"
                  className="nexora-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Guru</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 border-2 border-slate-900 text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto pointer-events-auto bg-white border-2 border-slate-900 shadow-[0_8px_0_0_#0f172a] rounded-3xl p-5 space-y-3">
          <a
            href="#beranda"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-extrabold text-slate-900 hover:bg-slate-100"
          >
            Beranda
          </a>
          <a
            href="#tentang"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-extrabold text-slate-900 hover:bg-slate-100"
          >
            Alur Belajar
          </a>
          <a
            href="#mata-pelajaran"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-extrabold text-slate-900 hover:bg-slate-100"
          >
            Mata Pelajaran
          </a>
          <a
            href="#pengajar"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-extrabold text-slate-900 hover:bg-slate-100"
          >
            Profil Pengajar
          </a>

          <div className="pt-3 border-t-2 border-dashed border-slate-200 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  to={role === 'admin' ? '/admin' : '/student'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="nexora-btn-primary py-2.5 px-4 text-center text-xs flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Buka Dashboard {role === 'admin' ? 'Guru' : 'Siswa'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-100 border-2 border-slate-900 text-slate-900 text-xs font-extrabold"
                >
                  Keluar dari Akun
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login-siswa"
                  onClick={() => setMobileMenuOpen(false)}
                  className="nexora-btn-yellow py-2.5 px-4 text-center text-xs flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Login Siswa SMK MARHAS</span>
                </Link>
                <Link
                  to="/login-admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="nexora-btn-primary py-2.5 px-4 text-center text-xs flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Guru / Admin</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
