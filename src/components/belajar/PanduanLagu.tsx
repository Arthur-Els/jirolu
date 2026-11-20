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
  // Fitur Contoh Permainan
  isDemoPlaying?: boolean;
  demoStepIndex?: number | null;
  onMulaiDemo?: () => void;
  onHentikanDemo?: () => void;
}

export const PanduanLagu: React.FC<PanduanLaguProps> = ({
  lagu,
  status,
  salahHitung,
  larasAutoChanged,
  onMulai,
  onUlangi,
  onKeluar,
  onPilihLaguLain,
  isDemoPlaying = false,
  onMulaiDemo,
  onHentikanDemo,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-tinta/80 border border-emas/40 shadow-xl space-y-4">
      {/* Pesan Otomatis Ganti Laras */}
      {larasAutoChanged && (
        <div className="p-2.5 rounded-xl bg-emas/10 border border-emas/30 text-xs text-emas-muda flex items-center gap-2">
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
        <div className="flex flex-wrap items-center gap-2">
          {status === "belum_mulai" && (
            <>
              {/* Tombol Contoh Permainan */}
              <button
                type="button"
                onClick={isDemoPlaying ? onHentikanDemo : onMulaiDemo}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider motion-safe:transition-colors duration-150 motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-focus cursor-pointer min-h-[44px] border ${
                  isDemoPlaying
                    ? "bg-red-950/80 border-red-500 text-red-200 hover:bg-red-900"
                    : "bg-paper-2 hover:bg-paper-3 text-ink border-rule hover:border-accent"
                }`}
              >
                {isDemoPlaying ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-400 animate-pulse" />
                    <span>Hentikan Contoh</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-emas" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Contoh Permainan</span>
                  </>
                )}
              </button>

              <Button
                variant="emas"
                size="sm"
                onClick={() => {
                  if (isDemoPlaying) onHentikanDemo?.();
                  onMulai();
                }}
                className="min-h-[44px]"
              >
                Mulai Belajar
              </Button>

              <Button
                variant="arang"
                size="sm"
                onClick={() => {
                  if (isDemoPlaying) onHentikanDemo?.();
                  onPilihLaguLain();
                }}
                className="min-h-[44px]"
              >
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
        <div className="space-y-2">
          {isDemoPlaying ? (
            <div className="py-1 text-center animate-in fade-in duration-200">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emas/15 border border-emas/40 text-xs text-emas-muda font-medium shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emas animate-ping" />
                Memainkan contoh melodi... Ikuti sorotan pada alat musik di bawah.
              </span>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs sm:text-sm text-gading/75">
                Dengarkan contoh dengan tombol <strong>&ldquo;Contoh Permainan&rdquo;</strong>, atau klik <strong>&ldquo;Mulai Belajar&rdquo;</strong> untuk langsung bermain mengikuti sorotan bilah/pencon.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Kondisi 2: Sedang Berjalan (Minimalis: petunjuk murni dari sorotan bilah/pencon) */}
      {status === "berjalan" && (
        <div className="text-center py-1 animate-in fade-in duration-200">
          <p className="text-xs sm:text-sm text-gading/80">
            {lagu.alat.includes("bonang") ? (
              <>
                Tekan pencon <span className="text-emas font-semibold">baris bawah (tuts A-J)</span> yang sedang menyala berdenyut pada alat musik di bawah.
              </>
            ) : (
              <>
                Tekan bilah perunggu <span className="text-emas font-semibold">(tuts angka 1-7)</span> yang sedang menyala berdenyut pada alat musik di bawah.
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
