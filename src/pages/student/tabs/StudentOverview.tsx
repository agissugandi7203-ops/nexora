import React, { useState } from 'react';
import {
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  School,
  FileText
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { DashboardTopbar } from '../../../components/dashboard/DashboardTopbar';
import { HeroBannerCard } from '../../../components/dashboard/HeroBannerCard';
import { ActivityStatusCard } from '../../../components/dashboard/ActivityStatusCard';
import { SubmissionMeterCard } from '../../../components/dashboard/SubmissionMeterCard';
import { ClassesWaveCard } from '../../../components/dashboard/ClassesWaveCard';

interface StudentOverviewProps {
  onNavigate: (tab: string) => void;
  onOpenMobileMenu?: () => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ onNavigate, onOpenMobileMenu }) => {
  const { currentUser, currentStudent } = useAuth();
  const {
    classes,
    subjects,
    materials,
    assignments,
    submissions,
    grades,
    students,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const studentClass = classes.find((c) => c.id === currentStudent?.class_id);

  // Submissions by this student
  const mySubmissions = submissions.filter((s) => s.student_id === currentStudent?.id);
  const mySubmittedAsgIds = mySubmissions.map((s) => s.assignment_id);

  // Class assignments
  const classAssignments = assignments.filter((a) => {
    if (a.is_active === false) return false;
    let allowedIds: string[] = [];
    if (Array.isArray(a.class_ids) && a.class_ids.length > 0) {
      allowedIds = a.class_ids;
    } else if (a.class_id) {
      allowedIds = [a.class_id];
    }
    if (allowedIds.length === 0) return true;
    if (!currentStudent?.class_id) return false;
    return allowedIds.includes(currentStudent.class_id);
  });

  const activeAssignments = classAssignments.filter((a) => !mySubmittedAsgIds.includes(a.id));
  const myGrades = grades.filter((g) => g.student_id === currentStudent?.id && g.is_published);

  // Filter materials for student's class
  const myMaterials = materials.filter((m) => {
    if (currentStudent?.class_id && m.class_id && m.class_id !== currentStudent.class_id) return false;
    return m.is_published;
  });

  const firstName = currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'Siswa';

  return (
    <div className="space-y-6">
      {/* 1. Topbar */}
      <DashboardTopbar
        userName={firstName}
        subtitle={`Portal belajar kelas ${studentClass?.name || 'Siswa'}.`}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenMobileMenu={onOpenMobileMenu}
        actionButtonLabel="Buka Tugas Aktif"
        onActionButtonClick={() => onNavigate('assignments')}
        notificationCount={activeAssignments.length}
        onNotificationClick={() => onNavigate('assignments')}
        onNavigate={onNavigate}
      />

      {/* 2. Top Bento Grid */}
      <div className="bento-top-grid">
        <HeroBannerCard
          headline={`Semangat Belajar, ${firstName}!`}
          actionLabel="Kerjakan Tugas Sekarang"
          onActionClick={() => onNavigate('assignments')}
          students={students}
          onExploreClick={() => onNavigate('materials')}
          ctaLabel="Buka Materi Belajar"
        />

        <ActivityStatusCard
          submissions={mySubmissions}
          assignments={classAssignments}
          onNavigateSubmissions={() => onNavigate('history')}
        />
      </div>

      {/* 3. Stat Cards Siswa (4 Biji Awal Berformat Claymorphism Elegan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Tugas Belum Selesai (Clay Sapphire) */}
        <div
          onClick={() => onNavigate('assignments')}
          className="clay-card clay-card-sapphire group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="clay-icon-squircle">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <span className="clay-pill-mint">
              {activeAssignments.length > 0 ? `${activeAssignments.length} Baru` : 'Tuntas'}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80 tracking-wide uppercase mb-1">Tugas Belum Selesai</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {activeAssignments.length}
            </h3>
          </div>
          <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
            <span>Tugas & kuis semester</span>
            <span className="font-bold text-white group-hover:translate-x-1.5 transition-transform text-sm">&rarr;</span>
          </div>
        </div>

        {/* Card 2: Materi Pembelajaran (Clay Emerald) */}
        <div
          onClick={() => onNavigate('materials')}
          className="clay-card clay-card-emerald group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="clay-icon-squircle">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="clay-pill-frost">
              {subjects.length} Mapel
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80 tracking-wide uppercase mb-1">Materi Pembelajaran</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {myMaterials.length}
            </h3>
          </div>
          <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
            <span>Modul bahan ajar terbuka</span>
            <span className="font-bold text-white group-hover:translate-x-1.5 transition-transform text-sm">&rarr;</span>
          </div>
        </div>

        {/* Card 3: Riwayat Pengumpulan (Clay Slate) */}
        <div
          onClick={() => onNavigate('history')}
          className="clay-card clay-card-slate group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="clay-icon-squircle">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="clay-pill-frost">
              {mySubmissions.length} Dikirim
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80 tracking-wide uppercase mb-1">Riwayat Pengumpulan</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {mySubmissions.length}
            </h3>
          </div>
          <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
            <span>Jawaban tugas & link proyek</span>
            <span className="font-bold text-white group-hover:translate-x-1.5 transition-transform text-sm">&rarr;</span>
          </div>
        </div>

        {/* Card 4: Total Nilai Terbit (Clay Amber) */}
        <div
          onClick={() => onNavigate('grades')}
          className="clay-card clay-card-amber group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="clay-icon-squircle">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="clay-pill-amber">
              {myGrades.length} Rapor
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80 tracking-wide uppercase mb-1">Total Nilai Terbit</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {myGrades.length}
            </h3>
          </div>
          <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
            <span>Hasil penilaian guru</span>
            <span className="font-bold text-white group-hover:translate-x-1.5 transition-transform text-sm">&rarr;</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SubmissionMeterCard
          submissions={mySubmissions}
          grades={myGrades}
          onNavigateGrading={() => onNavigate('grades')}
        />

        <ClassesWaveCard
          classes={classes}
          students={students}
          onNavigateClasses={() => onNavigate('subjects')}
        />
      </div>
    </div>
  );
};
