"use client";

import React, { useState } from "react";
import { Lagu } from "@/types/lagu";
import { DaftarLagu } from "./DaftarLagu";
import { PanduanLagu } from "./PanduanLagu";
import { useBelajarLagu } from "@/lib/belajar/useBelajarLagu";

interface ModeBelajarProps {
  availableSongs: Lagu[];
  currentLaras: "slendro" | "pelog";
  onLarasChange: (laras: "slendro" | "pelog") => void;
  // Callback untuk memberikan target nada yang sedang harus ditekan ke Soundboard
  onTargetNoteChange: (noteSymbol: string | null) => void;
  isRecordingOrPlaying?: boolean;
  onRegisterInputHandler?: (handler: ((noteSymbol: string, baris?: number) => boolean) | null) => void;
  onActiveTabChange?: (tab: "bebas" | "belajar") => void;
  onPlayDemoNote?: (noteSymbol: string, baris?: number) => void;
}

export const ModeBelajar: React.FC<ModeBelajarProps> = ({
  availableSongs,
  currentLaras,
  onLarasChange,
  onTargetNoteChange,
  isRecordingOrPlaying = false,
  onRegisterInputHandler,
  onActiveTabChange,
  onPlayDemoNote,
}) => {
  const [activeTab, setActiveTab] = useState<"bebas" | "belajar">("bebas");
  const [selectedSong, setSelectedSong] = useState<Lagu | null>(null);
  const [larasAutoChanged, setLarasAutoChanged] = useState<boolean>(false);

  // State untuk Fitur Contoh Permainan Otomatis
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number | null>(null);
  const demoTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Hook manajemen belajar lagu
  const {
    status,
    currentStepIndex,
    totalNotes,
    targetNote,
    salahHitung,
    mulai,
    ulangi,
    keluar,
    handleInputNote,
  } = useBelajarLagu({
    lagu: selectedSong,
    larasAktif: currentLaras,
    onLarasMismatch: (targetLaras) => {
      onLarasChange(targetLaras);
      setLarasAutoChanged(true);
      setTimeout(() => setLarasAutoChanged(false), 4000);
    },
  });

  // Fungsi penghentian demo lagu
  const hentikanDemo = React.useCallback(() => {
    if (demoTimerRef.current) {
      clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }
    setIsDemoPlaying(false);
    setDemoStepIndex(null);
    onTargetNoteChange(null);
  }, [onTargetNoteChange]);

  // Fungsi pemutaran contoh permainan otomatis (~600ms per ketukan)
  const mulaiDemo = React.useCallback(() => {
    if (!selectedSong || selectedSong.nada.length === 0) return;

    if (demoTimerRef.current) {
      clearTimeout(demoTimerRef.current);
    }

    setIsDemoPlaying(true);
    setDemoStepIndex(0);

    const notes = selectedSong.nada;
    const isBonang = selectedSong.alat.includes("bonang");
    const targetBaris = isBonang ? 2 : undefined;

    const playStep = (idx: number) => {
      if (idx >= notes.length) {
        hentikanDemo();
        return;
      }

      setDemoStepIndex(idx);
      const noteSymbol = notes[idx];
      onTargetNoteChange(noteSymbol);
      onPlayDemoNote?.(noteSymbol, targetBaris);

      demoTimerRef.current = setTimeout(() => {
        playStep(idx + 1);
      }, 400);
    };

    playStep(0);
  }, [selectedSong, onTargetNoteChange, onPlayDemoNote, hentikanDemo]);

  // Bersihkan timer saat unmount
  React.useEffect(() => {
    return () => {
      if (demoTimerRef.current) {
        clearTimeout(demoTimerRef.current);
      }
    };
  }, []);

  // Daftarkan input handler ke Soundboard saat mode belajar sedang aktif & berjalan
  React.useEffect(() => {
    if (activeTab === "belajar" && status === "berjalan") {
      onRegisterInputHandler?.(handleInputNote);
    } else {
      onRegisterInputHandler?.(null);
    }
    return () => {
      onRegisterInputHandler?.(null);
    };
  }, [activeTab, status, handleInputNote, onRegisterInputHandler]);

  // Sinkronisasi targetNote ke komponen luar (Soundboard) hanya jika nilainya berubah (dan demo tidak sedang berjalan)
  const prevTargetRef = React.useRef<string | null>(undefined as unknown as string | null);
  React.useEffect(() => {
    if (isDemoPlaying) return;
    const nextVal = activeTab === "belajar" && status === "berjalan" ? targetNote : null;
    if (prevTargetRef.current !== nextVal) {
      prevTargetRef.current = nextVal;
      onTargetNoteChange(nextVal);
    }
  }, [activeTab, status, targetNote, isDemoPlaying, onTargetNoteChange]);

  const handleSelectSong = (song: Lagu) => {
    hentikanDemo();
    setSelectedSong(song);
    if (song.laras !== currentLaras) {
      onLarasChange(song.laras);
      setLarasAutoChanged(true);
      setTimeout(() => setLarasAutoChanged(false), 4000);
    }
  };

  const handlePilihLaguLain = () => {
    hentikanDemo();
    keluar();
    setSelectedSong(null);
  };

  const handleKeluarMode = () => {
    hentikanDemo();
    keluar();
    setSelectedSong(null);
    setActiveTab("bebas");
    onActiveTabChange?.("bebas");
  };

  const handleBukaModeBelajar = () => {
    hentikanDemo();
    setActiveTab("belajar");
    onActiveTabChange?.("belajar");
    if (currentLaras !== "pelog") {
      onLarasChange("pelog");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Tab Pilihan Mode: Main Bebas | Belajar Lagu */}
      <div className="flex items-center justify-between pb-2 border-b border-perunggu/20">
        <div className="inline-flex p-1 rounded-xl bg-tinta border border-perunggu/35 shadow-inner">
          <button
            type="button"
            onClick={() => {
              if (activeTab === "belajar") handleKeluarMode();
              else {
                setActiveTab("bebas");
                onActiveTabChange?.("bebas");
              }
            }}
            disabled={isRecordingOrPlaying}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all min-h-[44px] cursor-pointer ${
              activeTab === "bebas"
                ? "bg-emas text-tinta"
                : "text-gading/70 hover:text-emas hover:bg-arang"
            } ${isRecordingOrPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Main Bebas
          </button>

          <button
            type="button"
            onClick={handleBukaModeBelajar}
            disabled={isRecordingOrPlaying}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all min-h-[44px] cursor-pointer ${
              activeTab === "belajar"
                ? "bg-emas text-tinta"
                : "text-gading/70 hover:text-emas hover:bg-arang"
            } ${isRecordingOrPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Belajar Lagu
          </button>
        </div>

        {activeTab === "belajar" && selectedSong && (
          <button
            type="button"
            onClick={handlePilihLaguLain}
            className="text-xs text-emas hover:text-emas-muda underline transition-colors cursor-pointer"
          >
            ← Ganti Lagu
          </button>
        )}
      </div>

      {/* Konten Mode Belajar */}
      {activeTab === "belajar" && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          {!selectedSong ? (
            <DaftarLagu
              songs={availableSongs}
              onSelectSong={handleSelectSong}
            />
          ) : (
            <PanduanLagu
              lagu={selectedSong}
              status={status}
              currentStepIndex={currentStepIndex}
              totalNotes={totalNotes}
              targetNote={targetNote}
              salahHitung={salahHitung}
              larasAutoChanged={larasAutoChanged}
              onMulai={() => {
                hentikanDemo();
                mulai();
              }}
              onUlangi={() => {
                hentikanDemo();
                ulangi();
              }}
              onKeluar={handleKeluarMode}
              onPilihLaguLain={handlePilihLaguLain}
              isDemoPlaying={isDemoPlaying}
              demoStepIndex={demoStepIndex}
              onMulaiDemo={mulaiDemo}
              onHentikanDemo={hentikanDemo}
            />
          )}
        </div>
      )}
    </div>
  );
};
