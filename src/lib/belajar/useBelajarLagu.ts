"use client";

import { useState, useCallback, useEffect } from "react";
import { Lagu } from "@/types/lagu";

export type StatusBelajar = "belum_mulai" | "berjalan" | "selesai";

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

  const [prevLaguId, setPrevLaguId] = useState<string | null>(lagu?.id ?? null);

  // Jika lagu berganti, reset state pembelajaran
  if (lagu?.id !== prevLaguId) {
    setPrevLaguId(lagu?.id ?? null);
    setStatus("belum_mulai");
    setCurrentStepIndex(0);
    setSalahHitung(0);
    setLastWrongNote(null);
    setJustCorrect(false);
  }

  // Sinkronisasi otomatis laras jika berbeda dengan laras lagu
  useEffect(() => {
    if (lagu && larasAktif && lagu.laras !== larasAktif && onLarasMismatch) {
      onLarasMismatch(lagu.laras);
    }
  }, [lagu, larasAktif, onLarasMismatch]);

  const mulai = useCallback(() => {
    if (!lagu) return;
    setStatus("berjalan");
    setCurrentStepIndex(0);
    setSalahHitung(0);
    setLastWrongNote(null);
    setJustCorrect(false);
  }, [lagu]);

  const ulangi = useCallback(() => {
    if (!lagu) return;
    setStatus("berjalan");
    setCurrentStepIndex(0);
    setSalahHitung(0);
    setLastWrongNote(null);
    setJustCorrect(false);
  }, [lagu]);

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
    (noteSymbol: string) => {
      if (status !== "berjalan" || !lagu) return;

      const expectedNote = lagu.nada[currentStepIndex];

      if (noteSymbol === expectedNote) {
        // Nada Benar!
        setJustCorrect(true);
        setTimeout(() => setJustCorrect(false), 200);

        if (currentStepIndex + 1 >= lagu.nada.length) {
          // Lagu selesai
          setStatus("selesai");
        } else {
          // Lanjut ke nada berikutnya
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else {
        // Nada Salah: hitung salah dan berikan getaran mikro tanpa menghentikan permainan
        setSalahHitung((prev) => prev + 1);
        setLastWrongNote(noteSymbol);
        setTimeout(() => setLastWrongNote(null), 250);
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
