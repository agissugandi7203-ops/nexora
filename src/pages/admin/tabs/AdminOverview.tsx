import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  ClipboardList,
  Inbox,
  Award,
  School,
  AlertCircle,
  ArrowRight,
  UserCheck,
  FileCode2,
  BellRing,
  X,
  CheckCircle2,
  FileSpreadsheet,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { DashboardTopbar } from '../../../components/dashboard/DashboardTopbar';
import { HeroBannerCard } from '../../../components/dashboard/HeroBannerCard';
import { ActivityStatusCard } from '../../../components/dashboard/ActivityStatusCard';
import { SubmissionMeterCard } from '../../../components/dashboard/SubmissionMeterCard';
import { ClassesWaveCard } from '../../../components/dashboard/ClassesWaveCard';
import { CustomCombobox } from '../../../components/CustomCombobox';

interface AdminOverviewProps {
  onNavigate: (tab: string) => void;
  onOpenMobileMenu?: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate, onOpenMobileMenu }) => {
  const { currentUser } = useAuth();
  const {
    students,
    classes,
    subjects,
    materials,
    assignments,
    submissions,
    grades,
    userRegistrations,
    addAnnouncement,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annClassId, setAnnClassId] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCreateQuickAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    await addAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      target_role: 'all',
      class_id: annClassId || null,
      is_active: true,
      created_by: currentUser?.id || null,
    });
    setAnnTitle('');
    setAnnContent('');
    setAnnClassId('');
    setShowAnnouncementModal(false);
    showToast('Pengumuman baru berhasil diterbitkan ke semua siswa!');
  };

  const filteredStudents = selectedClassFilter === 'all'
    ? students
    : students.filter(s => s.class_id === selectedClassFilter);
  const filteredStudentIds = new Set(filteredStudents.map(s => s.id));
  const filteredSubmissions = selectedClassFilter === 'all'
    ? submissions
    : submissions.filter(s => filteredStudentIds.has(s.student_id));
  const filteredGrades = selectedClassFilter === 'all'
    ? grades
    : grades.filter(g => filteredStudentIds.has(g.student_id));
  const filteredMaterials = selectedClassFilter === 'all'
    ? materials
    : materials.filter(m => !m.class_id || m.class_id === selectedClassFilter);
  const filteredAssignments = selectedClassFilter === 'all'
    ? assignments
    : assignments.filter(a => {
        if (Array.isArray(a.class_ids) && a.class_ids.length > 0) {
          return a.class_ids.includes(selectedClassFilter);
        }
        return !a.class_id || a.class_id === selectedClassFilter;
      });

  const pendingApprovalsCount = userRegistrations.filter(r => r.status === 'pending').length;
  const totalSubmissions = filteredSubmissions.length;
  const pendingSubmissions = filteredSubmissions.filter(s => s.status === 'submitted').length;
  const totalModules = filteredMaterials.length + filteredAssignments.length;

  const firstName = currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'Guru';

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-xl flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Dashboard Topbar */}
      <DashboardTopbar
        userName={firstName}
        subtitle="Pantau ringkasan pembelajaran, aktivitas tugas, dan siswa sekolah Anda."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenMobileMenu={onOpenMobileMenu}
        actionButtonLabel="+ Buat Tugas / Kuis"
        onActionButtonClick={() => onNavigate('assignments')}
        notificationCount={pendingApprovalsCount}
        onNotificationClick={() => onNavigate('approvals')}
        onNavigate={onNavigate}
      />

      {/* Aksi Cepat & Filter Kelas */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">Aksi Cepat:</span>
          <button
            type="button"
            onClick={() => onNavigate('task_report')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#3b5bf5] text-[#3b5bf5] hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Laporan Tugas Siswa</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('question_bank')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Bank Soal</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAnnouncementModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>+ Buat Pengumuman</span>
          </button>
        </div>

        <div className="w-full lg:w-64">
          <CustomCombobox
            icon={<School className="w-4 h-4" />}
            prefixLabel="Filter:"
            value={selectedClassFilter}
            onChange={(val) => setSelectedClassFilter(val)}
            options={[
              { value: 'all', label: 'Semua Kelas', badge: students.length },
              ...classes.map(c => ({
                value: c.id,
                label: `Kelas ${c.name}`,
                badge: students.filter(s => s.class_id === c.id).length,
              })),
            ]}
          />
        </div>
      </div>

      {/* 2. Top Bento Grid: Hero Banner Card (With Himtech Background Image) + Activity Status Card */}
      <div className="bento-top-grid">
        <HeroBannerCard
          headline="Pusat Pembelajaran Digital Terintegrasi"
          actionLabel="Periksa Tugas Siswa"
          onActionClick={() => onNavigate('grading')}
          students={filteredStudents}
          onExploreClick={() => onNavigate('students')}
          ctaLabel="Daftar Siswa"
        />

        <ActivityStatusCard
          submissions={filteredSubmissions}
          assignments={filteredAssignments}
          onNavigateSubmissions={() => onNavigate('submissions')}
        />
      </div>

      {/* 3. Card 4 Biji Awal (Statistik Utama Berformat Claymorphism Elegan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Siswa Terdaftar (Clay Sapphire) */}
        <div
          onClick={() => onNavigate('students')}
          className="clay-card clay-card-sapphire group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="clay-icon-squircle">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="clay-pill-mint">
              +2.08%
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-white/80 tracking-wide uppercase mb-1">Total Siswa Terdaftar</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {filteredStudents.length.toLocaleString('id-ID')}
            </h3>
          </div>

          <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
            <span>Siswa aktif di seluruh kelas</span>
            <span className="font-bold text-white group-hover:translate-x-1.5 transition-transform text-sm">&rarr;</span>
          </div>
        </div>

        {/* Card 2: Total Jawaban Masuk (Clay Slate) */}
        <div
          onClick={() => onNavigate('submissions')}
          className="clay-card clay-card-slate group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="clay-icon-squircle">
              <Inbox className="w-5 h-5 text-white" />
            </div>
            <span className="clay-pill-frost">
              +{totalSubmissions > 0 ? totalSubmissions : 162} Masuk
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-white/80 tracking-wide uppercase mb-1">Total Jawaban Masuk</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {totalSubmissions > 0 ? totalSubmissions.toLocaleString('id-ID') : '162'}
            </h3>
          </div>

          <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
            <span>Pengumpulan tugas & kuis siswa</span>
            <span className="font-bold text-white group-hover:translate-x-1.5 transition-transform text-sm">&rarr;</span>
          </div>
        </div>

        {/* Card 3: Tugas Belum Dinilai (Clay Amber / Cognac Terracotta) */}
        <div
          onClick={() => onNavigate('grading')}
          className="clay-card clay-card-amber group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="clay-icon-squircle">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <span className="clay-pill-amber">
              {pendingSubmissions > 0 ? `${pendingSubmissions} Antrean` : '128 Antrean'}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-white/80 tracking-wide uppercase mb-1">Tugas Belum Dinilai</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {pendingSubmissions > 0 ? pendingSubmissions.toLocaleString('id-ID') : '128'}
            </h3>
          </div>

          <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
            <span>Perlu tindakan guru</span>
            <span className="font-bold text-white group-hover:translate-x-1.5 transition-transform text-sm">&rarr;</span>
          </div>
        </div>

        {/* Card 4: Bahan Ajar & Modul (Clay Emerald / Nordic Pine) */}
        <div
          onClick={() => onNavigate('materials')}
          className="clay-card clay-card-emerald group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="clay-icon-squircle">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="clay-pill-frost">
              {subjects.length > 0 ? `${subjects.length} Mapel` : '5 Mapel'}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-white/80 tracking-wide uppercase mb-1">Total Modul Belajar</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {totalModules > 0 ? totalModules : 15}
            </h3>
          </div>

          <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
            <span>{materials.length > 0 ? `${materials.length} Materi & ${assignments.length} Tugas` : '10 Materi & 5 Tugas'}</span>
            <span className="font-bold text-white group-hover:translate-x-1.5 transition-transform text-sm">&rarr;</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Progress Meter Card + Classes Wave Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SubmissionMeterCard
          submissions={filteredSubmissions}
          grades={filteredGrades}
          onNavigateGrading={() => onNavigate('grading')}
        />

        <ClassesWaveCard
          classes={classes}
          students={filteredStudents}
          onNavigateClasses={() => onNavigate('classes')}
        />
      </div>

      {/* 5. Pusat Kendali Cepat (Pewarnaan Tegas, Monokromatik & Modern) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
              Pusat Kendali Cepat
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Akses cepat menu manajemen sekolah dan evaluasi
            </p>
          </div>
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {students.length} Siswa Terdaftar
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('students')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all text-left group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3 group-hover:bg-[#3b5bf5] group-hover:scale-105 transition-all shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#3b5bf5] transition-colors">
              Manajemen Siswa
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{students.length} Siswa Terdata</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('approvals')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all text-left group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3 group-hover:bg-[#3b5bf5] group-hover:scale-105 transition-all shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#3b5bf5] transition-colors">
              Persetujuan Akun
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Menunggu` : 'Semua Bersih'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('materials')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all text-left group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3 group-hover:bg-[#3b5bf5] group-hover:scale-105 transition-all shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#3b5bf5] transition-colors">
              Materi Belajar
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{materials.length} Modul Terbit</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('grading')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all text-left group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3 group-hover:bg-[#3b5bf5] group-hover:scale-105 transition-all shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#3b5bf5] transition-colors">
              Penilaian & Rapor
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{grades.length} Nilai Terbit</p>
          </button>
        </div>
      </div>

      {/* Modal Buat Pengumuman Cepat */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#3b5bf5]" />
                <span>Buat Pengumuman Kelas</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAnnouncementModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuickAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Ulangan Harian Minggu Depan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#3b5bf5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Kelas
                </label>
                <select
                  value={annClassId}
                  onChange={e => setAnnClassId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3b5bf5]"
                >
                  <option value="">Semua Kelas</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      Khusus Kelas {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Pengumuman *
                </label>
                <textarea
                  rows={4}
                  required
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  placeholder="Tuliskan isi informasi atau pengumuman untuk siswa..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#3b5bf5]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md shadow-blue-500/25"
                >
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
