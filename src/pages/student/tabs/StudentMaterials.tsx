import React, { useState } from 'react';
import {
  FileCode2,
  BookOpen,
  CheckCircle2,
  FileText,
  Video,
  ExternalLink,
  Check,
  ChevronRight,
  X,
  Search,
  Download
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { LearningMaterial } from '../../../types/database.types';

export const StudentMaterials: React.FC = () => {
  const { currentStudent } = useAuth();
  const { materials, subjects, markMaterialComplete, isMaterialCompleted } = useData();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [filterScope, setFilterScope] = useState<'my_class' | 'all'>('my_class');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMaterial, setActiveMaterial] = useState<LearningMaterial | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const studentKey = currentStudent?.id || 'default_student';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleComplete = async (materialId: string, forceState?: boolean) => {
    const currentlyDone = isMaterialCompleted(materialId, studentKey);
    const nextDone = forceState !== undefined ? forceState : !currentlyDone;
    await markMaterialComplete(materialId, studentKey, nextDone);
    if (nextDone) {
      showToast('Materi berhasil ditandai selesai dipelajari!');
    } else {
      showToast('Status selesai materi dibatalkan.');
    }
  };

  // Published materials (exclude explicit drafts)
  const publishedMaterials = materials.filter(m => m.is_published !== false);

  const mySubjects = subjects.filter(sub => {
    if (!currentStudent?.class_id) return true;
    if (!sub.class_ids || sub.class_ids.length === 0) return true;
    return sub.class_ids.includes(currentStudent.class_id);
  });
  const mySubjectIds = mySubjects.map(s => s.id);

  // Helper: check if a material is designated for this student's class
  const isMaterialForStudentClass = (m: LearningMaterial): boolean => {
    // If material has no class_id specified, it's open for all
    if (!m.class_id) return true;
    // If student has no class_id, show all
    if (!currentStudent?.class_id) return true;
    // Direct class match
    if (m.class_id === currentStudent.class_id) return true;
    // Or if the material belongs to a subject taken by the student
    if (m.subject_id && mySubjectIds.includes(m.subject_id)) return true;
    return false;
  };

  const myClassMaterials = publishedMaterials.filter(isMaterialForStudentClass);

  // If user selected 'my_class' but none match strictly, fallback to all published so student is NEVER stranded
  const activeScope = (filterScope === 'my_class' && myClassMaterials.length === 0 && publishedMaterials.length > 0)
    ? 'all'
    : filterScope;

  const scopedMaterials = activeScope === 'my_class' ? myClassMaterials : publishedMaterials;

  const filtered = scopedMaterials.filter(m => {
    if (selectedSubjectFilter !== 'all' && m.subject_id !== selectedSubjectFilter) return false;

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      const sub = subjects.find(s => s.id === m.subject_id);
      const matchSearch =
        m.title.toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q) ||
        `bab ${m.order_index}`.toLowerCase().includes(q) ||
        (sub?.name || '').toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    return true;
  });

  const completedCount = filtered.filter(m => isMaterialCompleted(m.id, studentKey)).length;

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Modul & Materi Pembelajaran</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelajari modul bahan ajar terstruktur per bab, unduh bahan belajar PDF, dan tandai materi yang selesai
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">
            Progres Selesai: {completedCount} / {filtered.length} Modul
          </span>
        </div>
      </div>

      {/* Scope toggle: Kelas Saya vs Semua Modul */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilterScope('my_class')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeScope === 'my_class'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Modul Kelas Saya ({myClassMaterials.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterScope('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeScope === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Semua Modul Sekolah ({publishedMaterials.length})
          </button>
        </div>
        {filterScope === 'my_class' && myClassMaterials.length === 0 && publishedMaterials.length > 0 && (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
            Menampilkan seluruh modul sekolah karena belum ada modul khusus untuk kelas Anda.
          </span>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari materi pembelajaran atau bab..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Mapel:</span>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5]"
          >
            <option value="all">Semua Mata Pelajaran ({filtered.length})</option>
            {mySubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-3xl border border-slate-200/80 shadow-sm text-slate-400 text-xs space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">
              {searchTerm ? `Tidak ditemukan materi yang cocok dengan "${searchTerm}"` : 'Belum ada materi pembelajaran yang tersedia.'}
            </p>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Reset Pencarian
              </button>
            )}
          </div>
        ) : (
          filtered.map((mat) => {
            const subject = subjects.find(s => s.id === mat.subject_id);
            const isDone = isMaterialCompleted(mat.id, studentKey);

            return (
              <div
                key={mat.id}
                className={`bg-white rounded-3xl p-5 border shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md ${
                  isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/80 hover:border-[#3b5bf5]/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(mat.id)}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-100 border-slate-200 text-slate-400 hover:border-slate-400'
                    }`}
                    title={isDone ? 'Materi selesai (Klik untuk batal)' : 'Klik untuk tandai selesai'}
                  >
                    <Check className="w-5 h-5" />
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                        Bab {mat.order_index}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {subject?.name || 'Umum'}
                      </span>
                      {isDone && (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Selesai Dipelajari
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{mat.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xl">
                      {mat.description || 'Tidak ada deskripsi tambahan.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
                  {/* Direct PDF Download / Open Button for Students */}
                  {mat.pdf_url && (
                    <a
                      href={mat.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs group/pdf"
                      title="Buka / unduh materi dalam format PDF langsung"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                      <span>Buka PDF</span>
                      <ExternalLink className="w-3 h-3 text-rose-500 group-hover/pdf:translate-x-0.5 transition-transform" />
                    </a>
                  )}

                  {mat.video_url && (
                    <a
                      href={mat.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5"
                      title="Tonton video pembelajaran"
                    >
                      <Video className="w-3.5 h-3.5 text-purple-600" />
                      <span>Video</span>
                    </a>
                  )}

                  <button
                    onClick={() => setActiveMaterial(mat)}
                    className="px-4 py-2 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Baca Materi</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reader Modal */}
      {activeMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 shrink-0">
              <div>
                <span className="text-[11px] font-bold text-[#3b5bf5] uppercase tracking-wider">
                  {subjects.find(s => s.id === activeMaterial.subject_id)?.name}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{activeMaterial.title}</h3>
              </div>
              <button onClick={() => setActiveMaterial(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-6">
              {(activeMaterial.pdf_url || activeMaterial.video_url) && (
                <div className="flex flex-wrap gap-3">
                  {activeMaterial.pdf_url && (
                    <a
                      href={activeMaterial.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Unduh Modul Lengkap (PDF)</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}

                  {activeMaterial.video_url && (
                    <a
                      href={activeMaterial.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
                    >
                      <Video className="w-4 h-4 text-rose-600" />
                      <span>Tonton Video Pembahasan</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              )}

              <div
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: activeMaterial.content_rich_text || '<p>Tidak ada isi teks.</p>' }}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {isMaterialCompleted(activeMaterial.id, studentKey) ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sudah Ditandai Selesai Dipelajari</span>
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await handleToggleComplete(activeMaterial.id, false);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-semibold text-xs transition-colors"
                  >
                    Batal Tandai
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    await handleToggleComplete(activeMaterial.id, true);
                    setActiveMaterial(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Tandai Selesai Dipelajari</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveMaterial(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
