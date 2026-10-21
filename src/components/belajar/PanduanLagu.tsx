"use client";

import React from "react";
import { Lagu } from "@/types/lagu";
import { StatusBelajar } from "@/lib/belajar/useBelajarLagu";
import { Button } from "@/components/ui/Button";

interface PanduanLaguProps {
  lagu: Lagu;
  status: StatusBelajar;
  currentStepIndex: number;
  totalNotes: number;
  targetNote: string | null;
  salahHitung: number;
  larasAutoChanged?: boolean;
  onMulai: () => void;
  onUlangi: () => void;
  onKeluar: () => void;
  onPilihLaguLain: () => void;
}

export const PanduanLagu: React.FC<PanduanLaguProps> = ({
  lagu,
  status,
  currentStepIndex,
  totalNotes,
  targetNote,
  salahHitung,
  larasAutoChanged,
  onMulai,
  onUlangi,
  onKeluar,
  onPilihLaguLain,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-tinta/80 border border-emas/40 shadow-xl space-y-4">
      {/* Pesan Otomatis Ganti Laras */}
      {larasAutoChanged && (
        <div className="p-2.5 rounded-lg bg-emas/10 border border-emas/30 text-xs text-emas-muda flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-emas" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Laras soundboard otomatis disesuaikan ke <strong>{lagu.laras.toUpperCase()}</strong> mengikuti lagu ini.
          </span>
        </div>
      )}

      {/* Header Info Lagu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-perunggu/25">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-emas font-semibold">
            Mode Belajar Lagu
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-gading">
            {lagu.judul}
          </h3>
          <span className="text-xs text-gading/60 capitalize">
            Laras: {lagu.laras} • Tingkat: {lagu.tingkat}
          </span>
        </div>

        {/* Tombol Aksi Sesuai Status */}
        <div className="flex items-center gap-2">
          {status === "belum_mulai" && (
            <>
              <Button variant="emas" size="sm" onClick={onMulai}>
                Mulai Belajar
              </Button>
              <Button variant="arang" size="sm" onClick={onPilihLaguLain}>
                Pilih Lagu Lain
              </Button>
            </>
          )}

          {status === "berjalan" && (
            <>
              <Button variant="arang" size="sm" onClick={onUlangi}>
                Ulangi
              </Button>
              <Button variant="merah" size="sm" onClick={onKeluar}>
                Keluar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Kondisi 1: Belum Mulai */}
      {status === "belum_mulai" && (
        <div className="text-center py-4 space-y-2">
          <p className="text-sm text-gading/75">
            Klik tombol <strong>&ldquo;Mulai Belajar&rdquo;</strong> di atas. Perhatikan bilah yang menyala berdenyut emas, lalu tekan bilah tersebut secara berurutan.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gading/50 pt-1">
            <span>Total: {totalNotes} ketukan nada</span>
          </div>
        </div>
      )}

      {/* Kondisi 2: Sedang Berjalan */}
      {status === "berjalan" && (
        <div className="space-y-3">
          {/* Progress Bar & Indikator */}
          <div className="flex items-center justify-between text-xs text-gading/70">
            <span className="font-semibold text-emas">
              Nada {currentStepIndex + 1} dari {totalNotes}
            </span>
            <span className="text-gading/50">
              Salah tekan: {salahHitung} kali
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-arang overflow-hidden border border-perunggu/30">
            <div
              className="h-full bg-gradient-to-r from-perunggu to-emas transition-all duration-300 rounded-full"
              style={{
                width: `${Math.round(((currentStepIndex) / totalNotes) * 100)}%`,
              }}
            />
          </div>

          {/* Deretan Notasi Lagu dengan Penanda Nada Saat Ini */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-3 px-2 bg-arang/60 rounded-xl border border-perunggu/20">
            {lagu.nada.map((nd, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={`${nd}-${idx}`}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex flex-col items-center justify-center font-serif transition-all duration-200 select-none ${
                    isCurrent
                      ? "bg-emas text-tinta font-extrabold text-lg sm:text-xl shadow-[0_0_15px_rgba(212,175,55,0.7)] scale-110"
                      : isPast
                      ? "bg-arang border border-perunggu/40 text-gading/40 text-sm"
                      : "bg-tinta/80 border border-perunggu/20 text-gading/70 text-sm"
                  }`}
                >
                  <span>{nd}</span>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gading/60 pt-1">
            {lagu.alat.includes("bonang") ? (
              <>
                Tekan pencon nada <strong className="text-emas font-serif text-sm">[{targetNote}]</strong> di <span className="text-emas-muda font-semibold">baris bawah (tuts A-J)</span> yang menyala berdenyut pada soundboard.
              </>
            ) : (
              <>
                Tekan bilah nada <strong className="text-emas font-serif text-sm">[{targetNote}]</strong> (tuts A-J) yang sedang menyala berdenyut pada soundboard.
              </>
            )}
          </p>
        </div>
      )}

      {/* Kondisi 3: Selesai */}
      {status === "selesai" && (
        <div className="p-6 rounded-xl bg-arang border border-emas/50 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-emas/20 border border-emas mx-auto flex items-center justify-center text-emas">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h4 className="font-serif text-2xl font-bold text-gading">
              Selamat! Kamu Berhasil Menyelesaikan Lagu Ini
            </h4>
            <p className="text-xs sm:text-sm text-gading/80 leading-relaxed">
              Kamu telah memainkan seluruh notasi lagu <strong>{lagu.judul}</strong>.
              {salahHitung === 0
                ? " Luar biasa! Sempurna tanpa ada salah tekan!"
                : ` Jumlah salah tekan: ${salahHitung} kali. Latihan terus agar makin lancar!`}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="emas" size="md" onClick={onUlangi}>
              Main Lagi
            </Button>
            <Button variant="arang" size="md" onClick={onPilihLaguLain}>
              Pilih Lagu Lain
            </Button>
            <Button variant="garis" size="md" onClick={onKeluar}>
              Kembali ke Main Bebas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
