"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Lagu } from "@/types/lagu";

export type StatusBelajar = "belum_mulai" | "berjalan" | "selesai";

/** Cari indeks nada berikutnya yang bukan tanda diam ("0") */
function findNextPlayableIndex(notes: string[], startIndex: number): number {
  let idx = startIndex;
  while (idx < notes.length && notes[idx] === "0") {
    idx++;
  }
  return idx;
}

interface UseBelajarLaguProps {
  lagu: Lagu | null;
  onLarasMismatch?: (larasDibutuhkan: "slendro" | "pelog") => void;
  larasAktif?: "slendro" | "pelog";
}

export function useBelajarLagu({
  lagu,
  onLarasMismatch,
  larasAktif,
}: UseBelajarLaguProps) {
  const [status, setStatus] = useState<StatusBelajar>("belum_mulai");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [salahHitung, setSalahHitung] = useState<number>(0);
  const [lastWrongNote, setLastWrongNote] = useState<string | null>(null);
  const [justCorrect, setJustCorrect] = useState<boolean>(false);

  // Jika lagu berganti, sesuaikan state pembelajaran saat render (pola resmi React)
  const [prevLaguSlug, setPrevLaguSlug] = useState<string | undefined>(lagu?.slug);
  if (prevLaguSlug !== lagu?.slug) {
    setPrevLaguSlug(lagu?.slug);
    setStatus("belum_mulai");
    setCurrentStepIndex(0);
    setSalahHitung(0);
    setLastWrongNote(null);
    setJustCorrect(false);
  }

  // Simpan ref onLarasMismatch agar tidak memicu re-render tak berujung
  const onLarasMismatchRef = useRef(onLarasMismatch);
  useEffect(() => {
    onLarasMismatchRef.current = onLarasMismatch;
  });

  // Sinkronisasi otomatis laras jika berbeda dengan laras lagu
  useEffect(() => {
    if (lagu && larasAktif && lagu.laras !== larasAktif) {
      onLarasMismatchRef.current?.(lagu.laras);
    }
  }, [lagu, larasAktif]);

  const startFromBeginning = useCallback(() => {
    if (!lagu) return;
    const firstPlayable = findNextPlayableIndex(lagu.nada, 0);
    setStatus(firstPlayable >= lagu.nada.length ? "selesai" : "berjalan");
    setCurrentStepIndex(firstPlayable);
    setSalahHitung(0);
    setLastWrongNote(null);
    setJustCorrect(false);
  }, [lagu]);

  const mulai = startFromBeginning;
  const ulangi = startFromBeginning;

  const keluar = useCallback(() => {
    setStatus("belum_mulai");
    setCurrentStepIndex(0);
    setSalahHitung(0);
    setLastWrongNote(null);
    setJustCorrect(false);
  }, []);

  const targetNote =
    lagu && status === "berjalan" && currentStepIndex < lagu.nada.length
      ? lagu.nada[currentStepIndex]
      : null;

  // Tangani masukan nada dari soundboard (klik/keyboard)
  const handleInputNote = useCallback(
    (noteSymbol: string, baris?: number): boolean => {
      if (status !== "berjalan" || !lagu) return false;

      const expectedNote = lagu.nada[currentStepIndex];

      // Jika instrumen bonang, pastikan pencon yang ditekan adalah baris 2 (baris bawah)
      if (lagu.alat.includes("bonang") && baris !== undefined && baris !== 2) {
        setSalahHitung((prev) => prev + 1);
        setLastWrongNote(noteSymbol);
        setTimeout(() => setLastWrongNote(null), 250);
        return false;
      }

      if (noteSymbol === expectedNote) {
        // Nada Benar! Lewati ketukan diam ("0") secara otomatis ke nada berikutnya
        setJustCorrect(true);
        setTimeout(() => setJustCorrect(false), 200);

        const nextIndex = findNextPlayableIndex(lagu.nada, currentStepIndex + 1);
        if (nextIndex >= lagu.nada.length) {
          // Lagu selesai
          setStatus("selesai");
        } else {
          // Lanjut ke nada berikutnya
          setCurrentStepIndex(nextIndex);
        }
        return true;
      } else {
        // Nada Salah: hitung salah dan berikan getaran mikro tanpa menghentikan permainan
        setSalahHitung((prev) => prev + 1);
        setLastWrongNote(noteSymbol);
        setTimeout(() => setLastWrongNote(null), 250);
        return false;
      }
    },
    [status, lagu, currentStepIndex]
  );

  return {
    status,
    currentStepIndex,
    totalNotes: lagu?.nada.length || 0,
    targetNote,
    salahHitung,
    lastWrongNote,
    justCorrect,
    mulai,
    ulangi,
    keluar,
    handleInputNote,
  };
}
