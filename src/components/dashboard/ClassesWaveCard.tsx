import React from 'react';
import { School, Users } from 'lucide-react';
import { ClassItem, Student } from '../../types/database.types';

interface ClassesWaveCardProps {
  classes: ClassItem[];
  students: Student[];
  onNavigateClasses?: () => void;
}

export const ClassesWaveCard: React.FC<ClassesWaveCardProps> = ({
  classes = [],
  students = [],
  onNavigateClasses,
}) => {
  const classCount = classes.length || 8;
  const studentCount = students.length || 77;

  return (
    <article
      className="white-bento-card cursor-pointer"
      onClick={onNavigateClasses}
      title="Buka Manajemen Kelas"
    >
      <div>
        <div className="metric-card__header">
          <div className="metric-card__title-group">
            <span className="metric-icon-chip" aria-hidden="true">
              <School className="w-4 h-4" />
            </span>
            <h3 className="metric-card__heading">Distribusi Kelas</h3>
          </div>
          <div className="metric-card__cap">
            {classCount} <small>Rombel</small>
          </div>
        </div>

        <div className="metric-card__subrow">
          <span>Sebaran siswa aktif per kelas</span>
          <span>T.A. 2026/2027</span>
        </div>
      </div>

      <div className="wave-chart-wrap" aria-hidden="true">
        <svg
          className="wave-chart-svg"
          viewBox="0 0 280 84"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lmsWaveFill" x1="0" y1="10" x2="0" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b5bf5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b5bf5" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lmsPrimaryStroke" x1="8" y1="42" x2="272" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.3" />
              <stop offset="25%" stopColor="#3b5bf5" stopOpacity="1" />
              <stop offset="80%" stopColor="#2563eb" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="lmsSecondaryStroke" x1="16" y1="46" x2="274" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.2" />
              <stop offset="30%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Fill glow under wave */}
          <path
            d="M 10 58 C 36 32, 62 14, 88 14 C 122 14, 146 64, 182 64 C 214 64, 236 34, 268 44 L 268 84 L 10 84 Z"
            fill="url(#lmsWaveFill)"
          />

          {/* Secondary wave */}
          <path
            d="M 24 64 C 58 50, 88 22, 122 22 C 156 22, 178 60, 210 60 C 236 60, 252 34, 274 48"
            stroke="url(#lmsSecondaryStroke)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Primary wave */}
          <path
            d="M 10 58 C 36 32, 62 14, 88 14 C 122 14, 146 64, 182 64 C 214 64, 236 34, 268 44"
            stroke="url(#lmsPrimaryStroke)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Peak dot */}
          <circle cx="88" cy="14" r="5" fill="#3b5bf5" />
          <circle cx="88" cy="14" r="8" fill="#3b5bf5" fillOpacity="0.2" />
        </svg>
      </div>

      <div className="proximity-footer">
        <div className="proximity-big-number">
          {classCount}
          <span>Kelas</span>
        </div>

        <div className="proximity-status-note">
          <strong>{studentCount}</strong> Siswa Terdata
          <br />
          Tingkat partisipasi tinggi
        </div>
      </div>
    </article>
  );
};
