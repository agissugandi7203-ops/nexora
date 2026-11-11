import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
import { LearningMaterial, Assignment } from '../../types/database.types';

interface SpotlightMaterialsCardProps {
  materials?: LearningMaterial[];
  assignments?: Assignment[];
  onOpenMaterial?: (materialId: string) => void;
  onOpenAssignment?: (assignmentId: string) => void;
}

export const SpotlightMaterialsCard: React.FC<SpotlightMaterialsCardProps> = ({
  materials = [],
  assignments = [],
  onOpenMaterial,
  onOpenAssignment,
}) => {
  // Combine real materials & assignments for spotlight items
  const items = [
    ...materials.map((m) => ({
      id: m.id,
      title: m.title,
      badge: 'Materi Pembelajaran',
      copy: m.description || 'Pelajari materi teori & praktik yang telah disiapkan pengajar.',
      type: 'material' as const,
    })),
    ...assignments.map((a) => ({
      id: a.id,
      title: a.title,
      badge: a.type === 'quiz' ? 'Kuis Online' : 'Tugas Praktik',
      copy: a.description || `Total poin ${a.total_points} — kumpulkan tepat waktu.`,
      type: 'assignment' as const,
    })),
  ];

  const fallbackItems = [
    {
      id: 'default-1',
      title: 'Pengenalan Dasar Figma & Wireframing',
      badge: 'Materi Pembelajaran',
      copy: 'Pelajari konsep Frame, Auto Layout, dan komponen interaktif UI/UX.',
      type: 'material' as const,
    },
    {
      id: 'default-2',
      title: 'Tugas Latihan 1 Desain Antarmuka',
      badge: 'Tugas Praktik',
      copy: 'Kumpulkan tautan proyek Figma hasil pengerjaan mandiri.',
      type: 'assignment' as const,
    },
  ];

  const displayList = items.length > 0 ? items : fallbackItems;
  const [index, setIndex] = useState(0);
  const total = displayList.length;
  const current = displayList[index] || displayList[0];

  const handlePrev = () => setIndex((prev) => (prev - 1 + total) % total);
  const handleNext = () => setIndex((prev) => (prev + 1) % total);

  const handleClickItem = () => {
    if (current.type === 'material' && onOpenMaterial) {
      onOpenMaterial(current.id);
    } else if (current.type === 'assignment' && onOpenAssignment) {
      onOpenAssignment(current.id);
    }
  };

  return (
    <article className="white-bento-card">
      <div>
        <div className="metric-card__header">
          <div className="metric-card__title-group">
            <span className="metric-icon-chip" aria-hidden="true">
              <BookOpen className="w-4 h-4" />
            </span>
            <h3 className="metric-card__heading">Sorotan Pembelajaran</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Kurikulum 2026</span>
        </div>

        <h3 className="curated-card__title">{current.title}</h3>

        <div
          className="curated-card__callout cursor-pointer hover:border-blue-300 transition-colors"
          onClick={handleClickItem}
          title="Klik untuk membuka detail materi / tugas"
        >
          <span className="curated-card__badge">
            <span>{current.badge}</span>
          </span>
          <p className="curated-card__copy">{current.copy}</p>
        </div>
      </div>

      <div className="curated-card__footer">
        <div className="curated-card__counter">
          <strong>{index + 1}</strong> / {total} Modul
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="curated-card__nav-btn"
            onClick={handlePrev}
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="curated-card__nav-btn"
            onClick={handleNext}
            aria-label="Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
