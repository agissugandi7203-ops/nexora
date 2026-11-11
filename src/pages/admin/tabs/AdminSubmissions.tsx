import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  Clock,
  FileText,
  User,
  Search,
  ExternalLink,
  Award,
  AlertCircle,
  Eye,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { parseSubmissionNotes } from '../../../utils/submissionParser';
import { Submission } from '../../../types/database.types';

export const AdminSubmissions: React.FC = () => {
  const { submissions, students, assignments, questions } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inspectSubmission, setInspectSubmission] = useState<Submission | null>(null);

  const filtered = submissions.filter((sub) => {
    const student = students.find((s) => s.id === sub.student_id);
    const asg = assignments.find((a) => a.id === sub.assignment_id);
    const q = searchTerm.trim().toLowerCase();
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    if (!q) return matchStatus;

    const matchSearch =
      (student?.profile?.full_name || '').toLowerCase().includes(q) ||
      (student?.nis_nisn || '').toLowerCase().includes(q) ||
      (asg?.title || '').toLowerCase().includes(q);

    return matchSearch && matchStatus;
  });

  const inspectStudent = inspectSubmission
    ? students.find((s) => s.id === inspectSubmission.student_id)
    : null;
  const inspectAssignment = inspectSubmission
    ? assignments.find((a) => a.id === inspectSubmission.assignment_id)
    : null;
  const inspectParsed = inspectSubmission
    ? parseSubmissionNotes(inspectSubmission.student_notes)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Daftar Pengumpulan Jawaban</h3>
          <p className="text-xs text-slate-500 font-medium">
            Pantau jawaban kuis, tautan proyek Figma, dan berkas tugas yang dikirim oleh siswa
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa, NIS, atau judul tugas..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
          >
            <option value="all">Semua Status ({submissions.length})</option>
            <option value="submitted">
              Menunggu Koreksi ({submissions.filter((s) => s.status === 'submitted').length})
            </option>
            <option value="graded">
              Sudah Dinilai ({submissions.filter((s) => s.status === 'graded').length})
            </option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-5">Siswa</th>
                <th className="py-4 px-5">Tugas / Kuis</th>
                <th className="py-4 px-5">Waktu Dikirim</th>
                <th className="py-4 px-5">Status & Nilai</th>
                <th className="py-4 px-5">Jawaban & Berkas (Terparafrase)</th>
                <th className="py-4 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                    Belum ada pengumpulan jawaban yang sesuai dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const student = students.find((s) => s.id === sub.student_id);
                  const asg = assignments.find((a) => a.id === sub.assignment_id);
                  const parsed = parseSubmissionNotes(sub.student_notes);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              student?.profile?.avatar_url ||
                              `https://api.dicebear.com/7.x/bottts/svg?seed=${student?.nis_nisn}`
                            }
                            alt=""
                            className="w-8 h-8 rounded-full bg-slate-100 object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{student?.profile?.full_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono font-medium">
                              {student?.nis_nisn}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-800">{asg?.title}</p>
                        <p className="text-[10px] text-[#3b5bf5] font-semibold">
                          {asg?.type === 'quiz' ? 'Kuis Interaktif' : 'Unggah Tugas'}
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        <span className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(sub.submitted_at || sub.started_at).toLocaleDateString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        {sub.status === 'graded' ? (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#1cd485]/15 text-[#0fa868]">
                              {sub.total_score} / 100
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">Selesai Dinilai</span>
                          </div>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                            Menunggu Koreksi
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 max-w-xs">
                        {/* Paraphrased human-readable display */}
                        <div className="space-y-1.5">
                          {parsed.figmaUrl && (
                            <a
                              href={parsed.figmaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-[11px] font-bold border border-purple-200/80 transition-colors"
                              title={parsed.figmaUrl}
                            >
                              <ExternalLink className="w-3 h-3 text-purple-600" />
                              <span>Buka Desain Figma</span>
                            </a>
                          )}

                          {parsed.hasQuizAnswers && (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>{parsed.totalAnswers} Butir Jawaban Kuis Tersimpan</span>
                            </div>
                          )}

                          {parsed.cleanNotes ? (
                            <p className="text-slate-600 italic text-[11px] line-clamp-1 font-medium">
                              &ldquo;{parsed.cleanNotes}&rdquo;
                            </p>
                          ) : !parsed.figmaUrl && !parsed.hasQuizAnswers ? (
                            <span className="text-slate-400 italic text-[11px]">
                              Tugas dikumpulkan tanpa catatan.
                            </span>
                          ) : null}

                          {sub.file_urls && sub.file_urls.length > 0 && (
                            <div className="flex items-center gap-1 text-[#3b5bf5] text-[10px] font-bold">
                              <FileText className="w-3 h-3" />
                              <span>{sub.file_urls.length} Berkas Dokumen Terlampir</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectSubmission(sub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#3b5bf5] font-semibold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Inspection Modal (Formatted & Paraphrased) */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200/90 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <img
                  src={
                    inspectStudent?.profile?.avatar_url ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${inspectStudent?.nis_nisn}`
                  }
                  alt=""
                  className="w-10 h-10 rounded-2xl bg-slate-100 object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {inspectStudent?.profile?.full_name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    NIS: {inspectStudent?.nis_nisn} &bull; {inspectAssignment?.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectSubmission(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Score & Status Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Status Pengumpulan
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {inspectSubmission.status === 'graded' ? 'Sudah Dinilai' : 'Menunggu Koreksi'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Total Nilai
                  </span>
                  <span className="text-xl font-extrabold text-[#3b5bf5]">
                    {inspectSubmission.total_score !== null
                      ? `${inspectSubmission.total_score} / 100`
                      : 'Belum Dinilai'}
                  </span>
                </div>
              </div>

              {/* Figma Link Preview */}
              {inspectParsed?.figmaUrl && (
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                        <span>🎨</span> Link Desain Figma Siswa
                      </p>
                      <p className="text-[11px] text-purple-700 mt-0.5 truncate max-w-md">
                        {inspectParsed.figmaUrl}
                      </p>
                    </div>
                    <a
                      href={inspectParsed.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Buka Desain</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Clean Student Notes */}
              {inspectParsed?.cleanNotes && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                    Catatan Pengumpulan dari Siswa
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    &ldquo;{inspectParsed.cleanNotes}&rdquo;
                  </p>
                </div>
              )}

              {/* Paraphrased Quiz Answers Breakdown */}
              {inspectParsed?.hasQuizAnswers && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900 text-xs">
                      Rincian Jawaban Kuis ({inspectParsed.totalAnswers} Butir Terjawab)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Tersimpan di Sistem
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {inspectParsed.answers.map((ans, idx) => {
                      const matchedQ = questions.find((q) => q.id === ans.question_id);
                      return (
                        <div
                          key={ans.id || idx}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block">
                              Soal #{idx + 1}
                            </span>
                            <p className="font-semibold text-slate-800 text-xs">
                              {matchedQ?.question_text || 'Pertanyaan Kuis'}
                            </p>
                          </div>
                          {ans.score !== null && ans.score !== undefined && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#3b5bf5] border border-blue-200 shrink-0">
                              +{ans.score} Poin
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Teacher Feedback */}
              {inspectSubmission.teacher_feedback && (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                  <span className="text-[10px] text-blue-700 uppercase font-bold tracking-wider block mb-1">
                    Masukan / Catatan Guru
                  </span>
                  <p className="text-xs text-blue-900 font-medium">
                    {inspectSubmission.teacher_feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end mt-5">
              <button
                type="button"
                onClick={() => setInspectSubmission(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
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
