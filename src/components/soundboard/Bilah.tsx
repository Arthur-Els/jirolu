"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Nada } from "@/types/instrumen";
import { KeyboardHint } from "./KeyboardHint";

interface BilahProps {
  nada: Nada;
  index: number;
  totalBilah: number;
  isTriggeredByKey?: boolean;
  onPlay: (nada: Nada) => void;
}

/**
 * Komponen Bilah Gamelan Tunggal.
 * Menggunakan onPointerDown + touch-action: none untuk latensi instan di HP
 * serta mendukung multi-touch (beberapa bilah ditekan bersamaan).
 */
export const Bilah: React.FC<BilahProps> = ({
  nada,
  index,
  totalBilah,
  isTriggeredByKey = false,
  onPlay,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  // Efek visual jika nada dipicu oleh keyboard
  useEffect(() => {
    if (isTriggeredByKey) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isTriggeredByKey]);

  // Tangani sentuhan / klik via Pointer Events untuk latensi instan tanpa 300ms click delay di mobile
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      // Cegah scrolling khusus pada area bilah ini saat disentuh
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setIsActive(true);
      onPlay(nada);

      // Kembalikan efek visual setelah 180ms
      setTimeout(() => {
        setIsActive(false);
      }, 180);
    },
    [nada, onPlay]
  );

  // Meniru proporsi panjang fisik bilah Saron tradisional Jawa:
  // Nada rendah (index 0) lebih panjang, nada tinggi (index 6) makin pendek
  const tinggiPersen = 100 - index * 3.5;

  return (
    <div className="flex-1 flex flex-col items-center justify-end h-72 sm:h-84 md:h-96 min-w-[42px] max-w-[90px]">
      <button
        type="button"
        onPointerDown={handlePointerDown}
        style={{
          height: `${tinggiPersen}%`,
          touchAction: "none", // PENTING: Mencegah zoom dan scroll browser saat bermain di HP
        }}
        aria-label={`Bilah nada ${nada.nada} (${nada.label}), tombol ${nada.key.toUpperCase()}`}
        className={`w-full rounded-t-xl rounded-b-md relative flex flex-col items-center justify-between py-4 px-1.5 transition-all duration-100 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emas ${
          isActive
            ? "bg-gradient-to-b from-emas via-emas-muda to-emas shadow-[0_0_30px_rgba(212,175,55,0.85)] translate-y-1 scale-[0.98]"
            : "bg-gradient-to-b from-[#caa14d] via-[#a37c32] to-[#71501b] hover:from-[#d8b05c] hover:to-[#7f5a1f] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_12px_rgba(0,0,0,0.6)]"
        }`}
      >
        {/* Titik Paku/Penyangga Bilah Bagian Atas */}
        <div className="w-2.5 h-2.5 rounded-full bg-[#1f1911] border border-[#d4af37]/60 shadow-inner flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#110e0a]" />
        </div>

        {/* Teks Identitas Nada */}
        <div className="flex flex-col items-center my-auto pointer-events-none select-none">
          <span
            className={`font-serif text-2xl sm:text-3xl font-extrabold transition-colors ${
              isActive ? "text-tinta" : "text-[#1a140b] drop-shadow-sm"
            }`}
          >
            {nada.nada}
          </span>
          <span
            className={`text-xs sm:text-sm font-serif italic tracking-wide -mt-1 font-semibold ${
              isActive ? "text-tinta" : "text-[#2e2311]"
            }`}
          >
            {nada.label}
          </span>
        </div>

        {/* Petunjuk Tombol Keyboard & Titik Penyangga Bawah */}
        <div className="flex flex-col items-center gap-2">
          <KeyboardHint shortcutKey={nada.key} />
          {/* Titik Paku/Penyangga Bilah Bagian Bawah */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#1f1911] border border-[#d4af37]/60 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#110e0a]" />
          </div>
        </div>
      </button>
    </div>
  );
};
