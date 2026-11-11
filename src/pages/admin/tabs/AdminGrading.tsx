import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Edit3,
  Search,
  School,
  X,
  MessageSquare,
  UserCheck,
  Check,
  TrendingUp,
  Download,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { Submission, Grade } from '../../../types/database.types';
import { parseSubmissionNotes } from '../../../utils/submissionParser';

export const AdminGrading: React.FC = () => {
  const { submissions, students, assignments, classes, subjects, grades, gradeSubmission } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'recap'>('queue');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputScore, setInputScore] = useState<number>(85);
  const [inputFeedback, setInputFeedback] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const student = students.find(s => s.id === sub.student_id);
    const asg = assignments.find(a => a.id === sub.assignment_id);
    return (
      (student?.profile?.full_name || '').toLowerCase().includes(q) ||
      (student?.nis_nisn || '').toLowerCase().includes(q) ||
      (asg?.title || '').toLowerCase().includes(q)
    );
  });

  const handleOpenGradeModal = (sub: Submission) => {
    setSelectedSubmission(sub);
    setInputScore(sub.total_score || 85);
    setInputFeedback(sub.teacher_feedback || 'Kerja bagus! Terus tingkatkan pemahaman Anda.');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    await gradeSubmission(selectedSubmission.id, Number(inputScore), inputFeedback);
    setSelectedSubmission(null);
    showNotif('Nilai & Feedback berhasil disimpan dan dipublikasikan ke siswa!');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Sistem Penilaian & Rekap Nilai</h3>
          <p className="text-xs text-slate-500 font-medium">
            Penilaian otomatis untuk kuis obyektif dan penilaian manual komprehensif untuk esai & tugas
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200/80 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'queue'
                ? 'bg-[#3b5bf5] text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Antrean Penilaian ({submissions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('recap')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'recap'
                ? 'bg-[#3b5bf5] text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buku Rekap Nilai ({grades.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari siswa, NIS, atau judul tugas..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
          />
        </div>
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            Hapus Pencarian
          </button>
        )}
      </div>

      {activeSubTab === 'queue' ? (
        /* Antrean Penilaian */
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 shadow-sm text-xs font-medium text-slate-400 space-y-2">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">
                {searchTerm ? `Tidak ditemukan antrean tugas yang cocok dengan "${searchTerm}"` : 'Tidak ada antrean tugas yang perlu dinilai.'}
              </p>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="mt-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          ) : (
            filteredSubmissions.map((sub) => {
            const student = students.find(s => s.id === sub.student_id);
            const asg = assignments.find(a => a.id === sub.assignment_id);

            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-[#3b5bf5]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={student?.profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${student?.nis_nisn}`}
                    alt=""
                    className="w-12 h-12 rounded-2xl bg-slate-100 object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-slate-900 text-base">{student?.profile?.full_name}</span>
                      <span className="text-xs text-slate-400 font-mono font-medium">({student?.nis_nisn})</span>
                    </div>
                    <p className="text-xs text-[#3b5bf5] font-bold">{asg?.title}</p>
                    {(() => {
                      const parsed = parseSubmissionNotes(sub.student_notes);
                      return (
                        <div className="space-y-1.5 mt-1.5">
                          {parsed.figmaUrl && (
                            <a
                              href={parsed.figmaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-[11px] font-bold border border-purple-200/80 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 text-purple-600" />
                              <span>Lihat Desain Figma</span>
                            </a>
                          )}
                          {parsed.hasQuizAnswers && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {parsed.totalAnswers} Butir Jawaban Kuis Tersimpan
                            </span>
                          )}
                          {parsed.cleanNotes && (
                            <p className="text-xs text-slate-500 italic max-w-xl font-medium">
                              &quot;{parsed.cleanNotes}&quot;
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">Skor Saat Ini</p>
                    <p className="text-xl font-extrabold text-slate-900">
                      {sub.total_score !== null ? `${sub.total_score} / 100` : '—'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenGradeModal(sub)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{sub.status === 'graded' ? 'Ubah Nilai' : 'Beri Nilai & Review'}</span>
                  </button>
                </div>
              </div>
            );
          }))}
        </div>
      ) : (
        /* Buku Rekap Nilai */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-5">Nama Siswa</th>
                  <th className="py-4 px-5">Kelas</th>
                  <th className="py-4 px-5">Tugas / Kuis</th>
                  <th className="py-4 px-5">Nilai</th>
                  <th className="py-4 px-5">Status Publikasi</th>
                  <th className="py-4 px-5">Catatan Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                      Belum ada nilai yang dipublikasikan.
                    </td>
                  </tr>
                ) : (
                  grades.map((gr) => {
                    const student = students.find(s => s.id === gr.student_id);
                    const asg = assignments.find(a => a.id === gr.assignment_id);
                    const cls = classes.find(c => c.id === student?.class_id);

                    return (
                      <tr key={gr.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-900">
                          {student?.profile?.full_name}
                        </td>
                        <td className="py-4 px-5 text-slate-600 font-medium">
                          {cls?.name}
                        </td>
                        <td className="py-4 px-5 text-slate-800 font-semibold">
                          {asg?.title}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                            gr.score >= 80 ? 'bg-[#1cd485]/15 text-[#0fa868]' :
                            gr.score >= 70 ? 'bg-blue-50 text-[#3b5bf5]' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {gr.score} / {gr.max_score}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1cd485]/15 text-[#0fa868] font-bold">
                            Dipublikasikan
                          </span>
                        </td>
                        <td className="py-4 px-5 text-slate-500 max-w-xs truncate font-medium">
                          {gr.feedback || '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Input / Edit Nilai & Komentar */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#3b5bf5]" />
                Form Penilaian Guru
              </h4>
              <button onClick={() => setSelectedSubmission(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              {(() => {
                const parsed = parseSubmissionNotes(selectedSubmission.student_notes);
                return (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Hasil Tugas yang Dikumpulkan Siswa:
                    </span>
                    {parsed.figmaUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-purple-700 font-bold">🎨 Proyek Figma Siswa</span>
                        <a
                          href={parsed.figmaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-700"
                        >
                          <span>Buka di Figma</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {parsed.hasQuizAnswers && (
                      <p className="text-emerald-700 font-semibold">
                        ✓ {parsed.totalAnswers} Butir Jawaban Kuis telah tersimpan di sistem
                      </p>
                    )}
                    {parsed.cleanNotes && (
                      <p className="text-slate-600 italic">
                        &quot;{parsed.cleanNotes}&quot;
                      </p>
                    )}
                  </div>
                );
              })()}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Input Nilai Akhir (Skala 0 - 100) *
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={inputScore}
                  onChange={(e) => setInputScore(Number(e.target.value))}
                  className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-2xl font-extrabold text-[#3b5bf5] focus:outline-none focus:border-[#3b5bf5] focus:bg-white text-center shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ulasan / Catatan untuk Siswa *
                </label>
                <textarea
                  rows={4}
                  required
                  value={inputFeedback}
                  onChange={(e) => setInputFeedback(e.target.value)}
                  placeholder="Berikan saran membangun atau apresiasi atas jawaban siswa..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  Publikasikan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
