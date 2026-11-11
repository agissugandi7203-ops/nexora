import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  School,
  ArrowLeft,
  Layers,
  Award,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import '../styles/login.css';

export const LoginAdmin: React.FC = () => {
  const { siteSettings, classes, students, subjects } = useData();
  const { loginAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = await loginAdmin(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMsg(res.error || 'Autentikasi gagal. Silakan periksa kembali email & kata sandi Anda.');
    }
  };

  return (
    <div className="min-h-screen marhas-login-scope marhas-grid-pattern flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Navigation Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] hover:-translate-y-0.5 transition-all text-xs sm:text-sm font-extrabold text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Beranda {siteSettings.site_name || 'NEXORA'}</span>
        </Link>

        <div className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full marhas-pill-emerald text-xs font-extrabold">
          <School className="w-4 h-4" />
          <span>SMK MARHAS MARGAHAYU • Portal Pengajar & Admin</span>
        </div>
      </div>

      {/* Main Split Auth Card */}
      <div className="max-w-5xl w-full mx-auto my-8">
        <div className="marhas-auth-container grid grid-cols-1 lg:grid-cols-12">
          {/* Left Showcase Column: SMK MARHAS Teacher Identity */}
          <div className="lg:col-span-6 marhas-banner-teacher p-8 sm:p-10 text-white flex flex-col justify-between relative min-h-[420px]">
            {/* Decorative Geometric Circles */}
            <div className="marhas-deco-circle w-64 h-64 bg-sky-400/20 -top-16 -right-16 blur-xl"></div>
            <div className="marhas-deco-circle w-56 h-56 bg-yellow-400/20 -bottom-16 -left-16 blur-xl"></div>

            {/* Top School Header */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full marhas-pill-emerald text-xs font-extrabold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                <span>PUSAT KENDALI AKADEMIK GURU</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
                Kelola Kurikulum & <br />
                <span className="text-yellow-300 underline decoration-wavy decoration-emerald-400 underline-offset-4">
                  Inspirasi Siswa SMK MARHAS
                </span>
              </h2>

              <p className="mt-4 text-sm text-sky-100 leading-relaxed font-medium max-w-md">
                Panel manajemen pembelajaran mandiri untuk mengatur kelas, menerbitkan modul digital, menyusun Bank Soal, dan mengevaluasi nilai siswa secara otomatis.
              </p>
            </div>

            {/* Interactive Floating Teacher Badges */}
            <div className="relative z-10 my-8 space-y-3.5">
              {/* Floating Card 1 */}
              <div className="marhas-sticker p-3.5 flex items-center gap-3.5 max-w-sm animate-marhas-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-400 border-2 border-slate-900 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">{siteSettings.teacher_name}</p>
                  <p className="text-[11px] font-semibold text-slate-600">
                    {siteSettings.teacher_specialty || 'Pendidik & Pengelola Sistem LMS'}
                  </p>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="marhas-sticker p-3.5 flex items-center gap-3.5 max-w-sm ml-auto animate-marhas-float-reverse">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 border-2 border-slate-900 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">
                    {students.length} Siswa &bull; {classes.length} Kelas &bull; {subjects.length} Mapel
                  </p>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Tersinkronisasi dengan Database Cloud & RLS
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Pills */}
            <div className="relative z-10 pt-4 border-t border-white/20 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-[11px] font-bold text-white border border-white/25">
                📊 Auto-Grading Kuis
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-[11px] font-bold text-white border border-white/25">
                🗂️ Bank Soal Terpadu
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-[11px] font-bold text-white border border-white/25">
                🔒 Keamanan Terenkripsi
              </span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-6 p-7 sm:p-10 bg-white flex flex-col justify-between">
            <div>
              {/* Role Switcher Tabs */}
              <div className="marhas-role-switcher grid grid-cols-2 gap-1.5 mb-7">
                <Link
                  to="/login-siswa"
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 transition-all"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Portal Siswa</span>
                </Link>
                <Link
                  to="/login-admin"
                  className="marhas-role-tab-active py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Portal Guru</span>
                </Link>
              </div>

              {/* Greeting Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 uppercase tracking-wider mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Otorisasi Pengajar & Administrator</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Selamat Datang, Guru! 👨‍🏫
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  Masuk menggunakan kredensial email pengajar untuk mengelola {siteSettings.site_name}.
                </p>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-5 p-4 rounded-2xl bg-rose-50 border-2 border-rose-600 text-rose-800 text-xs font-bold flex items-start gap-2.5 shadow-[0_3px_0_0_#e11d48]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
                    Email Pengajar / Admin
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@nexora.sch.id"
                      required
                      className="marhas-input pl-11 pr-4 py-3.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
                    Kata Sandi Otorisasi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi pengajar"
                      required
                      className="marhas-input pl-11 pr-12 py-3.5 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-900"
                      title={showPassword ? 'Sembunyikan Sandi' : 'Lihat Sandi'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-5 marhas-btn-submit bg-blue-600 hover:bg-blue-500 text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Memverifikasi Otorisasi...</span>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Masuk ke Dashboard Guru</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Notice */}
            <div className="mt-7 pt-5 border-t-2 border-dashed border-slate-200">
              <div className="p-3.5 rounded-2xl bg-emerald-50/90 border-2 border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                  <strong>Keamanan Sistem:</strong> Portal ini dilindungi enkripsi Row Level Security (RLS). Hanya staf pengajar SMK MARHAS terotorisasi yang memiliki akses manajemen penuh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs font-bold text-slate-500">
        &copy; {new Date().getFullYear()} {siteSettings.site_name || 'NEXORA'} &times; SMK MARHAS Margahayu &bull; Dikelola oleh {siteSettings.teacher_name}
      </div>
    </div>
  );
};
