# NEXORA — Premium Learning Management System (LMS)

> **Tagline:** Learn Beyond Limits.  
> **Brand Identity:** Premium Dark Mode, Modern, Futuristic, Minimalist, Professional.  
> **Pengajar Utama:** Ilham Lesmana  
> **Bahasa:** Indonesia  

---

## 🚀 Fitur Utama NEXORA

1. **Desain Premium Dark Mode:**
   - Palet warna: Midnight Black (`#0a0d14`), Dark Navy (`#0f172a`), Electric Blue (`#0ea5e9`), Violet (`#8b5cf6`), White & Gray.
   - Responsif optimal untuk Smartphone Android, Tablet Android, Laptop, dan Desktop.

2. **Landing Page Komprehensif:**
   - Hero Section, Fitur Unggulan, Kurikulum Mata Pelajaran, Profil Pengajar Ilham Lesmana, Footer Kontak Resmi.

3. **Autentikasi & Manajemen Akun Terpusat:**
   - **Guru / Admin:** Login via email & password, mengelola seluruh data sistem.
   - **Siswa:** Login via NISN atau Username + Password.
   - Akun siswa dibuat dan dikelola langsung oleh guru melalui dashboard (tidak perlu registrasi mandiri publik).
   - Fitur edit, nonaktifkan, reset password, dan hapus akun.

4. **10 Menu Dashboard Guru / Admin:**
   - **Dashboard:** 7 kartu statistik (Total Siswa, Total Kelas, Mata Pelajaran, Total Materi, Tugas/Ujian, Jawaban Masuk, Belum Diperiksa).
   - **Manajemen Siswa:** Tambah, edit, nonaktifkan, reset kata sandi, filter per kelas.
   - **Manajemen Kelas:** Buat kelas, edit, hapus, pindah kelas siswa, rombel dinamis (SMP/SMA/dll).
   - **Mata Pelajaran:** Tambah mapel, cover gambar, kode mapel, hubungkan ke kelas.
   - **Materi Pembelajaran:** Rich text, lampiran modul PDF, video tutorial URL, urutan materi.
   - **Bank Soal:** Pilihan Ganda (2-5 opsi), Benar/Salah, Isian Singkat, Esai manual, pembobotan nilai, tingkat kesulitan, fitur duplikasi soal.
   - **Tugas dan Ujian:** Kuis interaktif dengan timer countdown atau pengumpulan tugas upload file/catatan.
   - **Pengumpulan Jawaban:** Pantau jawaban masuk, unduh berkas, status pengerjaan.
   - **Penilaian & Rekap:** Penilaian otomatis + manual untuk esai/berkas, input ulasan guru, publikasi nilai transparan.
   - **Pengaturan Website:** Ubah dinamis nama platform, tagline, foto pengajar, bio, kontak, pengumuman, dan tema.

5. **Dashboard Siswa:**
   - Akses materi kelas sendiri, unduh PDF modul, tonton video materi, tandai materi selesai.
   - Lembar ujian kuis interaktif dengan timer hitung mundur.
   - Riwayat pengumpulan tugas & buku transkrip nilai terbit.

6. **Keamanan & Database:**
   - Skema lengkap PostgreSQL di Supabase dengan **Row Level Security (RLS)** aktif di setiap tabel.
   - Pencegahan kecurangan (kunci jawaban tidak bocor sebelum kuis dinilai, siswa hanya dapat mengakses kelasnya sendiri).

---

## 🛠️ Langkah Instalasi & Menjalankan Proyek

### 1. Kloning / Buka Folder Proyek
Masuk ke direktori:
```bash
cd "C:\Users\DICOMMA !!\.gemini\antigravity\scratch\nexora-lms"
```

### 2. Instalasi Dependensi
Jalankan di terminal:
```bash
npm install
```

### 3. Konfigurasi Database Supabase
1. Buka [https://supabase.com](https://supabase.com) dan buat proyek baru (contoh: `nexora-db`).
2. Masuk ke menu **SQL Editor** di Supabase Dashboard.
3. Salin isi file:
   `supabase/migrations/20261102_initial_schema.sql`
   lalu klik **RUN**. Skema 20 tabel, RLS, trigger, bucket storage, dan data awal otomatis terpasang.
4. Buka menu **Project Settings -> API** di Supabase, lalu salin:
   - **Project URL**
   - **anon / public key**
5. Buat file `.env` di root proyek:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Menjalankan Website Secara Lokal
```bash
npm run dev
```
Buka browser pada alamat yang tertera (biasanya `http://localhost:5173`).

---

## 🔑 Kredensial Uji Coba Default

- **Portal Guru / Admin:**
  - URL: `/login-admin`
  - Email: `admin@nexora.sch.id`
  - Kata Sandi: `admin123`

- **Portal Siswa:**
  - URL: `/login-siswa`
  - NISN: `202607001` (Ahmad Fauzan) atau `202607002` (Nadia Azhari)
  - Kata Sandi: `siswa123`

*Terdapat tombol cepat switcher role di header untuk beralih antara simulasi Guru dan Siswa tanpa perlu logout.*

---

## ☁️ Panduan Deploy ke Vercel

1. Unggah kode ke GitHub/GitLab.
2. Buka [https://vercel.com](https://vercel.com) dan impor repositori.
3. Masukkan Environment Variables di Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Klik **Deploy**. Website NEXORA Anda akan langsung online dengan domain HTTPS!
