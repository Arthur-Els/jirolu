"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Nada, ItemSuara } from "@/types/instrumen";
import {
  getAudioContext,
  unlockAudioContext,
  fetchAudioBuffer,
  playAudioBuffer,
  playSynthesizedGamelan,
  playSynthesizedGong,
  playSynthesizedKendang,
  stopAllActiveSounds,
  setMasterVolume,
  getMasterVolume,
  toggleMute,
  getMuteState,
} from "./audioEngine";

// Tipe seragam untuk pemutaran
export type AudioTarget = Nada | ItemSuara;

export interface UseAudioBuffersResult {
  isLoading: boolean;
  isAudioUnlocked: boolean;
  audioFilesAvailable: boolean;
  volume: number;
  isMuted: boolean;
  playItem: (item: AudioTarget) => void;
  handleUnlock: () => Promise<void>;
  handleVolumeChange: (newVol: number) => void;
  handleToggleMute: () => void;
  stopSounds: () => void;
}

/**
 * Hook kustom untuk memuat semua AudioBuffer instrumen (baik Saron, Bonang, Gong, maupun Kendang).
 */
export function useAudioBuffers(items: AudioTarget[]): UseAudioBuffersResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const [audioFilesAvailable, setAudioFilesAvailable] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(() => getMasterVolume());
  const [isMuted, setIsMutedState] = useState<boolean>(() => getMuteState());

  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

  // Muat audio buffer setiap kali daftar items berganti
  useEffect(() => {
    let isCancelled = false;

    // Saat daftar item berganti (misal ganti laras), hentikan suara lama dengan fade out
    stopAllActiveSounds(0.15);

    async function loadBuffers() {
      setIsLoading(true);
      const ctx = getAudioContext();
      if (!ctx) {
        setIsLoading(false);
        return;
      }

      let loadedCount = 0;
      const newCache = new Map<string, AudioBuffer>();
      const pendingByUrl = new Map<string, Promise<AudioBuffer | null>>();

      await Promise.all(
        items.map(async (item) => {
          if (!item.audio) return;
          let promise = pendingByUrl.get(item.audio);
          if (!promise) {
            promise = fetchAudioBuffer(ctx, item.audio);
            pendingByUrl.set(item.audio, promise);
          }
          const buffer = await promise;
          if (buffer) {
            newCache.set(item.audio, buffer);
            loadedCount++;
          }
        })
      );

      if (!isCancelled) {
        bufferCacheRef.current = newCache;
        setAudioFilesAvailable(loadedCount > 0);
        setIsLoading(false);
      }
    }

    loadBuffers();

    return () => {
      isCancelled = true;
    };
  }, [items]);

  const handleUnlock = useCallback(async () => {
    const unlocked = await unlockAudioContext();
    if (unlocked) {
      setIsAudioUnlocked(true);
    }
  }, []);

  const handleVolumeChange = useCallback((newVol: number) => {
    setMasterVolume(newVol);
    setVolumeState(newVol);
    if (newVol > 0 && isMuted) {
      toggleMute();
      setIsMutedState(false);
    }
  }, [isMuted]);

  const handleToggleMute = useCallback(() => {
    const nextMuted = toggleMute();
    setIsMutedState(nextMuted);
  }, []);

  const stopSounds = useCallback(() => {
    stopAllActiveSounds(0.15);
  }, []);

  // Fungsi pemutaran universal untuk semua instrumen
  const playItem = useCallback((item: AudioTarget) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
      setIsAudioUnlocked(true);
    } else {
      setIsAudioUnlocked(true);
    }

    const cachedBuffer = bufferCacheRef.current.get(item.audio);

    // Deteksi jenis instrumen berdasarkan properti item
    const isItemSuara = "id" in item;
    const soundId = isItemSuara ? (item as ItemSuara).id : (item as Nada).nada;
    const decay = isItemSuara && (item as ItemSuara).decay ? (item as ItemSuara).decay! : 2.5;

    if (cachedBuffer) {
      // Mainkan file rekaman asli jika ada (termasuk pitch/filter shaping jika dikonfigurasi)
      const suara = isItemSuara ? (item as ItemSuara) : null;
      playAudioBuffer(
        ctx,
        cachedBuffer,
        decay,
        soundId,
        suara
          ? {
              playbackRate: suara.playbackRate,
              lowpassHz: suara.lowpassHz,
              subBassHz: suara.subBassHz,
              subBassGain: suara.subBassGain,
              gain: suara.gain,
              preserveNaturalDecay: suara.preserveNaturalDecay,
            }
          : undefined
      );
    } else {
      // Mainkan synthesizer cadangan sesuai kategori alat musik
      if (isItemSuara) {
        const id = (item as ItemSuara).id;
        if (id.startsWith("gong") || id === "kempul") {
          // Synthesizer Gong
          const freq = item.frekuensi || (id === "gong-ageng" ? 55 : id === "gong-suwukan" ? 110 : 220);
          playSynthesizedGong(ctx, freq, decay, soundId);
        } else {
          // Synthesizer Kendang
          const jenisKendang = id as "dung" | "tak" | "tung" | "dah";
          playSynthesizedKendang(ctx, jenisKendang, decay, soundId);
        }
      } else {
        // Synthesizer bilah/pencon perunggu (Saron & Bonang)
        playSynthesizedGamelan(ctx, item.frekuensi || 300, 2.2, soundId);
      }
    }
  }, []);

  return {
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
  };
}
