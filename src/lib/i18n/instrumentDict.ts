import type { Instrumen, ItemSuara, LarasMap, Nada } from "@/types/instrumen";
import type { Locale } from "./types";

interface ItemSuaraTranslation {
  nama?: string;
  keterangan: string;
}

interface InstrumenTranslation {
  nama?: string;
  deskripsiSingkat: string;
  fungsi: string;
  filosofi: string;
  daftarSuara?: Record<string, ItemSuaraTranslation>;
}

const INSTRUMEN_EN: Record<string, InstrumenTranslation> = {
  saron: {
    nama: "Saron",
    deskripsiSingkat:
      "A bronze-bar balungan (core melody) instrument with a crisp, authoritative chime forming the main melodic skeleton.",
    fungsi:
      "The Saron carries the balungan—the core melodic skeleton that serves as the harmonic reference for the entire Javanese gamelan ensemble. Its bronze bars are struck with a specialized wooden hammer-shaped mallet. Players apply the 'memathet' technique (damping the previous bar with the left-hand fingers right as the next bar is struck) to keep every tone crisp and prevent overlapping resonance.",
    filosofi:
      "The Saron symbolizes decisiveness, nobility of character, and honesty in Javanese social life. Its clear, resonant chime reminds people to stand firm in virtuous principles. The damping technique (memathet) teaches deep mindfulness and self-restraint before stepping into the next chapter of life.",
  },
  bonang: {
    nama: "Bonang",
    deskripsiSingkat:
      "Two rows of gleaming small bossed gongs (pencon) that weave melodic variations and guide the rhythmic dynamics of a gending.",
    fungsi:
      "The Bonang is a melodic elaboration instrument that often opens a gending ('buka'). It consists of pencon (small raised-boss bronze kettles) arranged in two horizontal rows over stretched pluntur cords. It is struck using a pair of padded mallets wrapped in thick cloth (bindi), played with both hands alternately or together (gembyang and mipil techniques).",
    filosofi:
      "The two rows of pencon on the Bonang symbolize balance between humanity's outer and inner dimensions. Its dynamic, recurring melodic patterns signify that true leadership does not dictate, but guides with grace, gentleness, and sensitivity for the harmony of the entire community.",
  },
  gong: {
    nama: "Gong Ageng",
    deskripsiSingkat:
      "The spiritual center and final punctuation of musical cycles in gamelan with a deep, mystical resonance.",
    fungsi:
      "Gong Ageng is the largest gamelan instrument in physical size with the lowest frequency range. Together with Gong Suwukan and Kempul, it serves as a colotomic (structural) marker defining the end of one grand musical cycle (gongan) and ushering in the next. It is struck with a heavy, thickly padded wooden mallet with measured poise and inner stillness.",
    filosofi:
      "Gong Ageng symbolizes cosmic perfection and the Javanese teaching of 'Sangkan Paraning Dumadi' (the origin and ultimate destination of existence). Its deep, majestic, long-lingering resonance implies that behind all varied worldly dynamics, everything ultimately returns to the serene stillness of the Divine.",
    daftarSuara: {
      "gong-ageng": {
        nama: "Gong Ageng",
        keterangan:
          "The deepest & most majestic strike closing the gongan cycle (key 2)",
      },
      "gong-suwukan": {
        nama: "Gong Suwukan",
        keterangan:
          "Medium-sized gong marking intermediate gending sections (key 1)",
      },
      kempul: {
        nama: "Kempul",
        keterangan: "Hanging accent gong with a clean, bright chime (key 3)",
      },
    },
  },
  kendang: {
    nama: "Kendang",
    deskripsiSingkat:
      "The rhythmic heartbeat and tempo keeper that breathes life and dynamic pulse into every gamelan gending.",
    fungsi:
      "The Kendang governs tempo, rhythm, and dynamics (pamurba wirama) within the Javanese gamelan ensemble. It is played directly with the supple palms and fingers of the drummer (pengendang) without mallets. The pengendang cues transitions across rhythmic levels (irama lancar, dadi, wiled, and rangkep) and signals the final cadence (suwuk) for all musicians.",
    filosofi:
      "The Kendang embodies human conscience and inner awareness guiding every action. As the keeper of tempo, it teaches empathy and the responsibility of leadership: knowing when to accelerate forward, when to steady oneself, and always aligning one's personal pulse with surrounding harmony.",
    daftarSuara: {
      dung: {
        nama: "Dung",
        keterangan:
          "Dung = deep finger strike on the large Tebokan (drumhead), producing a round resonant tone (key X)",
      },
      tak: {
        nama: "Tak",
        keterangan:
          "Tak = damped palm strike on the small Tebokan (drumhead), producing a crisp, dry snap (key N)",
      },
      tung: {
        nama: "Tung / Tak-tak",
        keterangan:
          "Tung = light fingertip tap near the rim of the small Tebokan (drumhead), high and bright (key M)",
      },
      dah: {
        nama: "Dah / Bem",
        keterangan:
          "Dah = open-palm strike on the large Tebokan (drumhead), delivering a deep, solid bass boom (key Z)",
      },
    },
  },
};

function translateNoteList(notes: Nada[] | undefined): Nada[] | undefined {
  if (!notes) return undefined;
  return notes.map((item) => ({
    ...item,
    label: item.label.replace(" (tinggi)", " (high)"),
  }));
}

function translateLaras(laras: LarasMap | undefined): LarasMap | undefined {
  if (!laras) return undefined;
  return {
    ...(laras.pelog ? { pelog: translateNoteList(laras.pelog) } : {}),
    ...(laras.slendro ? { slendro: translateNoteList(laras.slendro) } : {}),
  };
}

function translateDaftarSuara(
  daftarSuara: ItemSuara[] | undefined,
  dict?: Record<string, ItemSuaraTranslation>
): ItemSuara[] | undefined {
  if (!daftarSuara) return undefined;
  if (!dict) return daftarSuara;

  return daftarSuara.map((item) => {
    const tr = dict[item.id];
    if (!tr) return item;
    return {
      ...item,
      ...(tr.nama ? { nama: tr.nama } : {}),
      keterangan: tr.keterangan,
    };
  });
}

export function getLocalizedInstrument(
  instrumen: Instrumen,
  locale: Locale
): Instrumen {
  if (locale === "id") {
    return instrumen;
  }

  const tr = INSTRUMEN_EN[instrumen.slug];
  if (!tr) {
    return instrumen;
  }

  return {
    ...instrumen,
    ...(tr.nama ? { nama: tr.nama } : {}),
    deskripsiSingkat: tr.deskripsiSingkat,
    fungsi: tr.fungsi,
    filosofi: tr.filosofi,
    ...(instrumen.laras ? { laras: translateLaras(instrumen.laras) } : {}),
    ...(instrumen.daftarSuara
      ? { daftarSuara: translateDaftarSuara(instrumen.daftarSuara, tr.daftarSuara) }
      : {}),
  };
}
