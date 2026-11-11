<div align="center">

  <img src="./public/logo-x.svg" alt="Marhas LMS Logo" width="96" height="96" />

  # **Marhas LMS**
  ### **Modern Learning Platform SMK Marhas Margahayu**

  <p align="center">
    Platform Learning Management System (LMS) modern, responsif, dan berperforma tinggi yang dirancang khusus untuk civitas akademika SMK Marhas Margahayu. Menggabungkan arsitektur dashboard <b>Bento Grid Himtech</b>, autentikasi sinematik <b>Cutora</b>, dan basis data relasional awan <b>Supabase PostgreSQL</b>.
  </p>

  <p align="center">
    <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusername%2Fnexora-lms&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY&project-name=marhas-lms&repo-name=marhas-lms">
      <img src="https://vercel.com/button" alt="Deploy with Vercel" />
    </a>
  </p>

  <p align="center">
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="TailwindCSS" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License MIT" /></a>
  </p>

  <p align="center">
    <a href="#-fitur-unggulan">Fitur Unggulan</a> •
    <a href="#-panduan-deployment-ke-vercel">Deploy ke Vercel</a> •
    <a href="#-arsitektur-dan-teknologi">Teknologi</a> •
    <a href="#-struktur-proyek">Struktur Berkas</a> •
    <a href="#-instalasi-lokal">Instalasi Lokal</a> •
    <a href="#-kredensial-demo">Akun Demo</a>
  </p>

  <br />

  <!-- OpenGraph Hero Banner -->
  <a href="https://marhas.sch.id/">
    <img src="./public/og-image.png" alt="Marhas LMS OpenGraph Banner" width="100%" style="border-radius: 18px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);" />
  </a>

</div>

---

## 📌 Ringkasan Eksekutif

**Marhas LMS** dikembangkan untuk mentransformasi ekosistem kegiatan belajar mengajar (KBM) digital di SMK Marhas Margahayu menjadi lebih terstruktur, intuitif, dan nyaman digunakan baik oleh dewan guru maupun para siswa:

1. **Kecepatan Akses Sub-Detik**: Dibangun menggunakan Vite 6 dan React 18 dengan optimasi pembagian chunk (*code splitting*) sehingga waktu muat halaman berlangsung instan.
2. **Kenyamanan Kognitif (*Ergonomic UX*)**: Akses dokumen modul PDF seketika (*1-click direct download*), bilah pencarian cerdas *spotlight search*, dan eliminasi 100% dialog konfirmasi native yang monoton.
3. **Ketahanan Data Relasional**: Terkoneksi secara aman dengan Supabase PostgreSQL yang menangani data riil puluhan siswa aktif (termasuk NIS `2627102026`), pembagian kelas rombel, repositori bank soal, serta evaluasi penilaian.

---

## ⚡ Panduan Deployment ke Vercel

Marhas LMS dirancang **100% siap produksi (*Production-Ready*)** untuk dideploy ke [Vercel](https://vercel.com/) dalam hitungan menit tanpa konfigurasi rumit.

### Opsi 1: One-Click Deploy Button (Direkomendasikan)
Klik tombol di bawah ini untuk mengkloning dan mendeploy proyek langsung ke akun Vercel Anda:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusername%2Fnexora-lms&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY&project-name=marhas-lms&repo-name=marhas-lms)

---

### Opsi 2: Deploy Manual via Vercel Dashboard

