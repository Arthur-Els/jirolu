import { Laras } from "./instrumen";

export type TingkatKesulitan = "Mudah" | "Sedang" | "Mahir";

/**
 * Struktur data lagu pembelajaran gamelan di Jirolu.
 */
export interface Lagu {
  slug: string;             // Pengenal URL / ID lagu
  judul: string;            // Judul lagu gending / tembang dolanan
  laras: Laras;             // "slendro" atau "pelog"
  tingkat: TingkatKesulitan;// "Mudah" atau "Sedang"
  alat: string[];           // Instrumen yang didukung, misal ["saron", "bonang"]
  nada: string[];           // Urutan simbol nada, misal ["1", "2", "3", "5", "6"]
  deskripsi?: string;       // Penjelasan ringkas asal lagu
  asalDaerah?: string;      // Asal daerah tembang
  catatan?: string;         // Catatan khusus
}
