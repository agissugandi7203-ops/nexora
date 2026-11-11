import React from 'react';
import { Inbox, CheckCircle2, Clock } from 'lucide-react';
import { Submission, Grade } from '../../types/database.types';

interface SubmissionMeterCardProps {
  submissions: Submission[];
  grades: Grade[];
  onNavigateGrading?: () => void;
}

const TOTAL_TICKS = 22;

export const SubmissionMeterCard: React.FC<SubmissionMeterCardProps> = ({
  submissions = [],
  grades = [],
  onNavigateGrading,
}) => {
  const totalSubmissions = submissions.length;
  const gradedCount = submissions.filter((s) => s.status === 'graded').length;
  const pendingCount = submissions.filter((s) => s.status === 'submitted').length;

  // Average grade score
  const avgScore =
    grades.length > 0
      ? Math.round(grades.reduce((acc, g) => acc + (Number(g.score) || 0), 0) / grades.length)
      : 85;

  // Active ticks ratio based on graded progress (or total submissions vs target 200)
  const targetSubmissions = Math.max(200, totalSubmissions || 1);
  const activeTicks = Math.min(
    TOTAL_TICKS,
    Math.max(2, Math.round((totalSubmissions / targetSubmissions) * TOTAL_TICKS))
  );

  return (
    <article
      className="white-bento-card cursor-pointer"
      onClick={onNavigateGrading}
      title="Buka Penilaian Tugas"
    >
      <div>
        <div className="metric-card__header">
          <div className="metric-card__title-group">
            <span className="metric-icon-chip" aria-hidden="true">
              <Inbox className="w-4 h-4" />
            </span>
            <h3 className="metric-card__heading">Pengumpulan Tugas</h3>
          </div>
          <div className="metric-card__cap">
            {targetSubmissions} <small>Target</small>
          </div>
        </div>

        <div className="metric-card__subrow">
          <span>Tingkat aktivitas pengumpulan</span>
          <span>Kapasitas Semester</span>
        </div>

        <div className="budget-big-figure">
          {totalSubmissions}
          <span>/ Jawaban Masuk</span>
        </div>

        <div className="tick-meter-bars" role="progressbar">
          {Array.from({ length: TOTAL_TICKS }).map((_, idx) => (
            <span
              key={idx}
              className={`tick-bar ${idx < activeTicks ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="budget-breakdown-row">
        <div className="breakdown-item">
          <strong>{gradedCount}</strong>
          <span>Dinilai</span>
        </div>
        <div className="breakdown-item">
          <strong className={pendingCount > 0 ? 'text-amber-600' : ''}>{pendingCount}</strong>
          <span>Belum Diperiksa</span>
        </div>
        <div className="breakdown-item">
          <strong>{avgScore}</strong>
          <span>Rata-rata Nilai</span>
        </div>
      </div>
    </article>
  );
};
