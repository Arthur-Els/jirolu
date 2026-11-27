/**
 * Definisi tipe data untuk instrumen Museum Gamelan "Jirolu".
 * Mendukung dua kategori instrumen:
 * 1. "bernada" : memiliki tangga nada / laras (misal Saron, Bonang)
 * 2. "bersuara" : memiliki ragam jenis pukulan / suara khas (misal Gong, Kendang)
 */

// Pilihan laras gamelan untuk instrumen bernada
export type Laras = "pelog" | "slendro";

// Kategori instrumen gamelan
export type KategoriInstrumen = "bernada" | "bersuara";

// Struktur data satu bilah atau pencu nada (untuk Saron dan Bonang)
export interface Nada {
  nada: string;         // Simbol angka nada, misal "1", "2", "3"
  label: string;        // Sebutan tradisional Jawa: ji, ro, lu, pat, mo, nem, pi
  audio: string;        // Lokasi file audio di folder public (misal: /audio/saron/pelog/1.webm)
  key: string;          // Tombol keyboard komputer (A, S, D, atau Q, W, E)
  frekuensi?: number;   // Frekuensi nada dasar (Hz) untuk synthesizer cadangan
  baris?: number;       // Baris posisi (khusus Bonang: 1 = baris atas, 2 = baris bawah)
  keterangan?: string;  // Penjelasan tambahan nada
}

// Koleksi nada berdasarkan laras (Pelog & Slendro)
export interface LarasMap {
  pelog?: Nada[];
  slendro?: Nada[];
}

// Struktur data satu jenis pukulan / suara (khusus instrumen bersuara: Gong, Kendang)
export interface ItemSuara {
  id: string;           // Pengenal unik suara, misal "gong-ageng", "dung", "tak"
  nama: string;         // Nama suara / jenis gong (misal: "Gong Ageng", "Dung", "Dah")
  audio: string;        // Lokasi file audio (misal: /audio/gong/ageng.webm, /audio/kendang/dung.webm)
  key: string;          // Tombol keyboard komputer (misal: 1, 2, 3 atau Z, X, C, V)
  keterangan: string;   // Penjelasan karakter suara (misal: "Dung = pukulan dalam, suara besar")
  frekuensi?: number;   // Frekuensi dasar untuk synthesizer cadangan
  decay?: number;       // Waktu dengung suara (detik), misal Gong butuh 3-5 detik
  playbackRate?: number; // Rasio kecepatan/pitch pemutaran sampel audio (misal 0.67 atau 0.42)
  lowpassHz?: number;    // Cut-off low-pass filter (Hz) untuk melembutkan karakter gong lebih besar
  subBassHz?: number;    // Frekuensi sub-bass halus tambahan agar dentuman tetap dalam & tegas
  subBassGain?: number;  // Level sub-bass tambahan (0.0 - 1.0)
  gain?: number;         // Penyesuaian volume relatif antar variasi suara
  preserveNaturalDecay?: boolean; // Biarkan dengung alami rekaman penuh lalu fade-out di akhir
}

// Struktur lengkap satu alat musik gamelan di Jirolu
export interface Instrumen {
  slug: string;                  // URL slug unik: "saron", "bonang", "gong", "kendang"
  nama: string;                  // Nama instrumen
  namaJawa?: string;             // Aksara Jawa
  tipe: KategoriInstrumen;       // "bernada" atau "bersuara"
  deskripsiSingkat: string;      // Ringkasan satu kalimat untuk kartu pameran
  fungsi: string;                // Penjelasan fungsi musikal dalam gending
  filosofi: string;              // Makna filosofis kebudayaan Jawa
  gambar: string;                // Lokasi gambar (foto atau SVG placeholder)
  larasDefault?: Laras;          // Laras awal (hanya untuk tipe bernada)
  laras?: LarasMap;              // Pilihan nada (untuk tipe bernada)
  daftarSuara?: ItemSuara[];     // Daftar suara pukulan (untuk tipe bersuara)
  tersediaDiFase: number;        // Fase ketersediaan (sekarang semua bernilai 2 untuk aktif penuh)
}
