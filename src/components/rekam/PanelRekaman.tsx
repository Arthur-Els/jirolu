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
    <div className="w-full bg-tinta/85 border border-perunggu/35 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
      {/* Baris Atas: Judul Panel & Indikator Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-perunggu/20">
        <div className="flex items-center gap-2">
          {/* Ikon Kaset / Disk Pita Sederhana */}
          <div className="w-6 h-6 rounded-md bg-arang border border-emas/40 flex items-center justify-center text-emas">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
              <path strokeWidth="2" d="M19 12a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="font-serif text-base font-bold text-gading">
            Rekam Permainan
          </span>
        </div>

        {/* Status Timer / Indikator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {isRecording ? (
            <span className="inline-flex items-center gap-2 text-red-400 bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              Merekam ({formatTimer(durasiDetik)} / 01:00)
            </span>
          ) : isPlaying ? (
            <span className="inline-flex items-center gap-2 text-emas bg-arang border border-emas/30 px-2.5 py-1 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-emas animate-ping" />
              Memutar Ulang
            </span>
          ) : adaRekaman ? (
            <span className="text-gading/70 bg-arang/60 px-2.5 py-1 rounded-md border border-perunggu/25">
              Tersimpan: {jumlahKetukan} ketukan
            </span>
          ) : (
            <span className="text-gading/40 italic font-sans text-[11px]">
              Belum ada rekaman
            </span>
          )}
        </div>
      </div>

      {/* Baris Tombol Aksi */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Tombol Rekam */}
        {!isRecording ? (
          <Button
            variant="emas"
            size="sm"
            onClick={onMulaiRekam}
            disabled={isPlaying}
            aria-label="Mulai Merekam Permainan"
            className="gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-tinta" />
            <span>Rekam</span>
          </Button>
        ) : (
          <Button
            variant="garis"
            size="sm"
            onClick={onBerhenti}
            aria-label="Berhenti Merekam"
            className="gap-2 border-red-400 text-red-300 hover:bg-red-900/20"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-red-400" />
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
            className="gap-2"
          >
            <svg className="w-4 h-4 fill-current text-emas" viewBox="0 0 24 24">
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
            className="gap-2"
          >
            <svg className="w-3.5 h-3.5 fill-current text-emas" viewBox="0 0 24 24">
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
          className="hover:bg-red-500/10 text-red-500 hover:text-red-500 border-red-500/40 hover:border-red-500"
        >
          Hapus
        </Button>
      </div>

      {/* Pesan Ramah Batas Waktu */}
      {pesanInfo && (
        <div className="p-2 rounded-lg bg-emas/10 border border-emas/30 text-xs text-emas-muda">
          {pesanInfo}
        </div>
      )}

      {/* Catatan Kecil Penyimpanan */}
      <div className="text-[11px] text-gading/45 flex items-center justify-between">
        <span>* Rekaman hilang jika halaman dimuat ulang (refresh).</span>
        <span>Maksimal 60 detik</span>
      </div>
    </div>
  );
};
