"use client";

import React, { useState, useCallback } from "react";
import { Nada } from "@/types/instrumen";
import { KeyboardHint } from "./KeyboardHint";

interface BilahProps {
  nada: Nada;
  index: number;
  totalBilah: number;
  isTriggeredByKey?: boolean;
  isTargetLearnNote?: boolean;
  isWrongFeedback?: boolean;
  isPlaybackActive?: boolean;
  onPlay: (nada: Nada) => void;
}

/**
 * Komponen Bilah Gamelan Tunggal.
 * Menggunakan onPointerDown + touch-action: none untuk latensi 0 ms di HP.
 * Mendukung visual feedback saat mode belajar (denyut emas & getar lembut).
 */
export const Bilah: React.FC<BilahProps> = ({
  nada,
  index,
  isTriggeredByKey = false,
  isTargetLearnNote = false,
  isWrongFeedback = false,
  isPlaybackActive = false,
  onPlay,
}) => {
  const [isPointerActive, setIsPointerActive] = useState<boolean>(false);
  const isActive = isPointerActive || isTriggeredByKey || isPlaybackActive;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setIsPointerActive(true);
      onPlay(nada);
      setTimeout(() => {
        setIsPointerActive(false);
      }, 180);
    },
    [nada, onPlay]
  );

  const tinggiPersen = 100 - index * 3.5;

  return (
    <div className="flex-1 flex flex-col items-center justify-end h-72 sm:h-84 md:h-96 min-w-[42px] max-w-[90px]">
      <button
        type="button"
        onPointerDown={handlePointerDown}
        style={{
          height: `${tinggiPersen}%`,
          touchAction: "none",
        }}
        aria-label={`Bilah nada ${nada.nada} (${nada.label}), tombol ${nada.key.toUpperCase()}`}
        className={`w-full rounded-t-xl rounded-b-md relative flex flex-col items-center justify-between py-4 px-1.5 transition-all duration-100 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emas ${
          isActive
            ? "bg-gradient-to-b from-emas via-emas-muda to-emas shadow-[0_0_30px_rgba(212,175,55,0.85)] translate-y-1 scale-[0.98]"
            : isTargetLearnNote
            ? "bg-gradient-to-b from-[#dfb962] via-[#b68937] to-[#805a1d] ring-2 ring-emas animate-denyut-emas scale-[1.02]"
            : "bg-gradient-to-b from-[#caa14d] via-[#a37c32] to-[#71501b] hover:from-[#d8b05c] hover:to-[#7f5a1f] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_12px_rgba(0,0,0,0.6)]"
        } ${isWrongFeedback ? "animate-getar" : ""}`}
      >
        {/* Titik Paku/Penyangga Bagian Atas */}
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
          <div className="w-2.5 h-2.5 rounded-full bg-[#1f1911] border border-[#d4af37]/60 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#110e0a]" />
          </div>
        </div>
      </button>
    </div>
  );
};
