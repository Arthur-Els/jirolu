"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface PanelRekamanProps {
  isRecording: boolean;
  isPlaying: boolean;
  adaRekaman: boolean;
  jumlahKetukan?: number;
  durasiDetik: number;
  pesanInfo: string | null;
  onMulaiRekam: () => void;
  onBerhenti: () => void;
  onPutar: () => void;
  onHapus: () => void;
}

export const PanelRekaman: React.FC<PanelRekamanProps> = ({
  isRecording,
  isPlaying,
  adaRekaman,
  durasiDetik,
  pesanInfo,
  onMulaiRekam,
  onBerhenti,
  onPutar,
  onHapus,
}) => {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  // Format detik ke mm:ss
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full pt-4 border-t border-perunggu/25 flex flex-col gap-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Sisi Kiri: Label & Tombol Aksi */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Tombol Rekam */}
            {!isRecording ? (
              <Button
                variant="emas"
                size="sm"
                onClick={onMulaiRekam}
                disabled={isPlaying}
                aria-label={isEn ? "Start Recording Performance" : "Mulai Merekam Permainan"}
                className="gap-1.5 h-9 sm:h-8 text-xs px-3 flex-1 sm:flex-initial"
              >
                <span className="w-2 h-2 rounded-full bg-tinta" />
                <span>{isEn ? "Record" : "Rekam"}</span>
              </Button>
            ) : (
              <Button
                variant="garis"
                size="sm"
                onClick={onBerhenti}
                aria-label={isEn ? "Stop Recording" : "Berhenti Merekam"}
                className="gap-1.5 h-9 sm:h-8 text-xs px-3 border-red-400 text-red-300 hover:bg-red-900/20 flex-1 sm:flex-initial"
              >
                <span className="w-2 h-2 rounded-sm bg-red-400" />
                <span>{isEn ? "Stop" : "Berhenti"}</span>
              </Button>
            )}

            {/* Tombol Putar */}
            {!isPlaying ? (
              <Button
                variant="arang"
                size="sm"
                onClick={onPutar}
                disabled={!adaRekaman || isRecording}
                aria-label={isEn ? "Play Back Recording" : "Putar Ulang Permainan"}
                className="gap-1.5 h-9 sm:h-8 text-xs px-3 flex-1 sm:flex-initial"
              >
                <svg className="w-3.5 h-3.5 fill-current text-emas" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{isEn ? "Play" : "Putar"}</span>
              </Button>
            ) : (
              <Button
                variant="garis"
                size="sm"
                onClick={onBerhenti}
                aria-label={isEn ? "Stop Playback" : "Berhenti Memutar"}
                className="gap-1.5 h-9 sm:h-8 text-xs px-3 flex-1 sm:flex-initial"
              >
                <svg className="w-3 h-3 fill-current text-emas" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
                <span>{isEn ? "Stop" : "Berhenti"}</span>
              </Button>
            )}

            {/* Tombol Hapus */}
            <Button
              variant="garis"
              size="sm"
              onClick={onHapus}
              disabled={!adaRekaman || isRecording || isPlaying}
              aria-label={isEn ? "Delete Recording" : "Hapus Rekaman"}
              className="h-9 sm:h-8 text-xs px-2.5 hover:bg-red-500/10 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/60"
            >
              {isEn ? "Delete" : "Hapus"}
            </Button>
          </div>
        </div>

        {/* Sisi Kanan: Status & Indikator Timer */}
        {(isRecording || isPlaying || !adaRekaman) && (
          <div className="flex items-center gap-3 text-xs">
            {isRecording ? (
              <span className="inline-flex items-center gap-2 text-red-400 bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded-full font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {isEn
                  ? `Recording (${formatTimer(durasiDetik)} / 01:00)`
                  : `Merekam (${formatTimer(durasiDetik)} / 01:00)`}
              </span>
            ) : isPlaying ? (
              <span className="inline-flex items-center gap-2 text-emas bg-tinta border border-emas/30 px-2.5 py-1 rounded-full font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-emas animate-ping" />
                {isEn ? "Playing Back" : "Memutar Ulang"}
              </span>
            ) : (
              <span className="text-gading/40 italic text-xs">
                {isEn ? "*60 seconds maximum recording" : "*Maksimal 60 detik rekaman"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Pesan Ramah Batas Waktu */}
      {pesanInfo && (
        <div className="p-2.5 rounded-xl bg-emas/10 border border-emas/30 text-xs text-emas-muda">
          {pesanInfo}
        </div>
      )}
    </div>
  );
};
