"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instrumen } from "@/types/instrumen";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedInstrument } from "@/lib/i18n/instrumentDict";

interface OtherInstrumentsProps {
  currentSlug: string;
  allInstruments: Instrumen[];
}

export const OtherInstruments: React.FC<OtherInstrumentsProps> = ({
  currentSlug,
  allInstruments,
}) => {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  // Saring agar hanya menampilkan instrumen selain yang sedang dibuka
  const others = allInstruments.filter((item) => item.slug !== currentSlug);

  return (
    <section className="w-full space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs uppercase tracking-widest text-emas font-medium">
            {isEn ? "Museum Collection" : "Koleksi Museum"}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gading">
            {isEn ? "Other Instruments" : "Alat Musik Lainnya"}
          </h3>
        </div>
        <Link
          href="/#galeri"
          className="text-xs text-gading/70 hover:text-emas-muda font-medium transition-colors"
        >
          {isEn ? "View Full Gallery Collection →" : "Lihat Semua Koleksi Galeri →"}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {others.map((item) => {
          const localizedItem = getLocalizedInstrument(item, locale);
          return (
            <Link
              key={item.slug}
              href={`/instrumen/${item.slug}`}
              className="group bg-arang/90 border border-perunggu/30 rounded-2xl overflow-hidden hover:border-emas transition-colors duration-300 flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[4/3] bg-tinta overflow-hidden">
                <Image
                  src={item.gambar}
                  alt={
                    isEn
                      ? `${localizedItem.nama} gamelan instrument`
                      : `Alat musik gamelan ${localizedItem.nama}`
                  }
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-gading group-hover:text-emas transition-colors">
                    {localizedItem.nama}
                  </h4>
                </div>
                <p className="text-xs text-gading/65 line-clamp-2 leading-relaxed">
                  {localizedItem.deskripsiSingkat}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
