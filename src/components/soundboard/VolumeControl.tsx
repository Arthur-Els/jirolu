"use client";

import React from "react";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  return (
    <div className="flex items-center gap-2.5 bg-tinta/80 border border-perunggu/30 px-3 py-1.5 rounded-xl shadow-inner w-full sm:w-auto">
      {/* Tombol Mute / Unmute */}
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? "Nyalakan suara" : "Matikan suara"}
        className="text-gading/80 hover:text-emas p-1.5 rounded-lg transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer focus:outline-none focus:ring-1 focus:ring-emas shrink-0"
      >
        {isMuted || volume === 0 ? (
          // Ikon Volume Mute / Bisu
          <svg className="w-5 h-5 text-perunggu" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          // Ikon Volume Aktif
          <svg className="w-5 h-5 text-emas" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Slider Volume */}
      <div className="flex items-center gap-2 flex-1 sm:flex-initial">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          aria-label="Pengatur Volume Suara"
          className="w-full sm:w-24 h-1.5 bg-arang rounded-full appearance-none cursor-pointer accent-emas"
        />
        <span className="text-[11px] font-mono text-gading/60 w-8 text-right select-none shrink-0">
          {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
        </span>
      </div>
    </div>
  );
};
