"use client";

import React, { useState, useCallback } from "react";
import { Nada } from "@/types/instrumen";
import { KeyboardHint } from "./KeyboardHint";

interface PencuBonangProps {
  nada: Nada;
  isTriggeredByKey?: boolean;
  isTargetLearnNote?: boolean;
  isWrongFeedback?: boolean;
  isPlaybackActive?: boolean;
  onPlay: (nada: Nada) => void;
}

/**
 * Komponen Pencon Bonang dengan dukungan mode belajar dan playback rekaman.
 */
export const PencuBonang: React.FC<PencuBonangProps> = ({
  nada,
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
      setTimeout(() => setIsPointerActive(false), 180);
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
            : isTargetLearnNote
            ? "bg-gradient-to-tr from-[#9c752b] via-[#caa14d] to-[#ecd38c] ring-2 ring-emas animate-denyut-emas scale-105"
            : "bg-gradient-to-tr from-[#694b1a] via-[#a3792f] to-[#cfab56] hover:from-[#7d5a20] hover:to-[#dfbb66] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_14px_rgba(0,0,0,0.6)]"
        } ${isWrongFeedback ? "animate-getar" : ""}`}
      >
        <div className="absolute inset-1 rounded-full border border-emas/40 pointer-events-none" />

        {/* Pencu Tengah */}
        <div
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border shadow-md flex items-center justify-center transition-colors pointer-events-none ${
            isActive
              ? "bg-[#2A1E14] border-tinta text-emas"
              : isTargetLearnNote
              ? "bg-emas text-tinta border-tinta"
              : "bg-gradient-to-b from-emas-muda to-[#916b25] border-[#523c14] text-tinta"
          }`}
        >
          <span className="font-serif text-xs font-black">{nada.nada}</span>
        </div>

        <span
          className={`text-[10px] font-serif font-bold tracking-tight mt-1 transition-colors pointer-events-none ${
            isActive ? "text-tinta" : "text-[#2e2311]"
          }`}
        >
          {nada.label.replace(" (tinggi)", "")}
        </span>
      </button>

      <KeyboardHint shortcutKey={nada.key} />
    </div>
  );
};
