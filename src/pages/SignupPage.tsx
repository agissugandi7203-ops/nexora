import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { triggerConfetti, showComingSoonToast } from '../utils/confetti';
import '../styles/login.css';

export const SignupPage: React.FC = () => {
  const { classes, registerUser } = useData();
  const navigate = useNavigate();

  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [animPhase, setAnimPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Student specific
  const [nisn, setNisn] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');

  // Teacher specific
  const [email, setEmail] = useState('');
  const [teacherNip, setTeacherNip] = useState('');

  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (classes.length > 0 && !classId) {
      setClassId(classes[0].id);
    }
  }, [classes, classId]);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setVideoLoaded(true);
    }
  }, []);

  // Directional Slide Switcher (No center pop)
  const handleRoleSwitch = (newRole: 'student' | 'admin') => {
    if (newRole === role || animPhase !== 'idle') return;
    setErrorMsg('');
    const dir = newRole === 'admin' ? 'right' : 'left';
    setSlideDirection(dir);
    setAnimPhase('exiting');

    setTimeout(() => {
      setRole(newRole);
      setAnimPhase('entering');

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

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Kata sandi minimal harus 4 karakter.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (role === 'student') {
        const res = await registerUser({
          full_name: fullName.trim(),
          username: username.trim().toLowerCase(),
          email: `${username.trim().toLowerCase()}@siswa.sch.id`,
          role: 'student',
          identifier_extra: nisn.trim(),
          class_id: classId,
          password: password,
        });

        if (res.success) {
          setIsSubmittedSuccess(true);
        } else {
          setErrorMsg(res.error || 'Gagal mengirim pendaftaran.');
        }
      } else {
        const res = await registerUser({
          full_name: fullName.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          role: 'admin',
          identifier_extra: teacherNip.trim(),
          password: password,
        });

        if (res.success) {
          setIsSubmittedSuccess(true);
        } else {
          setErrorMsg(res.error || 'Gagal mengirim pendaftaran.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan sistem saat mendaftar.');
    } finally {
      setIsSubmitting(false);
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

        {/* Pitch Area: Minimal, Laptop/Desktop Only (Hidden on Mobile) */}
        <section className="cutora-hero-pitch hidden md:flex">
          <h1 className="cutora-hero-headline">
            <span className="cutora-headline-clip">
              <span className="cutora-headline-line cutora-headline-line-1">
                Bergabung Bersama Kami.
              </span>
            </span>
            <span className="cutora-headline-clip">
              <span className="cutora-headline-line cutora-headline-line-2">
                Akses Ruang Belajar Digital.
              </span>
            </span>
          </h1>

          <p className="cutora-pitch-subline">
            Daftarkan akun Siswa atau Pengajar Anda untuk kurikulum digital SMK Marhas Margahayu.
          </p>
        </section>
      </main>

      {/* --------------------------------------------------------------------------
          SIGNUP CARD (Right) with Directional Fluid Slide Transitions
          -------------------------------------------------------------------------- */}
      <aside className="cutora-card-panel overflow-y-auto max-h-[96dvh]" aria-label="Sign up form">
        <div className="cutora-card-inner-form py-4">
          {isSubmittedSuccess ? (
            /* Success Approval Waiting Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Pendaftaran Berhasil Dikirim!
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Data pendaftaran akun <strong>{fullName}</strong> ({role === 'student' ? 'Siswa' : 'Pengajar'}) telah dicatat dan menunggu persetujuan dari <strong>Admin Utama</strong>.
              </p>
              <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 leading-relaxed">
                <strong>Catatan Penting:</strong> Begitu Admin Utama menyetujui pendaftaran Anda di dashboard, Anda dapat langsung masuk dengan kredensial yang baru saja Anda buat.
              </div>

              <div className="mt-7 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full py-3.5 px-6 rounded-full bg-[#161515] hover:bg-black text-[#F59A08] text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Ke Halaman Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmittedSuccess(false);
                    setFullName('');
                    setUsername('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold py-2"
                >
                  Daftarkan Akun Lainnya
                </button>
              </div>
            </div>
          ) : (
            <>
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
                  <span>Daftar Siswa</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('admin')}
                  className={`cutora-segmented-btn ${role === 'admin' ? 'active' : ''}`}
                >
                  <ShieldCheck className={`w-4 h-4 ${role === 'admin' ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>Daftar Guru</span>
                </button>
              </div>

              {/* Directional Slide Container */}
              <div className="cutora-slide-wrap">
                <div className={`cutora-slide-content ${phaseClass}`}>
                  <h2 className="cutora-form-heading">
                    {role === 'student' ? 'Registrasi Siswa' : 'Registrasi Guru'}
                  </h2>
                  <p className="cutora-form-subline hidden sm:block">
                    {role === 'student'
                      ? 'Lengkapi data diri Anda untuk membuat akun belajar siswa.'
                      : 'Daftarkan identitas pengajar Anda untuk verifikasi Admin Utama.'}
                  </p>

                  {errorMsg && (
                    <div className="cutora-error-banner" role="alert">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Full Name */}
                    <div className="cutora-form-group">
                      <label className="cutora-field-label">Nama Lengkap</label>
                      <div className="cutora-input-wrapper">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="cutora-text-input"
                          placeholder={role === 'student' ? 'Contoh: Ahmad Fauzan' : 'Contoh: Drs. Ilham Lesmana, M.Pd.'}
                          required
                        />
                      </div>
                    </div>

                    {/* Role Specific: NISN & Class OR Email & NIP */}
                    {role === 'student' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="cutora-form-group">
                          <label className="cutora-field-label">NISN Siswa</label>
                          <div className="cutora-input-wrapper">
                            <input
                              type="text"
                              value={nisn}
                              onChange={(e) => setNisn(e.target.value)}
                              className="cutora-text-input"
                              placeholder="Contoh: 0081234567"
                              required
                            />
                          </div>
                        </div>

                        <div className="cutora-form-group">
                          <label className="cutora-field-label">Pilih Kelas</label>
                          <div className="cutora-input-wrapper">
                            <select
                              value={classId}
                              onChange={(e) => setClassId(e.target.value)}
                              className="cutora-text-input bg-white cursor-pointer"
                              required
                            >
                              {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                  {cls.name} ({cls.level})
                                </option>
                              ))}
                              {classes.length === 0 && (
                                <option value="umum">Kelas Reguler / Umum</option>
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="cutora-form-group">
                          <label className="cutora-field-label">Email Pengajar</label>
                          <div className="cutora-input-wrapper">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="cutora-text-input"
                              placeholder="Contoh: guru@sekolah.sch.id"
                              required
                            />
                          </div>
                        </div>

                        <div className="cutora-form-group">
                          <label className="cutora-field-label">NIP / Bidang Mapel</label>
                          <div className="cutora-input-wrapper">
                            <input
                              type="text"
                              value={teacherNip}
                              onChange={(e) => setTeacherNip(e.target.value)}
                              className="cutora-text-input"
                              placeholder="Contoh: Pemrograman Web"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Username */}
                    <div className="cutora-form-group">
                      <label className="cutora-field-label">Username Akun</label>
                      <div className="cutora-input-wrapper">
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="cutora-text-input"
                          placeholder="Contoh: fauzan_ahmad"
                          required
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="cutora-form-group">
                        <label className="cutora-field-label">Kata Sandi</label>
                        <div className="cutora-input-wrapper">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="cutora-text-input cutora-input-password"
                            placeholder="Minimal 4 karakter"
                            required
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="cutora-password-toggle-btn"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="cutora-form-group">
                        <label className="cutora-field-label">Ulangi Kata Sandi</label>
                        <div className="cutora-input-wrapper">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="cutora-text-input"
                            placeholder="Ulangi kata sandi"
                            required
                            autoComplete="new-password"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="cutora-login-submit-btn !mt-2"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                            <span>Mengirim Pendaftaran...</span>
                          </span>
                        ) : (
                          <span>Kirim Pendaftaran ke Admin Utama</span>
                        )}
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="cutora-divider-row !my-3">
                      <div className="cutora-divider-line" />
                      <span className="cutora-divider-text">Atau daftar dengan:</span>
                      <div className="cutora-divider-line" />
                    </div>

                    {/* Google Sign Up Button with Confetti & "Segera Hadir" */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerConfetti();
                        showComingSoonToast('Daftar dengan Google');
                      }}
                      className="cutora-google-btn"
                    >
                      <svg className="cutora-google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.35 24 12 24Z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15Z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                      </svg>
                      <span>Sign up with Google</span>
                    </button>

                    {/* Footer Back to Login */}
                    <div className="cutora-footer-row !mt-4">
                      Sudah punya akun terdaftar?{' '}
                      <Link to="/login" className="cutora-signup-link">
                        Masuk di sini
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

export default SignupPage;
