"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface PanelRekamanProps {
  isRecording: boolean;
  isPlaying: boolean;
  adaRekaman: boolean;
  jumlahKetukan: number;
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
  jumlahKetukan,
  durasiDetik,
  pesanInfo,
  onMulaiRekam,
  onBerhenti,
  onPutar,
  onHapus,
}) => {
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
        <div className="flex flex-wrap items-center gap-3">
          

          <div className="flex items-center gap-2">
            {/* Tombol Rekam */}
            {!isRecording ? (
              <Button
                variant="emas"
                size="sm"
                onClick={onMulaiRekam}
                disabled={isPlaying}
                aria-label="Mulai Merekam Permainan"
                className="gap-1.5 h-8 text-xs px-3"
              >
                <span className="w-2 h-2 rounded-full bg-tinta" />
                <span>Rekam</span>
              </Button>
            ) : (
              <Button
                variant="garis"
                size="sm"
                onClick={onBerhenti}
                aria-label="Berhenti Merekam"
                className="gap-1.5 h-8 text-xs px-3 border-red-400 text-red-300 hover:bg-red-900/20"
              >
                <span className="w-2 h-2 rounded-sm bg-red-400" />
                <span>Berhenti</span>
              </Button>
            )}

            {/* Tombol Putar */}
            {!isPlaying ? (
              <Button
                variant="arang"
                size="sm"
                onClick={onPutar}
                disabled={!adaRekaman || isRecording}
                aria-label="Putar Ulang Permainan"
                className="gap-1.5 h-8 text-xs px-3"
              >
                <svg className="w-3.5 h-3.5 fill-current text-emas" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Putar</span>
              </Button>
            ) : (
              <Button
                variant="garis"
                size="sm"
                onClick={onBerhenti}
                aria-label="Berhenti Memutar"
                className="gap-1.5 h-8 text-xs px-3"
              >
                <svg className="w-3 h-3 fill-current text-emas" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
                <span>Berhenti</span>
              </Button>
            )}

            {/* Tombol Hapus */}
            <Button
              variant="garis"
              size="sm"
              onClick={onHapus}
              disabled={!adaRekaman || isRecording || isPlaying}
              aria-label="Hapus Rekaman"
              className="h-8 text-xs px-2.5 hover:bg-red-500/10 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/60"
            >
              Hapus
            </Button>
          </div>
        </div>

        {/* Sisi Kanan: Status & Indikator Timer */}
        <div className="flex items-center gap-3 text-xs">
          {isRecording ? (
            <span className="inline-flex items-center gap-2 text-red-400 bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded-full font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Merekam ({formatTimer(durasiDetik)} / 01:00)
            </span>
          ) : isPlaying ? (
            <span className="inline-flex items-center gap-2 text-emas bg-tinta border border-emas/30 px-2.5 py-1 rounded-full font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emas animate-ping" />
              Memutar Ulang
            </span>
          ) : adaRekaman ? (
            <span className="text-gading/80 bg-tinta/60 px-2.5 py-1 rounded-lg border border-perunggu/30 font-mono text-xs">
              Tersimpan: {jumlahKetukan} ketukan
            </span>
          ) : (
            <span className="text-gading/40 italic text-xs">
              *Maksimal 60 detik rekaman
            </span>
          )}
        </div>
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
