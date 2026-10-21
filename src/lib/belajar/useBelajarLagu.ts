"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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

  // Jika lagu berganti, reset state pembelajaran lewat useEffect
  useEffect(() => {
    setStatus("belum_mulai");
    setCurrentStepIndex(0);
    setSalahHitung(0);
    setLastWrongNote(null);
    setJustCorrect(false);
  }, [lagu?.slug]);

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
  }, [lagu?.slug, lagu?.laras, larasAktif]);

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
