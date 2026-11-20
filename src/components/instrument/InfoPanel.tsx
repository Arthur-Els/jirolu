"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Instrumen } from "@/types/instrumen";

interface InfoPanelProps {
  instrumen: Instrumen;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ instrumen }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-arang/60 border border-perunggu/25 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300">
      {/* Tombol Accordion Minimalis */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-5 sm:px-7 py-4.5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emas/70" />
          <span className="font-serif text-base sm:text-lg text-gading font-medium">
            Tentang &amp; Filosofi {instrumen.nama}
          </span>
          {instrumen.namaJawa && (
            <span className="text-xs text-emas-muda font-serif italic hidden sm:inline">
              ({instrumen.namaJawa})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gading/60 font-medium">
          <span>{isOpen ? "Tutup" : "Baca Detail"}</span>
          <svg
            className={`w-4 h-4 text-emas transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Konten Accordion yang Terbuka */}
      {isOpen && (
        <div className="px-5 sm:px-8 pb-7 pt-2 border-t border-perunggu/20 space-y-6 animate-in fade-in duration-200">
          <p className="text-sm sm:text-base text-emas-muda font-serif italic">
            &ldquo;{instrumen.deskripsiSingkat}&rdquo;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Panel Fungsi */}
            <div className="space-y-2 bg-tinta/40 p-4 sm:p-5 rounded-xl border border-perunggu/15">
              <span className="text-xs font-semibold uppercase tracking-wider text-emas flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emas" />
                Fungsi dalam Gamelan
              </span>
              <p className="text-xs sm:text-sm text-gading/80 leading-relaxed font-light">
                {instrumen.fungsi}
              </p>
            </div>

            {/* Panel Filosofi */}
            <div className="space-y-2 bg-tinta/40 p-4 sm:p-5 rounded-xl border border-perunggu/15">
              <span className="text-xs font-semibold uppercase tracking-wider text-emas flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emas" />
                Makna &amp; Filosofi Jawa
              </span>
              <p className="text-xs sm:text-sm text-gading/80 leading-relaxed font-light">
                {instrumen.filosofi}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
