import React, { useState, useEffect, useRef } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  ArrowRight,
  Check,
  Send,
  X,
  Layers,
  Lock,
  Eye,
  ShieldAlert,
  School,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { Assignment, Question } from '../../../types/database.types';

export const StudentAssignments: React.FC = () => {
  const { currentStudent } = useAuth();
  const { assignments, questions, subjects, classes, submissions, submitAssignment } = useData();

  const [activeWorkingAsg, setActiveWorkingAsg] = useState<Assignment | null>(null);
  const [previewOnlyAsg, setPreviewOnlyAsg] = useState<Assignment | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterScope, setFilterScope] = useState<'my_class' | 'all'>('my_class');
  const [answers, setAnswers] = useState<Record<string, { selected_option_id?: string; answer_text?: string }>>({});
  const [studentNotes, setStudentNotes] = useState('');
  const [fileInputUrl, setFileInputUrl] = useState('');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const studentClass = classes.find(c => c.id === currentStudent?.class_id);
  const handleFinalSubmitRef = useRef<() => void>(() => {});

  // Helper: Ambil daftar ID kelas yang diizinkan untuk suatu Tugas / Ujian
  const getAllowedClassIds = (asg: Assignment): string[] => {
    if (Array.isArray(asg.class_ids) && asg.class_ids.length > 0) {
      return asg.class_ids;
    }
    if (asg.class_id) {
      return [asg.class_id];
    }
    const sub = subjects.find(s => s.id === asg.subject_id);
    if (sub?.class_ids && sub.class_ids.length > 0) {
      return sub.class_ids;
    }
    return [];
  };

  // Helper: Cek apakah siswa saat ini diizinkan mengerjakan tugas/ujian tersebut
  const isAssignmentAllowedForStudent = (asg: Assignment): boolean => {
    const allowedIds = getAllowedClassIds(asg);
    if (allowedIds.length === 0) return true;
    if (!currentStudent?.class_id) return false;
    return allowedIds.includes(currentStudent.class_id);
  };

  const getAllowedClassNames = (asg: Assignment): string => {
    const allowedIds = getAllowedClassIds(asg);
    if (allowedIds.length === 0) return 'Semua Kelas';
    const matched = classes.filter(c => allowedIds.includes(c.id));
    return matched.length > 0 ? matched.map(c => c.name).join(', ') : 'Kelas Tertentu';
  };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Timer countdown effect
  useEffect(() => {
    handleFinalSubmitRef.current = handleFinalSubmit;
  });

  useEffect(() => {
    if (!activeWorkingAsg || activeWorkingAsg.type !== 'quiz' || !activeWorkingAsg.duration_minutes) return;

    setTimeLeftSeconds(activeWorkingAsg.duration_minutes * 60);

    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            handleFinalSubmitRef.current();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkingAsg]);

  const studentSubmissions = submissions.filter(s => s.student_id === currentStudent?.id);
  const submittedMap: Record<string, boolean> = {};
  studentSubmissions.forEach(s => {
    submittedMap[s.assignment_id] = true;
  });

  const availableAssignments = assignments.filter(a => {
    if (a.is_active === false) return false;

    if (filterScope === 'my_class') {
      return isAssignmentAllowedForStudent(a);
    }

    return true;
  });

  const pendingCount = availableAssignments.filter(a => !submittedMap[a.id] && isAssignmentAllowedForStudent(a)).length;
  const completedCount = availableAssignments.filter(a => submittedMap[a.id]).length;

  const displayedAssignments = availableAssignments.filter(a => {
    if (filterStatus === 'pending') return !submittedMap[a.id];
    if (filterStatus === 'completed') return submittedMap[a.id];
    return true;
  });

  const handleStartAssignment = (asg: Assignment) => {
    if (!isAssignmentAllowedForStudent(asg)) {
      setPreviewOnlyAsg(asg);
      return;
    }
    if (submittedMap[asg.id]) {
      alert('Anda telah mengumpulkan tugas ini sebelumnya!');
      return;
    }
    setActiveWorkingAsg(asg);
    setAnswers({});
    setStudentNotes('');
    setFileInputUrl('');
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], selected_option_id: optionId }
    }));
  };

  const handleTextAnswer = (questionId: string, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], answer_text: text }
    }));
  };

  const handleFinalSubmit = async () => {
    if (!activeWorkingAsg || !currentStudent) return;
    setIsSubmitting(true);

    try {
      const res = await submitAssignment(
        activeWorkingAsg.id,
        currentStudent.id,
        answers,
        studentNotes,
        fileInputUrl ? [fileInputUrl] : undefined
      );

      if (res && !res.success) {
        alert('Terjadi kesalahan saat mengirim jawaban: ' + (res.error || 'Silakan coba lagi.'));
        return;
      }

      setActiveWorkingAsg(null);
      showNotif(`Berhasil! Jawaban untuk "${activeWorkingAsg.title}" telah tersimpan.`);
    } catch (err: any) {
      alert('Terjadi kesalahan saat mengirim jawaban.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const activeQuestions: Question[] = activeWorkingAsg
    ? (activeWorkingAsg.question_ids && activeWorkingAsg.question_ids.length > 0
        ? questions.filter(q => activeWorkingAsg.question_ids!.includes(q.id))
        : questions.filter(q => q.subject_id === activeWorkingAsg.subject_id)
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-extrabold text-slate-900">Daftar Tugas dan Ujian Kelas</h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#3b5bf5]">
              {studentClass ? studentClass.name : 'Semua Kelas'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Kerjakan kuis interaktif berwaktu atau kumpulkan lembar tugas mandiri
          </p>
        </div>

        {/* Scope Selector: Kelas Saya vs Semua Kelas */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white border border-slate-200/80 p-1.5 rounded-2xl shadow-sm text-xs">
          <button
            type="button"
            onClick={() => setFilterScope('my_class')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filterScope === 'my_class'
                ? 'bg-[#3b5bf5] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kelas Saya ({studentClass?.name || 'Terkait'})
          </button>
          <button
            type="button"
            onClick={() => setFilterScope('all')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filterScope === 'all'
                ? 'bg-[#3b5bf5] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Tugas ({assignments.length})
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 text-xs">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            filterStatus === 'all'
              ? 'bg-[#3b5bf5] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Semua ({availableAssignments.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('pending')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            filterStatus === 'pending'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Belum Dikerjakan ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('completed')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            filterStatus === 'completed'
              ? 'bg-[#1cd485] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Sudah Selesai ({completedCount})
        </button>
      </div>

      {/* Grid of assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedAssignments.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#3b5bf5] flex items-center justify-center mx-auto">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Tidak Ada Tugas atau Ujian</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {assignments.length > 0 && filterScope === 'my_class'
                ? `Terdapat ${assignments.length} tugas di sistem, namun ditargetkan ke kelas lain. Kelas Anda saat ini: ${studentClass?.name || 'Belum Terdaftar'}.`
                : assignments.length === 0
                ? 'Belum ada tugas atau ujian yang dipublikasikan oleh guru pengajar saat ini.'
                : 'Tidak ada tugas yang sesuai dengan filter yang Anda pilih.'}
            </p>
            {assignments.length > 0 && filterScope === 'my_class' && (
              <button
                type="button"
                onClick={() => setFilterScope('all')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-[#3b5bf5] border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tampilkan Semua Tugas ({assignments.length} Tugas Lintas Kelas)</span>
              </button>
            )}
          </div>
        ) : (
          displayedAssignments.map((asg) => {
            const subject = subjects.find(s => s.id === asg.subject_id);
            const allowedClassNames = getAllowedClassNames(asg);
            const isAllowed = isAssignmentAllowedForStudent(asg);
            const isSubmitted = submittedMap[asg.id];
            const sub = studentSubmissions.find(s => s.assignment_id === asg.id);

            return (
              <div
                key={asg.id}
                className={`rounded-3xl p-6 border flex flex-col justify-between transition-all shadow-sm ${
                  !isAllowed
                    ? 'bg-slate-50/90 border-slate-200/90 opacity-90'
                    : isSubmitted
                    ? 'bg-white border-emerald-200 hover:shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-[#3b5bf5]/50 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        asg.type === 'quiz'
                          ? 'bg-blue-50 text-[#3b5bf5]'
                          : 'bg-emerald-50 text-[#0fa868]'
                      }`}>
                        {asg.type === 'quiz' ? 'Kuis Interaktif' : 'Pengumpulan Tugas'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                        isAllowed ? 'bg-slate-100 text-slate-700' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <School className="w-3 h-3" />
                        {allowedClassNames}
                      </span>
                    </div>

                    {!isAllowed ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200/80 text-slate-700 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-600" /> Terkunci (Kelas Lain)
                      </span>
                    ) : isSubmitted ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1cd485]/15 text-[#0fa868] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Sudah Dikumpulkan
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
                        Wajib Dikerjakan
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 mb-1.5 flex items-center gap-2">
                    {!isAllowed && <Lock className="w-4 h-4 text-slate-400 shrink-0" />}
                    <span>{asg.title}</span>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {asg.description || 'Tidak ada deskripsi tambahan.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-t border-slate-100 text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Mata Pelajaran</span>
                      <span className="font-bold text-slate-800">{subject?.name || 'Umum'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Durasi Pengerjaan</span>
                      <span className="font-bold text-slate-800">
                        {asg.duration_minutes ? `${asg.duration_minutes} Menit` : 'Tanpa Batasan'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {!isAllowed ? (
                    <span className="text-[11px] text-rose-600 flex items-center gap-1 font-bold">
                      <Lock className="w-3.5 h-3.5 shrink-0" /> Khusus {allowedClassNames}
                    </span>
                  ) : isSubmitted ? (
                    <div className="text-xs text-slate-500 font-medium">
                      Nilai: <strong className="text-slate-900 font-bold">{sub && sub.total_score !== null ? `${sub.total_score} Poin` : 'Menunggu Koreksi Guru'}</strong>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-600 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" /> Siap Dikerjakan
                    </span>
                  )}

                  {!isAllowed ? (
                    <button
                      type="button"
                      onClick={() => setPreviewOnlyAsg(asg)}
                      className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 transition-all shrink-0"
                      title="Hanya dapat melihat informasi tugas karena dikhususkan untuk kelas lain"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Saja (Terkunci)</span>
                    </button>
                  ) : (
                    <button
                      disabled={isSubmitted || !asg.is_active}
                      onClick={() => handleStartAssignment(asg)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                        isSubmitted
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-[#3b5bf5] hover:bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      }`}
                    >
                      <span>{isSubmitted ? 'Tuntas' : 'Mulai Kerjakan'}</span>
                      {!isSubmitted && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Mode Lihat Saja (Terkunci untuk Kelas Lain) */}
      {previewOnlyAsg && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-extrabold mb-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Mode Hanya Lihat &bull; Ujian Terkunci</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{previewOnlyAsg.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOnlyAsg(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 leading-relaxed">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-rose-900 mb-0.5">Akses Pengerjaan Dibatasi</p>
                <p>
                  Tugas/Ujian ini dikhususkan untuk kelas <strong>{getAllowedClassNames(previewOnlyAsg)}</strong>. Kelas Anda saat ini (<strong>{studentClass?.name || 'Kelas Lain'}</strong>) hanya dapat melihat informasi ringkas tugas ini dan tidak diizinkan membuka soal atau mengirimkan jawaban.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Mata Pelajaran</span>
                <span className="font-extrabold text-slate-800">
                  {subjects.find(s => s.id === previewOnlyAsg.subject_id)?.name || 'Umum'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Kelas yang Diizinkan</span>
                <span className="font-extrabold text-[#3b5bf5]">
                  {getAllowedClassNames(previewOnlyAsg)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Tipe & Durasi</span>
                <span className="font-bold text-slate-800">
                  {previewOnlyAsg.type === 'quiz' ? 'Kuis Interaktif' : 'Pengumpulan Tugas'} &bull;{' '}
                  {previewOnlyAsg.duration_minutes ? `${previewOnlyAsg.duration_minutes} Menit` : 'Tanpa Timer'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Bobot Maksimal</span>
                <span className="font-bold text-slate-800">{previewOnlyAsg.total_points} Poin</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h5 className="text-xs font-extrabold text-slate-700">Deskripsi / Petunjuk Tugas:</h5>
              <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 leading-relaxed">
                {previewOnlyAsg.description || 'Tidak ada deskripsi tambahan.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2 font-semibold">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Lembar butir soal dan formulir pengumpulan dikunci untuk kelas Anda.</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewOnlyAsg(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
              >
                Tutup Mode Lihat Saja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Exam/Quiz Modal Runner */}
      {activeWorkingAsg && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[95vh] flex flex-col">
            {/* Exam Runner Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 shrink-0">
              <div>
                <span className="text-xs font-extrabold text-[#3b5bf5] uppercase tracking-wider">
                  {subjects.find(s => s.id === activeWorkingAsg.subject_id)?.name} &bull; {activeWorkingAsg.type === 'quiz' ? 'Lembar Kuis' : 'Lembar Tugas'}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{activeWorkingAsg.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Timer Pill if Quiz */}
                {activeWorkingAsg.type === 'quiz' && activeWorkingAsg.duration_minutes && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-mono font-bold text-sm">
                    <Clock className="w-4 h-4 animate-spin text-amber-600" />
                    <span>Sisa: {formatTimer(timeLeftSeconds)}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveWorkingAsg(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                  title="Tutup Lembar Pengerjaan"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Exam Runner Body */}
            <div className="overflow-y-auto flex-1 pr-2 space-y-6">
              {activeWorkingAsg.type === 'quiz' ? (
                /* Questions List */
                activeQuestions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Belum ada butir soal yang dihubungkan ke kuis ini.
                  </div>
                ) : (
                  activeQuestions.map((q, index) => (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-blue-50 text-[#3b5bf5]">
                          Soal Nomor {index + 1} &bull; {q.points} Poin
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          {q.question_type === 'multiple_choice' && 'Pilihan Ganda'}
                          {q.question_type === 'true_false' && 'Benar / Salah'}
                          {q.question_type === 'short_answer' && 'Isian Singkat'}
                          {q.question_type === 'essay' && 'Esai'}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-slate-900 leading-relaxed">
                        {q.question_text}
                      </p>

                      {/* Multiple choice options */}
                      {q.question_type === 'multiple_choice' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options?.map((opt, i) => {
                            const isSelected = answers[q.id]?.selected_option_id === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleSelectOption(q.id, opt.id)}
                                className={`p-3.5 rounded-xl border text-xs text-left flex items-center justify-between transition-all ${
                                  isSelected
                                    ? 'bg-[#3b5bf5] text-white border-[#3b5bf5] shadow-md shadow-blue-500/25 font-bold'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                                }`}
                              >
                                <span>
                                  <strong className="mr-2">{String.fromCharCode(65 + i)}.</strong>
                                  {opt.option_text}
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* True / False */}
                      {q.question_type === 'true_false' && (
                        <div className="flex gap-3">
                          {q.options?.map((opt) => {
                            const isSelected = answers[q.id]?.selected_option_id === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleSelectOption(q.id, opt.id)}
                                className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                  isSelected
                                    ? 'bg-[#3b5bf5] text-white border-[#3b5bf5] shadow-md shadow-blue-500/25'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                {opt.option_text}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Short Answer */}
                      {q.question_type === 'short_answer' && (
                        <div>
                          <input
                            type="text"
                            placeholder="Tuliskan jawaban singkat Anda di sini..."
                            value={answers[q.id]?.answer_text || ''}
                            onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] font-mono"
                          />
                        </div>
                      )}

                      {/* Essay */}
                      {q.question_type === 'essay' && (
                        <div>
                          <textarea
                            rows={4}
                            placeholder="Tuliskan penjelasan dan pemaparan jawaban Anda secara lengkap..."
                            value={answers[q.id]?.answer_text || ''}
                            onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )
              ) : (
                /* Upload Tugas Area */
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">Petunjuk Tugas</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {activeWorkingAsg.description || 'Kumpulkan hasil kerja Anda dalam format tautan PDF atau tuliskan uraian jawaban di bawah ini.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Catatan / Teks Jawaban Anda
                    </label>
                    <textarea
                      rows={5}
                      value={studentNotes}
                      onChange={(e) => setStudentNotes(e.target.value)}
                      placeholder="Tuliskan uraian hasil kerja tugas Anda di sini..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      URL Lampiran Berkas Tugas (Google Drive / Cloud / PDF / Gambar)
                    </label>
                    <input
                      type="url"
                      value={fileInputUrl}
                      onChange={(e) => setFileInputUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/... atau link dokumen Anda"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Exam Runner Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setActiveWorkingAsg(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Batal / Simpan Sementara
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Mengirim Jawaban...' : 'Kumpulkan Jawaban'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
