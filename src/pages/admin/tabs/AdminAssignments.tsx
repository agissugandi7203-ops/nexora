import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Clock,
  Calendar,
  Layers,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  FolderKanban,
  Check,
  School,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { Assignment, AssignmentType } from '../../../types/database.types';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export const AdminAssignments: React.FC = () => {
  const { assignments, subjects, classes, questions, addAssignment, updateAssignment, deleteAssignment } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [asgToDelete, setAsgToDelete] = useState<Assignment | null>(null);
  const [showZeroQuestionConfirm, setShowZeroQuestionConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [showManualQuestionListAdd, setShowManualQuestionListAdd] = useState(false);
  const [showManualQuestionListEdit, setShowManualQuestionListEdit] = useState(false);

  const getLinkedClassesForSubject = (subjectId: string) => {
    const sub = subjects.find(s => s.id === subjectId);
    if (sub?.class_ids && sub.class_ids.length > 0) {
      const filtered = classes.filter(c => sub.class_ids!.includes(c.id));
      if (filtered.length > 0) return filtered;
    }
    return classes;
  };

  // Helper: Ambil daftar paket/kategori unik dari Bank Soal untuk mata pelajaran tertentu
  const getPackagesForSubject = (subjectId: string) => {
    const subQuestions = questions.filter(q => q.subject_id === subjectId);
    const map = new Map<string, { name: string; questionIds: string[]; totalPoints: number }>();
    subQuestions.forEach(q => {
      const cat = (q.category_name || 'Umum').trim() || 'Umum';
      const existing = map.get(cat) || { name: cat, questionIds: [], totalPoints: 0 };
      existing.questionIds.push(q.id);
      existing.totalPoints += Number(q.points) || 0;
      map.set(cat, existing);
    });
    return Array.from(map.values());
  };

  const initialSubId = subjects[0]?.id || '';
  const initialLinkedClasses = getLinkedClassesForSubject(initialSubId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'quiz' as AssignmentType,
    subject_id: initialSubId,
    class_id: initialLinkedClasses[0]?.id || classes[0]?.id || '',
    class_ids: initialLinkedClasses.map(c => c.id),
    category_name: '',
    duration_minutes: 60,
    total_points: 100,
    is_active: true,
    allow_late: false,
    selectedQuestions: questions.map(q => q.id),
  });

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAddModal = () => {
    if (subjects.length === 0 || classes.length === 0) {
      alert('Harap pastikan minimal ada 1 Kelas dan 1 Mata Pelajaran terlebih dahulu sebelum membuat Tugas / Ujian.');
      return;
    }
    const defaultSubId = subjects[0]?.id || '';
    const linkedCls = getLinkedClassesForSubject(defaultSubId);
    const packages = getPackagesForSubject(defaultSubId);
    const firstPkg = packages[0];
    const defaultSubQuestions = firstPkg
      ? firstPkg.questionIds
      : questions.filter(q => q.subject_id === defaultSubId).map(q => q.id);

    setFormData({
      title: '',
      description: '',
      type: 'quiz',
      subject_id: defaultSubId,
      class_id: linkedCls.length === 1 ? linkedCls[0].id : '',
      class_ids: linkedCls.map(c => c.id),
      category_name: firstPkg ? firstPkg.name : '',
      duration_minutes: 60,
      total_points: firstPkg && firstPkg.totalPoints > 0 ? firstPkg.totalPoints : 100,
      is_active: true,
      allow_late: false,
      selectedQuestions: defaultSubQuestions,
    });
    setShowManualQuestionListAdd(false);
    setIsAddModalOpen(true);
  };

  const executeCreate = async () => {
    // Gunakan kelas pertama sebagai class_id utama untuk memenuhi constraint NOT NULL di PostgreSQL,
    // sementara daftar lengkap multi-kelas disimpan di class_ids
    const primaryClassId = formData.class_ids[0] || formData.class_id || classes[0]?.id || '';

    const res = await addAssignment({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      subject_id: formData.subject_id,
      class_id: primaryClassId,
      class_ids: formData.class_ids,
      category_name: formData.category_name || null,
      start_time: new Date().toISOString(),
      due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
      duration_minutes: formData.type === 'quiz' ? Number(formData.duration_minutes) : null,
      total_points: Number(formData.total_points),
      is_active: formData.is_active,
      allow_late: formData.allow_late,
      created_by: 'p-admin',
    }, formData.type === 'quiz' ? formData.selectedQuestions : []);

    if (res && !res.success) {
      alert('Gagal membuat tugas/ujian: ' + (res.error || 'Terjadi kesalahan pada database'));
      return;
    }

    setIsAddModalOpen(false);
    setShowZeroQuestionConfirm(false);
    showNotif('Tugas / Ujian baru berhasil dibuat dan diterbitkan!');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul tugas/ujian wajib diisi!');
      return;
    }
    if (!formData.subject_id) {
      alert('Silakan pilih mata pelajaran!');
      return;
    }
    if (!formData.class_ids || formData.class_ids.length === 0) {
      alert('Silakan pilih minimal 1 kelas target (atau pilih Semua Kelas Mapel Ini)!');
      return;
    }

    if (formData.type === 'quiz' && formData.selectedQuestions.length === 0) {
      setShowZeroQuestionConfirm(true);
      return;
    }

    await executeCreate();
  };

  const handleOpenEditModal = (asg: Assignment) => {
    const linkedCls = getLinkedClassesForSubject(asg.subject_id);
    const currentClassIds = Array.isArray(asg.class_ids) && asg.class_ids.length > 0
      ? asg.class_ids
      : (asg.class_id ? [asg.class_id] : linkedCls.map(c => c.id));
    const currentQIds = asg.question_ids && asg.question_ids.length > 0
      ? asg.question_ids
      : questions.filter(q => q.subject_id === asg.subject_id).map(q => q.id);
    setShowManualQuestionListEdit(false);
    setEditingAssignment({
      ...asg,
      class_ids: currentClassIds,
      question_ids: currentQIds
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;

    const targetClassIds = Array.isArray(editingAssignment.class_ids) && editingAssignment.class_ids.length > 0
      ? editingAssignment.class_ids
      : (editingAssignment.class_id ? [editingAssignment.class_id] : []);

    if (targetClassIds.length === 0) {
      alert('Silakan pilih minimal 1 kelas target!');
      return;
    }

    const primaryClassId = targetClassIds[0] || editingAssignment.class_id || classes[0]?.id || '';

    const res = await updateAssignment(
      editingAssignment.id,
      {
        title: editingAssignment.title,
        description: editingAssignment.description,
        type: editingAssignment.type,
        subject_id: editingAssignment.subject_id,
        class_id: primaryClassId,
        class_ids: targetClassIds,
        category_name: editingAssignment.category_name || null,
        duration_minutes: editingAssignment.type === 'quiz' ? Number(editingAssignment.duration_minutes) : null,
        total_points: Number(editingAssignment.total_points),
        is_active: editingAssignment.is_active,
      },
      editingAssignment.type === 'quiz' ? (editingAssignment.question_ids || []) : []
    );

    if (res && !res.success) {
      alert('Gagal memperbarui tugas/ujian: ' + (res.error || 'Terjadi kesalahan pada database'));
      return;
    }

    setEditingAssignment(null);
    showNotif('Tugas / ujian berhasil diperbarui!');
  };

  const handleConfirmDelete = async () => {
    if (!asgToDelete) return;
    const res = await deleteAssignment(asgToDelete.id);
    if (res && !res.success) {
      showNotif('Gagal menghapus tugas/ujian: ' + (res.error || 'Terjadi kesalahan pada database'));
    } else {
      showNotif(`Tugas / Ujian "${asgToDelete.title}" berhasil dihapus.`);
    }
    setAsgToDelete(null);
  };

  const handleToggleActive = async (asg: Assignment) => {
    const nextStatus = !asg.is_active;
    const res = await updateAssignment(asg.id, { is_active: nextStatus });
    if (res && !res.success) {
      alert('Gagal mengubah status aktif: ' + (res.error || 'Terjadi kesalahan pada database'));
      return;
    }
    showNotif(`Status "${asg.title}" diubah menjadi ${nextStatus ? 'Aktif' : 'Terkunci / Nonaktif'}`);
  };

  const filteredAssignments = assignments.filter((asg) => {
    const matchSubject = selectedSubjectFilter === 'all' || asg.subject_id === selectedSubjectFilter;
    const matchType = selectedTypeFilter === 'all' || asg.type === selectedTypeFilter;
    const q = searchTerm.trim().toLowerCase();
    if (!q) return matchSubject && matchType;

    const subject = subjects.find(s => s.id === asg.subject_id);
    const targetClassObjects = Array.isArray(asg.class_ids) && asg.class_ids.length > 0
      ? classes.filter(c => asg.class_ids!.includes(c.id))
      : (asg.class_id ? classes.filter(c => c.id === asg.class_id) : []);
    const classNames = targetClassObjects.map(c => c.name).join(' ').toLowerCase();

    const matchSearch =
      asg.title.toLowerCase().includes(q) ||
      (asg.description || '').toLowerCase().includes(q) ||
      (asg.category_name || '').toLowerCase().includes(q) ||
      (subject?.name || '').toLowerCase().includes(q) ||
      classNames.includes(q);

    return matchSubject && matchType && matchSearch;
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
          <h3 className="text-xl font-extrabold text-slate-900">Tugas dan Ujian Online</h3>
          <p className="text-xs text-slate-500 font-medium">
            Atur kuis interaktif dengan timer otomatis atau lembar penugasan unggah dokumen
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tugas / Ujian Baru</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari tugas, kuis, mapel, atau kelas..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-bold">Mapel:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
            >
              <option value="all">Semua Mapel</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-bold">Tipe:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
            >
              <option value="all">Semua Tipe ({assignments.length})</option>
              <option value="quiz">Kuis Online</option>
              <option value="file_upload">Tugas File</option>
              <option value="text">Tugas Teks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              {searchTerm ? `Tidak ditemukan tugas atau kuis yang cocok dengan "${searchTerm}"` : 'Belum ada tugas atau ujian'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm ? 'Coba periksa kata kunci Anda atau klik tombol di bawah untuk menyetel ulang.' : 'Klik "Buat Tugas / Ujian Baru" untuk mulai mempublikasikan tugas ke kelas.'}
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
          filteredAssignments.map((asg) => {
          const subject = subjects.find(s => s.id === asg.subject_id);
          const linkedForSub = getLinkedClassesForSubject(asg.subject_id);
          const targetClassObjects = Array.isArray(asg.class_ids) && asg.class_ids.length > 0
            ? classes.filter(c => asg.class_ids!.includes(c.id))
            : (asg.class_id ? classes.filter(c => c.id === asg.class_id) : linkedForSub);
          const classDisplayLabel = targetClassObjects.length > 0
            ? targetClassObjects.map(c => c.name).join(', ')
            : 'Semua Kelas Mapel';

          return (
            <div
              key={asg.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between group hover:border-[#3b5bf5]/40 hover:shadow-md transition-all"
            >
              <div>
                {/* Header: Badges & Actions */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      asg.type === 'quiz'
                        ? 'bg-blue-50 text-[#3b5bf5] border border-blue-200/60'
                        : 'bg-emerald-50 text-[#0fa868] border border-emerald-200/60'
                    }`}>
                      {asg.type === 'quiz' ? 'Kuis Interaktif' : 'Portofolio / Tugas'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(asg)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border transition-colors ${
                        asg.is_active
                          ? 'bg-[#1cd485]/15 text-[#0fa868] border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                      title="Klik untuk mengubah status aktif"
                    >
                      {asg.is_active ? '● Aktif' : '○ Kunci'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(asg)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#3b5bf5] transition-colors"
                      title="Edit Tugas / Ujian"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setAsgToDelete(asg)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                      title="Hapus Tugas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subject & Target Class */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
                  <span className="font-bold text-[#3b5bf5]">{subject?.name || 'Mata Pelajaran'}</span>
                  <span>&bull;</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] text-slate-700 font-semibold truncate max-w-[180px]">
                    {classDisplayLabel}
                  </span>
                  {asg.category_name && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {asg.category_name}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#3b5bf5] transition-colors mb-2 leading-snug">
                  {asg.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-normal">
                  {asg.description || 'Tidak ada deskripsi khusus.'}
                </p>

                {/* Key Metrics Strip */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Durasi</span>
                    <span className="font-bold text-slate-800 text-[11px]">
                      {asg.duration_minutes ? `${asg.duration_minutes} Menit` : 'Tanpa Timer'}
                    </span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-medium">Bobot</span>
                    <span className="font-bold text-slate-800 text-[11px]">{asg.total_points} Poin</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Kapasitas</span>
                    <span className="font-bold text-[#3b5bf5] text-[11px]">
                      {asg.type === 'quiz' ? `${asg.question_count || questions.length} Butir` : 'Upload File'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-medium text-slate-500">
                  Tenggat: 7 hari lagi
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(asg)}
                  className="text-xs font-bold text-[#3b5bf5] hover:underline"
                >
                  Kelola Soal &rarr;
                </button>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Modal: Tambah Tugas / Ujian */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#3b5bf5]" />
                Buat Tugas atau Ujian Baru
              </h4>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Tugas / Ujian *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Ulangan Harian 1: Aljabar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mata Pelajaran *</label>
                  <select
                    value={formData.subject_id}
                    onChange={(e) => {
                      const nextSubId = e.target.value;
                      const nextLinkedClasses = getLinkedClassesForSubject(nextSubId);
                      const nextPackages = getPackagesForSubject(nextSubId);
                      const firstPkg = nextPackages[0];
                      const nextQuestions = firstPkg
                        ? firstPkg.questionIds
                        : questions.filter(q => q.subject_id === nextSubId).map(q => q.id);
                      setFormData({
                        ...formData,
                        subject_id: nextSubId,
                        class_id: nextLinkedClasses.length === 1 ? nextLinkedClasses[0].id : '',
                        class_ids: nextLinkedClasses.map(c => c.id),
                        category_name: firstPkg ? firstPkg.name : '',
                        total_points: firstPkg && firstPkg.totalPoints > 0 ? firstPkg.totalPoints : formData.total_points,
                        selectedQuestions: nextQuestions,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                {/* Multi-Kelas Target Selector sesuai Mata Pelajaran */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  {(() => {
                    const linkedClasses = getLinkedClassesForSubject(formData.subject_id);
                    const allSelected = linkedClasses.length > 0 && linkedClasses.every(c => formData.class_ids.includes(c.id));

                    return (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                            <School className="w-4 h-4 text-[#3b5bf5]" />
                            Kelas Target (Sesuai Mapel) *
                            <span className="text-[10px] font-bold text-[#3b5bf5]">
                              ({formData.class_ids.length} dari {linkedClasses.length} Kelas Dipilih)
                            </span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                class_ids: linkedClasses.map(c => c.id),
                                class_id: linkedClasses.length === 1 ? linkedClasses[0].id : '',
                              })}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                allSelected
                                  ? 'bg-[#3b5bf5] text-white shadow-sm'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#3b5bf5]'
                              }`}
                            >
                              Semua Kelas Mapel Ini
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          Klik <strong>Semua Kelas Mapel Ini</strong> atau centang satu / beberapa kelas yang diizinkan mengakses ujian ini:
                        </p>

                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {linkedClasses.map((c) => {
                            const isSelected = formData.class_ids.includes(c.id);
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  const nextIds = isSelected
                                    ? formData.class_ids.filter(id => id !== c.id)
                                    : [...formData.class_ids, c.id];
                                  setFormData({
                                    ...formData,
                                    class_ids: nextIds,
                                    class_id: nextIds.length === 1 ? nextIds[0] : '',
                                  });
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                                  isSelected
                                    ? 'bg-blue-50 border-[#3b5bf5] text-[#3b5bf5] shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                  isSelected ? 'bg-[#3b5bf5] border-[#3b5bf5] text-white' : 'border-slate-300 bg-slate-50'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3" />}
                                </span>
                                <span>{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipe Kegiatan</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AssignmentType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    <option value="quiz">Kuis Interaktif</option>
                    <option value="assignment">Pengumpulan Tugas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Durasi (Menit)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                    disabled={formData.type !== 'quiz'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 disabled:opacity-40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Nilai</label>
                  <input
                    type="number"
                    value={formData.total_points}
                    onChange={(e) => setFormData({ ...formData, total_points: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Petunjuk Pengerjaan</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Aturan pengerjaan, kejujuran, dan materi yang dicakup..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              {formData.type === 'quiz' && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {(() => {
                    const availableBankQuestions = questions.filter(q => q.subject_id === formData.subject_id);
                    const subjectPackages = getPackagesForSubject(formData.subject_id);

                    if (availableBankQuestions.length === 0) {
                      return (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            Belum ada butir soal di Bank Soal untuk mata pelajaran ini. Silakan buat butir soal terlebih dahulu di menu <strong>Bank Soal</strong>, atau pilih tipe &quot;Pengumpulan Tugas&quot;.
                          </span>
                        </div>
                      );
                    }

                    return (
                      <>
                        {/* 1-Click Paket / Kategori Soal Selector */}
                        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                                <FolderKanban className="w-4 h-4 text-[#3b5bf5]" />
                                Panggil Paket Soal dari Bank Soal
                              </label>
                              <p className="text-[11px] text-indigo-700/80 font-medium mt-0.5">
                                Pilih paket kategori tugas/ujian — seluruh soal di dalam paket langsung terpilih otomatis tanpa ceklis satu per satu!
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {subjectPackages.map((pkg) => {
                              const isPkgActive =
                                formData.category_name === pkg.name &&
                                pkg.questionIds.every(id => formData.selectedQuestions.includes(id)) &&
                                formData.selectedQuestions.length === pkg.questionIds.length;

                              return (
                                <button
                                  key={pkg.name}
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      category_name: pkg.name,
                                      selectedQuestions: pkg.questionIds,
                                      total_points: pkg.totalPoints > 0 ? pkg.totalPoints : formData.total_points,
                                    });
                                  }}
                                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                    isPkgActive
                                      ? 'bg-[#3b5bf5] text-white border-[#3b5bf5] shadow-md shadow-blue-500/20'
                                      : 'bg-white border-indigo-200/80 text-slate-800 hover:border-[#3b5bf5]'
                                  }`}
                                >
                                  <div>
                                    <span className="text-xs font-extrabold block">Paket: {pkg.name}</span>
                                    <span className={`text-[10px] font-semibold ${isPkgActive ? 'text-blue-100' : 'text-slate-500'}`}>
                                      {pkg.questionIds.length} Butir Soal &bull; {pkg.totalPoints} Poin
                                    </span>
                                  </div>
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                    isPkgActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-[#3b5bf5]'
                                  }`}>
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                </button>
                              );
                            })}

                            {subjectPackages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const allIds = availableBankQuestions.map(q => q.id);
                                  const allPts = availableBankQuestions.reduce((acc, q) => acc + (Number(q.points) || 0), 0);
                                  setFormData({
                                    ...formData,
                                    category_name: 'Semua Paket',
                                    selectedQuestions: allIds,
                                    total_points: allPts > 0 ? allPts : formData.total_points,
                                  });
                                }}
                                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                  formData.selectedQuestions.length === availableBankQuestions.length && formData.category_name === 'Semua Paket'
                                    ? 'bg-[#3b5bf5] text-white border-[#3b5bf5] shadow-md'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#3b5bf5]'
                                }`}
                              >
                                <div>
                                  <span className="text-xs font-extrabold block">Gabungkan Semua Paket</span>
                                  <span className="text-[10px] opacity-80">
                                    Total {availableBankQuestions.length} Butir Soal Mapel Ini
                                  </span>
                                </div>
                                <Layers className="w-4 h-4 shrink-0" />
                              </button>
                            )}
                          </div>

                          <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between text-xs">
                            <span className="font-bold text-indigo-950">
                              ✓ {formData.selectedQuestions.length} Butir Soal Terpilih untuk Ujian Ini
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowManualQuestionListAdd(!showManualQuestionListAdd)}
                              className="text-[11px] font-bold text-[#3b5bf5] hover:underline flex items-center gap-1"
                            >
                              <span>{showManualQuestionListAdd ? 'Sembunyikan Detail Soal' : 'Lihat / Sesuaikan Soal Manual'}</span>
                              {showManualQuestionListAdd ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Opsional: Rincian Soal jika Guru ingin melihat / sesuaikan manual */}
                        {showManualQuestionListAdd && (
                          <div className="max-h-52 overflow-y-auto space-y-2 pr-1 rounded-2xl bg-slate-50 p-3 border border-slate-200">
                            {availableBankQuestions.map((q, idx) => {
                              const isChecked = formData.selectedQuestions.includes(q.id);
                              return (
                                <label
                                  key={q.id}
                                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                    isChecked
                                      ? 'bg-blue-50/80 border-[#3b5bf5]/40 text-slate-900 font-semibold shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      const updated = isChecked
                                        ? formData.selectedQuestions.filter(id => id !== q.id)
                                        : [...formData.selectedQuestions, q.id];
                                      setFormData({ ...formData, selectedQuestions: updated });
                                    }}
                                    className="mt-0.5 rounded border-slate-300 text-[#3b5bf5] focus:ring-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      <span className="font-extrabold text-[#3b5bf5]">Soal #{idx + 1}</span>
                                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-50 text-indigo-700 font-bold">
                                        Paket: {q.category_name || 'Umum'}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-medium">
                                        {q.question_type === 'multiple_choice' ? 'Pilihan Ganda' :
                                         q.question_type === 'true_false' ? 'Benar / Salah' :
                                         q.question_type === 'short_answer' ? 'Isian Singkat' : 'Esai'}
                                      </span>
                                      <span className="text-[10px] text-amber-600 font-bold">{q.points} Poin</span>
                                    </div>
                                    <p className="line-clamp-2 text-slate-700 text-xs font-normal">{q.question_text}</p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

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
                  Terbitkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Tugas / Ujian */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#3b5bf5]" />
                Edit Tugas atau Ujian
              </h4>
              <button onClick={() => setEditingAssignment(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Tugas / Ujian *</label>
                <input
                  type="text"
                  required
                  value={editingAssignment.title}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mata Pelajaran *</label>
                  <select
                    value={editingAssignment.subject_id}
                    onChange={(e) => {
                      const nextSubId = e.target.value;
                      const nextPackages = getPackagesForSubject(nextSubId);
                      const firstPkg = nextPackages[0];
                      const nextQIds = firstPkg
                        ? firstPkg.questionIds
                        : questions.filter(q => q.subject_id === nextSubId).map(q => q.id);
                      const nextLinkedClasses = getLinkedClassesForSubject(nextSubId);
                      setEditingAssignment({
                        ...editingAssignment,
                        subject_id: nextSubId,
                        class_id: nextLinkedClasses.length === 1 ? nextLinkedClasses[0].id : null,
                        class_ids: nextLinkedClasses.map(c => c.id),
                        category_name: firstPkg ? firstPkg.name : null,
                        question_ids: nextQIds
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                {/* Multi-Kelas Target Selector saat Edit */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  {(() => {
                    const linkedClasses = getLinkedClassesForSubject(editingAssignment.subject_id);
                    const currentClassIds = Array.isArray(editingAssignment.class_ids) && editingAssignment.class_ids.length > 0
                      ? editingAssignment.class_ids
                      : (editingAssignment.class_id ? [editingAssignment.class_id] : []);
                    const allSelected = linkedClasses.length > 0 && linkedClasses.every(c => currentClassIds.includes(c.id));

                    return (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                            <School className="w-4 h-4 text-[#3b5bf5]" />
                            Kelas Target (Sesuai Mapel) *
                            <span className="text-[10px] font-bold text-[#3b5bf5]">
                              ({currentClassIds.length} dari {linkedClasses.length} Kelas Dipilih)
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setEditingAssignment({
                              ...editingAssignment,
                              class_ids: linkedClasses.map(c => c.id),
                              class_id: linkedClasses.length === 1 ? linkedClasses[0].id : null,
                            })}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              allSelected
                                ? 'bg-[#3b5bf5] text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-[#3b5bf5]'
                            }`}
                          >
                            Semua Kelas Mapel Ini
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {linkedClasses.map((c) => {
                            const isSelected = currentClassIds.includes(c.id);
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  const nextIds = isSelected
                                    ? currentClassIds.filter(id => id !== c.id)
                                    : [...currentClassIds, c.id];
                                  setEditingAssignment({
                                    ...editingAssignment,
                                    class_ids: nextIds,
                                    class_id: nextIds.length === 1 ? nextIds[0] : null,
                                  });
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                                  isSelected
                                    ? 'bg-blue-50 border-[#3b5bf5] text-[#3b5bf5] shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                  isSelected ? 'bg-[#3b5bf5] border-[#3b5bf5] text-white' : 'border-slate-300 bg-slate-50'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3" />}
                                </span>
                                <span>{c.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipe Kegiatan</label>
                  <select
                    value={editingAssignment.type}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, type: e.target.value as AssignmentType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    <option value="quiz">Kuis Interaktif</option>
                    <option value="assignment">Pengumpulan Tugas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Durasi (Menit)</label>
                  <input
                    type="number"
                    value={editingAssignment.duration_minutes || 60}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, duration_minutes: Number(e.target.value) })}
                    disabled={editingAssignment.type !== 'quiz'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 disabled:opacity-40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Nilai</label>
                  <input
                    type="number"
                    value={editingAssignment.total_points}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, total_points: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Kegiatan</label>
                <select
                  value={editingAssignment.is_active ? 'true' : 'false'}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, is_active: e.target.value === 'true' })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                >
                  <option value="true">Aktif (Dapat Dikerjakan Siswa)</option>
                  <option value="false">Terkunci / Nonaktif</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Petunjuk Pengerjaan</label>
                <textarea
                  rows={3}
                  value={editingAssignment.description || ''}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                  placeholder="Aturan pengerjaan, kejujuran, dan materi yang dicakup..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              {/* Pemilihan Paket / Butir Soal untuk Kuis / Ujian saat Edit */}
              {editingAssignment.type === 'quiz' && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {(() => {
                    const availableBankQuestions = questions.filter(q => q.subject_id === editingAssignment.subject_id);
                    const subjectPackages = getPackagesForSubject(editingAssignment.subject_id);
                    const selectedIds = editingAssignment.question_ids || [];

                    if (availableBankQuestions.length === 0) {
                      return (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            Belum ada butir soal di Bank Soal untuk mata pelajaran ini. Silakan buat butir soal terlebih dahulu di menu <strong>Bank Soal</strong>.
                          </span>
                        </div>
                      );
                    }

                    return (
                      <>
                        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                          <div>
                            <label className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                              <FolderKanban className="w-4 h-4 text-[#3b5bf5]" />
                              Panggil Paket Soal dari Bank Soal
                            </label>
                            <p className="text-[11px] text-indigo-700/80 font-medium mt-0.5">
                              Klik paket soal untuk mengganti pilihan soal secara instan
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {subjectPackages.map((pkg) => {
                              const isPkgActive =
                                pkg.questionIds.every(id => selectedIds.includes(id)) &&
                                selectedIds.length === pkg.questionIds.length;

                              return (
                                <button
                                  key={pkg.name}
                                  type="button"
                                  onClick={() => {
                                    setEditingAssignment({
                                      ...editingAssignment,
                                      category_name: pkg.name,
                                      question_ids: pkg.questionIds,
                                      total_points: pkg.totalPoints > 0 ? pkg.totalPoints : editingAssignment.total_points,
                                    });
                                  }}
                                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                    isPkgActive
                                      ? 'bg-[#3b5bf5] text-white border-[#3b5bf5] shadow-md shadow-blue-500/20'
                                      : 'bg-white border-indigo-200/80 text-slate-800 hover:border-[#3b5bf5]'
                                  }`}
                                >
                                  <div>
                                    <span className="text-xs font-extrabold block">Paket: {pkg.name}</span>
                                    <span className={`text-[10px] font-semibold ${isPkgActive ? 'text-blue-100' : 'text-slate-500'}`}>
                                      {pkg.questionIds.length} Butir Soal &bull; {pkg.totalPoints} Poin
                                    </span>
                                  </div>
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                    isPkgActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-[#3b5bf5]'
                                  }`}>
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between text-xs">
                            <span className="font-bold text-indigo-950">
                              ✓ {selectedIds.length} Butir Soal Terpilih
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowManualQuestionListEdit(!showManualQuestionListEdit)}
                              className="text-[11px] font-bold text-[#3b5bf5] hover:underline flex items-center gap-1"
                            >
                              <span>{showManualQuestionListEdit ? 'Sembunyikan Detail Soal' : 'Lihat / Sesuaikan Soal Manual'}</span>
                              {showManualQuestionListEdit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {showManualQuestionListEdit && (
                          <div className="max-h-52 overflow-y-auto space-y-2 pr-1 rounded-2xl bg-slate-50 p-3 border border-slate-200">
                            {availableBankQuestions.map((q, idx) => {
                              const isChecked = selectedIds.includes(q.id);
                              return (
                                <label
                                  key={q.id}
                                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                    isChecked
                                      ? 'bg-blue-50/80 border-[#3b5bf5]/40 text-slate-900 font-semibold shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      const updated = isChecked
                                        ? selectedIds.filter(id => id !== q.id)
                                        : [...selectedIds, q.id];
                                      setEditingAssignment({ ...editingAssignment, question_ids: updated });
                                    }}
                                    className="mt-0.5 rounded border-slate-300 text-[#3b5bf5] focus:ring-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      <span className="font-extrabold text-[#3b5bf5]">Soal #{idx + 1}</span>
                                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-50 text-indigo-700 font-bold">
                                        Paket: {q.category_name || 'Umum'}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-medium">
                                        {q.question_type === 'multiple_choice' ? 'Pilihan Ganda' :
                                         q.question_type === 'true_false' ? 'Benar / Salah' :
                                         q.question_type === 'short_answer' ? 'Isian Singkat' : 'Esai'}
                                      </span>
                                      <span className="text-[10px] text-amber-600 font-bold">{q.points} Poin</span>
                                    </div>
                                    <p className="line-clamp-2 text-slate-700 text-xs font-normal">{q.question_text}</p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
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

      {/* Confirmation Dialog: Terbitkan Kuis Tanpa Soal */}
      <ConfirmDialog
        isOpen={showZeroQuestionConfirm}
        onClose={() => setShowZeroQuestionConfirm(false)}
        onConfirm={executeCreate}
        title="Terbitkan Kuis Tanpa Butir Soal?"
        description="Anda belum memilih paket atau butir soal dari Bank Soal untuk kuis ini. Apakah Anda yakin ingin tetap menerbitkan kuis ini sekarang?"
        confirmLabel="Ya, Tetap Terbitkan"
        cancelLabel="Batal & Pilih Soal"
        variant="warning"
      />

      {/* Confirmation Dialog: Hapus Tugas / Ujian */}
      <ConfirmDialog
        isOpen={Boolean(asgToDelete)}
        onClose={() => setAsgToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Yakin Ingin Menghapus "${asgToDelete?.title || 'Tugas ini'}"?`}
        description="Tugas/ujian ini beserta seluruh riwayat pengumpulan siswa akan dihapus dari sistem."
        confirmLabel="Ya, Hapus Tugas"
        cancelLabel="Batal"
        variant="danger"
        icon="trash"
      />
    </div>
  );
};
