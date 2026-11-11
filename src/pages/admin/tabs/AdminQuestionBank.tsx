import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  X,
  Filter,
  Check,
  FolderKanban,
  Tag,
  Search,
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { Question, QuestionType, QuestionDifficulty } from '../../../types/database.types';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export interface QuestionFormOption {
  id: string;
  option_key?: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export interface QuestionFormData {
  subject_id: string;
  class_id: string;
  category_name: string;
  question_text: string;
  question_type: QuestionType;
  points: number;
  difficulty: QuestionDifficulty;
  explanation: string;
  short_answer_key: string;
  options: QuestionFormOption[];
}

const PRESET_CATEGORIES = [
  'Tugas 1',
  'Tugas 2',
  'Tugas 3',
  'Kuis 1',
  'Kuis 2',
  'Ulangan Harian 1',
  'UTS',
  'UAS',
];

export const AdminQuestionBank: React.FC = () => {
  const { questions, subjects, classes, addQuestion, updateQuestion, deleteQuestion, duplicateQuestion } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editFormData, setEditFormData] = useState<QuestionFormData | null>(null);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [notification, setNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  // Kumpulkan seluruh daftar nama Paket / Kategori unik yang sudah ada di Bank Soal
  const existingCategories = Array.from(
    new Set(
      questions
        .filter(q => selectedSubjectFilter === 'all' || q.subject_id === selectedSubjectFilter)
        .map(q => (q.category_name || 'Umum').trim())
        .filter(Boolean)
    )
  );

  const quickCategoryOptions = Array.from(new Set([...existingCategories, ...PRESET_CATEGORIES]));

  // Form state
  const [formData, setFormData] = useState<QuestionFormData>({
    subject_id: subjects[0]?.id || '',
    class_id: classes[0]?.id || '',
    category_name: 'Tugas 1',
    question_text: '',
    question_type: 'multiple_choice',
    points: 10,
    difficulty: 'medium',
    explanation: '',
    short_answer_key: '',
    options: [
      { id: '1', option_key: 'A', option_text: 'Pilihan A', is_correct: true, order_index: 1 },
      { id: '2', option_key: 'B', option_text: 'Pilihan B', is_correct: false, order_index: 2 },
      { id: '3', option_key: 'C', option_text: 'Pilihan C', is_correct: false, order_index: 3 },
      { id: '4', option_key: 'D', option_text: 'Pilihan D', is_correct: false, order_index: 4 },
    ]
  });

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddOption = () => {
    if (formData.options.length >= 5) {
      alert('Maksimal 5 pilihan jawaban');
      return;
    }
    const nextOrder = formData.options.length + 1;
    setFormData({
      ...formData,
      options: [
        ...formData.options,
        {
          id: String(Date.now()),
          option_key: String.fromCharCode(64 + nextOrder),
          option_text: `Pilihan ${String.fromCharCode(64 + nextOrder)}`,
          is_correct: false,
          order_index: nextOrder,
        }
      ]
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) {
      alert('Minimal 2 pilihan jawaban');
      return;
    }
    const updated = formData.options.filter((_, i) => i !== index);
    const hasCorrect = updated.some(o => o.is_correct);
    if (!hasCorrect && updated.length > 0) {
      updated[0].is_correct = true;
    }
    setFormData({ ...formData, options: updated });
  };

  const setCorrectOption = (index: number) => {
    const updated = formData.options.map((opt, i) => ({
      ...opt,
      is_correct: i === index,
    }));
    setFormData({ ...formData, options: updated });
  };

  const handleOpenAddModal = () => {
    if (subjects.length === 0) {
      alert('Belum ada Mata Pelajaran. Silakan buat mata pelajaran terlebih dahulu di menu Mata Pelajaran.');
      return;
    }
    const defaultSubId = (selectedSubjectFilter !== 'all' ? selectedSubjectFilter : subjects[0]?.id) || subjects[0]?.id || '';
    const defaultCategory = selectedCategoryFilter !== 'all'
      ? selectedCategoryFilter
      : (formData.category_name || 'Tugas 1');
    setFormData({
      subject_id: defaultSubId,
      class_id: classes[0]?.id || '',
      category_name: defaultCategory,
      question_text: '',
      question_type: 'multiple_choice',
      points: 10,
      difficulty: 'medium',
      explanation: '',
      short_answer_key: '',
      options: [
        { id: '1', option_key: 'A', option_text: 'Pilihan A', is_correct: true, order_index: 1 },
        { id: '2', option_key: 'B', option_text: 'Pilihan B', is_correct: false, order_index: 2 },
        { id: '3', option_key: 'C', option_text: 'Pilihan C', is_correct: false, order_index: 3 },
        { id: '4', option_key: 'D', option_text: 'Pilihan D', is_correct: false, order_index: 4 },
      ]
    });
    setIsAddModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveSubjectId = formData.subject_id || (selectedSubjectFilter !== 'all' ? selectedSubjectFilter : subjects[0]?.id) || subjects[0]?.id || '';

    if (!formData.question_text.trim()) {
      alert('Teks soal wajib diisi!');
      return;
    }
    if (!effectiveSubjectId) {
      alert('Pilih mata pelajaran terlebih dahulu!');
      return;
    }

    let finalOptions = formData.options;
    if (formData.question_type === 'true_false') {
      finalOptions = [
        { id: 'tf_1', option_key: 'A', option_text: 'Benar', is_correct: formData.options[0]?.is_correct ?? true, order_index: 1 },
        { id: 'tf_2', option_key: 'B', option_text: 'Salah', is_correct: !(formData.options[0]?.is_correct ?? true), order_index: 2 },
      ];
    } else if (formData.question_type === 'short_answer' || formData.question_type === 'essay') {
      finalOptions = [];
    } else if (formData.question_type === 'multiple_choice') {
      finalOptions = formData.options.map((opt, idx) => ({
        ...opt,
        option_key: opt.option_key || String.fromCharCode(65 + idx),
        order_index: idx + 1,
      }));
    }

    const res = await addQuestion({
      subject_id: effectiveSubjectId,
      class_id: formData.class_id || null,
      category_name: (formData.category_name || 'Umum').trim() || 'Umum',
      question_text: formData.question_text,
      question_type: formData.question_type,
      points: Number(formData.points) || 10,
      difficulty: formData.difficulty,
      explanation: formData.explanation,
      short_answer_key: formData.question_type === 'short_answer' ? formData.short_answer_key : null,
      options: finalOptions,
    });

    if (res && !res.success) {
      alert('Informasi Database: ' + (res.error || 'Terjadi kendala pada database Supabase. Soal diamankan di penyimpanan aplikasi.'));
    }

    setIsAddModalOpen(false);
    showNotif(`Soal berhasil ditambahkan ke Paket "${(formData.category_name || 'Umum').trim()}"!`);
  };

  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(q);
    setEditFormData({
      subject_id: q.subject_id,
      class_id: q.class_id || '',
      category_name: q.category_name || 'Umum',
      question_text: q.question_text,
      question_type: q.question_type,
      points: q.points,
      difficulty: q.difficulty,
      explanation: q.explanation || '',
      short_answer_key: q.short_answer_key || '',
      options: q.options && q.options.length > 0
        ? q.options.map(o => ({ ...o }))
        : [
            { id: '1', option_key: 'A', option_text: 'Pilihan A', is_correct: true, order_index: 1 },
            { id: '2', option_key: 'B', option_text: 'Pilihan B', is_correct: false, order_index: 2 },
            { id: '3', option_key: 'C', option_text: 'Pilihan C', is_correct: false, order_index: 3 },
            { id: '4', option_key: 'D', option_text: 'Pilihan D', is_correct: false, order_index: 4 },
          ]
    });
  };

  const handleAddEditOption = () => {
    if (!editFormData || editFormData.options.length >= 5) {
      alert('Maksimal 5 pilihan jawaban');
      return;
    }
    const nextOrder = editFormData.options.length + 1;
    setEditFormData({
      ...editFormData,
      options: [
        ...editFormData.options,
        {
          id: String(Date.now()),
          option_key: String.fromCharCode(64 + nextOrder),
          option_text: `Pilihan ${String.fromCharCode(64 + nextOrder)}`,
          is_correct: false,
          order_index: nextOrder,
        }
      ]
    });
  };

  const handleRemoveEditOption = (index: number) => {
    if (!editFormData || editFormData.options.length <= 2) {
      alert('Minimal 2 pilihan jawaban');
      return;
    }
    const updated = editFormData.options.filter((_, i) => i !== index);
    const hasCorrect = updated.some(o => o.is_correct);
    if (!hasCorrect && updated.length > 0) {
      updated[0].is_correct = true;
    }
    setEditFormData({ ...editFormData, options: updated });
  };

  const setCorrectEditOption = (index: number) => {
    if (!editFormData) return;
    const updated = editFormData.options.map((opt, i) => ({
      ...opt,
      is_correct: i === index,
    }));
    setEditFormData({ ...editFormData, options: updated });
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editFormData || !editFormData.question_text || !editFormData.subject_id) return;

    let finalOptions = editFormData.options;
    if (editFormData.question_type === 'true_false') {
      finalOptions = [
        { id: 'tf_1', option_key: 'A', option_text: 'Benar', is_correct: editFormData.options[0]?.is_correct ?? true, order_index: 1 },
        { id: 'tf_2', option_key: 'B', option_text: 'Salah', is_correct: !(editFormData.options[0]?.is_correct ?? true), order_index: 2 },
      ];
    } else if (editFormData.question_type === 'short_answer' || editFormData.question_type === 'essay') {
      finalOptions = [];
    } else if (editFormData.question_type === 'multiple_choice') {
      finalOptions = editFormData.options.map((opt, idx) => ({
        ...opt,
        option_key: opt.option_key || String.fromCharCode(65 + idx),
        order_index: idx + 1,
      }));
    }

    const res = await updateQuestion(editingQuestion.id, {
      subject_id: editFormData.subject_id,
      class_id: editFormData.class_id || null,
      category_name: (editFormData.category_name || 'Umum').trim() || 'Umum',
      question_text: editFormData.question_text,
      question_type: editFormData.question_type,
      points: Number(editFormData.points),
      difficulty: editFormData.difficulty,
      explanation: editFormData.explanation,
      short_answer_key: editFormData.question_type === 'short_answer' ? editFormData.short_answer_key : null,
      options: finalOptions,
    });

    if (res && !res.success) {
      alert('Gagal memperbarui soal: ' + (res.error || 'Terjadi kesalahan pada database'));
      return;
    }

    setEditingQuestion(null);
    setEditFormData(null);
    showNotif('Soal berhasil diperbarui!');
  };

  const handleDuplicate = async (id: string) => {
    await duplicateQuestion(id);
    showNotif('Soal berhasil diduplikasi!');
  };

  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    await deleteQuestion(questionToDelete.id);
    showNotif('Soal berhasil dihapus dari Bank Soal.');
    setQuestionToDelete(null);
  };

  const filteredQuestions = questions.filter(q => {
    const subject = subjects.find(s => s.id === q.subject_id);
    const matchSubject = selectedSubjectFilter === 'all' || q.subject_id === selectedSubjectFilter;
    const qCat = (q.category_name || 'Umum').trim();
    const matchCategory = selectedCategoryFilter === 'all' || qCat === selectedCategoryFilter;
    const matchType = selectedTypeFilter === 'all' || q.question_type === selectedTypeFilter;
    const qTerm = searchTerm.trim().toLowerCase();
    const matchSearch =
      !qTerm ||
      q.question_text.toLowerCase().includes(qTerm) ||
      (q.category_name || '').toLowerCase().includes(qTerm) ||
      (subject?.name || '').toLowerCase().includes(qTerm) ||
      (q.options || []).some(opt => opt.option_text.toLowerCase().includes(qTerm));
    return matchSubject && matchCategory && matchType && matchSearch;
  });

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
          <h3 className="text-xl font-extrabold text-slate-900">Bank Soal Terpadu & Paket Kategori</h3>
          <p className="text-xs text-slate-500 font-medium">
            Kelompokkan butir soal ke dalam Paket Tugas / Ujian (misal: Tugas 1, Tugas 2, UTS, UAS) agar tinggal dipanggil 1 klik saat membuat Tugas & Ujian
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Soal Baru</span>
        </button>
      </div>

      {/* Filters & Paket Soal Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        {/* Search input for questions */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari teks pertanyaan soal, paket, atau pilihan jawaban..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-bold">Mapel:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => {
                setSelectedSubjectFilter(e.target.value);
                setSelectedCategoryFilter('all');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
            >
              <option value="all">Semua Mapel</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-[#3b5bf5]" />
            <span className="text-xs text-slate-500 font-bold">Paket Tugas / Ujian:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
            >
              <option value="all">Semua Paket Kategori ({questions.filter(q => selectedSubjectFilter === 'all' || q.subject_id === selectedSubjectFilter).length} Soal)</option>
              {existingCategories.map(cat => {
                const count = questions.filter(
                  q => (selectedSubjectFilter === 'all' || q.subject_id === selectedSubjectFilter) && (q.category_name || 'Umum').trim() === cat
                ).length;
                return (
                  <option key={cat} value={cat}>
                    Paket: {cat} ({count} Soal)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Tipe:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
            >
              <option value="all">Semua Tipe Soal</option>
              <option value="multiple_choice">Pilihan Ganda</option>
              <option value="true_false">Benar / Salah</option>
              <option value="short_answer">Isian Singkat</option>
              <option value="essay">Esai</option>
            </select>
          </div>
        </div>

        {/* Quick Paket Pills */}
        {existingCategories.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Filter Paket:</span>
            <button
              type="button"
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedCategoryFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Paket
            </button>
            {existingCategories.map(cat => {
              const count = questions.filter(
                q => (selectedSubjectFilter === 'all' || q.subject_id === selectedSubjectFilter) && (q.category_name || 'Umum').trim() === cat
              ).length;
              const isSelected = selectedCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                  }`}
                >
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700 font-bold'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-3xl border border-slate-200/80 shadow-sm text-xs font-medium space-y-3">
            <h4 className="text-sm font-bold text-slate-800">
              {searchTerm ? `Tidak ditemukan soal yang cocok dengan "${searchTerm}"` : 'Belum ada soal pada kriteria filter ini.'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm ? 'Coba periksa kata kunci Anda atau klik tombol di bawah untuk menyetel ulang pencarian.' : 'Klik "Buat Soal Baru" untuk mulai menambahkan butir soal ke Bank Soal.'}
            </p>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Reset Pencarian
              </button>
            )}
          </div>
        ) : (
          filteredQuestions.map((q, index) => {
            const subject = subjects.find(s => s.id === q.subject_id);

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:border-[#3b5bf5]/30 hover:shadow-md transition-all"
              >
                {/* Header Strip with High Visual Hierarchy */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold shadow-xs">
                      No. {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {subject?.name || 'Mata Pelajaran'}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/80 text-[11px] font-semibold flex items-center gap-1.5">
                      <FolderKanban className="w-3.5 h-3.5 text-slate-500" />
                      <span>{q.category_name || 'Umum'}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-medium">
                      {q.question_type === 'multiple_choice' && 'Pilihan Ganda'}
                      {q.question_type === 'true_false' && 'Benar / Salah'}
                      {q.question_type === 'short_answer' && 'Isian Singkat'}
                      {q.question_type === 'essay' && 'Esai'}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-[#3b5bf5] border border-blue-200/60 text-[11px] font-bold">
                      {q.points} Poin
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/60">
                      {q.difficulty === 'easy' ? 'Tingkat Mudah' : q.difficulty === 'medium' ? 'Tingkat Sedang' : 'Tingkat Sulit'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#3b5bf5] transition-colors"
                      title="Edit Soal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(q.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Duplikasi Soal"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setQuestionToDelete(q)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                      title="Hapus Soal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="text-sm font-bold text-slate-900 leading-relaxed pt-1">
                  {q.question_text}
                </h4>

                {/* Options display */}
                {q.question_type === 'multiple_choice' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options?.map((opt, i) => (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 transition-colors ${
                          opt.is_correct
                            ? 'bg-emerald-50/70 border-2 border-emerald-500/70 text-slate-900 shadow-xs'
                            : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-xs ${
                              opt.is_correct
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className={`leading-snug truncate ${opt.is_correct ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {opt.option_text}
                          </span>
                        </div>
                        {opt.is_correct && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Kunci</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {q.question_type === 'true_false' && (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {q.options?.map((opt, i) => (
                      <div
                        key={opt.id}
                        className={`px-4 py-2.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
                          opt.is_correct
                            ? 'bg-emerald-50/70 border-2 border-emerald-500/70 text-slate-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200/90 text-slate-700 font-medium'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-xs ${
                            opt.is_correct
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt.option_text}</span>
                        {opt.is_correct && (
                          <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Kunci</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {q.question_type === 'short_answer' && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Kunci Jawaban Singkat: </span>
                    <span className="font-mono font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">{q.short_answer_key}</span>
                  </div>
                )}

                {q.question_type === 'essay' && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                    <span className="text-slate-900 font-bold">Petunjuk Koreksi Guru: </span>
                    {q.explanation || 'Jawaban esai dikoreksi manual melalui menu Penilaian & Grading.'}
                  </div>
                )}

                {q.explanation && q.question_type !== 'essay' && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">Pembahasan / Penjelasan: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Tambah Soal Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#3b5bf5]" />
                Tambah Soal ke Bank Soal
              </h4>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Paket / Kategori Tugas & Ujian */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                    <FolderKanban className="w-4 h-4 text-[#3b5bf5]" />
                    Paket / Kategori Tugas & Ujian *
                  </label>
                  <span className="text-[10px] font-semibold text-indigo-600">
                    Agar tinggal dipanggil 1 klik saat Buat Tugas / Ujian
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  placeholder="Ketik nama paket (contoh: Tugas 1, Tugas 2, Ulangan Harian 1, UTS)..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3b5bf5]"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-500 mr-1">Pilih Cepat:</span>
                  {quickCategoryOptions.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category_name: cat })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        formData.category_name === cat
                          ? 'bg-[#3b5bf5] text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mata Pelajaran *</label>
                  <select
                    value={formData.subject_id}
                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipe Soal *</label>
                  <select
                    value={formData.question_type}
                    onChange={(e) => setFormData({ ...formData, question_type: e.target.value as QuestionType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    <option value="multiple_choice">Pilihan Ganda (PG)</option>
                    <option value="true_false">Benar atau Salah</option>
                    <option value="short_answer">Isian Singkat</option>
                    <option value="essay">Esai (Manual Review)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Bobot Nilai (Poin)</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tingkat Kesulitan</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as QuestionDifficulty })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    <option value="easy">Mudah</option>
                    <option value="medium">Sedang</option>
                    <option value="hard">Sulit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Teks Soal / Pertanyaan *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="Tuliskan butir soal di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              {/* Tipe Pilihan Ganda Form */}
              {formData.question_type === 'multiple_choice' && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Opsi Jawaban (Pilih centang hijau untuk kunci jawaban benar)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      disabled={formData.options.length >= 5}
                      className="text-xs text-[#3b5bf5] hover:underline font-bold disabled:opacity-40"
                    >
                      + Tambah Opsi (Max 5)
                    </button>
                  </div>

                  {formData.options.map((opt, i) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCorrectOption(i)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                          opt.is_correct
                            ? 'bg-[#1cd485] border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-100 border-slate-200 text-slate-400 hover:border-slate-400'
                        }`}
                        title="Tandai sebagai jawaban benar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-slate-500 w-4">{String.fromCharCode(65 + i)}.</span>
                      <input
                        type="text"
                        value={opt.option_text}
                        onChange={(e) => {
                          const newOpts = [...formData.options];
                          newOpts[i].option_text = e.target.value;
                          setFormData({ ...formData, options: newOpts });
                        }}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(i)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tipe Benar Salah */}
              {formData.question_type === 'true_false' && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700">Kunci Jawaban yang Benar</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tf_correct"
                        checked={formData.options[0]?.is_correct}
                        onChange={() => {
                          const opts = [...formData.options];
                          opts[0].is_correct = true;
                          setFormData({ ...formData, options: opts });
                        }}
                        className="text-[#3b5bf5] focus:ring-0"
                      />
                      <span>Pernyataan ini Benar</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tf_correct"
                        checked={!formData.options[0]?.is_correct}
                        onChange={() => {
                          const opts = [...formData.options];
                          opts[0].is_correct = false;
                          setFormData({ ...formData, options: opts });
                        }}
                        className="text-[#3b5bf5] focus:ring-0"
                      />
                      <span>Pernyataan ini Salah</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Tipe Isian Singkat */}
              {formData.question_type === 'short_answer' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Kunci Jawaban Singkat Tepat</label>
                  <input
                    type="text"
                    value={formData.short_answer_key}
                    onChange={(e) => setFormData({ ...formData, short_answer_key: e.target.value })}
                    placeholder="Contoh: 10 atau Fotosintesis (case-insensitive)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Penjelasan / Pembahasan Soal</label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Pembahasan langkah solusi untuk siswa..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  Simpan ke Bank Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Soal */}
      {editingQuestion && editFormData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#3b5bf5]" />
                Edit Butir Soal
              </h4>
              <button
                onClick={() => {
                  setEditingQuestion(null);
                  setEditFormData(null);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateQuestion} className="space-y-4">
              {/* Paket / Kategori Tugas & Ujian saat Edit */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                    <FolderKanban className="w-4 h-4 text-[#3b5bf5]" />
                    Paket / Kategori Tugas & Ujian *
                  </label>
                  <span className="text-[10px] font-semibold text-indigo-600">
                    Kelompok soal untuk dipanggil di menu Tugas & Ujian
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={editFormData.category_name}
                  onChange={(e) => setEditFormData({ ...editFormData, category_name: e.target.value })}
                  placeholder="Contoh: Tugas 1, Tugas 2, Ulangan Harian 1, UTS..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3b5bf5]"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-500 mr-1">Pilih Cepat:</span>
                  {quickCategoryOptions.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, category_name: cat })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        editFormData.category_name === cat
                          ? 'bg-[#3b5bf5] text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mata Pelajaran *</label>
                  <select
                    value={editFormData.subject_id}
                    onChange={(e) => setEditFormData({ ...editFormData, subject_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipe Soal *</label>
                  <select
                    value={editFormData.question_type}
                    onChange={(e) => setEditFormData({ ...editFormData, question_type: e.target.value as QuestionType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    <option value="multiple_choice">Pilihan Ganda (PG)</option>
                    <option value="true_false">Benar atau Salah</option>
                    <option value="short_answer">Isian Singkat</option>
                    <option value="essay">Esai (Manual Review)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Bobot Nilai (Poin)</label>
                  <input
                    type="number"
                    value={editFormData.points}
                    onChange={(e) => setEditFormData({ ...editFormData, points: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tingkat Kesulitan</label>
                  <select
                    value={editFormData.difficulty}
                    onChange={(e) => setEditFormData({ ...editFormData, difficulty: e.target.value as QuestionDifficulty })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    <option value="easy">Mudah</option>
                    <option value="medium">Sedang</option>
                    <option value="hard">Sulit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Teks Soal / Pertanyaan *</label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.question_text}
                  onChange={(e) => setEditFormData({ ...editFormData, question_text: e.target.value })}
                  placeholder="Tuliskan butir soal di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              {/* Tipe Pilihan Ganda Form */}
              {editFormData.question_type === 'multiple_choice' && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Opsi Jawaban (Pilih centang hijau untuk kunci jawaban benar)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddEditOption}
                      disabled={editFormData.options.length >= 5}
                      className="text-xs text-[#3b5bf5] hover:underline font-bold disabled:opacity-40"
                    >
                      + Tambah Opsi (Max 5)
                    </button>
                  </div>

                  {editFormData.options.map((opt, i) => (
                    <div key={opt.id || i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCorrectEditOption(i)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                          opt.is_correct
                            ? 'bg-[#1cd485] border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-100 border-slate-200 text-slate-400 hover:border-slate-400'
                        }`}
                        title="Tandai sebagai jawaban benar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-slate-500 w-4">{String.fromCharCode(65 + i)}.</span>
                      <input
                        type="text"
                        value={opt.option_text}
                        onChange={(e) => {
                          const newOpts = [...editFormData.options];
                          newOpts[i].option_text = e.target.value;
                          setEditFormData({ ...editFormData, options: newOpts });
                        }}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                      />
                      {editFormData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEditOption(i)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tipe Benar Salah */}
              {editFormData.question_type === 'true_false' && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700">Kunci Jawaban yang Benar</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="edit_tf_correct"
                        checked={editFormData.options[0]?.is_correct}
                        onChange={() => {
                          const opts = [...editFormData.options];
                          opts[0].is_correct = true;
                          setEditFormData({ ...editFormData, options: opts });
                        }}
                        className="text-[#3b5bf5] focus:ring-0"
                      />
                      <span>Pernyataan ini Benar</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="edit_tf_correct"
                        checked={!editFormData.options[0]?.is_correct}
                        onChange={() => {
                          const opts = [...editFormData.options];
                          opts[0].is_correct = false;
                          setEditFormData({ ...editFormData, options: opts });
                        }}
                        className="text-[#3b5bf5] focus:ring-0"
                      />
                      <span>Pernyataan ini Salah</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Tipe Isian Singkat */}
              {editFormData.question_type === 'short_answer' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Kunci Jawaban Singkat Tepat</label>
                  <input
                    type="text"
                    value={editFormData.short_answer_key}
                    onChange={(e) => setEditFormData({ ...editFormData, short_answer_key: e.target.value })}
                    placeholder="Contoh: 10 atau Fotosintesis (case-insensitive)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Penjelasan / Pembahasan Soal</label>
                <textarea
                  rows={2}
                  value={editFormData.explanation}
                  onChange={(e) => setEditFormData({ ...editFormData, explanation: e.target.value })}
                  placeholder="Pembahasan langkah solusi untuk siswa..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestion(null);
                    setEditFormData(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Hapus Soal */}
      <ConfirmDialog
        isOpen={Boolean(questionToDelete)}
        onClose={() => setQuestionToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Yakin Ingin Menghapus Soal Ini?"
        description="Soal ini akan dihapus permanen dari Bank Soal. Soal yang sudah digunakan pada tugas/kuis yang sedang berjalan mungkin terpengaruh."
        confirmLabel="Ya, Hapus Soal"
        cancelLabel="Batal"
        variant="danger"
        icon="trash"
      />
    </div>
  );
};
