import React, { useState } from 'react';
import {
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  School,
  AlertCircle,
  TrendingUp,
  FileText,
  ChevronDown,
  BellRing
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';

interface StudentOverviewProps {
  onNavigate: (tab: string) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ onNavigate }) => {
  const { currentUser, currentStudent } = useAuth();
  const { classes, subjects, materials, assignments, submissions, grades, announcements, isMaterialCompleted } = useData();

  const [activeBarHover, setActiveBarHover] = useState<number | null>(3);
  const studentClass = classes.find(c => c.id === currentStudent?.class_id);
  const studentKey = currentStudent?.id || 'default_student';

  // Student specific submissions
  const mySubmissions = submissions.filter(s => s.student_id === currentStudent?.id);
  const mySubmittedAsgIds = mySubmissions.map(s => s.assignment_id);

  // Filter subjects for student class
  const mySubjects = subjects.filter(sub => {
    if (!currentStudent?.class_id) return true;
    if (!sub.class_ids || sub.class_ids.length === 0) return true;
    return sub.class_ids.includes(currentStudent.class_id);
  });
  const mySubjectIds = mySubjects.map(s => s.id);

  // Filter materials for student class & subjects
  const myMaterials = materials.filter(m => {
    if (m.subject_id && !mySubjectIds.includes(m.subject_id)) return false;
    if (currentStudent?.class_id && m.class_id && m.class_id !== currentStudent.class_id) return false;
    return m.is_published;
  });
  const myCompletedMaterialsCount = myMaterials.filter(m => isMaterialCompleted(m.id, studentKey)).length;

  // Filter assignments for student class (mendukung multi-kelas class_ids maupun class_id tunggal)
  const classAssignments = assignments.filter(a => {
    if (a.is_active === false) return false;
    let allowedIds: string[] = [];
    if (Array.isArray(a.class_ids) && a.class_ids.length > 0) {
      allowedIds = a.class_ids;
    } else if (a.class_id) {
      allowedIds = [a.class_id];
    } else {
      const sub = subjects.find(s => s.id === a.subject_id);
      if (sub?.class_ids && sub.class_ids.length > 0) {
        allowedIds = sub.class_ids;
      }
    }
    if (allowedIds.length === 0) return true;
    if (!currentStudent?.class_id) return false;
    return allowedIds.includes(currentStudent.class_id);
  });

  const activeAssignments = classAssignments.filter(a => !mySubmittedAsgIds.includes(a.id));
  const completedAssignments = classAssignments.filter(a => mySubmittedAsgIds.includes(a.id));

  // My latest grades
  const myGrades = grades.filter(g => g.student_id === currentStudent?.id && g.is_published);
  const latestGrade = myGrades[0];

  // Activity progress data
  const weeklyData = [
    { day: 'Sen', grayHeight: '40%', blueHeight: '60%', grayVal: 2, blueVal: 4 },
    { day: 'Sel', grayHeight: '70%', blueHeight: '50%', grayVal: 5, blueVal: 3 },
    { day: 'Rab', grayHeight: '50%', blueHeight: '75%', grayVal: 3, blueVal: 6 },
    { day: 'Kam', grayHeight: '90%', blueHeight: '85%', grayVal: 7, blueVal: 8, peak: true },
    { day: 'Jum', grayHeight: '60%', blueHeight: '50%', grayVal: 4, blueVal: 4 },
    { day: 'Sab', grayHeight: '30%', blueHeight: '40%', grayVal: 2, blueVal: 3 },
    { day: 'Min', grayHeight: '20%', blueHeight: '35%', grayVal: 1, blueVal: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT / CENTER COLUMN                                     */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top 4 Stat Cards in 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1. Primary Solid Blue Card: Tugas Aktif */}
            <div
              onClick={() => onNavigate('assignments')}
              className="bg-[#3b5bf5] text-white rounded-3xl p-6 shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition-all group"
            >
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1cd485] text-slate-950">
                  {activeAssignments.length > 0 ? 'Siap Dikerjakan' : 'Tuntas'}
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-xs font-medium text-white/80 mb-1">Tugas & Kuis Aktif</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {activeAssignments.length} Tugas
                </h3>
              </div>

              <div className="pt-4 mt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70 relative z-10">
                <span>Kerjakan sebelum batas waktu</span>
                <span className="font-semibold text-white group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            {/* 2. Total Materi */}
            <div
              onClick={() => onNavigate('materials')}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1cd485]/15 text-[#0fa868]">
                  {myCompletedMaterialsCount}/{myMaterials.length} Selesai
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Materi Pembelajaran</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {myMaterials.length} Modul
                </h3>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{myCompletedMaterialsCount > 0 ? `${myCompletedMaterialsCount} modul telah selesai dibaca` : 'Bahan ajar siap dipelajari'}</span>
                <span className="font-semibold text-slate-700 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            {/* 3. Tugas Selesai */}
            <div
              onClick={() => onNavigate('history')}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600">
                  Terkumpul
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Tugas Telah Dikirim</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {completedAssignments.length} Selesai
                </h3>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Jawaban telah diterima guru</span>
                <span className="font-semibold text-slate-700 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            {/* 4. Nilai Terakhir */}
            <div
              onClick={() => onNavigate('grades')}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Award className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1cd485]/15 text-[#0fa868]">
                  Poin Rata-Rata
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Nilai Evaluasi Terakhir</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {latestGrade ? `${latestGrade.score}` : '100'}
                </h3>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Hasil penilaian guru</span>
                <span className="font-semibold text-slate-700 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          </div>

          {/* Big Activity Chart Card matching DealDeck image */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">Aktivitas Belajar Mingguan</h4>
                <p className="text-xs text-slate-400">Rekap frekuensi pengerjaan tugas dan membaca modul</p>
              </div>

              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <span>Minggu Ini</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>Modul Dibuka</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b5bf5]"></span>
                <span>Kuis & Tugas</span>
              </div>
            </div>

            {/* Chart */}
            <div className="relative pt-6 pb-2">
              <div className="h-56 flex items-end justify-between px-3">
                {weeklyData.map((item, idx) => {
                  const isHovered = activeBarHover === idx;
                  return (
                    <div
                      key={item.day}
                      className="flex flex-col items-center gap-2 flex-1 relative group cursor-pointer"
                      onMouseEnter={() => setActiveBarHover(idx)}
                    >
                      {/* Floating Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 bg-slate-950 text-white rounded-2xl px-3 py-1.5 shadow-xl whitespace-nowrap pointer-events-none">
                          <span className="text-[10px] font-bold text-[#3b5bf5] mr-1.5">{item.blueVal} Tugas</span>
                          <span className="text-[10px] text-slate-300">&bull; {item.grayVal} Modul</span>
                          <div className="w-2 h-2 bg-slate-950 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                        </div>
                      )}

                      <div className="flex items-end gap-1.5 h-full">
                        <div
                          style={{ height: item.grayHeight }}
                          className={`w-3 sm:w-4 rounded-t-xl transition-all duration-300 ${
                            isHovered ? 'bg-slate-300' : 'bg-slate-200'
                          }`}
                        ></div>
                        <div
                          style={{ height: item.blueHeight }}
                          className={`w-3 sm:w-4 rounded-t-xl transition-all duration-300 ${
                            isHovered ? 'bg-[#2a45d4] shadow-md shadow-blue-500/30' : 'bg-[#3b5bf5]'
                          }`}
                        ></div>
                      </div>

                      <span className={`text-xs transition-colors mt-2 ${
                        isHovered ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN                                             */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Daftar Tugas Mendesak */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">Tugas Mendesak</h4>
                <p className="text-xs text-slate-400">Wajib segera diselesaikan</p>
              </div>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-xs text-[#3b5bf5] hover:underline font-semibold"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {activeAssignments.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">Semua tugas tuntas!</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tidak ada tugas aktif yang menanti.</p>
                </div>
              ) : (
                activeAssignments.slice(0, 3).map((asg) => {
                  const subject = subjects.find(s => s.id === asg.subject_id);
                  return (
                    <div
                      key={asg.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:border-slate-200 transition-colors"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#3b5bf5] uppercase tracking-wider block">
                          {subject?.name || 'Umum'}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5">{asg.title}</h5>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{asg.duration_minutes ? `${asg.duration_minutes} Menit` : 'Tanpa Timer'}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => onNavigate('assignments')}
                        className="px-3 py-1.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-semibold text-xs shadow-sm shrink-0"
                      >
                        Buka
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card 2: Pengumuman Sekolah */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">Pengumuman</h4>
                <p className="text-xs text-slate-400">Informasi dari guru</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#3b5bf5]"></span>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-3.5 h-3.5 text-[#3b5bf5] shrink-0" />
                    <h5 className="text-xs font-bold text-slate-900">{ann.title}</h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-5 line-clamp-2">{ann.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">Belum ada pengumuman baru.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
