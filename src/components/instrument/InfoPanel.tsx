import React from "react";
import Image from "next/image";
import { Instrumen } from "@/types/instrumen";

interface InfoPanelProps {
  instrumen: Instrumen;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ instrumen }) => {
  return (
    <div className="w-full bg-arang/80 border border-perunggu/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl backdrop-blur-sm space-y-10">
      {/* Header Info Instrumen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Gambar Instrumen */}
        <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-perunggu/40 shadow-lg">
          <Image
            src={instrumen.gambar}
            alt={`Gambar instrumen ${instrumen.nama}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tinta/80 via-transparent to-transparent" />
          {instrumen.namaJawa && (
            <div className="absolute bottom-4 left-4 bg-arang/90 px-3 py-1 rounded-md border border-perunggu/40">
              <span className="text-emas font-serif text-lg tracking-wider">
                {instrumen.namaJawa}
              </span>
            </div>
          )}
        </div>

        {/* Ringkasan & Deskripsi */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-block text-emas text-xs uppercase tracking-widest font-semibold">
            Instrumen Karawitan
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gading">
            {instrumen.nama}
          </h1>
          <p className="text-base sm:text-lg text-emas-muda font-serif italic">
            &ldquo;{instrumen.deskripsiSingkat}&rdquo;
          </p>
          <div className="ornamen-garis my-4" />
        </div>
      </div>

      {/* Bagian Fungsi & Filosofi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-perunggu/20">
        {/* Panel Fungsi */}
        <div className="space-y-4 bg-tinta/40 p-6 rounded-xl border border-perunggu/20">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 flex items-center justify-center text-emas">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gading">
              Fungsi dalam Gamelan
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gading/80 leading-relaxed">
            {instrumen.fungsi}
          </p>
        </div>

        {/* Panel Filosofi */}
        <div className="space-y-4 bg-tinta/40 p-6 rounded-xl border border-perunggu/20">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 flex items-center justify-center text-emas">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gading">
              Makna & Filosofi Jawa
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gading/80 leading-relaxed">
            {instrumen.filosofi}
          </p>
        </div>
      </div>
    </div>
  );
};
