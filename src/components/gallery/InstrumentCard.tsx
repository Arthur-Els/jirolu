"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instrumen } from "@/types/instrumen";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedInstrument } from "@/lib/i18n/instrumentDict";

interface InstrumentCardProps {
  instrumen: Instrumen;
}

export const InstrumentCard: React.FC<InstrumentCardProps> = ({ instrumen }) => {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const localizedInstrumen = getLocalizedInstrument(instrumen, locale);

  // Di Fase 2, seluruh instrumen (Saron, Bonang, Gong, Kendang) sudah memiliki soundboard aktif
  const isPlayable = localizedInstrumen.tersediaDiFase <= 2;

  return (
    <Link
      href={`/instrumen/${localizedInstrumen.slug}`}
      className="group relative flex flex-col bg-arang rounded-2xl overflow-hidden border border-perunggu/30 transition-[border-color,box-shadow,transform] duration-300 hover:border-emas hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-emas"
    >
      {/* Gambar Instrumen */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#211c17] to-arang overflow-hidden">
        <Image
          src={localizedInstrumen.gambar}
          alt={
            isEn
              ? `Photo of ${localizedInstrumen.nama} gamelan instrument`
              : `Foto alat musik gamelan ${localizedInstrumen.nama}`
          }
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Lapisan gradien halus di atas gambar untuk kontras teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-arang via-transparent to-transparent opacity-80" />

        {/* Badge Status Ketersediaan */}
        <div className="absolute top-3 right-3">
          {isPlayable ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emas/90 text-tinta shadow-md">
              <span className="w-2 h-2 rounded-full bg-tinta animate-pulse" />
              {isEn ? "Ready to Play" : "Siap Dimainkan"}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-tinta/80 text-gading/70 border border-perunggu/40 backdrop-blur-sm">
              {isEn ? "Exhibition Collection" : "Koleksi Pameran"}
            </span>
          )}
        </div>

        {/* Aksara Jawa Estetis di Pojok Kiri Atas */}
        {localizedInstrumen.namaJawa && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-tinta/70 border border-perunggu/30 backdrop-blur-sm">
            <span className="text-emas font-serif text-sm tracking-widest opacity-90">
              {localizedInstrumen.namaJawa}
            </span>
          </div>
        )}
      </div>

      {/* Konten Kartu */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-2xl font-bold text-gading group-hover:text-emas transition-colors">
              {localizedInstrumen.nama}
            </h3>
            <span className="text-xs uppercase tracking-wider text-perunggu font-medium">
              {isEn ? "Javanese Gamelan" : "Gamelan Jawa"}
            </span>
          </div>
          <p className="text-sm text-gading/70 leading-relaxed line-clamp-2">
            {localizedInstrumen.deskripsiSingkat}
          </p>
        </div>

        {/* Tautan Aksi */}
        <div className="pt-3 border-t border-perunggu/20 flex items-center justify-between text-xs font-medium text-emas group-hover:translate-x-1 transition-transform">
          <span>
            {isPlayable
              ? isEn
                ? "Try Virtual Soundboard"
                : "Coba Soundboard Virtual"
              : isEn
              ? "Learn Philosophy"
              : "Pelajari Filosofi"}
          </span>
          <svg
            className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
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
        </div>
      </div>
    </Link>
  );
};
