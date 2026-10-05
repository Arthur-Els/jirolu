import { Instrumen } from "@/types/instrumen";
import saronData from "@/content/instrumen/saron.json";
import bonangData from "@/content/instrumen/bonang.json";
import gongData from "@/content/instrumen/gong.json";
import kendangData from "@/content/instrumen/kendang.json";

// Daftar seluruh instrumen yang terdaftar di museum digital
const daftarInstrumen: Instrumen[] = [
  saronData as Instrumen,
  bonangData as Instrumen,
  gongData as Instrumen,
  kendangData as Instrumen,
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
