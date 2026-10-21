/**
 * Pemetaan tombol keyboard fisik komputer ke nada-nada gamelan.
 * Standar: Tombol deret A-S-D-F-G-H-J untuk nada 1 sampai 7.
 */

export const KEY_TO_NOTE_INDEX: Record<string, number> = {
  "1": 0, // Nada 1 (ji)
  "2": 1, // Nada 2 (ro)
  "3": 2, // Nada 3 (lu)
  "4": 3, // Nada 4 (pat)
  "5": 4, // Nada 5 (mo)
  "6": 5, // Nada 6 (nem)
  "7": 6, // Nada 7 (pi)
  a: 0, // Fallback huruf (A-J)
  s: 1,
  d: 2,
  f: 3,
  g: 4,
  h: 5,
  j: 6,
};

/**
 * Memeriksa apakah suatu tombol keyboard valid untuk memainkan bilah
 */
export function getNoteIndexFromKey(key: string): number | undefined {
  const normalizedKey = key.toLowerCase();
  return KEY_TO_NOTE_INDEX[normalizedKey];
}
