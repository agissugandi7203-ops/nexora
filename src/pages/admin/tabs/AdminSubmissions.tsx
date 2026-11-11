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
  AlertCircle
} from 'lucide-react';
import { useData } from '../../../context/DataContext';

export const AdminSubmissions: React.FC = () => {
  const { submissions, students, assignments } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = submissions.filter((sub) => {
    const student = students.find(s => s.id === sub.student_id);
    const asg = assignments.find(a => a.id === sub.assignment_id);

    const matchSearch =
      student?.profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asg?.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Daftar Pengumpulan Jawaban</h3>
          <p className="text-xs text-slate-500 font-medium">
            Pantau jawaban kuis dan berkas tugas yang dikirim oleh siswa secara teratur
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
            placeholder="Cari nama siswa atau judul tugas..."
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
            <option value="all">Semua Status</option>
            <option value="submitted">Menunggu Koreksi</option>
            <option value="graded">Sudah Dinilai</option>
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
                <th className="py-4 px-5">Catatan Siswa / Berkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                    Belum ada pengumpulan jawaban yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const student = students.find(s => s.id === sub.student_id);
                  const asg = assignments.find(a => a.id === sub.assignment_id);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={student?.profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${student?.nis_nisn}`}
                            alt=""
                            className="w-8 h-8 rounded-full bg-slate-100 object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{student?.profile?.full_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono font-medium">{student?.nis_nisn}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-800">{asg?.title}</p>
                        <p className="text-[10px] text-[#3b5bf5] font-semibold">{asg?.type === 'quiz' ? 'Kuis Interaktif' : 'Unggah Tugas'}</p>
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
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600">
                            Menunggu Koreksi
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <p className="text-slate-600 italic line-clamp-1 font-medium">
                          {sub.student_notes || 'Tidak ada catatan tambahan.'}
                        </p>
                        {sub.file_urls && sub.file_urls.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-[#3b5bf5] text-[10px] font-bold">
                            <FileText className="w-3 h-3" />
                            <span>{sub.file_urls.length} Berkas Terlampir</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
