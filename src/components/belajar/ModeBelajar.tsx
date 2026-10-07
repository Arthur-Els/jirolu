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
}

export const ModeBelajar: React.FC<ModeBelajarProps> = ({
  availableSongs,
  currentLaras,
  onLarasChange,
  onTargetNoteChange,
  isRecordingOrPlaying = false,
}) => {
  const [activeTab, setActiveTab] = useState<"bebas" | "belajar">("bebas");
  const [selectedSong, setSelectedSong] = useState<Lagu | null>(null);
  const [larasAutoChanged, setLarasAutoChanged] = useState<boolean>(false);

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
  } = useBelajarLagu({
    lagu: selectedSong,
    larasAktif: currentLaras,
    onLarasMismatch: (targetLaras) => {
      onLarasChange(targetLaras);
      setLarasAutoChanged(true);
      setTimeout(() => setLarasAutoChanged(false), 4000);
    },
  });

  // Sinkronisasi targetNote ke komponen luar (Soundboard) hanya jika nilainya berubah
  const prevTargetRef = React.useRef<string | null>(undefined as unknown as string | null);
  React.useEffect(() => {
    const nextVal = activeTab === "belajar" && status === "berjalan" ? targetNote : null;
    if (prevTargetRef.current !== nextVal) {
      prevTargetRef.current = nextVal;
      onTargetNoteChange(nextVal);
    }
  }, [activeTab, status, targetNote, onTargetNoteChange]);

  const handleSelectSong = (song: Lagu) => {
    setSelectedSong(song);
    if (song.laras !== currentLaras) {
      onLarasChange(song.laras);
      setLarasAutoChanged(true);
      setTimeout(() => setLarasAutoChanged(false), 4000);
    }
  };

  const handlePilihLaguLain = () => {
    keluar();
    setSelectedSong(null);
  };

  const handleKeluarMode = () => {
    keluar();
    setSelectedSong(null);
    setActiveTab("bebas");
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
              setActiveTab("bebas");
            }}
            disabled={isRecordingOrPlaying}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all min-h-[44px] cursor-pointer ${
              activeTab === "bebas"
                ? "bg-emas text-tinta shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "text-gading/70 hover:text-emas hover:bg-arang"
            } ${isRecordingOrPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Main Bebas
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("belajar")}
            disabled={isRecordingOrPlaying}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all min-h-[44px] cursor-pointer ${
              activeTab === "belajar"
                ? "bg-emas text-tinta shadow-[0_0_15px_rgba(212,175,55,0.4)]"
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
              onMulai={mulai}
              onUlangi={ulangi}
              onKeluar={handleKeluarMode}
              onPilihLaguLain={handlePilihLaguLain}
            />
          )}
        </div>
      )}
    </div>
  );
};
