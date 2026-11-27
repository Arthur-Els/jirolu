import type { Lagu, TingkatKesulitan } from "@/types/lagu";
import type { Locale } from "./types";

interface LaguTranslation {
  judul: string;
  deskripsi?: string;
  asalDaerah?: string;
  catatan?: string;
}

export const TINGKAT_EN: Record<TingkatKesulitan, string> = {
  Mudah: "Easy",
  Sedang: "Intermediate",
  Mahir: "Advanced",
};

const LAGU_EN: Record<string, LaguTranslation> = {
  "latihan-dasar": {
    judul: "Basic Slendro Exercise",
    deskripsi:
      "Ascending and descending note sequence to familiarize your hands with the bar layout of the Slendro scale.",
    asalDaerah: "Central Java",
  },
  "lir-ilir": {
    judul: "Lir-Ilir",
    deskripsi:
      "A traditional tembang dolanan (Javanese folk song) attributed to Sunan Kalijaga in Pelog tuning, played on the Bonang pencon (bossed kettles).",
    asalDaerah: "Central Java",
    catatan: "Official practice piece for the lower-row Bonang (Pelog tuning)",
  },
  "gundul-gundul-pacul": {
    judul: "Gundul-Gundul Pacul",
    deskripsi:
      "A traditional tembang dolanan rich in Javanese leadership philosophy, played in Pelog tuning.",
    asalDaerah: "Central Java",
    catatan: "Official practice piece for the Saron (Pelog tuning)",
  },
};

export function getLocalizedDifficulty(
  tingkat: TingkatKesulitan,
  locale: Locale
): string {
  if (locale === "id") {
    return tingkat;
  }
  return TINGKAT_EN[tingkat] ?? tingkat;
}

export function getLocalizedSong(lagu: Lagu, locale: Locale): Lagu {
  if (locale === "id") {
    return lagu;
  }

  const tr = LAGU_EN[lagu.slug];
  if (!tr) {
    return lagu;
  }

  return {
    ...lagu,
    judul: tr.judul,
    ...(tr.deskripsi !== undefined ? { deskripsi: tr.deskripsi } : {}),
    ...(tr.asalDaerah !== undefined ? { asalDaerah: tr.asalDaerah } : {}),
    ...(tr.catatan !== undefined ? { catatan: tr.catatan } : {}),
  };
}
