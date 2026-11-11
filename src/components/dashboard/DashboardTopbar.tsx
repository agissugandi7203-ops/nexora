import React, { useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  PlusCircle,
  Bell,
  X,
  BookOpen,
  FileText,
  ClipboardList,
  School,
  User,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface DashboardTopbarProps {
  userName?: string;
  subtitle?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onOpenMobileMenu?: () => void;
  actionButtonLabel?: string;
  onActionButtonClick?: () => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onNavigate?: (tab: string) => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({
  userName = 'Guru',
  subtitle = 'Pantau ringkasan pembelajaran, aktivitas tugas, dan siswa Anda.',
  searchQuery = '',
  onSearchChange,
  onOpenMobileMenu,
  actionButtonLabel = '+ Buat Tugas / Materi',
  onActionButtonClick,
  notificationCount = 0,
  onNotificationClick,
  onNavigate,
}) => {
  const { students, classes, subjects, materials, assignments } = useData();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node) &&
        searchQuery
      ) {
        onSearchChange?.('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery, onSearchChange]);

  const q = searchQuery.trim().toLowerCase();

  const matchedStudents = q
    ? students
        .filter(
          (s) =>
            (s.profile?.full_name || '').toLowerCase().includes(q) ||
            (s.nis_nisn || '').toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const matchedClasses = q
    ? classes
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            `tingkat ${c.level}`.toLowerCase().includes(q) ||
            c.academic_year.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const matchedSubjects = q
    ? subjects
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const matchedMaterials = q
    ? materials
        .filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            (m.description || '').toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const matchedAssignments = q
    ? assignments
        .filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            (a.category_name || '').toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const totalResults =
    matchedStudents.length +
    matchedClasses.length +
    matchedSubjects.length +
    matchedMaterials.length +
    matchedAssignments.length;

  return (
    <header className="dash-topbar">
      <div className="dash-topbar__left">
        <button
          type="button"
          className="mobile-sidebar-btn"
          onClick={onOpenMobileMenu}
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="dash-greeting">
          <h1 className="dash-greeting__title">Hi, {userName}!</h1>
          <p className="dash-greeting__subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="dash-topbar__right">
        {onSearchChange && (
          <div ref={searchContainerRef} className="relative">
            <label className="dash-search" aria-label="Cari data di dashboard">
              <span className="dash-search__icon" aria-hidden="true">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari siswa, kelas, materi, atau tugas..."
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1 text-slate-400 hover:text-slate-700 mr-2 rounded-lg"
                  title="Bersihkan pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </label>

            {/* Live Popover Search Results */}
            {q && (
              <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200/90 shadow-2xl z-50 p-3 max-h-[460px] overflow-y-auto animate-fadeIn space-y-3">
                <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Hasil Pencarian ({totalResults})
                  </span>
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="text-[10px] font-bold text-[#3b5bf5] hover:underline"
                  >
                    Tutup
                  </button>
                </div>

                {totalResults === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-medium space-y-1">
                    <p className="font-bold text-slate-700">Tidak ada data yang cocok</p>
                    <p className="text-[11px]">Coba cari dengan kata kunci nama siswa, kelas, materi, atau tugas lain.</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    {/* Siswa */}
                    {matchedStudents.length > 0 && (
                      <div>
                        <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <User className="w-3 h-3" /> Siswa Terdaftar
                        </p>
                        <div className="space-y-1">
                          {matchedStudents.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                onSearchChange('');
                                onNavigate?.('students');
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#3b5bf5] flex items-center justify-center font-bold text-xs">
                                  {s.profile?.full_name?.charAt(0) || 'S'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 group-hover:text-[#3b5bf5]">{s.profile?.full_name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">NIS: {s.nis_nisn}</p>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#3b5bf5] group-hover:translate-x-0.5 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Materi */}
                    {matchedMaterials.length > 0 && (
                      <div>
                        <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-emerald-600" /> Modul & Materi Pembelajaran
                        </p>
                        <div className="space-y-1">
                          {matchedMaterials.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                onSearchChange('');
                                onNavigate?.('materials');
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                  <FileText className="w-3.5 h-3.5" />
                                </div>
                                <div className="truncate">
                                  <p className="font-bold text-slate-900 group-hover:text-[#3b5bf5] truncate">{m.title}</p>
                                  <p className="text-[10px] text-slate-400">Bab {m.order_index} {m.pdf_url ? '• Ada Dokumen PDF' : ''}</p>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#3b5bf5] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tugas & Ujian */}
                    {matchedAssignments.length > 0 && (
                      <div>
                        <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <ClipboardList className="w-3 h-3 text-purple-600" /> Tugas & Kuis Online
                        </p>
                        <div className="space-y-1">
                          {matchedAssignments.map((a) => (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => {
                                onSearchChange('');
                                onNavigate?.('assignments');
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                  <ClipboardList className="w-3.5 h-3.5" />
                                </div>
                                <div className="truncate">
                                  <p className="font-bold text-slate-900 group-hover:text-[#3b5bf5] truncate">{a.title}</p>
                                  <p className="text-[10px] text-slate-400">{a.type === 'quiz' ? 'Kuis Online' : 'Tugas File'} • {a.total_points} Poin</p>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#3b5bf5] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Kelas */}
                    {matchedClasses.length > 0 && (
                      <div>
                        <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <School className="w-3 h-3 text-sky-600" /> Rombel & Kelas
                        </p>
                        <div className="space-y-1">
                          {matchedClasses.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                onSearchChange('');
                                onNavigate?.('classes');
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                                  <School className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 group-hover:text-[#3b5bf5]">{c.name}</p>
                                  <p className="text-[10px] text-slate-400">Tingkat {c.level} • {c.academic_year}</p>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#3b5bf5] group-hover:translate-x-0.5 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mata Pelajaran */}
                    {matchedSubjects.length > 0 && (
                      <div>
                        <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-amber-600" /> Mata Pelajaran
                        </p>
                        <div className="space-y-1">
                          {matchedSubjects.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                onSearchChange('');
                                onNavigate?.('subjects');
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                  <BookOpen className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 group-hover:text-[#3b5bf5]">{sub.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{sub.code}</p>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#3b5bf5] group-hover:translate-x-0.5 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {onNotificationClick && (
          <button
            type="button"
            onClick={onNotificationClick}
            className="relative p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-all hover:bg-slate-50"
            title="Pemberitahuan & Persetujuan Akun"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>
        )}

        {onActionButtonClick && (
          <button
            type="button"
            className="btn-action-pill"
            onClick={onActionButtonClick}
          >
            <PlusCircle className="w-4 h-4 text-[#1cd485]" />
            <span>{actionButtonLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
};
