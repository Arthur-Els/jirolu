/**
 * Pemetaan tombol keyboard fisik komputer ke nada-nada gamelan.
 * Standar: Tombol deret A-S-D-F-G-H-J untuk nada 1 sampai 7.
 */

export const KEY_TO_NOTE_INDEX: Record<string, number> = {
  a: 0, // Nada 1 (ji)
  s: 1, // Nada 2 (ro)
  d: 2, // Nada 3 (lu)
  f: 3, // Nada 4 (pat)
  g: 4, // Nada 5 (mo)
  h: 5, // Nada 6 (nem)
  j: 6, // Nada 7 (pi)
};

/**
 * Memeriksa apakah suatu tombol keyboard valid untuk memainkan bilah
 */
export function getNoteIndexFromKey(key: string): number | undefined {
  const normalizedKey = key.toLowerCase();
  return KEY_TO_NOTE_INDEX[normalizedKey];
}
