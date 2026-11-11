import React, { useState } from 'react';
import { Submission, Assignment } from '../../types/database.types';

interface ActivityStatusCardProps {
  submissions: Submission[];
  assignments?: Assignment[];
  onNavigateSubmissions?: () => void;
}

export const ActivityStatusCard: React.FC<ActivityStatusCardProps> = ({
  submissions = [],
  assignments = [],
  onNavigateSubmissions,
}) => {
  const [period, setPeriod] = useState<'D' | 'W' | 'M'>('D');

  const totalSubmissions = submissions.length;
  const gradedCount = submissions.filter((s) => s.status === 'graded').length;
  const pendingCount = submissions.filter((s) => s.status === 'submitted').length;

  const completionRate =
    totalSubmissions > 0 ? Math.round((gradedCount / totalSubmissions) * 100) : 100;

  // Circumference for r=42 is 2 * PI * 42 ≈ 263.89
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (completionRate / 100) * circumference;

  // Secondary ring (pending ratio) r=32, circumference ≈ 201.06
  const innerRadius = 30;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const pendingRatio = totalSubmissions > 0 ? Math.round((pendingCount / totalSubmissions) * 100) : 0;
  const innerProgressOffset = innerCircumference - (pendingRatio / 100) * innerCircumference;

  return (
    <section className="status-bento-card flex flex-col justify-between">
      {/* 1. Header Bar: Title + Period Tabs + Clean Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="status-bento-card__title">Status Aktivitas Tugas</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Monitoring penyelesaian & koreksi tugas
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="period-tabs" role="tablist" aria-label="Rentang Waktu">
            {(['D', 'W', 'M'] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={period === key}
                className={`period-tab ${period === key ? 'is-active' : ''}`}
                onClick={() => setPeriod(key)}
              >
                {key === 'D' ? 'Hari Ini' : key === 'W' ? 'Minggu' : 'Semester'}
              </button>
            ))}
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {pendingCount} Antrean
          </span>
        </div>
      </div>

      {/* 2. Main Content: Left Filled Blue Graph + Right Circular Ring Chart */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center flex-1">
        {/* Left Column: Filled Blue Activity Wave Graphic (Takes 7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between h-full min-w-0 pr-0 md:pr-2">
          {/* Wave Area Chart filling the left container */}
          <div className="w-full h-32 relative my-auto">
            <svg
              className="w-full h-full"
              viewBox="0 0 320 120"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="activityBlueArea" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b5bf5" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#3b5bf5" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#3b5bf5" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="activityBlueLine" x1="0" y1="60" x2="320" y2="60" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#3b5bf5" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="320" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="65" x2="320" y2="65" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="320" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Filled Wave Area */}
              <path
                d="M 0 95 C 40 85, 70 35, 110 35 C 150 35, 180 80, 220 80 C 260 80, 285 20, 320 25 L 320 120 L 0 120 Z"
                fill="url(#activityBlueArea)"
              />

              {/* Solid Wave Stroke */}
              <path
                d="M 0 95 C 40 85, 70 35, 110 35 C 150 35, 180 80, 220 80 C 260 80, 285 20, 320 25"
                stroke="url(#activityBlueLine)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Peak Dots */}
              <circle cx="110" cy="35" r="4.5" fill="#3b5bf5" />
              <circle cx="110" cy="35" r="8" fill="#3b5bf5" fillOpacity="0.25" />

              <circle cx="320" cy="25" r="4.5" fill="#2563eb" />
              <circle cx="320" cy="25" r="8" fill="#2563eb" fillOpacity="0.25" />
            </svg>
          </div>

          {/* Metric Bottom Row on the left */}
          <div
            className="flex items-center justify-between pt-2 border-t border-slate-100 cursor-pointer"
            onClick={onNavigateSubmissions}
            title="Buka detail pengumpulan tugas"
          >
            <div>
              <p className="text-[11px] font-medium text-slate-400">Total Pengumpulan</p>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">
                {totalSubmissions} <span className="text-xs font-semibold text-slate-400">Jawaban</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-slate-400">Belum Diperiksa</p>
              <p className="text-xl font-extrabold text-slate-900 leading-tight">
                {pendingCount} <span className="text-xs font-semibold text-slate-400">Tugas</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Circular / Donut Ring Chart (Takes 5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
              {/* Outer Track */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="#f1f5f9"
                strokeWidth="7"
                fill="none"
              />
              {/* Outer Progress (Blue: Graded) */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="#3b5bf5"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />

              {/* Inner Track */}
              <circle
                cx="55"
                cy="55"
                r={innerRadius}
                stroke="#f8fafc"
                strokeWidth="5"
                fill="none"
              />
              {/* Inner Progress (Slate: Pending) */}
              <circle
                cx="55"
                cy="55"
                r={innerRadius}
                stroke="#0e1726"
                strokeWidth="5"
                strokeDasharray={innerCircumference}
                strokeDashoffset={innerProgressOffset}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
            </svg>

            {/* Center Percentage Display */}
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                {completionRate}%
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                TUNTAS
              </p>
            </div>
          </div>

          {/* Mini Legend Below Circle */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b5bf5]" />
              <span>Dinilai ({gradedCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0e1726]" />
              <span>Antrean ({pendingCount})</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
