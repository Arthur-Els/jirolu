"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PadStrikeEvent {
  id: string;
  seq: number;
}

/**
 * Mengelola kumpulan ID tombol yang sedang menyala bersamaan (180 ms per tombol)
 * tanpa saling menimpa ketika beberapa tuts ditekan sekaligus.
 */
export function useActiveFlashIds(durationMs: number = 180) {
  const [activeIds, setActiveIds] = useState<ReadonlySet<string>>(() => new Set());
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const flashId = useCallback(
    (rawId: string) => {
      const id = rawId.toLowerCase();
      const existingTimer = timersRef.current.get(id);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      setActiveIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      const timer = setTimeout(() => {
        timersRef.current.delete(id);
        setActiveIds((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, durationMs);

      timersRef.current.set(id, timer);
    },
    [durationMs]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { activeIds, flashId };
}

/**
 * Memproses antrean event ketukan berurutan agar penekanan beberapa tuts sekaligus
 * semuanya memicu animasi 3D dan kilat tombol tanpa tertimpa React batching.
 */
export function useStrikeQueueEffect(
  strikeQueue: PadStrikeEvent[] | undefined,
  onStrike: (id: string) => void
) {
  const lastSeqRef = useRef(0);
  const onStrikeRef = useRef(onStrike);

  useEffect(() => {
    onStrikeRef.current = onStrike;
  }, [onStrike]);

  useEffect(() => {
    if (!strikeQueue || strikeQueue.length === 0) return;
    for (const strike of strikeQueue) {
      if (strike.seq > lastSeqRef.current) {
        lastSeqRef.current = strike.seq;
        onStrikeRef.current(strike.id);
      }
    }
  }, [strikeQueue]);
}
