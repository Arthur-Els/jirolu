"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Nada } from "@/types/instrumen";
import {
  getAudioContext,
  unlockAudioContext,
  fetchAudioBuffer,
  playAudioBuffer,
  playSynthesizedGamelan,
} from "./audioEngine";

export interface UseAudioBuffersResult {
  isLoading: boolean;
  isAudioUnlocked: boolean;
  audioFilesAvailable: boolean; // Bernilai true jika minimal ada satu file webm asli yang berhasil dimuat
  playNote: (nada: Nada) => void;
  handleUnlock: () => Promise<void>;
}

/**
 * Hook kustom untuk memuat semua AudioBuffer sekali di awal saat komponen dipasang,
 * serta menyediakan fungsi pemutaran nada tanpa jeda.
 */
export function useAudioBuffers(nadaList: Nada[]): UseAudioBuffersResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const [audioFilesAvailable, setAudioFilesAvailable] = useState<boolean>(false);

  // Simpan kumpulan buffer suara di dalam ref agar tidak memicu re-render yang tidak perlu
  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

  // Muat semua file audio sekali saat daftar nada berubah
  useEffect(() => {
    let isCancelled = false;

    async function loadBuffers() {
      setIsLoading(true);
      const ctx = getAudioContext();
      if (!ctx) {
        setIsLoading(false);
        return;
      }

      let loadedCount = 0;
      const newCache = new Map<string, AudioBuffer>();

      // Muat seluruh nada secara paralel
      await Promise.all(
        nadaList.map(async (item) => {
          const buffer = await fetchAudioBuffer(ctx, item.audio);
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
  }, [nadaList]);

  // Fungsi mengaktifkan AudioContext (terutama di iOS Safari)
  const handleUnlock = useCallback(async () => {
    const unlocked = await unlockAudioContext();
    if (unlocked) {
      setIsAudioUnlocked(true);
    }
  }, []);

  // Fungsi memainkan satu nada
  const playNote = useCallback(
    (nada: Nada) => {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Pastikan AudioContext resume jika sempat tertidur
      if (ctx.state === "suspended") {
        ctx.resume();
        setIsAudioUnlocked(true);
      } else {
        setIsAudioUnlocked(true);
      }

      const cachedBuffer = bufferCacheRef.current.get(nada.audio);

      if (cachedBuffer) {
        // Mainkan file rekaman asli melalui Web Audio API
        playAudioBuffer(ctx, cachedBuffer, 2.5);
      } else {
        // Fallback: mainkan nada gamelan sintetis jika file audio belum dimasukkan
        playSynthesizedGamelan(ctx, nada.frekuensi || 300, 2.2);
      }
    },
    []
  );

  return {
    isLoading,
    isAudioUnlocked,
    audioFilesAvailable,
    playNote,
    handleUnlock,
  };
}
