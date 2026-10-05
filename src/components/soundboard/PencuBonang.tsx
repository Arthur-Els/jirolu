"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Nada } from "@/types/instrumen";
import { KeyboardHint } from "./KeyboardHint";

interface PencuBonangProps {
  nada: Nada;
  isTriggeredByKey?: boolean;
  onPlay: (nada: Nada) => void;
}

/**
 * Komponen Pencon (Gong Kecil) Bonang.
 * Berbentuk bundar dengan tonjolan poros (pencu) di tengah.
 * Menggunakan Pointer Events untuk responsif instan tanpa lag.
 */
export const PencuBonang: React.FC<PencuBonangProps> = ({
  nada,
  isTriggeredByKey = false,
  onPlay,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (isTriggeredByKey) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isTriggeredByKey]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setIsActive(true);
      onPlay(nada);
      setTimeout(() => setIsActive(false), 180);
    },
    [nada, onPlay]
  );

  return (
    <div className="flex flex-col items-center gap-1.5 p-1 select-none">
      <button
        type="button"
        onPointerDown={handlePointerDown}
        style={{ touchAction: "none" }}
        aria-label={`Pencon Bonang nada ${nada.nada} (${nada.label}), tombol ${nada.key.toUpperCase()}`}
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full relative flex flex-col items-center justify-center transition-all duration-100 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emas ${
          isActive
            ? "bg-gradient-to-tr from-emas via-emas-muda to-emas shadow-[0_0_30px_rgba(212,175,55,0.9)] scale-95"
            : "bg-gradient-to-tr from-[#694b1a] via-[#a3792f] to-[#cfab56] hover:from-[#7d5a20] hover:to-[#dfbb66] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_14px_rgba(0,0,0,0.6)]"
        }`}
      >
        {/* Lingkaran Luar Pencon */}
        <div className="absolute inset-1 rounded-full border border-emas/40 pointer-events-none" />

        {/* Pencu Tengah (Tonjolan Pusat Nada) */}
        <div
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border shadow-md flex items-center justify-center transition-colors pointer-events-none ${
            isActive
              ? "bg-[#2A1E14] border-tinta text-emas"
              : "bg-gradient-to-b from-emas-muda to-[#916b25] border-[#523c14] text-tinta"
          }`}
        >
          <span className="font-serif text-xs font-black">{nada.nada}</span>
        </div>

        {/* Label Sebutan Nada (Ji, Ro, Lu, dll) */}
        <span
          className={`text-[10px] font-serif font-bold tracking-tight mt-1 transition-colors pointer-events-none ${
            isActive ? "text-tinta" : "text-[#2e2311]"
          }`}
        >
          {nada.label.replace(" (tinggi)", "")}
        </span>
      </button>

      {/* Petunjuk Tombol Keyboard */}
      <KeyboardHint shortcutKey={nada.key} />
    </div>
  );
};
