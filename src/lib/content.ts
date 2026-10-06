import { Instrumen } from "@/types/instrumen";
import { Lagu } from "@/types/lagu";
import saronData from "@/content/instrumen/saron.json";
import bonangData from "@/content/instrumen/bonang.json";
import gongData from "@/content/instrumen/gong.json";
import kendangData from "@/content/instrumen/kendang.json";

import latihanDasarData from "@/content/lagu/latihan-dasar.json";
import lirIlirData from "@/content/lagu/lir-ilir.json";
import gundulPaculData from "@/content/lagu/gundul-gundul-pacul.json";

// Daftar seluruh instrumen yang terdaftar di Jirolu
const daftarInstrumen: Instrumen[] = [
  saronData as Instrumen,
  bonangData as Instrumen,
  gongData as Instrumen,
  kendangData as Instrumen,
];

// Daftar seluruh lagu pembelajaran mode belajar Jirolu
const daftarLagu: Lagu[] = [
  latihanDasarData as Lagu,
  lirIlirData as Lagu,
  gundulPaculData as Lagu,
];

/**
 * Mengambil semua daftar instrumen untuk galeri pameran
 */
export function getAllInstruments(): Instrumen[] {
  return daftarInstrumen;
}

/**
 * Mengambil satu instrumen berdasarkan slug URL (misal 'saron')
 */
export function getInstrumentBySlug(slug: string): Instrumen | undefined {
  return daftarInstrumen.find((item) => item.slug === slug);
}

/**
 * Mengambil instrumen berikutnya untuk tombol navigasi lanjutan
 */
export function getNextInstrument(currentSlug: string): Instrumen {
  const currentIndex = daftarInstrumen.findIndex((item) => item.slug === currentSlug);
  const nextIndex = (currentIndex + 1) % daftarInstrumen.length;
  return daftarInstrumen[nextIndex];
}

/**
 * Mengambil seluruh daftar lagu pembelajaran
 */
export function getAllSongs(): Lagu[] {
  return daftarLagu;
}

/**
 * Mengambil lagu-lagu yang cocok untuk instrumen tertentu (misal 'saron' atau 'bonang')
 */
export function getSongsByInstrument(instrumentSlug: string): Lagu[] {
  return daftarLagu.filter((song) => song.alat.includes(instrumentSlug));
}

/**
 * Mengambil satu lagu berdasarkan slug
 */
export function getSongBySlug(slug: string): Lagu | undefined {
  return daftarLagu.find((song) => song.slug === slug);
}
