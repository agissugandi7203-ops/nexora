import React, { useState } from 'react';
import {
  School,
  Plus,
  Users,
  Edit2,
  Trash2,
  ArrowRightLeft,
  X,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { ClassItem, Student } from '../../../types/database.types';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export const AdminClasses: React.FC = () => {
  const { classes, students, addClass, updateClass, deleteClass, updateStudent } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [inspectClass, setInspectClass] = useState<ClassItem | null>(null);
  const [transferStudent, setTransferStudent] = useState<Student | null>(null);
  const [targetClassId, setTargetClassId] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    level: '7',
    academic_year: '2026/2027',
    description: '',
  });

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    await addClass({
      name: formData.name,
      level: formData.level,
      academic_year: formData.academic_year,
      description: formData.description,
    });

    setIsAddModalOpen(false);
    setFormData({ name: '', level: '7', academic_year: '2026/2027', description: '' });
    showNotif('Kelas baru berhasil ditambahkan!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

    await updateClass(editingClass.id, {
      name: editingClass.name,
      level: editingClass.level,
      academic_year: editingClass.academic_year,
      description: editingClass.description,
    });

    setEditingClass(null);
    showNotif('Informasi kelas berhasil diperbarui!');
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;
    const res = await deleteClass(classToDelete.id);
    if (res && !res.success) {
      showNotif('Gagal menghapus kelas: ' + (res.error || 'Terjadi kesalahan pada database'));
    } else {
      showNotif(`Kelas ${classToDelete.name} berhasil dihapus.`);
    }
    setClassToDelete(null);
  };

  const handleTransfer = async () => {
    if (!transferStudent || !targetClassId) return;

    await updateStudent(transferStudent.id, {
      class_id: targetClassId,
    });

    showNotif(`${transferStudent.profile?.full_name} berhasil dipindahkan ke kelas baru!`);
    setTransferStudent(null);
    setTargetClassId('');
  };

  const availableLevels = Array.from(new Set(classes.map((c) => c.level))).sort();

  const filteredClasses = classes.filter((cls) => {
    const q = searchTerm.trim().toLowerCase();
    const matchLevel = selectedLevel === 'all' || cls.level === selectedLevel;
    if (!q) return matchLevel;

    const matchSearch =
      cls.name.toLowerCase().includes(q) ||
      cls.level.toLowerCase().includes(q) ||
      `tingkat ${cls.level}`.toLowerCase().includes(q) ||
      `kelas ${cls.level}`.toLowerCase().includes(q) ||
      cls.academic_year.toLowerCase().includes(q) ||
      (cls.description || '').toLowerCase().includes(q);

    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-white border border-emerald-300 text-emerald-800 text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Manajemen Kelas</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Kelola tingkatan kelas (SMP/SMA/Umum), daftar rombel, dan penempatan siswa sekolah
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
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
            placeholder="Cari nama kelas, tingkat, atau tahun ajaran..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedLevel('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Semua ({classes.length})
          </button>
          {availableLevels.map((lvl) => {
            const count = classes.filter((c) => c.level === lvl).length;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-[#3b5bf5] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                Tingkat {lvl} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <School className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              {searchTerm ? `Tidak ada kelas yang cocok dengan "${searchTerm}"` : 'Tidak ada kelas'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm ? 'Coba periksa kata kunci Anda atau klik tombol di bawah untuk menyetel ulang.' : 'Belum ada kelas yang terdaftar di sistem.'}
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
          filteredClasses.map((cls) => {
            const classStudents = students.filter((s) => s.class_id === cls.id);

            return (
              <div
                key={cls.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between group hover:shadow-md hover:border-[#3b5bf5]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#3b5bf5] border border-blue-200/80 text-[11px] font-bold">
                      Tingkat {cls.level} &bull; {cls.academic_year}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingClass(cls)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Edit Kelas"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setClassToDelete(cls)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                        title="Hapus Kelas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">
                    {cls.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-6 line-clamp-2 leading-relaxed font-medium">
                    {cls.description || 'Tidak ada catatan deskripsi khusus.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar stack */}
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {classStudents.slice(0, 3).map((st) => (
                        <img
                          key={st.id}
                          src={
                            st.profile?.avatar_url ||
                            `https://api.dicebear.com/7.x/bottts/svg?seed=${st.nis_nisn}`
                          }
                          alt=""
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover bg-slate-100"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {classStudents.length} Siswa
                    </span>
                  </div>

                  <button
                    onClick={() => setInspectClass(cls)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#3b5bf5] hover:text-blue-700 transition-colors group-hover:translate-x-0.5 transform"
                  >
                    <span>Daftar Siswa</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Tambah Kelas */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <School className="w-4 h-4 text-[#3b5bf5]" />
                Buat Kelas Baru
              </h4>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Kelas 7A atau 10 MIPA 1"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tingkatan *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#3b5bf5]"
                  >
                    <option value="7">Kelas 7 (SMP)</option>
                    <option value="8">Kelas 8 (SMP)</option>
                    <option value="9">Kelas 9 (SMP)</option>
                    <option value="10">Kelas 10 (SMA)</option>
                    <option value="11">Kelas 11 (SMA)</option>
                    <option value="12">Kelas 12 (SMA)</option>
                    <option value="Umum">Umum / Kursus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#3b5bf5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keterangan / Ruang</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Catatan kelas, wali kelas, atau ruang pembelajaran..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#3b5bf5]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Kelas */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#3b5bf5]" />
                Perbarui Data Kelas
              </h4>
              <button onClick={() => setEditingClass(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tingkatan *</label>
                  <select
                    value={editingClass.level}
                    onChange={(e) => setEditingClass({ ...editingClass, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  >
                    <option value="7">Kelas 7 (SMP)</option>
                    <option value="8">Kelas 8 (SMP)</option>
                    <option value="9">Kelas 9 (SMP)</option>
                    <option value="10">Kelas 10 (SMA)</option>
                    <option value="11">Kelas 11 (SMA)</option>
                    <option value="12">Kelas 12 (SMA)</option>
                    <option value="Umum">Umum / Kursus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={editingClass.academic_year}
                    onChange={(e) => setEditingClass({ ...editingClass, academic_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keterangan / Ruang</label>
                <textarea
                  rows={3}
                  value={editingClass.description || ''}
                  onChange={(e) => setEditingClass({ ...editingClass, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inspeksi Siswa dalam Kelas */}
      {inspectClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5 shrink-0">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#3b5bf5]" />
                  Daftar Siswa {inspectClass.name}
                </h4>
                <p className="text-xs text-slate-400">Total {students.filter(s => s.class_id === inspectClass.id).length} siswa terdaftar</p>
              </div>
              <button onClick={() => setInspectClass(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-2">
              {students.filter(s => s.class_id === inspectClass.id).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs rounded-2xl bg-slate-50 border border-slate-100">
                  Belum ada siswa yang ditempatkan di kelas ini.
                </div>
              ) : (
                students.filter(s => s.class_id === inspectClass.id).map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={st.profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${st.nis_nisn}`}
                        alt={st.profile?.full_name}
                        className="w-9 h-9 rounded-xl bg-slate-200 object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{st.profile?.full_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">NISN: {st.nis_nisn} &bull; @{st.profile?.username}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTransferStudent(st);
                        setInspectClass(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#3b5bf5] text-xs font-semibold shadow-xs"
                      title="Pindahkan ke kelas lain"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Pindah Kelas</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setInspectClass(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Pindah Rombel / Mutasi Kelas */}
      {transferStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#3b5bf5]" />
                Mutasi / Pindah Kelas
              </h4>
              <button onClick={() => setTransferStudent(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block mb-0.5">Siswa yang Dipindahkan:</span>
                <p className="text-xs font-bold text-slate-900">{transferStudent.profile?.full_name}</p>
                <p className="text-[10px] text-slate-500">NISN: {transferStudent.nis_nisn}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pilih Kelas Tujuan Baru *</label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#3b5bf5]"
                >
                  <option value="">-- Pilih Kelas Tujuan --</option>
                  {classes
                    .filter((c) => c.id !== transferStudent.class_id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Tingkat {c.level})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTransferStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleTransfer}
                  disabled={!targetClassId}
                  className="px-5 py-2 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white text-xs font-semibold disabled:opacity-40 shadow-md shadow-blue-500/20"
                >
                  Konfirmasi Pindah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Hapus Kelas */}
      <ConfirmDialog
        isOpen={Boolean(classToDelete)}
        onClose={() => setClassToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Yakin Ingin Menghapus Kelas ${classToDelete?.name || ''}?`}
        description="Kelas ini akan dihapus dari sistem. Siswa yang terdaftar pada kelas ini akan dilepas penempatannya dan dapat Anda tempatkan ulang ke kelas lain."
        confirmLabel="Ya, Hapus Kelas"
        cancelLabel="Batal"
        variant="danger"
        icon="trash"
      />
    </div>
  );
};
