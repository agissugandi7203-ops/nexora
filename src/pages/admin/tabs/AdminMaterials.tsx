import React, { useState } from 'react';
import {
  FileCode2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  BookOpen,
  School,
  FileText,
  Video,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Search,
  Download,
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { LearningMaterial } from '../../../types/database.types';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export const AdminMaterials: React.FC = () => {
  const { materials, subjects, classes, addMaterial, updateMaterial, deleteMaterial } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [viewingMaterial, setViewingMaterial] = useState<LearningMaterial | null>(null);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [notification, setNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [matToDelete, setMatToDelete] = useState<LearningMaterial | null>(null);

  // Helper: Ambil daftar kelas yang telah dicentang (class_ids) pada Mata Pelajaran tertentu
  const getLinkedClassesForSubject = (subjectId: string) => {
    const sub = subjects.find(s => s.id === subjectId);
    if (sub?.class_ids && sub.class_ids.length > 0) {
      const filtered = classes.filter(c => sub.class_ids!.includes(c.id));
      if (filtered.length > 0) return filtered;
    }
    return classes;
  };

  // Helper: Tentukan nilai default class_id berdasarkan kelas yang dicentang pada Mata Pelajaran
  const getDefaultClassIdForSubject = (subjectId: string) => {
    const linked = getLinkedClassesForSubject(subjectId);
    if (linked.length === 1) {
      return linked[0].id;
    }
    // Jika lebih dari 1 kelas dicentang pada mapel tersebut, default '' berarti "Semua Kelas Mapel Ini"
    return '';
  };

  const initialSubjectId = subjects[0]?.id || '';
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_id: initialSubjectId,
    class_id: getDefaultClassIdForSubject(initialSubjectId),
    content_rich_text: '',
    pdf_url: '',
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    video_url: '',
    order_index: 1,
    is_published: true,
  });

  const handleOpenAddModal = () => {
    const defaultSubId = selectedSubjectFilter !== 'all' ? selectedSubjectFilter : (subjects[0]?.id || '');
    const defaultClsId = getDefaultClassIdForSubject(defaultSubId);
    setFormData({
      title: '',
      description: '',
      subject_id: defaultSubId,
      class_id: defaultClsId,
      content_rich_text: '',
      pdf_url: '',
      image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
      video_url: '',
      order_index: materials.length + 1,
      is_published: true,
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubjectChange = (newSubjectId: string) => {
    const linked = getLinkedClassesForSubject(newSubjectId);
    const nextClassId = linked.length === 1
      ? linked[0].id
      : (linked.some(c => c.id === formData.class_id) ? formData.class_id : '');
    setFormData({
      ...formData,
      subject_id: newSubjectId,
      class_id: nextClassId,
    });
  };

  const handleEditSubjectChange = (newSubjectId: string) => {
    if (!editingMaterial) return;
    const linked = getLinkedClassesForSubject(newSubjectId);
    const nextClassId = linked.length === 1
      ? linked[0].id
      : (editingMaterial.class_id && linked.some(c => c.id === editingMaterial.class_id) ? editingMaterial.class_id : null);
    setEditingMaterial({
      ...editingMaterial,
      subject_id: newSubjectId,
      class_id: nextClassId,
    });
  };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject_id) return;

    const linked = getLinkedClassesForSubject(formData.subject_id);
    const finalClassId = formData.class_id || (linked.length === 1 ? linked[0].id : null);

    await addMaterial({
      title: formData.title,
      description: formData.description,
      subject_id: formData.subject_id,
      class_id: finalClassId,
      content_rich_text: formData.content_rich_text,
      pdf_url: formData.pdf_url || null,
      image_url: formData.image_url || null,
      video_url: formData.video_url || null,
      order_index: Number(formData.order_index),
      is_published: formData.is_published,
      created_by: 'p-admin',
    });

    setIsAddModalOpen(false);
    const nextSubId = selectedSubjectFilter !== 'all' ? selectedSubjectFilter : (subjects[0]?.id || '');
    setFormData({
      title: '',
      description: '',
      subject_id: nextSubId,
      class_id: getDefaultClassIdForSubject(nextSubId),
      content_rich_text: '',
      pdf_url: '',
      image_url: '',
      video_url: '',
      order_index: materials.length + 2,
      is_published: true,
    });
    showNotif('Materi pembelajaran berhasil dipublikasikan!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;

    const linked = getLinkedClassesForSubject(editingMaterial.subject_id);
    const finalClassId = linked.length === 1
      ? linked[0].id
      : (editingMaterial.class_id && linked.some(c => c.id === editingMaterial.class_id) ? editingMaterial.class_id : null);

    const res = await updateMaterial(editingMaterial.id, {
      title: editingMaterial.title,
      description: editingMaterial.description,
      subject_id: editingMaterial.subject_id,
      class_id: finalClassId,
      content_rich_text: editingMaterial.content_rich_text,
      pdf_url: editingMaterial.pdf_url,
      image_url: editingMaterial.image_url,
      video_url: editingMaterial.video_url,
      order_index: Number(editingMaterial.order_index),
      is_published: editingMaterial.is_published,
    });

    if (res && !res.success) {
      alert('Gagal memperbarui materi: ' + (res.error || 'Terjadi kesalahan pada database'));
      return;
    }

    setEditingMaterial(null);
    showNotif('Materi pembelajaran berhasil diperbarui!');
  };

  const handleConfirmDelete = async () => {
    if (!matToDelete) return;
    const res = await deleteMaterial(matToDelete.id);
    if (res && !res.success) {
      showNotif('Gagal menghapus materi: ' + (res.error || 'Terjadi kesalahan pada database'));
    } else {
      showNotif(`Materi "${matToDelete.title}" berhasil dihapus.`);
    }
    setMatToDelete(null);
  };

  const filteredMaterials = materials.filter(m => {
    const q = searchTerm.trim().toLowerCase();
    const matchSubject = selectedSubjectFilter === 'all' || m.subject_id === selectedSubjectFilter;
    if (!q) return matchSubject;
    const sub = subjects.find(s => s.id === m.subject_id);
    const cls = classes.find(c => c.id === m.class_id);
    const matchSearch =
      m.title.toLowerCase().includes(q) ||
      (m.description || '').toLowerCase().includes(q) ||
      `bab ${m.order_index}`.toLowerCase().includes(q) ||
      (sub?.name || '').toLowerCase().includes(q) ||
      (cls?.name || '').toLowerCase().includes(q);
    return matchSubject && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Materi Pembelajaran Digital</h3>
          <p className="text-xs text-slate-500 font-medium">
            Kelola bab pelajaran, modul materi, link video, dan dokumen lampiran PDF
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Materi Baru</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari materi pembelajaran..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">Mata Pelajaran:</span>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
          >
            <option value="all">Semua Mapel ({materials.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid (Card Layout with clear visual hierarchy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              {searchTerm ? `Tidak ada materi yang cocok dengan "${searchTerm}"` : 'Tidak ada materi pembelajaran'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm ? 'Coba periksa kata kunci Anda atau bersihkan pencarian.' : 'Coba sesuaikan filter mata pelajaran atau tambahkan materi baru.'}
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
          filteredMaterials.map((mat) => {
            const subject = subjects.find(s => s.id === mat.subject_id);
            const cls = classes.find(c => c.id === mat.class_id);
            const subjectLinkedClasses = getLinkedClassesForSubject(mat.subject_id);
            const targetClassLabel = cls
              ? cls.name
              : subjectLinkedClasses.length > 0 && subject?.class_ids && subject.class_ids.length > 0
                ? subjectLinkedClasses.map(c => c.name).join(', ')
                : 'Semua Kelas';

            return (
              <div
                key={mat.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between group hover:border-[#3b5bf5]/40 hover:shadow-md transition-all"
              >
                <div>
                  {/* Top Row: Order Badge & Status */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-xs">
                      Bab {mat.order_index}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {mat.is_published ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          Tayang
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subject & Class Tag */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
                    <span className="font-bold text-[#3b5bf5]">{subject?.name || 'Mata Pelajaran'}</span>
                    <span>&bull;</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] text-slate-700 font-semibold truncate max-w-[170px]">
                      {targetClassLabel}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#3b5bf5] transition-colors mb-2 leading-snug line-clamp-2">
                    {mat.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-normal">
                    {mat.description || 'Tidak ada deskripsi pengantar.'}
                  </p>

                  {/* Prominent Direct PDF / Video Download Section */}
                  <div className="space-y-2 mb-4">
                    {mat.pdf_url && (
                      <a
                        href={mat.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100/90 text-rose-800 border border-rose-200/80 text-xs font-bold transition-all flex items-center justify-between shadow-xs group/pdf"
                        title="Buka atau unduh file PDF modul ini secara langsung"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="text-left truncate">
                            <span className="block text-xs font-extrabold text-rose-900 truncate">Dokumen Modul PDF</span>
                            <span className="block text-[10px] text-rose-600 font-medium">Buka / Unduh Langsung</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-white/80 px-2.5 py-1 rounded-lg border border-rose-200 group-hover/pdf:bg-white transition-colors shrink-0">
                          <span>Buka</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </a>
                    )}

                    {mat.video_url && (
                      <a
                        href={mat.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100/90 text-purple-800 border border-purple-200/80 text-xs font-bold transition-all flex items-center justify-between group/vid"
                        title="Buka video tutorial materi pembelajaran"
                      >
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold">Video Penjelasan Pembelajaran</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-purple-600 group-hover/vid:translate-x-0.5 transition-transform" />
                      </a>
                    )}

                    {!mat.pdf_url && !mat.video_url && (
                      <div className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 font-medium flex items-center gap-2">
                        <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Modul bacaan artikel teks terstruktur</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setViewingMaterial(mat)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3b5bf5] hover:text-blue-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Baca Rincian</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingMaterial(mat)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#3b5bf5] transition-colors"
                      title="Edit Materi"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatToDelete(mat)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                      title="Hapus Materi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Tambah Materi Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#3b5bf5]" />
                Buat Materi Pembelajaran Baru
              </h4>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Materi Pembelajaran *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Bab 2: Hukum Newton dan Aplikasinya"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mata Pelajaran *</label>
                  <select
                    value={formData.subject_id}
                    onChange={(e) => handleAddSubjectChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Kelas <span className="text-[10px] font-semibold text-[#3b5bf5]">(Sesuai Mapel)</span>
                  </label>
                  {(() => {
                    const linkedClasses = getLinkedClassesForSubject(formData.subject_id);
                    const selectedSub = subjects.find(s => s.id === formData.subject_id);
                    const hasCheckedClasses = Boolean(selectedSub?.class_ids && selectedSub.class_ids.length > 0);
                    return (
                      <>
                        <select
                          value={linkedClasses.length === 1 ? linkedClasses[0].id : formData.class_id}
                          onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                        >
                          {linkedClasses.length > 1 && (
                            <option value="">
                              {hasCheckedClasses
                                ? `Semua Kelas Mapel Ini (${linkedClasses.map(c => c.name).join(', ')})`
                                : 'Semua Kelas'}
                            </option>
                          )}
                          {linkedClasses.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name}{hasCheckedClasses && linkedClasses.length === 1 ? ' (Sesuai Mapel)' : ''}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                          {hasCheckedClasses
                            ? `Terhubung ke kelas: ${linkedClasses.map(c => c.name).join(', ')}`
                            : 'Mapel ini terbuka untuk semua kelas'}
                        </p>
                      </>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Urutan Bab / Nomor</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan singkat tentang apa yang dipelajari..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Isi Materi Pembelajaran (Mendukung HTML & Formatting) *
                </label>
                <textarea
                  rows={6}
                  value={formData.content_rich_text}
                  onChange={(e) => setFormData({ ...formData, content_rich_text: e.target.value })}
                  placeholder="<h2>Sub Judul</h2><p>Tulis penjelasan materi di sini secara mendalam...</p>"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Lampiran PDF Modul</label>
                  <input
                    type="url"
                    value={formData.pdf_url}
                    onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                    placeholder="https://drive.google.com/... atau file.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Video Pembelajaran</label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  />
                </div>
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
                  Publikasikan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Materi Pembelajaran */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#3b5bf5]" />
                Edit Materi Pembelajaran
              </h4>
              <button onClick={() => setEditingMaterial(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Materi Pembelajaran *</label>
                <input
                  type="text"
                  required
                  value={editingMaterial.title}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mata Pelajaran *</label>
                  <select
                    value={editingMaterial.subject_id}
                    onChange={(e) => handleEditSubjectChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  >
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Kelas <span className="text-[10px] font-semibold text-[#3b5bf5]">(Sesuai Mapel)</span>
                  </label>
                  {(() => {
                    const linkedClasses = getLinkedClassesForSubject(editingMaterial.subject_id);
                    const selectedSub = subjects.find(s => s.id === editingMaterial.subject_id);
                    const hasCheckedClasses = Boolean(selectedSub?.class_ids && selectedSub.class_ids.length > 0);
                    return (
                      <>
                        <select
                          value={linkedClasses.length === 1 ? linkedClasses[0].id : (editingMaterial.class_id || '')}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, class_id: e.target.value || null })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                        >
                          {linkedClasses.length > 1 && (
                            <option value="">
                              {hasCheckedClasses
                                ? `Semua Kelas Mapel Ini (${linkedClasses.map(c => c.name).join(', ')})`
                                : 'Semua Kelas (Umum)'}
                            </option>
                          )}
                          {linkedClasses.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name}{hasCheckedClasses && linkedClasses.length === 1 ? ' (Sesuai Mapel)' : ''}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                          {hasCheckedClasses
                            ? `Terhubung ke kelas: ${linkedClasses.map(c => c.name).join(', ')}`
                            : 'Mapel ini terbuka untuk semua kelas'}
                        </p>
                      </>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Status & Urutan</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={editingMaterial.order_index}
                      onChange={(e) => setEditingMaterial({ ...editingMaterial, order_index: Number(e.target.value) })}
                      className="w-16 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 text-center"
                      title="Urutan Bab"
                    />
                    <select
                      value={editingMaterial.is_published ? 'true' : 'false'}
                      onChange={(e) => setEditingMaterial({ ...editingMaterial, is_published: e.target.value === 'true' })}
                      className="flex-1 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                    >
                      <option value="true">Tayang</option>
                      <option value="false">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Singkat / Ringkasan</label>
                <textarea
                  rows={2}
                  value={editingMaterial.description || ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Isi Konten Materi (Teks Lengkap / HTML)</label>
                <textarea
                  rows={6}
                  value={editingMaterial.content_rich_text || ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, content_rich_text: e.target.value })}
                  placeholder="<h2>Sub Judul</h2><p>Tulis penjelasan materi di sini secara mendalam...</p>"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Lampiran PDF Modul</label>
                  <input
                    type="url"
                    value={editingMaterial.pdf_url || ''}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, pdf_url: e.target.value })}
                    placeholder="https://drive.google.com/... atau file.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Video Pembelajaran</label>
                  <input
                    type="url"
                    value={editingMaterial.video_url || ''}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, video_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
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

      {/* Modal: Pratinjau Materi */}
      {viewingMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5 shrink-0">
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">{viewingMaterial.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{viewingMaterial.description}</p>
              </div>
              <button onClick={() => setViewingMaterial(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-4">
              {viewingMaterial.video_url && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
                    <Video className="w-4 h-4" />
                    <span>Tautan Video Pelajaran</span>
                  </div>
                  <a
                    href={viewingMaterial.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#3b5bf5] font-bold hover:underline flex items-center gap-1"
                  >
                    Buka Video <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {viewingMaterial.pdf_url && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#3b5bf5] text-xs font-bold">
                    <FileText className="w-4 h-4" />
                    <span>Modul Lengkap PDF</span>
                  </div>
                  <a
                    href={viewingMaterial.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#3b5bf5] font-bold hover:underline flex items-center gap-1"
                  >
                    Unduh PDF <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div
                className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed p-6 rounded-2xl bg-slate-50 border border-slate-200/80"
                dangerouslySetInnerHTML={{ __html: viewingMaterial.content_rich_text || '<p>Tidak ada isi teks materi.</p>' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Hapus Materi Pembelajaran */}
      <ConfirmDialog
        isOpen={Boolean(matToDelete)}
        onClose={() => setMatToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Yakin Ingin Menghapus "${matToDelete?.title || 'Materi ini'}"?`}
        description="Materi pembelajaran ini akan dihapus dari sistem dan tidak dapat diakses lagi oleh siswa di kelas terkait."
        confirmLabel="Ya, Hapus Materi"
        cancelLabel="Batal"
        variant="danger"
        icon="trash"
      />
    </div>
  );
};
