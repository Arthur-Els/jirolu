"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Instrumen, Laras, Nada } from "@/types/instrumen";
import { useAudioBuffers } from "@/lib/audio/useAudioBuffers";
import { getNoteIndexFromKey } from "@/lib/audio/keyMaps";
import { Bilah } from "./Bilah";
import { LarasToggle } from "./LarasToggle";
import { Button } from "@/components/ui/Button";

interface SoundboardProps {
  instrumen: Instrumen;
}

export const Soundboard: React.FC<SoundboardProps> = ({ instrumen }) => {
  const [laras, setLaras] = useState<Laras>(instrumen.larasDefault || "pelog");
  const [activeKeyIndex, setActiveKeyIndex] = useState<number | null>(null);

  // Ambil daftar nada sesuai laras yang aktif
  const nadaList: Nada[] = instrumen.laras[laras] || [];
  const hasSlendro = Boolean(instrumen.laras.slendro && instrumen.laras.slendro.length > 0);

  // Muat audio buffer menggunakan custom hook Web Audio API
  const {
    isLoading,
    isAudioUnlocked,
    audioFilesAvailable,
    playNote,
    handleUnlock,
  } = useAudioBuffers(nadaList);

  // Tangani masukan keyboard komputer (A, S, D, F, G, H, J)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan jika fokus sedang berada pada input/textarea teks
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // 6. Abaikan e.repeat agar tidak memicu suara berulang liar saat tombol ditahan
      if (e.repeat) return;

      const noteIndex = getNoteIndexFromKey(e.key);
      if (noteIndex !== undefined && noteIndex < nadaList.length) {
        const targetNada = nadaList[noteIndex];
        playNote(targetNada);
        setActiveKeyIndex(noteIndex);

        // Reset highlight keyboard setelah 180ms
        setTimeout(() => {
          setActiveKeyIndex(null);
        }, 180);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nadaList, playNote]);

  const handleBilahPlay = useCallback(
    (nada: Nada) => {
      playNote(nada);
    },
    [playNote]
  );

  return (
    <div className="w-full bg-arang/90 border border-perunggu/35 rounded-2xl p-4 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header Soundboard: Judul & Toggle Laras */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-perunggu/25">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emas animate-pulse" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gading">
              Soundboard Virtual {instrumen.nama}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gading/65 mt-1">
            Sentuh bilah atau tekan tombol keyboard{" "}
            <span className="text-emas font-semibold">[A - J]</span> untuk memukul bilah
            perunggu.
          </p>
        </div>

        <LarasToggle
          currentLaras={laras}
          onLarasChange={setLaras}
          hasSlendro={hasSlendro}
        />
      </div>

      {/* 12. Pesan Ramah Ketersediaan Audio File */}
      {!isLoading && !audioFilesAvailable && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-tinta/80 border border-emas/30 text-xs sm:text-sm text-gading/85">
          <div className="text-emas mt-0.5 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-emas">Mode Audio Synthesizer Aktif</p>
            <p className="text-gading/70 leading-relaxed text-xs">
              File rekaman asli <code className="text-emas-muda bg-arang px-1.5 py-0.5 rounded">.webm</code> belum terdeteksi di folder{" "}
              <code className="text-emas-muda bg-arang px-1.5 py-0.5 rounded">public/audio/saron/pelog/</code>. Soundboard tetap dapat dimainkan dengan
              suara simulasi gamelan perunggu Web Audio API otomatis.
            </p>
          </div>
        </div>
      )}

      {/* 7. Tombol Mulai Bermain (Penting untuk iOS Safari & browser yang memblokir autoplay) */}
      {!isAudioUnlocked && (
        <div className="text-center p-3 rounded-lg bg-tinta/60 border border-perunggu/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gading/75">
            Klik tombol di samping untuk memastikan audio aktif sempurna di ponsel / Safari:
          </span>
          <Button
            variant="emas"
            size="sm"
            onClick={handleUnlock}
            className="w-full sm:w-auto"
          >
            Aktifkan Suara Audio
          </Button>
        </div>
      )}

      {/* Rancakan (Wadah Fisik Saron Ukiran Tradisional) */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#2a1e14] via-[#1c140d] to-[#120c07] p-3 sm:p-6 border-2 border-[#543b23] shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
        {/* Ornamen Ukir List Kayu Atas */}
        <div className="w-full h-3 rounded-t-lg bg-gradient-to-r from-perunggu/30 via-emas/40 to-perunggu/30 mb-2 border-b border-[#3d2a1b]" />

        {/* Deretan Bilah Saron */}
        <div className="flex items-end justify-center gap-1.5 sm:gap-3 md:gap-4 overflow-x-auto py-2 px-1 select-none">
          {nadaList.length > 0 ? (
            nadaList.map((item, index) => (
              <Bilah
                key={`${laras}-${item.nada}`}
                nada={item}
                index={index}
                totalBilah={nadaList.length}
                isTriggeredByKey={activeKeyIndex === index}
                onPlay={handleBilahPlay}
              />
            ))
          ) : (
            <div className="py-16 text-center text-gading/50 text-sm">
              Tidak ada bilah nada yang tersedia untuk laras ini.
            </div>
          )}
        </div>

        {/* Ornamen List Kayu Bawah Rancakan */}
        <div className="w-full h-4 rounded-b-lg bg-gradient-to-r from-[#170f09] via-[#382618] to-[#170f09] mt-3 border-t border-[#4a3423] flex items-center justify-center">
          <div className="w-24 h-1 rounded-full bg-emas/30" />
        </div>
      </div>

      {/* Petunjuk Bermain di Bagian Bawah */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gading/50 gap-2 pt-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emas" />
          <span>Mendukung multi-touch (beberapa bilah sekaligus)</span>
        </div>
        <div>
          <span>Latensi instan via Web Audio API murni</span>
        </div>
      </div>
    </div>
  );
};
