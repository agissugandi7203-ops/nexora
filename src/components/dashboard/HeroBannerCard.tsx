import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Student } from '../../types/database.types';

interface HeroBannerCardProps {
  headline?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  students?: Student[];
  onExploreClick?: () => void;
  ctaLabel?: string;
}

export const HeroBannerCard: React.FC<HeroBannerCardProps> = ({
  headline = 'Pusat Pembelajaran Digital Terintegrasi',
  actionLabel = 'Kelola Pembelajaran Sekarang',
  onActionClick,
  students = [],
  onExploreClick,
  ctaLabel = 'Manajemen Siswa',
}) => {
  const sampleStudents = students.slice(0, 4);

  return (
    <section className="hero-bento-card">
      <picture>
        <source srcSet="/dashboard-hero.webp" type="image/webp" />
        <img
          src="/dashboard-hero.jpg"
          alt="Hero Background"
          className="hero-bento-card__bg-img"
          loading="eager"
          decoding="async"
        />
      </picture>
      <div className="hero-bento-card__gradient-scrim" aria-hidden="true" />

      <div>
        <h2 className="hero-bento-card__headline">{headline}</h2>
      </div>

      <button
        type="button"
        className="hero-bento-card__center-play"
        onClick={onActionClick}
      >
        <span className="hero-play-circle" aria-hidden="true">
          <ArrowRight className="w-5 h-5 text-white" />
        </span>
        <span className="hero-play-label">{actionLabel}</span>
      </button>

      <div className="hero-bento-card__footer">
        <div>
          <p className="hero-members-caption">Siswa terdaftar aktif:</p>
          <div className="hero-members-row">
            <div className="avatar-stack">
              {sampleStudents.map((s, idx) => {
                const avatar =
                  s.profile?.avatar_url ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${s.nis_nisn || s.profile?.full_name || idx}`;
                return (
                  <img
                    key={s.id || idx}
                    src={avatar}
                    alt={s.profile?.full_name || 'Siswa'}
                    className="avatar-stack__item"
                  />
                );
              })}
            </div>
            <div className="hero-members-stat">
              <strong>{students.length > 0 ? `${students.length}+` : '0'}</strong>
              <span>Siswa Sekolah</span>
            </div>
          </div>
        </div>

        {onExploreClick && (
          <button
            type="button"
            className="btn-hero-cta"
            onClick={onExploreClick}
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    </section>
  );
};
