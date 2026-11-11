import React, { useState } from 'react';
import {
  UserCheck,
  Check,
  X,
  GraduationCap,
  ShieldCheck,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  User,
  School
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { UserRegistrationRequest } from '../../../types/database.types';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export const AdminApprovals: React.FC = () => {
  const { userRegistrations, approveRegistration, rejectRegistration } = useData();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'student' | 'admin'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<{ id: string; name: string } | null>(null);

  const pendingCount = userRegistrations.filter(r => r.status === 'pending').length;
  const approvedCount = userRegistrations.filter(r => r.status === 'approved').length;
  const rejectedCount = userRegistrations.filter(r => r.status === 'rejected').length;

  const filteredList = userRegistrations.filter((item) => {
    // Tab Filter
    if (activeFilter === 'pending' && item.status !== 'pending') return false;
    if (activeFilter === 'student' && item.role !== 'student') return false;
    if (activeFilter === 'admin' && item.role !== 'admin') return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.full_name.toLowerCase().includes(q);
      const matchUser = item.username.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchExtra = (item.identifier_extra || '').toLowerCase().includes(q);
      return matchName || matchUser || matchEmail || matchExtra;
    }

    return true;
  });

  const handleApprove = async (id: string, name: string) => {
    const res = await approveRegistration(id);
    if (res.success) {
      setActionNotice(`Pendaftaran atas nama "${name}" berhasil disetujui! Akun sekarang sudah aktif.`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingRequest) return;
    const { id, name } = rejectingRequest;
    setRejectingRequest(null);
    const res = await rejectRegistration(id);
    if (res.success) {
      setActionNotice(`Pendaftaran atas nama "${name}" telah ditolak.`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menunggu Persetujuan</p>
            <h3 className="text-3xl font-extrabold text-amber-500 mt-1">{pendingCount}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Membutuhkan konfirmasi Anda</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telah Disetujui</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{approvedCount}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Akun aktif di sistem</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Rejected Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ditolak</p>
            <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{rejectedCount}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Pendaftaran tidak disetujui</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Menunggu ({pendingCount})</span>
            </button>

            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-[#3b5bf5] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({userRegistrations.length})
            </button>

            <button
              onClick={() => setActiveFilter('student')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeFilter === 'student'
                  ? 'bg-[#3b5bf5] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Siswa</span>
            </button>

            <button
              onClick={() => setActiveFilter('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeFilter === 'admin'
                  ? 'bg-[#3b5bf5] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guru</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NISN, email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3b5bf5]"
            />
          </div>
        </div>

        {/* Requests List */}
        {filteredList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <UserCheck className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-700">Tidak ada pendaftaran yang perlu ditinjau</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeFilter === 'pending'
                ? 'Semua pendaftaran akun telah diproses oleh Admin Utama.'
                : 'Tidak ada data pendaftaran yang cocok dengan filter ini.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 rounded-2xl px-3 -mx-3"
              >
                {/* Candidate Info */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      item.role === 'student'
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    }`}
                  >
                    {item.role === 'student' ? (
                      <GraduationCap className="w-6 h-6" />
                    ) : (
                      <ShieldCheck className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-extrabold text-slate-900">{item.full_name}</h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.role === 'student'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.role === 'student' ? 'Calon Siswa' : 'Calon Pengajar'}
                      </span>

                      {/* Status Tag */}
                      {item.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Menunggu</span>
                        </span>
                      )}
                      {item.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Aktif / Disetujui</span>
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          <span>Ditolak</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-slate-500 font-medium mt-1.5">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>@{item.username}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.email}</span>
                      </span>

                      {item.role === 'student' && item.identifier_extra && (
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <span>NISN: {item.identifier_extra}</span>
                        </span>
                      )}

                      {item.role === 'student' && item.className && (
                        <span className="flex items-center gap-1">
                          <School className="w-3.5 h-3.5 text-slate-400" />
                          <span>Kelas: {item.className}</span>
                        </span>
                      )}

                      {item.role === 'admin' && item.identifier_extra && (
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <span>NIP/Mapel: {item.identifier_extra}</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        Daftar: {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {item.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(item.id, item.full_name)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                        title="Setujui pendaftaran ini"
                      >
                        <Check className="w-4 h-4" />
                        <span>Terima</span>
                      </button>

                      <button
                        onClick={() => setRejectingRequest({ id: item.id, name: item.full_name })}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        title="Tolak pendaftaran ini"
                      >
                        <X className="w-4 h-4" />
                        <span>Tolak</span>
                      </button>
                    </>
                  ) : item.status === 'approved' ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sudah Disetujui</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span>Ditolak</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog: Reject Registration */}
      <ConfirmDialog
        isOpen={!!rejectingRequest}
        onClose={() => setRejectingRequest(null)}
        onConfirm={handleConfirmReject}
        title="Tolak Pendaftaran Akun?"
        description={`Apakah Anda yakin ingin menolak permohonan pendaftaran akun dari "${rejectingRequest?.name}"? Pendaftar tidak akan mendapatkan akses masuk ke sistem.`}
        confirmText="Ya, Tolak Akun"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
};

export default AdminApprovals;
