import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GraduationCap, ShieldCheck, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { triggerConfetti, showComingSoonToast } from '../utils/confetti';
import '../styles/login.css';

interface LoginUnifiedProps {
  initialRole?: 'student' | 'admin';
}

export const LoginUnified: React.FC<LoginUnifiedProps> = ({ initialRole = 'student' }) => {
  const { loginStudent, loginAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Role state: 'student' or 'admin'
  const [role, setRole] = useState<'student' | 'admin'>(() => {
    if (location.pathname.includes('admin')) return 'admin';
    return initialRole;
  });

  // Directional slide & blur-dissolve phase states
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [animPhase, setAnimPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');

  // Form states
  const [identifier, setIdentifier] = useState(() => {
    return localStorage.getItem('nexora_remembered_student') || '';
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('nexora_remembered_admin') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeDot, setActiveDot] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setVideoLoaded(true);
    }
  }, []);

  // Directional Slide Switcher (No center popping, no flickering)
  const handleRoleSwitch = (newRole: 'student' | 'admin') => {
    if (newRole === role || animPhase !== 'idle') return;
    setErrorMsg('');
    const dir = newRole === 'admin' ? 'right' : 'left';
    setSlideDirection(dir);
    setAnimPhase('exiting');

    setTimeout(() => {
      setRole(newRole);
      setAnimPhase('entering');
      const targetPath = newRole === 'admin' ? '/login-admin' : '/login-siswa';
      window.history.replaceState(null, '', targetPath);

      // Settle smoothly into idle rest state
      requestAnimationFrame(() => {
        setTimeout(() => {
          setAnimPhase('idle');
        }, 30);
      });
    }, 130);
  };

  let phaseClass = 'phase-idle';
  if (animPhase === 'exiting') {
    phaseClass = slideDirection === 'right' ? 'phase-exiting-right' : 'phase-exiting-left';
  } else if (animPhase === 'entering') {
    phaseClass = slideDirection === 'right' ? 'phase-entering-right' : 'phase-entering-left';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (role === 'student') {
      const cleanId = identifier.trim();
      if (!cleanId) {
        setErrorMsg('Silakan masukkan NISN atau Username siswa Anda.');
        return;
      }
      if (!password) {
        setErrorMsg('Silakan masukkan kata sandi Anda.');
        return;
      }

      try {
        const res = await loginStudent(cleanId, password);
        if (res.success) {
          if (rememberMe) {
            localStorage.setItem('nexora_remembered_student', cleanId);
          } else {
            localStorage.removeItem('nexora_remembered_student');
          }
          navigate('/student', { replace: true });
        } else {
          setErrorMsg(res.error || 'Autentikasi siswa gagal. Periksa kembali NISN atau Username Anda.');
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Terjadi kesalahan sistem saat proses masuk.');
      }
    } else {
      const cleanEmail = email.trim();
      if (!cleanEmail) {
        setErrorMsg('Silakan masukkan email pengajar Anda.');
        return;
      }
      if (!password) {
        setErrorMsg('Silakan masukkan kata sandi pengajar Anda.');
        return;
      }

      try {
        const res = await loginAdmin(cleanEmail, password);
        if (res.success) {
          if (rememberMe) {
            localStorage.setItem('nexora_remembered_admin', cleanEmail);
          } else {
            localStorage.removeItem('nexora_remembered_admin');
          }
          navigate('/admin', { replace: true });
        } else {
          setErrorMsg(res.error || 'Autentikasi gagal. Silakan periksa kembali email & kata sandi Anda.');
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Terjadi kesalahan sistem saat proses masuk.');
      }
    }
  };

  return (
    <div className="cutora-viewport">
      {/* --------------------------------------------------------------------------
          MEDIA LAYER: Photographic Plate + 4s Muted Video Loop + Readability Washes
          -------------------------------------------------------------------------- */}
      <div className="cutora-media-layer">
        <div className="cutora-plate-image" aria-hidden="true" />
        <video
          ref={videoRef}
          className={`cutora-motion-video ${videoLoaded ? 'loaded' : ''}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setVideoLoaded(true)}
          onPlaying={() => setVideoLoaded(true)}
        >
          <source
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/197f7e27-faac-4bdc-916c-615ac962bf86.mp4"
            type="video/mp4"
          />
        </video>
        <div className="cutora-readability-washes" aria-hidden="true" />
      </div>

      {/* --------------------------------------------------------------------------
          HERO COLUMN (Left, White Text) with MARHAS LMS LOGO
          -------------------------------------------------------------------------- */}
      <main className="cutora-hero-column">
        {/* Top Bar: Logo & Wordmark + Back Link */}
        <header className="cutora-hero-top-bar">
          <Link to="/" className="cutora-brand-wrap" aria-label="Marhas LMS Home">
            <div className="cutora-logo-tile">
              {/* Exact Clover X Logo SVG */}
              <svg
                className="w-6 h-6 fill-white"
                viewBox="0 0 256 256"
                aria-hidden="true"
              >
                <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
              </svg>
            </div>
            {/* Logo text hidden on mobile, visible on sm+ */}
            <span className="cutora-brand-name hidden sm:inline">marhas</span>
          </Link>

          <Link to="/" className="cutora-back-link">
            <span>&larr; <span className="hidden sm:inline">Kembali ke</span> Beranda</span>
          </Link>
        </header>

        {/* Pitch Area: Minimal, Laptop/Desktop Only (Hidden on Mobile to Prevent Clutter) */}
        <section className="cutora-hero-pitch hidden md:flex">
          <h1 className="cutora-hero-headline">
            <span className="cutora-headline-clip">
              <span className="cutora-headline-line cutora-headline-line-1">
                Belajar Mandiri.
              </span>
            </span>
            <span className="cutora-headline-clip">
              <span className="cutora-headline-line cutora-headline-line-2">
                Tumbuh Bersama.
              </span>
            </span>
          </h1>

          <p className="cutora-pitch-subline">
            Ekosistem LMS modern & pembelajaran interaktif SMK Marhas Margahayu.
          </p>

          {/* Slider Dots */}
          <div className="cutora-slider-dots" role="tablist" aria-label="Slideshow navigation">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                className={`cutora-dot-item ${activeDot === idx ? 'active' : ''}`}
                role="tab"
                aria-selected={activeDot === idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setActiveDot(idx)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* --------------------------------------------------------------------------
          LOG-IN CARD (Right) with Directional Fluid Slide Transitions
          -------------------------------------------------------------------------- */}
      <aside className="cutora-card-panel" aria-label="Sign in form">
        <div className="cutora-card-inner-form">
          {/* Segmented Control with Gliding Pill Indicator */}
          <div className="cutora-segmented-nav">
            <div
              className="cutora-segmented-glider"
              style={{
                transform: role === 'student' ? 'translateX(0)' : 'translateX(100%)',
                width: 'calc(50% - (4 * var(--cutora-u)))',
              }}
            />
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`cutora-segmented-btn ${role === 'student' ? 'active' : ''}`}
            >
              <GraduationCap className={`w-4 h-4 ${role === 'student' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Portal Siswa</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`cutora-segmented-btn ${role === 'admin' ? 'active' : ''}`}
            >
              <ShieldCheck className={`w-4 h-4 ${role === 'admin' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Portal Guru</span>
            </button>
          </div>

          {/* Directional Slide Container: Glides left or right, never from center */}
          <div className="cutora-slide-wrap">
            <div className={`cutora-slide-content ${phaseClass}`}>
              <h2 className="cutora-form-heading">
                {role === 'student' ? 'Portal Siswa' : 'Portal Guru'}
              </h2>
              {/* Subline: hidden on mobile so screen is not cluttered */}
              <p className="cutora-form-subline hidden sm:block">
                {role === 'student'
                  ? 'Masuk ke ruang belajar digital SMK Marhas.'
                  : 'Masuk ke pusat kendali dan kurikulum pengajar.'}
              </p>

              {/* Error Banner with SVG icon (zero emojis) */}
              {errorMsg && (
                <div className="cutora-error-banner" role="alert">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Field 1: NISN/Username for Student OR Email for Teacher */}
                {role === 'student' ? (
                  <div className="cutora-form-group cutora-form-group-email">
                    <label htmlFor="studentIdentifier" className="cutora-field-label">
                      NISN atau Username Siswa
                    </label>
                    <div className="cutora-input-wrapper">
                      <input
                        type="text"
                        id="studentIdentifier"
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="cutora-text-input"
                        placeholder="Input NISN atau username siswa"
                        required
                        autoComplete="username"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="cutora-form-group cutora-form-group-email">
                    <label htmlFor="adminEmail" className="cutora-field-label">
                      Email Pengajar
                    </label>
                    <div className="cutora-input-wrapper">
                      <input
                        type="email"
                        id="adminEmail"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="cutora-text-input"
                        placeholder="Input your email"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                )}

                {/* Field 2: Password */}
                <div className="cutora-form-group cutora-form-group-password">
                  <label htmlFor="loginPassword" className="cutora-field-label">
                    Password
                  </label>
                  <div className="cutora-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="loginPassword"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="cutora-text-input cutora-input-password"
                      placeholder="Input your password"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cutora-password-toggle-btn"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Options Row: Remember Me & Forgot Password */}
                <div className="cutora-options-row">
                  <label className="cutora-remember-wrap">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="cutora-remember-input"
                    />
                    <span className="cutora-custom-checkbox" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="cutora-remember-label">Remember Me</span>
                  </label>

                  <a href="#" onClick={(e) => e.preventDefault()} className="cutora-forgot-link">
                    Forgot Password?
                  </a>
                </div>

                {/* Login Button with loading indicator */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cutora-login-submit-btn"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                      <span>Logging in...</span>
                    </span>
                  ) : (
                    <span>Login</span>
                  )}
                </button>

                {/* Divider */}
                <div className="cutora-divider-row">
                  <div className="cutora-divider-line" />
                  <span className="cutora-divider-text">Or continue with:</span>
                  <div className="cutora-divider-line" />
                </div>

                {/* Google Button with Confetti & "Segera Hadir" */}
                <button
                  type="button"
                  onClick={() => {
                    triggerConfetti();
                    showComingSoonToast('Masuk dengan Google');
                  }}
                  className="cutora-google-btn"
                >
                  <svg className="cutora-google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.35 24 12 24Z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15Z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Footer Line: Link to Signup Page */}
                <div className="cutora-footer-row">
                  Belum punya akun?{' '}
                  <Link to="/signup" className="cutora-signup-link">
                    Daftar di sini
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LoginUnified;
