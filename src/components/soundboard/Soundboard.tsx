"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Instrumen, Laras, Nada, ItemSuara } from "@/types/instrumen";
import { Lagu } from "@/types/lagu";
import { useAudioBuffers, AudioTarget } from "@/lib/audio/useAudioBuffers";
import { useRekaman } from "@/lib/rekam/useRekaman";
import { Bilah } from "./Bilah";
import { PencuBonang } from "./PencuBonang";
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

  // Target nada mode belajar lokal jika ModeBelajar terpasang di dalam soundboard
  const [localBilahMenyala, setLocalBilahMenyala] = useState<string | null>(null);
  const [wrongFeedbackNote, setWrongFeedbackNote] = useState<string | null>(null);

  // Bilah yang sedang disorot (bisa dari props luar atau lokal)
  const targetNoteHighlight = externalBilahMenyala || localBilahMenyala;

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

      // Ambil pengenal nada/suara
      const itemId = "id" in item ? (item as ItemSuara).id : (item as Nada).nada;

      // 2. Catat ketukan jika sedang merekam
      if (isRecording) {
        catatKetukan(itemId);
      }

      // 3. Berikan callback ke mode belajar jika aktif
      if (externalOnNadaDitekan) {
        externalOnNadaDitekan(itemId);
      }

      // 4. Feedback salah jika di mode belajar menekan nada yang tidak sesuai
      if (targetNoteHighlight && targetNoteHighlight !== itemId) {
        setWrongFeedbackNote(itemId);
        setTimeout(() => setWrongFeedbackNote(null), 250);
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
    <div className="w-full bg-arang/90 border border-perunggu/35 rounded-2xl p-4 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
      {/* 1. Header Soundboard: Judul, Kontrol Volume, dan Toggle Laras */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emas animate-pulse" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gading">
              Soundboard Virtual {instrumen.nama}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gading/65 mt-1">
            Sentuh instrumen atau gunakan tombol keyboard komputer untuk memainkan suara tanpa jeda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
        />
      )}

      {/* Pesan Ramah Ketersediaan Audio Rekaman Asli */}
      {!isLoading && !audioFilesAvailable && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-tinta/80 border border-emas/30 text-xs sm:text-sm text-gading/85">
          <div className="text-emas mt-0.5 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-emas">Audio Belum Tersedia (Mode Synthesizer Aktif)</p>
            <p className="text-gading/70 leading-relaxed text-xs">
              File rekaman asli <code className="text-emas-muda bg-arang px-1.5 py-0.5 rounded">.webm</code> belum terpasang di folder public.
              Sistem Jirolu otomatis mensintesis suara nada dan resonansi secara langsung lewat Web Audio API agar kamu tetap bisa bermain.
            </p>
          </div>
        </div>
      )}

      {/* Buka Kunci Audio untuk iOS Safari */}
      {!isAudioUnlocked && (
        <div className="text-center p-3 rounded-lg bg-tinta/60 border border-perunggu/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gading/75">
            Klik tombol di samping untuk memastikan audio aktif dengan optimal:
          </span>
          <Button variant="emas" size="sm" onClick={handleUnlock} className="w-full sm:w-auto">
            Aktifkan Suara Audio
          </Button>
        </div>
      )}

      {/* 3. TAMPILAN INSTRUMEN SOUNDBOARD */}

      {/* SARON */}
      {instrumen.slug === "saron" && (
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#2a1e14] via-[#1c140d] to-[#120c07] p-3 sm:p-6 border-2 border-[#543b23] shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
          <div className="w-full h-3 rounded-t-lg bg-gradient-to-r from-perunggu/30 via-emas/40 to-perunggu/30 mb-2 border-b border-[#3d2a1b]" />
          <div className="flex items-end justify-center gap-1.5 sm:gap-3 md:gap-4 overflow-x-auto py-2 px-1 select-none">
            {(currentItems as Nada[]).map((item, index) => (
              <Bilah
                key={`${laras}-${item.nada}`}
                nada={item}
                index={index}
                totalBilah={currentItems.length}
                isTriggeredByKey={activeKey === item.key}
                isTargetLearnNote={targetNoteHighlight === item.nada}
                isWrongFeedback={wrongFeedbackNote === item.nada}
                isPlaybackActive={activePlayingId === item.nada}
                onPlay={() => triggerPlay(item)}
              />
            ))}
          </div>
          <div className="w-full h-4 rounded-b-lg bg-gradient-to-r from-[#170f09] via-[#382618] to-[#170f09] mt-3 border-t border-[#4a3423] flex items-center justify-center">
            <div className="w-24 h-1 rounded-full bg-emas/30" />
          </div>
        </div>
      )}

      {/* BONANG */}
      {instrumen.slug === "bonang" && (
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#26190f] via-[#191009] to-[#0f0905] p-4 sm:p-6 border-2 border-[#543b23] shadow-2xl space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-emas font-semibold px-2">
              Baris Atas (Nada Tinggi) - Tombol [Q - {laras === "pelog" ? "U" : "T"}]
            </span>
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 bg-tinta/50 p-3 rounded-xl border border-perunggu/25 overflow-x-auto">
              {(currentItems as Nada[])
                .filter((item) => item.baris === 1)
                .map((item) => (
                  <PencuBonang
                    key={`bonang-${laras}-${item.nada}-${item.baris}`}
                    nada={item}
                    isTriggeredByKey={activeKey === item.key}
                    isTargetLearnNote={targetNoteHighlight === item.nada}
                    isWrongFeedback={wrongFeedbackNote === item.nada}
                    isPlaybackActive={activePlayingId === item.nada}
                    onPlay={() => triggerPlay(item)}
                  />
                ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-emas font-semibold px-2">
              Baris Bawah (Nada Rendah) - Tombol [A - {laras === "pelog" ? "J" : "G"}]
            </span>
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 bg-tinta/50 p-3 rounded-xl border border-perunggu/25 overflow-x-auto">
              {(currentItems as Nada[])
                .filter((item) => item.baris === 2)
                .map((item) => (
                  <PencuBonang
                    key={`bonang-${laras}-${item.nada}-${item.baris}`}
                    nada={item}
                    isTriggeredByKey={activeKey === item.key}
                    isTargetLearnNote={targetNoteHighlight === item.nada}
                    isWrongFeedback={wrongFeedbackNote === item.nada}
                    isPlaybackActive={activePlayingId === item.nada}
                    onPlay={() => triggerPlay(item)}
                  />
                ))}
            </div>
          </div>
        </div>
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

      {/* 4. PANEL REKAMAN & PUTAR ULANG (Hanya untuk instrumen selain kendang) */}
      {instrumen.slug !== "kendang" && (
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
      )}
    </div>
  );
};
