import React, { useState, useRef } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Globe,
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Trash2,
  Plus,
  Upload,
  Image as ImageIcon,
  Compass,
  Award,
  X,
  RefreshCw,
  Database
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings, announcements, addAnnouncement, deleteAnnouncement, clearLocalCache, retrySupabaseConnection } = useData();

  const [announcementToDelete, setAnnouncementToDelete] = useState<{ id: string; title: string } | null>(null);
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);

  const [formData, setFormData] = useState({
    site_name: siteSettings.site_name,
    tagline: siteSettings.tagline,
    browser_title:
      siteSettings.browser_title || 'NEXORA × SMK MARHAS — Platform E-Learning Terpadu',
    logo_url: siteSettings.logo_url || '',
    teacher_name: siteSettings.teacher_name,
    teacher_bio: siteSettings.teacher_bio,
    teacher_photo_url: siteSettings.teacher_photo_url || '',
    teacher_commitment: siteSettings.teacher_commitment || 'Pembelajaran Interaktif & Terarah',
    teacher_specialty: siteSettings.teacher_specialty || 'Matematika & Sains Digital',
    contact_email: siteSettings.contact_email,
    contact_phone: siteSettings.contact_phone,
    contact_address: siteSettings.contact_address,
    accent_color: siteSettings.accent_color,
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Fungsi Upload Logo Website dari Perangkat (PNG/JPG/SVG/WebP)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar logo yang valid (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file logo terlalu besar. Maksimal 5MB.');
      return;
    }

    setIsUploadingLogo(true);

    try {
      let uploadedUrl: string | null = null;
      if (isSupabaseConfigured) {
        try {
          const fileExt = file.name.split('.').pop() || 'png';
          const fileName = `site_logo_${Date.now()}.${fileExt}`;
          const filePath = `logos/${fileName}`;

          const { error: uploadErr } = await supabase.storage
            .from('nexora-files')
            .upload(filePath, file, { cacheControl: '3600', upsert: true });

          if (!uploadErr) {
            const { data: publicUrlData } = supabase.storage
              .from('nexora-files')
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              uploadedUrl = publicUrlData.publicUrl;
            }
          }
        } catch (storageErr) {
          console.warn('Logo storage upload notice (falling back to Base64):', storageErr);
        }
      }

      if (!uploadedUrl) {
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const resultStr = event.target?.result as string;
            if (file.type === 'image/svg+xml') {
              resolve(resultStr);
              return;
            }
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const maxDim = 400;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/png', 0.92));
              } else {
                resolve(resultStr);
              }
            };
            img.onerror = () => resolve(resultStr);
            img.src = resultStr;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      setFormData(prev => ({ ...prev, logo_url: uploadedUrl || '' }));
      await updateSiteSettings({ logo_url: uploadedUrl || null });
      showNotif('Logo website berhasil diunggah dan langsung diterapkan!');
    } catch (err: any) {
      console.error('Error uploading logo:', err);
      alert('Gagal memproses logo: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Fungsi Upload Foto Manual dari Perangkat
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
      return;
    }

    // Maksimal 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Coba upload ke Supabase Storage terlebih dahulu jika terkoneksi
      let uploadedUrl: string | null = null;
      if (isSupabaseConfigured) {
        try {
          const fileExt = file.name.split('.').pop() || 'png';
          const fileName = `teacher_profile_${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadErr } = await supabase.storage
            .from('nexora-files')
            .upload(filePath, file, { cacheControl: '3600', upsert: true });

          if (!uploadErr) {
            const { data: publicUrlData } = supabase.storage
              .from('nexora-files')
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              uploadedUrl = publicUrlData.publicUrl;
            }
          }
        } catch (storageErr) {
          console.warn('Storage upload notice (falling back to Base64):', storageErr);
        }
      }

      // 2. Jika storage belum aktif atau offline, gunakan Base64 Data URL terkompresi
      if (!uploadedUrl) {
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const maxDim = 600;

              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                resolve(dataUrl);
              } else {
                resolve(event.target?.result as string);
              }
            };
            img.onerror = () => resolve(event.target?.result as string);
            img.src = event.target?.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      setFormData(prev => ({ ...prev, teacher_photo_url: uploadedUrl }));
      showNotif('Foto pengajar berhasil dipilih dan diunggah!');
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      alert('Gagal memproses foto: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateSiteSettings(formData);
    if (res.success) {
      showNotif('Pengaturan website NEXORA berhasil disimpan & tersinkronisasi!');
    } else {
      showNotif('Perhatian: Tersimpan secara lokal, error server: ' + (res.error || ''));
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    await addAnnouncement({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      target_role: 'all',
      class_id: null,
      is_active: true,
      created_by: 'p-admin',
    });

    setNewAnnouncement({ title: '', content: '' });
    showNotif('Pengumuman baru berhasil diterbitkan!');
  };

  const handleConfirmDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    const { id, title } = announcementToDelete;
    setAnnouncementToDelete(null);
    await deleteAnnouncement(id);
    showNotif(`Pengumuman "${title}" berhasil dihapus.`);
  };

  const handleConfirmClearCache = async () => {
    setShowClearCacheConfirm(false);
    await clearLocalCache();
    showNotif('Cache browser berhasil dibersihkan & disinkronkan!');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#3b5bf5] border border-blue-200/80 text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Pusat Konfigurasi Sistem LMS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Pengaturan Website & Identitas Brand</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Ubah konfigurasi nama brand platform, foto dan profil pengajar, komitmen, spesialisasi, pengumuman sekolah, serta sinkronisasi data
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Platform Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#3b5bf5]" />
            Identitas Platform LMS
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Platform LMS</label>
              <input
                type="text"
                required
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tagline Resmi</label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Judul Tab Browser (Browser Title)
            </label>
            <input
              type="text"
              value={formData.browser_title}
              onChange={(e) => setFormData({ ...formData, browser_title: e.target.value })}
              placeholder="NEXORA × SMK MARHAS — Platform E-Learning Terpadu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
            />
          </div>

          {/* Upload Logo Website & Favicon */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0">
              {formData.logo_url ? (
                <img src={formData.logo_url} alt="Logo Website" className="w-full h-full object-contain p-1.5" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <p className="text-xs font-bold text-slate-900">Logo Website &amp; Favicon Browser</p>
              <p className="text-[11px] text-slate-500">
                Unggah logo sekolah / platform (PNG, JPG, SVG, WebP) untuk favicon tab browser &amp; branding.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  type="file"
                  ref={logoInputRef}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingLogo}
                  onClick={() => logoInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingLogo ? 'Mengunggah...' : 'Pilih & Upload Logo'}</span>
                </button>
                {formData.logo_url && (
                  <button
                    type="button"
                    onClick={async () => {
                      setFormData(prev => ({ ...prev, logo_url: '' }));
                      await updateSiteSettings({ logo_url: null });
                      showNotif('Logo custom dihapus, kembali ke logo default.');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset Logo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Profile & Teaching Specialization */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-[#3b5bf5]" />
            Profil Pengajar, Komitmen & Spesialisasi (Tampil di Landing Page)
          </h4>

          {/* Upload Foto Manual Profil Pengajar */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#3b5bf5]/30 shadow-md bg-white flex items-center justify-center">
                {formData.teacher_photo_url ? (
                  <img
                    src={formData.teacher_photo_url}
                    alt={formData.teacher_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <div>
                <p className="text-xs font-bold text-slate-900">Foto Profil Pengajar</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Unggah langsung foto Anda dari HP / Komputer tanpa perlu menyalin link URL.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="teacher-photo-upload"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Sedang Memproses Foto...' : 'Pilih & Upload Foto Manual'}</span>
                </button>

                {formData.teacher_photo_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, teacher_photo_url: '' })}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap & Gelar</label>
              <input
                type="text"
                required
                value={formData.teacher_name}
                onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                URL Foto Alternatif (Opsional jika ingin pakai link luar)
              </label>
              <input
                type="text"
                value={formData.teacher_photo_url.startsWith('data:') ? '(Foto tersimpan secara internal)' : formData.teacher_photo_url}
                onChange={(e) => setFormData({ ...formData, teacher_photo_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Biodata / Deskripsi Pengajar</label>
            <textarea
              rows={3}
              value={formData.teacher_bio}
              onChange={(e) => setFormData({ ...formData, teacher_bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
            />
          </div>

          {/* Komitmen Pengajaran & Spesialisasi Pengajar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#3b5bf5]" />
                <span>Komitmen Pengajaran (Kotak Kiri di Landing Page)</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Pembelajaran Interaktif & Terarah"
                value={formData.teacher_commitment}
                onChange={(e) => setFormData({ ...formData, teacher_commitment: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#3b5bf5]" />
                <span>Spesialisasi Pengajar (Kotak Kanan di Landing Page)</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Matematika & Sains Digital"
                value={formData.teacher_specialty}
                onChange={(e) => setFormData({ ...formData, teacher_specialty: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#1cd485]" />
            Informasi Kontak Resmi
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Kontak</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Telepon / WA</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Lembaga / Sekolah</label>
            <input
              type="text"
              value={formData.contact_address}
              onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5] focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Pengaturan Website</span>
          </button>
        </div>
      </form>

      {/* Announcements Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          Kelola Pengumuman Sekolah
        </h4>

        <form onSubmit={handleAddAnnouncement} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h5 className="text-xs font-bold text-slate-800">Buat Pengumuman Baru</h5>
          <input
            type="text"
            required
            placeholder="Judul Pengumuman..."
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5]"
          />
          <textarea
            rows={2}
            required
            placeholder="Isi pesan pengumuman..."
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bf5]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3b5bf5] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Terbitkan Pengumuman</span>
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{ann.title}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{ann.content}</p>
              </div>
              <button
                onClick={() => setAnnouncementToDelete({ id: ann.id, title: ann.title })}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Hapus pengumuman"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Database Sync & Cache Purge */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#3b5bf5]" />
          Sinkronisasi Database & Pembersihan Cache Browser
        </h4>
        <p className="text-xs text-slate-500 font-medium">
          Jika Anda telah menghapus atau mengubah data di Supabase dan browser masih menampilkan cache lama, gunakan opsi di bawah ini untuk sinkronisasi seketika.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={async () => {
              await retrySupabaseConnection();
              showNotif('Data berhasil disinkronkan langsung dari Supabase!');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#3b5bf5]" />
            <span>Segarkan Data dari Supabase</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearCacheConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-bold text-rose-600 transition-all shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Bersihkan Cache Browser & Muat Ulang</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog: Delete Announcement */}
      <ConfirmDialog
        isOpen={!!announcementToDelete}
        onClose={() => setAnnouncementToDelete(null)}
        onConfirm={handleConfirmDeleteAnnouncement}
        title="Hapus Pengumuman?"
        description={`Apakah Anda yakin ingin menghapus pengumuman "${announcementToDelete?.title}"? Pengumuman tidak akan tampil lagi di dashboard siswa.`}
        confirmText="Ya, Hapus Pengumuman"
        cancelText="Batal"
        variant="danger"
      />

      {/* Confirmation Dialog: Clear Cache */}
      <ConfirmDialog
        isOpen={showClearCacheConfirm}
        onClose={() => setShowClearCacheConfirm(false)}
        onConfirm={handleConfirmClearCache}
        title="Bersihkan Cache Browser?"
        description="Apakah Anda yakin ingin membersihkan seluruh cache lokal (localStorage) dan memuat ulang data asli langsung dari database Supabase? Halaman akan diperbarui otomatis."
        confirmText="Ya, Bersihkan & Muat Ulang"
        cancelText="Batal"
        variant="warning"
      />
    </div>
  );
};
