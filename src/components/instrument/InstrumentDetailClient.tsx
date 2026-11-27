"use client";

import React from "react";
import Link from "next/link";
import type { Instrumen } from "@/types/instrumen";
import type { Lagu } from "@/types/lagu";
import { InfoPanel } from "@/components/instrument/InfoPanel";
import { Soundboard } from "@/components/soundboard/Soundboard";
import { OtherInstruments } from "@/components/instrument/OtherInstruments";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedInstrument } from "@/lib/i18n/instrumentDict";

interface InstrumentDetailClientProps {
  instrumen: Instrumen;
  nextInstrumen: Instrumen;
  otherInstruments: Instrumen[];
  songs: Lagu[];
}

export const InstrumentDetailClient: React.FC<InstrumentDetailClientProps> = ({
  instrumen,
  nextInstrumen,
  otherInstruments,
  songs,
}) => {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const localizedInstrumen = getLocalizedInstrument(instrumen, locale);
  const localizedNext = getLocalizedInstrument(nextInstrumen, locale);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-16 space-y-8 sm:space-y-12">
      {/* Bar Navigasi Atas Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 mt-10 sm:mt-8 border-b border-rule">
        <Link
          href="/#galeri"
          className="group inline-flex items-center justify-start sm:justify-center gap-2 py-2 text-ink/75 hover:text-white font-medium text-xs sm:text-sm min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
        >
          <svg
            className="w-4 h-4 transition-transform duration-150 ease-out group-hover:-translate-x-1 group-active:-translate-x-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>
            {isEn ? "Back to Exhibition Gallery" : "Kembali ke Galeri Pameran"}
          </span>
        </Link>

        {/* Tautan Alat Musik Berikutnya */}
        <Link
          href={`/instrumen/${nextInstrumen.slug}`}
          className="group inline-flex items-center justify-center gap-2 py-2.5 text-ink/75 hover:text-white font-medium text-sm min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
        >
          <span>
            {isEn ? "Next Instrument: " : "Alat Musik Selanjutnya: "}
            <strong className="text-ink group-hover:text-white font-semibold transition-colors">
              {localizedNext.nama}
            </strong>
          </span>
          <svg
            className="w-4 h-4 transition-transform duration-150 ease-out group-hover:translate-x-1 group-active:translate-x-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Bagian 1: Soundboard Interaktif dengan Mode Belajar & Rekaman */}
      <section
        aria-label={
          isEn
            ? `${localizedInstrumen.nama} Virtual Soundboard`
            : `Soundboard Virtual ${localizedInstrumen.nama}`
        }
        className="space-y-4"
      >
        <Soundboard instrumen={instrumen} availableSongs={songs} />
      </section>

      {/* Bagian 2: Panel Penjelasan Fungsi & Cerita Filosofi */}
      <section
        aria-label={
          isEn
            ? `Information and Philosophy of ${localizedInstrumen.nama}`
            : `Informasi dan Filosofi ${localizedInstrumen.nama}`
        }
      >
        <InfoPanel instrumen={instrumen} />
      </section>

      {/* Bagian 3: Alat Musik Lainnya (Fitur Rekomendasi Koleksi) */}
      <OtherInstruments
        currentSlug={instrumen.slug}
        allInstruments={otherInstruments}
      />

      {/* Bar Navigasi Bawah Halaman dihapus agar tidak duplikat dengan bar navigasi atas */}
    </div>
  );
};