1. **Buka Vercel Dashboard**: Masuk ke [vercel.com](https://vercel.com/) dan klik **"Add New Project"**.
2. **Impor Repositori GitHub**: Pilih repositori `marhas-lms` dari daftar repositori Anda.
3. **Pengaturan Project Preset**:
   - **Framework Preset**: `Vite` *(terdeteksi otomatis)*
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` *(atau `vite build`)*
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Konfigurasi Environment Variables**:
   Buka bagian **Environment Variables** dan tambahkan 2 kunci kredensial Supabase berikut:

   | Kunci Variabel | Nilai Contoh | Keterangan |
   |---|---|---|
   | `VITE_SUPABASE_URL` | `https://xyzcompany.supabase.co` | URL endpoint instans Supabase Anda |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Public API Anon/Key Supabase |

5. **Deploy**: Klik tombol **"Deploy"**. Proses kompilasi akan selesai dalam waktu ~1 menit.

---

### Opsi 3: Deploy via Vercel CLI (Terminal)

```bash
# 1. Pasang Vercel CLI global (jika belum ada)
npm i -g vercel

# 2. Login akun Vercel Anda
vercel login

# 3. Deploy langsung dari folder proyek
vercel

# 4. Untuk rilis ke domain produksi
vercel --prod
```

---

### 🛡️ Mengapa Marhas LMS Berjalan Sempurna di Vercel?
Proyek ini telah dilengkapi dengan berkas konfigurasi [`vercel.json`](./vercel.json) yang mencakup:
- **SPA Rewrite Rule**: Mencegah galat *404 Not Found* saat pengguna me-refresh halaman di rute seperti `/admin`, `/student`, atau `/login-siswa`.
- **Header Keamanan Ketat**: Penerapan `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, dan `Strict-Transport-Security`.
- **Cache-Control Aset Statis**: Berkas font (`.woff2`) dan bundle JavaScript diberi header `immutable` dengan durasi 1 tahun untuk kecepatan loading maksimal di seluruh dunia melalui Edge Network Vercel.

---

## 🌟 Fitur Unggulan

### 1. 🔍 Spotlight Command Palette & Live Topbar Search
- Terletak tepat di sebelah lonceng notifikasi pada bilah navigasi atas dashboard.
- Menyaring data multi-entitas secara instan saat pengguna mengetik:
  - 👤 **Siswa Terdaftar** (nama lengkap atau NIS/NISN).
  - 🏫 **Kelas Rombel** (nama kelas, jenjang, atau tahun ajaran).
  - 📖 **Mata Pelajaran** (nama mapel atau kode).
  - 📄 **Modul & Materi Pembelajaran** (judul materi atau bab).
  - 📝 **Tugas & Kuis Online** (judul tugas atau paket ujian).
- Klik salah satu hasil pencarian untuk langsung berpindah ke tab tujuan dengan seketika.

### 2. 📚 Modul Materi Belajar & Akses PDF Seketika
- **Direct 1-Click PDF Download**: Tautan dokumen PDF ditampilkan jelas dan mencolok tepat pada kartu materi tanpa harus membuka modal rincian terlebih dahulu.
- **Tautan Video Pembelajaran**: Tombol akses langsung ke video materi interaktif.
- **Pill Scope Navigasi**: Siswa dapat beralih antara **"Modul Kelas Saya"** dan **"Semua Modul Sekolah"**, dilengkapi sistem fallback agar siswa tidak pernah mendapati halaman kosong (*zero empty state*).
- **Progres Selesai**: Kemudahan menandai bab materi yang telah tuntas dipelajari.

### 3. 📝 Bank Soal Terpadu & Paket Kategori
- **Hierarki Opsi Jawaban Bersih**: Menghilangkan polusi warna neon acak dan menerapkan sistem kontras elegan. Kunci jawaban ditonjolkan dengan aksen *emerald* yang terstruktur.
- **Mendukung 4 Tipe Soal**: Pilihan Ganda (*Multiple Choice*), Benar / Salah (*True/False*), Isian Singkat (*Short Answer*), dan Esai (*Essay*).
- **Pengelompokan Paket**: Guru dapat mengelompokkan butir soal ke dalam paket (*Tugas 1, Tugas 2, UTS, UAS*) untuk disematkan dalam 1 klik ke tugas kuis.
- **Duplikasi Soal**: Fitur kloning butir soal kilat untuk mempercepat penyusunan paket bank soal baru.

### 4. 🎨 Integrasi Tautan Figma & Parafrase Pengumpulan
- **Bebas Kode JSON Mentah**: URL-encoded JSON `[JAWABAN_JSON:...]` diuraikan secara otomatis menjadi format ringkasan manusiawi (*"X Butir Jawaban Kuis Tersimpan"*).
- **Deteksi Otomatis Figma**: URL `figma.com` pada catatan pengumpulan siswa secara otomatis dideteksi dan diubah menjadi tombol interaktif **`🎨 Buka Desain Figma`**.
- **Modal Inspeksi Jawaban**: Guru pengajar dapat memeriksa rincian butir soal, opsi yang dipilih siswa, serta kunci jawaban tanpa melihat data mentah.

### 5. 🛡️ Universal ConfirmDialog System
- Mengeliminasi 100% dialog `window.confirm()` bawaan browser.
- Digantikan oleh modal **`ConfirmDialog`** kustom dengan latar belakang *backdrop blur*, ikon semantik, varian warna tegas (*danger, warning, primary*), serta dukungan penuh tombol keyboard `Escape (ESC)`:
  - ✕ Hapus Kelas Rombel
  - ✕ Hapus Mata Pelajaran
  - ✕ Hapus Modul Pembelajaran
  - ✕ Hapus Tugas / Kuis Online
  - ⚠ Terbitkan Kuis Tanpa Butir Soal
  - ✕ Hapus Butir Soal dari Bank Soal
  - ✕ Tolak Pendaftaran Akun Siswa/Guru
  - ✕ Hapus Pengumuman Sekolah
  - ⚠ Bersihkan Cache Browser & Sinkronisasi Ulang Database
  - 🚪 Keluar Akun (*Logout*) dari Sidebar

### 6. 📊 Dashboard Bento Grid (Himtech Architecture)
- **Collapsible Sidebar**: Lebar fleksibel (84px mode ringkas $\leftrightarrow$ 260px mode penuh) dengan logo geometris clover "X" khas Marhas LMS. Status ukuran tersimpan otomatis di `localStorage`.
- **Hero Banner Card**: Menampilkan identitas editorial, status sinkronisasi, dan tumpukan avatar siswa aktif.
- **Status Aktivitas Tugas**: Grafik area biru di sisi kiri dipadukan dengan **Concentric Radial Rings** di sisi kanan untuk membaca persentase penyelesaian modul secara seketika.
- **Submission Progress Meter & Classes Wave**: Indikator 22 baris batang kapasitas pengumpulan dan kurva Bezier distribusi kelas rombel.

### 7. 🔐 Autentikasi Sinematik Cutora
- Latar belakang video loop dinamis gedung pencakar langit saat matahari terbenam.
- Transisi peran Siswa $\leftrightarrow$ Guru dengan animasi *directional glide* tanpa kedip (*flicker-free*).
- Alur pendaftaran mandiri (`/signup`) dengan status awal `pending` yang wajib disetujui (*Approved*) oleh Admin Pengajar melalui tab **Persetujuan Akun**.

---

## 🏗️ Arsitektur dan Teknologi

| Lapisan Sistem | Teknologi Pilihan | Peran & Keunggulan |
|---|---|---|
| **Frontend Framework** | [React 18.3](https://react.dev/) | Arsitektur komponen reaktif berkecepatan tinggi |
| **Bahasa Pemrograman** | [TypeScript 5.5](https://www.typescriptlang.org/) | Jaminan type-safety dan stabilitas kode skala besar |
| **Build Tool & Bundler** | [Vite 6.4](https://vitejs.dev/) | HMR kilat dan optimasi kompilasi bundle |
| **CSS Utility Framework** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Desain adaptif dengan styling konsisten |
| **Ikonografi Vektor** | [Lucide React](https://lucide.dev/) | Koleksi ikon SVG modern dan ringan |
| **Basis Data Relasional** | [Supabase PostgreSQL](https://supabase.com/) | Database relasional awan dengan Row Level Security (RLS) |
| **Infrastruktur Hosting** | [Vercel Edge Network](https://vercel.com/) | Hosting global dengan CDN instan dan sertifikat SSL otomatis |

---

## 📂 Struktur Direktori Proyek

```plaintext
marhas-lms/
├── public/
│   ├── logo-x.svg                 # Identitas logo geometris 4-kuadran clover
│   ├── og-image.png               # Banner OpenGraph resolusi tinggi (1200x630)
│   ├── og-image.jpg               # Banner OpenGraph format web
│   ├── dashboard-hero.jpg         # Aset editorial visual dashboard
│   ├── PPMondwest-Regular.woff2   # Tipografi display retro-modern
│   └── robots.txt                 # Aturan perayap mesin pencari
├── src/
│   ├── components/
│   │   ├── dashboard/             # Komponen Dashboard Bento Grid Himtech
│   │   │   ├── DashboardSidebar.tsx   # Sidebar collapsable 84px - 260px
│   │   │   ├── DashboardTopbar.tsx    # Header bar dengan live spotlight search
│   │   │   ├── HeroBannerCard.tsx     # Hero card dengan avatar stack siswa
│   │   │   ├── ActivityStatusCard.tsx # Grafik area + chart konsentris lingkaran
│   │   │   ├── SubmissionMeterCard.tsx# Indikator kapasitas tugas 22-bar
│   │   │   └── ClassesWaveCard.tsx    # Kurva sebaran rombel siswa
│   │   ├── ui/
│   │   │   └── ConfirmDialog.tsx      # Modal dialog konfirmasi terstandarisasi
│   │   ├── NexumHero.tsx          # Hero landing page video full-screen
│   │   ├── NexumNavbar.tsx        # Navigasi melayang glassmorphism
│   │   └── Footer.tsx             # Footer halaman depan
│   ├── context/
│   │   ├── AuthContext.tsx        # Manajemen sesi login (Guru / Siswa)
│   │   └── DataContext.tsx        # Sinkronisasi multi-tabel Supabase
│   ├── pages/
│   │   ├── admin/                 # Workspace Admin Pengajar
│   │   │   ├── AdminLayout.tsx    # Shell tata letak admin
│   │   │   └── tabs/
│   │   │       ├── AdminOverview.tsx      # Ringkasan analitik utama
│   │   │       ├── AdminApprovals.tsx     # Verifikasi pendaftaran akun baru
│   │   │       ├── AdminClasses.tsx       # Manajemen rombel & tingkatan
│   │   │       ├── AdminSubjects.tsx      # Manajemen mata pelajaran
│   │   │       ├── AdminMaterials.tsx     # Manajemen materi & berkas PDF
│   │   │       ├── AdminQuestionBank.tsx  # Bank soal & paket kategori
│   │   │       ├── AdminAssignments.tsx   # Pembuatan kuis & tugas
│   │   │       ├── AdminSubmissions.tsx   # Pengumpulan jawaban & tautan Figma
│   │   │       ├── AdminGrading.tsx       # Buku penilaian & rekap nilai
│   │   │       └── AdminSettings.tsx      # Pengaturan brand & sinkronisasi
│   │   ├── student/               # Portal Belajar Siswa
│   │   │   ├── StudentLayout.tsx  # Shell tata letak siswa
│   │   │   └── tabs/
│   │   │       ├── StudentOverview.tsx    # Progres belajar siswa
│   │   │       ├── StudentSubjects.tsx    # Daftar mata pelajaran kelas
│   │   │       ├── StudentMaterials.tsx   # Pembelajaran modul & unduh PDF
│   │   │       ├── StudentAssignments.tsx # Pengerjaan kuis timer & tugas
│   │   │       └── StudentHistory.tsx     # Riwayat jawaban & skor
│   │   ├── LandingPage.tsx        # Halaman publik editorial
│   │   ├── LoginAdmin.tsx         # Portal login autentikasi guru
│   │   ├── LoginStudent.tsx       # Portal login autentikasi siswa
│   │   └── SignupPage.tsx         # Pendaftaran akun siswa/guru baru
│   ├── utils/
│   │   └── submissionParser.ts    # Parser cerdas JSON & Figma links
│   ├── types/
│   │   └── database.types.ts      # Definisi tipe TypeScript relasional
│   ├── styles/
│   │   ├── dashboard.css          # Desain sistem bento grid Himtech
│   │   └── login.css              # Sistem transisi Cutora cinematic
│   ├── App.tsx                    # Rute navigasi aplikasi
│   ├── index.css                  # Utilitas Tailwind global & font
│   └── main.tsx                   # Titik masuk aplikasi React
├── index.html                     # HTML5 shell dengan OpenGraph & Twitter Card
├── tailwind.config.js             # Konfigurasi tema dan warna
├── tsconfig.json                  # Konfigurasi compiler TypeScript
├── vercel.json                    # Konfigurasi SPA rewrite & security headers Vercel
└── package.json                   # Dependensi dan skrip proyek
```

---

## 💻 Panduan Instalasi Lokal

### 1. Kloning Repositori
```bash
git clone https://github.com/username/marhas-lms.git
cd marhas-lms
```

### 2. Pemasangan Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi endpoint Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 4. Menjalankan Server Lokal
```bash
npm run dev
```
Buka peramban pada alamat **[http://localhost:5173](http://localhost:5173)**.

### 5. Kompilasi Produksi
```bash
npm run build
```

---

## 🔑 Kredensial Akun Demo (Development & Review)

> [!NOTE]
> Untuk menjaga kerahasiaan dan keamanan data civitas akademika di repositori publik, gunakan akun demonstrasi berikut untuk keperluan evaluasi antarmuka. Kredensial akun riil siswa dan guru tersimpan aman di database PostgreSQL dan dikelola langsung oleh pihak sekolah.

| Peran Pengguna | Halaman Akses | Pengenal / NISN / Email | Kata Sandi | Lingkup Akses |
|---|---|---|---|---|
| 👨‍🏫 **Guru / Pengajar Utama** | `/login` (Tab Guru) | `guru@marhas.sch.id` | `guru123` | Dashboard Guru, Modul Materi, Bank Soal, Penilaian & Pengaturan |
| 👨‍🎓 **Siswa Demo** | `/login` (Tab Siswa) | `2026001` *(NIS Demo)* | `siswa123` | Dashboard Siswa, Unduh Modul PDF Langsung, Tugas & Riwayat Nilai |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah naungan **[MIT License](LICENSE)**.

Hak Cipta &copy; 2026 **Marhas LMS**. Seluruh hak cipta dilindungi undang-undang.
Didedikasikan untuk kemajuan transformasi pembelajaran digital di **SMK Marhas Margahayu**.
