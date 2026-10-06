"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { stopAllActiveSounds } from "../audio/audioEngine";

export interface RekamanItem {
  id: string;      // ID nada atau suara (misal "1", "dung", "gong-ageng")
  waktu: number;   // Selisih waktu sejak rekaman dimulai (milidetik)
}

export function useRekaman() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rekamanData, setRekamanData] = useState<RekamanItem[]>([]);
  const [durasiDetik, setDurasiDetik] = useState<number>(0);
  const [pesanInfo, setPesanInfo] = useState<string | null>(null);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Hentikan interval timer bila komponen dilepas
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      playbackTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Berhenti merekam atau berhenti memutar
  const berhenti = useCallback(() => {
    // 1. Jika sedang merekam
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);

    // 2. Jika sedang memutar
    playbackTimeoutsRef.current.forEach(clearTimeout);
    playbackTimeoutsRef.current = [];
    setIsPlaying(false);
    setActivePlayingId(null);
    stopAllActiveSounds(0.15);
  }, []);

  // Mulai merekam permainan
  const mulaiRekam = useCallback(() => {
    berhenti();
    setRekamanData([]);
    setDurasiDetik(0);
    setPesanInfo(null);
    startTimeRef.current = Date.now();
    setIsRecording(true);

    // Timer berjalan setiap detik
    timerIntervalRef.current = setInterval(() => {
      setDurasiDetik((prev) => {
        const next = prev + 1;
        // Batas maksimal 60 detik rekaman
        if (next >= 60) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setIsRecording(false);
          setPesanInfo("Batas maksimal rekaman 60 detik telah tercapai.");
          return 60;
        }
        return next;
      });
    }, 1000);
  }, [berhenti]);

  // Catat ketukan nada/suara saat sedang merekam
  const catatKetukan = useCallback(
    (id: string) => {
      if (!isRecording) return;
      const selisihWaktu = Date.now() - startTimeRef.current;
      setRekamanData((prev) => [...prev, { id, waktu: selisihWaktu }]);
    },
    [isRecording]
  );

  // Putar ulang rekaman yang sudah tersimpan
  const putar = useCallback(
    (onTriggerItem: (id: string) => void) => {
      if (rekamanData.length === 0 || isRecording || isPlaying) return;

      setIsPlaying(true);
      setPesanInfo(null);
      playbackTimeoutsRef.current = [];

      // Jadwalkan setiap ketukan sesuai selisih waktu aslinya
      rekamanData.forEach((item) => {
        const t = setTimeout(() => {
          onTriggerItem(item.id);
          setActivePlayingId(item.id);
          setTimeout(() => setActivePlayingId(null), 180);
        }, item.waktu);
        playbackTimeoutsRef.current.push(t);
      });

      // Jadwalkan akhir pemutaran setelah ketukan terakhir selesai
      const waktuTerakhir = Math.max(...rekamanData.map((d) => d.waktu), 0);
      const endTimeout = setTimeout(() => {
        setIsPlaying(false);
        setActivePlayingId(null);
      }, waktuTerakhir + 600);
      playbackTimeoutsRef.current.push(endTimeout);
    },
    [rekamanData, isRecording, isPlaying]
  );

  // Hapus rekaman
  const hapus = useCallback(() => {
    berhenti();
    setRekamanData([]);
    setDurasiDetik(0);
    setPesanInfo(null);
  }, [berhenti]);

  return {
    isRecording,
    isPlaying,
    adaRekaman: rekamanData.length > 0,
    jumlahKetukan: rekamanData.length,
    durasiDetik,
    pesanInfo,
    activePlayingId,
    mulaiRekam,
    berhenti,
    putar,
    hapus,
    catatKetukan,
  };
}
