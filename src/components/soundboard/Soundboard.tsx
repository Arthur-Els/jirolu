"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Instrumen, Laras, Nada, ItemSuara } from "@/types/instrumen";
import { Lagu } from "@/types/lagu";
import { useAudioBuffers, AudioTarget } from "@/lib/audio/useAudioBuffers";
import { useRekaman } from "@/lib/rekam/useRekaman";
import { Saron3DPad } from "./Saron3DPad";
import { Bonang3DPad } from "./Bonang3DPad";
import { GongPad } from "./GongPad";
import { KendangPad } from "./KendangPad";
import { LarasToggle } from "./LarasToggle";
import { VolumeControl } from "./VolumeControl";
import { ModeBelajar } from "@/components/belajar/ModeBelajar";
import { PanelRekaman } from "@/components/rekam/PanelRekaman";
import { Button } from "@/components/ui/Button";

interface SoundboardProps {
  instrumen: Instrumen;
  availableSongs?: Lagu[];
  bilahMenyala?: string | null;
  onNadaDitekan?: (nadaSimbol: string) => void;
}

export const Soundboard: React.FC<SoundboardProps> = ({
  instrumen,
  availableSongs = [],
  bilahMenyala: externalBilahMenyala,
  onNadaDitekan: externalOnNadaDitekan,
}) => {
  // 1. State laras biasa tanpa localStorage
  const [laras, setLaras] = useState<Laras>(instrumen.larasDefault || "pelog");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Status apakah Mode Belajar sedang aktif
  const [isLearnModeActive, setIsLearnModeActive] = useState<boolean>(false);
  // Handler masukan nada dari ModeBelajar yang sedang berjalan
  const modeBelajarInputRef = useRef<((noteSymbol: string, baris?: number) => boolean) | null>(null);

  // Target nada mode belajar lokal jika ModeBelajar terpasang di dalam soundboard
  const [localBilahMenyala, setLocalBilahMenyala] = useState<string | null>(null);
  const [wrongFeedbackNote, setWrongFeedbackNote] = useState<string | null>(null);

  // State untuk animasi dan visual demonstrasi contoh permainan lagu
  const [demoActiveKey, setDemoActiveKey] = useState<string | null>(null);
  const [demoTargetNote, setDemoTargetNote] = useState<string | null>(null);

  // Bilah yang sedang disorot (bisa dari props luar, lokal, atau contoh permainan)
  const targetNoteHighlight = externalBilahMenyala || localBilahMenyala || demoTargetNote;

  // Daftar item audio yang aktif saat ini
  const currentItems = useMemo<AudioTarget[]>(() => {
    if (instrumen.tipe === "bernada") {
      if (!instrumen.laras) return [];
      return instrumen.laras[laras] || [];
    } else {
      return instrumen.daftarSuara || [];
    }
  }, [instrumen, laras]);

  // Hook audio buffer
  const {
    isLoading,
    isAudioUnlocked,
    audioFilesAvailable,
    volume,
    isMuted,
    playItem,
    handleUnlock,
    handleVolumeChange,
    handleToggleMute,
    stopSounds,
  } = useAudioBuffers(currentItems);

  // Hook rekaman & putar ulang
  const {
    isRecording,
    isPlaying,
    adaRekaman,
    jumlahKetukan,
    durasiDetik,
    pesanInfo: pesanRekaman,
    activePlayingId,
    mulaiRekam,
    berhenti: berhentiRekaman,
    putar: putarRekaman,
    hapus: hapusRekaman,
    catatKetukan,
  } = useRekaman();

  const isRecordingOrPlaying = isRecording || isPlaying;

  // Fungsi sentral saat nada/suara ditekan
  const triggerPlay = useCallback(
    (item: AudioTarget) => {
      // 1. Putar suara lebih dulu (zero delay)
      playItem(item);

      // Ambil pengenal nada/suara dan baris (khusus Bonang)
      const itemId = "id" in item ? (item as ItemSuara).id : (item as Nada).nada;
      const itemBaris = "baris" in item ? (item as Nada).baris : undefined;

      // 2. Catat ketukan jika sedang merekam
      if (isRecording) {
        catatKetukan(itemId);
      }

      // 3. Masukan ke mode belajar jika sedang aktif & berjalan
      if (modeBelajarInputRef.current) {
        const isCorrect = modeBelajarInputRef.current(itemId, itemBaris);
        if (!isCorrect) {
          setWrongFeedbackNote(itemId);
          setTimeout(() => setWrongFeedbackNote(null), 250);
        }
      } else if (targetNoteHighlight && targetNoteHighlight !== itemId) {
        // Feedback salah jika di mode belajar ada target tapi belum dimulai/input lain
        setWrongFeedbackNote(itemId);
        setTimeout(() => setWrongFeedbackNote(null), 250);
      }

      // 4. Berikan callback ke props luar jika disediakan
      if (externalOnNadaDitekan) {
        externalOnNadaDitekan(itemId);
      }
    },
    [playItem, isRecording, catatKetukan, externalOnNadaDitekan, targetNoteHighlight]
  );

  // Mainkan item berdasarkan ID (digunakan saat putar rekaman)
  const handlePlayById = useCallback(
    (id: string) => {
      const target = currentItems.find((item) => {
        if ("id" in item) return (item as ItemSuara).id === id;
        return (item as Nada).nada === id;
      });
      if (target) {
        playItem(target);
      }
    },
    [currentItems, playItem]
  );

  // Mainkan nada otomatis untuk contoh permainan lagu (dengan efek visual 3D & getar)
  const handlePlayDemoNote = useCallback(
    (noteSymbol: string, baris?: number) => {
      const target = currentItems.find((item) => {
        if (!("nada" in item)) return false;
        const nadaItem = item as Nada;
        if (baris !== undefined && nadaItem.baris !== undefined) {
          return nadaItem.nada === noteSymbol && nadaItem.baris === baris;
        }
        if (nadaItem.baris !== undefined) {
          return nadaItem.nada === noteSymbol && nadaItem.baris === 2;
        }
        return nadaItem.nada === noteSymbol;
      });

      if (target) {
        playItem(target);
        const keyVal = target.key.toLowerCase();
        setDemoActiveKey(keyVal);
        setDemoTargetNote(noteSymbol);

        setTimeout(() => {
          setDemoActiveKey((prev) => (prev === keyVal ? null : prev));
          setDemoTargetNote((prev) => (prev === noteSymbol ? null : prev));
        }, 240);
      }
    },
    [currentItems, playItem]
  );

  // Tangani masukan keyboard komputer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.repeat) return;

      const pressed = e.key.toLowerCase();
      const matched = currentItems.find((item) => item.key.toLowerCase() === pressed);
      if (matched) {
        triggerPlay(matched);
        setActiveKey(matched.key);
        setTimeout(() => setActiveKey(null), 180);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentItems, triggerPlay]);

  // Pergantian laras dengan penghentian suara halus
  const handleLarasChange = useCallback(
    (newLaras: Laras) => {
      stopSounds();
      setLaras(newLaras);
    },
    [stopSounds]
  );

  const hasSlendro = Boolean(instrumen.laras?.slendro && instrumen.laras.slendro.length > 0);
  const supportsLearnMode =
    (instrumen.slug === "saron" || instrumen.slug === "bonang") &&
    availableSongs.length > 0;

  return (
    <div className="w-full bg-arang/90 border border-perunggu/35 rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
      {/* 1. Header Soundboard: Judul, Kontrol Volume, dan Toggle Laras */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emas animate-pulse" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gading">
            {instrumen.nama}
          </h2>
          {instrumen.namaJawa && (
            <span className="text-sm font-serif italic text-emas-muda hidden sm:inline">
              ({instrumen.namaJawa})
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Badge Indikator Ringkas jika Rekaman Belum Ada (Mode Synthesizer) */}
          {!isLoading && !audioFilesAvailable && (
            <span
              title="File rekaman asli .webm belum dipasang di folder public, Web Audio API mensintesis nada instrumen secara otomatis"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emas/10 border border-emas/30 text-[11px] font-medium text-emas select-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emas" />
              Mode Synthesizer
            </span>
          )}

          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onToggleMute={handleToggleMute}
          />

          {instrumen.tipe === "bernada" && (
            <LarasToggle
              currentLaras={laras}
              onLarasChange={handleLarasChange}
              hasSlendro={hasSlendro}
              disabled={isLearnModeActive}
              disabledMessage="Laras dikunci ke Pelog saat Mode Belajar aktif"
            />
          )}
        </div>
      </div>

      {/* 2. Mode Belajar Lagu (Khusus Saron dan Bonang) */}
      {supportsLearnMode && (
        <ModeBelajar
          availableSongs={availableSongs}
          currentLaras={laras}
          onLarasChange={handleLarasChange}
          onTargetNoteChange={setLocalBilahMenyala}
          isRecordingOrPlaying={isRecordingOrPlaying}
          onRegisterInputHandler={(handler) => {
            modeBelajarInputRef.current = handler;
          }}
          onActiveTabChange={(tab) => {
            const isBelajar = tab === "belajar";
            setIsLearnModeActive(isBelajar);
            if (isBelajar && laras !== "pelog") {
              handleLarasChange("pelog");
            }
          }}
          onPlayDemoNote={handlePlayDemoNote}
        />
      )}

      {/* Buka Kunci Audio untuk iOS Safari */}
      {!isAudioUnlocked && (
        <div className="text-center p-3 rounded-xl bg-tinta/60 border border-perunggu/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gading/75">
            Klik tombol di samping untuk mengaktifkan audio di peramban:
          </span>
          <Button variant="emas" size="sm" onClick={handleUnlock} className="w-full sm:w-auto">
            Aktifkan Suara Audio
          </Button>
        </div>
      )}

      {/* 3. TAMPILAN INSTRUMEN SOUNDBOARD */}

      {/* SARON 3D */}
      {instrumen.slug === "saron" && (
        <Saron3DPad
          laras={laras}
          daftarNada={currentItems as Nada[]}
          activeKeyId={
            (demoActiveKey &&
              (currentItems as Nada[]).find(
                (item) => item.key.toLowerCase() === demoActiveKey.toLowerCase()
              )?.nada) ||
            activePlayingId ||
            (currentItems as Nada[]).find(
              (item) => item.key.toLowerCase() === activeKey?.toLowerCase()
            )?.nada
          }
          targetLearnNote={targetNoteHighlight}
          wrongFeedbackNote={wrongFeedbackNote}
          onPlay={(item) => triggerPlay(item)}
        />
      )}

      {/* BONANG 3D MODEL */}
      {instrumen.slug === "bonang" && (
        <Bonang3DPad
          laras={laras}
          daftarNada={currentItems as Nada[]}
          activeKeyId={
            demoActiveKey ||
            activeKey ||
            (activePlayingId
              ? (currentItems as Nada[]).find((item) => item.nada === activePlayingId)?.key
              : null)
          }
          targetLearnNote={targetNoteHighlight}
          wrongFeedbackNote={wrongFeedbackNote}
          onPlay={(item) => triggerPlay(item)}
        />
      )}

      {/* GONG */}
      {instrumen.slug === "gong" && (
        <div className="w-full rounded-2xl bg-gradient-to-b from-[#211409] via-[#140b05] to-[#0a0502] p-4 sm:p-8 border-2 border-[#543b23] shadow-2xl">
          <GongPad
            daftarSuara={currentItems as ItemSuara[]}
            activeKeyId={
              activePlayingId ||
              (currentItems as ItemSuara[]).find(
                (item) => item.key.toLowerCase() === activeKey?.toLowerCase()
              )?.id
            }
            onPlay={(item) => triggerPlay(item)}
          />
        </div>
      )}

      {/* KENDANG */}
      {instrumen.slug === "kendang" && (
        <KendangPad
          daftarSuara={currentItems as ItemSuara[]}
          activeKeyId={
            activePlayingId ||
            (currentItems as ItemSuara[]).find(
              (item) => item.key.toLowerCase() === activeKey?.toLowerCase()
            )?.id
          }
          onPlay={(item) => triggerPlay(item)}
        />
      )}

      {/* 4. PANEL REKAMAN & PUTAR ULANG (Tersedia untuk Semua Alat) */}
      <PanelRekaman
        isRecording={isRecording}
        isPlaying={isPlaying}
        adaRekaman={adaRekaman}
        jumlahKetukan={jumlahKetukan}
        durasiDetik={durasiDetik}
        pesanInfo={pesanRekaman}
        onMulaiRekam={mulaiRekam}
        onBerhenti={berhentiRekaman}
        onPutar={() => putarRekaman(handlePlayById)}
        onHapus={hapusRekaman}
      />
    </div>
  );
};
