import React from 'react';
import { History, CheckCircle2, Clock, FileText, Award } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';

export const StudentHistory: React.FC = () => {
  const { currentStudent } = useAuth();
  const { submissions, assignments, subjects } = useData();

  const mySubmissions = submissions.filter(s => s.student_id === currentStudent?.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Riwayat Pengumpulan & Pengerjaan</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Daftar seluruh kuis dan tugas yang telah Anda kumpulkan ke guru pengajar
        </p>
      </div>

      <div className="space-y-4">
        {mySubmissions.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-3xl border border-slate-200/80 shadow-sm text-xs">
            Belum ada riwayat pengerjaan tugas atau kuis.
          </div>
        ) : (
          mySubmissions.map((sub) => {
            const asg = assignments.find(a => a.id === sub.assignment_id);
            const subject = subjects.find(s => s.id === asg?.subject_id);

            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3.5 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {subject?.name || 'Umum'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Dikirim: {new Date(sub.submitted_at || sub.started_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                    sub.status === 'graded'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {sub.status === 'graded' ? 'Sudah Dinilai' : 'Menunggu Koreksi'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{asg?.title || 'Tugas Siswa'}</h4>

                {sub.student_notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 italic">
                    Catatan Anda: &quot;{sub.student_notes}&quot;
                  </p>
                )}

                {sub.teacher_feedback && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs">
                    <span className="font-semibold text-blue-900">Catatan Guru: </span>
                    <span className="text-blue-800">{sub.teacher_feedback}</span>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span>Hasil Akhir:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {sub.total_score !== null ? `${sub.total_score} / 100 Poin` : 'Sedang Diperiksa'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
