import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Inbox,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { useData } from '../../../context/DataContext';

interface AdminOverviewProps {
  onNavigate: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const {
    students,
    classes,
    subjects,
    materials,
    assignments,
    submissions,
  } = useData();

  const [activeBarHover, setActiveBarHover] = useState<number | null>(3); // Default hover on April (index 3)
  const [chartTimeframe, setChartTimeframe] = useState('Tahun Ini');

  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted').length;
  const gradedSubmissions = submissions.filter(s => s.status === 'graded').length;
  const totalModules = materials.length + assignments.length;

  // Monthly activity chart data (Jan - Jul)
  const monthlyData = [
    { month: 'Jan', grayHeight: '35%', blueHeight: '55%', grayVal: 18450, blueVal: 24200 },
    { month: 'Feb', grayHeight: '75%', blueHeight: '45%', grayVal: 38200, blueVal: 21900 },
    { month: 'Mar', grayHeight: '40%', blueHeight: '65%', grayVal: 22100, blueVal: 31400 },
    { month: 'Apr', grayHeight: '92%', blueHeight: '80%', grayVal: 43787, blueVal: 39784, peak: true },
    { month: 'Mei', grayHeight: '50%', blueHeight: '45%', grayVal: 26500, blueVal: 22800 },
    { month: 'Jun', grayHeight: '65%', blueHeight: '55%', grayVal: 31200, blueVal: 27900 },
    { month: 'Jul', grayHeight: '70%', blueHeight: '85%', grayVal: 34100, blueVal: 41800 },
  ];

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT / CENTER COLUMN (Col-span 7 or 8)                  */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top 4 Stat Cards in 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1. Primary Highlight Card (Solid Electric Blue) */}
            <div
              onClick={() => onNavigate('students')}
              className="bg-[#3b5bf5] text-white rounded-3xl p-6 shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition-all group"
            >
              {/* Background ambient light */}
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                  <Users className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1cd485] text-slate-950 flex items-center gap-1">
                  +2.08%
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-xs font-medium text-white/80 mb-1">Total Siswa Terdaftar</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {students.length > 0 ? students.length.toLocaleString('id-ID') : '0'}
                </h3>
              </div>

              <div className="pt-4 mt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70 relative z-10">
                <span>Siswa aktif di seluruh kelas</span>
                <span className="font-semibold text-white group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            {/* 2. Total Orders style -> Total Jawaban Masuk */}
            <div
              onClick={() => onNavigate('submissions')}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Inbox className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1cd485]/15 text-[#0fa868]">
                  +12.4%
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Total Jawaban Masuk</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {totalSubmissions > 0 ? totalSubmissions.toLocaleString('id-ID') : '0'}
                </h3>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Pengumpulan tugas & kuis siswa</span>
                <span className="font-semibold text-slate-700 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            {/* 3. Visitor style -> Belum Dikoreksi */}
            <div
              onClick={() => onNavigate('grading')}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  pendingSubmissions > 0
                    ? 'bg-rose-500/15 text-rose-600'
                    : 'bg-emerald-500/15 text-emerald-600'
                }`}>
                  {pendingSubmissions > 0 ? '-2.08%' : 'Tuntas'}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Tugas Belum Dinilai</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {pendingSubmissions.toLocaleString('id-ID')}
                </h3>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{pendingSubmissions > 0 ? 'Perlu tindakan guru' : 'Semua sudah diperiksa'}</span>
                <span className="font-semibold text-slate-700 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            {/* 4. Total Sold Products style -> Bahan Ajar & Kuis */}
            <div
              onClick={() => onNavigate('materials')}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1cd485]/15 text-[#0fa868]">
                  +12.1%
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Materi & Kuis Terbit</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {totalModules.toLocaleString('id-ID')}
                </h3>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Modul belajar siap diakses siswa</span>
                <span className="font-semibold text-slate-700 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          </div>

          {/* Big Chart Card: Customer Habbits style -> Aktivitas Belajar Siswa */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-6">
            {/* Header with Title & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">Aktivitas Belajar Siswa</h4>
                <p className="text-xs text-slate-400">Pantau intensitas belajar materi dan penyelesaian kuis</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>{chartTimeframe}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Legend row */}
            <div className="flex items-center gap-5 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>Materi Dibaca</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b5bf5]"></span>
                <span>Kuis Dikerjakan</span>
              </div>
            </div>

            {/* Dual Bar Chart with Floating Tooltip matching image */}
            <div className="relative pt-8 pb-2">
              {/* Y-Axis Grid Lines & Labels */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] text-slate-300">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-1">
                  <span className="w-8">60K</span>
                  <div className="flex-1 border-b border-dashed border-slate-100"></div>
                </div>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-1">
                  <span className="w-8">40K</span>
                  <div className="flex-1 border-b border-dashed border-slate-100"></div>
                </div>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-1">
                  <span className="w-8">20K</span>
                  <div className="flex-1 border-b border-dashed border-slate-100"></div>
                </div>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-1">
                  <span className="w-8">10K</span>
                  <div className="flex-1 border-b border-dashed border-slate-100"></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8">0K</span>
                  <div className="flex-1 border-b border-slate-200"></div>
                </div>
              </div>

              {/* Bars Columns */}
              <div className="relative z-10 h-60 flex items-end justify-between pl-10 pr-4">
                {monthlyData.map((item, idx) => {
                  const isHovered = activeBarHover === idx;
                  return (
                    <div
                      key={item.month}
                      className="flex flex-col items-center gap-2 flex-1 relative group cursor-pointer"
                      onMouseEnter={() => setActiveBarHover(idx)}
                    >
                      {/* Floating Tooltip Bubble on Active/Hover Month */}
                      {isHovered && (
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 bg-slate-950 text-white rounded-2xl px-3.5 py-2 shadow-xl whitespace-nowrap animate-fade-in pointer-events-none">
                          <div className="flex items-center gap-2 text-[10px] font-semibold">
                            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                            <span>{item.grayVal.toLocaleString('id-ID')} Materi</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#3b5bf5]">
                            <span className="w-2 h-2 rounded-full bg-[#3b5bf5]"></span>
                            <span>{item.blueVal.toLocaleString('id-ID')} Kuis</span>
                          </div>
                          <div className="w-2.5 h-2.5 bg-slate-950 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                        </div>
                      )}

                      {/* Bar Pair */}
                      <div className="flex items-end gap-1.5 sm:gap-2 h-full">
                        {/* Gray Bar (Materi) */}
                        <div
                          style={{ height: item.grayHeight }}
                          className={`w-3.5 sm:w-5 rounded-t-xl transition-all duration-300 ${
                            isHovered ? 'bg-slate-300' : 'bg-slate-200'
                          }`}
                        ></div>

                        {/* Blue Bar (Kuis) */}
                        <div
                          style={{ height: item.blueHeight }}
                          className={`w-3.5 sm:w-5 rounded-t-xl transition-all duration-300 ${
                            isHovered ? 'bg-[#2a45d4] shadow-md shadow-blue-500/30' : 'bg-[#3b5bf5]'
                          }`}
                        ></div>
                      </div>

                      {/* Month Label */}
                      <span className={`text-xs font-semibold transition-colors mt-2 ${
                        isHovered ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}>
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN (Col-span 4 or 5)                           */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Product Statistic style -> Statistik Modul Pembelajaran */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">Statistik Modul</h4>
                <p className="text-xs text-slate-400">Komposisi materi & penugasan</p>
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Hari Ini</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Concentric Semi-Radial Ring Graphic matching reference */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-52 h-52 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  {/* Outer Ring: Electric Blue (Kuis) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#3b5bf5"
                    strokeWidth="8"
                    strokeDasharray="314"
                    strokeDashoffset="78"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Middle Ring: Coral Red (Tugas) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="38"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="38"
                    stroke="#f43f5e"
                    strokeWidth="8"
                    strokeDasharray="238"
                    strokeDashoffset="90"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Inner Ring: Soft Slate Gray (Materi) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="26"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="26"
                    stroke="#94a3b8"
                    strokeWidth="8"
                    strokeDasharray="163"
                    strokeDashoffset="60"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute text-center">
                  <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    {totalModules > 0 ? (totalModules * 12).toLocaleString('id-ID') : '9.829'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Akses Modul</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded-full text-[10px] font-bold bg-[#1cd485]/15 text-[#0fa868]">
                    +5.34%
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown category list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b5bf5]"></span>
                  <span className="font-semibold text-slate-800">Kuis & Ujian Aktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{assignments.length}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                    +1.8%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></span>
                  <span className="font-semibold text-slate-800">Materi Pembelajaran</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{materials.length}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                    +2.3%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]"></span>
                  <span className="font-semibold text-slate-800">Mata Pelajaran</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{subjects.length}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600">
                    -1.04%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Customer Growth style -> Sebaran Siswa per Kelas */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">Sebaran Siswa Kelas</h4>
                <p className="text-xs text-slate-400">Distribusi peserta didik aktif</p>
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Hari Ini</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Bubble Graphic matching image */}
            <div className="relative h-44 flex items-center justify-center py-2">
              {/* Bubble 1: Main Big Blue */}
              <div className="w-24 h-24 rounded-full bg-[#3b5bf5] text-white flex flex-col items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/25 absolute left-12 top-6 z-10 animate-pulse">
                <span>{students.length > 0 ? Math.round(students.length * 0.45) : 32}</span>
                <span className="text-[9px] font-normal text-white/80">Kelas A</span>
              </div>

              {/* Bubble 2: Medium Indigo */}
              <div className="w-20 h-20 rounded-full bg-[#2a45d4] text-white flex flex-col items-center justify-center font-bold text-xs shadow-md absolute right-14 top-4 z-0">
                <span>{students.length > 0 ? Math.round(students.length * 0.35) : 28}</span>
                <span className="text-[9px] font-normal text-white/80">Kelas B</span>
              </div>

              {/* Bubble 3: Light Blue small */}
              <div className="w-14 h-14 rounded-full bg-[#6366f1] text-white flex flex-col items-center justify-center font-bold text-[11px] shadow-sm absolute left-6 bottom-2 z-20">
                <span>{students.length > 0 ? Math.max(1, Math.round(students.length * 0.2)) : 14}</span>
              </div>

              {/* Bubble 4: Soft Slate Blue */}
              <div className="w-16 h-16 rounded-full bg-[#818cf8] text-white flex flex-col items-center justify-center font-bold text-xs shadow-sm absolute right-10 bottom-2 z-10">
                <span>{classes.length} Kls</span>
              </div>
            </div>

            {/* Class distribution list with badges */}
            <div className="space-y-2.5 pt-2">
              {classes.slice(0, 4).map((c, i) => {
                const count = students.filter(s => s.class_id === c.id).length;
                return (
                  <div key={c.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${
                        i === 0 ? 'bg-[#3b5bf5]' : i === 1 ? 'bg-[#2a45d4]' : i === 2 ? 'bg-[#6366f1]' : 'bg-[#818cf8]'
                      }`}></span>
                      <span className="font-semibold text-slate-800">{c.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{count} Siswa</span>
                  </div>
                );
              })}
              {classes.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">Belum ada data kelas terdaftar.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
