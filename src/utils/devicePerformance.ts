/**
 * Device Performance & Hardware Capability Evaluator
 * 
 * Mendeteksi spesifikasi perangkat (CPU Cores, RAM, Mode Hemat Daya/Data, Media Motion)
 * secara adaptif sehingga fitur berat seperti Lenis Smooth Scroll, partikel, atau animasi
 * kompleks otomatis dinonaktifkan di "HP Kentang" (Low-End), namun tetap aktif mulus di
 * "HP Bagus / Flagship" (High-End) dan Desktop.
 */

export interface DeviceSpecInfo {
  isMobile: boolean;
  cores: number;
  memoryGB: number | null;
  saveData: boolean;
  prefersReducedMotion: boolean;
  canRunLenis: boolean;
  tier: 'low' | 'mid' | 'high';
}

export const evaluateDevicePerformance = (): DeviceSpecInfo => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isMobile: false,
      cores: 8,
      memoryGB: 8,
      saveData: false,
      prefersReducedMotion: false,
      canRunLenis: true,
      tier: 'high',
    };
  }

  // 1. Cek apakah ini perangkat seluler (smartphone / tablet)
  const ua = navigator.userAgent || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // 2. Cek preferensi pengguna (Aksesibilitas & Hemat Kuota/Baterai)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conn = (navigator as any).connection;
  const saveData = Boolean(conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g');

  // 3. Jumlah Inti CPU (Hardware Concurrency)
  // HP spesifikasi rendah (entry-level/kentang) umumnya memiliki <= 4 core aktif.
  // HP flagship / modern umumnya memiliki 8 hingga 12 core CPU.
  const cores = navigator.hardwareConcurrency || 4;

  // 4. Estimasi Kapasitas RAM (Device Memory API - Chromium/Android WebKit)
  // Mengembalikan nilai desimal dalam GB (misal: 2, 4, 6, 8 GB).
  const memoryGB = typeof (navigator as any).deviceMemory === 'number'
    ? (navigator as any).deviceMemory
    : null;

  // 5. Penentuan Klasifikasi Performa Perangkat (Device Tiering)
  let tier: 'low' | 'mid' | 'high' = 'high';

  if (prefersReducedMotion || saveData) {
    // Mode hemat daya/kuota atau pengguna memilih tanpa animasi
    tier = 'low';
  } else if (isMobile) {
    // Kategori HP Kentang (Low-End):
    // - CPU <= 4 core ATAU
    // - RAM < 6GB (dilaporkan 2GB / 4GB di Android)
    if (cores <= 4 || (memoryGB !== null && memoryGB < 6)) {
      tier = 'low';
    }
    // Kategori HP Bagus / Flagship (High-End):
    // - CPU >= 8 core DAN RAM >= 6GB (atau iPhone modern)
    else if (cores >= 8 && (memoryGB === null || memoryGB >= 6)) {
      tier = 'high';
    } else {
      tier = 'mid';
    }
  } else {
    // Kategori Laptop / Komputer Desktop:
    if (cores <= 4 && memoryGB !== null && memoryGB <= 4) {
      tier = 'mid';
    } else {
      tier = 'high';
    }
  }

  // Keputusan Adaptif untuk Lenis Smooth Scroll:
  // - HP Kentang: TIDAK diaktifkan (menggunakan scrolling momentum native hardware bawaan HP, 0% patah-patah).
  // - HP Bagus / Flagship (Tier High): DIAKTIFKAN dengan konfigurasi touchMultiplier halus.
  // - Komputer / Laptop: DIAKTIFKAN (karena memiliki mouse wheel fisik dan daya CPU memadai).
  const canRunLenis = !prefersReducedMotion && !saveData && (
    (!isMobile && tier !== 'low') ||
    (isMobile && tier === 'high')
  );

  return {
    isMobile,
    cores,
    memoryGB,
    saveData,
    prefersReducedMotion,
    canRunLenis,
    tier,
  };
};
